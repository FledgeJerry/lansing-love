import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const s = await auth();
  return s?.user?.role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; memberId: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { memberId } = await params;
  const body = await req.json();
  const member = await prisma.boardMember.update({
    where: { id: memberId },
    data: {
      name: body.name,
      role: body.role || null,
      termExpires: body.termExpires || null,
      status: body.status || "current",
      notes: body.notes || null,
    },
  });
  return NextResponse.json(member);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; memberId: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { memberId } = await params;
  await prisma.boardMember.delete({ where: { id: memberId } });
  return NextResponse.json({ ok: true });
}
