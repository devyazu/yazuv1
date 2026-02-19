import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    planId?: string;
    planSlug?: string;
  }

  interface Session {
    user: User & {
      id?: string;
      role?: string;
      planId?: string;
      planSlug?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    planId?: string;
    planSlug?: string;
  }
}
