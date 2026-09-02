import { auth } from "@/auth";

const getBaseUrl = () => {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5175/api"
  );
};

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Si no se proporciona token explícito, intentamos obtenerlo de la sesión del servidor (si estamos en SSR/Server Action)
  let authToken = options.token;
  if (!authToken && typeof window === "undefined") {
    try {
      const session = await auth();
      authToken = session?.user?.token;
    } catch {
      // Si falla obtener la sesión, continuamos sin token
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
      // Si no es JSON, mantenemos el mensaje de estado HTTP
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta no tiene contenido (ej. 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
