import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const s = await auth();
  return s?.user?.role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const entry = await prisma.advocacyEntry.update({
    where: { id },
    data: {
      entryType: body.entryType,
      summary:   body.summary,
      detail:    body.detail   || null,
      who:       body.who      || null,
      date:      new Date(body.date),
      published: body.published ?? true,
    },
  });
  return NextResponse.json(entry);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.advocacyEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
