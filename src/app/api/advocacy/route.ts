import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.advocacyEntry.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(entries);
}
