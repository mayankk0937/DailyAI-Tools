"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { GraduationCap, Copy, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";

const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load mermaid from CDN
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      (window as any).mermaid.initialize({ 
        startOnLoad: true, 
        theme: 'dark', 
        securityLevel: 'loose',
        themeVariables: {
          pie1: "#3b82f6",
          pie2: "#8b5cf6",
          pie3: "#ec4899",
          pie4: "#f97316",
          pie5: "#10b981",
        }
      });
      if (ref.current) {
        (window as any).mermaid.contentLoaded();
        // Force a re-render for the specific element
        (window as any).mermaid.init(undefined, ref.current);
      }
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [chart]);

  return (
    <div className="mermaid p-6 rounded-2xl my-6 flex justify-center border" style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} ref={ref}>
      {chart}
    </div>
  );
};

export default function StudyPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subjects: [{ name: "", chapters: 1 }],
    examDate: "",
    hours: "4",
    weakAreas: "",
    weakChapters: "",
    examType: "General Exam",
  });

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: "", chapters: 1 }]
    });
  };

  const removeSubject = (index: number) => {
    if (formData.subjects.length > 1) {
      const newSubjects = formData.subjects.filter((_, i) => i !== index);
      setFormData({ ...formData, subjects: newSubjects });
    }
  };

  const updateSubject = (index: number, field: "name" | "chapters", value: string | number) => {
    const newSubjects = [...formData.subjects];
    (newSubjects[index] as any)[field] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleGenerate = async () => {
    if (formData.subjects.some(s => !s.name) || !formData.examDate) {
      setError("Please fill in all Subject Names and Exam Date.");
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
          tool: "study",
          data: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate study plan");

      setResult(
        <div className="text-left text-white">
          <div id="study-plan-content" className="p-8 mb-8 rounded-3xl" style={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', color: '#ffffff', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 'none' }}>
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-mermaid/.exec(className || '');
                    return !inline && match ? (
                      <Mermaid chart={String(children).replace(/\n$/, '')} />
                    ) : (
                      <code className={className} style={{ backgroundColor: '#1a1a1a', padding: '2px 4px', borderRadius: '4px' }} {...props}>
                        {children}
                      </code>
                    );
                  },
                  hr: ({ ...props }) => <hr style={{ margin: '32px 0', borderColor: '#333333', borderStyle: 'solid', borderTopWidth: '1px', borderBottomWidth: '0' }} {...props} />,
                  p: ({ ...props }) => <p style={{ margin: '16px 0', lineHeight: '1.6', color: '#e0e0e0' }} {...props} />,
                  h1: ({ ...props }) => <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '24px 0 16px 0', color: '#ffffff' }} {...props} />,
                  h2: ({ ...props }) => <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '32px 0 16px 0', color: '#ffffff' }} {...props} />,
                  h3: ({ ...props }) => <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '24px 0 12px 0', color: '#ffffff' }} {...props} />,
                  strong: ({ ...props }) => <strong style={{ color: '#3b82f6', fontWeight: 'bold' }} {...props} />,
                  ul: ({ ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '16px 0' }} {...props} />,
                  li: ({ ...props }) => <li style={{ margin: '8px 0' }} {...props} />,
                }}
              >
                {data.result}
              </ReactMarkdown>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="premium" size="lg" className="w-full" onClick={() => navigator.clipboard.writeText(data.result)}>
              <Copy className="w-4 h-4 mr-2" /> Copy Schedule
            </Button>
            <Button variant="outline" size="lg" className="w-full bg-white/5 border-white/10 text-white" onClick={async () => {
              const element = document.getElementById("study-plan-content");
              if (!element) return;
              const html2pdf = (await import("html2pdf.js" as any)).default;
              const opt = {
                margin: [0.5, 0.5],
                filename: `Study_Plan_${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#0c0c0c' },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
              };
              html2pdf().set(opt).from(element).save();
            }}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolTemplate
      title="Study Planner"
      description="Generate a personalized, highly optimized daily/weekly study timetable."
      icon={GraduationCap}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      result={result}
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">Subjects & Chapters</label>
          <Button variant="ghost" size="sm" onClick={addSubject} className="text-primary hover:text-primary hover:bg-primary/10">
            + Add Subject
          </Button>
        </div>
        
        {formData.subjects.map((sub, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input 
              type="text" 
              value={sub.name}
              onChange={(e) => updateSubject(index, "name", e.target.value)}
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white text-sm" 
              placeholder="e.g. Mathematics"
            />
            <div className="w-24">
              <input 
                type="number" 
                min="1"
                value={sub.chapters}
                onChange={(e) => updateSubject(index, "chapters", parseInt(e.target.value) || 1)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white text-sm text-center" 
                placeholder="Ch."
              />
            </div>
            {formData.subjects.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeSubject(index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                ×
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Target Date</label>
          <input 
            type="date" 
            value={formData.examDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({...formData, examDate: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Daily Hours</label>
          <input 
            type="number" 
            min="1" max="16"
            value={formData.hours}
            onChange={(e) => setFormData({...formData, hours: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Specific Weak Chapters</label>
          <input 
            type="text" 
            value={formData.weakChapters}
            onChange={(e) => setFormData({...formData, weakChapters: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
            placeholder="e.g. Calculus, Organic Chem..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Exam Type</label>
          <select 
            value={formData.examType}
            onChange={(e) => setFormData({...formData, examType: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
          >
            <option>General Exam</option>
            <option>Competitive (JEE/NEET/SAT)</option>
            <option>Final Finals</option>
            <option>Skill Certification</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1 mt-2">Overall Weak Areas / Struggles</label>
        <textarea 
          value={formData.weakAreas}
          onChange={(e) => setFormData({...formData, weakAreas: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[100px]" 
          placeholder="e.g. I am weak at concepts, I get distracted easily..."
        />
      </div>

    </ToolTemplate>
  );
}
