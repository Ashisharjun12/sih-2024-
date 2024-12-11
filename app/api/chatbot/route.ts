import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build context from chat history
    const chatHistory = history
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a helpful AI assistant for Gujarat's startup and innovation platform.
    You specialize in helping users with:
    - Starting up in Gujarat
    - Research & Innovation opportunities
    - Government policies & support
    - Funding & Investment guidance
    - Connecting with mentors
    - Understanding Gujarat's business ecosystem

    Previous conversation:
    ${chatHistory}

    Current user query: ${message}

    Provide a helpful, concise response focused on Gujarat's startup ecosystem.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
} 