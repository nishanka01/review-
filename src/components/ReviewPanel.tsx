import { ShieldCheck, AlertTriangle, Info, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReviewAction } from "@/lib/rl-agent";

interface ReviewPanelProps {
  actions: ReviewAction[];
  isReviewing: boolean;
  selectedAction: ReviewAction | null;
  onExplain: (action: ReviewAction) => void;
}

const severityConfig = {
  error: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  info: { icon: Info, color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/30" },
};

const ReviewPanel = ({ actions, isReviewing, selectedAction, onExplain }: ReviewPanelProps) => {
  return (
    <div className="flex flex-1 flex-col terminal-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="text-sm font-mono text-foreground">Agent Review Actions</span>
        {actions.length > 0 && (
          <span className="ml-auto text-xs font-mono text-muted-foreground">
            {actions.length} actions • Total reward:{" "}
            <span className={actions.reduce((s, a) => s + a.reward, 0) >= 0 ? "text-success" : "text-destructive"}>
              {actions.reduce((s, a) => s + a.reward, 0)}
            </span>
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {isReviewing && (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-mono text-sm">Agent analyzing code...</span>
          </div>
        )}
        {!isReviewing && actions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <ShieldCheck className="h-8 w-8 opacity-30" />
            <span className="text-sm font-mono">Click "Review Code" to start</span>
          </div>
        )}
        {actions.map((action, i) => {
          const config = severityConfig[action.severity];
          const Icon = config.icon;
          const isSelected = selectedAction?.type === action.type;
          return (
            <div
              key={i}
              className={`rounded-md border p-3 transition-all ${config.border} ${config.bg} ${
                isSelected ? "ring-1 ring-primary" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold font-mono ${config.color}`}>{action.label}</span>
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        action.reward >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      }`}>
                        {action.reward >= 0 ? "+" : ""}{action.reward}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        conf: {Math.round(action.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onExplain(action)}
                  className="gap-1 text-xs font-mono shrink-0"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  Explain
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewPanel;
