"use server";

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import {
  Departamento,
  DepartamentoFormData,
  DepartamentoSPResult,
} from "@/lib/schemas/departamento";

// Función para obtener todos los departamentos incluyendo filtros, paginación y ordenamiento
export const getDepartamentos = async (
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{
  departamentos: Departamento[];
  totalPages: number;
  totalRecords: number;
}> => {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    // Parámetros para el SP PF_Gen_TDepartamento optimizado
    request.input("p_SearchQuery", typeParam.NVarChar(100), query || null); // Nuevo parámetro de búsqueda
    request.input("p_IdEstatus", typeParam.NVarChar(5), "%"); // Obtener todos los estatus por defecto
    request.input("p_PageNumber", typeParam.Int, currentPage);
    request.input("p_PageSize", typeParam.Int, pageSize);
    request.input("p_SortBy", typeParam.NVarChar(50), sortBy);
    request.input(
      "p_SortOrder",
      typeParam.NVarChar(4),
      sortOrder.toUpperCase()
    );

    const result = await request.execute("PF_Gen_TDepartamento");

    const departamentos = result.recordset as Departamento[];
    const totalRecords =
      departamentos.length > 0 ? (departamentos[0] as any).TotalRecords : 0; // Leer TotalRecords del primer registro
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { departamentos, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch departamentos:", error);
    return { departamentos: [], totalPages: 0, totalRecords: 0 };
  }
};

export const getDepartamentoById = async (
  id: number
): Promise<Departamento | null> => {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdDepartamento", typeParam.Int, id);

    const result = await request.execute("PFK_Gen_TDepartamento");

    if (result.recordset && result.recordset.length > 0) {
      const departamento = result.recordset[0];
      // Mapear los campos para que coincidan con DepartamentoFormData
      return {
        IdDepartamento: departamento.IdDepartamento,
        ClaveDepartamento: departamento.ClaveDepartamento,
        NombreDepartamento: departamento.NombreDepartamento,
        IdGerencia: departamento.IdGerencia,
        IdEstatusDepartamento: departamento.IdEstatusDepartamento,
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch departamento with ID ${id}:`, error);
    return null;
  }
};

// Función para crear un nuevo departamento
export const createDepartamento = async (
  data: DepartamentoFormData
): Promise<DepartamentoSPResult> => {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0) {
    return {
      Resultado: 500,
      Mensaje: "Error de autenticación: No se pudo obtener el ID del usuario.",
    };
  }

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input(
      "p_NombreDepartamento",
      typeParam.NVarChar(100),
      data.NombreDepartamento
    );
    request.input(
      "p_ClaveDepartamento",
      typeParam.NVarChar(40),
      data.ClaveDepartamento
    );
    request.input("p_IdGerencia", typeParam.Int, data.IdGerencia);
    request.input("p_IdEmpleadoAlta", typeParam.Int, userId); 

    const result = await request.execute("PI_Gen_TDepartamento");
    return result.recordset[0] as DepartamentoSPResult;
  } catch (error) {
    console.error("Failed to create departamento:", error);
    return { Resultado: 500, Mensaje: "Error interno al crear departamento." };
  }
};

// Función para actualizar un departamento existente
export const updateDepartamento = async (
  id: number,
  data: DepartamentoFormData
): Promise<DepartamentoSPResult> => {

  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0) {
    return {
      Resultado: 500,
      Mensaje: "Error de autenticación: No se pudo obtener el ID del usuario.",
    };
  }

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdDepartamento", typeParam.Int, id);
    request.input(
      "p_NombreDepartamento",
      typeParam.NVarChar(100),
      data.NombreDepartamento
    );
    request.input(
      "p_ClaveDepartamento",
      typeParam.NVarChar(40),
      data.ClaveDepartamento
    );
    request.input("p_IdGerencia", typeParam.Int, data.IdGerencia);
    request.input(
      "p_IdEstatusDepartamento",
      typeParam.Bit,
      data.IdEstatusDepartamento
    );
    request.input("p_IdEmpleadoActualiza", typeParam.Int, userId); 

    const result = await request.execute("PU_Gen_TDepartamento");
    return result.recordset[0] as DepartamentoSPResult;
  } catch (error) {
    console.error(`Failed to update departamento with ID ${id}:`, error);
    return {
      Resultado: 500,
      Mensaje: "Error interno al actualizar departamento.",
    };
  }
};

// Función para eliminar un departamento
export const deleteDepartamento = async (
  id: number
): Promise<DepartamentoSPResult> => {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdDepartamento", typeParam.Int, id);
    // Asumiendo que PD_Gen_TDepartamento tambien devuelve Resultado y Mensaje
    const result = await request.execute("PD_Gen_TDepartamento");
    return result.recordset[0] as DepartamentoSPResult;
  } catch (error) {
    console.error(`Failed to delete departamento with ID ${id}:`, error);
    return { Resultado: 500, Mensaje: "Error interno al eliminar gerencia." };
  }
};
