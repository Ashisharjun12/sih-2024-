import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Message from "@/models/message.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get users that current user can message
    const messages = await Message.find({
      $or: [{ sender: session.user.id }, { receiver: session.user.id }]
      });
    // Extract unique user IDs from messages (both senders and receivers)
    const userIds = Array.from(new Set([
      ...messages.map(message => message.sender.toString()),
      ...messages.map(message => message.receiver.toString())
    ])).filter(id => id !== session.user.id);

    const users = await User.find({
      _id: { $in: userIds }
    });

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 