import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const boards = await prisma.board.findMany({
    orderBy: { sortOrder: "asc" },
    include: { members: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(boards);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const max = await prisma.board.aggregate({ _max: { sortOrder: true } });
  const board = await prisma.board.create({
    data: {
      slug: body.slug,
      name: body.name,
      notes: body.notes || null,
      sortOrder: (max._max.sortOrder ?? 0) + 1,
    },
    include: { members: true },
  });
  return NextResponse.json(board, { status: 201 });
}
