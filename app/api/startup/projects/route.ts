import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    await connectDB();

    // Find all startups associated with the user
    const startups = await Startup.find({ userId: session.user.id })
      .select("startupDetails businessActivities additionalInfo createdAt")
      .sort({ createdAt: -1 });

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