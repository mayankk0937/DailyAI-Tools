import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 text-gray-300">
          <p className="text-sm text-gray-500">Last updated: May 2026</p>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Information</h2>
            <p>We use the information we collect about you to provide, maintain, and improve our services, including to process transactions, send related information, and provide customer support.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. AI Processing</h2>
            <p>When you use our AI tools (e.g., Resume Maker, PDF Summarizer), your inputs are processed securely by our AI partners (e.g., OpenAI, Google Gemini). We do not use your personal inputs to train public AI models.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
