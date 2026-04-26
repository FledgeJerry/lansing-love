import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { questionId: id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body, url } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Comment body required" }, { status: 400 });

  const question = await prisma.question.findUnique({ where: { id }, select: { id: true } });
  if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { userId: session.user.id, questionId: id, body: body.trim(), url: url?.trim() || null },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { commentId } = await req.json();

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.questionId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (comment.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id: commentId } });
  return NextResponse.json({ ok: true });
}
