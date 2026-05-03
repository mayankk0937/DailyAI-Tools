import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Refund Policy</h1>
        <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 text-gray-300">
          <p className="text-sm text-gray-500">Last updated: May 2026</p>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7-Day Money-Back Guarantee</h2>
            <p>We want you to be fully satisfied with DailyAI Pro. If you are not satisfied with your subscription, you may request a full refund within 7 days of your initial purchase.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Renewals</h2>
            <p>Refunds are not automatically provided for subscription renewals. Please ensure you cancel your subscription before the renewal date if you do not wish to continue.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to Request a Refund</h2>
            <p>To request a refund, please contact our support team via the Contact page with your account email and receipt.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
