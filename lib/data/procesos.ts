'use server';

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { ProcesoFormData } from "@/lib/schemas/proceso";

interface ProcesosListItem {
    IdProceso: number;
    ClaveProceso: string;
    NombreProceso: string;
    IdEstatusProceso: boolean;
    IdEmpleadoResponsable: number;
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
        const pool = await usegetPool("Default");
        const request = await pool.request();
        const typeParam = await typeParameter();

        request.input("p_SearchQuery", typeParam.NVarChar(100), query || null);
        request.input("p_IdEstatus", typeParam.NVarChar(5), '%');
        request.input("p_PageNumber", typeParam.Int, currentPage);
        request.input("p_PageSize", typeParam.Int, pageSize);
        request.input("p_SortBy", typeParam.NVarChar(50), sortBy);
        request.input("p_SortOrder", typeParam.NVarChar(4), sortOrder.toUpperCase());

        const result = await request.execute("PF_Gen_TProceso");

        const procesos = result.recordset as ProcesosListItem[];
        const totalRecords = procesos.length > 0 ? (procesos[0] as any).TotalRecords : 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return { procesos, totalPages, totalRecords };
    } catch (error) {
        console.error('Error al obtener los procesos:', error);
        return { procesos: [], totalPages: 0, totalRecords: 0 };
    }
}

export async function getProcesoById(id: number): Promise<ProcesosListItem | null> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, id);
      const result = await request.execute("PFK_Gen_TProceso");
      const proceso = result.recordset[0] as ProcesosListItem;
  
      return proceso;
    } catch (error) {
      console.error(`Error al obtener el proceso con ID ${id}:`, error);
      return null;
    }
  }


  export async function createProceso(data: ProcesoFormData): Promise<ProcesoSPResult> {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
    if (userId === 0) return { Resultado: 403, Mensaje: "Error de autenticación." };

    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_ClaveProceso", typeParam.NVarChar(50), data.ClaveProceso);
      request.input("p_NombreProceso", typeParam.NVarChar(100), data.NombreProceso);
      request.input("p_IdEmpleadoResponsable", typeParam.Int, data.IdEmpleadoResponsable);
      request.input("p_IdEmpleadoAlta", typeParam.Int, userId);
  
      const result = await request.execute("PI_Gen_TProceso");
      return result.recordset[0] as ProcesoSPResult;
    } catch (error) {
      console.error("Error al crear el proceso:", error);
      return {
        Resultado: 500,
        Mensaje: "Error interno al crear el proceso.",  
      };
    }
  }

  export async function updateProceso(id: number, data: ProcesoFormData): Promise<ProcesoSPResult> {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
    if (userId === 0) return { Resultado: 403, Mensaje: "Error de autenticación." };

    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, id);
      request.input("p_ClaveProceso", typeParam.NVarChar(50), data.ClaveProceso);
      request.input("p_NombreProceso", typeParam.NVarChar(100), data.NombreProceso);
      request.input("p_IdEstatusProceso", typeParam.Bit, data.IdEstatusProceso);
      request.input("p_IdEmpleadoResponsable", typeParam.Int, data.IdEmpleadoResponsable);
      request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);
  
      const result = await request.execute("PU_Gen_TProceso");
      return result.recordset[0] as ProcesoSPResult;
    } catch (error) {
      console.error("Error al actualizar el proceso:", error);
      return {
        Resultado: 500,
        Mensaje: "Error interno al actualizar el proceso.",  
      };
    }
  }

  export async function deleteProceso(id: number): Promise<ProcesoSPResult> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, id);
  
      const result = await request.execute("PD_Gen_TProceso");
      return result.recordset[0] as ProcesoSPResult;
    } catch (error) {
      console.error(`Error al eliminar el proceso con ID ${id}:`, error);
      return {
        Resultado: 500,
        Mensaje: "Error interno al eliminar el proceso.",  
      };
    }
  } 
