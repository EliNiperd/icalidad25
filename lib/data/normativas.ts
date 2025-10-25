"use server";

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { Normativa, NormativaFormData } from "@/lib/schemas/normativa";
import { revalidatePath } from "next/cache";

export interface NormativaSPResult {
    Resultado: number;
    Mensaje: string;
}


// Función para obtener una lista simple de departamentos activos
export async function getNormativasList(): Promise<Normativa[]> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const result = await request.query(`
      SELECT IdNormativa, ClaveNormativa, NombreNormativa, IdEstatusNormativa 
      FROM Gen_TNormativa 
      WHERE IdEstatusNormativa = 1 
      ORDER BY NombreNormativa ASC
    `);
    return result.recordset as Normativa[];
  } catch (error) {
    console.error("Failed to fetch normativas list:", error);
    return [];
  }
}

// Función para obtener las normativas con filtros, paginación y ordenamiento
export async function getNormativas(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Promise<{ normativas: Normativa[]; totalPages: number; totalRecords: number }> {
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

    const result = await request.execute("PF_Gen_TNormativa");

    const normativas = result.recordset as Normativa[];
    const totalRecords = normativas.length > 0 ? (normativas[0] as any).TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { normativas, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch normativas:", error);
    return { normativas: [], totalPages: 0, totalRecords: 0 };
  }
}

// Función para obtener una normativa por su ID
export async function getNormativaById(id: number): Promise<Normativa | null> {
  try {
    const pool = await usegetPool("Default");
   const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdNormativa", typeParam.Int, id);

    const result = await request.execute("PFK_Gen_TNormativa");
    return result.recordset[0] as Normativa || null;
  } catch (error) {
    console.error("Failed to fetch normativa by ID:", error);
    return null;
  }
}


// Función para crear una nueva normativa
export async function createNormativa(data: NormativaFormData): Promise<NormativaSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input(
      "p_NombreNormativa",
      typeParam.NVarChar(100),
      data.NombreNormativa
    );
    request.input(
      "p_ClaveNormativa",
      typeParam.NVarChar(40),
      data.ClaveNormativa
    );
    request.input("p_IdEmpleadoAlta", typeParam.Int, userId);

    const result = await request.execute("PI_Gen_TNormativa");
    revalidatePath("/icalidad/normativas");
    return result.recordset[0] as NormativaSPResult;
  } catch (error) {
    console.error("Failed to create normativa:", error);
    return { Resultado: -1, Mensaje: "Error al crear la normativa." };
  }
}

// Función para actualizar una normativa
export async function updateNormativa(
  id: number,
  data: NormativaFormData
): Promise<NormativaSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();    

    request.input("p_IdNormativa", typeParam.Int, id);    
    request.input(
      "p_NombreNormativa",
      typeParam.NVarChar(100),
      data.NombreNormativa
    );
    request.input(
      "p_ClaveNormativa",
      typeParam.NVarChar(40),
      data.ClaveNormativa
    );
    request.input("p_IdEstatusNormativa", typeParam.Bit, data.IdEstatusNormativa);
    request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);

    const result = await request.execute("PU_Gen_TNormativa");
    revalidatePath("/icalidad/normativas");
    return result.recordset[0] as NormativaSPResult;
  } catch (error) {
    console.error("Failed to update normativa:", error);
    return { Resultado: -1, Mensaje: "Error al actualizar la normativa." };
  }
}

// Función para eliminar una normativa
export async function deleteNormativa(id: number): Promise<NormativaSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdNormativa", typeParam.Int, id);

    const result = await request.execute("PD_Gen_TNormativa");
    revalidatePath("/icalidad/normativas");
    return { Resultado: 200, Mensaje: "Normativa eliminada correctamente." };
    // el SP no devuelve recordset, ni resultado
    //return result.recordset[0] as NormativaSPResult;
  } catch (error) {
    console.error("Failed to delete normativa:", error);
    return { Resultado: -1, Mensaje: "Error al eliminar la normativa." };
  }
}