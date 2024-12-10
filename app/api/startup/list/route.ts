import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch all startups with basic info
    const startups = await Startup.find({userId: session?.user.id}, {
      'startupDetails.startupName': 1,
      'startupDetails.startupLogo': 1,
      'startupDetails.industries': 1,
      'startupDetails.stage': 1,
      'startupDetails.businessModel': 1,
      'startupDetails.revenueModel': 1,
    }).lean();

    return NextResponse.json({
      success: true,
      startups: startups.map(startup => ({
        id: startup._id,
        name: startup.startupDetails?.startupName,
        logo: startup.startupDetails?.startupLogo?.secure_url,
        industries: startup.startupDetails?.industries,
        stage: startup.startupDetails?.stage,
        businessModel: startup.startupDetails?.businessModel,
        revenueModel: startup.startupDetails?.revenueModel,
      }))
    });

  } catch (error) {
    console.error("Error fetching startups:", error);
    return NextResponse.json(
      { error: "Failed to fetch startups" },
      { status: 500 }
    );
  }
} 