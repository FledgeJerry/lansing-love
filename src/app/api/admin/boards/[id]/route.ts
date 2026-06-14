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
  const board = await prisma.board.update({
    where: { id },
    data: { name: body.name, slug: body.slug, notes: body.notes || null },
    include: { members: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(board);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.board.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
