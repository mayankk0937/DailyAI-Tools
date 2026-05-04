import { callGroq } from "./providers/groq";
import { callOpenRouter } from "./providers/openrouter";
import { callGemini } from "./providers/gemini";

export async function aiRouter(prompt: string) {
  const providers = [
    { name: "groq", call: callGroq },
    { name: "openrouter", call: callOpenRouter },
    { name: "gemini", call: callGemini }
  ];

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`[AI Router] Attempting with ${provider.name}...`);
      const output = await provider.call(prompt);
      
      if (output) {
        return {
          success: true,
          provider: provider.name,
          output: output
        };
      }
    } catch (error: any) {
      console.warn(`[AI Router] ${provider.name} failed:`, error.message);
      lastError = error;
      
      // Continue to next provider on common failure codes
      // 429: Rate limit, 403: Auth/Forbidden, 500+: Server error, Timeout
      continue; 
    }
  }

  // If all providers fail
  return {
    success: false,
    message: "AI service is busy. Please try again.",
    error: lastError?.message
  };
}
