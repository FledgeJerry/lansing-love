import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/resolver/questions/[id]/resolve
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "RESOLVER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { optionId, notes } = await req.json();

  // Mark question resolved
  const [question, outcome] = await prisma.$transaction([
    prisma.question.update({
      where: { id },
      data: { status: "RESOLVED" },
    }),
    prisma.outcome.create({
      data: {
        questionId: id,
        optionId,
        notes,
        resolvedById: session.user.id,
      },
    }),
  ]);

  return NextResponse.json({ question, outcome });
}
