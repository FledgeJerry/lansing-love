import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const org = await prisma.neighborhoodOrg.update({
    where: { id },
    data: {
      name:     body.name,
      area:     body.area     || null,
      status:   body.status   || "Registered",
      website:  body.website  || null,
      facebook: body.facebook || null,
      email:    body.email    || null,
      phone:    body.phone    || null,
      address:  body.address  || null,
      notes:    body.notes    || null,
      isHub:    body.isHub    ?? false,
    },
  });
  return NextResponse.json(org);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.neighborhoodOrg.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
