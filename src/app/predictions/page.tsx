import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import QuestionFeed from "@/components/QuestionFeed";
import Link from "next/link";

export default async function Home() {
  const session = await auth().catch(() => null);

  const questions = await prisma.question.findMany({
    where: { status: "ACTIVE" },
    include: {
      options: {
        include: { _count: { select: { predictions: true, desires: true } } },
      },
      _count: { select: { predictions: true, comments: true } },
      outcome: { include: { option: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const userPredictions = session
    ? await prisma.prediction.findMany({
        where: { userId: session.user.id },
        select: { questionId: true, optionId: true, desiredId: true },
      })
    : [];

  const predictionMap = Object.fromEntries(
    userPredictions.map((p) => [p.questionId, p.optionId])
  );
  const desiredMap = Object.fromEntries(
    userPredictions.filter((p) => p.desiredId).map((p) => [p.questionId, p.desiredId!])
  );

  return (
    <div>
      <img
        src="/lansing-love-banner.svg"
        alt="Lansing Love"
        style={{ width: "100%", display: "block", marginBottom: "2rem" }}
      />
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

      <QuestionFeed questions={questions} predictionMap={predictionMap} desiredMap={desiredMap} isLoggedIn={!!session} />
    </div>
  );
}
