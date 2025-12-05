'use server';

import { usegetPool, typeParameter } from "@/lib/database/connection";

export interface ProcesoRequisitoList {
    IdRequisito: number;
    NombreRequisito: string;
}

export async function getProcesoRequisitoDisponible(IdProceso: number): Promise<ProcesoRequisitoList[]> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
  
      const result = await request.execute("PF_Gen_RProcesoRequisitoDisponible");
      return result.recordset as ProcesoRequisitoList[];
    } catch (error) {
      console.error(`Error al obtener los requisitos para el proceso con ID ${IdProceso}:`, error);
      return [];
    }
  }

  export async function getProcesoRequisitoAsignado(IdProceso: number): Promise<ProcesoRequisitoList[]> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
  
      const result = await request.execute("PF_Gen_RProcesoRequisito");
      return result.recordset as ProcesoRequisitoList[];
    } catch (error) {
      console.error(`Error al obtener los requisitos para el proceso con ID ${IdProceso}:`, error);
      return [];
    }
  }


  // ========== FUNCIONES AUXILIARES para REQUISITOS ==========

  async function asignarRequisito(idProceso: number, idRequisitos: number[] ): Promise<void> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
      
      for (const IdRequisito of idRequisitos) {
        request.input("p_IdRequisito", typeParam.Int, IdRequisito);
        request.input("p_IdProceso", typeParam.Int, idProceso);
  
        await request.execute("PI_Gen_RProcesoRequisito");
      }
  
      //request.input("p_IdRequisito", typeParam.Int, idRequisitos);
      //request.input("p_IdProceso", typeParam.Int, idProceso);
  
      //await request.execute("PI_Gen_RProcesoRequisito");
    } catch (error) {
      console.error(`Error al asignar el requisito con ID ${idRequisitos} al proceso con ID ${idProceso}:`, error);
    }
  }

  async function removerRequisito(idProceso: number,idRequisitos: number[] ): Promise<void> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      for (const IdRequisito of idRequisitos) {
        request.input("p_IdRequisito", typeParam.Int, IdRequisito);
        request.input("p_IdProceso", typeParam.Int, idProceso);
  
        await request.execute("PD_Gen_RProcesoRequisito");
      }
    //   request.input("p_IdRequisito", typeParam.Int, idRequisitos);
    //   request.input("p_IdProceso", typeParam.Int, idProceso);
  
    //   await request.execute("PD_Gen_RProcesoRequisito");
    } catch (error) {
      console.error(`Error al remover el requisito con ID ${idRequisitos} del proceso con ID ${idProceso}:`, error);
    }
  }


  export async function asignarRemoverRequisitoAProceso(IdRequisitos: number[], idProceso: number): Promise<void> {
   // 2. Actualizar requisitos (comparar con los actuales)
       const requisitosActuales = await getProcesoRequisitoAsignado(idProceso);
       const idsActuales = requisitosActuales.map(p => p.IdRequisito);
       // valores de requisitos nuevos, recibidos desde el front
       const idsNuevos = IdRequisitos;
       // Puestos a agregar
       const requisitosAgregar = idsNuevos.filter(id => !idsActuales.includes(id));
       // Puestos a remover
       const requisitosRemover = idsActuales.filter(id => !idsNuevos.includes(id));
       if (requisitosAgregar.length > 0) {
         await asignarRequisito(idProceso, requisitosAgregar);
       }
       if (requisitosRemover.length > 0) {
         await removerRequisito(idProceso, requisitosRemover);
       }
  }