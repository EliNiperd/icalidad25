"use server";

import { apiFetch } from "@/lib/api-client";
import {
  EmpleadoFormData,
  EmpleadoSPResult,
  Empleado,
  PuestoAsignado,
  RolAsignado,
  HistorialPuesto,
} from "@/lib/schemas/empleado";
import { revalidatePath } from "next/cache";

// Interfaz para la lista de empleados (para dropdowns)
export interface EmpleadoListItem {
  IdEmpleado: number;
  NombreEmpleado: string;
  UserName: string;
  Correo?: string;
  IdEstatusEmpleado: boolean;
  Estatus: string;
}

interface PagedEmpleadosResponse {
  Items: Empleado[];
  TotalRecords: number;
  TotalPages: number;
  PageNumber: number;
  PageSize: number;
}

// Obtener lista simple de empleados activos para selectores
export async function getEmpleadosList(): Promise<EmpleadoListItem[]> {
  try {
    const data = await apiFetch<EmpleadoListItem[]>("/empleados/list");
    return data || [];
  } catch (error) {
    console.error("Failed to fetch empleados list:", error);
    return [];
  }
}

// Obtener empleados con paginación, filtros y ordenamiento
export async function getEmpleados(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{ empleados: Empleado[]; totalPages: number; totalRecords: number }> {
  try {
    const params = new URLSearchParams({
      query: query || "",
      pageNumber: currentPage.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy || "NombreEmpleado",
      sortOrder: (sortOrder || "asc").toUpperCase(),
    });

    const data = await apiFetch<PagedEmpleadosResponse>(`/empleados?${params.toString()}`);

    return {
      empleados: data?.Items || [],
      totalPages: data?.TotalPages || 0,
      totalRecords: data?.TotalRecords || 0,
    };
  } catch (error) {
    console.error("Failed to fetch empleados:", error);
    return { empleados: [], totalPages: 0, totalRecords: 0 };
  }
}

// Obtener un empleado por su ID para edición
export async function getEmpleadoById(idEmpleado: number): Promise<EmpleadoFormData | null> {
  try {
    const empleado = await apiFetch<Empleado>(`/empleados/${idEmpleado}`);
    if (!empleado) return null;

    return {
      IdEmpleado: empleado.IdEmpleado,
      NombreEmpleado: empleado.NombreEmpleado,
      UserName: empleado.UserName,
      Password: empleado.Password,
      Correo: empleado.Correo || "",
      IdPuestos: (empleado.Puestos || []).map((p) => p.IdPuesto),
      IdRoles: (empleado.Roles || []).map((r) => r.IdRol),
      IdEstatusEmpleado: empleado.IdEstatusEmpleado,
    };
  } catch (error) {
    console.error(`Failed to fetch empleado with ID ${idEmpleado}:`, error);
    return null;
  }
}

// Obtener puestos asignados a un empleado
export async function getPuestosByEmpleado(idEmpleado: number): Promise<PuestoAsignado[]> {
  try {
    const puestos = await apiFetch<PuestoAsignado[]>(`/empleados/${idEmpleado}/puestos`);
    return puestos || [];
  } catch (error) {
    console.error("Failed to fetch puestos by empleado:", error);
    return [];
  }
}

// Obtener roles asignados a un empleado
export async function getRolesByEmpleado(idEmpleado: number): Promise<RolAsignado[]> {
  try {
    const roles = await apiFetch<RolAsignado[]>(`/empleados/${idEmpleado}/roles`);
    return roles || [];
  } catch (error) {
    console.error("Failed to fetch roles by empleado:", error);
    return [];
  }
}

// Obtener historial de puestos asignados
export async function getHistorialPuestos(idEmpleado: number): Promise<HistorialPuesto[]> {
  try {
    // Si la funcionalidad es requerida en frontend, se consulta el endpoint de auditoría correspondiente
    return [];
  } catch (error) {
    console.error("Failed to fetch historial:", error);
    return [];
  }
}

// Crear un nuevo empleado
export async function createEmpleado(data: EmpleadoFormData): Promise<EmpleadoSPResult> {
  try {
    const payload = {
      NombreEmpleado: data.NombreEmpleado.trim(),
      UserName: data.UserName.trim(),
      Password: data.Password.trim(),
      Correo: data.Correo?.trim() || null,
      IdPuestos: data.IdPuestos,
      IdRoles: data.IdRoles,
      IdEstatusEmpleado: data.IdEstatusEmpleado ?? true,
    };

    const result = await apiFetch<EmpleadoSPResult>("/empleados", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    revalidatePath("/icalidad/empleado");
    return result;
  } catch (error: any) {
    console.error("Failed to create empleado:", error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al crear el empleado.",
    };
  }
}

// Actualizar un empleado
export async function updateEmpleado(id: number, data: EmpleadoFormData): Promise<EmpleadoSPResult> {
  try {
    const payload = {
      IdEmpleado: id,
      NombreEmpleado: data.NombreEmpleado.trim(),
      UserName: data.UserName.trim(),
      Password: data.Password.trim(),
      Correo: data.Correo?.trim() || null,
      IdPuestos: data.IdPuestos,
      IdRoles: data.IdRoles,
      IdEstatusEmpleado: data.IdEstatusEmpleado ?? true,
    };

    const result = await apiFetch<EmpleadoSPResult>(`/empleados/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    revalidatePath("/icalidad/empleado");
    revalidatePath(`/icalidad/empleado/${id}/edit`);
    return result;
  } catch (error: any) {
    console.error(`Failed to update empleado with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al actualizar el empleado.",
    };
  }
}

// Eliminar un empleado
export async function deleteEmpleado(id: number): Promise<EmpleadoSPResult> {
  try {
    const result = await apiFetch<EmpleadoSPResult>(`/empleados/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/icalidad/empleado");
    return result;
  } catch (error: any) {
    console.error(`Failed to delete empleado with ID ${id}:`, error);
    return {
      Resultado: -1,
      Mensaje: error.message || "Error interno al eliminar el empleado.",
    };
  }
}