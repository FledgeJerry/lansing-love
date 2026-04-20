"use client";

import { useState } from "react";
import QuestionCard from "./QuestionCard";
import type { Option, Outcome, Question } from "@prisma/client";

type OptionWithCount = Option & { _count: { predictions: number } };
type OutcomeWithOption = Outcome & { option: Option };
type QuestionWithDetails = Question & {
  options: OptionWithCount[];
  _count: { predictions: number };
  outcome: OutcomeWithOption | null;
};

export default function QuestionFeed({
  questions,
  predictionMap,
  isLoggedIn,
}: {
  questions: QuestionWithDetails[];
  predictionMap: Record<string, string>;
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

  const open = filtered.filter((q) => q.status === "ACTIVE");
  const awaiting = filtered.filter((q) => q.status === "CLOSED");
  const resolved = filtered.filter((q) => q.status === "RESOLVED");

  if (questions.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-muted)" }}>
        No active predictions yet.
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

      {open.length === 0 && awaiting.length === 0 && resolved.length === 0 ? (
        <p style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-muted)" }}>
          No predictions in this category yet.
        </p>
      ) : (
        <>
          {open.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <span className="eyebrow">Open for voting</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {open.map((q) => (
                  <QuestionCard key={q.id} question={q} userPickId={predictionMap[q.id] ?? null} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </section>
          )}
          {awaiting.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <span className="eyebrow">Awaiting resolution</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {awaiting.map((q) => (
                  <QuestionCard key={q.id} question={q} userPickId={predictionMap[q.id] ?? null} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </section>
          )}
          {resolved.length > 0 && (
            <section>
              <span className="eyebrow">Resolved</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {resolved.map((q) => (
                  <QuestionCard key={q.id} question={q} userPickId={predictionMap[q.id] ?? null} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
