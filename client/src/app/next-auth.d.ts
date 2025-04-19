// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      userName: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
  }
}
