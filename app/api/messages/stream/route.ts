import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/message.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Declare global type for connections
declare global {
  var connections: Map<string, Set<WritableStreamDefaultWriter<any>>>;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('Chat ID is required', { status: 400 });
  }

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Initialize global connections if not exists
  if (!global.connections) {
    global.connections = new Map();
  }
  
  // Initialize set for this chat if not exists
  if (!global.connections.has(chatId)) {
    global.connections.set(chatId, new Set());
  }
  
  // Add this connection to the set
  global.connections.get(chatId)?.add(writer);

  // Clean up on disconnect
  request.signal.addEventListener('abort', () => {
    global.connections.get(chatId)?.delete(writer);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 