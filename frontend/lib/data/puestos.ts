"use server";

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { PuestoFormData, PuestoSPResult } from "@/lib/schemas/puesto";


// Interfaz para la lista de puestos (para dropdowns)
export interface PuestoListItem {
  IdPuesto: number;
  NombrePuesto: string;
  NombreDepartamento: string;
  IdDepartamento: number;
  IdEstatusPuesto: boolean;
  Estatus: string;
}

// Función para obtener una lista simple de departamentos activos
export async function getPuestosList(): Promise<PuestoListItem[]> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const result = await request.query(`
      SELECT IdPuesto, NombrePuesto 
      FROM Gen_TPuesto 
      WHERE IdEstatusPuesto = 1 
      ORDER BY NombrePuesto ASC
    `);
    return result.recordset as PuestoListItem[];
  } catch (error) {
    console.error("Failed to fetch puestos list:", error);
    return [];
  }
}

// Obtener puestos con paginación y filtros (plantilla)
export async function getPuestos(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{ puestos: PuestoListItem[]; totalPages: number; totalRecords: number }> {

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

    const result = await request.execute("PF_Gen_TPuesto");

    const puestos = result.recordset as PuestoListItem[];

    const totalRecords = puestos.length > 0 ? (puestos[0] as any).TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { puestos, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch puestos:", error);
    return { puestos: [], totalPages: 0, totalRecords: 0 };
  }
  
}

// Obtener un puesto por ID (plantilla)
export async function getPuestoById(
  id: number
): Promise<PuestoListItem | null> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdPuesto", typeParam.Int, id);
    const result = await request.execute("PFK_Gen_TPuesto");
    const puesto = result.recordset[0] as PuestoListItem;
    return puesto;
  } catch (error) {
    console.error(`Failed to fetch puesto with ID ${id}:`, error);
    return null;
  }
}

// Crear un nuevo puesto
export async function createPuesto(
  data: PuestoFormData
): Promise<PuestoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_NombrePuesto", typeParam.NVarChar(100), data.NombrePuesto);
    request.input("p_IdDepartamento", typeParam.Int, data.IdDepartamento);
    request.input("p_IdEmpleadoAlta", typeParam.Int, userId);

    const result = await request.execute("PI_Gen_TPuesto");
    return result.recordset[0] as PuestoSPResult;
  } catch (error) {
    console.error("Failed to create puesto:", error);
    return { Resultado: 500, Mensaje: "Error interno al crear el puesto." };
  }
}

// Actualizar un puesto (plantilla)
export async function updatePuesto(
  id: number,
  data: PuestoFormData
): Promise<PuestoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdPuesto", typeParam.Int, id);
    request.input("p_NombrePuesto", typeParam.NVarChar(100), data.NombrePuesto);
    request.input("p_IdDepartamento", typeParam.Int, data.IdDepartamento);
    request.input("p_IdEstatusPuesto", typeParam.Bit, data.IdEstatusPuesto);
    request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);

    const result = await request.execute("PU_Gen_TPuesto");
    return result.recordset[0] as PuestoSPResult;
  } catch (error) {
    console.error(`Failed to update puesto with ID ${id}:`, error);
    return {
      Resultado: 500,
      Mensaje: "Error interno al actualizar el puesto.",
    };
  }
}

// Eliminar un puesto (plantilla)
export async function deletePuesto(id: number): Promise<PuestoSPResult> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdPuesto", typeParam.Int, id);
    const result = await request.execute("PD_Gen_TPuesto");
    return result.recordset[0] as PuestoSPResult;
  } catch (error) {
    console.error(`Failed to delete puesto with ID ${id}:`, error);
    return {
      Resultado: 500,
      Mensaje: "Error interno al eliminar el puesto.",
    };
  }
}
