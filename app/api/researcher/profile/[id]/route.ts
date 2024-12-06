import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Researcher from "@/models/researcher.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const researcher = await Researcher.findById(params.id)
      .populate('researchPapers')
      .populate('onGoingResearches');

    console.log("researchernnnn", researcher);


    if (!researcher) {
      return NextResponse.json(
        { error: "Researcher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      researcher
    });

  } catch (error) {
    console.error("Error fetching researcher:", error);
    return NextResponse.json(
      { error: "Failed to fetch researcher" },
      { status: 500 }
    );
  }
} 