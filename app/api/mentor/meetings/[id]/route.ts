import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Meeting from "@/models/meeting.model";
import Wallet from "@/models/wallet.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/mail";
import { addNotification } from "@/lib/notificationService";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'mentor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    console.log("Processing meeting update:", { meetingId: params.id, action: data.action });

    // Find the meeting first
    const existingMeeting = await Meeting.findOne({
      _id: params.id,
      mentorId: session.user.id
    }).populate('userId mentorId', 'name email');

    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found or unauthorized" },
        { status: 404 }
      );
    }

    // If rejecting, process refund first
    if (data.action === 'rejected') {
      console.log("Processing refund for user:", existingMeeting.userId);
      
      // Update user's wallet with refund
      const updatedWallet = await Wallet.findOneAndUpdate(
        { userId: existingMeeting.userId.toString() }, // Convert ObjectId to string
        {
          $inc: { balance: 1000 },
          $push: {
            transactions: {
              type: 'credit',
              amount: 1000,
              description: 'Meeting rejected - Refund'
            }
          }
        },
        { new: true }
      );

      if (!updatedWallet) {
        console.log("Failed to process refund - wallet not found");
        return NextResponse.json(
          { error: "Failed to process refund" },
          { status: 500 }
        );
      }

      await addNotification({
        name: existingMeeting.mentorId.name,
        message: "Your meeting has been rejected.",
        role: session.user.role!,
      }, existingMeeting.userId);
    }

    // Update meeting status
    const meeting = await Meeting.findByIdAndUpdate(
      params.id,
      {
        status: data.action,
        ...(data.meetLink && { meetLink: data.meetLink })
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!meeting) {
      return NextResponse.json(
        { error: "Failed to update meeting" },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      if (meeting.userId.email) {
        const emailContent = data.action === 'approved'
          ? {
              subject: 'Meeting Approved - Google Meet Link',
              html: `
                <h1>Your meeting has been approved!</h1>
                <p>Hello ${meeting.userId.name},</p>
                <p>Your meeting scheduled for ${new Date(meeting.date).toLocaleDateString()} 
                   at ${meeting.startTime} has been approved.</p>
                <p>Join the meeting using this link: <a href="${data.meetLink}">${data.meetLink}</a></p>
                <p>Best regards,<br>${session.user.name}</p>
              `
            }
          : {
              subject: 'Meeting Rejected - Refund Processed',
              html: `
                <h1>Meeting Update</h1>
                <p>Hello ${meeting.userId.name},</p>
                <p>Your meeting scheduled for ${new Date(meeting.date).toLocaleDateString()} 
                   at ${meeting.startTime} has been rejected.</p>
                <p>A refund of ₹1000 has been processed to your wallet.</p>
                <p>Best regards,<br>${session.user.name}</p>
              `
            };

        await sendEmail({
          to: meeting.userId.email,
          subject: emailContent.subject,
          html: emailContent.html
        });
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      meeting,
      message: data.action === 'rejected' ? 'Meeting rejected and refund processed' : 'Meeting updated successfully'
    });

  } catch (error) {
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { 
        error: "Failed to update meeting",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 