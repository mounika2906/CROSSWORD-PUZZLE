export async function aiRemark(
  gameState: { score: { player: number; ai: number }; status: string }
) {
  try {
    const res = await fetch("/api/ai/aiRemark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameState),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("API error:", text);
      return "AI service error.";
    }
    const data = await res.json();
    if (!data || !data.remark) {
      console.error("API returned empty response:", data);
      return "AI service error.";
    }
    return data.remark;
  } catch (err) {
    console.error("AI remark error:", err);
    return "I’ll save my words for later 😅";
  }
}