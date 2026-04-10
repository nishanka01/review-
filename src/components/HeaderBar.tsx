import { Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderBarProps {
  stats: { totalEpisodes: number; avgReward: number; epsilon: number; qTableSize: number };
  onTrainBatch: () => void;
  onResetTask: (taskId: string) => void;
  language: "python" | "javascript";
  onLanguageChange: (lang: "python" | "javascript") => void;
  isTraining: boolean;
}

const HeaderBar = ({ stats, onTrainBatch, onResetTask, language, onLanguageChange, isTraining }: HeaderBarProps) => {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold font-mono text-foreground">
            OpenEnv Reviewer
          </h1>
        </div>
        
        <div className="flex items-center gap-1 ml-6 bg-muted p-1 rounded-md">
           <Button 
            size="sm" 
            variant={language === "python" ? "default" : "ghost"} 
            onClick={() => onLanguageChange("python")} 
            className="text-[10px] h-6 px-3"
           >Python</Button>
           <Button 
            size="sm" 
            variant={language === "javascript" ? "default" : "ghost"} 
            onClick={() => onLanguageChange("javascript")} 
            className="text-[10px] h-6 px-3"
           >JS/TS</Button>
        </div>

        <div className="flex gap-2 ml-4">
          <Button size="sm" variant="secondary" onClick={() => onResetTask(language === "python" ? "task_1" : "js_task_1")} className="text-[10px] h-6">Task: Easy</Button>
          <Button size="sm" variant="secondary" onClick={() => onResetTask(language === "python" ? "task_2" : "js_task_2")} className="text-[10px] h-6">Task: Medium</Button>
          <Button size="sm" variant="secondary" onClick={() => onResetTask(language === "python" ? "task_3" : "js_task_3")} className="text-[10px] h-6">Task: Hard</Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Episodes: <span className="text-foreground">{stats.totalEpisodes}</span></span>
          <span>Avg Reward: <span className={stats.avgReward >= 0 ? "text-success" : "text-destructive"}>{stats.avgReward}</span></span>
          <span>Tasks: <span className="text-foreground">{stats.qTableSize}</span></span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default HeaderBar;
