import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface FormSubmissionResponse {
  success: boolean;
  message: string;
  submission: any;
}

export async function POST(request: Request): Promise<NextResponse<FormSubmissionResponse>> {
  try {
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" } as any, 
        { status: 401 }
      );
    }

    await connectDB();
    const formData = await request.json();

    const submission = await FormSubmission.create({
      userId: session.user.id,
      formType: "fundingAgency",
      formData: formData.formData,
      status: "pending",
      userEmail: session.user.email,
      userName: session.user.name,
      submittedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: "Form submitted successfully",
      submission 
    });
  } catch (error: unknown) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit form" } as any, 
      { status: 500 }
    );
  }
} 