"use client";

import { motion } from "framer-motion";
import { History, Clock, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getHistory, HistoryItem, formatTimeAgo, clearHistory } from "@/lib/history";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your entire history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <History className="w-8 h-8 text-primary" /> Activity History
            </h1>
            <p className="text-gray-400 text-sm mt-1">Review your recent AI generations and tool usage.</p>
          </div>
        </div>
        
        {history.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleClearHistory}
            className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={item.href}>
                <div className="glass p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.05]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-black mt-0.5">{item.tool}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 font-medium">{formatTimeAgo(item.timestamp)}</span>
                    <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <History className="w-10 h-10 text-gray-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-400">No activity history found</h2>
            <p className="text-gray-600 mt-2 max-w-sm mx-auto">
              You haven't used any tools yet. Go to the dashboard and start creating!
            </p>
            <Link href="/dashboard">
              <Button variant="premium" className="mt-8 rounded-full px-8">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
