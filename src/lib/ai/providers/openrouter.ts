import { OpenAI } from "openai";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
});

export async function callOpenRouter(prompt: string) {
  if (!process.env.OPENROUTER_API_KEY) throw new Error("OpenRouter API key missing");

  try {
    const response = await openrouter.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("OpenRouter Provider Error:", error.message);
    throw error;
  }
}
