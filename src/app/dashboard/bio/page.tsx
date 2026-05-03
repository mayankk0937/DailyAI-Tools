"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { PenTool, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function BioMaker() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platform: "LinkedIn",
    about: "",
    tone: "Professional",
    language: "English",
  });

  const handleGenerate = async () => {
    if (!formData.about) {
      setError("Please write something about yourself.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "bio",
          data: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate bio");

      setResult(
        <div className="text-left text-white">
          <div className="prose prose-invert prose-sm max-w-none mb-6">
            <ReactMarkdown>{data.result}</ReactMarkdown>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigator.clipboard.writeText(data.result)}>
            <Copy className="w-4 h-4 mr-2" /> Copy All
          </Button>
        </div>
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const platforms = ['LinkedIn', 'Instagram', 'Twitter / X', 'Portfolio / Website', 'GitHub'];
  const tones = ['Professional', 'Casual', 'Humorous', 'Attitude', 'Creative'];
  const languages = ['English', 'Hinglish', 'Hindi'];

  return (
    <ToolTemplate
      title="Bio Maker"
      description="Create a standout bio for your social profiles and portfolio."
      icon={PenTool}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      result={result}
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Select Platform</label>
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <div 
              key={p} 
              onClick={() => setFormData({...formData, platform: p})}
              className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                formData.platform === p ? "bg-primary/20 border-primary text-primary" : "border-white/10 bg-white/5 text-gray-300 hover:border-primary/50"
              }`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1 mt-2">About You</label>
        <textarea 
          value={formData.about}
          onChange={(e) => setFormData({...formData, about: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[100px]" 
          placeholder="e.g. Software Engineer at Google, love building startups, dog person..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tone / Vibe</label>
          <select 
            value={formData.tone}
            onChange={(e) => setFormData({...formData, tone: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
          >
            {tones.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
          <select 
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
          >
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
    </ToolTemplate>
  );
}
