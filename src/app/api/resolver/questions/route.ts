import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user.role !== "RESOLVER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const questions = await prisma.question.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { closeAt: { lt: new Date() } },
        { closeAt: null },
      ],
    },
    include: {
      options: true,
      _count: { select: { predictions: true } },
    },
    orderBy: { closeAt: "asc" },
  });

  return NextResponse.json(questions);
}
