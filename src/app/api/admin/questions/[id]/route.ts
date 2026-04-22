import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifySubscribersNewQuestion } from "@/lib/email";

// PATCH /api/admin/questions/[id]
// actions: "approve" | "reject" | "edit" | "set-status"
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { action } = body;

  if (action === "approve") {
    const question = await prisma.question.update({
      where: { id },
      data: {
        status: "ACTIVE",
        approvedById: session.user.id,
        closeAt: body.closeAt ? new Date(body.closeAt) : null,
      },
    });
    notifySubscribersNewQuestion({ title: question.title, category: question.category, sourceUrl: question.sourceUrl }).catch(() => {});
    return NextResponse.json(question);
  }

  if (action === "reject") {
    await prisma.$transaction([
      prisma.outcome.deleteMany({ where: { questionId: id } }),
      prisma.prediction.deleteMany({ where: { questionId: id } }),
      prisma.question.delete({ where: { id } }),
    ]);
    return NextResponse.json({ deleted: true });
  }

  if (action === "edit") {
    const { title, description, category, sourceUrl, closeAt, status, options } = body;
    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(sourceUrl !== undefined && { sourceUrl: sourceUrl || null }),
        ...(status !== undefined && { status }),
        ...(closeAt !== undefined && { closeAt: closeAt ? new Date(closeAt) : null }),
      },
      include: { options: true },
    });

    // Replace options if provided
    if (options && Array.isArray(options)) {
      await prisma.option.deleteMany({ where: { questionId: id } });
      await prisma.option.createMany({
        data: options.map((label: string) => ({ label, questionId: id })),
      });
    }

    return NextResponse.json(question);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
