import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

/** Yeni doğrulama linki oluşturur ve e-posta gönderir (SMTP yoksa URL döner). */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({
    where: { identifier: session.user.id },
  });
  await prisma.verificationToken.create({
    data: {
      identifier: session.user.id,
      token,
      expires,
    },
  });

  const base = process.env.NEXTAUTH_URL || "";
  const verifyUrl = `${base}/api/auth/verify-email?token=${token}`;

  const sent = await sendVerificationEmail(session.user.email, verifyUrl);

  return NextResponse.json({ verifyUrl: sent ? undefined : verifyUrl, sent });
}
