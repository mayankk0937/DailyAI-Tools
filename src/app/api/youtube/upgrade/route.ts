import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { callGroq } from "@/lib/ai/providers/groq";
import { callOpenRouter } from "@/lib/ai/providers/openrouter";
import { callGemini } from "@/lib/ai/providers/gemini";
import { extractAndTranscribe } from "@/lib/youtube/extractor";

// Providers in order of priority for this specific tool
const providers = [
  { name: "groq", call: callGroq },
  { name: "openrouter", call: callOpenRouter },
  { name: "gemini", call: callGemini }
];

async function robustAICall(prompt: string) {
  let lastError = null;
  for (const provider of providers) {
    try {
      const result = await provider.call(prompt);
      if (result) return { output: result, provider: provider.name };
    } catch (e: any) {
      lastError = e;
      continue;
    }
  }
  throw lastError || new Error("All AI providers failed");
}

const CHUNK_SIZE = 1500; 

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  // Create a TransformStream to send SSE chunks
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendEvent = async (type: string, data: any) => {
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ type, ...data })}\n\n`));
    } catch (e) {
      // Stream might be closed
    }
  };

  const processRequest = async () => {
    try {
      const { url, context, subject = "auto", language = "English" } = await req.json();

      const languageInstruction = language === "Hindi" 
        ? "Respond ENTIRELY in Hindi (for all sections except the PPT outline and Hinglish fallback)." 
        : language === "Hinglish" 
        ? "Respond ENTIRELY in natural Gen-Z Hinglish (Hindi + English mix)." 
        : "Respond in English.";

      if (!url) {
        throw new Error("YouTube URL is required");
      }

      await sendEvent("progress", { message: "Fetching Transcript & Timestamps", step: 0 });

      // 1. Fetch Transcript
      let fullTranscript = "";
      let timestamps: any[] = [];
      let transcriptData: any[] = [];

      try {
        transcriptData = await YoutubeTranscript.fetchTranscript(url);
        fullTranscript = transcriptData.map((t: any) => t.text).join(" ");
      } catch (e) {
        await sendEvent("progress", { message: "Captions unavailable. Extracting audio...", step: 0 });
        try {
          fullTranscript = await extractAndTranscribe(url, async (msg) => {
            await sendEvent("progress", { message: msg, step: 0 });
          });
        } catch (extError: any) {
          throw new Error("Failed to extract audio or captions. Video might be private or unsupported.");
        }
      }

      if (!fullTranscript || fullTranscript.trim().length === 0) {
        throw new Error("Failed to extract any text from the video.");
      }

      await sendEvent("progress", { message: "Smart Chunking Content", step: 1 });

      const words = fullTranscript.split(/\s+/);
      const chunks = [];
      for (let i = 0; i < words.length; i += CHUNK_SIZE) {
        chunks.push(words.slice(i, i + CHUNK_SIZE).join(" "));
      }

      await sendEvent("progress", { message: "Stage 1: Multi-Chunk Analysis", step: 2 });

      // Stage 1: Summarize Chunks
      const chunkSummaries = await Promise.all(
        chunks.slice(0, 15).map(async (chunk, index) => {
          const prompt = `Summarize the following part (${index + 1}/${chunks.length}) of a YouTube video transcript. 
          Focus on key concepts, technical terms, and important explanations. 
          Maintain the context for a student study tool.
          
          Transcript Part:
          ${chunk}`;
          try {
            const result = await robustAICall(prompt);
            return result.output;
          } catch (e: any) {
            return "Error processing this chunk.";
          }
        })
      );

      const integratedSummary = chunkSummaries.join("\n\n---\n\n");

      await sendEvent("progress", { message: "Stage 2: Integrating Insights", step: 3 });

      const finalPrompt = `
        You are a World-Class Academic Professor and Student Mentor. 
        TARGET LANGUAGE: ${language}
        ${languageInstruction}
        
        SUBJECT TYPE: ${subject}
        USER CONTEXT: ${context || "None"}
        
        INTEGRATED VIDEO CONTENT:
        ${integratedSummary}
        
        CRITICAL: Your output MUST be divided into these EXACT 8 sections, separated by the delimiter "---SECTION_BREAK---".
        
        1. SMART NOTES: 
           - Deep, academic-grade structured notes.
           - Use hierarchical headings (H2, H3).
           - Bold all technical terms and important definitions.
           - Include examples mentioned in the video.
           - If Science/Math: Include formulas and step-by-step logic.
           - If Coding: Include logic flow and code snippets.

        2. SHORT REVISION NOTES:
           - Ultra-concise, 1-page style summary.
           - Use high-impact bullet points only.
           - Focus on "Must-Know" points for exams.

        3. IMPORTANT QUESTIONS:
           - 5-7 Short Answer Questions.
           - 3 Long Answer/Conceptual Questions.
           - Provide structured answers for each.

        4. MCQs:
           - 10 tricky Multiple Choice Questions.
           - Format: Question, Options (A, B, C, D).
           - Include a "### Answers" section at the end.

        5. KEY TERMS & GLOSSARY:
           - List all technical keywords used.
           - Provide clear, simple meanings.

        6. MINDMAP STRUCTURE:
           - Create a text-based visual hierarchy.
           - Central Topic -> Main Branches -> Sub-topics -> Details.

        7. HINDI/HINGLISH EXPLANATION:
           - A natural, Gen-Z Hinglish summary for better understanding.
           - Use "Bhai, basically iss video mein yeh bataya hai..." style.
           - Keep it deep but simple.

        8. PPT SLIDE DECK:
           - Create a 10-slide outline.
           - Format: 
             Slide 1: [Title]
             - [Point 1]
             - [Point 2]
             Slide 2: [Heading] ...
        
        RULES:
        - Use professional Markdown.
        - Use LaTeX for any mathematical equations.
        - Do NOT include any conversational filler.
        - Use "---SECTION_BREAK---" as the only delimiter.
      `;

      let finalContent = "";
      let usedProvider = "";
      try {
        const result = await robustAICall(finalPrompt);
        finalContent = result.output;
        usedProvider = result.provider;
      } catch (e: any) {
        throw new Error(`Generation failed: ${e.message}`);
      }

      await sendEvent("progress", { message: "Finalizing Premium Study Pack", step: 4 });

      // Generate timestamps if we have native transcript data, else skip or mock
      if (transcriptData && transcriptData.length > 0) {
        const timestampPrompt = `
          Based on the following transcript segments with offsets, identify 6-8 main topic transitions and their timestamps.
          Transcript with offsets:
          ${transcriptData.filter((_, i) => i % 50 === 0).map(t => `[${t.offset}] ${t.text}`).join("\n").slice(0, 5000)}
          
          Output ONLY a JSON array: [{"time": "MM:SS", "seconds": number, "topic": "Description"}]
        `;
        try {
          const result = await robustAICall(timestampPrompt);
          const tsText = result.output.replace(/```json|```/g, "").trim();
          timestamps = JSON.parse(tsText);
        } catch (e) {
          timestamps = [];
        }
      }

      await sendEvent("success", {
        result: finalContent,
        timestamps,
        provider: usedProvider,
        subject_detected: subject === "auto" ? "Detected Subject" : subject
      });

    } catch (error: any) {
      console.error("YouTube Upgrade Error:", error);
      await sendEvent("error", { error: error.message || "Failed to process video" });
    } finally {
      writer.close();
    }
  };

  // Run processing in background
  processRequest();

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
