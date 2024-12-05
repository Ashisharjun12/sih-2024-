import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import User from "@/models/user.model";
import Startup from "@/models/startup.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addNotification } from "@/lib/notificationService";

export async function POST(
  request: Request,
  { params }: { params: { formId: string; action: "approve" | "reject" } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      await addNotification({
        name: "Admin",
        message: "Your startup application has been rejected.",
        role: session.user.role!,
      }, user._id);

      await submission.save();
      return NextResponse.json({
        success: true,
        message: "Application rejected successfully"
      });
    }

    // Handle approval
    if (params.action === "approve") {
      try {
        // Prepare startup data with correct structure from form submission
        const startupData = {
          userId: user._id,
          
          // Owner Information
          owner: {
            fullName: submission.formData.owner.fullName || user.name,
            email: submission.formData.owner.email || user.email,
            phone: submission.formData.owner.phone,
            businessAddress: submission.formData.owner.businessAddress,
            dateOfBirth: submission.formData.owner.dateOfBirth,
            gender: submission.formData.owner.gender
          },

          // Startup Details
          startupDetails: {
            startupName: submission.formData.startupDetails.startupName,
            startupLogo: submission.formData.startupDetails.startupLogo,
            about: submission.formData.startupDetails.about,
            industries: submission.formData.startupDetails.industries,
            sectors: submission.formData.startupDetails.sectors,
            stage: submission.formData.startupDetails.stage,
            registrationNumber: submission.formData.startupDetails.registrationNumber,
            incorporationDate: submission.formData.startupDetails.incorporationDate,
            businessModel: submission.formData.startupDetails.businessModel,
            revenueModel: submission.formData.startupDetails.revenueModel,
            founders: submission.formData.startupDetails.founders || [],
            equitySplits: submission.formData.startupDetails.equitySplits || []
          },

          // Business Activities
          businessActivities: {
            missionAndVision: submission.formData.businessActivities.missionAndVision
          },

          // Legal and Compliance
          legalAndCompliance: {
            gstin: submission.formData.legalAndCompliance?.gstin,
            licenses: submission.formData.legalAndCompliance?.licenses || []
          },

          // Additional Info and Documents
          additionalInfo: {
            website: submission.formData.additionalInfo?.website,
            socialMedia: submission.formData.additionalInfo?.socialMedia || {},
            pitchDeck: submission.formData.additionalInfo?.pitchDeck,
            identityProof: submission.formData.additionalInfo?.identityProof,
            incorporationCertificate: submission.formData.additionalInfo?.incorporationCertificate
          },

          isActivelyFundraising: submission.formData.isActivelyFundraising || false
        };

        // Create startup profile
        const startup = new Startup(startupData);
        await startup.save();

        // Update user role and profile reference
        user.role = "startup";
        await user.save();

        // Update submission with profile reference
        await submission.save();

        // Add notification
        await addNotification({
          name: "Admin",
          message: "Your startup application has been approved.",
          role: session.user.role!,
        }, user._id);

        return NextResponse.json({ 
          success: true,
          message: "Startup profile created and application approved" 
        });

      } catch (error) {
        console.error("Error creating startup profile:", error);
        return NextResponse.json(
          { 
            error: "Failed to create startup profile",
            details: error instanceof Error ? error.message : "Unknown error"
          },
          { status: 500 }
        );
      }
    }

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