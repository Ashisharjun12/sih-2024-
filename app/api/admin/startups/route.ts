import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch all startups
    const startups = await Startup.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    return NextResponse.json({ 
      success: true,
      startups 
    });
  } catch (error) {
    console.error("Error fetching startups:", error);
    return NextResponse.json(
      { error: "Failed to fetch startups" }, 
      { status: 500 }
    );
  }
}