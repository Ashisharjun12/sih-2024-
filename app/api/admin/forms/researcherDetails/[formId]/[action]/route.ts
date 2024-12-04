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
    console.log("CALEED")
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

<<<<<<< HEAD
=======
    console.log("ADMIN");
>>>>>>> 904f2845dbac69348a87e8e4bb91e87ea55a7012
    await connectDB();

    // Find the form submission
    const submission = await FormSubmission.findById(params.formId);
    if (!submission) {
      console.log("FORM")
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    console.log(" SUBMISSION FIND LOG ", submission);

    // Find the user
    const user = await User.findOne({ email: submission.userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update submission status
    submission.status = params.action === "approve" ? "approved" : "rejected";
    if (params.action === "reject") {
<<<<<<< HEAD
      await addNotification({
        name: "Admin",
        message: "Your researcher application has been rejected.",
        role: session.user.role!,
      }, user._id);
=======

      // Send rejection email
      await sendEmail({
        to: user.email,
        subject: "Researcher Application Status Update",
        html: getRejectionEmailTemplate(user.name, "Researcher")
      });
>>>>>>> 904f2845dbac69348a87e8e4bb91e87ea55a7012
    }

    // If approving, create researcher profile and update user role
    if (params.action === "approve") {
      try {
        // Prepare researcher data with correct structure
        console.log("Files from submission:", submission.files);

        

        

        const researcherData = {
          userId: user._id,
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
          academicInfo: {
            institution: submission.formData.academicInfo.institution,
            position: submission.formData.academicInfo.position,
            department: submission.formData.academicInfo.department,
            highestQualification: submission.formData.academicInfo.highestQualification,
            yearsOfExperience: submission.formData.academicInfo.yearsOfExperience
          },
          researchDetails: {
            researchTopic: submission.formData.researchDetails.researchTopic,
            expertiseAreas: submission.formData.researchDetails.expertiseAreas || [],
            ongoingProjects: submission.formData.researchDetails.ongoingProjects || []
          },
          professionalCredentials: {
            publicationNumber: submission.formData.professionalCredentials.publicationNumber || 0,
            researchIds: {
              orcid: submission.formData.professionalCredentials.researchIds?.orcid || '',
              googleScholar: submission.formData.professionalCredentials.researchIds?.googleScholar || '',
              researchGate: submission.formData.professionalCredentials.researchIds?.researchGate || ''
            },
            publications: submission.formData.professionalCredentials.publications || [],
            fundingAgency: submission.formData.professionalCredentials.fundingAgency || '',
            achievements: submission.formData.professionalCredentials.achievements || []
          },
          interests: {
            preferredCollaboration: submission.formData.interests?.preferredCollaboration || "BOTH",
            willingToMentor: submission.formData.interests?.willingToMentor || false
          },
          
          documents:{
            profilePicture: {
              public_id: submission.files?.profilePicture?.public_id || '',
              secure_url: submission.files?.profilePicture?.secure_url || '',
              originalName: submission.files?.profilePicture?.originalName || '',
            },
            cv: {
              public_id: submission.files?.cv?.public_id || '',
              secure_url: submission.files?.cv?.secure_url || '',
              originalName: submission.files?.cv?.originalName || '',
            },
            identityProof: {
              public_id: submission.files?.identityProof?.public_id || '',
              secure_url: submission.files?.identityProof?.secure_url || '',
              originalName: submission.files?.identityProof?.originalName || '',
            }
          }
        };

        console.log("Final researcher data:", researcherData);

        // Create researcher profile  
        const researcherProfile = await Researcher.create(researcherData);
        console.log("Created researcher profile with documents:", researcherProfile);

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

<<<<<<< HEAD
    return NextResponse.json({
=======
    // Create notification
    const notification = {
      title: params.action === "approve" ? "Application Approved" : "Application Rejected",
      message: params.action === "approve"
        ? "Your researcher application has been approved"
        : `Your application was rejected. ${reason || 'Please contact support for more information.'}`,
      type: params.action === "approve" ? "success" : "error",
      createdAt: new Date()
    };

    // Add notification to user
    if (!user.notifications) {
      user.notifications = [];
    }
    user.notifications.push(notification);
    await user.save();

    return NextResponse.json({ 
>>>>>>> 904f2845dbac69348a87e8e4bb91e87ea55a7012
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