import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const entity = await prisma.entity.findUnique({ where: { id: Number(id) } });
  if (!entity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...entity, lat: entity.lat ? Number(entity.lat) : null, lng: entity.lng ? Number(entity.lng) : null });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const entity = await prisma.entity.update({
    where: { id: Number(id) },
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
  return NextResponse.json(entity);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.entity.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
