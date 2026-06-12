export type Score = "high-risk" | "concerning" | "ok" | "insufficient";

export interface Stat        { value: string; label: string; }
export interface Principle   { num: number; name: string; violation: string; evidence: string; }
export interface OwnershipQ  { question: string; before: string; after: string; assessment: "extractive" | "mixed" | "non-extractive"; }
export interface BottomLine  { dimension: string; impact: "positive" | "negative" | "mixed"; description: string; }
export interface SectionItem { label: string; desc: string; }
export interface Section     { eyebrow: string; heading: string; description: string; items: SectionItem[]; }

export interface CaseStudyData {
  id:           string;
  slug:         string;
  boardName:    string;
  category:     string;
  date:         string;
  published:    boolean;
  summary:      string;
  stats:        Stat[];
  principles:   Principle[];
  ownership:    OwnershipQ[];
  bottomLines:  BottomLine[];
  sections:     Section[];
  recommendations: string[];
  sources:      string[];
  sourceUrls:   string[];
  scoreTransparency:      Score;
  scoreConflicts:         Score;
  scoreMission:           Score;
  scoreDemocraticControl: Score;
  scoreOversight:         Score;
}

export const PRINCIPLE_NAMES = [
  "Voluntary and Open Membership",
  "Democratic Member Control",
  "Member Economic Participation",
  "Autonomy and Independence",
  "Education, Training, and Information",
  "Cooperation Among Cooperatives",
  "Concern for Community",
];

export const OWNERSHIP_QUESTIONS = [
  "Who owns it?",
  "Who has power?",
  "Who benefits?",
  "Who does the work?",
  "Who makes the rules?",
];

export const BOTTOM_LINE_DIMENSIONS = ["People", "Planet", "Prosperity", "Purpose"];

export const SCORE_LABELS: Record<Score, string> = {
  "high-risk":    "High risk",
  "concerning":   "Concerning",
  "ok":           "OK",
  "insufficient": "Insufficient data",
};

export const SCORE_COLORS: Record<Score, string> = {
  "high-risk":    "#c0392b",
  "concerning":   "#E8C84A",
  "ok":           "#4A9B8E",
  "insufficient": "rgba(154,176,200,0.4)",
};

export const SCORE_OPTIONS: Score[] = ["high-risk", "concerning", "ok", "insufficient"];

// Safe JSON casts from Prisma JsonValue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cast<T>(v: any, fallback: T): T {
  return (Array.isArray(v) || (v && typeof v === "object")) ? v as T : fallback;
}

export function defaultPrinciples(): Principle[] {
  return PRINCIPLE_NAMES.map((name, i) => ({ num: i + 1, name, violation: "", evidence: "" }));
}

export function defaultOwnership(): OwnershipQ[] {
  return OWNERSHIP_QUESTIONS.map(q => ({ question: q, before: "", after: "", assessment: "extractive" as const }));
}

export function defaultBottomLines(): BottomLine[] {
  return BOTTOM_LINE_DIMENSIONS.map(d => ({ dimension: d, impact: "negative" as const, description: "" }));
}
