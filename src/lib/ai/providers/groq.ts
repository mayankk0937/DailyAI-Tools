import { OpenAI } from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function callGroq(prompt: string) {
  if (!process.env.GROQ_API_KEY) throw new Error("Groq API key missing");

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Groq Provider Error:", error.message);
    throw error;
  }
}
