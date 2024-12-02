import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import User from "@/models/user.model";
import FundingAgency from "@/models/funding-agency.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: { formId: string; action: "approve" | "reject" } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason } = await request.json();

    await connectDB();

    // Find the form submission
    const submission = await FormSubmission.findById(params.formId);
    if (!submission) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Find the user
    const user = await User.findOne({ email: submission.userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update submission status
    submission.status = params.action === "approve" ? "approved" : "rejected";
    if (params.action === "reject") {
      submission.rejectionReason = reason;
      await submission.save();
    }

    // If approving, create funding agency profile and update user role
    if (params.action === "approve") {
      try {
        console.log("Form Submission Data:", JSON.stringify(submission, null, 2));

        // Prepare funding agency data
        const fundingAgencyData = {
          userId: user._id,
          owner: {
            fullName: submission.formData.owner.fullName,
            email: submission.formData.owner.email,
            phone: submission.formData.owner.phone,
            businessAddress: {
              physicalAddress: submission.formData.owner.businessAddress.physicalAddress,
            },
          },
          agencyDetails: submission.formData.agencyDetails,
          contactInformation: submission.formData.contactInformation,
          representatives: submission.formData.representatives,
          fundingPreferences: submission.formData.fundingPreferences,
          experience: submission.formData.experience,
          documentation: {
            registrationCertificate: submission.formData.documents.registrationCertificate,
            governmentApprovals: submission.formData.documents.governmentApprovals,
            addressProof: submission.formData.documents.addressProof,
            taxDocuments: submission.formData.documents.taxDocuments,
            portfolioDocument: submission.formData.documents.portfolioDocument,
          },
          status: "Active",
        };

        console.log("Processed Funding Agency Data:", JSON.stringify(fundingAgencyData, null, 2));

        // Create funding agency profile and update user
        const fundingAgencyProfile = await FundingAgency.create(fundingAgencyData);
        
        user.role = "fundingAgency";
        user.fundingAgencyProfile = fundingAgencyProfile._id;
        await user.save();

        submission.fundingAgencyProfile = fundingAgencyProfile._id;
        await submission.save();

      } catch (error) {
        console.error("Error creating funding agency profile:", error);
        return NextResponse.json({ 
          error: "Failed to create funding agency profile",
          details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
      }
    }

    // Create notification
    const notification = {
      title: params.action === "approve" ? "Application Approved" : "Application Rejected",
      message: params.action === "approve"
        ? `Your funding agency application has been approved. You can now access the funding agency dashboard.`
        : `Your funding agency application was rejected. ${reason || 'Please try again later.'}`,
      type: params.action === "approve" ? "success" : "error",
      createdAt: new Date(),
    };

    // Add notification to user
    user.notifications = user.notifications || [];
    user.notifications.push(notification);
    await user.save();

    return NextResponse.json({ 
      success: true,
      message: `Application ${params.action}d successfully`
    });

  } catch (error) {
    console.error("Form action error:", error);
    return NextResponse.json(
      { error: "Failed to process application" }, 
      { status: 500 }
    );
  }
} 