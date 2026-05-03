"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { FileText, Download, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { saveHistory } from "@/lib/history";

export default function ResumeMaker() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string>("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    skills: "",
    experience: "",
    education: "",
    achievements: "",
    hobbies: "",
    tone: "Professional & Formal",
    enabledSections: {
      summary: true,
      skills: true,
      experience: true,
      education: true,
      achievements: true,
      hobbies: true,
    }
  });

  const handleGenerate = async () => {
    if (!formData.name || !formData.title || !formData.experience) {
      setError("Please fill in Name, Title, and Experience fields.");
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
          tool: "resume",
          data: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume");
      }

      setProvider(data.provider || "");
      setResult(
        <div className="text-left text-white">
          <div id="pdf-content" className="p-12 bg-white rounded-sm text-black" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <style>{`
              #pdf-content h1 { font-size: 20pt; font-weight: 800; text-align: left; margin-bottom: 6pt; border-bottom: 2pt solid black; padding-bottom: 8pt; color: black !important; }
              #pdf-content h2 { font-size: 12pt; font-weight: 700; border-bottom: 1.5pt solid black; margin-top: 16pt; margin-bottom: 8pt; text-transform: uppercase; padding-bottom: 4pt; page-break-after: avoid; color: black !important; }
              #pdf-content h3 { font-size: 11pt; font-weight: 700; border-bottom: 1pt solid black; margin-top: 10pt; margin-bottom: 6pt; padding-bottom: 3pt; page-break-after: avoid; color: black !important; }
              #pdf-content h4 { font-size: 10pt; font-weight: 700; border-bottom: 0.5pt solid black; margin-top: 8pt; margin-bottom: 4pt; padding-bottom: 2pt; page-break-after: avoid; color: black !important; }
              #pdf-content p, #pdf-content li { font-size: 10pt; line-height: 1.5; margin-bottom: 3pt; page-break-inside: avoid; color: black !important; }
              #pdf-content strong { font-weight: 700; color: black !important; }
              #pdf-content ul { list-style-type: disc; margin-left: 14pt; }
            `}</style>
            <div className="prose prose-sm max-w-none text-black">
              <ReactMarkdown>{data.result}</ReactMarkdown>
            </div>
          </div>
          <div className="pt-4 flex gap-2 justify-end mt-8 border-t border-white/10">
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(data.result)}>
              <Copy className="w-4 h-4 mr-2" /> Copy Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      );

      saveHistory({
        tool: "Resume Maker",
        title: formData.title + " Resume",
        href: "/dashboard/resume"
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;
    
    const html2pdf = (await import("html2pdf.js" as any)).default;
    const opt = {
      margin: 0.5,
      filename: `${formData.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, y: 0, scrollY: 0, windowWidth: 800 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <ToolTemplate
      title="Resume Maker"
      description="Create a professional, ATS-friendly resume in seconds using AI."
      icon={FileText}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      result={result}
      provider={provider}
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
        <label className="block text-sm font-medium text-gray-300 mb-3">Include Sections</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(formData.enabledSections).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={value}
                onChange={() => setFormData({
                  ...formData, 
                  enabledSections: { ...formData.enabledSections, [key]: !value }
                })}
                className="w-4 h-4 rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors capitalize">{key}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
          placeholder="e.g. John Doe"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Address / Location</label>
        <input 
          type="text" 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
          placeholder="Mumbai, India"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Target Job Title</label>
        <input 
          type="text" 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
          placeholder="e.g. Frontend Developer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Education & Certifications</label>
        <textarea 
          value={formData.education}
          onChange={(e) => setFormData({...formData, education: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[100px]" 
          placeholder="Degree, University, Year, Relevant Certs..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Key Achievements & Awards</label>
        <textarea 
          value={formData.achievements}
          onChange={(e) => setFormData({...formData, achievements: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[100px]" 
          placeholder="List any major awards, honors, or key career achievements..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Interests & Hobbies</label>
        <textarea 
          value={formData.hobbies}
          onChange={(e) => setFormData({...formData, hobbies: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[80px]" 
          placeholder="e.g. Photography, Marathon Running, Open Source Contributing..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Key Skills (comma separated)</label>
        <input 
          type="text" 
          value={formData.skills}
          onChange={(e) => setFormData({...formData, skills: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
          placeholder="React, Next.js, Tailwind..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Current/Recent Experience Summary</label>
        <textarea 
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[120px]" 
          placeholder="Briefly describe what you do, your achievements, and impact..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Vibe / Tone</label>
        <select 
          value={formData.tone}
          onChange={(e) => setFormData({...formData, tone: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
        >
          <option>Professional & Formal</option>
          <option>Modern & Creative</option>
          <option>Concise & Direct</option>
        </select>
      </div>
    </ToolTemplate>
  );
}
