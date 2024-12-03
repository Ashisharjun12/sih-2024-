import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";

export async function GET() {
  try {
    await connectDB();
    console.log('API Route - Attempting database connection');

    // Simple fetch of all startups
    const startups = await Startup.find({})
    //   .select('startupDetails owner')
    //   .populate('owner');

    console.log("startups rouet log", startups);

    // Log raw data from database
    console.log('API Route - Raw Database Response:', {
      count: startups.length,
      firstStartup: startups[0], // See the structure of first startup
      allStartups: startups // See all startups
    });

    return NextResponse.json({ startups });

  } catch (error) {
    console.error("API Route - Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch startups" },
      { status: 500 }
    );
  }
}
