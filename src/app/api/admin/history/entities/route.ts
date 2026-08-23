import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const entities = await prisma.entity.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(entities.map((e) => ({
    ...e,
    lat: e.lat ? Number(e.lat) : null,
    lng: e.lng ? Number(e.lng) : null,
  })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const entity = await prisma.entity.create({
    data: {
      entityType: body.entityType,
      name: body.name,
      altNames: body.altNames ?? [],
      description: body.description || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      zip: body.zip || null,
      lat: body.lat != null ? body.lat : null,
      lng: body.lng != null ? body.lng : null,
      geoSource: body.geoSource || null,
      activeStart: body.activeStart ? new Date(body.activeStart) : null,
      activeEnd: body.activeEnd ? new Date(body.activeEnd) : null,
      sourceTier: body.sourceTier ?? "RC",
      sourceNote: body.sourceNote || null,
      sourceUrl: body.sourceUrl || null,
      domains: body.domains ?? [],
      bookChapter: body.bookChapter || null,
      timelineEntry: body.timelineEntry ?? false,
      mapPin: body.mapPin ?? true,
      familyStory: body.familyStory ?? false,
      isPublic: body.isPublic ?? true,
    },
  });
  return NextResponse.json(entity, { status: 201 });
}
