import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";

// Add proper type for form data
interface ResearcherFormData {
  personalInfo: {
    name: string;
    email: { address: string; verified: boolean };
    phone: { number: string; verified: boolean };
    uniqueId: { type: string; number: string };
    fieldOfResearch: string[];
  };
  academicInfo: {
    institution: string;
    position: string;
    department: string;
    highestQualification: string;
    yearsOfExperience: number;
  };
  professionalCredentials: {
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
  };
  files: {
    profilePicture: {
      public_id: string;
      secure_url: string;
      originalName: string;
    };
    cv: {
      public_id: string;
      secure_url: string;
      originalName: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { formData } = await request.json() as { formData: ResearcherFormData };

    // Validate required fields
    if (!formData.files?.profilePicture || !formData.files?.cv) {
      return NextResponse.json(
        { error: "Profile picture and CV are required" },
        { status: 400 }
      );
    }

    // Create form submission
    const submission = new FormSubmission({
      userId: session.user.id,
      formType: "researcher",
      formData,
      status: "pending",
      userEmail: session.user.email!,
      userName: session.user.name!
    });

    await submission.save();

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting researcher form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
} 