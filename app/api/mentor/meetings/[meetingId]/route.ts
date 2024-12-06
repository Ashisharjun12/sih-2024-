import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Meeting from "@/models/meeting.model";
import { sendMail } from "@/lib/mail"; // Assuming you have this utility

export async function PATCH(
  req: Request,
  { params }: { params: { meetingId: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = params;
    const { action, meetLink } = await req.json();

    // Update meeting status
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      {
        status: action,
        ...(action === 'approved' && { meetLink }),
      },
      { new: true }
    ).populate('userId');

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }

    // Send email notification
    const emailSubject = action === 'approved' 
      ? 'Meeting Request Approved'
      : 'Meeting Request Rejected';
    
    const emailContent = action === 'approved'
      ? `Your meeting request has been approved. Join using this link: ${meetLink}`
      : 'Your meeting request has been rejected.';

    await sendMail({
      to: meeting.userId.email,
      subject: emailSubject,
      text: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: `Meeting ${action} successfully`,
      meeting
    });

  } catch (error) {
    console.error(`Error ${params.meetingId}:`, error);
    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
} 