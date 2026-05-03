"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { Sparkles, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function ViralContentLab() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    contentType: "Instagram Reel",
    niche: "",
    audience: "",
    topic: "",
  });

  const tabNames = [
    "Viral Hooks",
    "Video Script",
    "Thumbnails",
    "Caption & Tags",
    "Retention Lines",
    "CTA Strategy"
  ];

  const handleGenerate = async () => {
    if (!formData.niche || !formData.topic) {
      setError("Please fill in Niche and Specific Topic.");
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
          tool: "viral",
          data: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate viral content");

      const parsedSections = data.result.split("---SECTION_BREAK---").map((s: string) => s.trim()).filter(Boolean);
      setSections(parsedSections);
      setActiveTab(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const types = ['Instagram Reel', 'TikTok Video', 'YouTube Shorts', 'Twitter Thread', 'LinkedIn Post'];

  return (
    <ToolTemplate
      title="Viral Content Lab Pro"
      description="Elite Strategist: Hooks, Scripts, and High-Retention Content for Creators."
      icon={Sparkles}
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
                <ReactMarkdown>{sections[activeTab] || "Generating strategy..."}</ReactMarkdown>
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
        <select 
          value={formData.contentType}
          onChange={(e) => setFormData({...formData, contentType: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
        >
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Niche</label>
          <input 
            type="text" 
            value={formData.niche}
            onChange={(e) => setFormData({...formData, niche: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
            placeholder="e.g. Finance, Tech, Fitness"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
          <input 
            type="text" 
            value={formData.audience}
            onChange={(e) => setFormData({...formData, audience: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
            placeholder="e.g. College students"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 mt-2">Specific Product / Topic</label>
        <textarea 
          value={formData.topic}
          onChange={(e) => setFormData({...formData, topic: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[120px]" 
          placeholder="What do you want to talk about? e.g. 3 ways to save money using rule of 72..."
        />
      </div>

    </ToolTemplate>
  );
}
