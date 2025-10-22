'use server';

import { usegetPool, typeParameter } from "@/lib/database/connection";
import { Gerencia, GerenciaFormData, GerenciaSPResult } from "@/lib/schemas/gerencia";

// Función para obtener todas las gerencias con filtros, paginación y ordenamiento
export async function getGerencias(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Promise<{ gerencias: Gerencia[]; totalPages: number; totalRecords: number }> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    // Parámetros para el SP PF_Gen_TGerencia optimizado
    request.input("p_SearchQuery", typeParam.NVarChar(100), query || null); // Nuevo parámetro de búsqueda
    request.input("p_IdEstatus", typeParam.NVarChar(5), '%'); // Obtener todos los estatus por defecto
    request.input("p_PageNumber", typeParam.Int, currentPage);
    request.input("p_PageSize", typeParam.Int, pageSize);
    request.input("p_SortBy", typeParam.NVarChar(50), sortBy);
    request.input("p_SortOrder", typeParam.NVarChar(4), sortOrder.toUpperCase());

    const result = await request.execute("PF_Gen_TGerencia");

    const gerencias = result.recordset as Gerencia[];
    const totalRecords = gerencias.length > 0 ? (gerencias[0] as any).TotalRecords : 0; // Leer TotalRecords del primer registro
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { gerencias, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch gerencias:", error);
    return { gerencias: [], totalPages: 0, totalRecords: 0 };
  }
}

// Función para obtener una gerencia por su ID
export async function getGerenciaById(id: number): Promise<GerenciaFormData | null> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdGerencia", typeParam.Int, id);

    const result = await request.execute("PFK_Gen_TGerencia");

    if (result.recordset && result.recordset.length > 0) {
      const gerencia = result.recordset[0];
      // Mapear los campos para que coincidan con GerenciaFormData
      return {
        IdGerencia: gerencia.IdGerencia,
        ClaveGerencia: gerencia.ClaveGerencia,
        NombreGerencia: gerencia.NombreGerencia,
        IdEstatusGerencia: gerencia.IdEstatusGerencia,
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
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_NombreGerencia", typeParam.NVarChar(100), data.NombreGerencia);
    request.input("p_ClaveGerencia", typeParam.NVarChar(40), data.ClaveGerencia);
    request.input("p_IdEmpleadoAlta", typeParam.Int, 0); // TODO: Obtener el IdEmpleadoAlta de la sesión

    const result = await request.execute("PI_Gen_TGerencia");
    return result.recordset[0] as GerenciaSPResult;
  } catch (error) {
    console.error("Failed to create gerencia:", error);
    return { Resultado: -99, Mensaje: "Error interno al crear gerencia." };
  }
}

// Función para actualizar una gerencia existente
export async function updateGerencia(id: number, data: GerenciaFormData): Promise<GerenciaSPResult> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdGerencia", typeParam.Int, id);
    request.input("p_NombreGerencia", typeParam.NVarChar(100), data.NombreGerencia);
    request.input("p_ClaveGerencia", typeParam.NVarChar(40), data.ClaveGerencia);
    request.input("p_IdEstatusGerencia", typeParam.Bit, data.IdEstatusGerencia);
    request.input("p_IdEmpleadoActualiza", typeParam.Int, 0); // TODO: Obtener el IdEmpleadoActualiza de la sesión

    const result = await request.execute("PU_Gen_TGerencia");
    return result.recordset[0] as GerenciaSPResult;
  } catch (error) {
    console.error(`Failed to update gerencia with ID ${id}:`, error);
    return { Resultado: -99, Mensaje: "Error interno al actualizar gerencia." };
  }
}

// Función para eliminar una gerencia
export async function deleteGerencia(id: number): Promise<GerenciaSPResult> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdGerencia", typeParam.Int, id);
    // Asumiendo que PD_Gen_TGerencia también devuelve Resultado y Mensaje
    const result = await request.execute("PD_Gen_TGerencia"); 
    return result.recordset[0] as GerenciaSPResult;
  } catch (error) {
    console.error(`Failed to delete gerencia with ID ${id}:`, error);
    return { Resultado: -99, Mensaje: "Error interno al eliminar gerencia." };
  }
}
