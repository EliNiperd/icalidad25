'use server';

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { SubprocesoFormData } from "@/lib/schemas/subproceso";

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
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
      const result = await request.execute("PF_Gen_RProcesoSubProceso");
      return result.recordset as SubProcesoList[];
    } catch (error) {
      console.error(`Error al obtener los subprocesos para el proceso con ID ${IdProceso}:`, error);
      return [];
    }
  }

  export async function createSubProceso(IdProceso: number, data: SubprocesoFormData): Promise<SubProcesoSPResult> {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
    if (userId === 0) return { Resultado: 403, Mensaje: "Error de autenticación." };
  
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
      request.input("p_ClaveSubproceso", typeParam.NVarChar(50), data.ClaveSubproceso);
      request.input("p_DescripcionSubproceso", typeParam.NVarChar(100), data.DescripcionSubproceso);
      request.input("p_IdEmpleadoAlta", typeParam.Int, userId);
  
      const result = await request.execute("PI_Gen_RProcesoSubProceso");
      
      const spResult = result.recordset[0];
      if (!spResult) {
        return { Resultado: -1, Mensaje: "Error: El procedimiento almacenado no retornó un resultado." };
      }
      return spResult as SubProcesoSPResult;

    } catch (error) {
      console.error("Error al crear el subproceso:", error);
      return {
        Resultado: 500,
        Mensaje: "Error interno al crear el subproceso.",
      };
    }
  }


  export async function updateSubProceso(id: number, data: SubprocesoFormData): Promise<SubProcesoSPResult> {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
    if (userId === 0) return { Resultado: 403, Mensaje: "Error de autenticación." };
  
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      
      request.input("p_IdSubproceso", typeParam.Int, id);
      request.input("p_ClaveSubproceso", typeParam.NVarChar(50), data.ClaveSubproceso);
      request.input("p_DescripcionSubproceso", typeParam.NVarChar(100), data.DescripcionSubproceso);
      request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);
  
      const result = await request.execute("PU_Gen_RProcesoSubProceso");
      
      const spResult = result.recordset[0];
      if (!spResult) {
        return { Resultado: -1, Mensaje: "Error: El procedimiento almacenado no retornó un resultado." };
      }
      return spResult as SubProcesoSPResult;

    } catch (error) {
      console.error("Error al actualizar el subproceso:", error);
      return {
        Resultado: 500,
        Mensaje: "Error interno al actualizar el subproceso.",
      };
    }
  }


  export async function deleteSubProceso(id: number): Promise<SubProcesoSPResult> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdSubproceso", typeParam.Int, id);
  
      const result = await request.execute("PD_Gen_RProcesoSubProceso");
      const spResult = result.recordset[0];
      if (!spResult) {
        return { Resultado: -1, Mensaje: "Error: El procedimiento almacenado no retornó un resultado." };
      }
      return spResult as SubProcesoSPResult;
      
    } catch (error) {
      console.error(`Error al eliminar el subproceso con ID ${id}:`, error);
      return {
        Resultado: 500,
        Mensaje: "Error interno al eliminar el subproceso.",
      };
    }
  } 