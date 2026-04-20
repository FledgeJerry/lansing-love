import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/questions - list active questions
export async function GET() {
  const questions = await prisma.question.findMany({
    where: { status: "ACTIVE" },
    include: {
      options: {
        include: {
          _count: { select: { predictions: true } },
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

  const { title, description, category, closeAt, options } = await req.json();

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
      closeAt: closeAt ? new Date(closeAt) : null,
      submittedById: session.user.id,
      options: {
        create: (options as string[]).map((label) => ({ label })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json(question, { status: 201 });
}
