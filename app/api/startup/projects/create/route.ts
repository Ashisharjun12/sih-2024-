import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Startup from "@/models/startup.model";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log("Unauthorized: No session found");
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    await connectDB();

    // Get existing startup to get owner details
    const userStartup = await Startup.findOne({ userId: session.user.id });
    console.log("User's startup found:", userStartup);

    // Get form data
    const formData = await request.json();
    console.log("Form data received:", formData);

    // Create submission data with owner details from existing startup
    const submissionData = {
      userId: session.user.id,
      formType: "startup",
      formData: {
        owner: userStartup?.owner || {
          fullName: session.user.name,
          email: session.user.email,
          phone: "",
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
        startupDetails: formData.startupDetails,
        businessActivities: formData.businessActivities,
        legalAndCompliance: formData.legalAndCompliance,
        supportAndNetworking: formData.supportAndNetworking,
        additionalInfo: formData.additionalInfo,
      },
      status: "pending",
      userEmail: session.user.email,
      userName: session.user.name,
      files: formData.files || {},
      submittedAt: new Date(),
      metadata: {
        submissionType: "new_startup",
        source: "startup_dashboard"
      }
    };

    console.log("Creating submission with data:", submissionData);

    // Create form submission
    const submission = await FormSubmission.create(submissionData);

    console.log("Created form submission:", submission);

    return NextResponse.json({ 
      success: true,
      message: "Your startup registration has been submitted for review",
      submission
    }, { status: 201 });

  } catch (error) {
    console.error("Error in form submission:", error);
    return NextResponse.json(
      { 
        error: "Failed to submit startup registration",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
} 