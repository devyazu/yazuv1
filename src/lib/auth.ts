import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./db";

// Basit hash karşılaştırma (bcryptjs kullanacağız - npm'de var)
// Şimdilik placeholder; gerçek hash için bcryptjs ekleyeceğiz
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await compare(password, hash);
  } catch {
    return false;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { plan: true },
        });
        if (!user || !user.passwordHash) return null;
        const ok = await verifyPassword(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
          planId: user.planId ?? undefined,
          planSlug: user.plan?.slug,
          emailVerified: user.emailVerified ? true : undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.planId = (user as { planId?: string }).planId;
        token.planSlug = (user as { planSlug?: string }).planSlug;
        token.emailVerified = (user as { emailVerified?: boolean }).emailVerified;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { planId?: string }).planId = token.planId as string | undefined;
        (session.user as { planSlug?: string }).planSlug = token.planSlug as string | undefined;
        (session.user as { emailVerified?: boolean }).emailVerified = token.emailVerified as boolean | undefined;
      }
      return session;
    },
  },
};
