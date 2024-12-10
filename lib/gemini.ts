interface ComparisonInput {
  title: string;
  description: string;
}

export async function checkSimilarityWithGemini(
  doc1: ComparisonInput,
  doc2: ComparisonInput
) {
  try {
    const response = await fetch("/api/gemini/compare-trademarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doc1,
        doc2
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to compare documents");
    }

    const data = await response.json();
    return {
      titleSimilarity: data.titleSimilarity,
      descriptionSimilarity: data.descriptionSimilarity
    };
  } catch (error) {
    console.error("Error in Gemini comparison:", error);
    return null;
  }
} 