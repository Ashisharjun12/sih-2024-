import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get("id");

    if (!submissionId) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    await connectDB();

    // Find and delete the submission
    const deletedSubmission = await FormSubmission.findByIdAndDelete(submissionId);

    if (!deletedSubmission) {
      return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Form submission deleted successfully" 
    });
  } catch (error) {
    console.error("Delete form submission error:", error);
    return NextResponse.json(
      { error: "Failed to delete form submission" },
      { status: 500 }
    );
  }
} 