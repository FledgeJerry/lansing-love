import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/questions?status=PENDING|ACTIVE|CLOSED|RESOLVED|ALL
export async function GET(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "PENDING";

  const questions = await prisma.question.findMany({
    where: status === "ALL" ? {} : { status: status as "PENDING" | "ACTIVE" | "CLOSED" | "RESOLVED" },
    include: {
      submittedBy: { select: { name: true, email: true } },
      options: true,
      _count: { select: { predictions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(questions);
}
