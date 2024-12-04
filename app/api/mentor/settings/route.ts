import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Mentor from "@/models/mentor.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'mentor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hourlyRate } = await request.json();

    await connectDB();
    
    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: session.user.id },
      { hourlyRate },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      mentor: updatedMentor
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'mentor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const mentor = await Mentor.findOne({ userId: session.user.id });
    
    return NextResponse.json({
      success: true,
      mentor: {
        hourlyRate: mentor?.hourlyRate || 1000
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
} 