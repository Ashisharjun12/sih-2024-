import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import User from "@/models/user.model";
import FundingAgency from "@/models/funding-agency.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addNotification } from "@/lib/notificationService";

export async function POST(
  request: Request,
  { params }: { params: { formId: string; action: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { formId, action } = params;

    // Find the form submission
    const submission = await FormSubmission.findById(formId);
    if (!submission) {
      console.log("Form not found:", formId);
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Find the user
    const user = await User.findOne({ email: submission.userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update submission status
    submission.status = action === "approve" ? "approved" : "rejected";
    
    if (action === "reject") {
      await addNotification({
        name: "Admin",
        message: "Your funding agency application has been rejected.",
        role: session.user.role!,
      }, user._id);
      await submission.save();
      return NextResponse.json({
        success: true,
        message: "Application rejected successfully"
      });
    }

    // If approving, create funding agency profile
    if (action === "approve") {
      try {
        // Prepare funding agency data from form submission
        const fundingAgencyData = {
          userId: user._id,
          agencyDetails: {
            name: submission.formData.agencyDetails.name,
            registrationNumber: submission.formData.agencyDetails.registrationNumber,
            type: submission.formData.agencyDetails.type,
            establishmentDate: new Date(submission.formData.agencyDetails.establishmentDate),
            description: submission.formData.agencyDetails.description,
          },
          contactInformation: {
            officialAddress: submission.formData.contactInformation.officialAddress,
            officialEmail: submission.formData.contactInformation.officialEmail,
            phoneNumber: submission.formData.contactInformation.phoneNumber,
            websiteURL: submission.formData.contactInformation.websiteURL,
          },
          representatives: submission.formData.representatives.map((rep: any) => ({
            name: rep.name,
            designation: rep.designation,
            email: rep.email,
            phone: rep.phone,
          })),
          fundingPreferences: {
            minimumInvestment: Number(submission.formData.fundingPreferences.minimumInvestment),
            preferredStages: submission.formData.fundingPreferences.preferredStages,
            fundingTypes: submission.formData.fundingPreferences.fundingTypes,
            preferredSectors: submission.formData.fundingPreferences.preferredSectors,
            preferredIndustries: submission.formData.fundingPreferences.preferredIndustries,
          },
          documentation: {
            registrationCertificate: submission.formData.documentation.registrationCertificate,
            governmentApprovals: submission.formData.documentation.governmentApprovals,
            taxDocuments: submission.formData.documentation.taxDocuments,
          },
          experience: {
            yearsOfOperation: Number(submission.formData.experience.yearsOfOperation),
            totalInvestments: Number(submission.formData.experience.totalInvestments),
            averageTicketSize: Number(submission.formData.experience.averageTicketSize),
          },
          activeInvestments: submission.formData.activeInvestments || []
        };

        console.log("Creating funding agency with data:", fundingAgencyData);

        // Create funding agency profile
        const fundingAgency = await FundingAgency.create(fundingAgencyData);

        // Update user role
        user.role = "fundingAgency";
        await user.save();

        // Add notification
        await addNotification({
          name: "Admin",
          message: "Your funding agency application has been approved.",
          role: session.user.role!,
        }, user._id);

        // Save submission
        await submission.save();

        return NextResponse.json({
          success: true,
          message: "Funding agency profile created and application approved"
        });

      } catch (error) {
        console.error("Error creating funding agency profile:", error);
        return NextResponse.json(
          { 
            error: "Failed to create funding agency profile",
            details: error instanceof Error ? error.message : "Unknown error"
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${action}d successfully`
    });

  } catch (error) {
    console.error("Form action error:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
} 