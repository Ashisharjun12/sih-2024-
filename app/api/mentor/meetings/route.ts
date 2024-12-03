import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Meeting from "@/models/meeting.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'mentor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get mentor's meetings with populated user details
    const meetings = await Meeting.find({
      mentorId: session.user.id
    }).populate('userId', 'name email role');

    // Sort meetings by date and status
    const sortedMeetings = meetings.sort((a, b) => {
      // First sort by status (pending first)
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      
      // Then sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({
      success: true,
      meetings: sortedMeetings
    });

  } catch (error) {
    console.error("Error fetching mentor meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
} 