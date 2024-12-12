import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import Researcher from "@/models/researcher.model";
import Mentor from "@/models/mentor.model";
import Research from "@/models/research.model";
import FundingAgency from "@/models/funding-agency.model";

export async function GET() {
  try {
    await connectDB();

    // Fetch all entities in parallel
    const [startups, researchers, papers, fundingAgencies] = await Promise.all([
      Startup.find({}),
      Researcher.find({}).lean(),
      Research.find({ isPublished: true }).lean(),
      FundingAgency.find({}).lean(),
    ]);

    console.log('Papers:', papers);
    // Map papers with researcher details
    const researchPapers = await Promise.all(papers.map(async (paper: any) => {
      const researcher = researchers.find(r => r._id.toString() === paper.researcher?.toString());
      return {
        ...paper,
        researcher: researcher ? {
          personalInfo: {
            name: researcher.personalInfo.name
          },
          academicInfo: {
            institution: researcher.academicInfo.institution
          }
        } : null
      };
    }));

    console.log('API Response:', {
      startups: startups.length,
      researchers: researchers.length,
      papers: researchPapers.length,
      samplePaper: researchPapers[0]
    });

    return NextResponse.json({ 
      startups,
      researchers,
      researchPapers,
      fundingAgencies
    });

  } catch (error) {
    console.error("API Route - Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
