import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Researcher from "@/models/researcher.model";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current researcher's profile with populated research papers
    const myProfile = await Researcher.findOne({
      'email.address': session.user.email
    })
    .populate('researchPapers')
    .populate('onGoingResearches');

    console.log("My Profile with papers:", {
      researchPapers: myProfile?.researchPapers,
      onGoingResearches: myProfile?.onGoingResearches
    });

    // Get other researchers
    const researchers = await Researcher.find({
      'email.address': { $ne: session.user.email }
    });

    return NextResponse.json({
      success: true,
      myProfile,
      researchers
    });

  } catch (error) {
    console.error("Error fetching researchers:", error);
    return NextResponse.json(
      { error: "Failed to fetch researchers" },
      { status: 500 }
    );
  }
} 