import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the session to ensure user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();
    console.log("Connected to DB");

    // Retrieve startup IDs from the request body
    const { startupIds } = await req.json();
    console.log("Startup IDs:", startupIds);

    // Query the Startup collection
    const startups = await Startup.find({ _id: { $in: startupIds } })
      .select("startupDetails.startupName") // Only select the startup name
      .lean(); // Use lean for faster queries without Mongoose doc overhead

    if (!startups || startups.length === 0) {
      return NextResponse.json({ error: "No startups found" }, { status: 404 });
    }

    // Map over the startups array to return only the startup names
    const startupNames = startups.map(startup => startup.startupDetails.startupName);
    console.log(startupNames)
    return NextResponse.json(startupNames);

  } catch (error) {
    console.error("Error fetching startup data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
