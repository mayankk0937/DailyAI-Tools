"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { FileText, Copy, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function NotesGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ text: "" });
  const [provider, setProvider] = useState<string | null>(null);

  const tabNames = [
    "Smart Notes", 
    "Revision Notes", 
    "Imp. Questions", 
    "MCQs", 
    "Exam Format", 
    "Mindmap", 
    "Hindi Version"
  ];

  const handleGenerate = async () => {
    if (!formData.text) {
      setError("Please paste the long text you want to convert into notes.");
      return;
    }

    if (isGenerating) return; // Prevent multiple clicks

    setIsGenerating(true);
    setError(null);
    setSections([]);
    setProvider(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "notes",
          data: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || "Failed to generate notes");

      // Parse the 7 sections
      const parsedSections = data.result.split("---SECTION_BREAK---").map((s: string) => s.trim()).filter(Boolean);
      
      if (parsedSections.length === 0) {
         throw new Error("No notes were generated. Please try again.");
      }

      setSections(parsedSections);
      setProvider(data.provider);
      setActiveTab(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolTemplate
      title="Notes Generator Pro"
      description="Elite AI Notes: Structured, Exam-Ready, and Multi-Format."
      icon={FileText}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      hideGenerateButton={true}
      provider={provider || undefined}
      result={
        sections.length > 0 ? (
          <div className="flex flex-col h-auto lg:h-full">
            {/* Tabs Header */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-white/5 custom-scrollbar">
              {tabNames.map((name, i) => (
                <button
                  key={name}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === i 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 lg:overflow-y-auto">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{sections[activeTab] || "Generating content..."}</ReactMarkdown>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 mt-4 border-t border-white/5 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1" 
                onClick={() => navigator.clipboard.writeText(sections[activeTab])}
              >
                <Copy className="w-4 h-4 mr-2" /> Copy This Section
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
          <Button size="sm" variant="ghost" className="h-7 px-2 hover:bg-red-500/20" onClick={handleGenerate}>
            Retry
          </Button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Paste Text / Transcript</label>
        <textarea 
          value={formData.text}
          onChange={(e) => setFormData({...formData, text: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[300px]" 
          placeholder="Paste your long text here to get elite, exam-ready notes..."
        />
      </div>

      <Button 
        variant="premium" 
        className="w-full h-12 mt-4" 
        onClick={handleGenerate}
        disabled={isGenerating || !formData.text}
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Routing to best AI...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Generate Elite Notes
          </span>
        )}
      </Button>
    </ToolTemplate>
  );
}
