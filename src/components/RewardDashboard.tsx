import { BarChart3, TrendingUp } from "lucide-react";
import type { Episode } from "@/lib/rl-agent";

interface RewardDashboardProps {
  episodes: Episode[];
  stats: { totalEpisodes: number; avgReward: number; epsilon: number; qTableSize: number };
}

const RewardDashboard = ({ episodes, stats }: RewardDashboardProps) => {
  const recentEpisodes = episodes.slice(-20);
  const maxReward = Math.max(1, ...recentEpisodes.map((e) => Math.abs(e.totalReward)));

  return (
    <div className="terminal-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <span className="text-sm font-mono text-foreground">Reward History</span>
        <TrendingUp className="h-3 w-3 text-muted-foreground ml-auto" />
        <span className="text-xs font-mono text-muted-foreground">Last {recentEpisodes.length} episodes</span>
      </div>
      <div className="p-3">
        {recentEpisodes.length === 0 ? (
          <div className="text-center text-xs font-mono text-muted-foreground py-4">
            No episodes yet — run a review to start training
          </div>
        ) : (
          <div className="flex items-end gap-1 h-16">
            {recentEpisodes.map((ep) => {
              const height = Math.max(4, (Math.abs(ep.totalReward) / maxReward) * 100);
              const isPositive = ep.totalReward >= 0;
              return (
                <div
                  key={ep.id}
                  className="flex-1 group relative"
                  title={`Episode ${ep.id}: ${ep.totalReward}`}
                >
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      isPositive ? "bg-success" : "bg-destructive"
                    } opacity-70 hover:opacity-100`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardDashboard;
