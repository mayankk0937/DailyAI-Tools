"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { saveHistory } from "@/lib/history";

export default function SwaiChat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "chat",
          data: { message: text },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate response");

      setMessages((prev) => [...prev, { role: "ai", content: data.result }]);
      
      saveHistory({
        tool: "SWai Chat",
        title: text.length > 30 ? text.substring(0, 30) + "..." : text,
        href: "/dashboard/chat"
      });
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error: " + err.message }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-primary/20 rounded-2xl border border-primary/50 text-primary shadow-[0_0_15px_rgba(168,85,247,0.4)] relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <Zap className="w-6 h-6 relative z-10" />
        </div>
        <div>
            SWai <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold border border-primary/30">Assistant</span>
          <p className="text-primary/80 font-medium text-sm">Your Smart Daily Companion, SWai</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto glass border border-primary/30 rounded-3xl p-6 mb-4 space-y-6 custom-scrollbar scroll-smooth shadow-[0_0_30px_rgba(168,85,247,0.1)] relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-3xl" />
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-80 relative z-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-primary/20">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Hey, I'm SWai ⚡</h2>
            <p className="text-gray-400 max-w-md">
              Ready to organize your day, boost focus, and solve anything. Try "Make me a schedule" or ask me a complex question!
            </p>
          </div>
        ) : (
          <div className="relative z-10 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mr-3 shrink-0 mt-1 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br from-primary to-purple-600 text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)] rounded-2xl rounded-tr-sm" 
                    : "bg-black/40 backdrop-blur-md border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm shadow-sm"
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isGenerating && (
          <div className="flex justify-start relative z-10 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mr-3 shrink-0 mt-1 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 h-[52px]">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)] [animation-delay:-0.2s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)] [animation-delay:-0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask SWai anything..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-2 placeholder:text-gray-500 font-medium"
        />
        <Button variant="premium" onClick={handleSend} disabled={isGenerating} className="rounded-xl px-6 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
