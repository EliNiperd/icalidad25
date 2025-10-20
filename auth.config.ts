type NextAuthOptions = Record<string, unknown>;

// Fallback for environments where 'next/server' is not available.
const NextResponse: {
  redirect: (url: URL) => unknown;
} = {
  redirect(url: URL) {
    if (typeof Response !== "undefined") {
      return new Response(null, { status: 302, headers: { Location: url.toString() } });
    }
    return { status: 302, headers: { Location: url.toString() } } as unknown;
  },
};

export const authConfig = {
  providers: [], // Los proveedores se definen en el archivo principal auth.ts
  pages: {
    signIn: "/login",
    defaultRedirect: "/dashboard",
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
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return NextResponse.redirect(new URL("/login", nextUrl));
      } else if (isLoggedIn) {
        // Si el usuario está logueado y va a la página de login, redirigir al dashboard
        if (nextUrl.pathname === "/login") {
          return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthOptions;
