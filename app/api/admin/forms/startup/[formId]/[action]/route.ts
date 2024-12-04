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
    }

    // If approving, create startup profile and update user role
    if (params.action === "approve") {
      try {
        console.log("Form Submission Data:", JSON.stringify(submission, null, 2));

        // Extract startup details to avoid duplicate properties
        const {
          startupName,
          industry,
          stage,
          registrationNumber,
          incorporationDate,
          businessModel,
          revenueModel,
          founders,
          equitySplits,
          gstNumber,
          panNumber,
          cinNumber,
          msmeRegistration,
        } = submission.formData.startupDetails;

        // Prepare startup data with required fields and files
        const startupData = {
          userId: user._id,
          owner: {
            fullName: submission.formData.owner.fullName || user.name,
            email: submission.formData.owner.email || user.email,
            phone: submission.formData.owner.phone,
            businessAddress: submission.formData.owner.businessAddress,
            dateOfBirth: submission.formData.owner.dateOfBirth,
            gender: submission.formData.owner.gender,
          },
          startupDetails: {
            startupName,
            industry,
            stage,
            registrationNumber: registrationNumber || `REG-${Date.now()}`,
            incorporationDate,
            businessModel,
            revenueModel,
            founders,
            equitySplits,
            ownershipPercentage: 100,
            gstNumber,
            panNumber,
            cinNumber,
            msmeRegistration,
          },
          businessActivities: {
            missionAndVision: submission.formData.businessActivities.missionAndVision,
            intellectualProperty: submission.formData.businessActivities.intellectualProperty || [],
          },
          legalAndCompliance: {
            gstin: submission.formData.legalAndCompliance?.gstin,
            licenses: submission.formData.legalAndCompliance?.licenses || [],
            certifications: submission.formData.legalAndCompliance?.certifications || [],
            auditorDetails: submission.formData.legalAndCompliance?.auditorDetails || {},
          },
          supportAndNetworking: {
            supportRequested: submission.formData.supportAndNetworking?.supportRequested || [],
            mentorshipPrograms: submission.formData.supportAndNetworking?.mentorshipPrograms,
            potentialInvestors: submission.formData.supportAndNetworking?.potentialInvestors,
          },
          additionalInfo: {
            website: submission.formData.additionalInfo?.website,
            socialMedia: submission.formData.additionalInfo?.socialMedia || {},
            pitchDeck: submission.files?.pitchDeck || {},
            identityProof: submission.files?.identityProof || {},
            businessPlan: submission.files?.businessPlan || {},
            financialProjections: submission.files?.financialProjections || {},
            incorporationCertificate: submission.files?.incorporationCertificate || {},
            // documents: [
            //   submission.files?.identityProof && {
            //     public_id: submission.files.identityProof.public_id,
            //     secure_url: submission.files.identityProof.secure_url,
            //   },
            //   submission.files?.businessPlan && {
            //     public_id: submission.files.businessPlan.public_id,
            //     secure_url: submission.files.businessPlan.secure_url,
            //   },
            //   submission.files?.financialProjections && {
            //     public_id: submission.files.financialProjections.public_id,
            //     secure_url: submission.files.financialProjections.secure_url,
            //   },
            //   submission.files?.incorporationCertificate && {
            //     public_id: submission.files.incorporationCertificate.public_id,
            //     secure_url: submission.files.incorporationCertificate.secure_url,
            //   },
            // ].filter(Boolean),
          },
        };


        // Create startup profile and update user
        const startupProfile = await Startup.create(startupData);

        user.role = "startup";
        user.startupProfile = startupProfile._id;
        await user.save();

        submission.startupProfile = startupProfile._id;
        await submission.save();
        await addNotification({
          name: "Admin",
          message: "Your startup application has been approved.",
          role: session.user.role!,
        }, user._id);

      } catch (error) {
        console.error("Error creating startup profile:", error);
        return NextResponse.json({
          error: "Failed to create startup profile",
          details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
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