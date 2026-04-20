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

  const scores: Record<
    string,
    { id: string; name: string | null; email: string; correct: number; total: number }
  > = {};

  for (const q of resolvedQuestions) {
    if (!q.outcome) continue;
    for (const p of q.predictions) {
      const uid = p.user.id;
      if (!scores[uid]) {
        scores[uid] = { id: uid, name: p.user.name, email: p.user.email, correct: 0, total: 0 };
      }
      scores[uid].total++;
      if (p.optionId === q.outcome.optionId) scores[uid].correct++;
    }
  }

  const leaderboard = Object.values(scores)
    .map((u) => ({
      ...u,
      accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0,
    }))
    .sort((a, b) => b.correct - a.correct || b.accuracy - a.accuracy);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
      <p className="text-gray-500 text-sm mb-6">
        Who knows Lansing best? Ranked by correct predictions.
      </p>
      {leaderboard.length === 0 ? (
        <p className="text-gray-400 text-center py-16">
          No resolved predictions yet — check back soon.
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left w-10">#</th>
                <th className="px-4 py-3 text-left">Predictor</th>
                <th className="px-4 py-3 text-right">Correct</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard.map((u, i) => (
                <tr key={u.id} className={i < 3 ? "font-medium" : ""}>
                  <td className="px-4 py-3 text-gray-400">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td className="px-4 py-3">{u.name ?? u.email.split("@")[0]}</td>
                  <td className="px-4 py-3 text-right text-green-600">{u.correct}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{u.total}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        u.accuracy >= 70
                          ? "bg-green-100 text-green-700"
                          : u.accuracy >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">
        {resolvedQuestions.length} resolved question{resolvedQuestions.length !== 1 ? "s" : ""} scored so far.
      </p>
    </div>
  );
}
