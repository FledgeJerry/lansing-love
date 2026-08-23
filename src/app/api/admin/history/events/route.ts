import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildEventData } from "@/lib/historyEventData";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const events = await prisma.historyEvent.findMany({
    orderBy: { eventDate: "asc" },
    include: { entityEvents: { include: { entity: { select: { id: true, name: true } } } } },
  });
  return NextResponse.json(events.map((e) => ({
    ...e,
    lat: e.lat ? Number(e.lat) : null,
    lng: e.lng ? Number(e.lng) : null,
    dollarAmount: e.dollarAmount?.toString() ?? null,
  })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const event = await prisma.historyEvent.create({ data: buildEventData(body) });

  const links = ((body.entityEvents ?? []) as { entityId: number; role: string }[]).filter((l) => l.entityId && l.role.trim());
  if (links.length) {
    await prisma.entityEvent.createMany({ data: links.map((l) => ({ entityId: l.entityId, eventId: event.id, role: l.role })), skipDuplicates: true });
  }
  return NextResponse.json(event, { status: 201 });
}
