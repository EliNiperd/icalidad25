"use server";

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import {
  DepartamentoFormData,
  DepartamentoSPResult,
} from "@/lib/schemas/departamento";

// Interfaz para la lista de departamentos (para dropdowns)
export interface DepartamentoListItem {
  IdDepartamento: number;
  ClaveDepartamento: string;
  NombreDepartamento: string;
  IdEstatusDepartamento: boolean;
  IdGerencia: number;
}

// Función para obtener una lista simple de departamentos activos
export async function getDepartamentosList(): Promise<DepartamentoListItem[]> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const result = await request.query(`
      SELECT IdDepartamento, NombreDepartamento 
      FROM Gen_TDepartamento 
      WHERE IdEstatusDepartamento = 1 
      ORDER BY NombreDepartamento ASC
    `);
    return result.recordset as DepartamentoListItem[];
  } catch (error) {
    console.error("Failed to fetch departamentos list:", error);
    return [];
  }
}

// Las demás funciones (getDepartamentos, getDepartamentoById, etc.) permanecen aquí...

// función para obtener departamento con filtros, paginación y ordenamiento
export async function getDepartamentos(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{
  departamentos: DepartamentoListItem[];
  totalPages: number;
  totalRecords: number;
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

    const result = await request.execute("PF_Gen_TDepartamento");

    const departamentos = result.recordset as DepartamentoListItem[];
    const totalRecords = departamentos.length > 0 ? (departamentos[0] as any).TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { departamentos, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch departamentos:", error);
    return { departamentos: [], totalPages: 0, totalRecords: 0 };
  }
}

// Función para obtener un departamento por su ID
export async function getDepartamentoById(id: number): Promise<DepartamentoListItem | null> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdDepartamento", typeParam.Int, id);

    const result = await request.execute("PFK_Gen_TDepartamento");

    if (result.recordset && result.recordset.length > 0) {
      const depto = result.recordset[0] as DepartamentoListItem;
      return {
        IdDepartamento: depto.IdDepartamento,
        ClaveDepartamento: depto.ClaveDepartamento,
        NombreDepartamento: depto.NombreDepartamento,
        IdEstatusDepartamento: depto.IdEstatusDepartamento,
        IdGerencia: depto.IdGerencia

      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch departamento with ID ${id}:`, error);
    return null;
  }
}

// Función para crear un nuevo departamento
export async function createDepartamento(
  data: DepartamentoFormData
): Promise<DepartamentoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

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
    return {
      Resultado: -99,
      Mensaje: "Error interno al crear el departamento.",
    };
  }
}

// Función para actualizar un departamento
export async function updateDepartamento(
  id: number,
  data: DepartamentoFormData
): Promise<DepartamentoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

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
      Resultado: -99,
      Mensaje: "Error interno al actualizar el departamento.",
    };
  }
}

// Función para eliminar un departamento
export async function deleteDepartamento(id: number): Promise<DepartamentoSPResult> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdDepartamento", typeParam.Int, id);
    const result = await request.execute("PD_Gen_TDepartamento");
    return result.recordset[0] as DepartamentoSPResult;
  } catch (error) {
    console.error(`Failed to delete departamento with ID ${id}:`, error);
    return {
      Resultado: -99,
      Mensaje: "Error interno al eliminar el departamento.",
    };
  }
}
