import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ROLE_CONTEXTS = {
  startup: `You are a specialized AI assistant for startups in Gujarat's innovation ecosystem.
  Focus on providing guidance about:
  - Startup registration and compliance in Gujarat
  - Available funding schemes and investors
  - Government policies and benefits for startups
  - Incubation centers and mentorship programs
  - Industry-specific opportunities in Gujarat
  - IPR registration and protection`,

  researcher: `You are a specialized AI assistant for researchers in Gujarat's innovation ecosystem.
  Focus on providing guidance about:
  - Research funding opportunities
  - Collaboration possibilities with industry
  - Patent filing and IPR
  - Research commercialization
  - Academic-industry partnerships
  - Research facilities in Gujarat`,

  "funding-agency": `You are a specialized AI assistant for funding agencies in Gujarat's innovation ecosystem.
  Focus on providing guidance about:
  - Promising startup sectors in Gujarat
  - Investment trends and opportunities
  - Due diligence processes
  - Government co-investment schemes
  - Startup evaluation metrics
  - Portfolio management best practices`,

  default: `You are a helpful AI assistant for Gujarat's startup and innovation platform.
  You help users with general queries about:
  - Gujarat's startup ecosystem
  - Innovation initiatives
  - Available support programs
  - Networking opportunities
  - Success stories from Gujarat`
};

export async function POST(request: Request) {
  try {
    const { message, history, context } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build context from chat history
    const chatHistory = history
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Get role-specific context
    const roleContext = ROLE_CONTEXTS[context.userRole as keyof typeof ROLE_CONTEXTS] || ROLE_CONTEXTS.default;

    // Build the prompt with all context
    const prompt = `${roleContext}

    You are speaking to ${context.userName || "a user"} who is a ${context.userRole || "visitor"}.
    Current page context: ${context.page}

    Previous conversation:
    ${chatHistory}

    Current user query: ${message}

    Provide a helpful, concise response that is relevant to the user's role and current context.
    Keep responses friendly but professional.
    If discussing funding amounts or policies, ensure accuracy for Gujarat region.
    Always encourage users to verify official information through proper channels.`;

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