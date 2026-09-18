import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export interface AuthApiResponse {
  idEmpleado?: number;
  IdEmpleado?: number;
  nombreEmpleado?: string;
  NombreEmpleado?: string;
  userName?: string;
  UserName?: string;
  correo?: string | null;
  Correo?: string | null;
  imageEmpleado?: string | null;
  ImageEmpleado?: string | null;
  idRol?: number;
  IdRol?: number;
  nombreRol?: string;
  NombreRol?: string;
  roles?: string[];
  Roles?: string[];
  token?: string;
  Token?: string;
}

export async function loginWithBackendAPI(
  username: string,
  password: string
): Promise<{ success: boolean; data?: AuthApiResponse; message?: string }> {
  try {
    const baseUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5175/api";

    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      let errorMessage = "Usuario o contraseña incorrectos, o cuenta inactiva.";
      try {
        const errJson = await res.json();
        const extracted = 
          errJson?.Mensaje || 
          errJson?.mensaje || 
          errJson?.Message || 
          errJson?.message || 
          errJson?.title;
        if (extracted) {
          errorMessage = extracted;
        }
      } catch {
        // En caso de que no sea formato JSON
      }
      return { success: false, message: errorMessage };
    }

    const data: AuthApiResponse = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Error connecting to .NET Backend API:", error);
    return {
      success: false,
      message: "No se pudo conectar con el backend en .NET. Verifica que la API esté encendida.",
    };
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error("Invalid credentials format");
          return null;
        }

        const { username, password } = parsedCredentials.data;
        const result = await loginWithBackendAPI(username, password);

        if (!result.success || !result.data) {
          console.error(`Authentication failed: ${result.message}`);
          return null;
        }

        const user = result.data;
        const idEmpleado = user.IdEmpleado ?? user.idEmpleado ?? 0;
        const nombreEmpleado = user.NombreEmpleado ?? user.nombreEmpleado ?? "";
        const userName = user.UserName ?? user.userName ?? "";
        const correo = user.Correo ?? user.correo ?? "";
        const imageEmpleado = user.ImageEmpleado ?? user.imageEmpleado ?? null;
        const idRol = user.IdRol ?? user.idRol ?? 0;
        const roles = user.Roles ?? user.roles ?? [];
        const nombreRol = user.NombreRol ?? user.nombreRol ?? (roles.length > 0 ? roles[0] : "");
        const token = user.Token ?? user.token ?? "";

        return {
          id: idEmpleado.toString(),
          name: nombreEmpleado,
          email: correo,
          image: imageEmpleado,
          username: userName,
          roles: roles,
          token: token,
          idRol: idRol,
          nombreRol: nombreRol,
        };
      },
    }),
  ],
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.id ?? "";
        token.username = user.username ?? token.username ?? "";
        token.roles = (user as any).roles ?? token.roles ?? [];
        token.token = (user as any).token ?? token.token ?? "";
        token.nombreRol = (user as any).nombreRol ?? token.nombreRol ?? "";
        token.idRol = (user as any).idRol ?? token.idRol ?? 0;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.roles = (token.roles as string[]) ?? [];
      session.user.token = (token.token as string) ?? "";
      session.user.nombreRol = (token.nombreRol as string) ?? "";
      session.user.idRol = (token.idRol as number) ?? 0;
      return session;
    },
  },
});
