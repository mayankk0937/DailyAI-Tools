"use client";

import { useState, useRef } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { PenTool, Copy, AlertCircle, Download, Sparkles, Target, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function ProposalWriter() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    type: "Freelance Proposal",
    details: "",
    offer: "",
    painPoints: "",
    usp: "",
    pricing: "",
    cta: "Book a 15-min Discovery Call",
    tone: "Professional & Persuasive",
  });

  const handleGenerate = async () => {
    if (!formData.details || !formData.offer || !formData.usp) {
      setError("Please fill in key details: Project, Offer, and Why Choose You.");
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
          tool: "proposal",
          data: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate proposal");

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    const html2pdf = (await import("html2pdf.js" as any)).default;
    const element = proposalRef.current;
    const opt = {
      margin: [0.5, 0.5],
      filename: `Proposal-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  const proposalTypes = ["Freelance Proposal", "Project Proposal", "Startup Pitch", "Agency Proposal"];
  const tones = ["Professional & Persuasive", "High-Energy & Bold", "Collaborative & Humble", "Scientific & Analytical"];

  return (
    <ToolTemplate
      title="Elite Proposal Writer"
      description="Generate high-converting, premium proposals that win high-ticket clients."
      icon={PenTool}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      result={
        result ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div 
              ref={proposalRef}
              className="p-10 rounded-xl shadow-2xl min-h-[600px] text-left"
              style={{ 
                backgroundColor: "#ffffff", 
                color: "#1e293b",
                fontFamily: "'Inter', sans-serif" 
              }}
            >
              <style jsx global>{`
                .prose-proposal h1, .prose-proposal h2, .prose-proposal h3 {
                  color: #8b5cf6 !important;
                }
                .prose-proposal strong {
                  color: #0f172a !important;
                }
              `}</style>
              <div className="prose prose-slate max-w-none prose-proposal">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white" 
                onClick={() => navigator.clipboard.writeText(result)}
              >
                <Copy className="w-4 h-4 mr-2 text-primary" /> Copy Proposal
              </Button>
              <Button 
                variant="premium" 
                className="flex-1"
                onClick={downloadPDF}
              >
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
            
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest">Winning Proposal Generated</p>
                <p className="text-[10px] text-gray-400">Personalized with empathy and results-focused language.</p>
              </div>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Proposal Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm transition-all"
            >
              {proposalTypes.map(t => <option key={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Tone & Voice</label>
            <select 
              value={formData.tone}
              onChange={(e) => setFormData({...formData, tone: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm transition-all"
            >
              {tones.map(t => <option key={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 flex items-center gap-2">
            <Target className="w-3 h-3 text-primary" /> Project / Client Details
          </label>
          <textarea 
            value={formData.details}
            onChange={(e) => setFormData({...formData, details: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm min-h-[80px] resize-none" 
            placeholder="e.g. Scaling an E-commerce brand to 7 figures..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-500" /> Client Pain Points
          </label>
          <textarea 
            value={formData.painPoints}
            onChange={(e) => setFormData({...formData, painPoints: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm min-h-[60px] resize-none" 
            placeholder="e.g. High ad spend, low conversion rate, mobile site lag..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" /> Your Offer / Solution
          </label>
          <textarea 
            value={formData.offer}
            onChange={(e) => setFormData({...formData, offer: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm min-h-[80px] resize-none" 
            placeholder="e.g. Full CRO audit, UI/UX redesign, Speed optimization..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 flex items-center gap-2">
            <Rocket className="w-3 h-3 text-blue-500" /> Why Choose You? (USP)
          </label>
          <input 
            value={formData.usp}
            onChange={(e) => setFormData({...formData, usp: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm" 
            placeholder="e.g. Generated $2M for clients in 2023..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Investment (Optional)</label>
            <input 
              value={formData.pricing}
              onChange={(e) => setFormData({...formData, pricing: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm" 
              placeholder="e.g. $2,500 - $4,000"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Call to Action</label>
            <input 
              value={formData.cta}
              onChange={(e) => setFormData({...formData, cta: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none text-sm font-bold text-primary" 
              placeholder="e.g. Book a Discovery Call"
            />
          </div>
        </div>
      </div>
    </ToolTemplate>
  );
}
