import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Researcher from "@/models/researcher.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectDB();

    // Verify user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch researcher details
    const researcher = await Researcher.findById(params.id)
      .populate({ path: "researchPapers", populate: { path: "researcher" } })
      .populate({ path: "onGoingResearches", populate: { path: "researcher" } })
      .populate({ path: "allIPR.ipr" })
      .populate({ path: "allIPR.iprProfessional" });

    if (!researcher) {
      return NextResponse.json(
        { error: "Researcher not found" },
        { status: 404 }
      );
    }

    // Format the response to include necessary details
    const responseData = {
      id: researcher._id,
      userId: researcher.userId,
      personalInfo: researcher.personalInfo,
      academicInfo: researcher.academicInfo,
      professionalCredentials: researcher.professionalCredentials,
      documents: researcher.documents,
      researchPapers: researcher.researchPapers,
      onGoingResearches: researcher.onGoingResearches,
      allIPR: researcher.allIPR,
    };

    return NextResponse.json({ success: true, researcher: responseData });
  } catch (error) {
    console.error("Error fetching researcher:", error);
    return NextResponse.json(
      { error: "Failed to fetch researcher" },
      { status: 500 }
    );
  }
}
