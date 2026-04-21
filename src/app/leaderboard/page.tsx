import { prisma } from "@/lib/prisma";
import LeaderboardTabs from "@/components/LeaderboardTabs";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const resolvedQuestions = await prisma.question.findMany({
    where: { status: "RESOLVED" },
    include: {
      outcome: { include: { option: true } },
      predictions: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const scores: Record<string, { id: string; name: string | null; email: string; correct: number; total: number }> = {};

  for (const q of resolvedQuestions) {
    if (!q.outcome) continue;
    for (const p of q.predictions) {
      const uid = p.user.id;
      if (!scores[uid]) scores[uid] = { id: uid, name: p.user.name, email: p.user.email, correct: 0, total: 0 };
      scores[uid].total++;
      if (p.optionId === q.outcome.optionId) scores[uid].correct++;
    }
  }

  const leaderboard = Object.values(scores)
    .map((u) => ({ ...u, accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0 }))
    .sort((a, b) => b.correct - a.correct || b.accuracy - a.accuracy);

  const resolvedForTab = resolvedQuestions.map((q) => ({
    id: q.id,
    title: q.title,
    category: q.category,
    outcomeLabel: q.outcome?.option.label ?? null,
    outcomeNotes: q.outcome?.notes ?? null,
    predictionCount: q.predictions.length,
    resolvedAt: q.outcome?.resolvedAt?.toISOString() ?? null,
  }));

  return (
    <div>
      <h1 style={{ marginBottom: "0.25rem" }}>Leaderboard</h1>
      <p style={{ marginBottom: "2rem" }}>Who knows Lansing best?</p>
      <LeaderboardTabs
        leaderboard={leaderboard}
        resolvedCount={resolvedQuestions.length}
        resolvedQuestions={resolvedForTab}
      />
    </div>
  );
}
