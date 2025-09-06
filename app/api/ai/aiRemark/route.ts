// app/api/aiRemark/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const { score, status } = await req.json();
  const prompt = `
    You are an AI crossword opponent.
    Current game state:
    - Player Score: ${score.player}
    - AI Score: ${score.ai}
    - Game Status: ${status}
    Give a short, witty remark (max 1 sentence).
    Example styles: "Nice one!", "That was tricky", "I’ll get the next one".
  `;

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
  });

  const chat = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 40,
    temperature: 0.8,
  });

  return NextResponse.json({ remark: chat.choices[0]?.message?.content?.trim() || "Hmm, interesting!" });
}