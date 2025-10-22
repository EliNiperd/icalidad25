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

    // NOTA: Tu SP actual PF_Gen_TGerencia no tiene parámetros de paginación/ordenamiento.
    // Necesitarás modificarlo para incluir @p_PageNumber, @p_PageSize, @p_SortBy, @p_SortOrder.
    // Por ahora, solo pasaremos los filtros de búsqueda.
    
    request.input("p_ClaveGerencia", typeParam.NVarChar(50), query); // Pasar query directamente
    request.input("p_NombreGerencia", typeParam.NVarChar(100), query); // Pasar query directamente
    request.input("p_IdEstatus", typeParam.NVarChar(5), '%'); // Obtener todos los estatus por defecto

    const result = await request.execute("PF_Gen_TGerencia");

    // NOTA: La paginación y el total de páginas/registros se calcularán aquí en el backend
    // o tu SP debería devolverlos. Por ahora, simularemos.
    const allGerencias = result.recordset as Gerencia[];
    const totalRecords = allGerencias.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Simulación de paginación y ordenamiento en el backend (idealmente el SP lo haría)
    const sortedGerencias = allGerencias.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedGerencias = sortedGerencias.slice(startIndex, endIndex);

    return { gerencias: paginatedGerencias, totalPages, totalRecords };
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
