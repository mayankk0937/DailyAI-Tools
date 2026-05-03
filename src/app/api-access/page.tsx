import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Code2, Key, Zap } from "lucide-react";

export default function APIAccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">DailyAI API</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Integrate our powerful suite of 14+ AI tools directly into your own applications with just a few lines of code.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-8 rounded-3xl border border-white/5">
            <Key className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
            <p className="text-gray-400 text-sm">Generate API keys from your dashboard and authenticate seamlessly.</p>
          </div>
          <div className="glass p-8 rounded-3xl border border-white/5">
            <Zap className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Blazing Fast</h3>
            <p className="text-gray-400 text-sm">Powered by optimized edge infrastructure and direct LLM integrations.</p>
          </div>
          <div className="glass p-8 rounded-3xl border border-white/5">
            <Code2 className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Developer Friendly</h3>
            <p className="text-gray-400 text-sm">Comprehensive documentation and SDKs for Node.js, Python, and React.</p>
          </div>
        </div>

        <div className="glass p-10 rounded-3xl border border-primary/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start building?</h2>
          <p className="text-gray-400 mb-8">API Access is available exclusively on the Team Plan.</p>
          <Button variant="premium" size="lg">Upgrade to Team Plan</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
