import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

interface ToolTemplateProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: ReactNode;
  result?: ReactNode;
  isGenerating?: boolean;
  onGenerate?: () => void;
  provider?: string;
  hideGenerateButton?: boolean;
}

export function ToolTemplate({
  title,
  description,
  icon: Icon,
  children,
  result,
  isGenerating,
  onGenerate,
  provider,
  hideGenerateButton,
}: ToolTemplateProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Icon className="w-6 h-6 text-primary" /> {title}
            </h1>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-4 h-4" /> Smart Allocation Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[calc(100vh-180px)] lg:min-h-[600px]">
        {/* Input Column */}
        <div className="glass p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col h-auto lg:h-full lg:overflow-hidden">
          <div className="flex-1 space-y-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            {children}
          </div>
          
          {!hideGenerateButton && (
            <div className="pt-6 mt-6 border-t border-white/10">
              <Button 
                variant="premium" 
                className="w-full h-12 text-lg font-medium shadow-xl shadow-primary/20"
                onClick={onGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    DailyAI is thinking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Ask DailyAI
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Output Column */}
        <div className="glass p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col h-auto lg:h-full relative lg:overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Result
            </h3>
            {provider && (
              <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">
                ⚡ Powered by DailyAI
              </span>
            )}
          </div>
          
          <div className="flex-1 bg-black/50 rounded-xl border border-white/5 p-4 relative lg:overflow-y-auto custom-scrollbar min-h-[300px] lg:min-h-0">
            {isGenerating && (
              <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                 <div className="text-center space-y-3">
                   <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                   <p className="text-xs text-gray-400 animate-pulse">DailyAI is finding the best answer...</p>
                 </div>
              </div>
            )}
            {result ? (
              result
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center opacity-50">
                <Icon className="w-16 h-16 mb-4 text-gray-500" />
                <p className="text-gray-400">Ask DailyAI anything on the left and watch the magic happen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
