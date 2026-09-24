'use server';

import { apiFetch } from "@/lib/api-client";
import { Departamento, DepartamentoFormData, DepartamentoSPResult } from "@/lib/schemas/departamento";
import { revalidatePath } from "next/cache";

// Interfaz para la lista de departamentos (para dropdowns)
export interface DepartamentoListItem {
  IdDepartamento: number;
  ClaveDepartamento: string;
  NombreDepartamento: string;
  IdEstatusDepartamento: boolean;
  IdGerencia: number;
  NombreGerencia?: string;
}

interface PagedDepartamentosResponse {
  Items: Departamento[];
  TotalRecords: number;
  TotalPages: number;
  PageNumber: number;
  PageSize: number;
}

// Función para obtener una lista simple de departamentos activos (dropdowns)
export async function getDepartamentosList(idGerencia?: number): Promise<DepartamentoListItem[]> {
  try {
    const url = idGerencia ? `/departamentos/list?idGerencia=${idGerencia}` : "/departamentos/list";
    const data = await apiFetch<DepartamentoListItem[]>(url);
    return data || [];
  } catch (error) {
    console.error("Failed to fetch departamentos list:", error);
    return [];
  }
}

// Función para obtener departamentos con filtros, paginación y ordenamiento
export async function getDepartamentos(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{
  departamentos: Departamento[];
  totalPages: number;
  totalRecords: number;
}> {
  try {
    const params = new URLSearchParams({
      query: query || "",
      pageNumber: currentPage.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy || "NombreDepartamento",
      sortOrder: (sortOrder || "asc").toUpperCase(),
    });

    const data = await apiFetch<PagedDepartamentosResponse>(`/departamentos?${params.toString()}`);
    return {
      departamentos: data?.Items || [],
      totalPages: data?.TotalPages || 0,
      totalRecords: data?.TotalRecords || 0,
    };
  } catch (error) {
    console.error("Failed to fetch departamentos:", error);
    return { departamentos: [], totalPages: 0, totalRecords: 0 };
  }
}

// Función para obtener un departamento por su ID
export async function getDepartamentoById(id: number): Promise<DepartamentoFormData | null> {
  try {
    const data = await apiFetch<Departamento>(`/departamentos/${id}`);
    if (data) {
      return {
        IdDepartamento: data.IdDepartamento,
        ClaveDepartamento: data.ClaveDepartamento,
        NombreDepartamento: data.NombreDepartamento,
        IdGerencia: data.IdGerencia,
        IdEstatusDepartamento: data.IdEstatusDepartamento,
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch departamento with ID ${id}:`, error);
    return null;
  }
}

// Función para crear un nuevo departamento
export async function createDepartamento(
  data: DepartamentoFormData
): Promise<DepartamentoSPResult> {
  try {
    const result = await apiFetch<DepartamentoSPResult>("/departamentos", {
      method: "POST",
      body: JSON.stringify({
        ClaveDepartamento: data.ClaveDepartamento,
        NombreDepartamento: data.NombreDepartamento,
        IdGerencia: data.IdGerencia,
      }),
    });

    revalidatePath("/icalidad/departamento");
    return result;
  } catch (error: any) {
    console.error("Failed to create departamento:", error);
    return {
      Resultado: -99,
      Mensaje: error?.message || "Error al crear el departamento.",
    };
  }
}

// Función para actualizar un departamento
export async function updateDepartamento(
  id: number,
  data: DepartamentoFormData
): Promise<DepartamentoSPResult> {
  try {
    const result = await apiFetch<DepartamentoSPResult>(`/departamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        IdDepartamento: id,
        ClaveDepartamento: data.ClaveDepartamento,
        NombreDepartamento: data.NombreDepartamento,
        IdGerencia: data.IdGerencia,
        IdEstatusDepartamento: data.IdEstatusDepartamento,
      }),
    });

    revalidatePath("/icalidad/departamento");
    return result;
  } catch (error: any) {
    console.error(`Failed to update departamento with ID ${id}:`, error);
    return {
      Resultado: -99,
      Mensaje: error?.message || "Error al actualizar el departamento.",
    };
  }
}

// Función para eliminar un departamento
export async function deleteDepartamento(id: number): Promise<DepartamentoSPResult> {
  try {
    const result = await apiFetch<DepartamentoSPResult>(`/departamentos/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/icalidad/departamento");
    return result;
  } catch (error: any) {
    console.error(`Failed to delete departamento with ID ${id}:`, error);
    return {
      Resultado: -99,
      Mensaje: error?.message || "Error al eliminar el departamento.",
    };
  }
}
