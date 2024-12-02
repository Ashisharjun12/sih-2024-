import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { pending, accepted } = await req.json();

    const prompt = `
      Compare these two trademarks and provide similarity scores as percentages.
      Return only a JSON object in this exact format, without any markdown or additional text:
      {
        "titleSimilarity": <number between 0-100>,
        "descriptionSimilarity": <number between 0-100>
      }

      Pending Trademark:
      Title: "${pending.title}"
      Description: "${pending.description}"

      Accepted Trademark:
      Title: "${accepted.title}"
      Description: "${accepted.description}"

      Consider semantic meaning, key terms, and overall intent.
    `;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean the response text to ensure valid JSON
      const cleanedText = text.replace(/```(json)?|```/g, '').trim();
      
      try {
        const similarity = JSON.parse(cleanedText);
        return NextResponse.json(similarity);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.log("Raw text:", text);
        console.log("Cleaned text:", cleanedText);
        
        // Fallback to basic similarity check
        const titleSimilarity = calculateBasicSimilarity(pending.title, accepted.title);
        const descSimilarity = calculateBasicSimilarity(pending.description, accepted.description);
        
        return NextResponse.json({
          titleSimilarity: Math.round(titleSimilarity * 100),
          descriptionSimilarity: Math.round(descSimilarity * 100)
        });
      }

    } catch (aiError: any) {
      console.error("AI Error:", aiError);
      
      // If rate limit exceeded, use basic similarity
      if (aiError.status === 429) {
        const titleSimilarity = calculateBasicSimilarity(pending.title, accepted.title);
        const descSimilarity = calculateBasicSimilarity(pending.description, accepted.description);
        
        return NextResponse.json({
          titleSimilarity: Math.round(titleSimilarity * 100),
          descriptionSimilarity: Math.round(descSimilarity * 100)
        });
      }
      
      throw aiError;
    }

  } catch (error) {
    console.error("Error in trademark comparison:", error);
    return NextResponse.json(
      { error: "Failed to compare trademarks" },
      { status: 500 }
    );
  }
}

// Basic similarity function as fallback
function calculateBasicSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const commonWords = words1.filter(word => set2.has(word));
  return (commonWords.length * 2) / (set1.size + set2.size);
} 