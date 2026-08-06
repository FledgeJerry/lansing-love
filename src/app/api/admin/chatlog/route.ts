import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") ?? "all";
  const page = parseInt(searchParams.get("page") ?? "1");
  const take = 30;

  const where =
    filter === "flagged" ? { flagged: true } :
    filter === "noted"   ? { adminNote: { not: null } } :
    {};

  const [logs, total] = await Promise.all([
    prisma.chatLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip: (page - 1) * take,
    }),
    prisma.chatLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total, page, pages: Math.ceil(total / take) });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, adminNote, promoted } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const log = await prisma.chatLog.update({
    where: { id },
    data: {
      ...(adminNote !== undefined ? { adminNote: adminNote || null } : {}),
      ...(promoted !== undefined ? { promoted } : {}),
    },
  });

  return NextResponse.json(log);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.chatLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
