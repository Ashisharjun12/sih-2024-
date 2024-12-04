import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/message.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper to generate chat ID
const generateChatId = (userId1: string, userId2: string) => {
  return [userId1, userId2].sort().join('_');
};

// Helper function to notify connected clients
const notifyClients = async (chatId: string, message: any) => {
  const connections = global.connections?.get(chatId);
  if (!connections) return;

  const encoder = new TextEncoder();
  const data = encoder.encode(`data: ${JSON.stringify(message)}\n\n`);

  connections.forEach(async (writer: any) => {
    try {
      await writer.write(data);
    } catch (err) {
      console.error('Error writing to stream:', err);
    }
  });
};

interface MessageQuery {
  chatId: string;
  createdAt?: { $gt: Date };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { receiverId, content } = await request.json();

    const chatId = generateChatId(session.user.id, receiverId);

    const message = await Message.create({
      sender: session.user.id,
      receiver: receiverId,
      content,
      chatId
    });

    await message.populate('sender', 'name image');

    // Notify connected clients
    await notifyClients(chatId, { success: true, message });

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiverId');
    const after = searchParams.get('after');

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID required" }, { status: 400 });
    }

    await connectDB();

    const chatId = generateChatId(session.user.id, receiverId);

    // Build query based on timestamp
    const query: MessageQuery = { chatId };
    if (after) {
      query.createdAt = { $gt: new Date(after) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .populate('sender', 'name image')
      .populate('receiver', 'name image');

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
} 