"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { BookOpen, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function PDFSummarizer() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    text: "",
    type: "Short Executive Summary",
    focus: "",
    fileData: "", // base64
    mimeType: "",
    fileName: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setFormData({
        ...formData,
        fileData: base64String,
        mimeType: file.type,
        fileName: file.name,
        text: "" // Clear text if file is uploaded
      });
      setError(null);
    };
    reader.onerror = () => setError("Failed to read PDF.");
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!formData.text && !formData.fileData) {
      setError("Please paste text or upload a PDF document.");
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
          tool: "pdf_summary",
          data: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setResult(
        <div className="text-left text-white">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{data.result}</ReactMarkdown>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(data.result)}>
              <Download className="w-4 h-4 mr-2" /> Copy Summary
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
      title="Document Summarizer"
      description="Paste long document text and extract short summaries, notes, and key points."
      icon={BookOpen}
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Upload PDF Document</label>
        <label className="block border-2 border-dashed border-white/20 rounded-xl p-6 text-center bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer mb-6">
          <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} />
          {formData.fileName ? (
            <div className="text-primary font-medium">Uploaded: {formData.fileName}</div>
          ) : (
            <>
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-300 font-medium">Click to upload PDF</p>
              <p className="text-xs text-gray-500 mt-1">Max size: 10MB</p>
            </>
          )}
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Or Paste Document Text</label>
        <textarea 
          value={formData.text}
          onChange={(e) => setFormData({...formData, text: e.target.value, fileData: "", fileName: ""})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[150px]" 
          placeholder="Paste the text from your document here..."
          disabled={!!formData.fileData}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Summary Type</label>
        <select 
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
        >
          <option>Short Executive Summary</option>
          <option>Detailed Notes & Bullet Points</option>
          <option>Extract Important Questions</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Focus Areas (Optional)</label>
        <input 
          type="text" 
          value={formData.focus}
          onChange={(e) => setFormData({...formData, focus: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" 
          placeholder="e.g. Find methodology, conclusions, metrics..."
        />
      </div>
    </ToolTemplate>
  );
}
