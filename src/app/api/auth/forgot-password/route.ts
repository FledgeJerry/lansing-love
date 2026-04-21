import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success so we don't leak whether an email is registered
  if (!user || !user.passwordHash) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: `reset:${email}`, token: "placeholder" } },
    create: { identifier: `reset:${email}`, token, expires },
    update: { token, expires },
  }).catch(async () => {
    // upsert on compound unique can fail if no existing row — just delete+create
    await prisma.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } });
    await prisma.verificationToken.create({ data: { identifier: `reset:${email}`, token, expires } });
  });

  const resetUrl = `${process.env.NEXTAUTH_URL ?? "https://lansing.love"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: "lansing.love <hello@lansing.love>",
    to: email,
    subject: "Reset your lansing.love password",
    html: `
      <p>You requested a password reset for your lansing.love account.</p>
      <p><a href="${resetUrl}" style="background:#c0392b;color:#fff;padding:0.5rem 1rem;border-radius:4px;text-decoration:none;display:inline-block;">Reset my password →</a></p>
      <p style="font-size:0.85rem;color:#999;">This link expires in 1 hour. If you didn't request this, you can ignore it.</p>
      <hr/>
      <p style="font-size:0.8rem;color:#999;">lansing.love — civic predictions for Lansing, MI</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
