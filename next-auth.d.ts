import NextAuth, { type DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      idRol: number;
      nombreRol: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    idRol: number;
    nombreRol: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    idRol: number;
    nombreRol: string;
  }
}