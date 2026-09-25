"use server";

import { apiFetch } from "@/lib/api-client";
import { Puesto, PuestoFormData, PuestoSPResult } from "@/lib/schemas/puesto";
import { revalidatePath } from "next/cache";

// Interfaz para la lista de puestos (para dropdowns y vistas)
export interface PuestoListItem {
  IdPuesto: number;
  NombrePuesto: string;
  NombreDepartamento: string;
  IdDepartamento: number;
  IdEstatusPuesto: boolean;
  Estatus?: string;
}

interface PagedPuestosResponse {
  Items: PuestoListItem[];
  TotalRecords: number;
  TotalPages: number;
  PageNumber: number;
  PageSize: number;
}

// Función para obtener una lista simple de puestos activos
export async function getPuestosList(idDepartamento?: number): Promise<PuestoListItem[]> {
  try {
    const url = idDepartamento ? `/puestos/list?idDepartamento=${idDepartamento}` : "/puestos/list";
    const data = await apiFetch<PuestoListItem[]>(url);
    return data || [];
  } catch (error) {
    console.error("Failed to fetch puestos list:", error);
    return [];
  }
}

// Obtener puestos con paginación y filtros
export async function getPuestos(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{ puestos: PuestoListItem[]; totalPages: number; totalRecords: number }> {
  try {
    const params = new URLSearchParams({
      query: query || "",
      pageNumber: currentPage.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy || "NombrePuesto",
      sortOrder: (sortOrder || "asc").toUpperCase(),
    });

    const data = await apiFetch<PagedPuestosResponse>(`/puestos?${params.toString()}`);
    return {
      puestos: data?.Items || [],
      totalPages: data?.TotalPages || 0,
      totalRecords: data?.TotalRecords || 0,
    };
  } catch (error) {
    console.error("Failed to fetch puestos:", error);
    return { puestos: [], totalPages: 0, totalRecords: 0 };
  }
}

// Obtener un puesto por ID
export async function getPuestoById(id: number): Promise<PuestoListItem | null> {
  try {
    const data = await apiFetch<PuestoListItem>(`/puestos/${id}`);
    return data || null;
  } catch (error) {
    console.error(`Failed to fetch puesto with ID ${id}:`, error);
    return null;
  }
}

// Crear un nuevo puesto
export async function createPuesto(data: PuestoFormData): Promise<PuestoSPResult> {
  try {
    const response = await apiFetch<PuestoSPResult>("/puestos", {
      method: "POST",
      body: JSON.stringify({
        NombrePuesto: data.NombrePuesto,
        IdDepartamento: data.IdDepartamento,
      }),
    });

    revalidatePath("/icalidad/puesto");
    return response || { Resultado: 1, Mensaje: "Puesto creado exitosamente." };
  } catch (error: any) {
    console.error("Failed to create puesto:", error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al crear el puesto.",
    };
  }
}

// Actualizar un puesto
export async function updatePuesto(id: number, data: PuestoFormData): Promise<PuestoSPResult> {
  try {
    const response = await apiFetch<PuestoSPResult>(`/puestos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        IdPuesto: id,
        NombrePuesto: data.NombrePuesto,
        IdDepartamento: data.IdDepartamento,
        IdEstatusPuesto: data.IdEstatusPuesto,
      }),
    });

    revalidatePath("/icalidad/puesto");
    revalidatePath(`/icalidad/puesto/${id}/edit`);
    return response || { Resultado: id, Mensaje: "Puesto actualizado exitosamente." };
  } catch (error: any) {
    console.error(`Failed to update puesto with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al actualizar el puesto.",
    };
  }
}

// Eliminar un puesto
export async function deletePuesto(id: number): Promise<PuestoSPResult> {
  try {
    const response = await apiFetch<PuestoSPResult>(`/puestos/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/icalidad/puesto");
    return response || { Resultado: 1, Mensaje: "Puesto eliminado exitosamente." };
  } catch (error: any) {
    console.error(`Failed to delete puesto with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al eliminar el puesto.",
    };
  }
}
