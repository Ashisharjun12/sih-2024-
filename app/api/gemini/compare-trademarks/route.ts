import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry with exponential backoff
async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3) {
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error?.status === 429 && i < maxRetries - 1) {
        // Wait for (2^i * 1000)ms before retrying
        const waitTime = Math.pow(2, i) * 1000;
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
}

export async function POST(request: Request) {
  try {
    const { pending, accepted } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `I have two Intellectual Property Rights (IPRs), each with a title and description. Compare the meaning of the two IPRs based on their content and provide a similarity percentage indicating how closely related their concepts and meanings are. The goal is to determine if the new IPR is similar enough to an existing one to potentially affect its acceptance. Please consider semantic similarity, synonyms, and contextual relevance in your analysis. Provide a clear similarity percentage along with a brief justification for the score.

    Pending Application:
    Title: "${pending.title}"
    Description: "${pending.description}"

    Accepted Application:
    Title: "${accepted.title}"
    Description: "${accepted.description}"

    Provide the response in the following JSON format only:
    {
      "titleSimilarity": <number between 0-100>,
      "descriptionSimilarity": <number between 0-100>
    }`;

    const generateResponse = async () => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    };

    // Use the retry mechanism
    const text = await retryWithBackoff(generateResponse);

    // Extract only the JSON part from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        titleSimilarity: 0,
        descriptionSimilarity: 0
      });
    }

    const similarityData = JSON.parse(jsonMatch[0]);

    // Add a small delay after successful response to prevent rapid successive calls
    await delay(500);

    return NextResponse.json(similarityData);
  } catch (error) {
    console.error("Error in compare-trademarks:", error);
    return NextResponse.json({
      titleSimilarity: 0,
      descriptionSimilarity: 0
    });
  }
} 