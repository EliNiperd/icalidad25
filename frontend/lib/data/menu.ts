import { apiFetch } from "@/lib/api-client";

export interface RawMenuItem {
  id: number;
  nombre: string;
  icono: string;
  ruta: string;
  idPadre: number;
  orden: number;
}

export async function getRawMenuItems(): Promise<RawMenuItem[]> {
  try {
    const data = await apiFetch<RawMenuItem[]>("/menu");
    return data || [];
  } catch (error) {
    console.error("Failed to fetch raw menu items from .NET API:", error);
    return [];
  }
}
