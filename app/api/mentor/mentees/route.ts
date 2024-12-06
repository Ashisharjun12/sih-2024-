import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import Meeting from "@/models/meeting.model";
import FormSubmission from "@/models/form-submission.model";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get mentor's ID
    const mentor = await User.findOne({ email: session.user.email });
    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // Get all approved meetings for this mentor
    const meetings = await Meeting.find({ 
      mentorId: mentor._id,
      status: 'approved'
    }).populate('userId');

    // Get unique mentee IDs
    const menteeIds = [...new Set(meetings.map(meeting => meeting.userId._id))];

    // Get mentee details including their form submissions
    const menteeDetails = await Promise.all(menteeIds.map(async (menteeId) => {
      const user = await User.findById(menteeId);
      const formSubmission = await FormSubmission.findOne({
        userId: menteeId,
        status: 'approved'
      });

      const menteeMeetings = meetings.filter(m => 
        m.userId._id.toString() === menteeId.toString()
      );

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        details: formSubmission?.formData || null,
        meetings: menteeMeetings.map(meeting => ({
          _id: meeting._id,
          date: meeting.date,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          topic: meeting.topic,
          meetLink: meeting.meetLink
        }))
      };
    }));

    return NextResponse.json({
      success: true,
      mentees: menteeDetails
    });

  } catch (error) {
    console.error("Error fetching mentee details:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentee details" },
      { status: 500 }
    );
  }
} 