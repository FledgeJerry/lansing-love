import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const studies = await prisma.boardCaseStudy.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(studies);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const study = await prisma.boardCaseStudy.create({
    data: {
      slug:                  body.slug,
      boardName:             body.boardName,
      category:              body.category ?? "Other",
      date:                  body.date ?? "",
      published:             body.published ?? false,
      summary:               body.summary ?? "",
      stats:                 body.stats ?? [],
      principles:            body.principles ?? [],
      ownership:             body.ownership ?? [],
      bottomLines:           body.bottomLines ?? [],
      sections:              body.sections ?? [],
      recommendations:       body.recommendations ?? [],
      sources:               body.sources ?? [],
      sourceUrls:            body.sourceUrls ?? [],
      scoreTransparency:      body.scoreTransparency      ?? "insufficient",
      scoreConflicts:         body.scoreConflicts         ?? "insufficient",
      scoreMission:           body.scoreMission           ?? "insufficient",
      scoreDemocraticControl: body.scoreDemocraticControl ?? "insufficient",
      scoreOversight:         body.scoreOversight         ?? "insufficient",
    },
  });
  return NextResponse.json(study, { status: 201 });
}
