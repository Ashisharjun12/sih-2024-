import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import IPRProfessional from "@/models/ipr-professional.model";
import User from "@/models/user.model";
import { addNotification } from "@/lib/notificationService";


export async function POST(
  req: NextRequest,
  { params }: { params: { formId: string; action: "approve" | "reject" } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { formId, action } = params;
    // Find the form submission
    const submission = await FormSubmission.findById(formId);
    if (!submission) {
      return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
    }

    // Update submission status
    submission.status = action === "approve" ? "approved" : "rejected";
    await submission.save();

    if (action === "approve") {
      // Create IPR Professional record
      const iprProfessional = new IPRProfessional({
        name: submission.formData.name,
        email: submission.formData.email,
        userId: submission.userId,
        metaMaskAccount: submission.formData.walletAddress,
        certifications: submission.formData.certifications,
      });
      await iprProfessional.save();

      // Update user role
      const user = await User.findByIdAndUpdate(submission.userId, {
        role: "iprProfessional"
      });

      await addNotification({
        name: "Admin",
        message: "Your IPR Professional application has been approved.",
        role: session.user.role!,
      }, user._id);
    }

    else {
      const user = await User.findById(submission.userId);

      await addNotification({
        name: "Admin",
        message: "Your IPR Professional application has been rejected.",
        role: session.user.role!,
      }, user._id);

      return NextResponse.json({
        success: true,
        message: `Application ${action}ed successfully`
      });
    }
  } catch (error) {
    console.error(`Error ${params.action}ing IPR Professional application:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
