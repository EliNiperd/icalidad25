'use server';

import { usegetPool, typeParameter } from "@/lib/database/connection";

export interface ProcesoDepartamentoList {
    IdDepartamento: number;
    NombreDepartamento: string;
}

export async function getProcesoDepartamentoDisponible(IdProceso: number): Promise<ProcesoDepartamentoList[]> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
  
      const result = await request.execute("PF_Gen_RProcesoDepartamentoDisponible");
      return result.recordset as ProcesoDepartamentoList[];
    } catch (error) {
      console.error(`Error al obtener los departamentos disponibles para el proceso con ID ${IdProceso}:`, error);
      return [];
    }
  }

  export async function getProcesoDepartamentoAsignado(IdProceso: number): Promise<ProcesoDepartamentoList[]> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      request.input("p_IdProceso", typeParam.Int, IdProceso);
  
      const result = await request.execute("PF_Gen_RProcesoDepartamento");
      return result.recordset as ProcesoDepartamentoList[];
    } catch (error) {
      console.error(`Error al obtener los departamentos asignados para el proceso con ID ${IdProceso}:`, error);
      return [];
    }
  }


  // ========== FUNCIONES AUXILIARES para DEPARTAMENTOS ==========

  async function asignarDepartamento(idProceso: number, idDepartamentos: number[] ): Promise<void> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
      
      for (const IdDepartamento of idDepartamentos) {
        request.input("p_IdDepartamento", typeParam.Int, IdDepartamento);
        request.input("p_IdProceso", typeParam.Int, idProceso);
  
        await request.execute("PI_Gen_RProcesoDepartamento");
      }
    } catch (error) {
      console.error(`Error al asignar el departamento con ID ${idDepartamentos} al proceso con ID ${idProceso}:`, error);
    }
  }

  async function removerDepartamento(idProceso: number,idDepartamentos: number[] ): Promise<void> {
    try {
      const pool = await usegetPool("Default");
      const request = await pool.request();
      const typeParam = await typeParameter();
  
      for (const IdDepartamento of idDepartamentos) {
        request.input("p_IdDepartamento", typeParam.Int, IdDepartamento);
        request.input("p_IdProceso", typeParam.Int, idProceso);
  
        await request.execute("PD_Gen_RProcesoDepartamento");
      }
    } catch (error) {
      console.error(`Error al remover el departamento con ID ${idDepartamentos} del proceso con ID ${idProceso}:`, error);
    }
  }


  export async function asignarRemoverDepartamentoAProceso(IdDepartamentos: number[], idProceso: number): Promise<void> {
    // 2. Actualizar departamentos (comparar con los actuales)
       const departamentosActuales = await getProcesoDepartamentoAsignado(idProceso);
       const idsActuales = departamentosActuales.map(p => p.IdDepartamento);
       // valores de departamentos nuevos, recibidos desde el front
       const idsNuevos = IdDepartamentos;
       // Departamentos a agregar
       const departamentosAgregar = idsNuevos.filter(id => !idsActuales.includes(id));
       // Departamentos a remover
       const departamentosRemover = idsActuales.filter(id => !idsNuevos.includes(id));
       if (departamentosAgregar.length > 0) {
         await asignarDepartamento(idProceso, departamentosAgregar);
       }
       if (departamentosRemover.length > 0) {
         await removerDepartamento(idProceso, departamentosRemover);
       }
  }
