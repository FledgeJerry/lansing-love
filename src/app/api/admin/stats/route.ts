import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    questionsByStatus,
    questionsByCategory,
    totalUsers,
    newUsersThisWeek,
    totalPredictions,
    resolvedQuestions,
    signupsByDay,
  ] = await Promise.all([
    // Questions by status
    prisma.question.groupBy({ by: ["status"], _count: { id: true } }),

    // Questions by category
    prisma.question.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Total users
    prisma.user.count(),

    // New users this week
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),

    // Total predictions
    prisma.prediction.count(),

    // Resolved questions with outcomes for accuracy calc
    prisma.question.findMany({
      where: { status: "RESOLVED" },
      include: {
        outcome: true,
        predictions: true,
      },
    }),

    // Signups per day for last 30 days
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT DATE("createdAt") as day, COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY day ASC
    `,
  ]);

  // Overall accuracy: % of predictions that matched the correct outcome
  let correctPredictions = 0;
  let totalResolved = 0;
  for (const q of resolvedQuestions) {
    if (!q.outcome) continue;
    for (const p of q.predictions) {
      totalResolved++;
      if (p.optionId === q.outcome.optionId) correctPredictions++;
    }
  }
  const overallAccuracy = totalResolved > 0 ? Math.round((correctPredictions / totalResolved) * 100) : null;

  // Top 5 most predicted questions
  const topQuestions = await prisma.question.findMany({
    orderBy: { predictions: { _count: "desc" } },
    take: 5,
    select: { title: true, status: true, _count: { select: { predictions: true } } },
  });

  // Demographic breakdowns (only groups with 31+ users)
  const MIN_GROUP = 31;

  const accuracyByWard = await getAccuracyByField("ward", MIN_GROUP);
  const accuracyByMeetings = await getAccuracyByField("attendsMeetings", MIN_GROUP);

  return NextResponse.json({
    questionsByStatus: questionsByStatus.map((r) => ({ status: r.status, count: r._count.id })),
    questionsByCategory: questionsByCategory
      .filter((r) => r.category)
      .map((r) => ({ category: r.category, count: r._count.id })),
    totalUsers,
    newUsersThisWeek,
    totalPredictions,
    overallAccuracy,
    totalResolved,
    topQuestions,
    signupsByDay: signupsByDay.map((r) => ({ day: r.day, count: Number(r.count) })),
    accuracyByWard,
    accuracyByMeetings,
  });
}

async function getAccuracyByField(field: "ward" | "attendsMeetings", minGroup: number) {
  const users = await prisma.user.findMany({
    where: { [field]: { not: null } },
    select: { id: true, [field]: true },
  });

  const groups: Record<string, string[]> = {};
  for (const u of users) {
    const val = u[field] as string;
    if (!val) continue;
    if (!groups[val]) groups[val] = [];
    groups[val].push(u.id);
  }

  const results = [];
  for (const [value, userIds] of Object.entries(groups)) {
    if (userIds.length < minGroup) continue;
    const predictions = await prisma.prediction.findMany({
      where: { userId: { in: userIds } },
      include: { question: { include: { outcome: true } } },
    });
    const resolved = predictions.filter((p) => p.question.outcome);
    const correct = resolved.filter((p) => p.question.outcome?.optionId === p.optionId);
    results.push({
      value,
      count: userIds.length,
      accuracy: resolved.length > 0 ? Math.round((correct.length / resolved.length) * 100) : null,
      predictions: resolved.length,
    });
  }

  return results.sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));
}
