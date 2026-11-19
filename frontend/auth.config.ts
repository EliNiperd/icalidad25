import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/icalidad");

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // NextAuth redirige automáticamente a /login?callbackUrl=...
      }

      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/icalidad/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
