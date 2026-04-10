import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ReviewAction } from "@/lib/rl-agent";
import { useTheme } from "./theme-provider";

interface ExplanationPanelProps {
  explanation: string;
  isExplaining: boolean;
  selectedAction: ReviewAction | null;
}

const ExplanationPanel = ({ explanation, isExplaining, selectedAction }: ExplanationPanelProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="flex flex-1 flex-col terminal-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-mono text-foreground">AI Explanation</span>
        {isExplaining && <Loader2 className="h-3 w-3 animate-spin text-primary ml-auto" />}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {!selectedAction && !explanation && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 opacity-30" />
            <span className="text-sm font-mono">Select an action and click "Explain"</span>
          </div>
        )}
        {explanation && (
          <div className={`prose prose-sm max-w-none prose-headings:font-mono prose-headings:text-primary prose-code:text-accent prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-secondary prose-pre:border prose-pre:border-border ${
            isDark ? "prose-invert" : ""
          }`}>
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        )}
        {isExplaining && !explanation && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-mono">Generating explanation...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationPanel;
