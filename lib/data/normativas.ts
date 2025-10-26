'use server';

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { NormativaFormData } from "@/lib/schemas/normativa";

// Interfaz para la lista de normativas (para dropdowns)
export interface NormativaListItem {
  IdNormativa: number;
  NombreNormativa: string;
}


// Interfaz para el resultado de los SPs de CUD (Create, Update, Delete)
export interface NormativaSPResult {
  Resultado: number;
  Mensaje: string;
}


// Función para obtener una lista simple de normativas activas
export async function getNormativasList(): Promise<NormativaListItem[]> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const result = await request.query(`
      SELECT IdNormativa, NombreNormativa 
      FROM Gen_TNormativa 
      WHERE IdEstatusNormativa = 1 
      ORDER BY NombreNormativa ASC
    `);
    return result.recordset as NormativaListItem[];
  } catch (error) {
    console.error("Failed to fetch normativas list:", error);
    return [];
  }
}

// Función para obtener todas las normativas con filtros, paginación y ordenamiento
export async function getNormativas(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Promise<{ normativas: any[]; totalPages: number; totalRecords: number }> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_SearchQuery", typeParam.NVarChar(100), query || null);
    request.input("p_PageNumber", typeParam.Int, currentPage);
    request.input("p_PageSize", typeParam.Int, pageSize);
    request.input("p_SortBy", typeParam.NVarChar(50), sortBy);
    request.input("p_SortOrder", typeParam.NVarChar(4), sortOrder.toUpperCase());

    const result = await request.execute("PF_Gen_TNormativa");

    const normativas = result.recordset;
    const totalRecords = normativas.length > 0 ? (normativas[0] as any).TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { normativas, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch normativas:", error);
    return { normativas: [], totalPages: 0, totalRecords: 0 };
  }
}

export async function getNormativaById(id: number): Promise<NormativaListItem | null> {
   try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdNormativa", typeParam.Int, id);
      const result = await request.execute("PFK_Gen_TNormativa");
      const normativa = result.recordset[0] as NormativaListItem;
      return normativa;
    } catch (error) {
      console.error(`Failed to fetch normativa with ID ${id}:`, error);
      return null;
    }
}

// Crear una nueva normativa
export async function createNormativa(data: NormativaFormData): Promise<NormativaSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0) return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_ClaveNormativa", typeParam.NVarChar(50), data.ClaveNormativa);
    request.input("p_NombreNormativa", typeParam.NVarChar(250), data.NombreNormativa);
    request.input("p_IdEmpleadoAlta", typeParam.Int, userId);

    const result = await request.execute("PI_Gen_TNormativa");
    return result.recordset[0] as NormativaSPResult;
  } catch (error) {
    console.error("Failed to create normativa:", error);
    return { Resultado: -99, Mensaje: "Error interno al crear la normativa." };
  }
}

// Actualizar una normativa
export async function updateNormativa(id: number, data: NormativaFormData): Promise<NormativaSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0) return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdNormativa", typeParam.Int, id);
    request.input("p_ClaveNormativa", typeParam.NVarChar(50), data.ClaveNormativa);
    request.input("p_NombreNormativa", typeParam.NVarChar(250), data.NombreNormativa);
    request.input("p_IdEstatusNormativa", typeParam.Bit, data.IdEstatusNormativa);
    request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);

    const result = await request.execute("PU_Gen_TNormativa");
    return result.recordset[0] as NormativaSPResult;
  } catch (error) {
    console.error(`Failed to update normativa with ID ${id}:`, error);
    return { Resultado: -99, Mensaje: "Error interno al actualizar la normativa." };
  }
}

// Función para eliminar un normativa
export async function deleteNormativa(id: number): Promise<NormativaSPResult> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdNormativa", typeParam.Int, id);
    const result = await request.execute("PD_Gen_TNormativa");
    return result.recordset[0] as NormativaSPResult;
  } catch (error) {
    console.error(`Failed to delete normativa with ID ${id}:`, error);
    return {
      Resultado: -99,
      Mensaje: "Error interno al eliminar el normativa.",
    };
  }
}
