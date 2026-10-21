'use server';

import { apiFetch } from "@/lib/api-client";
import { SubprocesoFormData } from "@/lib/schemas/subproceso";
import { revalidatePath } from "next/cache";

export interface SubProcesoList {
    IdSubProceso: number;
    ClaveSubProceso: string;
    DescripcionSubProceso: string;
    IdProceso: number;
}

export interface SubProcesoSPResult {
    Resultado: number;
    Mensaje: string;
}

export async function getSubProcesos(IdProceso: number): Promise<SubProcesoList[]> {
    try {
        const data = await apiFetch<SubProcesoList[]>(`/procesos/${IdProceso}/subprocesos`);
        return data || [];
    } catch (error) {
        console.error(`Error al obtener los subprocesos para el proceso con ID ${IdProceso}:`, error);
        return [];
    }
}

export async function createSubProceso(IdProceso: number, data: SubprocesoFormData): Promise<SubProcesoSPResult> {
    try {
        const response = await apiFetch<SubProcesoSPResult>(`/procesos/${IdProceso}/subprocesos`, {
            method: "POST",
            body: JSON.stringify({
                IdProceso: IdProceso,
                ClaveSubProceso: data.ClaveSubproceso,
                DescripcionSubProceso: data.DescripcionSubproceso,
            }),
        });

        revalidatePath(`/icalidad/proceso/${IdProceso}/edit`);
        return response || { Resultado: 1, Mensaje: "SubProceso creado exitosamente." };
    } catch (error: any) {
        console.error("Error al crear el subproceso:", error);
        return {
            Resultado: -1,
            Mensaje: error.message || "Error interno al crear el subproceso.",
        };
    }
}

export async function updateSubProceso(id: number, data: SubprocesoFormData): Promise<SubProcesoSPResult> {
    try {
        const response = await apiFetch<SubProcesoSPResult>(`/procesos/subprocesos/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                IdSubProceso: id,
                IdProceso: 0,
                ClaveSubProceso: data.ClaveSubproceso,
                DescripcionSubProceso: data.DescripcionSubproceso,
            }),
        });

        return response || { Resultado: id, Mensaje: "SubProceso actualizado exitosamente." };
    } catch (error: any) {
        console.error("Error al actualizar el subproceso:", error);
        return {
            Resultado: -1,
            Mensaje: error.message || "Error interno al actualizar el subproceso.",
        };
    }
}

export async function deleteSubProceso(id: number): Promise<SubProcesoSPResult> {
    try {
        const response = await apiFetch<SubProcesoSPResult>(`/procesos/subprocesos/${id}`, {
            method: "DELETE",
        });

        return response || { Resultado: 1, Mensaje: "SubProceso eliminado exitosamente." };
    } catch (error: any) {
        console.error(`Error al eliminar el subproceso con ID ${id}:`, error);
        return {
            Resultado: -1,
            Mensaje: error.message || "Error interno al eliminar el subproceso.",
        };
    }
}
