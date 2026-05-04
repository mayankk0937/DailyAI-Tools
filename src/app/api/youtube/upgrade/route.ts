import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { callGroq } from "@/lib/ai/providers/groq";
import { callOpenRouter } from "@/lib/ai/providers/openrouter";
import { callGemini } from "@/lib/ai/providers/gemini";

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

// Constants
const CHUNK_SIZE = 1500; // Words per chunk
const MAX_TRANSCRIPT_CHARS = 300000; 

export async function POST(req: Request) {
  try {
    const { url, context, subject = "auto", language = "English" } = await req.json();

    const languageInstruction = language === "Hindi" 
      ? "Respond ENTIRELY in Hindi (for all sections except the PPT outline and Hinglish fallback)." 
      : language === "Hinglish" 
      ? "Respond ENTIRELY in natural Gen-Z Hinglish (Hindi + English mix)." 
      : "Respond in English.";

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    // 1. Fetch Transcript with Timestamps
    let transcriptData;
    try {
      transcriptData = await YoutubeTranscript.fetchTranscript(url);
    } catch (e) {
      return NextResponse.json({ error: "Could not extract captions. Please ensure the video has CC enabled." }, { status: 400 });
    }

    const fullTranscript = transcriptData.map(t => t.text).join(" ");
    const words = fullTranscript.split(/\s+/);
    
    // 2. Smart Chunking
    const chunks = [];
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      chunks.push(words.slice(i, i + CHUNK_SIZE).join(" "));
    }

    // Stage 1: Summarize Chunks (Parallel)
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
          console.error(`Chunk ${index} error:`, e.message);
          return "Error processing this chunk.";
        }
      })
    );

    const integratedSummary = chunkSummaries.join("\n\n---\n\n");

    // Stage 2: Generate Final Multi-Format Output
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

    // Stage 2: Generate Final Multi-Format Output
    let finalContent = "";
    let usedProvider = "";
    try {
      const result = await robustAICall(finalPrompt);
      finalContent = result.output;
      usedProvider = result.provider;
    } catch (e: any) {
      throw new Error(`Generation failed: ${e.message}`);
    }

    const timestampPrompt = `
      Based on the following transcript segments with offsets, identify 6-8 main topic transitions and their timestamps.
      Transcript with offsets:
      ${transcriptData.filter((_, i) => i % 50 === 0).map(t => `[${t.offset}] ${t.text}`).join("\n").slice(0, 5000)}
      
      Output ONLY a JSON array: [{"time": "MM:SS", "seconds": number, "topic": "Description"}]
    `;
    
    let timestamps = [];
    try {
      const result = await robustAICall(timestampPrompt);
      const tsText = result.output.replace(/```json|```/g, "").trim();
      timestamps = JSON.parse(tsText);
    } catch (e) {
      console.error("Timestamp parsing failed:", e);
      timestamps = [];
    }

    return NextResponse.json({ 
      result: finalContent, 
      timestamps,
      provider: usedProvider,
      subject_detected: subject === "auto" ? "Detected Subject" : subject 
    });

  } catch (error: any) {
    console.error("YouTube Upgrade Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process video" }, { status: 500 });
  }
}
