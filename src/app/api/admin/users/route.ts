import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      emailSubscribed: true, ward: true, ageRange: true, gender: true,
      raceEthnicity: true, occupation: true, attendsMeetings: true, interests: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(users);
}
