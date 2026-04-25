import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [predictionsWithDesire, allQuestions] = await Promise.all([
    prisma.prediction.findMany({
      where: { desiredId: { not: null } },
      select: {
        optionId: true,
        desiredId: true,
        question: { select: { category: true } },
      },
    }),
    prisma.question.findMany({
      where: { status: { in: ["ACTIVE", "RESOLVED"] } },
      include: {
        options: { include: { _count: { select: { predictions: true, desires: true } } } },
        _count: { select: { predictions: true } },
        outcome: { include: { option: true } },
      },
    }),
  ]);

  const totalPredictions = await prisma.prediction.count();
  const totalDesires = predictionsWithDesire.length;
  const accordCount = predictionsWithDesire.filter((p) => p.optionId === p.desiredId).length;
  const desireParticipation = totalPredictions > 0 ? Math.round((totalDesires / totalPredictions) * 100) : 0;
  const desireAccord = totalDesires > 0 ? Math.round((accordCount / totalDesires) * 100) : null;

  // Category accord from predictionsWithDesire
  const catAccord: Record<string, { accord: number; desires: number }> = {};
  for (const p of predictionsWithDesire) {
    const cat = p.question.category ?? "Uncategorized";
    if (!catAccord[cat]) catAccord[cat] = { accord: 0, desires: 0 };
    catAccord[cat].desires++;
    if (p.optionId === p.desiredId) catAccord[cat].accord++;
  }

  // Category participation from question option counts
  const catPart: Record<string, { predictions: number; desires: number }> = {};
  for (const q of allQuestions) {
    const cat = q.category ?? "Uncategorized";
    if (!catPart[cat]) catPart[cat] = { predictions: 0, desires: 0 };
    catPart[cat].predictions += q._count.predictions;
    catPart[cat].desires += q.options.reduce((s, o) => s + o._count.desires, 0);
  }

  const byCategory = Object.keys(catPart)
    .map((cat) => ({
      category: cat,
      predictions: catPart[cat].predictions,
      desires: catPart[cat].desires,
      participation: catPart[cat].predictions > 0 ? Math.round((catPart[cat].desires / catPart[cat].predictions) * 100) : 0,
      accord: catAccord[cat]?.desires > 0 ? Math.round((catAccord[cat].accord / catAccord[cat].desires) * 100) : null,
    }))
    .filter((c) => c.predictions > 0)
    .sort((a, b) => b.desires - a.desires);

  // Top 10 questions by max gap between predict% and want%
  const topGapQuestions = allQuestions
    .map((q) => {
      const totalPreds = q._count.predictions;
      const totalDes = q.options.reduce((s, o) => s + o._count.desires, 0);
      if (totalDes === 0) return null;

      const options = q.options.map((o) => {
        const predictPct = totalPreds > 0 ? Math.round((o._count.predictions / totalPreds) * 100) : 0;
        const wantPct = totalDes > 0 ? Math.round((o._count.desires / totalDes) * 100) : 0;
        return { label: o.label, predictPct, wantPct, gap: Math.abs(predictPct - wantPct) };
      });

      return {
        id: q.id,
        title: q.title,
        category: q.category,
        status: q.status,
        totalPredictions: totalPreds,
        totalDesires: totalDes,
        options,
        maxGap: Math.max(...options.map((o) => o.gap)),
        outcomeLabel: q.outcome?.option.label ?? null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.maxGap - a!.maxGap)
    .slice(0, 10);

  return NextResponse.json({
    totalDesires,
    totalPredictions,
    desireParticipation,
    desireAccord,
    byCategory,
    topGapQuestions,
  });
}
