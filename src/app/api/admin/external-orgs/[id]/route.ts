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

  const org = await prisma.externalOrg.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.website !== undefined && { website: body.website || null }),
      ...(body.email !== undefined && { email: body.email || null }),
      ...(body.phone !== undefined && { phone: body.phone || null }),
      ...(body.notes !== undefined && { notes: body.notes || null }),
      ...(body.isCoop !== undefined && { isCoop: !!body.isCoop }),
      ...(body.isUnion !== undefined && { isUnion: !!body.isUnion }),
      ...(body.isWorkerOwned !== undefined && { isWorkerOwned: !!body.isWorkerOwned }),
      ...(body.offersLivingWage !== undefined && { offersLivingWage: !!body.offersLivingWage }),
      ...(body.ownsHousing !== undefined && { ownsHousing: !!body.ownsHousing }),
      ...(body.occupantCount !== undefined && { occupantCount: body.occupantCount ? Number(body.occupantCount) : null }),
      ...(body.employeeCount !== undefined && { employeeCount: body.employeeCount ? Number(body.employeeCount) : null }),
      ...(body.published !== undefined && { published: !!body.published }),
    },
  });
  return NextResponse.json(org);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.externalOrg.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
