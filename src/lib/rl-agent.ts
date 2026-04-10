export type ReviewAction = {
  type: string;
  label: string;
  description: string;
  confidence: number;
  severity: "error" | "warning" | "info" | "success";
  reward: number;
  details?: string;
};

export type Episode = {
  id: number;
  reward: number;
  totalReward: number;
};
