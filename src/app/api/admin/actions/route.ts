import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildActionItemData } from "@/lib/actionItemData";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const actions = await prisma.actionItem.findMany({ orderBy: [{ status: "asc" }, { dueDate: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json(actions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const action = await prisma.actionItem.create({ data: buildActionItemData(body) });
  return NextResponse.json(action, { status: 201 });
}
