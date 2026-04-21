import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    questionsByStatus,
    questionsByCategory,
    totalUsers,
    totalPredictions,
    resolvedQuestions,
    topQuestions,
  ] = await Promise.all([
    prisma.question.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.question.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.user.count(),
    prisma.prediction.count(),
    prisma.question.findMany({
      where: { status: "RESOLVED" },
      include: { outcome: true, predictions: true },
    }),
    prisma.question.findMany({
      orderBy: { predictions: { _count: "desc" } },
      take: 5,
      select: { title: true, status: true, _count: { select: { predictions: true } } },
    }),
  ]);

  let correctPredictions = 0;
  let totalResolved = 0;

  // Accuracy by category
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  for (const q of resolvedQuestions) {
    if (!q.outcome) continue;
    const cat = q.category ?? "Uncategorized";
    if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
    for (const p of q.predictions) {
      totalResolved++;
      categoryStats[cat].total++;
      if (p.optionId === q.outcome.optionId) {
        correctPredictions++;
        categoryStats[cat].correct++;
      }
    }
  }

  const accuracyByCategory = Object.entries(categoryStats)
    .map(([category, { correct, total }]) => ({
      category,
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  return NextResponse.json({
    questionsByStatus: questionsByStatus.map((r) => ({ status: r.status, count: r._count.id })),
    questionsByCategory: questionsByCategory
      .filter((r) => r.category)
      .map((r) => ({ category: r.category, count: r._count.id })),
    accuracyByCategory,
    totalUsers,
    totalPredictions,
    overallAccuracy: totalResolved > 0 ? Math.round((correctPredictions / totalResolved) * 100) : null,
    totalResolved,
    topQuestions,
  });
}
