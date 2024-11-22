import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail, getApprovalEmailTemplate, getRejectionEmailTemplate } from "@/lib/utils/email";

export async function POST(
  request: Request,
  { params }: { params: { formId: string; action: "approve" | "reject" } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reason, userEmail, formType, userName } = body;

    if (!userEmail || !formType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Find submission
    const submission = await FormSubmission.findById(params.formId);
    if (!submission) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update submission status
    submission.status = params.action === "approve" ? "approved" : "rejected";
    if (params.action === "reject" && reason) {
      submission.rejectionReason = reason;
    }
    await submission.save();

    // Update user role if approved
    if (params.action === "approve") {
      user.role = formType.toLowerCase();
      await user.save();
    }

    // Send email notification
    try {
      const emailTemplate = params.action === "approve" 
        ? getApprovalEmailTemplate(userName || "User", formType)
        : getRejectionEmailTemplate(userName || "User", formType, reason || "No reason provided");

      await sendEmail({
        to: userEmail,
        subject: params.action === "approve" 
          ? "Your Application has been Approved!" 
          : "Application Status Update",
        html: emailTemplate,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue execution even if email fails
    }

    // Add notification to user
    const notification = {
      title: params.action === "approve" ? "Application Approved" : "Application Rejected",
      message: params.action === "approve"
        ? `Your ${formType} application has been approved. You can now access the dashboard.`
        : `Your ${formType} application was rejected. Reason: ${reason}`,
    };

    user.notifications = user.notifications || [];
    user.notifications.push(notification);
    await user.save();

    return NextResponse.json({ 
      success: true,
      message: `Application ${params.action}d successfully`
    });

  } catch (error) {
    console.error("Form action error:", error);
    return NextResponse.json(
      { error: "Failed to process application" }, 
      { status: 500 }
    );
  }
} 