import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const s = await auth();
  return s?.user?.role === "ADMIN";
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id: boardId } = await params;
  const body = await req.json();
  const max = await prisma.boardMember.aggregate({ where: { boardId }, _max: { sortOrder: true } });
  const member = await prisma.boardMember.create({
    data: {
      boardId,
      name: body.name,
      role: body.role || null,
      termExpires: body.termExpires || null,
      status: body.status || "current",
      notes: body.notes || null,
      sortOrder: (max._max.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json(member, { status: 201 });
}
