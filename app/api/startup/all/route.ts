import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const startups = await Startup.find({ 
      isActivelyFundraising: true 
    }).select('userId startupDetails businessActivities isActivelyFundraising');

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