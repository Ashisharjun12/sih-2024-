import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

const ROLE_CONTEXTS = {
  startup: `You are a specialized AI assistant for startups in Gujarat's innovation ecosystem.
  When users click on quick access items, provide detailed information about:
  • IPR Registration: Guide through the process, requirements, and benefits
  • Revenue Models: Explain different models, pricing strategies, and monetization
  • Funding Options: Detail available funding sources, application processes
  • Government Schemes: Latest schemes, eligibility, and application process
  • Mentor Connect: How to find and engage with mentors`,

  researcher: `You are a specialized AI assistant for researchers in Gujarat's innovation ecosystem.
  When users click on quick access items, provide detailed information about:
  • Patent Filing: Step-by-step guide, requirements, and best practices
  • Research Grants: Available grants, application process, and success tips
  • Industry Collaborations: How to find and establish partnerships
  • Publication Support: Guidelines, journals, and submission tips
  • Lab Resources: Available facilities and how to access them`,

  mentor: `You are a specialized AI assistant for mentors in Gujarat's innovation ecosystem.
  When users click on quick access items, provide detailed information about:
  • Mentorship Best Practices: Effective techniques and approaches
  • Industry Insights: Latest trends and market analysis
  • Success Stories: Case studies and learning points
  • Startup Matching: How to find and select startups to mentor
  • Resource Hub: Available tools and resources for mentoring`,

  iprProfessional: `You are a specialized AI assistant for IPR professionals in Gujarat's innovation ecosystem.
  When users click on quick access items, provide detailed information about:
  • Patent Processing: Latest guidelines and procedures
  • Trademark Filing: Requirements and process updates
  • Copyright Registration: Step-by-step guidance
  • Trade Secrets: Protection strategies and legal framework
  • Blockchain Records: Integration and verification process`,

  "funding-agency": `You are a specialized AI assistant for funding agencies in Gujarat's innovation ecosystem.
  When users click on quick access items, provide detailed information about:
  • Deal Flow: Pipeline management and evaluation
  • Due Diligence: Checklist and best practices
  • Portfolio Analytics: Performance metrics and tracking
  • Co-investment Options: Partnership opportunities
  • Exit Strategies: Planning and execution guidelines`,

  default: `You are a helpful AI assistant for Gujarat's innovation platform.
  When users click on quick access items, provide detailed information about:
  • Startup Resources: Available support and programs
  • Research & Innovation: Opportunities and facilities
  • Funding Options: Various funding sources
  • Government Support: Schemes and policies
  • Mentorship Programs: Available mentoring options`
};

export async function POST(request: Request) {
  try {
    const { message, history, context } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build context from chat history
    const chatHistory = history
      .map((msg: ChatMessage) => `${msg.role}: ${msg.content}`)
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
    If the user clicks on any quick access item, provide detailed information about that topic.
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