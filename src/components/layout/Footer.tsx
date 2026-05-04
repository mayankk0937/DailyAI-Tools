import Link from "next/link";
import { Sparkles, Globe, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/50">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                DailyAI Tools
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              One Website. Unlimited Daily Tools. Resume, Captions, Notes, Summaries, OCR, Planners & more powered by AI.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Tools</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/dashboard/resume" className="hover:text-primary transition-colors">Resume Maker</Link></li>
              <li><Link href="/dashboard/caption" className="hover:text-primary transition-colors">Caption Generator</Link></li>
              <li><Link href="/dashboard/pdf" className="hover:text-primary transition-colors">PDF Summarizer</Link></li>
              <li><Link href="/dashboard/study" className="hover:text-primary transition-colors">Study Planner</Link></li>
              <li><Link href="/dashboard/youtube" className="hover:text-primary transition-colors">YouTube to Notes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DailyAI Tools. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">English</Link>
            <Link href="#" className="hover:text-white transition-colors">Hindi</Link>
            <Link href="#" className="hover:text-white transition-colors">Hinglish</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
