import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResearchPaper from "@/models/research.model";
import Researcher from "@/models/researcher.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);

    // Find all published papers and papers where the user is the researcher
    const papers = await ResearchPaper.find({
      $or: [
        { isPublished: true },
        ...(session?.user?.email ? [{ 'researcher.email.address': session.user.email }] : [])
      ]
    }).lean();

    // Get all researchers in one query
    const researcherIds = papers
      .map(paper => paper.researcher)
      .filter(id => id) as string[];

    const researchers = await Researcher.find({
      _id: { $in: researcherIds }
    })
    .select({
      'personalInfo.name': 1,
      'personalInfo.avatar': 1,
      'academicInfo.institution': 1,
      'academicInfo.department': 1,
      'academicInfo.position': 1
    })
    .lean();

    // Create a map of researcher data for quick lookup
    const researcherMap = new Map(
      researchers.map(r => [r._id.toString(), r])
    );

    // Combine paper data with researcher info
    const papersWithResearchers = papers.map(paper => ({
      ...paper,
      researcher: paper.researcher ? {
        personalInfo: {
          name: researcherMap.get(paper.researcher.toString())?.personalInfo?.name || 'Anonymous',
          avatar: researcherMap.get(paper.researcher.toString())?.personalInfo?.avatar,
        },
        academicInfo: {
          institution: researcherMap.get(paper.researcher.toString())?.academicInfo?.institution || 'Not specified',
          department: researcherMap.get(paper.researcher.toString())?.academicInfo?.department,
          position: researcherMap.get(paper.researcher.toString())?.academicInfo?.position,
        }
      } : null
    }));

    return NextResponse.json({
      success: true,
      papers: papersWithResearchers
    });

  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch research papers";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
} 