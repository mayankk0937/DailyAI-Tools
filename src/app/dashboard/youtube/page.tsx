"use client";

import { useState, useRef } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { 
  Video, Copy, AlertCircle, Play, Download, 
  FileText, Presentation, FileCode, CheckCircle2,
  BrainCircuit, ListTree, Languages, HelpCircle,
  Clock, Search, BookOpen, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export default function YouTubeToNotes() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [timestamps, setTimestamps] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ url: "", context: "", subject: "auto", language: "English" });
  const [step, setStep] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const steps = [
    "Fetching Transcript & Timestamps",
    "Smart Chunking Content",
    "Stage 1: Multi-Chunk Analysis",
    "Stage 2: Integrating Insights",
    "Finalizing Premium Study Pack"
  ];

  const tabNames = [
    { name: "Smart Notes", icon: BookOpen },
    { name: "Revision", icon: Clock },
    { name: "Questions", icon: HelpCircle },
    { name: "MCQs", icon: CheckCircle2 },
    { name: "Glossary", icon: ListTree },
    { name: "Mindmap", icon: BrainCircuit },
    { name: "Hindi/Hinglish", icon: Languages },
    { name: "PPT Outline", icon: Presentation },
  ];

  const handleGenerate = async () => {
    if (!formData.url) {
      setError("Please paste a YouTube video link.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSections([]);
    setStep(0);

    // Simulate progress for UI
    const progressInterval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 5000);

    try {
      const response = await fetch("/api/youtube/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate notes");

      const parsedSections = data.result.split("---SECTION_BREAK---").map((s: string) => s.trim()).filter(Boolean);
      setSections(parsedSections);
      setTimestamps(data.timestamps || []);
      setActiveTab(0);
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const exportPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = resultRef.current;
    const opt = {
      margin: 1,
      filename: `DailyAI_Notes_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const exportWord = () => {
    const content = sections[activeTab];
    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `DailyAI_Notes_${new Date().getTime()}.doc`;
    link.click();
  };

  return (
    <ToolTemplate
      title="YouTube Study AI Pro"
      description="Convert any lecture into high-accuracy, exam-ready study notes with multi-stage AI."
      icon={Video}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      hideGenerateButton={true}
      result={
        sections.length > 0 ? (
          <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-white/5 custom-scrollbar">
              {tabNames.map((tab, i) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === i 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" ref={resultRef}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{sections[activeTab] || "Generating content..."}</ReactMarkdown>
                </div>
              </div>

              {/* Timestamp Sidebar */}
              {timestamps.length > 0 && (
                <div className="w-64 hidden xl:flex flex-col gap-4 border-l border-white/5 pl-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Topic Navigation
                  </h4>
                  <div className="space-y-3">
                    {timestamps.map((ts, idx) => (
                      <button 
                        key={idx}
                        onClick={() => window.open(`${formData.url}&t=${ts.seconds}s`, "_blank")}
                        className="text-left group"
                      >
                        <div className="text-[10px] font-mono text-primary mb-1">{ts.time}</div>
                        <div className="text-xs text-gray-400 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                          {ts.topic}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 mt-4 border-t border-white/5 flex flex-wrap gap-3">
              <div className="flex gap-3 flex-1 min-w-[300px]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-white/5 border-white/10" 
                  onClick={() => navigator.clipboard.writeText(sections[activeTab])}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy Section
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-white/5 border-white/10"
                  onClick={exportPDF}
                >
                  <Download className="w-4 h-4 mr-2" /> PDF
                </Button>
              </div>

              <div className="flex items-center gap-2 px-2 bg-white/5 rounded-lg border border-white/10">
                <Languages className="w-4 h-4 text-primary ml-2" />
                <select 
                  value={formData.language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setFormData({...formData, language: newLang});
                    // Instant re-generation if user changes language in results
                    handleGenerate();
                  }}
                  className="bg-transparent border-none text-xs font-bold py-2 focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="English" className="bg-[#0a0a0a]">English</option>
                  <option value="Hindi" className="bg-[#0a0a0a]">Hindi</option>
                  <option value="Hinglish" className="bg-[#0a0a0a]">Hinglish</option>
                </select>
                <span className="text-[10px] text-gray-500 mr-2">Re-generate in...</span>
              </div>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 mb-8 relative">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <motion.div 
                className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Processing Elite Notes</h3>
            <div className="space-y-4 w-full max-w-xs">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i === step ? "text-white opacity-100 scale-105" : i < step ? "text-primary opacity-60" : "text-gray-600 opacity-40"}`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : <div className={`w-4 h-4 rounded-full border ${i === step ? "border-primary animate-ping" : "border-gray-700"}`} />}
                  {s}
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Video Intelligence</label>
          <div className="relative">
            <input 
              type="text" 
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-primary transition-all text-white placeholder:text-gray-600" 
              placeholder="Paste YouTube URL here..."
            />
            <Play className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
              <GraduationCap className="w-3 h-3" /> Subject
            </label>
            <select 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all text-white appearance-none cursor-pointer text-sm"
            >
              <option value="auto">Auto-Detect</option>
              <option value="physics">Physics / Math</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology / Med</option>
              <option value="coding">Coding / CS</option>
              <option value="theory">History / Humanities</option>
              <option value="business">Business / Finance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
              <Languages className="w-3 h-3" /> Language
            </label>
            <select 
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all text-white appearance-none cursor-pointer text-sm"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
              <Search className="w-3 h-3" /> Context
            </label>
            <input 
              type="text" 
              value={formData.context}
              onChange={(e) => setFormData({...formData, context: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all text-white placeholder:text-gray-600 text-sm" 
              placeholder="Focus area"
            />
          </div>
        </div>

        {!isGenerating && (
          <Button 
            variant="premium" 
            className="w-full h-14 text-lg font-bold shadow-2xl shadow-primary/20 group relative overflow-hidden"
            onClick={handleGenerate}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            GENERATE ELITE STUDY PACK
          </Button>
        )}

        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
          <h5 className="text-[10px] font-bold uppercase tracking-tighter text-primary mb-2 flex items-center gap-1">
            <BrainCircuit className="w-3 h-3" /> Student Mode Enabled
          </h5>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Our AI will now auto-format for your subject. Science videos get formulas, Coding videos get logic snippets, and Theory get deep explanations.
          </p>
        </div>
      </div>
    </ToolTemplate>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
