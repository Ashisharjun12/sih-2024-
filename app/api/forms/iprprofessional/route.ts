import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.json();
    console.log("Received form data:", formData); // Debug log

    // Extract file data
    const files = {
      identityProof: formData?.files?.identityProof,
      businessPlan: formData?.files?.businessPlan,
      pitchDeck: formData?.files?.pitchDeck,
      financialProjections: formData?.files?.financialProjections,
      incorporationCertificate: formData?.files?.incorporationCertificate,
    };

    // Remove files from formData to avoid duplication
    const { files: _, ...restFormData } = formData;

    // Create form submission
    const submission = await FormSubmission.create({
      userId: session.user.id,
      formType: "iprProfessional",
      formData: restFormData,
      status: "pending",
      userEmail: session.user.email,
      userName: session.user.name,
      files,
      submittedAt: new Date(),
    });

    console.log("Created submission:", submission); // Debug log

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      submission
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
} 