import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResearchPaper from "@/models/research.model";
import Researcher from "@/models/researcher.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isFree, price } = await request.json();

    // Validate the price if not free
    if (!isFree && (!price || price <= 0)) {
      return NextResponse.json(
        { error: "Please provide a valid price for paid papers" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the paper
    const paper = await ResearchPaper.findById(params.id);
    if (!paper) {
      return NextResponse.json(
        { error: "Research paper not found" },
        { status: 404 }
      );
    }

    // Find researcher and validate ownership
    const researcher = await Researcher.findOne({ userId: session.user.id });
    if (!researcher) {
      return NextResponse.json(
        { error: "Researcher profile not found" },
        { status: 404 }
      );
    }

    // // Check if paper exists in either researchPapers or onGoingResearches
    // const hasAccess = 
    //   researcher.researchPapers.includes(paper._id) || 
    //   researcher.onGoingResearches.includes(paper._id);

    // if (!hasAccess) {
    //   return NextResponse.json(
    //     { error: "Not authorized to publish this paper" },
    //     { status: 403 }
    //   );
    // }

    // Update paper with publish settings
    const updates = {
      isPublished: true,
      isFree: isFree,
      price: isFree ? undefined : price,
      publishedAt: new Date()
    };

    const updatedPaper = await ResearchPaper.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    );

    await researcher.save();
    await updatedPaper.save();

    return NextResponse.json({
      success: true,
      message: "Research paper published successfully",
      paper: updatedPaper
    });

  } catch (error) {
    console.error("Error publishing paper:", error);
    return NextResponse.json(
      { error: "Failed to publish paper" },
      { status: 500 }
    );
  }
} 