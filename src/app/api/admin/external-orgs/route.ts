import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const orgs = await prisma.externalOrg.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orgs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (!body.rawInput?.trim()) return NextResponse.json({ error: "rawInput required" }, { status: 400 });

  const org = await prisma.externalOrg.create({
    data: {
      name: body.name.trim(),
      website: body.website || null,
      email: body.email || null,
      phone: body.phone || null,
      rawInput: body.rawInput,
      notes: body.notes || null,
      isCoop: !!body.isCoop,
      isUnion: !!body.isUnion,
      isWorkerOwned: !!body.isWorkerOwned,
      offersLivingWage: !!body.offersLivingWage,
      ownsHousing: !!body.ownsHousing,
      occupantCount: body.occupantCount ? Number(body.occupantCount) : null,
      employeeCount: body.employeeCount ? Number(body.employeeCount) : null,
      published: !!body.published,
    },
  });
  return NextResponse.json(org, { status: 201 });
}
