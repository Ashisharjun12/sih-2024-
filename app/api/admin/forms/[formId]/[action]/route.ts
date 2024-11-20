import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendFormApprovalEmail, sendFormRejectionEmail } from "@/lib/utils/email";

export async function POST(
  request: Request,
  { params }: { params: { formId: string; action: "approve" | "reject" } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const submission = await FormSubmission.findById(params.formId);
    if (!submission) {
      return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
    }

    if (params.action === "approve") {
      // Update user role based on form type
      await User.findByIdAndUpdate(submission.userId, {
        role: submission.formType,
      });

      submission.status = "approved";
      await submission.save();

      // Send approval email
      await sendFormApprovalEmail(submission.userEmail, submission.formType);
    } else {
      submission.status = "rejected";
      await submission.save();

      // Send rejection email
      await sendFormRejectionEmail(submission.userEmail, submission.formType);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form action error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 