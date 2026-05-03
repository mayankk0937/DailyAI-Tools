"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { Sparkles, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { saveHistory } from "@/lib/history";

export default function CaptionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    topic: "",
    platform: "Instagram",
    mood: "Professional",
    includeHashtags: true,
  });

  const handleGenerate = async () => {
    if (!formData.topic) {
      setError("Please describe the topic of your post.");
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
          tool: "caption",
          data: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate captions");
      }

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

      saveHistory({
        tool: "Caption Generator",
        title: formData.topic.length > 30 ? formData.topic.substring(0, 30) + "..." : formData.topic,
        href: "/dashboard/caption"
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const moods = ['Professional', 'Funny', 'Motivational', 'Aesthetic', 'Attitude', 'Storytelling'];

  return (
    <ToolTemplate
      title="Caption Generator"
      description="Create viral, engaging captions for Instagram, TikTok & LinkedIn."
      icon={Sparkles}
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
        <label className="block text-sm font-medium text-gray-300 mb-1">Topic / What is the post about?</label>
        <textarea 
          value={formData.topic}
          onChange={(e) => setFormData({...formData, topic: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[100px]" 
          placeholder="e.g. A photo of my workspace setup with a coffee cup..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
        <select 
          value={formData.platform}
          onChange={(e) => setFormData({...formData, platform: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
        >
          <option>Instagram</option>
          <option>TikTok</option>
          <option>LinkedIn</option>
          <option>Twitter / X</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Mood / Vibe</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {moods.map(mood => (
            <div 
              key={mood} 
              onClick={() => setFormData({...formData, mood})}
              className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                formData.mood === mood 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-primary/50"
              }`}
            >
              {mood}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mt-4">
          <input 
            type="checkbox" 
            checked={formData.includeHashtags}
            onChange={(e) => setFormData({...formData, includeHashtags: e.target.checked})}
            className="rounded bg-black/50 border-gray-700 text-primary focus:ring-primary" 
          />
          Include Emojis & Hashtags
        </label>
      </div>
    </ToolTemplate>
  );
}
