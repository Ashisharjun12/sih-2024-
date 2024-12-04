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

    // Find the meeting first with populated user details
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
      console.log("Processing refund for meeting:", {
        meetingId: params.id,
        userId: existingMeeting.userId,
        amount: existingMeeting.amount
      });
      
      // Update user's wallet with refund
      const updatedWallet = await Wallet.findOneAndUpdate(
        { userId: existingMeeting.userId },
        {
          $inc: { balance: existingMeeting.amount }, // Use the actual meeting amount
          $push: {
            transactions: {
              type: 'credit',
              amount: existingMeeting.amount,
              description: 'Meeting rejected - Refund'
            }
          }
        },
        { new: true }
      );

      if (!updatedWallet) {
        console.error("Failed to process refund - wallet not found");
        return NextResponse.json(
          { error: "Failed to process refund" },
          { status: 500 }
        );
      }

<<<<<<< HEAD
      await addNotification({
        name: existingMeeting.mentorId.name,
        message: "Your meeting has been rejected.",
        role: session.user.role!,
      }, existingMeeting.userId);
=======
      console.log("Refund processed successfully:", {
        userId: existingMeeting.userId,
        amount: existingMeeting.amount,
        newBalance: updatedWallet.balance
      });
>>>>>>> 904f2845dbac69348a87e8e4bb91e87ea55a7012
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
                <p>A refund of ₹${existingMeeting.amount} has been processed to your wallet.</p>
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
    }

    return NextResponse.json({
      success: true,
      meeting,
      message: data.action === 'rejected' 
        ? `Meeting rejected and refund of ₹${existingMeeting.amount} processed` 
        : 'Meeting updated successfully'
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