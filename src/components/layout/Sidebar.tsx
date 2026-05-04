"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Sparkles, MessageSquare, FileText, ImageIcon, BookOpen, 
  Video, Calculator, GraduationCap, LayoutDashboard,
  HelpCircle, Share2, Receipt, PenTool, Calendar,
  History, Trophy, User, LogOut, Home, Menu, X
} from "lucide-react";

const tools = [
  { name: "AI Chat Assistant", icon: MessageSquare, href: "/dashboard/chat" },
  { name: "Resume Maker", icon: FileText, href: "/dashboard/resume" },
  { name: "Caption Generator", icon: Share2, href: "/dashboard/caption" },
  { name: "Bio Maker", icon: PenTool, href: "/dashboard/bio" },
  { name: "PDF Summarizer", icon: BookOpen, href: "/dashboard/pdf" },
  { name: "Image to Text", icon: ImageIcon, href: "/dashboard/ocr" },
  { name: "Study Planner", icon: GraduationCap, href: "/dashboard/study" },
  { name: "Notes Generator", icon: FileText, href: "/dashboard/notes" },
  { name: "YouTube to Notes", icon: Video, href: "/dashboard/youtube" },
  { name: "Doubt Solver", icon: HelpCircle, href: "/dashboard/doubts" },
  { name: "Viral Content Lab", icon: Sparkles, href: "/dashboard/viral" },
  { name: "Invoice Generator", icon: Receipt, href: "/dashboard/invoice" },
  { name: "Proposal Writer", icon: PenTool, href: "/dashboard/proposal" },
  { name: "Daily Planner", icon: Calendar, href: "/dashboard/planner" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/50">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">DailyAI</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-300 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] md:bg-card/50 md:backdrop-blur-xl border-r border-white/5 flex flex-col z-[70] transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        
        {/* Mobile Drawer Header */}
        <div className="p-4 flex justify-between items-center md:hidden border-b border-white/5">
          <span className="font-bold text-lg tracking-tight text-white">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="p-6 hidden md:block">
          <Link href="/" title="Back to Main Website" className="flex items-center gap-2">
            <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/50">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">DailyAI</span>
          </Link>
        </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider px-2">Main</p>
          <div className="space-y-1">
            <Link 
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard" 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider px-2">AI Tools</p>
          <div className="space-y-1">
            {tools.map((tool) => (
              <Link 
                key={tool.name}
                href={tool.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === tool.href 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tool.icon className="w-4 h-4" />
                {tool.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </aside>
    </>
  );
}
