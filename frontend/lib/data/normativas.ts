"use server";

import { apiFetch } from "@/lib/api-client";
import { NormativaFormData } from "@/lib/schemas/normativa";
import { revalidatePath } from "next/cache";

// Interfaz para la lista de normativas (para dropdowns y vistas)
export interface NormativaListItem {
  IdNormativa: number;
  ClaveNormativa: string;
  NombreNormativa: string;
  ClaveNombreNormativa?: string;
  IdEstatusNormativa: boolean;
  Estatus?: string;
}

interface PagedNormativasResponse {
  Items: NormativaListItem[];
  TotalRecords: number;
  TotalPages: number;
  PageNumber: number;
  PageSize: number;
}

// Interfaz para el resultado de las acciones CUD
export interface NormativaSPResult {
  Resultado: number;
  Mensaje: string;
}

// Función para obtener una lista simple de normativas activas (para dropdowns)
export async function getNormativasList(): Promise<NormativaListItem[]> {
  try {
    const data = await apiFetch<NormativaListItem[]>("/normativas/list");
    return data || [];
  } catch (error) {
    console.error("Failed to fetch normativas list:", error);
    return [];
  }
}

// Función para obtener todas las normativas con filtros, paginación y ordenamiento
export async function getNormativas(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{ normativas: NormativaListItem[]; totalPages: number; totalRecords: number }> {
  try {
    const params = new URLSearchParams({
      query: query || "",
      pageNumber: currentPage.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy || "NombreNormativa",
      sortOrder: (sortOrder || "asc").toUpperCase(),
    });

    const data = await apiFetch<PagedNormativasResponse>(`/normativas?${params.toString()}`);
    return {
      normativas: data?.Items || [],
      totalPages: data?.TotalPages || 0,
      totalRecords: data?.TotalRecords || 0,
    };
  } catch (error) {
    console.error("Failed to fetch normativas:", error);
    return { normativas: [], totalPages: 0, totalRecords: 0 };
  }
}

// Obtener una normativa por ID
export async function getNormativaById(id: number): Promise<NormativaListItem | null> {
  try {
    const data = await apiFetch<NormativaListItem>(`/normativas/${id}`);
    return data || null;
  } catch (error) {
    console.error(`Failed to fetch normativa with ID ${id}:`, error);
    return null;
  }
}

// Crear una nueva normativa
export async function createNormativa(data: NormativaFormData): Promise<NormativaSPResult> {
  try {
    const response = await apiFetch<NormativaSPResult>("/normativas", {
      method: "POST",
      body: JSON.stringify({
        ClaveNormativa: data.ClaveNormativa,
        NombreNormativa: data.NombreNormativa,
      }),
    });

    revalidatePath("/icalidad/normativa");
    return response || { Resultado: 1, Mensaje: "Normativa creada exitosamente." };
  } catch (error: any) {
    console.error("Failed to create normativa:", error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al crear la normativa.",
    };
  }
}

// Actualizar una normativa
export async function updateNormativa(id: number, data: NormativaFormData): Promise<NormativaSPResult> {
  try {
    const response = await apiFetch<NormativaSPResult>(`/normativas/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        IdNormativa: id,
        ClaveNormativa: data.ClaveNormativa,
        NombreNormativa: data.NombreNormativa,
        IdEstatusNormativa: data.IdEstatusNormativa,
      }),
    });

    revalidatePath("/icalidad/normativa");
    revalidatePath(`/icalidad/normativa/${id}/edit`);
    return response || { Resultado: id, Mensaje: "Normativa actualizada exitosamente." };
  } catch (error: any) {
    console.error(`Failed to update normativa with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al actualizar la normativa.",
    };
  }
}

// Eliminar una normativa
export async function deleteNormativa(id: number): Promise<NormativaSPResult> {
  try {
    const response = await apiFetch<NormativaSPResult>(`/normativas/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/icalidad/normativa");
    return response || { Resultado: 1, Mensaje: "Normativa eliminada exitosamente." };
  } catch (error: any) {
    console.error(`Failed to delete normativa with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al eliminar la normativa.",
    };
  }
}
