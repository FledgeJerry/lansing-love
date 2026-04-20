"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Option, Outcome, Question } from "@prisma/client";

type OptionWithCount = Option & { _count: { predictions: number } };
type OutcomeWithOption = Outcome & { option: Option };
type QuestionWithDetails = Question & {
  options: OptionWithCount[];
  _count: { predictions: number };
  outcome: OutcomeWithOption | null;
};

export default function QuestionCard({
  question,
  userPickId,
  isLoggedIn,
}: {
  question: QuestionWithDetails;
  userPickId: string | null;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(userPickId);
  const [loading, setLoading] = useState(false);

  const total = question._count.predictions;
  const isResolved = question.status === "RESOLVED";
  const isClosed = question.status === "CLOSED";
  const canPredict = isLoggedIn && question.status === "ACTIVE";

  async function predict(optionId: string) {
    if (!canPredict || loading) return;
    setLoading(true);
    await fetch(`/api/questions/${question.id}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    setPicked(optionId);
    setLoading(false);
    router.refresh();
  }

  const statusBadge = isResolved
    ? <span className="badge badge--teal">Resolved</span>
    : isClosed
    ? <span className="badge badge--muted">Closed</span>
    : <span className="badge badge--gold">Open</span>;

  return (
    <div className="prediction-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <h3 className="prediction-card__question" style={{ margin: 0 }}>{question.title}</h3>
        {statusBadge}
      </div>

      {question.description && (
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
          {question.description}
        </p>
      )}
      {question.category && (
        <span className="eyebrow" style={{ marginBottom: "1rem" }}>{question.category}</span>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
        {question.options.map((opt) => {
          const pct = total > 0 ? Math.round((opt._count.predictions / total) * 100) : 0;
          const isCorrect = question.outcome?.optionId === opt.id;
          const isMyPick = picked === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => predict(opt.id)}
              disabled={!canPredict || loading}
              className={`vote-pill${isMyPick ? " selected" : ""}${isCorrect ? " correct" : ""}`}
              style={{ flexDirection: "column", alignItems: "stretch", borderRadius: "8px", padding: "0.6rem 0.875rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 500 }}>
                  {opt.label}
                  {isMyPick && !isCorrect && <span style={{ fontSize: "0.75rem", marginLeft: "0.4rem", opacity: 0.8 }}>★ your pick</span>}
                  {isCorrect && <span style={{ fontSize: "0.75rem", marginLeft: "0.4rem" }}>✓ correct</span>}
                </span>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>{pct}%</span>
              </div>
              <div className="prediction-bar__track">
                <div
                  className={`prediction-bar__fill${isCorrect ? " prediction-bar__fill--teal" : ""}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          {total} prediction{total !== 1 ? "s" : ""}
          {question.closeAt && !isResolved && (
            <> · closes {new Date(question.closeAt).toLocaleDateString()}</>
          )}
          {isResolved && question.outcome && (
            <> · <span style={{ color: "var(--color-teal-accent)" }}>{question.outcome.option.label}</span></>
          )}
        </span>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {question.sourceUrl && (
            <a
              href={question.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.8rem", color: "var(--color-dome-gold)" }}
              onClick={(e) => e.stopPropagation()}
            >
              Learn more →
            </a>
          )}
          {!isLoggedIn && (
            <span style={{ fontSize: "0.8rem", color: "var(--color-dome-gold)" }}>Sign in to predict</span>
          )}
        </div>
      </div>
    </div>
  );
}
