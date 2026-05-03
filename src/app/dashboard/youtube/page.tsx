"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { Video, Copy, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function YouTubeToNotes() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ url: "", context: "" });

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
    if (!formData.url) {
      setError("Please paste a YouTube video link.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSections([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "youtube",
          data: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate notes");

      const parsedSections = data.result.split("---SECTION_BREAK---").map((s: string) => s.trim()).filter(Boolean);
      setSections(parsedSections);
      setActiveTab(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolTemplate
      title="YouTube to Notes Pro"
      description="Elite AI Notes from any YouTube Video: Structured, Exam-Ready, and Multi-Format."
      icon={Video}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      result={
        sections.length > 0 ? (
          <div className="flex flex-col h-full">
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
            <div className="flex-1 overflow-y-auto">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{sections[activeTab] || "Generating content..."}</ReactMarkdown>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 mt-4 border-t border-white/5">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => navigator.clipboard.writeText(sections[activeTab])}
              >
                <Copy className="w-4 h-4 mr-2" /> Copy This Section
              </Button>
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

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">YouTube Video URL</label>
        <div className="relative">
          <input 
            type="text" 
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-primary transition-colors text-white" 
            placeholder="https://youtube.com/watch?v=..."
          />
          <Play className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 mt-4">Additional Context (Optional)</label>
        <textarea 
          value={formData.context}
          onChange={(e) => setFormData({...formData, context: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[100px]" 
          placeholder="e.g. Focus on the coding part of the video..."
        />
      </div>
    </ToolTemplate>
  );
}
