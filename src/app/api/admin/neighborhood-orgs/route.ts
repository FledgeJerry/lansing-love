import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orgs = await prisma.neighborhoodOrg.findMany({ orderBy: [{ isHub: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json(orgs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const maxOrder = await prisma.neighborhoodOrg.aggregate({ _max: { sortOrder: true } });
  const org = await prisma.neighborhoodOrg.create({
    data: {
      name: body.name,
      area: body.area || null,
      status: body.status || "Registered",
      website: body.website || null,
      facebook: body.facebook || null,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      notes: body.notes || null,
      isHub: body.isHub || false,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json(org, { status: 201 });
}
