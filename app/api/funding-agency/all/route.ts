import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FundingAgency from "@/models/funding-agency.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all funding agencies
    const agencies = await FundingAgency.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      agencies
    });

  } catch (error) {
    console.error("Error fetching funding agencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch funding agencies" },
      { status: 500 }
    );
  }
} 