import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const base = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  if (!token) {
    return NextResponse.redirect(`${base}/dashboard`);
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  if (!record || record.expires < new Date()) {
    return NextResponse.redirect(`${base}/dashboard`);
  }

  await prisma.user.update({
    where: { id: record.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token } });

  // Oturumu kapat ki kullanıcı tekrar giriş yapsın; yeni JWT'de emailVerified güncel olur, panelde banner kaybolur
  const loginUrl = `${base}/login?verified=1`;
  const signoutUrl = `${base}/api/auth/signout?callbackUrl=${encodeURIComponent(loginUrl)}`;
  return NextResponse.redirect(signoutUrl);
}
