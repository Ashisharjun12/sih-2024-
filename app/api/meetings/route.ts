import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Meeting from "@/models/meeting.model";
import Wallet from "@/models/wallet.model";
import { ensureWallet } from "@/lib/wallet";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addNotification } from "@/lib/notificationService";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Ensure wallet exists and get balance
    const wallet = await ensureWallet(session.user.id);

    if (wallet.balance < 1000) {
      return NextResponse.json(
        { error: "Insufficient wallet balance" },
        { status: 400 }
      );
    }

    // Create meeting
    const meeting = await Meeting.create({
      mentorId: data.mentorId,
      userId: session.user.id,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'pending',
      amount: 1000
    });

    // Deduct amount from wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: session.user.id },
      {
        $inc: { balance: -1000 },
        $push: {
          transactions: {
            type: 'debit',
            amount: 1000,
            description: `Meeting booking with mentor`
          }
        }
      },
      { new: true }
    );

    // Populate mentor details
    await meeting.populate('mentorId', 'name email');
    
    await addNotification({
        name: meeting.mentorId.name,
        message: "You have a new meeting request.",
        role: session.user.role!,
    }, meeting.mentorId);

    return NextResponse.json({
      success: true,
      meeting,
      walletBalance: updatedWallet.balance
    });

  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user's meetings with populated mentor details
    const meetings = await Meeting.find({
      userId: session.user.id
    }).populate('mentorId', 'name email');

    // Get wallet balance
    const wallet = await Wallet.findOne({ userId: session.user.id });
    const balance = wallet ? wallet.balance : 5000; // Default to 5000 if no wallet exists

    return NextResponse.json({
      success: true,
      meetings,
      walletBalance: balance
    });

  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
} 