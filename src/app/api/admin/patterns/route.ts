import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const patterns = await prisma.pattern.findMany({ select: { slug: true, number: true, name: true }, orderBy: { number: "asc" } });
  return NextResponse.json(patterns);
}
