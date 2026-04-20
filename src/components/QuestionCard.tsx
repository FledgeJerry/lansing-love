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
  const isClosed = question.closeAt ? new Date(question.closeAt) < new Date() : false;
  const canPredict = isLoggedIn && !isResolved && !isClosed;

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h2 className="font-semibold text-base">{question.title}</h2>
        <span
          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
            isResolved
              ? "bg-green-100 text-green-700"
              : isClosed
              ? "bg-yellow-100 text-yellow-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isResolved ? "Resolved" : isClosed ? "Closed" : "Active"}
        </span>
      </div>
      {question.description && (
        <p className="text-sm text-gray-500 mb-3">{question.description}</p>
      )}
      {question.category && (
        <span className="text-xs text-gray-400 mb-3 block">{question.category}</span>
      )}

      <div className="space-y-2 mt-3">
        {question.options.map((opt) => {
          const pct = total > 0 ? Math.round((opt._count.predictions / total) * 100) : 0;
          const isCorrect = question.outcome?.optionId === opt.id;
          const isMyPick = picked === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => predict(opt.id)}
              disabled={!canPredict || loading}
              className={`w-full text-left rounded overflow-hidden border transition-colors ${
                isMyPick ? "border-rose-500" : "border-gray-200"
              } ${canPredict ? "hover:border-rose-400 cursor-pointer" : "cursor-default"}`}
            >
              <div className="relative px-3 py-2">
                {/* progress bar background */}
                <div
                  className={`absolute inset-0 ${
                    isCorrect
                      ? "bg-green-100"
                      : isMyPick
                      ? "bg-rose-50"
                      : "bg-gray-50"
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex justify-between text-sm">
                  <span className="font-medium">
                    {opt.label}
                    {isMyPick && <span className="ml-1 text-rose-500 text-xs">★ your pick</span>}
                    {isCorrect && <span className="ml-1 text-green-600 text-xs">✓ correct</span>}
                  </span>
                  <span className="text-gray-500">{pct}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {total} prediction{total !== 1 ? "s" : ""}
        {question.closeAt && !isResolved && (
          <> · closes {new Date(question.closeAt).toLocaleDateString()}</>
        )}
        {isResolved && question.outcome && (
          <> · resolved: <span className="text-green-600">{question.outcome.option.label}</span></>
        )}
      </p>

      {!isLoggedIn && (
        <p className="text-xs text-rose-500 mt-2">Sign in to make a prediction</p>
      )}
    </div>
  );
}
