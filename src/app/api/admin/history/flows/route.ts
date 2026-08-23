import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildDollarFlowData } from "@/lib/dollarFlowData";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const flows = await prisma.dollarFlow.findMany({
    orderBy: { flowDate: "desc" },
    include: { fromEntity: { select: { id: true, name: true } }, toEntity: { select: { id: true, name: true } }, event: { select: { id: true, title: true } } },
  });
  return NextResponse.json(flows.map((f) => ({ ...f, amountCents: f.amountCents?.toString() ?? null })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const flow = await prisma.dollarFlow.create({ data: buildDollarFlowData(body) });
  return NextResponse.json(flow, { status: 201 });
}
