"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Option, Outcome, Question } from "@prisma/client";

type OptionWithCount = Option & { _count: { predictions: number; desires: number } };
type OutcomeWithOption = Outcome & { option: Option };
type QuestionWithDetails = Question & {
  options: OptionWithCount[];
  _count: { predictions: number };
  outcome: OutcomeWithOption | null;
  sourceUrl?: string | null;
  sourceText?: string | null;
};

export default function QuestionCard({
  question,
  userPickId,
  userDesiredId,
  isLoggedIn,
}: {
  question: QuestionWithDetails;
  userPickId: string | null;
  userDesiredId: string | null;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(userPickId);
  const [desired, setDesired] = useState<string | null>(userDesiredId);
  const [loading, setLoading] = useState(false);

  const total = question._count.predictions;
  const totalDesires = question.options.reduce((sum, o) => sum + o._count.desires, 0);
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

  async function saveDesire(optionId: string) {
    if (!canPredict || loading || !picked) return;
    setLoading(true);
    await fetch(`/api/questions/${question.id}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ desiredId: optionId }),
    });
    setDesired(optionId);
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
      {question.sourceText && (
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem", fontStyle: "italic" }}>
          {question.sourceText}
        </p>
      )}
      {question.category && (
        <span className="eyebrow" style={{ marginBottom: "1rem" }}>{question.category}</span>
      )}

      {/* Prediction section */}
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

      {/* Desire section */}
      {(totalDesires > 0 || (canPredict && picked)) && (
        <div style={{ marginTop: "1rem", paddingTop: "0.875rem", borderTop: "1px solid var(--color-border)" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9B72CF", margin: "0 0 0.5rem" }}>
            Community wants
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {question.options.map((opt) => {
              const dPct = totalDesires > 0 ? Math.round((opt._count.desires / totalDesires) * 100) : 0;
              const isMyDesire = desired === opt.id;
              const clickable = canPredict && !!picked;

              return (
                <button
                  key={opt.id}
                  onClick={() => saveDesire(opt.id)}
                  disabled={!clickable || loading}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    background: isMyDesire ? "rgba(155,114,207,0.12)" : "transparent",
                    border: `1px solid ${isMyDesire ? "#9B72CF" : "rgba(155,114,207,0.25)"}`,
                    borderRadius: "8px",
                    padding: "0.6rem 0.875rem",
                    cursor: clickable ? "pointer" : "default",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: isMyDesire ? "#9B72CF" : "var(--color-text-secondary)" }}>
                      {opt.label}
                      {isMyDesire && <span style={{ fontSize: "0.75rem", marginLeft: "0.4rem", opacity: 0.8 }}>♥ your want</span>}
                    </span>
                    {totalDesires > 0 && (
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{dPct}%</span>
                    )}
                  </div>
                  {totalDesires > 0 && (
                    <div className="prediction-bar__track">
                      <div style={{ height: "100%", width: `${dPct}%`, background: "#9B72CF", borderRadius: "2px", transition: "width 0.3s ease" }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {canPredict && !picked && (
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
              Make a prediction above to share what you want.
            </p>
          )}
        </div>
      )}

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
