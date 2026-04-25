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
  const { optionId, desiredId } = await req.json();

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question || question.status !== "ACTIVE") {
    return NextResponse.json({ error: "Question not available" }, { status: 404 });
  }
  if (question.closeAt && question.closeAt < new Date()) {
    return NextResponse.json({ error: "Predictions closed" }, { status: 400 });
  }

  let prediction;
  if (optionId) {
    prediction = await prisma.prediction.upsert({
      where: { userId_questionId: { userId: session.user.id, questionId: id } },
      update: { optionId, ...(desiredId !== undefined && { desiredId }) },
      create: { userId: session.user.id, questionId: id, optionId, desiredId: desiredId ?? null },
    });
  } else if (desiredId !== undefined) {
    prediction = await prisma.prediction.update({
      where: { userId_questionId: { userId: session.user.id, questionId: id } },
      data: { desiredId },
    });
  } else {
    return NextResponse.json({ error: "optionId or desiredId required" }, { status: 400 });
  }

  return NextResponse.json(prediction);
}
