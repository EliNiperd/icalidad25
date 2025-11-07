'use server';

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { RequisitoFormData } from "@/lib/schemas/requisito";

interface RequisitosListItem {
  IdRequisito: number;
  ClaveRequisito: string;
  NombreRequisito: string;
  IdNormativa: number;
  IdEstatusRequisito: boolean;
  TextoRequisito: string;
}

// Interfaz para el resultado de los SPs de CUD (Create, Update, Delete)
export interface RequisitoSPResult {
  Resultado: number;
  Mensaje: string;
}


// Función para recuperar todos los requisitos
export async function getRequisitos(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc'

): Promise<{ 
  requisitos: RequisitosListItem[];
  totalPages: number;
  totalRecords: number
}> {

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

    const result = await request.execute("PF_Gen_TRequisito");

    const requisitos = result.recordset as RequisitosListItem[];
    const totalRecords = requisitos.length > 0 ? (requisitos[0] as any).TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { requisitos, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch requisitos:", error);
    return { requisitos: [], totalPages: 0, totalRecords: 0 };
  }

  
}



export async function getRequisitoById(id: number): Promise<RequisitosListItem | null> {
   try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdRequisito", typeParam.Int, id);
      const result = await request.execute("PFK_Gen_TRequisito");
      const requisito = result.recordset[0] as RequisitosListItem;
      return requisito;
    } catch (error) {
      console.error(`Failed to fetch requisito with ID ${id}:`, error);
      return null;
    }
}

export async function createRequisito(data: RequisitoFormData): Promise<RequisitoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0) return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_ClaveRequisito", typeParam.NVarChar(50), data.ClaveRequisito);
    request.input("p_NombreRequisito", typeParam.NVarChar(250), data.NombreRequisito);
    request.input("p_IdNormativa", typeParam.Int, data.IdNormativa);
    request.input("p_IdEmpleadoAlta", typeParam.Int, userId);
    request.input("p_TextoRequisito", typeParam.NVarChar(250), data.TextoRequisito)
    

    const result = await request.execute("PI_Gen_TRequisito");
    return result.recordset[0] as RequisitoSPResult;
  } catch (error) {
    console.error("Failed to create requisito:", error);
    return { Resultado: -99, Mensaje: "Error interno al crear el requisito." };
  }
}

export async function updateRequisito(id: number, data: RequisitoFormData): Promise<RequisitoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0) return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdRequisito", typeParam.Int, id);
    request.input("p_ClaveRequisito", typeParam.NVarChar(50), data.ClaveRequisito);
    request.input("p_NombreRequisito", typeParam.NVarChar(250), data.NombreRequisito);
    request.input("p_IdNormativa", typeParam.Int, data.IdNormativa);
    request.input("p_IdEstatusRequisito", typeParam.Bit, data.IdEstatusRequisito);
    request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);
    request.input("p_TextoRequisito", typeParam.NVarChar(1000), data.TextoRequisito)

    const result = await request.execute("PU_Gen_TRequisito");
    return result.recordset[0] as RequisitoSPResult;
  } catch (error) {
    console.error(`Failed to update requisito with ID ${id}:`, error);
    return { Resultado: -99, Mensaje: "Error interno al actualizar el requisito." };
  }
}


// Función para eliminar un requisito
export async function deleteRequisito(id: number): Promise<RequisitoSPResult> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdRequisito", typeParam.Int, id);
    const result = await request.execute("PD_Gen_TRequisito");
    return result.recordset[0] as RequisitoSPResult;
  } catch (error) {
    console.error(`Failed to delete requisito with ID ${id}:`, error);
    return {
      Resultado: -99,
      Mensaje: "Error interno al eliminar el requisito.",
    };
  }
}
