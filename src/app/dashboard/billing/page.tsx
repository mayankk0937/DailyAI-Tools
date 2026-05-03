"use client";

import { CheckCircle2, Zap, CreditCard, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-gray-400">Manage your DailyAI Pro subscription and credits.</p>
      </div>

      {/* Current Plan Overview */}
      <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-sm font-medium text-gray-300 mb-4 border border-white/10">
            <Zap className="w-4 h-4 text-yellow-500" />
            Current Plan: Free
          </div>
          <h2 className="text-2xl font-bold mb-1">Free Tier</h2>
          <p className="text-gray-400">You have 3 daily credits remaining today.</p>
        </div>
        <div className="text-right w-full md:w-auto">
          <Button variant="premium" className="w-full md:w-auto">
            Upgrade to Pro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Why Upgrade */}
        <div className="glass p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <h3 className="text-xl font-bold mb-4 text-primary">Why upgrade to Pro?</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited tool generations</li>
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-primary" /> No waiting time</li>
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Early access to new tools</li>
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Priority email support</li>
          </ul>
        </div>

        {/* Pricing Card */}
        <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="w-24 h-24" />
          </div>
          <h3 className="text-xl font-bold mb-2">DailyAI Pro</h3>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">₹99</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <p className="text-sm text-gray-400 mb-6 relative z-10">
            Billed securely via Razorpay. Cancel anytime.
          </p>
          <Button className="w-full bg-white text-black hover:bg-gray-200">
            Proceed to Payment
          </Button>
          <div className="mt-4 flex items-center justify-center gap-2">
             <span className="w-8 h-5 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-[10px] font-bold">UPI</span>
             <span className="w-8 h-5 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-[10px] font-bold">CARD</span>
          </div>
        </div>
      </div>

      {/* Invoice History placeholder */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" /> Invoice History
        </h3>
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-300">Date</th>
                <th className="px-6 py-4 font-medium text-gray-300">Amount</th>
                <th className="px-6 py-4 font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 font-medium text-gray-300">Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No payment history found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
