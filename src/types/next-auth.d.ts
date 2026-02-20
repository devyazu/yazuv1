import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    planId?: string;
    planSlug?: string;
    emailVerified?: boolean;
  }

  interface Session {
    user: User & {
      id?: string;
      role?: string;
      planId?: string;
      planSlug?: string;
      emailVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    planId?: string;
    planSlug?: string;
    emailVerified?: boolean;
  }
}
