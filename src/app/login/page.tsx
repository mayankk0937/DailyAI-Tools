"use client";

import Link from "next/link";
import { Sparkles, Mail, Globe, AlertCircle, UserCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login, signup, loginWithGoogle } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      
      {/* Back Button */}
      <Link href="/" className="fixed top-4 left-4 sm:top-8 sm:left-8 z-50 group">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-all shadow-2xl">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium hidden sm:block">Back to home</span>
        </motion.div>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[450px] relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl p-3 rounded-2xl border border-white/10 group-hover:border-primary/50 transition-all shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
          </Link>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-white font-outfit">
            Ready to build?
          </h1>
          <p className="mt-3 text-gray-400 font-medium">
            Join 10,000+ creators using DailyAI Tools.
          </p>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-[32px] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 backdrop-blur-md"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
            </motion.div>
          )}

          <form className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 ml-1">Email address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-300">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot?</Link>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-white placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button formAction={login} variant="premium" className="h-14 rounded-2xl text-lg font-bold shadow-[0_8px_20px_-6px_rgba(var(--primary),0.5)]">
                Sign In
              </Button>
              <Button formAction={signup} variant="outline" className="h-14 rounded-2xl text-lg font-bold border-white/10 hover:bg-white/5">
                Sign Up
              </Button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-gray-500">
                <span className="px-4 bg-[#0a0a0a]">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Button 
                onClick={() => loginWithGoogle()} 
                variant="outline" 
                className="h-14 rounded-2xl font-bold border-white/10 hover:bg-white/5 transition-all"
              >
                <Globe className="w-5 h-5 mr-3 text-primary" />
                Google Account
              </Button>
              
              <Button 
                variant="secondary" 
                className="h-14 w-full rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all group"
                onClick={() => {
                  document.cookie = "guest_mode=true; path=/; max-age=3600"; // 1 hour guest session
                  window.location.href = "/dashboard";
                }}
              >
                <UserCircle className="w-5 h-5 mr-3" />
                Explore as Guest
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          By continuing, you agree to our <Link href="#" className="text-gray-300 hover:underline">Terms of Service</Link>
        </p>
      </motion.div>
    </div>
  );
}
