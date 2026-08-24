export type ActionStatus = "open" | "in_progress" | "done" | "blocked";
export type ActionHorizon = "immediate" | "near_term" | "structural";
export type ActionSourceType = "case" | "pattern" | "roadmap";

export const ACTION_STATUSES: ActionStatus[] = ["open", "in_progress", "done", "blocked"];
export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  done: "Done",
  blocked: "Blocked",
};
export const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  open: "#9AB0C8",
  in_progress: "#E8C84A",
  done: "#4A9B8E",
  blocked: "#c0392b",
};

export const ACTION_HORIZONS: ActionHorizon[] = ["immediate", "near_term", "structural"];
export const ACTION_HORIZON_LABELS: Record<ActionHorizon, string> = {
  immediate: "Immediate",
  near_term: "Near-term",
  structural: "Structural",
};

// Same domain vocabulary as Entity/HistoryEvent.domains, for cross-site filtering
export const ACTION_SUBJECTS = [
  "housing", "food", "healthcare", "labor", "governance", "education",
  "environment", "energy", "justice", "technology",
];

export interface ActionItemData {
  id: string;
  title: string;
  description: string | null;
  status: ActionStatus;
  horizon: ActionHorizon | null;
  subjects: string[];
  dueDate: string | null;
  responsible: string | null;
  sourceType: ActionSourceType | null;
  sourceSlug: string | null;
  sourcePhase: string | null;
  closedAt: string | null;
  closedNote: string | null;
  sortOrder: number;
}
