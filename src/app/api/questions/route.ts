import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdminsPendingQuestion } from "@/lib/email";

// GET /api/questions - list active questions
export async function GET() {
  const questions = await prisma.question.findMany({
    where: { status: "ACTIVE" },
    include: {
      options: {
        include: {
          _count: { select: { predictions: true, desires: true } },
        },
      },
      _count: { select: { predictions: true } },
      outcome: { include: { option: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(questions);
}

// POST /api/questions - submit a new question (any logged-in user)
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, category, sourceUrl, closeAt, options } = await req.json();

  if (!title || !options || options.length < 2) {
    return NextResponse.json(
      { error: "Title and at least 2 options required" },
      { status: 400 }
    );
  }

  const question = await prisma.question.create({
    data: {
      title,
      description,
      category,
      sourceUrl: sourceUrl || null,
      closeAt: closeAt ? new Date(closeAt) : null,
      submittedById: session.user.id,
      options: {
        create: (options as string[]).map((label) => ({ label })),
      },
    },
    include: { options: true },
  });

  notifyAdminsPendingQuestion(
    { title: question.title, category: question.category, sourceUrl: question.sourceUrl },
    session.user.name ?? session.user.email ?? "Someone"
  ).catch(() => {});

  return NextResponse.json(question, { status: 201 });
}
