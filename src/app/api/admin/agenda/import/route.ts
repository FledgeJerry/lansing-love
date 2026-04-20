import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type QuestionInput = {
  title: string;
  description: string;
  category: string;
  options: string[];
  closeAt?: string;
  status?: "PENDING" | "ACTIVE";
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { questions, status = "ACTIVE" }: { questions: QuestionInput[]; status?: "PENDING" | "ACTIVE" } =
    await req.json();

  if (!questions?.length) {
    return NextResponse.json({ error: "No questions provided" }, { status: 400 });
  }

  const created = await Promise.all(
    questions.map((q) =>
      prisma.question.create({
        data: {
          title: q.title,
          description: q.description || null,
          category: q.category || null,
          status,
          closeAt: q.closeAt ? new Date(q.closeAt) : null,
          submittedById: session.user.id,
          approvedById: status === "ACTIVE" ? session.user.id : null,
          options: {
            create: q.options.map((label) => ({ label })),
          },
        },
      })
    )
  );

  return NextResponse.json({ created: created.length });
}
