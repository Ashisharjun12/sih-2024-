import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
<<<<<<< HEAD:app/api/admin/forms/route.tsx
=======

>>>>>>> c692cade63db327f995b681c139bb32c82c59c0f:app/api/admin/forms/route.ts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch all form submissions
    const submissions = await FormSubmission.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    return NextResponse.json({ 
      success: true,
      submissions 
    });
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch form submissions" }, 
      { status: 500 }
    );
  }
}