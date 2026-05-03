import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function MarketplacePage() {
  const templates = [
    { title: "Software Engineer Resume", category: "Resume", rating: 4.9, uses: "12k" },
    { title: "Viral Hook Generator", category: "Social Media", rating: 4.8, uses: "8k" },
    { title: "Medical PDF Summarizer", category: "Education", rating: 4.9, uses: "5k" },
    { title: "Freelance Pitch Proposal", category: "Business", rating: 4.7, uses: "15k" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Marketplace</h1>
            <p className="text-gray-400">Discover premium AI prompt templates built by experts.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none">
              <option>All Categories</option>
              <option>Resumes</option>
              <option>Social Media</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex flex-col">
              <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">{template.category}</div>
              <h3 className="font-bold text-lg mb-4 text-white flex-1">{template.title}</h3>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                <span className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" /> {template.rating}</span>
                <span>{template.uses} uses</span>
              </div>
              <Button variant="secondary" className="w-full">Use Template</Button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
