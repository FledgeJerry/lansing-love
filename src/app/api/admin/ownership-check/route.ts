import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const checks = await prisma.ownershipCheck.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(checks);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, answer } = await req.json();
  if (!id || typeof answer !== "string") {
    return NextResponse.json({ error: "id and answer required" }, { status: 400 });
  }
  const updated = await prisma.ownershipCheck.update({
    where: { id },
    data: { answer, reviewedAt: new Date(), updatedBy: session.user.email ?? "" },
  });
  return NextResponse.json(updated);
}
