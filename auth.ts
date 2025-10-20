import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
import { usegetPool, typeParameter } from "@/lib/database/connection";

// Interfaz para el resultado del Stored Procedure de autenticación
interface SPAuthResult {
  StatusCode: number;
  Message: string;
  IdEmpleado?: number;
  UserName?: string;
  Correo?: string;
  NombreEmpleado?: string;
  ImageEmpleado?: string | null;
  NombreRol?: string;
  IdRol?: number;
}

async function authenticateUserInDB(username: string, password: string): Promise<SPAuthResult | null> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    // Asegúrate de que los tipos y longitudes coincidan con los parámetros de tu SP
    request.input("p_UserName", typeParam.NVarChar(20), username);
    request.input("p_Password", typeParam.NVarChar(256), password); // Usando NVarChar(256) para el hash o texto plano

    const result = await request.execute("usp_AuthenticateUser");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset[0] as SPAuthResult;
    }
    // Si el SP no devuelve ningún registro (lo cual no debería pasar con el SP refactorizado)
    return { StatusCode: 99, Message: "Error: El SP no devolvió resultados." };
  } catch (error) {
    console.error("Failed to authenticate user in DB:", error);
    return { StatusCode: 99, Message: "Error interno del servidor al autenticar." };
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

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;

          // Llamar a la nueva función que ejecuta el stored procedure
          const authResult = await authenticateUserInDB(username, password);

          if (!authResult) {
            console.log("Authentication failed: No result from DB function.");
            return null;
          }

          if (authResult.StatusCode === 0) {
            // Autenticación exitosa, mapear los datos del usuario
            if (authResult.IdEmpleado && authResult.NombreEmpleado && authResult.Correo && authResult.NombreRol && authResult.IdRol && authResult.UserName) {
              return {
                id: authResult.IdEmpleado.toString(),
                name: authResult.NombreEmpleado,
                email: authResult.Correo,
                image: authResult.ImageEmpleado,
                username: authResult.UserName,
                idRol: authResult.IdRol,
                nombreRol: authResult.NombreRol,
              };
            } else {
              // Autenticación fallida con un código de estado específico
              console.log(`Authentication failed (Code: ${authResult.StatusCode}): ${authResult.Message}`);
              throw new Error(authResult.Message); // Lanzar el mensaje específico del SP
            }
          } else {
            // Autenticación fallida con un código de estado específico
            console.log(`Authentication failed (Code: ${authResult.StatusCode}): ${authResult.Message}`);
            throw new Error(authResult.Message); // Lanzar el mensaje específico del SP
          }
        }

        console.log("Invalid credentials format");
        throw new Error("Formato de credenciales inválido."); // Lanzar un error para credenciales mal formadas
      },
    }),
  ],
  callbacks: {
    // Extendemos el token JWT con los datos personalizados
    jwt({ token, user }) {
      if (user) {
        // Aseguramos valores por defecto para evitar asignaciones de 'undefined'
        token.id = user.id ?? token.id ?? "";
        token.username = (user as any).username ?? token.username ?? "";
        token.idRol = (user as any).idRol ?? token.idRol ?? 0;
        token.nombreRol = (user as any).nombreRol ?? token.nombreRol ?? "";
      }
      return token;
    },
    // Extendemos la sesión con los datos del token
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.idRol = token.idRol as number;
      session.user.nombreRol = token.nombreRol as string;
      return session;
    },
  },
});
