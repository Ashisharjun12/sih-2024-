import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import ResearchPaper from "@/models/research.model";

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

    const paper = await ResearchPaper.findById(params.id);
    
    if (!paper) {
      return NextResponse.json({ error: "Research paper not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paper
    });

  } catch (error) {
    console.error("Error fetching research paper:", error);
    return NextResponse.json(
      { error: "Failed to fetch research paper" },
      { status: 500 }
    );
  }
} 