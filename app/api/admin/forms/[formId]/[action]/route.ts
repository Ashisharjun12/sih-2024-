import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addNotification } from "@/lib/notificationService";

export async function PATCH(
  req: Request,
  { params }: { params: { formId: string; action: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { formId, action } = params;

    // Find the form submission
    const submission = await FormSubmission.findById(formId);

    if (!submission) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    // Update submission status and user role based on form type
    if (action === "approve") {
      submission.status = "approved";

      // Update user role based on form type
      let newRole = "";
      switch (submission.formType) {
        case "startup":
          newRole = "startup";
          break;
        case "researcher":
          newRole = "researcher";
          break;
        case "ipr-professional":
          newRole = "ipr";
          break;
        default:
          newRole = submission.formType;
      }

      // Update user role
      const user = await User.findOneAndUpdate(
        { email: submission.userEmail },
        { role: newRole }
      );

      await addNotification({
        name: "Admin",
        message: `Your form has been approved for ${submission.formType}.`,
        role: session.user.role,
      }, user._id);


    } else if (action === "reject") {

      const user = await User.findOne({ email: submission.userEmail });
      submission.status = "rejected";
      await addNotification({
        name: "Admin",
        message: `Your form has been rejected.`,
        role: session.user.role,
      }, user._id);

    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    await submission.save();

    return NextResponse.json({
      message: `Form ${action}d successfully`,
      submission
    });

  } catch (error) {
    console.error(`Error ${params.action}ing form:`, error);
    return NextResponse.json(
      { error: `Failed to ${params.action} form` },
      { status: 500 }
    );
  }
} 