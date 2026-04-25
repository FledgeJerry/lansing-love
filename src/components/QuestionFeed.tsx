"use client";

import { useState } from "react";
import QuestionCard from "./QuestionCard";
import type { Option, Outcome, Question } from "@prisma/client";

type OptionWithCount = Option & { _count: { predictions: number; desires: number } };
type OutcomeWithOption = Outcome & { option: Option };
type QuestionWithDetails = Question & {
  options: OptionWithCount[];
  _count: { predictions: number };
  outcome: OutcomeWithOption | null;
};

export default function QuestionFeed({
  questions,
  predictionMap,
  desiredMap,
  isLoggedIn,
}: {
  questions: QuestionWithDetails[];
  predictionMap: Record<string, string>;
  desiredMap: Record<string, string>;
  isLoggedIn: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(questions.map((q) => q.category || "Other"))).sort(),
  ];

  const filtered =
    activeCategory === "All"
      ? questions
      : questions.filter((q) => (q.category || "Other") === activeCategory);

  if (questions.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-muted)" }}>
        No active predictions yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {categories.map((cat) => {
          const count =
            cat === "All"
              ? questions.length
              : questions.filter((q) => (q.category || "Other") === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn--sm ${activeCategory === cat ? "btn--primary" : "btn--secondary"}`}
            >
              {cat} <span style={{ opacity: 0.65 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-muted)" }}>
          No active predictions in this category.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              userPickId={predictionMap[q.id] ?? null}
              userDesiredId={desiredMap[q.id] ?? null}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </>
  );
}
