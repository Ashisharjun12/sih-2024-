import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import IPRProfessional from "@/models/ipr-professional.model";
import User from "@/models/user.model";
import { sendEmail, getApprovalEmailTemplate, getRejectionEmailTemplate } from "@/lib/utils/email";

interface RequestBody {
  reason?: string;
  userEmail: string;
  formType: string;
  userName: string;
}

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
    const body: RequestBody = await req.json();

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
        certifications: submission.formData.certifications,
      });
      await iprProfessional.save();

      // Update user role
      await User.findByIdAndUpdate(submission.userId, {
        role: "iprProfessional"
      });

      // Send approval email
      await sendEmail({
        to: body.userEmail,
        subject: "IPR Professional Application Approved",
        html: getApprovalEmailTemplate(body.userName, "IPR Professional")
      });
    } else {
      // Send rejection email
      await sendEmail({
        to: body.userEmail,
        subject: "IPR Professional Application Status Update",
        html: getRejectionEmailTemplate(body.userName, "IPR Professional")
      });
    }

    // Create notification
    const notification = {
      title: action === "approve" ? "Application Approved" : "Application Rejected",
      message: action === "approve"
        ? "Your IPR Professional application has been approved"
        : `Your application was rejected. ${body.reason || 'Please contact support for more information.'}`,
      type: action === "approve" ? "success" : "error",
      createdAt: new Date()
    };

    // Add notification to user
    await User.findByIdAndUpdate(submission.userId, {
      $push: { notifications: notification }
    });

    return NextResponse.json({
      success: true,
      message: `Application ${action}ed successfully`
    });

  } catch (error) {
    console.error(`Error ${params.action}ing IPR Professional application:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
