import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { YoutubeTranscript } from "youtube-transcript";
import { aiRouter } from "@/lib/ai/aiRouter";

// Auth & Credit Check - REMOVED (Project is now 100% Public)

// Simple In-Memory Cache (Reset on server restart, good for MVP)
const promptCache = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get("dailyai_lang")?.value;
    const body = await req.json();
    const { tool, data, language = cookieLang || "en" } = body;

    // 1. Auth & Credit Check - REMOVED (Project is now 100% Public)
    const isPremium = true; // Default to full access for everyone

    // 2. Cache Check
    const cacheKey = JSON.stringify({ tool, data, language });
    if (promptCache.has(cacheKey)) {
      return NextResponse.json({ result: promptCache.get(cacheKey), provider: "Cache (Fast)" });
    }

    // 3. YouTube Processing
    let youtubeContext = "";
    if (tool === "youtube" && data.url) {
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(data.url);
        youtubeContext = transcript.map(t => t.text).join(" ").slice(0, 200000); // Increased for long lectures
      } catch (e) {
        return NextResponse.json({ error: "Could not extract video captions. Please try a video with CC enabled." }, { status: 400 });
      }
    }

    // 4. Construct Prompt
    const languageInstruction = language === "hi" ? "Respond in Hindi." : language === "hinglish" ? "Respond in Hinglish (Hindi + English mix)." : "Respond in English.";
    
    let basePrompt = "";
    switch (tool) {
      case "resume":
        basePrompt = `You are an elite Resume Architect for Silicon Valley executives. Create a resume that is 100% ready to be sent to a top company.
Name: ${data.name} | Email: ${data.email} | Phone: ${data.phone} | Address: ${data.address}
Target Role: ${data.title} | Skills: ${data.skills} | Exp: ${data.experience} | Education: ${data.education} | Achievements: ${data.achievements} | Hobbies: ${data.hobbies} | Tone: ${data.tone}

CRITICAL "READY-TO-APPLY" STRUCTURE:
1. HEADER: Left-align the Name at the top (H1). Below it, put the **Job Title** (Bold) on its own line. Then, put Email • Phone • Address in a clean single line (MANDATORY: Ensure Email is visible).
${data.enabledSections?.summary ? `## PROFESSIONAL SUMMARY\nA 3-sentence high-impact summary of career goals and value.` : ""}
${data.enabledSections?.skills ? `## CORE COMPETENCIES\nA clean bulleted list of skills: ${data.skills}.` : ""}
${data.enabledSections?.experience ? `## PROFESSIONAL EXPERIENCE\n- Each role must follow: **Job Title** | **Company** | **Dates**\n- Use strict line-by-line bullet points.\n- Start each bullet with a powerful action verb.\n- NO long paragraphs. Details: ${data.experience}.` : ""}
${data.enabledSections?.education ? `## EDUCATION & CERTIFICATIONS\nClear section at the bottom. Details: ${data.education}.` : ""}
${data.enabledSections?.achievements ? `## ACHIEVEMENTS & AWARDS\nInclude accomplishments: ${data.achievements}.` : ""}
${data.enabledSections?.hobbies ? `## INTERESTS & HOBBIES\nA short, professional list: ${data.hobbies}.` : ""}

CRITICAL RULES:
- USE HEADINGS: Every section title MUST start with ## (Markdown H2) to ensure it is bolded and underlined in the PDF.
- SKIP DISABLED SECTIONS: Only include sections mentioned above.
- NO PLACEHOLDERS: Do NOT write things like "[Insert Education here]".
- NO NOTES: Do NOT include any "Note:", "Please verify...", or conversational filler.`;
        break;
      case "pdf_summary":
        basePrompt = `Summarize this document. Type: ${data.type}. Focus: ${data.focus || "General Summary"}. Provide key takeaways and action items. Content: ${data.text || "Document attached."}`;
        break;
      case "caption": 
        basePrompt = `You are a World-Class Viral Content Strategist. Create PREMIUM, VIRAL Instagram/Social Media captions for the topic: "${data.topic}".
        
        SELECTED STYLE: ${data.mood}
        PLATFORM: ${data.platform}
        
        CRITICAL RULES:
        - STYLE ADAPTATION: 
          - Minimal: Very short, no emojis, deep impact.
          - Gen Z: Lowercase, slang (lowkey, era, main character), aesthetic vibe.
          - Sigma/Attitude: Confident, mysterious, high-status tone.
          - Funny: Indian meme style, witty, relatable.
          - Luxury: Elegant, high-class, quiet luxury vibe.
        - INDIAN AUDIENCE: Use natural Hinglish (Hindi + English mix) where requested. No robotic Hindi.
        - HOOK: The first line must be a scroll-stopper.
        
        CRITICAL: Your output MUST be divided into these EXACT 6 sections, separated by the delimiter "---SECTION_BREAK---".
        
        1. 10 SHORT CAPTIONS: Punchy, modern, viral-ready.
        2. 5 PREMIUM CAPTIONS: Deep, storytelling, or high-aesthetic.
        3. 5 ONE-LINER PUNCHES: Single line, maximum impact.
        4. 5 HINGLISH CAPTIONS: Natural Indian Gen-Z mix.
        5. VIRAL HASHTAGS: 15-20 trending and niche hashtags.
        6. EMOJI-ONLY / MINIMALIST VERSION: A set of emojis or ultra-minimal text that captures the vibe.
        
        Formatting: Use "---SECTION_BREAK---" to separate the 6 sections. No conversational filler.`; 
        break;
      case "bio": basePrompt = `3 Standout Bios for ${data.platform}. About: ${data.about}. NO INTRO/OUTRO.`; break;
      case "study": {
        const subjectsSummary = data.subjects.map((s: any) => `${s.name} (${s.chapters} chapters)`).join(", ");
        const totalChapters = data.subjects.reduce((acc: number, s: any) => acc + s.chapters, 0);
        const todayStr = new Date().toISOString().split('T')[0];
        basePrompt = `You are a world-class Academic Coach. Create an elite, highly-optimized Study Plan.
Current Date: ${todayStr} | Goal Date: ${data.examDate}
Subjects: ${subjectsSummary} (Total Chapters: ${totalChapters}) | Daily Capacity: ${data.hours} Hours | Exam Type: ${data.examType}
Struggles: ${data.weakAreas} | Weak Chapters: ${data.weakChapters}

CRITICAL ARCHITECTURE:
1. TIME DISTRIBUTION (VISUAL): Generate a Mermaid Pie Chart showing the % allocation for each subject/chapter based on the 100% total time.
2. CHRONOLOGICAL ROADMAP: Create a vertical timeline of your study journey. 
   - Format: **[Date]** | Chapter X | Slot: [Time] | Goal: [Action].
   - Sequence: Use "Chapter 1", "Chapter 2" etc. instead of subject names to keep it clean.
   - 🔴 CRITICAL FOCUS: Insert dedicated slots for Weak Concepts between main chapters.
3. DAILY ROUTINE: A short line-by-line summary of the ${data.hours} hour daily rhythm (Pomodoro).
4. MILESTONES: A clean checklist for the goal: ${data.examType}.

Rules: 
- 100% VERTICAL: Every single sentence, activity, or goal MUST be on its own new line.
- NO TABLES: Do NOT use markdown tables (| --- |). They are strictly forbidden.
- FORMAT: Use "⏰ [Time] | 📚 [Subject] | 📖 [Chapter/Concept]" for each line.
- NO PARAGRAPHS: Strictly forbidden.
- SPACING: Use "---" between different dates and sections to create a clean, airy look.
- PREMIUM LOOK: Use Bolding for dates and headings. Use emojis for each line.
- DIRECT START: Start immediately with the Pie Chart, then the Roadmap. No "Here is your plan...".
Use Emojis and clean Markdown. Direct roadmap only.`;
        break;
      }
      case "viral":
        basePrompt = `You are a Top-Tier Instagram/Reels Strategist specialzing in Sigma, Luxury, and High-Aesthetic content for the Indian audience.
        Create viral assets for: ${data.topic} in the ${data.niche} niche.
        
        CRITICAL RULES:
        - NO "Hey guys", "Welcome back", or "Today I will show you".
        - NO generic lecture tone.
        - STYLE: Punchy, Sigma, Mystery, Emotional, or Luxury vibe.
        - LANGUAGE: Hinglish (mix of Hindi/English) where natural for Indian creators.
        
        CRITICAL: Your output MUST be divided into these EXACT 6 sections, separated by the delimiter "---SECTION_BREAK---".
        
        1. 5 SWIPE-STOPPING HOOKS: First 2 seconds. Use mystery, shock, or high emotion. Sigma vibe.
        2. 15-SEC ELITE SCRIPT: Fast-paced, high-retention script in Natural Hinglish (Gen-Z style). 
           - [0-2s] Sharp Hook
           - [2-12s] Fast Value/Punch (No filler)
           - [12-15s] Luxury/Visual CTA
           - Include "Text Overlay" cues.
        3. VIRAL THUMBNAIL TEXT: 3 ideas for text that people CANNOT ignore.
        4. CAPTION & 15 TAGS: Minimalist, elite caption in Hinglish. No long paragraphs.
        5. RETENTION MICRO-TEXT: Small text overlays to keep them watching (e.g., "Wait for the end", "Don't miss this").
        6. HINDI/HINGLISH ONE-LINERS: 3 sharp, repost-worthy one-liners that capture the essence of this topic. Sigma/Luxury tone.

        Use "---SECTION_BREAK---" to separate each of the 6 sections.`;
        break;
      case "notes":
        basePrompt = `You are an elite academic transcriber. Create world-class student notes from this text: ${data.text}.
        
        CRITICAL: Your output MUST be divided into these EXACT 7 sections, separated by the delimiter "---SECTION_BREAK---".
        
        1. SMART NOTES: Deep, structured notes with headings, bold terms, and clear explanations.
        2. SHORT REVISION NOTES: Bulleted, high-impact summary for last-minute study.
        3. IMPORTANT QUESTIONS: 5-10 high-probability exam questions with short answers.
        4. MCQs: 5 tricky multiple-choice questions with options (A, B, C, D). At the very end of this section, provide a clear "### Answers" heading and list the correct options.
        5. EXAM ANSWER FORMAT: Rewrite the core concepts in a "How to write in exam" format (Introduction, Points, Conclusion).
        6. MINDMAP SUMMARY: A textual representation of a mindmap (Central Node -> Branches -> sub-points).
        7. HINDI/HINGLISH VERSION: A sharp, Gen-Z Hinglish summary. Use natural language that students actually speak (mix of Hindi/English). Sigma/Deep vibe. No robotic translation.

        Formatting Rules:
        - Use Markdown (Tables, Bold, H2/H3).
        - No conversational filler.
        - Use "---SECTION_BREAK---" to separate each of the 7 sections.`;
        break;
      case "youtube":
        basePrompt = `You are an elite academic transcriber. Create EXTREMELY DETAILED, LONG-FORM student notes from this YouTube Transcript: ${youtubeContext}.
        Do NOT summarize briefly. I want every single topic, example, and detail covered extensively.
        Additional User Context: ${data.context || "None"}.
        
        CRITICAL: Your output MUST be divided into these EXACT 7 sections, separated by the delimiter "---SECTION_BREAK---".
        
        1. SMART NOTES: Deep, structured notes with headings, bold terms, and clear explanations.
        2. SHORT REVISION NOTES: Bulleted, high-impact summary for last-minute study.
        3. IMPORTANT QUESTIONS: 5-10 high-probability exam questions with short answers.
        4. MCQs: 5 tricky multiple-choice questions with options (A, B, C, D) and an "### Answers" heading at the end.
        5. EXAM ANSWER FORMAT: Rewrite the core concepts in a "How to write in exam" format (Introduction, Points, Conclusion).
        6. MINDMAP SUMMARY: A textual representation of a mindmap (Central Node -> Branches -> sub-points).
        7. HINDI/HINGLISH VERSION: A sharp, Gen-Z Hinglish summary. Use natural language that students actually speak. Sigma/Deep vibe. No robotic translation.

        Formatting Rules:
        - Use Markdown (Tables, Bold, H2/H3).
        - No conversational filler.
        - Use "---SECTION_BREAK---" to separate each of the 7 sections.`;
        break;
      case "doubts":
        basePrompt = `You are an Elite AI Tutor with advanced Vision and Reasoning capabilities. 
        Analyze the provided image or text question with 100% accuracy.
        
        QUESTION/INPUT: ${data.question || "Provided in image"}

        CRITICAL FOR MATH:
        - DO NOT write long paragraphs.
        - Break EVERY calculation into small, numbered steps (Step 1, Step 2, etc.).
        - Each step must contain ONLY ONE calculation or logical move.
        - Show formulas on their own lines using LaTeX.
        - If the result is a fraction, keep it as a simplified fraction (and optionally show decimal).
        - Use clean spacing between steps.

        CRITICAL FOR IMAGE:
        1. Perform high-accuracy OCR.
        2. Detect subject (Math, Science, Coding, etc.).
        3. If blurry, respond "IMAGE_UNCLEAR".
        4. If no question, respond "NO_QUESTION".

        Your output MUST be divided into these EXACT 3 sections, separated by "---SECTION_BREAK---":
        
        1. DETECTED QUESTION:
        [Extracted text. Use LaTeX for math.]

        2. STEP-BY-STEP SOLUTION:
        [Numbered list of short steps. NO PARAGRAPHS. NO duplicate "Step-by-step" headings.]

        3. FINAL ANSWER & SUMMARY:
        [Bold final result. 1-sentence explanation.]

        Formatting Rules:
        - DO NOT use dollar signs ($) for math. Use plain text or standard math symbols.
        - No conversational fluff.
        - Use "---SECTION_BREAK---" as the only delimiter.`;
        break;
      case "research":
        basePrompt = `You are an Elite AI Researcher. Perform a deep, comprehensive research on: ${data.topic}.
        Provide:
        1. Executive Summary
        2. Key Findings & Data
        3. Current Trends & Updates
        4. Pros & Cons (if applicable)
        5. Future Outlook
        Use bullet points, bold terms, and structured headings.`;
        break;
      case "ocr":
        basePrompt = `Extract the question or academic problem from this image with 100% accuracy. 
        - If handwritten, read carefully. 
        - If multiple questions, extract the most prominent one.
        - Fix any obvious typos in the text.
        - Format mathematical equations properly.
        - Output ONLY the extracted text, no conversation.`;
        break;
      case "proposal": 
        basePrompt = `You are a world-class Business Consultant and Elite Freelancer closer. Your mission is to write a high-ticket proposal that is impossible to ignore.
        
        CONTEXT:
        - Proposal Type: ${data.type}
        - Project Details: ${data.details}
        - Client Pain Points: ${data.painPoints || "Not specified (use logical assumptions based on project)"}
        - Your Offer: ${data.offer}
        - Why Choose You (USP): ${data.usp}
        - Estimated Investment/Pricing: ${data.pricing || "To be discussed"}
        - Call to Action: ${data.cta || "Book a 15-min discovery call"}
        - Tone: ${data.tone || "Professional & Persuasive"}

        CRITICAL STRUCTURE:
        1. THE HOOK (Personalized Opening): Address the client's current situation. No "I hope you are doing well". Start with a deep insight or a bold observation about their project.
        2. THE EMPATHY PHASE (Pain Points): Explicitly state the problems they are facing: ${data.painPoints}. Make them feel like you understand their business better than they do.
        3. THE RESULTS-FOCUSED SOLUTION: Don't just list features. Explain the **ROI** and **Transformation**. How will their life/business change after this offer: ${data.offer}?
        4. THE AUTHORITY ("Why Me"): Integrate ${data.usp} naturally. Show why you are the ONLY choice for this specific problem.
        5. THE INVESTMENT: Present ${data.pricing} as an investment with a return, not a cost.
        6. THE CTA: A clear, frictionless next step: ${data.cta}.

        PREMIUM FREELANCER LANGUAGE:
        - Use words like "Leverage", "Optimization", "Strategic", "Transformation", "ROI", "Scalability".
        - Avoid: "I think", "I can try", "Maybe", "Hopefully". Use: "We will", "Our strategy ensures", "I am confident".
        - Language Tone: ${data.tone}.

        Rules:
        - Use clean Markdown with bolding for emphasis.
        - NO AI conversational filler (No "Sure, here is your proposal...").
        - NO generic greetings.
        - Direct proposal content only.`;
        break;
      case "planner":
        basePrompt = `You are an Elite Time Management Consultant (like Motion or Notion AI). Create a highly optimized, realistic daily schedule based on these parameters:
        Tasks: ${data.tasks}
        Goals: ${data.goals}
        Mode: ${data.mode} (Student, Founder, Exam, Beast)
        Energy Peak: ${data.energyPeak || "Morning"} (When the user is most productive)
        Time Format: ${data.timeFormat} (e.g. 12-hour or 24-hour)
        
        CRITICAL RULES:
        1. BUILT-IN TIMES: If the user mentions specific times (e.g., "Wake up at 7 AM", "Class at 10 AM", "Gym 6 PM"), you MUST respect them exactly.
        2. SMART ENERGY PLACEMENT: Place high-focus deep work during the user's Energy Peak (${data.energyPeak || "Morning"}).
        3. MODES:
           - Beast Mode / Founder: Highly intensive, packed schedule, minimal breaks.
           - Exam Mode / Student: Heavy focus on study blocks with Pomodoro-style spacing.
        4. BUFFER BREAKS: Automatically inject 15-30 minute breaks to prevent burnout.
        5. IMPOSSIBLE SCHEDULE: If the requested tasks physically cannot fit into a 24-hour day (e.g. 30 hours of work), set "impossible" to true and provide an error message explaining why.
        6. PRODUCTIVITY SCORE: Calculate a realistic score (0-100) based on how balanced and effective this schedule is.
        
        OUTPUT FORMAT:
        You MUST return EXACTLY ONE valid JSON object and NOTHING else. No markdown formatting, no backticks.
        JSON Schema:
        {
          "score": number,
          "message": "A short, motivating message.",
          "impossible": boolean,
          "schedule": [
            {
              "id": "String (generate a random unique short ID)",
              "time": "String (e.g. 07:00 AM - 07:30 AM)",
              "task": "String (Task description)",
              "type": "String (choose one: focus, routine, meeting, break, personal, gym)",
              "duration": "String (e.g. 30m, 2h)",
              "priority": number (1 to 5, where 5 is highest energy/importance. Break is 1, Focus is 5)
            }
          ]
        }`;
        break;
      case "chat": basePrompt = `You are SWai, a premium, smart, fast, and slightly witty AI companion for the DailyAI Tools app. Your personality is motivational, friendly, and highly capable. Always respond concisely with a professional startup-level feel. Assist the user with their request: ${data.message}`; break;
      default: basePrompt = `Assist with: ${JSON.stringify(data)}`;
    }


    const finalPrompt = tool === "planner" 
      ? `${basePrompt}\n\nFORMATTING: You MUST return ONLY a valid JSON object. No markdown wrappers, no backticks, no conversational text. Start with { and end with }.`
      : `${basePrompt}\n\n${languageInstruction}\n\nFORMATTING: Use clean Markdown. No AI conversational fluff. Direct output only.`;

    const routerResult = await aiRouter(finalPrompt);
    
    let resultText = "";
    let usedProvider = "";

    if (routerResult.success) {
      resultText = routerResult.output || "";
      usedProvider = routerResult.provider || "Unknown";
    } else {
      throw new Error(routerResult.message);
    }

    // 6. Post-Processing & Cache
    promptCache.set(cacheKey, resultText);

    if (tool === "planner" && resultText) {
      // Strip markdown JSON wrappers if the model ignored the instruction
      resultText = resultText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
    }

    return NextResponse.json({ result: resultText, provider: usedProvider });

  } catch (error: any) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: "System busy. We are switching to backup AI, please try again in a moment." }, { status: 500 });
  }
}
