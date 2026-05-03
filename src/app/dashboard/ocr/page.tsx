"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { Upload, FileSearch, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import Tesseract from "tesseract.js";

export default function ImageTextExtractor() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    imageContext: "",
    fileData: "", // base64
    mimeType: "",
    fileName: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setFormData({
        ...formData,
        fileData: base64String,
        mimeType: file.type,
        fileName: file.name
      });
      setError(null);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!formData.fileData) {
      setError("Please upload an image to extract text.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      // Use local Tesseract.js instead of AI API
      const { data: { text } } = await Tesseract.recognize(
        `data:${formData.mimeType};base64,${formData.fileData}`,
        'eng',
        { logger: m => console.log(m) }
      );

      setResult(
        <div className="text-left text-white">
          <div className="prose prose-invert prose-sm max-w-none mb-6">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigator.clipboard.writeText(text)}>
            <Copy className="w-4 h-4 mr-2" /> Copy Text
          </Button>
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-xs text-green-400">
            ⚡ Processed locally for maximum privacy and speed.
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
      title="Image Text Extractor"
      description="Extract text from any image or photo using advanced AI OCR."
      icon={FileSearch}
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
        <label className="block border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer mb-4">
          <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileUpload} />
          {formData.fileName ? (
            <div className="text-primary font-medium">Uploaded: {formData.fileName}</div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-300 font-medium">Click to upload image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Image Description (Optional for better accuracy)</label>
        <textarea 
          value={formData.imageContext}
          onChange={(e) => setFormData({...formData, imageContext: e.target.value})}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white min-h-[100px]" 
          placeholder="Describe the image or paste simulated text if you don't have an image ready..."
        />
      </div>
    </ToolTemplate>
  );
}
