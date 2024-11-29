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

    console.log("Received form data:", formData);

    // Add personal details and common fields
    const enrichedFormData = {
      ...formData,
      owner: {
        fullName: session.user.name,
        email: session.user.email,
        userId: session.user.id,
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
      // Add any missing fields with default values
      businessActivities: {
        ...formData.businessActivities,
        intellectualProperty: formData.businessActivities?.intellectualProperty || [],
      },
      legalAndCompliance: {
        ...formData.legalAndCompliance,
        licenses: formData.legalAndCompliance?.licenses || [],
        certifications: formData.legalAndCompliance?.certifications || [],
        auditorDetails: {
          name: "",
          firm: "",
          contact: "",
          email: "",
          registrationNumber: "",
          ...formData.legalAndCompliance?.auditorDetails,
        },
      },
      supportAndNetworking: {
        ...formData.supportAndNetworking,
        supportRequested: formData.supportAndNetworking?.supportRequested || [],
        mentorshipPrograms: formData.supportAndNetworking?.mentorshipPrograms || "",
        potentialInvestors: formData.supportAndNetworking?.potentialInvestors || "",
      },
      additionalInfo: {
        ...formData.additionalInfo,
        website: formData.additionalInfo?.website || "",
        socialMedia: {
          linkedIn: "",
          twitter: "",
          facebook: "",
          ...formData.additionalInfo?.socialMedia,
        },
      },
      files: formData.files || {},
    };

    console.log("Enriched form data:", enrichedFormData);

    // Create form submission
    const submission = await FormSubmission.create({
      userId: session.user.id,
      formType: "startup",
      formData: enrichedFormData,
      status: "pending",
      userEmail: session.user.email     ,
      userName: session.user.name,
      files: enrichedFormData.files,
      submittedAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        submissionType: "new_startup",
        source: "startup_dashboard"
      }
    });

    console.log("Created submission:", submission);

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