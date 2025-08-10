
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Invalid message input" }), {
        status: 400,
      });
    }

    console.log("📩 Received message from client:", message);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a witty crossword battle AI. Be sarcastic, funny, or clever.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Groq API Error:", errText);
      return new Response(JSON.stringify({ error: `Groq error: ${errText}` }), {
        status: 500,
      });
    }

    const data = await response.json();
    console.log("🧠 Groq API Success Response:", data);

    return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("🔥 Unexpected Error:", err.message);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
    });
  }
}
