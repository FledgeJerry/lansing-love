import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const questions = await prisma.question.findMany({
    where: { status: { in: ["ACTIVE", "RESOLVED"] } },
    include: {
      options: {
        include: { _count: { select: { predictions: true } } },
      },
      _count: { select: { predictions: true } },
      outcome: { include: { option: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const userPredictions = session
    ? await prisma.prediction.findMany({
        where: { userId: session.user.id },
        select: { questionId: true, optionId: true },
      })
    : [];

  const predictionMap = Object.fromEntries(
    userPredictions.map((p: { questionId: string; optionId: string }) => [p.questionId, p.optionId])
  );

  const open = questions.filter((q) => q.status === "ACTIVE");
  const closed = questions.filter((q) => q.status !== "ACTIVE");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "0.25rem" }}>Lansing Predictions</h1>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            What do you think will happen in our city?
          </p>
        </div>
        {session ? (
          <Link href="/submit" className="btn btn--primary btn--sm" style={{ whiteSpace: "nowrap" }}>
            Submit a question
          </Link>
        ) : (
          <Link href="/register" className="btn btn--secondary btn--sm" style={{ whiteSpace: "nowrap" }}>
            Join to predict
          </Link>
        )}
      </div>

      {open.length === 0 && closed.length === 0 ? (
        <p style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-muted)" }}>
          No active predictions yet.
        </p>
      ) : (
        <>
          {open.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <span className="eyebrow">Open for voting</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {open.map((q) => (
                  <QuestionCard key={q.id} question={q} userPickId={predictionMap[q.id] ?? null} isLoggedIn={!!session} />
                ))}
              </div>
            </section>
          )}
          {closed.length > 0 && (
            <section>
              <span className="eyebrow">Closed</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {closed.map((q) => (
                  <QuestionCard key={q.id} question={q} userPickId={predictionMap[q.id] ?? null} isLoggedIn={!!session} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
