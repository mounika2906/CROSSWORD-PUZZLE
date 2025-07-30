import axios from "axios";

// export async function generateAIResponse(playerMessage: string) {
//   const response = await axios.post(
//     "https://api.groq.com/openai/v1/chat/completions",
//     {
//       model: "mixtral-8x7b-32768",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a witty crossword battle AI. Respond with short, fun, or sarcastic remarks to the player’s chat or game progress.",
//         },
//         {
//           role: "user",
//           content: playerMessage,
//         },
//       ],
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data.choices[0].message.content;
// }

// lib/groq.ts
export async function generateAIResponse(playerMessage: string) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: playerMessage }),
  });

  const data = await res.json();

  if (res.ok && data.response) {
    return data.response;
  } else {
    console.error("AI response error:", data.error || "Unknown error");
    return "Oops! Something went wrong.";
  }
}


