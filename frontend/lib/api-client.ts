import { auth } from "@/auth";

const getBaseUrl = () => {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5175/api"
  );
};

export interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Cliente HTTP unificado para comunicar Next.js con el backend .NET.
 * - En Server Components / Server Actions: Extrae automáticamente el token JWT de la sesión.
 * - En Client Components: Acepta el token pasado como opción { token: session.user.token }.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let authToken = options.token;

  // En entorno de servidor (Server Actions o SSR), obtenemos el token de la sesión automáticamente si no se pasó uno
  if (!authToken && typeof window === "undefined") {
    try {
      const session = await auth();
      authToken = session?.user?.token;
    } catch {
      // Continuar sin token si no hay sesión disponible
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Mantener mensaje por defecto si no hay body JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
