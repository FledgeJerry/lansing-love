import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const resolvedQuestions = await prisma.question.findMany({
    where: { status: "RESOLVED" },
    include: {
      outcome: true,
      predictions: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
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

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <h1 style={{ marginBottom: "0.25rem" }}>Leaderboard</h1>
      <p style={{ marginBottom: "2rem" }}>Who knows Lansing best? Ranked by correct predictions.</p>

      {leaderboard.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
            No resolved predictions yet — check back soon.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="ll-table">
            <thead>
              <tr>
                <th style={{ width: "3rem" }}>#</th>
                <th>Predictor</th>
                <th style={{ textAlign: "right" }}>Correct</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th style={{ textAlign: "right" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-serif)" }}>
                    {medals[i] ?? i + 1}
                  </td>
                  <td style={{ color: "var(--color-limestone)", fontWeight: i < 3 ? 600 : 400 }}>
                    {u.name ?? u.email.split("@")[0]}
                  </td>
                  <td style={{ textAlign: "right", color: "var(--color-teal-accent)", fontWeight: 600 }}>{u.correct}</td>
                  <td style={{ textAlign: "right" }}>{u.total}</td>
                  <td style={{ textAlign: "right" }}>
                    <span className={`badge ${u.accuracy >= 70 ? "badge--teal" : u.accuracy >= 50 ? "badge--gold" : "badge--muted"}`}>
                      {u.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
        {resolvedQuestions.length} resolved question{resolvedQuestions.length !== 1 ? "s" : ""} scored so far.
      </p>
    </div>
  );
}
