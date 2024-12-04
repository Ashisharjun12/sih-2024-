import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";

export async function GET() {
  try {
    await connectDB();

    // Simple fetch of all startups
    const startups = await Startup.find({})
    //   .select('startupDetails owner')
    //   .populate('owner');

    return NextResponse.json({ startups });

  } catch (error) {
    console.error("API Route - Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch startups" },
      { status: 500 }
    );
  }
}
