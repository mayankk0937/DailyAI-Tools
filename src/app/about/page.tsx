"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Terminal, Code2, Rocket, Trophy, Medal, 
  Link as LinkedinIcon, Mail, ExternalLink, ArrowRight, Star, User, Briefcase, Dumbbell
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-foreground selection:bg-primary/30">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-24 md:pt-32 pb-24 relative z-10 space-y-16 md:space-y-24">
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-start"
        >
          <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-medium">
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </div>
            <span>{t("nav", "home")}</span>
          </Link>
        </motion.div>
        
        {/* Intro Section */}
        <motion.section 
          initial="hidden" animate="visible" variants={containerVariants}
          className="relative"
        >
          <div className="glass p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="bg-[#0a0a0a]/90 backdrop-blur-xl p-8 md:p-12 rounded-[22px] flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
              
              {/* Photo & Stats Side */}
              <div className="flex flex-col items-center gap-8 shrink-0">
                <motion.div variants={itemVariants} className="relative group cursor-pointer">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-primary/30 p-2 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.4)] bg-[#111] relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src="/mayank-pfp.jpg" 
                      alt="Mayank Kumar" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://ui-avatars.com/api/?name=Mayank+Kumar&background=A855F7&color=fff&size=512";
                      }}
                    />
                  </div>
                  {/* Neon Glow Rings */}
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-black px-4 py-2 rounded-full border-2 border-[#0a0a0a] shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-1.5 z-20">
                    <Star className="w-3.5 h-3.5 fill-white" /> FOUNDER
                  </div>
                </motion.div>

                {/* Mini Stats Cards */}
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-3 w-full"
                >
                  {[
                    { label: "3+ Live Projects", color: "from-blue-500 to-cyan-400" },
                    { label: "Hackathon Winner", color: "from-yellow-500 to-orange-400" },
                    { label: "Startup Builder", color: "from-purple-500 to-pink-400" },
                    { label: "CSE Student", color: "from-green-500 to-emerald-400" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="glass p-3 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
                    >
                      <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${stat.color} mb-2`} />
                      <span className="text-[10px] md:text-xs font-bold text-white leading-tight">{stat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Intro Text */}
              <div className="flex-1 text-center md:text-left pt-4">
                <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-white leading-tight">
                  {t("about", "name")}
                </motion.h1>
                <motion.h2 variants={itemVariants} className="text-xl md:text-2xl font-medium text-gray-300 mb-6 flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3">
                  <span className="flex items-center gap-2"><Terminal className="w-5 h-5 text-primary" /> {t("about", "role1")}</span>
                  <span className="flex items-center gap-2"><Code2 className="w-5 h-5 text-purple-400" /> {t("about", "role2")}</span>
                  <span className="flex items-center gap-2"><Rocket className="w-5 h-5 text-blue-400" /> {t("about", "role3")}</span>
                  <span className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-green-400" /> {t("about", "role4")}</span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed text-lg max-w-2xl mb-8">
                  {t("about", "bio")}
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <Link href="#connect">
                    <button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                      {t("about", "connect")} <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <a href="https://www.linkedin.com/in/mayank-k-850255381?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-gray-300 hover:text-white transition-all hover:scale-110">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* My Journey */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
              <Rocket className="w-8 h-8 text-primary" /> My Journey
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-white/10 -translate-x-1/2" />
            
            {[
              { title: "Building WryClip", desc: "Developed a premium media application with Supabase integration and social features.", date: "Present" },
              { title: "Creating Daily AI Tools", desc: "Built an all-in-one suite of 14+ AI utilities for students and creators.", date: "2026" },
              { title: "Developing NrityaVaani", desc: "Engineered a hand gesture recognition system for Bharatanatyam mudras.", date: "2025" },
              { title: "Hackathons & Competitions", desc: "Actively pitched startup ideas and competed in high-stakes hackathons.", date: "Ongoing" },
            ].map((item, i) => (
              <div key={i} className={`glass p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group relative ${i % 2 === 0 ? 'md:mr-8' : 'md:ml-8 md:translate-y-12'}`}>
                {/* Timeline Dot */}
                <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-primary ${i % 2 === 0 ? '-right-[42px]' : '-left-[42px]'} shadow-[0_0_10px_rgba(168,85,247,0.5)] group-hover:scale-150 transition-transform duration-300`} />
                
                <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">{item.date}</span>
                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
              <Code2 className="w-8 h-8 text-purple-400" /> Tech & Skills
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-purple-400/50 to-transparent" />
          </div>

          <div className="flex flex-wrap gap-4">
            {["Web Development", "App Development", "UI/UX Design", "AI Tools Integration", "Startup Building", "Problem Solving", "Leadership"].map((skill, i) => (
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                key={i} 
                className="px-6 py-3 rounded-full glass border border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/50 text-gray-200 hover:text-white transition-all shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-default font-medium"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" /> Achievements
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "3rd Prize Hackathon", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "hover:border-yellow-500/50" },
              { title: "3rd Prize Startup Pitch", icon: Medal, color: "text-blue-400", bg: "bg-blue-400/10", border: "hover:border-blue-400/50" },
              { title: "Built Multiple Projects", icon: Briefcase, color: "text-primary", bg: "bg-primary/10", border: "hover:border-primary/50" },
            ].map((ach, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className={`glass p-8 rounded-3xl border border-white/5 transition-all shadow-lg hover:shadow-2xl ${ach.border} text-center flex flex-col items-center gap-4 relative overflow-hidden group`}
              >
                <div className={`absolute -inset-2 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 ${ach.bg}`} />
                <div className={`w-16 h-16 rounded-2xl ${ach.bg} flex items-center justify-center border border-white/10 relative z-10`}>
                  <ach.icon className={`w-8 h-8 ${ach.color}`} />
                </div>
                <h4 className="text-lg font-bold text-white relative z-10">{ach.title}</h4>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Vision Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-600/20 to-blue-500/20 rounded-3xl blur-xl opacity-50" />
          <div className="glass p-10 md:p-16 rounded-3xl border border-white/10 text-center relative z-10 bg-[#0a0a0a]/60 backdrop-blur-2xl">
            <h3 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
              "My mission is to create meaningful technology products that inspire people and solve problems globally."
            </h3>
          </div>
        </motion.section>

        {/* Connect Section */}
        <motion.section 
          id="connect"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-8 pt-12 border-t border-white/5"
        >
          <h3 className="text-3xl font-bold text-white">Let's Build Together</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Whether it's a startup idea, a hackathon collaboration, or just geeking out over AI—I'm always open to connecting.
          </p>
          
          <div className="flex justify-center items-center gap-6">
            <a 
              href="mailto:mayank0522.s@gmail.com" 
              className="flex items-center gap-3 px-6 py-4 rounded-2xl glass border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] text-gray-200 hover:text-white"
            >
              <Mail className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email</p>
                <p className="font-medium">mayank0522.s@gmail.com</p>
              </div>
            </a>
            <a 
              href="https://www.linkedin.com/in/mayank-k-850255381?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-2xl glass border border-white/10 hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_0_30px_rgba(10,102,194,0.3)] text-gray-200 hover:text-white group"
            >
              <LinkedinIcon className="w-6 h-6 text-[#0A66C2]" />
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">LinkedIn</p>
                <p className="font-medium flex items-center gap-1">Connect <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></p>
              </div>
            </a>
          </div>
        </motion.section>

      </main>
      <Footer />
    </div>
  );
}
