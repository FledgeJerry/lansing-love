import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/questions/bulk-resolve
// Body: { resolutions: [{ questionId, optionId }] }
export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { resolutions } = await req.json() as {
    resolutions: { questionId: string; optionId: string; notes?: string }[];
  };

  if (!Array.isArray(resolutions) || resolutions.length === 0) {
    return NextResponse.json({ error: "No resolutions provided" }, { status: 400 });
  }

  let resolved = 0;
  for (const { questionId, optionId, notes } of resolutions) {
    await prisma.$transaction([
      prisma.outcome.upsert({
        where: { questionId },
        create: { questionId, optionId, resolvedById: session.user.id, notes: notes || null },
        update: { optionId, resolvedById: session.user.id, resolvedAt: new Date(), notes: notes || null },
      }),
      prisma.question.update({
        where: { id: questionId },
        data: { status: "RESOLVED" },
      }),
    ]);
    resolved++;
  }

  return NextResponse.json({ resolved });
}
