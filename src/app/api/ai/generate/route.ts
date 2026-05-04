import { NextResponse } from "next/server";
import { aiRouter } from "@/lib/ai/aiRouter";

export async function POST(req: Request) {
  try {
    const { tool, prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
    }

    // Wrap the prompt based on tool context if needed, or just pass it through
    // For now, we use the prompt directly as requested.
    const result = await aiRouter(prompt);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 503 });
    }

  } catch (error: any) {
    console.error("Critical AI API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "AI service is busy. Please try again." 
    }, { status: 500 });
  }
}
