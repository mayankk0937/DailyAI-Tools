"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Sparkles, FileText, Image as ImageIcon, 
  Video, Calculator, BookOpen, GraduationCap, 
  CheckCircle2, Zap, MessageSquare, Briefcase
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  const tools = [
    { icon: FileText, name: t("features", "resume"), desc: t("features", "resumeDesc"), color: "text-blue-400" },
    { icon: MessageSquare, name: t("features", "caption"), desc: t("features", "captionDesc"), color: "text-pink-400" },
    { icon: BookOpen, name: t("features", "summarizer"), desc: t("features", "summarizerDesc"), color: "text-purple-400" },
    { icon: ImageIcon, name: t("features", "ocr"), desc: t("features", "ocrDesc"), color: "text-yellow-400" },
    { icon: GraduationCap, name: t("features", "planner"), desc: t("features", "plannerDesc"), color: "text-green-400" },
    { icon: Video, name: t("features", "youtube"), desc: t("features", "youtubeDesc"), color: "text-red-400" },
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
        
        {/* HERO SECTION */}
        <section className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{t("nav", "tryNow")}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              {t("hero", "tagline").split(".")[0]}.<br/>
              <span className="text-gradient">{t("hero", "tagline").split(".")[1]}</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t("hero", "subtagline")}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <Button variant="premium" size="lg" className="w-full sm:w-auto text-lg group px-8">
                  Get Started Instantly
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                  {t("hero", "explore")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* MOCKUP / APP PREVIEW */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 mb-32"
        >
          <div className="relative rounded-2xl border border-white/10 glass p-2 overflow-hidden shadow-2xl shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-blue-500/10" />
            <div className="bg-[#0c0c0c] rounded-xl border border-white/5 overflow-hidden aspect-[16/9] flex items-center justify-center relative">
               <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10" />
               <div className="text-center z-10">
                 <Zap className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                 <h3 className="text-2xl font-bold text-gray-300">Intelligent Dashboard Experience</h3>
               </div>
            </div>
          </div>
        </motion.section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("features", "title")}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">{t("features", "subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-100">{tool.name}</h3>
                <p className="text-gray-400 text-sm">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <Link href="/dashboard">
               <Button variant="outline">View All 14 Tools</Button>
             </Link>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("testimonials", "title")}</h2>
             <p className="text-gray-400 max-w-xl mx-auto">{t("testimonials", "subtitle")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { name: "Aditya Sharma", role: "Engineering Student", text: "The Study Planner and YouTube to Notes tool are absolute life-savers during finals week. Highly recommended!" },
               { name: "Sarah J.", role: "Content Creator", text: "I use the Caption Generator for all my reels now. It's surprisingly good at picking up the viral tone I need." },
               { name: "Rahul K.", role: "Startup Founder", text: "Having 14+ AI tools in one dashboard is a game-changer. It's much more efficient than switching between multiple tabs." },
               { name: "Priya V.", role: "Freelance Designer", text: "The Resume Maker helped me land three interviews in a week. The templates are super professional and clean." },
               { name: "Jason L.", role: "Marketing Professional", text: "I use the PDF Summarizer for long research papers. It captures all the key points accurately in seconds." },
               { name: "Karthik R.", role: "Developer", text: "The OCR (Image to Text) tool is incredibly fast and accurate. Perfect for extracting code snippets from screenshots." }
             ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group"
                >
                   <div className="flex gap-1 text-yellow-500 mb-4">
                      {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                   </div>
                   <p className="text-gray-300 mb-6 font-medium leading-relaxed group-hover:text-white transition-colors italic">
                     "{item.text}"
                   </p>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                         <h4 className="font-bold text-sm text-white">{item.name}</h4>
                         <p className="text-xs text-gray-500">{item.role}</p>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </section>
        
        {/* FAQ SECTION */}
        <section className="py-20 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("faq", "title")}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">{t("faq", "subtitle")}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: t("faq", "q1"), a: t("faq", "a1") },
              { q: t("faq", "q2"), a: t("faq", "a2") },
              { q: t("faq", "q3"), a: t("faq", "a3") },
              { q: t("faq", "q4"), a: t("faq", "a4") }
            ].map((faq, i) => (
              <div key={i} className="glass p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold text-lg mb-2 text-white">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-20 rounded-[3rem] border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-blue-500/10 pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">Ready to boost your<br/><span className="text-gradient">productivity?</span></h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto relative z-10">Join thousands of students and professionals who are already using DailyAI to work smarter, not harder.</p>
            <Link href="/dashboard" className="relative z-10 inline-block">
              <Button variant="premium" size="lg" className="px-10 py-8 text-xl rounded-full">
                Start Using DailyAI For Free
              </Button>
            </Link>
          </motion.div>
        </section>

      </div>
      
      <Footer />
    </main>
  );
}
