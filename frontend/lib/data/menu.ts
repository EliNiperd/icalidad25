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
    const data = await apiFetch<any[]>("/menu");
    return (data || []).map((item) => ({
      id: item.Id ?? item.id,
      nombre: item.Nombre ?? item.nombre,
      icono: item.Icono ?? item.icono,
      ruta: item.Ruta ?? item.ruta,
      idPadre: item.IdPadre ?? item.idPadre,
      orden: item.Orden ?? item.orden,
    }));
  } catch (error) {
    console.error("Failed to fetch raw menu items from .NET API:", error);
    return [];
  }
}
