import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildEventData } from "@/lib/historyEventData";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const event = await prisma.historyEvent.findUnique({
    where: { id: Number(id) },
    include: { entityEvents: { include: { entity: { select: { id: true, name: true } } } } },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...event,
    lat: event.lat ? Number(event.lat) : null,
    lng: event.lng ? Number(event.lng) : null,
    dollarAmount: event.dollarAmount?.toString() ?? null,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const eventId = Number(id);
  const body = await req.json();

  const [event] = await prisma.$transaction([
    prisma.historyEvent.update({ where: { id: eventId }, data: buildEventData(body) }),
    prisma.entityEvent.deleteMany({ where: { eventId } }),
  ]);

  const links = ((body.entityEvents ?? []) as { entityId: number; role: string }[]).filter((l) => l.entityId && l.role.trim());
  if (links.length) {
    await prisma.entityEvent.createMany({ data: links.map((l) => ({ entityId: l.entityId, eventId, role: l.role })), skipDuplicates: true });
  }
  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.historyEvent.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
