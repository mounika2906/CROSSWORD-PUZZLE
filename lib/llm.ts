import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// AI remark generator
export async function aiRemark(gameState: {
  score: { player: number; ai: number };
  status: string;
}) {
  try {
    const prompt = `
      You are an AI crossword opponent.
      Current game state:
      - Player Score: ${gameState.score.player}
      - AI Score: ${gameState.score.ai}
      - Game Status: ${gameState.status}

      Give a short, witty remark (max 1 sentence).
      Example styles: "Nice one!", "That was tricky", "I’ll get the next one".
    `;

    const chat = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 40,
      temperature: 0.8,
    });

    return chat.choices[0]?.message?.content?.trim() || "Hmm, interesting!";
  } catch (err) {
    console.error("AI remark error:", err);
    return "I’ll save my words for later 😅";
  }
}


