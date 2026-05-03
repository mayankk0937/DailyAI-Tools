"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  User, Mail, Calendar, Shield, LogOut, 
  Settings, Bell, Lock, Sparkles, Clock,
  Edit2, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getHistory } from "@/lib/history";
import { signout } from "@/app/auth/actions";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      const history = getHistory();
      setHistoryCount(history.length);
    }
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Please sign in to view your profile.</p>
      </div>
    );
  }

  const creationDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Profile Header Card */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-purple-600/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <User className="w-32 h-32" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-primary/30 p-1.5 bg-[#111] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                <img 
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=A855F7&color=fff&size=256`} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full border-4 border-[#0a0a0a] hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-white mb-2 truncate max-w-xs md:max-w-md">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Mail className="w-4 h-4 text-primary" /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Calendar className="w-4 h-4 text-purple-400" /> Joined {creationDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Generations", value: historyCount, icon: Sparkles, color: "text-primary" },
            { label: "Account Status", value: "Verified", icon: Shield, color: "text-green-400" },
            { label: "Current Plan", value: "Premium Free", icon: Lock, color: "text-yellow-400" },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white px-2">Account Settings</h2>
          <div className="glass rounded-3xl border border-white/5 divide-y divide-white/5 overflow-hidden">
            {[
              { label: "Edit Profile Info", icon: Edit2, desc: "Change your name and personal details" },
              { label: "Security & Password", icon: Lock, desc: "Manage your account security" },
              { label: "Notifications", icon: Bell, desc: "Configure your email preferences" },
              { label: "Integrations", icon: Settings, desc: "Connect with Google and other services" },
            ].map((item, i) => (
              <button key={i} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-gray-400 group-hover:text-primary transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white group-hover:text-primary transition-colors">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <div className="text-gray-600 group-hover:text-primary transition-colors">
                  <Clock className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Section */}
        <div className="pt-4 pb-12">
          <form action={signout}>
            <button 
              type="submit"
              className="w-full p-5 rounded-3xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
            >
              <LogOut className="w-5 h-5" /> Log Out from DailyAI
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
