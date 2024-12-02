import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface FormSubmissionResponse {
  success: boolean;
  message: string;
  submission: any; // Replace with proper type from your FormSubmission model
}

export async function POST(request: Request): Promise<NextResponse<FormSubmissionResponse>> {
  try {
    console.log("Received funding agency form submission request");
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("Unauthorized: No session found");
      return NextResponse.json(
        { error: "Unauthorized" } as any, 
        { status: 401 }
      );
    }

    console.log("Authenticated user:", {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    });

    await connectDB();
    const formData = await request.json();
    
    console.log("Received form data:", {
      formType: formData.formType,
      agencyDetails: formData.formData.agencyDetails,
      contactInfo: formData.formData.contactInformation,
      representatives: formData.formData.representatives,
      fundingPreferences: formData.formData.fundingPreferences,
      experience: formData.formData.experience,
      documents: formData.formData.documents
    });

    const submission = await FormSubmission.create({
      userId: session.user.id,
      formType: "fundingAgency",
      formData: formData.formData,
      status: "pending",
      userEmail: session.user.email,
      userName: session.user.name,
      submittedAt: new Date(),
    });

    console.log("Created funding agency submission:", {
      id: submission._id,
      userId: submission.userId,
      status: submission.status,
      submittedAt: submission.submittedAt,
      documents: Object.keys(formData.formData.documents || {})
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