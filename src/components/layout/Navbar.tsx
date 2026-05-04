"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, LayoutDashboard, User, Home } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/LanguageContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/50">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-foreground whitespace-nowrap">
              DailyAI Tools
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">{t("nav", "tools")}</Link>
            <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">{t("nav", "dashboard")}</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <Link href="/dashboard">
              <Button variant="premium">Get Started Instantly</Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] h-screen w-screen"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 right-0 h-screen w-[80%] max-w-sm bg-[#0a0a0a] border-l border-white/10 z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl tracking-tight text-white">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full">
                  <X className="w-6 h-6 text-white" />
                </Button>
              </div>
              <div className="flex flex-col gap-6 flex-1 mt-4">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="bg-primary/20 p-2 rounded-lg"><Home className="w-5 h-5 text-primary" /></div>
                  Home
                </Link>
                <Link href="#features" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="bg-primary/20 p-2 rounded-lg"><Sparkles className="w-5 h-5 text-primary" /></div>
                  {t("nav", "tools")}
                </Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="bg-primary/20 p-2 rounded-lg"><User className="w-5 h-5 text-primary" /></div>
                  About
                </Link>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="bg-primary/20 p-2 rounded-lg"><LayoutDashboard className="w-5 h-5 text-primary" /></div>
                  {t("nav", "dashboard")}
                </Link>
              </div>
              <div className="mt-auto space-y-4 pt-8 border-t border-white/10">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="premium" className="w-full justify-center py-6 text-base rounded-xl mt-3">Start Using Now</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
