import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    { title: "How to Write a Resume that Beats ATS in 2026", date: "May 1, 2026", category: "Career" },
    { title: "The Ultimate Guide to Viral Instagram Captions", date: "April 28, 2026", category: "Social Media" },
    { title: "How Students are Saving 10+ Hours a Week with AI Summaries", date: "April 15, 2026", category: "Productivity" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">DailyAI Blog</h1>
        <p className="text-gray-400 text-center mb-16">Tips, updates, and tutorials on maximizing your AI productivity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-full">
              <div className="w-full aspect-video bg-white/5 rounded-xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              </div>
              <span className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{post.category}</span>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-6 mt-auto">{post.date}</p>
              <Link href="#" className="flex items-center text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
