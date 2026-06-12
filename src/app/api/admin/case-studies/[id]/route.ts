import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const study = await prisma.boardCaseStudy.findUnique({ where: { id } });
  if (!study) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(study);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const study = await prisma.boardCaseStudy.update({
    where: { id },
    data: {
      slug:                  body.slug,
      boardName:             body.boardName,
      category:              body.category,
      date:                  body.date,
      published:             body.published,
      summary:               body.summary,
      stats:                 body.stats,
      principles:            body.principles,
      ownership:             body.ownership,
      bottomLines:           body.bottomLines,
      sections:              body.sections,
      recommendations:       body.recommendations,
      sources:               body.sources,
      sourceUrls:            body.sourceUrls,
      scoreTransparency:      body.scoreTransparency,
      scoreConflicts:         body.scoreConflicts,
      scoreMission:           body.scoreMission,
      scoreDemocraticControl: body.scoreDemocraticControl,
      scoreOversight:         body.scoreOversight,
    },
  });
  return NextResponse.json(study);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.boardCaseStudy.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
