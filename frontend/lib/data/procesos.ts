'use server';

import { apiFetch } from "@/lib/api-client";
import { ProcesoFormData } from "@/lib/schemas/proceso";
import { revalidatePath } from "next/cache";

export interface ProcesosListItem {
    IdProceso: number;
    ClaveProceso: string;
    NombreProceso: string;
    ClaveNombreProceso?: string;
    ResponsableProceso?: string;
    IdEstatusProceso: boolean;
    IdEmpleadoResponsable?: number;
    NombreEmpleadoResponsable?: string;
    Estatus?: string;
}

interface PagedProcesosResponse {
    Items: ProcesosListItem[];
    TotalRecords: number;
    TotalPages: number;
    PageNumber: number;
    PageSize: number;
}

export interface ProcesoSPResult {
    Resultado: number;
    Mensaje: string;
}

export async function getProcesos(
    query: string,
    currentPage: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
): Promise<{ 
    procesos: ProcesosListItem[];
    totalPages: number;
    totalRecords: number
}> {
    try {
        const params = new URLSearchParams({
            query: query || "",
            pageNumber: currentPage.toString(),
            pageSize: pageSize.toString(),
            sortBy: sortBy || "NombreProceso",
            sortOrder: (sortOrder || "asc").toUpperCase(),
        });

        const data = await apiFetch<PagedProcesosResponse>(`/procesos?${params.toString()}`);
        return {
            procesos: data?.Items || [],
            totalPages: data?.TotalPages || 0,
            totalRecords: data?.TotalRecords || 0,
        };
    } catch (error) {
        console.error('Error al obtener los procesos:', error);
        return { procesos: [], totalPages: 0, totalRecords: 0 };
    }
}

export async function getProcesoById(id: number): Promise<ProcesosListItem | null> {
    try {
        const data = await apiFetch<ProcesosListItem>(`/procesos/${id}`);
        return data || null;
    } catch (error) {
        console.error(`Error al obtener el proceso con ID ${id}:`, error);
        return null;
    }
}

export async function createProceso(data: ProcesoFormData): Promise<ProcesoSPResult> {
    try {
        const response = await apiFetch<ProcesoSPResult>("/procesos", {
            method: "POST",
            body: JSON.stringify({
                ClaveProceso: data.ClaveProceso,
                NombreProceso: data.NombreProceso,
                IdEmpleadoResponsable: data.IdEmpleadoResponsable,
            }),
        });

        revalidatePath("/icalidad/proceso");
        return response || { Resultado: 1, Mensaje: "Proceso creado exitosamente." };
    } catch (error: any) {
        console.error("Error al crear el proceso:", error);
        return {
            Resultado: -1,
            Mensaje: error.message || "Error interno al crear el proceso.",
        };
    }
}

export async function updateProceso(id: number, data: ProcesoFormData): Promise<ProcesoSPResult> {
    try {
        const response = await apiFetch<ProcesoSPResult>(`/procesos/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                IdProceso: id,
                ClaveProceso: data.ClaveProceso,
                NombreProceso: data.NombreProceso,
                IdEstatusProceso: data.IdEstatusProceso,
                IdEmpleadoResponsable: data.IdEmpleadoResponsable,
            }),
        });

        revalidatePath("/icalidad/proceso");
        revalidatePath(`/icalidad/proceso/${id}/edit`);
        return response || { Resultado: id, Mensaje: "Proceso actualizado exitosamente." };
    } catch (error: any) {
        console.error("Error al actualizar el proceso:", error);
        return {
            Resultado: -1,
            Mensaje: error.message || "Error interno al actualizar el proceso.",
        };
    }
}

export async function deleteProceso(id: number): Promise<ProcesoSPResult> {
    try {
        const response = await apiFetch<ProcesoSPResult>(`/procesos/${id}`, {
            method: "DELETE",
        });

        revalidatePath("/icalidad/proceso");
        return response || { Resultado: 1, Mensaje: "Proceso eliminado exitosamente." };
    } catch (error: any) {
        console.error(`Error al eliminar el proceso con ID ${id}:`, error);
        return {
            Resultado: -1,
            Mensaje: error.message || "Error interno al eliminar el proceso.",
        };
    }
}
