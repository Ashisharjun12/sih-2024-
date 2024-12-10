import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResearchPaper from "@/models/research.model";
import Researcher from "@/models/researcher.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find researcher
    const researcher = await Researcher.findOne({ userId: session.user.id });
    if (!researcher) {
      return NextResponse.json(
        { error: "Researcher profile not found" },
        { status: 404 }
      );
    }

    // Get all papers (both research papers and ongoing research)
    const papers = await ResearchPaper.find({
      _id: { 
        $in: [...researcher.researchPapers, ...researcher.onGoingResearches] 
      }
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      papers
    });

  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch papers" },
      { status: 500 }
    );
  }
} 