"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, Image as ImageIcon, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { getHistory, HistoryItem, formatTimeAgo, clearHistory } from "@/lib/history";
import { useState, useEffect } from "react";

const popularTools = [
  { name: "AI Chat Assistant", icon: MessageSquare, href: "/dashboard/chat", color: "text-blue-400" },
  { name: "Resume Maker", icon: FileText, href: "/dashboard/resume", color: "text-green-400" },
  { name: "Caption Generator", icon: Sparkles, href: "/dashboard/caption", color: "text-pink-400" },
  { name: "Image to Text", icon: ImageIcon, href: "/dashboard/ocr", color: "text-yellow-400" },
];

export default function DashboardHome() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory().slice(0, 5)); // Show only 5 on dashboard
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, Creator! 👋</h1>
          <p className="text-gray-400">What would you like to build today?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularTools.map((tool, i) => (
            <Link key={tool.name} href={tool.href}>
              <motion.div 
                whileHover={{ y: -2, scale: 1.01 }}
                className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group h-full"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 ${tool.color}`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors text-white">{tool.name}</h3>
                <p className="text-sm text-gray-500">Generate instantly with AI</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 text-primary" /> Recent Activity
            </h3>
            {history.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors font-bold"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="space-y-4 flex-1">
            {history.length > 0 ? (
              history.map((activity) => (
                <Link key={activity.id} href={activity.href}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group mb-2">
                    <div className="overflow-hidden">
                      <p className="font-medium text-sm text-gray-200 group-hover:text-primary transition-colors truncate">{activity.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{activity.tool}</p>
                    </div>
                    <span className="text-[10px] text-gray-600 shrink-0 ml-4 font-medium">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                  <Clock className="w-6 h-6 text-gray-700" />
                </div>
                <p className="text-sm font-bold text-gray-400">No recent activity yet</p>
                <p className="text-[11px] text-gray-600 mt-1 max-w-[160px]">Start using DailyAI tools to see your history here 🚀</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
