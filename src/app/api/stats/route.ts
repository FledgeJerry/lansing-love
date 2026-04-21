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
  for (const q of resolvedQuestions) {
    if (!q.outcome) continue;
    for (const p of q.predictions) {
      totalResolved++;
      if (p.optionId === q.outcome.optionId) correctPredictions++;
    }
  }

  return NextResponse.json({
    questionsByStatus: questionsByStatus.map((r) => ({ status: r.status, count: r._count.id })),
    questionsByCategory: questionsByCategory
      .filter((r) => r.category)
      .map((r) => ({ category: r.category, count: r._count.id })),
    totalUsers,
    totalPredictions,
    overallAccuracy: totalResolved > 0 ? Math.round((correctPredictions / totalResolved) * 100) : null,
    totalResolved,
    topQuestions,
  });
}
