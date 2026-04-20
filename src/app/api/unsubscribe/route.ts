import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  await prisma.user.updateMany({
    where: { email },
    data: { emailSubscribed: false },
  });

  return NextResponse.json({ ok: true });
}
