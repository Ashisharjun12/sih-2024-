import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import User from "@/models/user.model";
import Researcher from "@/models/researcher.model";
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
        message: "Your researcher application has been rejected.",
        role: session.user.role!,
      }, user._id);
    }

    // If approving, create researcher profile and update user role
    if (params.action === "approve") {
      try {
        // Prepare researcher data with correct structure
        const researcherData = {
          userId: user._id,
          personalInfo: {
            name: submission.formData.personalInfo.name,
            email: {
              address: user.email,
              verified: true
            },
            phone: {
              number: submission.formData.personalInfo.phone.number,
              verified: submission.formData.personalInfo.phone.verified || false
            },
            uniqueId: {
              type: submission.formData.personalInfo.uniqueId.type,
              number: submission.formData.personalInfo.uniqueId.number
            },
            fieldOfResearch: submission.formData.personalInfo.fieldOfResearch
          },
          academicInfo: submission.formData.academicInfo,
          researchDetails: {
            researchTopic: submission.formData.researchDetails.researchTopic,
            expertiseAreas: submission.formData.researchDetails.expertiseAreas || [],
            ongoingProjects: submission.formData.researchDetails.ongoingProjects || []
          },
          professionalCredentials: {
            publicationNumber: submission.formData.professionalCredentials.publicationNumber || 0,
            researchIds: submission.formData.professionalCredentials.researchIds || {},
            publications: submission.formData.professionalCredentials.publications || [],
            fundingAgency: submission.formData.professionalCredentials.fundingAgency || '',
            achievements: submission.formData.professionalCredentials.achievements || []
          },
          interests: submission.formData.interests || {
            preferredCollaboration: "BOTH",
            willingToMentor: false
          }
        };

        // Create researcher profile
        const researcherProfile = await Researcher.create(researcherData);

        // Update user role and link researcher profile
        user.role = "researcher";
        user.researcherProfile = researcherProfile._id;
        await user.save();

        // Update submission with researcher profile reference
        submission.researcherProfile = researcherProfile._id;
        await submission.save();

        await addNotification({
          name: "Admin",
          message: "Your researcher application has been approved.",
          role: session.user.role!,
        }, user._id);

      } catch (error) {
        console.error("Error creating researcher profile:", error);
        return NextResponse.json({
          error: "Failed to create researcher profile"
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