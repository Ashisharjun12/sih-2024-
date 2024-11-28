import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { projectid: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    await connectDB();

    const startup = await Startup.findOne({
      _id: params.projectid,
      userId: session.user.id
    }).lean();

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" }, 
        { status: 404 }
      );
    }

    console.log("Startup data from DB:", JSON.stringify(startup, null, 2));

    return NextResponse.json({ 
      success: true,
      startup
    });

  } catch (error) {
    console.error("Error fetching startup details:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup details" }, 
      { status: 500 }
    );
  }
} 