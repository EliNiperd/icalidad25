'use server';

import { usegetPool, typeParameter } from "@/lib/database/connection";

export interface ProcesoColaboradorList {
    IdEmpleado: number;
    NombreEmpleado: string;
}

export async function getProcesoColaboradorDisponible(IdProceso: number): Promise<ProcesoColaboradorList[]> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
  
      const result = await request.execute("PF_Gen_RProcesoEmpleadoDisponible");
      return result.recordset as ProcesoColaboradorList[];
    } catch (error) {
      console.error(`Error al obtener los colaboradores disponibles para el proceso con ID ${IdProceso}:`, error);
      return [];
    }
  }

  export async function getProcesoColaboradorAsignado(IdProceso: number): Promise<ProcesoColaboradorList[]> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
  
      const result = await request.execute("PF_Gen_RProcesoEmpleado");
      return result.recordset as ProcesoColaboradorList[];
    } catch (error) {
      console.error(`Error al obtener los colaboradores asignados para el proceso con ID ${IdProceso}:`, error);
      return [];
    }
  }


  // ========== FUNCIONES AUXILIARES para COLABORADORES ==========

  async function asignarColaborador(idProceso: number, idEmpleados: number[] ): Promise<void> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
      
    for (const IdEmpleado of idEmpleados) {
        const request = await pool.request();
        request.input("p_IdEmpleado", typeParam.Int, IdEmpleado);
        request.input("p_IdProceso", typeParam.Int, idProceso);
  
        await request.execute("PI_Gen_RProcesoEmpleado");
      }
    } catch (error) {
      console.error(`Error al asignar el colaborador con ID ${idEmpleados} al proceso con ID ${idProceso}:`, error);
    }
  }

  async function removerColaborador(idProceso: number,idEmpleados: number[] ): Promise<void> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
    for (const IdEmpleado of idEmpleados) {
        const request = await pool.request();
        request.input("p_IdEmpleado", typeParam.Int, IdEmpleado);
        request.input("p_IdProceso", typeParam.Int, idProceso);
  
        await request.execute("PD_Gen_RProcesoEmpleado");
      }
    } catch (error) {
      console.error(`Error al remover el colaborador con ID ${idEmpleados} del proceso con ID ${idProceso}:`, error);
    }
  }


  export async function asignarRemoverColaboradorAProceso(IdEmpleados: number[], idProceso: number): Promise<void> {
    // 2. Actualizar colaboradores (comparar con los actuales)
       const colaboradoresActuales = await getProcesoColaboradorAsignado(idProceso);
       const idsActuales = colaboradoresActuales.map(p => p.IdEmpleado);
       // valores de colaboradores nuevos, recibidos desde el front
       const idsNuevos = IdEmpleados;
       // Colaboradores a agregar
       const colaboradoresAgregar = idsNuevos.filter(id => !idsActuales.includes(id));
       // Colaboradores a remover
       const colaboradoresRemover = idsActuales.filter(id => !idsNuevos.includes(id));
       if (colaboradoresAgregar.length > 0) {
         await asignarColaborador(idProceso, colaboradoresAgregar);
       }
       if (colaboradoresRemover.length > 0) {
         await removerColaborador(idProceso, colaboradoresRemover);
       }
  }
