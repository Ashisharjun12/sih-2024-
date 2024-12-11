import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Researcher from "@/models/researcher.model";
import User from "@/models/user.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "researcher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get researcher profile with populated research papers
    const researcher = await Researcher.findOne({ userId: session.user.id })
    .populate({ path: "researchPapers", populate: { path: "researcher" } })
    .populate({ path: "onGoingResearches", populate: { path: "researcher" } })
    .populate({ path: "allIPR.ipr" })
    .populate({ path: "allIPR.iprProfessional" });
    console.log("researcher singke",researcher);

    if (!researcher) {
      return NextResponse.json(
        { error: "Researcher profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: researcher
    });

  } catch (error) {
    console.error("Error fetching researcher profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
