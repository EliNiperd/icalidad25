'use server';

import { apiFetch } from "@/lib/api-client";
import { Gerencia, GerenciaFormData, GerenciaSPResult } from "@/lib/schemas/gerencia";
import { revalidatePath } from "next/cache";

// Interfaz para la lista de gerencias (para dropdowns)
export interface GerenciaListItem {
  IdGerencia: number;
  NombreGerencia: string;
}

interface PagedGerenciasResponse {
  items: Gerencia[];
  totalRecords: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

// Función para obtener una lista simple de gerencias activas (dropdowns)
export async function getGerenciasList(): Promise<GerenciaListItem[]> {
  try {
    const data = await apiFetch<GerenciaListItem[]>("/gerencias/list");
    return data || [];
  } catch (error) {
    console.error("Failed to fetch gerencias list:", error);
    return [];
  }
}

// Función para obtener todas las gerencias con filtros, paginación y ordenamiento
export async function getGerencias(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Promise<{ gerencias: Gerencia[]; totalPages: number; totalRecords: number }> {
  try {
    const params = new URLSearchParams({
      query: query || '',
      pageNumber: currentPage.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy || 'NombreGerencia',
      sortOrder: (sortOrder || 'asc').toUpperCase()
    });

    const data = await apiFetch<PagedGerenciasResponse>(`/gerencias?${params.toString()}`);
    return {
      gerencias: data?.items || [],
      totalPages: data?.totalPages || 0,
      totalRecords: data?.totalRecords || 0
    };
  } catch (error) {
    console.error("Failed to fetch gerencias:", error);
    return { gerencias: [], totalPages: 0, totalRecords: 0 };
  }
}

// Función para obtener una gerencia por su ID
export async function getGerenciaById(id: number): Promise<GerenciaFormData | null> {
  try {
    const data = await apiFetch<Gerencia>(`/gerencias/${id}`);
    if (data) {
      return {
        IdGerencia: data.IdGerencia,
        ClaveGerencia: data.ClaveGerencia,
        NombreGerencia: data.NombreGerencia,
        IdEstatusGerencia: data.IdEstatusGerencia,
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch gerencia with ID ${id}:`, error);
    return null;
  }
}

// Función para crear una nueva gerencia
export async function createGerencia(data: GerenciaFormData): Promise<GerenciaSPResult> {
  try {
    const result = await apiFetch<GerenciaSPResult>("/gerencias", {
      method: "POST",
      body: JSON.stringify({
        claveGerencia: data.ClaveGerencia,
        nombreGerencia: data.NombreGerencia
      })
    });

    revalidatePath("/icalidad/gerencia");
    return result;
  } catch (error: any) {
    console.error("Failed to create gerencia:", error);
    return { Resultado: -99, Mensaje: error?.message || "Error al crear gerencia." };
  }
}

// Función para actualizar una gerencia existente
export async function updateGerencia(id: number, data: GerenciaFormData): Promise<GerenciaSPResult> {
  try {
    const result = await apiFetch<GerenciaSPResult>(`/gerencias/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        idGerencia: id,
        claveGerencia: data.ClaveGerencia,
        nombreGerencia: data.NombreGerencia,
        idEstatusGerencia: data.IdEstatusGerencia
      })
    });

    revalidatePath("/icalidad/gerencia");
    return result;
  } catch (error: any) {
    console.error(`Failed to update gerencia with ID ${id}:`, error);
    return { Resultado: -99, Mensaje: error?.message || "Error al actualizar gerencia." };
  }
}

// Función para eliminar una gerencia
export async function deleteGerencia(id: number): Promise<GerenciaSPResult> {
  try {
    const result = await apiFetch<GerenciaSPResult>(`/gerencias/${id}`, {
      method: "DELETE"
    });

    revalidatePath("/icalidad/gerencia");
    return result;
  } catch (error: any) {
    console.error(`Failed to delete gerencia with ID ${id}:`, error);
    return { Resultado: -99, Mensaje: error?.message || "Error al eliminar gerencia." };
  }
}