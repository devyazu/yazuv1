import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL || req.url));
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  if (!record || record.expires < new Date()) {
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL || req.url));
  }

  await prisma.user.update({
    where: { id: record.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.redirect(new URL("/login?verified=1", process.env.NEXTAUTH_URL || req.url));
}
