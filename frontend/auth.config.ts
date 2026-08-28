// import type { NextAuthOptions } from "next-auth";
// If the next-auth types aren't installed in this environment, provide a minimal fallback.
type NextAuthOptions = Record<string, unknown>;

// Fallback for environments where 'next/server' is not available.
const NextResponse: {
  redirect: (url: URL) => unknown;
} = {
  redirect(url: URL) {
    console.log("Redirecting to:", url.toString());
    if (typeof Response !== "undefined") {
      return new Response(null, { status: 302, headers: { Location: url.toString() } });
    }
    // Return a minimal object when Response isn't available (e.g., in some test envs).
    return { status: 302, headers: { Location: url.toString() } } as unknown;
  },
};

export const authConfig = {
  providers: [], // Los proveedores se definen en el archivo principal auth.ts
  pages: {
    signIn: "/login",
    defaultRedirect: "/icalidad/dashboard",
  },
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth?: { user?: unknown } | null;
      request: { nextUrl: URL };
    }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/icalidad/dashboard"); // Actualizar la ruta

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirige a la página de login
      } else if (isLoggedIn) {
        // Si el usuario está logueado y va a la página de login, redirigir al dashboard
        if (nextUrl.pathname === "/login") {
          return NextResponse.redirect(new URL("/icalidad/dashboard", nextUrl)); // Actualizar la ruta
        }
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthOptions;
