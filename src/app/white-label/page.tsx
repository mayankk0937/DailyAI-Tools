import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Palette, Globe, ShieldCheck } from "lucide-react";

export default function WhiteLabelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">White-Label Solutions</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Launch your own AI SaaS in minutes. Your brand, your domain, our powerful AI infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-8 rounded-3xl border border-white/5">
            <Palette className="w-10 h-10 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Custom Branding</h3>
            <p className="text-gray-400 text-sm">Add your logo, choose your colors, and fully customize the UI to match your brand identity.</p>
          </div>
          <div className="glass p-8 rounded-3xl border border-white/5">
            <Globe className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Custom Domain</h3>
            <p className="text-gray-400 text-sm">Host the platform on your own domain (e.g., ai.yourcompany.com) with automatic SSL.</p>
          </div>
          <div className="glass p-8 rounded-3xl border border-white/5">
            <ShieldCheck className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Keep 100% Revenue</h3>
            <p className="text-gray-400 text-sm">Connect your own Stripe or Razorpay account and keep 100% of your user's subscription fees.</p>
          </div>
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">Contact Sales for Pricing</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
