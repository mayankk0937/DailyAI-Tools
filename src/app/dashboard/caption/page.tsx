"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { 
  Sparkles, Copy, AlertCircle, RefreshCw, 
  Smartphone, Send, Globe, Layout,
  Zap, Heart, Trophy, Crown, Smile, Target,
  Flame, Hash, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export default function CaptionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    topic: "",
    platform: "Instagram",
    mood: "Aesthetic",
    includeHashtags: true,
  });

  const moods = [
    { name: "Minimal", icon: Zap },
    { name: "Cool", icon: Smartphone },
    { name: "Gen Z", icon: Flame },
    { name: "Aesthetic", icon: Heart },
    { name: "Sigma", icon: Trophy },
    { name: "Attitude", icon: Target },
    { name: "Funny", icon: Smile },
    { name: "Motivational", icon: Sparkles },
    { name: "Romantic", icon: Heart },
    { name: "Luxury", icon: Crown },
  ];

  const tabNames = [
    "10 Short",
    "5 Premium",
    "5 One-liners",
    "5 Hinglish",
    "Hashtags",
    "Emoji Mode"
  ];

  const handleGenerate = async () => {
    if (!formData.topic) {
      setError("Please describe the topic of your post.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSections([]);
    setProvider(null);

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
      if (!response.ok) throw new Error(data.error || data.message || "Failed to generate captions");

      const parsedSections = data.result.split("---SECTION_BREAK---").map((s: string) => s.trim()).filter(Boolean);
      setSections(parsedSections);
      setProvider(data.provider);
      setActiveTab(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolTemplate
      title="Caption Generator Pro"
      description="Elite Viral Captions: Minimal, Sigma, Gen Z & More for maximum engagement."
      icon={Sparkles}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      provider={provider || undefined}
      hideGenerateButton={true}
      result={
        sections.length > 0 ? (
          <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-white/5 custom-scrollbar">
              {tabNames.map((name, i) => (
                <button
                  key={name}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="prose prose-invert prose-sm max-w-none"
                >
                  <ReactMarkdown>{sections[activeTab] || "Generating content..."}</ReactMarkdown>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Bar */}
            <div className="pt-4 mt-4 border-t border-white/5 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-white/5 border-white/10" 
                onClick={() => handleCopy(sections[activeTab])}
              >
                {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy Section"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/5 border-white/10"
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
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
          <Button size="sm" variant="ghost" className="h-7 px-2 hover:bg-red-500/20" onClick={handleGenerate}>
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Post Context</label>
          <textarea 
            value={formData.topic}
            onChange={(e) => setFormData({...formData, topic: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-primary transition-all text-white min-h-[120px] placeholder:text-gray-700" 
            placeholder="What is your post about? (e.g. My new watch collection, Sunday hike, Coding struggle...)"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Platform</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "Instagram", icon: Smartphone },
              { id: "TikTok", icon: Layout },
              { id: "LinkedIn", icon: Globe },
              { id: "Twitter", icon: Send },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setFormData({...formData, platform: p.id})}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.platform === p.id 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"
                }`}
              >
                <p.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{p.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Select Style (Viral Vibe)</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m.name}
                onClick={() => setFormData({...formData, mood: m.name})}
                className={`px-3 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.mood === m.name 
                  ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10" 
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <m.icon className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Button 
          variant="premium" 
          className="w-full h-14 text-lg font-bold shadow-2xl shadow-primary/20 group overflow-hidden relative"
          onClick={handleGenerate}
          disabled={isGenerating || !formData.topic}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" /> Analyzing Trends...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Generate Viral Captions
            </span>
          )}
        </Button>
      </div>
    </ToolTemplate>
  );
}
