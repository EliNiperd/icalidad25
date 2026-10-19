"use server";

import { apiFetch } from "@/lib/api-client";
import { RequisitoFormData } from "@/lib/schemas/requisito";
import { revalidatePath } from "next/cache";

export interface RequisitosListItem {
  IdRequisito: number;
  ClaveRequisito: string;
  NombreRequisito: string;
  IdNormativa: number;
  ClaveNormativa?: string;
  NombreNormativa?: string;
  ClaveNombreRequisito?: string;
  IdEstatusRequisito: boolean;
  TextoRequisito?: string;
  IdTipoRequisito?: number;
  Estatus?: string;
}

interface PagedRequisitosResponse {
  Items: RequisitosListItem[];
  TotalRecords: number;
  TotalPages: number;
  PageNumber: number;
  PageSize: number;
}

// Interfaz para el resultado de las acciones CUD
export interface RequisitoSPResult {
  Resultado: number;
  Mensaje: string;
}

// Función para recuperar todos los requisitos con paginación y filtros
export async function getRequisitos(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc",
  idNormativa?: number
): Promise<{
  requisitos: RequisitosListItem[];
  totalPages: number;
  totalRecords: number;
}> {
  try {
    const params = new URLSearchParams({
      query: query || "",
      pageNumber: currentPage.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy || "ClaveRequisito",
      sortOrder: (sortOrder || "asc").toUpperCase(),
    });

    if (idNormativa && idNormativa > 0) {
      params.append("idNormativa", idNormativa.toString());
    }

    const data = await apiFetch<PagedRequisitosResponse>(`/requisitos?${params.toString()}`);
    return {
      requisitos: data?.Items || [],
      totalPages: data?.TotalPages || 0,
      totalRecords: data?.TotalRecords || 0,
    };
  } catch (error) {
    console.error("Failed to fetch requisitos:", error);
    return { requisitos: [], totalPages: 0, totalRecords: 0 };
  }
}

export async function getRequisitosByNormativa(idNormativa: number): Promise<RequisitosListItem[]> {
  try {
    const data = await apiFetch<RequisitosListItem[]>(`/requisitos/normativa/${idNormativa}`);
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch requisitos for normativa ${idNormativa}:`, error);
    return [];
  }
}

export async function getRequisitoById(id: number): Promise<RequisitosListItem | null> {
  try {
    const data = await apiFetch<RequisitosListItem>(`/requisitos/${id}`);
    return data || null;
  } catch (error) {
    console.error(`Failed to fetch requisito with ID ${id}:`, error);
    return null;
  }
}

export async function createRequisito(data: RequisitoFormData): Promise<RequisitoSPResult> {
  try {
    const response = await apiFetch<RequisitoSPResult>("/requisitos", {
      method: "POST",
      body: JSON.stringify({
        ClaveRequisito: data.ClaveRequisito,
        NombreRequisito: data.NombreRequisito,
        IdNormativa: data.IdNormativa,
        TextoRequisito: data.TextoRequisito,
      }),
    });

    revalidatePath("/icalidad/requisito");
    return response || { Resultado: 1, Mensaje: "Requisito creado exitosamente." };
  } catch (error: any) {
    console.error("Failed to create requisito:", error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al crear el requisito.",
    };
  }
}

export async function updateRequisito(id: number, data: RequisitoFormData): Promise<RequisitoSPResult> {
  try {
    const response = await apiFetch<RequisitoSPResult>(`/requisitos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        IdRequisito: id,
        ClaveRequisito: data.ClaveRequisito,
        NombreRequisito: data.NombreRequisito,
        IdNormativa: data.IdNormativa,
        IdEstatusRequisito: data.IdEstatusRequisito,
        TextoRequisito: data.TextoRequisito,
      }),
    });

    revalidatePath("/icalidad/requisito");
    revalidatePath(`/icalidad/requisito/${id}/edit`);
    return response || { Resultado: id, Mensaje: "Requisito actualizado exitosamente." };
  } catch (error: any) {
    console.error(`Failed to update requisito with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al actualizar el requisito.",
    };
  }
}

// Función para eliminar un requisito
export async function deleteRequisito(id: number): Promise<RequisitoSPResult> {
  try {
    const response = await apiFetch<RequisitoSPResult>(`/requisitos/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/icalidad/requisito");
    return response || { Resultado: 1, Mensaje: "Requisito eliminado exitosamente." };
  } catch (error: any) {
    console.error(`Failed to delete requisito with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al eliminar el requisito.",
    };
  }
}
