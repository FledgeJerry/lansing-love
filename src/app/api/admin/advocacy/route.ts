import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const entries = await prisma.advocacyEntry.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const entry = await prisma.advocacyEntry.create({
    data: {
      entryType: body.entryType,
      summary:   body.summary,
      detail:    body.detail   || null,
      who:       body.who      || null,
      date:      new Date(body.date),
      published: body.published ?? true,
    },
  });
  return NextResponse.json(entry, { status: 201 });
}
