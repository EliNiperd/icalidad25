'use server';

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { Gerencia, GerenciaFormData, GerenciaSPResult } from "@/lib/schemas/gerencia";
import { revalidatePath } from "next/cache";

// Interfaz para la lista de gerencias (para dropdowns)
export interface GerenciaListItem {
  IdGerencia: number;
  NombreGerencia: string;
}

// Función para obtener una lista simple de gerencias activas
export async function getGerenciasList(): Promise<GerenciaListItem[]> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    // Ejecuta una consulta simple para obtener solo las gerencias activas
    const result = await request.query(`
      SELECT IdGerencia, NombreGerencia 
      FROM Gen_TGerencia 
      WHERE IdEstatusGerencia = 1 
      ORDER BY NombreGerencia ASC
    `);
    return result.recordset as GerenciaListItem[];
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
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_SearchQuery", typeParam.NVarChar(100), query || null);
    request.input("p_IdEstatus", typeParam.NVarChar(5), '%');
    request.input("p_PageNumber", typeParam.Int, currentPage);
    request.input("p_PageSize", typeParam.Int, pageSize);
    request.input("p_SortBy", typeParam.NVarChar(50), sortBy);
    request.input("p_SortOrder", typeParam.NVarChar(4), sortOrder.toUpperCase());

    const result = await request.execute("PF_Gen_TGerencia");

    const gerencias = result.recordset as Gerencia[];
    const totalRecords = gerencias.length > 0 ? (gerencias[0] as any).TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    //console.log('Gerencias - totalRecords:  ', totalRecords, 'totalPages:  ', totalPages, 'pageSize:  ', pageSize);

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
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;

  if (userId === 0) {
    return { Resultado: -1, Mensaje: "Error de autenticación: No se pudo obtener el ID del usuario." };
  }

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_NombreGerencia", typeParam.NVarChar(100), data.NombreGerencia);
    request.input("p_ClaveGerencia", typeParam.NVarChar(40), data.ClaveGerencia);
    request.input("p_IdEmpleadoAlta", typeParam.Int, userId);

    const result = await request.execute("PI_Gen_TGerencia");

    revalidatePath("/icalidad/gerencias");

    return result.recordset[0] as GerenciaSPResult;
  } catch (error) {
    console.error("Failed to create gerencia:", error);
    return { Resultado: -99, Mensaje: "Error interno al crear gerencia." };
  }
}

// Función para actualizar una gerencia existente
export async function updateGerencia(id: number, data: GerenciaFormData): Promise<GerenciaSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;

  if (userId === 0) {
    return { Resultado: -1, Mensaje: "Error de autenticación: No se pudo obtener el ID del usuario." };
  }

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdGerencia", typeParam.Int, id);
    request.input("p_NombreGerencia", typeParam.NVarChar(100), data.NombreGerencia);
    request.input("p_ClaveGerencia", typeParam.NVarChar(40), data.ClaveGerencia);
    request.input("p_IdEstatusGerencia", typeParam.Bit, data.IdEstatusGerencia);
    request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);

    const result = await request.execute("PU_Gen_TGerencia");

    revalidatePath("/icalidad/gerencias");

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
    const result = await request.execute("PD_Gen_TGerencia"); 
    
    revalidatePath("/icalidad/gerencias");
    return result.recordset[0] as GerenciaSPResult;
  } catch (error) {
    console.error(`Failed to delete gerencia with ID ${id}:`, error);
    return { Resultado: -99, Mensaje: "Error interno al eliminar gerencia." };
  }
}