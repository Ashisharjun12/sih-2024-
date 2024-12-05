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
      console.log("FORM")
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
        // Prepare researcher data with correct structure from form submission
        const researcherData = {
          userId: user._id,
          
          // Personal Information
          personalInfo: {
            name: submission.formData.personalInfo.name,
            email: {
              address: user.email,
              verified: false
            },
            phone: {
              number: submission.formData.personalInfo.phone.number,
              verified: false
            },
            uniqueId: {
              type: submission.formData.personalInfo.uniqueId.type,
              number: submission.formData.personalInfo.uniqueId.number
            },
            fieldOfResearch: submission.formData.personalInfo.fieldOfResearch
          },

          // Academic Information
          academicInfo: {
            institution: submission.formData.academicInfo.institution,
            position: submission.formData.academicInfo.position,
            department: submission.formData.academicInfo.department,
            highestQualification: submission.formData.academicInfo.highestQualification,
            yearsOfExperience: submission.formData.academicInfo.yearsOfExperience
          },

          // Professional Credentials
          professionalCredentials: {
            orcid: submission.formData.professionalCredentials.orcid || "",
            googleScholar: submission.formData.professionalCredentials.googleScholar || "",
            researchGate: submission.formData.professionalCredentials.researchGate || ""
          },

          // Research Papers
          researchPapers: submission.formData.researchPapers?.map((paper: any) => ({
            title: paper.title,
            description: paper.description,
            images: paper.images || [],
            publicationDate: paper.publicationDate,
            doi: paper.doi,
            stage: "Completed"
          })) || [],

          // Ongoing Researches
          onGoingResearches: submission.formData.onGoingResearches?.map((research: any) => ({
            title: research.title,
            description: research.description,
            images: research.images || [],
            publicationDate: research.publicationDate,
            doi: research.doi,
            stage: research.stage
          })) || [],

          // Documents
          documents: {
            profilePicture: {
              public_id: submission.formData.files.profilePicture.public_id,
              secure_url: submission.formData.files.profilePicture.secure_url,
            },
            cv: {
              public_id: submission.formData.files.cv.public_id,
              secure_url: submission.formData.files.cv.secure_url,
            },
            _id: false
          }
        };

        // Create researcher profile
        const researcher = new Researcher(researcherData);
        await researcher.save();

        // Update user role
        user.role = "researcher";
        await user.save();

        // Add notification
        await addNotification({
          name: "Admin",
          message: "Your researcher application has been approved.",
          role: session.user.role!,
        }, user._id);

        // Save submission status
        await submission.save();

        return NextResponse.json({ message: "Researcher approved successfully" });

      } catch (error) {
        console.error("Error creating researcher profile:", error);
        return NextResponse.json(
          { error: "Failed to create researcher profile" },
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