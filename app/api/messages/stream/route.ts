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
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const lastTimestamp = searchParams.get('after');

    if (!chatId) {
      return new Response('Chat ID is required', { status: 400 });
    }

    await connectDB();

    // Set up SSE stream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Initialize global connections
    if (!global.connections) {
      global.connections = new Map();
    }
    
    if (!global.connections.has(chatId)) {
      global.connections.set(chatId, new Set());
    }
    
    // Add this connection
    global.connections.get(chatId)?.add(writer);

    // Send initial ping
    writer.write(encoder.encode(`: ping\n\n`));

    // Set up interval to send pings to keep connection alive
    const pingInterval = setInterval(() => {
      writer.write(encoder.encode(`: ping\n\n`))
        .catch(() => clearInterval(pingInterval));
    }, 30000);

    // Clean up on disconnect
    request.signal.addEventListener('abort', () => {
      clearInterval(pingInterval);
      global.connections.get(chatId)?.delete(writer);
      if (global.connections.get(chatId)?.size === 0) {
        global.connections.delete(chatId);
      }
      writer.close();
    });

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Stream error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 