import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import IPRProfessional from "@/models/ipr-professional.model";
import User from "@/models/user.model";
// import { sendMail } from "@/lib/mail";

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
    //   await sendMail({
    //     to: body.userEmail,
    //     subject: "IPR Professional Application Approved",
    //     html: `
    //       <h1>Congratulations ${body.userName}!</h1>
    //       <p>Your application to become an IPR Professional has been approved.</p>
    //       <p>You can now log in to your account with your new role and start reviewing IPR applications.</p>
    //       <p>Thank you for joining our platform!</p>
    //     `
    //   });
    } else {
      // Send rejection email
    //   await sendMail({
    //     to: body.userEmail,
    //     subject: "IPR Professional Application Status",
    //     html: `
    //       <h1>Dear ${body.userName},</h1>
    //       <p>We regret to inform you that your IPR Professional application has been rejected.</p>
    //       ${body.reason ? `<p>Reason: ${body.reason}</p>` : ''}
    //       <p>You may submit a new application after addressing the concerns.</p>
    //       <p>Thank you for your interest in our platform.</p>
    //     `
    //   });
    }

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
