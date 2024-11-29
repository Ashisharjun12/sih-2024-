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

    // Add personal details and common fields
    const enrichedFormData = {
      ...formData,
      owner: {
        fullName: session.user.name,
        email: session.user.email,
        userId: session.user.id,
        // Add other default owner fields
        businessAddress: {
          physicalAddress: "",
          city: "",
          state: "",
          pincode: "",
        },
        dateOfBirth: "",
        gender: "Male",
        identityProof: {
          type: "Aadhar",
          number: "",
        },
      },
      // Add any other common fields that should be same for all startups
      supportAndNetworking: {
        supportRequested: [],
        mentorshipPrograms: "",
        potentialInvestors: "",
      },
    };

    // Create form submission
    const submission = await FormSubmission.create({
      userId: session.user.id,
      formType: "startup",
      formData: enrichedFormData,
      status: "pending",
      userEmail: session.user.email,
      userName: session.user.name,
      submittedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true,
      message: "Your startup registration has been submitted for review",
      submission
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting startup registration:", error);
    return NextResponse.json(
      { error: "Failed to submit startup registration" }, 
      { status: 500 }
    );
  }
} 