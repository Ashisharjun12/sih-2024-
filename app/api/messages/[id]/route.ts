import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Message from "@/models/message.model";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const after = searchParams.get('after');

    const query = {
      $or: [
        { sender: session.user.id, receiver: params.id },
        { sender: params.id, receiver: session.user.id }
      ],
      ...(after && { createdAt: { $gt: new Date(after) } })
    };

    const messages = await Message.find(query)
      .populate('sender', 'name image')
      .populate('receiver', 'name image')
      .sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error: unknown) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}