"use client";

import { useState, useRef } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { 
  HelpCircle, Copy, AlertCircle, Upload, 
  Camera, Image as ImageIcon, Zap, Sparkles,
  CheckCircle2, Search, BrainCircuit, Lightbulb,
  Trash2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { saveHistory } from "@/lib/history";

export default function DoubtSolver() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    question: string;
    solution: string;
    finalAnswer: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    fileData: "", // base64
    mimeType: "",
    fileName: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | undefined;
    if ("target" in e && "files" in e.target) {
      file = e.target.files?.[0];
    } else if ("dataTransfer" in e) {
      e.preventDefault();
      file = e.dataTransfer.files?.[0];
    }

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB");
      return;
    }

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setFormData(prev => ({
        ...prev,
        fileData: base64String,
        mimeType: file!.type || 'image/jpeg',
        fileName: file!.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    const textQuestion = formData.question.trim();
    const hasImage = !!formData.fileData;

    console.log("Generate clicked");
    console.log("Typed question:", formData.question);
    console.log("Trimmed text:", textQuestion);
    console.log("Image exists:", hasImage);

    if (!textQuestion && !hasImage) {
      console.log("Validation failed: No input provided");
      setError("Please upload an image or type your question.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      console.log("Sending request to /api/generate...");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "doubts",
          data: {
            ...formData,
            question: textQuestion // Ensure trimmed version is sent
          },
        }),
      });

      const data = await response.json();
      console.log("Response received:", data);

      if (!response.ok) throw new Error(data.error || "Failed to solve doubt");

      if (data.result.startsWith("IMAGE_UNCLEAR")) {
        throw new Error("The image is too blurry. Please upload a clearer photo.");
      }
      
      // If AI didn't find a question in image but we have text, it shouldn't error
      if (data.result.startsWith("NO_QUESTION") && !textQuestion) {
        throw new Error("No valid academic question was detected in this image.");
      }

      // CLEANUP FUNCTION
      const cleanText = (text: string) => {
        return text
          .replace(/\$/g, "") // Remove all dollar signs
          .replace(/DETECTED QUESTION:?\s*/gi, "")
          .replace(/STEP-BY-STEP SOLUTION:?\s*/gi, "")
          .replace(/FINAL ANSWER & SUMMARY:?\s*/gi, "")
          .replace(/FINAL ANSWER:?\s*/gi, "")
          .trim();
      };

      const rawSections = data.result.split("---SECTION_BREAK---").map((s: string) => s.trim());
      
      setResult({
        question: cleanText(rawSections[0] || textQuestion || "Doubt Analysis"),
        solution: cleanText(rawSections[1] || "Solving..."),
        finalAnswer: cleanText(rawSections[2] || "Calculating...")
      });

      saveHistory({
        tool: "Doubt Solver",
        title: textQuestion.length > 30 ? textQuestion.substring(0, 30) + "..." : textQuestion,
        href: "/dashboard/doubts"
      });

      console.log("Result updated successfully");
    } catch (err: any) {
      console.error("Error in handleGenerate:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAll = () => {
    setPreviewUrl(null);
    setFormData({ question: "", fileData: "", mimeType: "", fileName: "" });
    setResult(null);
    setError(null);
  };

  return (
    <ToolTemplate
      title="Elite Text Tutor AI"
      description="Smart Academic Assistant: Get step-by-step solutions for Math, Science, Coding, and Theory instantly."
      icon={HelpCircle}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      result={
        result ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Detected Question */}
            <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm uppercase tracking-wider">
                <Search className="w-4 h-4" /> Your Question
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-gray-200">
                <ReactMarkdown>{result.question}</ReactMarkdown>
              </div>
            </div>

            {/* Step by Step Solution */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-sm uppercase tracking-wider px-2">
                <BrainCircuit className="w-4 h-4" /> Step-by-Step Solution
              </div>
              
              {result.solution.split(/\n(?=Step \d+:?)/).map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                    <ReactMarkdown>{step.trim()}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Final Answer Card */}
            <div className="glass p-8 rounded-[2rem] border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <CheckCircle2 className="w-12 h-12 text-primary/20" />
              </div>
              <div className="flex items-center gap-2 mb-4 text-primary font-black text-lg uppercase tracking-tighter">
                <Lightbulb className="w-6 h-6" /> Final Answer
              </div>
              <div className="prose prose-invert max-w-none text-white text-2xl font-bold leading-relaxed">
                <ReactMarkdown>{result.finalAnswer}</ReactMarkdown>
              </div>
              <Button 
                variant="premium" 
                size="sm" 
                className="mt-6 rounded-full px-6"
                onClick={() => navigator.clipboard.writeText(`${result.question}\n\nSolution:\n${result.solution}\n\nFinal Answer:\n${result.finalAnswer}`)}
              >
                <Copy className="w-4 h-4 mr-2" /> Copy Full Solution
              </Button>
            </div>
          </motion.div>
        ) : null
      }
    >
      <div className="space-y-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </motion.div>
        )}

        {/* Text Input Area */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <Zap className="w-4 h-4 text-yellow-500" /> Type Your Question
            </div>
            <div className="text-[10px] font-bold text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
              IMAGE SOLVING COMING SOON 🚀
            </div>
          </div>
          <textarea 
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-white min-h-[250px] text-lg leading-relaxed placeholder:text-gray-600" 
            placeholder="Type your math, science, coding, or study question here..."
          />
        </div>
      </div>
    </ToolTemplate>
  );
}


