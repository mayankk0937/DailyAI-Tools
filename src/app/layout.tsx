import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "DailyAI Tools | One Website. Unlimited Daily Tools.",
  description: "Resume, Captions, Notes, Summaries, OCR, Planners, YouTube Notes & more powered by AI.",
  keywords: ["AI Tools", "Resume Maker", "PDF Summarizer", "AI Caption Generator", "Study Planner", "SaaS"],
  openGraph: {
    title: "DailyAI Tools | The Ultimate AI Toolkit",
    description: "One Website. Unlimited Daily Tools. Join 10,000+ creators.",
    url: "https://dailyai-tools.com",
    siteName: "DailyAI Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyAI Tools",
    description: "One Website. Unlimited Daily Tools.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
