import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { optionId } = await req.json();

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question || question.status !== "ACTIVE") {
    return NextResponse.json({ error: "Question not available" }, { status: 404 });
  }
  if (question.closeAt && question.closeAt < new Date()) {
    return NextResponse.json({ error: "Predictions closed" }, { status: 400 });
  }

  const prediction = await prisma.prediction.upsert({
    where: { userId_questionId: { userId: session.user.id, questionId: id } },
    update: { optionId },
    create: { userId: session.user.id, questionId: id, optionId },
  });

  return NextResponse.json(prediction);
}
