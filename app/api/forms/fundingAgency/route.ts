import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    console.log("Handling funding agency form submission...");

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("Unauthorized: No session found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Session user:", {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    });

    await connectDB();

    // Get form data from request
    const { formData } = await request.json();
    console.log("Received form data:", JSON.stringify(formData, null, 2));

    // Validate required fields based on the new model structure
    if (!formData.agencyDetails?.name ||
      !formData.agencyDetails?.registrationNumber ||
      !formData.agencyDetails?.type ||
      !formData.contactInformation?.officialEmail ||
      !formData.contactInformation?.phoneNumber ||
      !formData.fundingPreferences?.minimumInvestment) {
      console.log("Validation failed - Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create submission data with the new structure
    const submissionData = {
      userId: session.user.id,
      formType: "fundingAgency",
      formData: {
        agencyDetails: {
          name: formData.agencyDetails.name,
          registrationNumber: formData.agencyDetails.registrationNumber,
          type: formData.agencyDetails.type,
          establishmentDate: formData.agencyDetails.establishmentDate,
          description: formData.agencyDetails.description,
          logo:formData.documentation?.logo,
        },
        contactInformation: {
          officialAddress: formData.contactInformation.officialAddress,
          officialEmail: formData.contactInformation.officialEmail,
          phoneNumber: formData.contactInformation.phoneNumber,
          websiteURL: formData.contactInformation.websiteURL,
        },
        representatives: formData.representatives || [],
        fundingPreferences: {
          minimumInvestment: formData.fundingPreferences.minimumInvestment,
          preferredStages: formData.fundingPreferences.preferredStages || [],
          fundingTypes: formData.fundingPreferences.fundingTypes || [],
          preferredSectors: formData.fundingPreferences.preferredSectors || [],
          preferredIndustries: formData.fundingPreferences.preferredIndustries || [],
        },
        documentation: {
          registrationCertificate: formData.documentation?.registrationCertificate,
          governmentApprovals: formData.documentation?.governmentApprovals,
          taxDocuments: formData.documentation?.taxDocuments,
        },
        experience: {
          yearsOfOperation: formData.experience.yearsOfOperation,
          totalInvestments: formData.experience.totalInvestments,
          averageTicketSize: formData.experience.averageTicketSize,
        },
        activeInvestments: formData.activeInvestments || []
      },
      status: "pending",
      userEmail: session.user.email!,
      userName: session.user.name!,
      submittedAt: new Date(),
    };

    console.log("Creating form submission with data:", JSON.stringify(submissionData, null, 2));

    const newSubmission = await FormSubmission.create(submissionData);

    console.log("Form submission created:", {
      id: newSubmission._id,
      status: newSubmission.status,
      createdAt: newSubmission.createdAt
    });

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      submission: {
        id: newSubmission._id,
        status: newSubmission.status,
        submittedAt: newSubmission.submittedAt
      }
    });

  } catch (error) {
    console.error("Error in form submission:", error);
    return NextResponse.json(
      {
        error: "Failed to submit form",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 