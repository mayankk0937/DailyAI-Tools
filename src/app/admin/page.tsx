import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Users, CreditCard, Activity, TrendingUp, Search } from "lucide-react";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // Fetch real stats
  const { count: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: proUsersCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("plan_id", "pro");

  const { count: toolsUsed } = await supabase
    .from("tool_usage")
    .select("*", { count: "exact", head: true });

  // API Cost Estimation Logic (Based on multi-provider pricing)
  // Groq/OpenRouter average $0.2 per 1M tokens. OpenAI average $0.5.
  // We estimate an average cost of ₹0.05 per tool usage.
  const estimatedCost = (toolsUsed || 0) * 0.05;

  // Dummy revenue for now (could calculate from subscriptions)
  const estimatedRevenue = (proUsersCount || 0) * 99;
  const netProfit = estimatedRevenue - estimatedCost;

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome, Mayank. Here's what's happening on DailyAI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={usersCount?.toString() || "0"} icon={Users} color="text-blue-400" />
        <StatCard title="Total Tools Used" value={toolsUsed?.toString() || "0"} icon={Activity} color="text-green-400" />
        <StatCard title="Estimated API Cost" value={`₹${estimatedCost.toFixed(2)}`} icon={TrendingUp} color="text-red-400" />
        <StatCard title="Net Profit" value={`₹${netProfit.toFixed(2)}`} icon={TrendingUp} color="text-pink-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/5">
          <h2 className="text-xl font-bold mb-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 border-b border-white/5 text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* We would fetch recent users here. Mocking for UI visual completeness if no users exist yet */}
                <tr className="border-b border-white/5">
                  <td className="px-4 py-3">mayank0522.s@gmail.com</td>
                  <td className="px-4 py-3">Today</td>
                  <td className="px-4 py-3"><span className="text-green-400">Admin</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium">Send Announcement</span>
              <Search className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium">Export Data (CSV)</span>
              <Search className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="glass p-6 rounded-2xl border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
