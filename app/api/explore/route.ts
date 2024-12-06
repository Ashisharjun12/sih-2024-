import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import Researcher from "@/models/researcher.model";
import Mentor from "@/models/mentor.model";

export async function GET() {
  try {
    await connectDB();

    // Fetch all entities in parallel
    const [startups, researchers, mentors] = await Promise.all([
      Startup.find({}),
      Researcher.find({}),
      Mentor.find({})
    ]);

    console.log('API Response Data:', {
      totalStartups: startups.length,
      totalResearchers: researchers.length,
      totalMentors: mentors.length,
      sampleStartup: startups[0],
      sampleResearcher: researchers[0],
      sampleMentor: mentors[0]
    });

    return NextResponse.json({ 
      startups,
      researchers,
      mentors
    });

  } catch (error) {
    console.error("API Route - Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
