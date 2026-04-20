import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      neighborhood: true,
      ward: true,
      ageRange: true,
      gender: true,
      raceEthnicity: true,
      occupation: true,
      attendsMeetings: true,
      interests: true,
      emailSubscribed: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = ["name", "neighborhood", "ward", "ageRange", "gender", "raceEthnicity", "occupation", "attendsMeetings", "interests", "emailSubscribed"];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { name: true, email: true },
  });

  return NextResponse.json(user);
}
