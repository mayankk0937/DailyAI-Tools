import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>
        <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 text-gray-300">
          <p className="text-sm text-gray-500">Last updated: May 2026</p>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using DailyAI Tools, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Subscription & Credits</h2>
            <p>Free tier users receive daily credits that reset every 24 hours. Pro and Team subscriptions are billed monthly or annually and automatically renew unless canceled.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Acceptable Use</h2>
            <p>You agree not to use our services to generate illegal, harmful, or abusive content. We reserve the right to suspend accounts that violate these guidelines.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
