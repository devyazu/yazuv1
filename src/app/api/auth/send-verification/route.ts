import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

/** Yeni doğrulama linki oluşturur; test için URL döner (ileride e-posta gönderilecek). */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
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

  return NextResponse.json({ verifyUrl });
}
