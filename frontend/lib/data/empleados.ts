"use server";

import { auth } from "@/auth";
import { usegetPool, typeParameter } from "@/lib/database/connection";
import { EmpleadoFormData, EmpleadoSPResult, Empleado } from "@/lib/schemas/empleado";
import { RolAsignado } from "@/lib/schemas/empleado";
import { revalidatePath } from "next/cache";

// Interfaz para la lista de empleados (para dropdowns)
export interface EmpleadoListItem {
    IdEmpleado: number;
    NombreEmpleado: string;
    IdPuesto: number;
    UserName: string;
    Password: string;
    Correo: string;
    IdEstatusEmpleado: boolean;
    Estatus: string;
}

// Interfaz para puestos asignados a un empleado
export interface PuestoAsignado {
    IdPuesto: number;
    NombrePuesto: string;
    FechaAsignacion: Date;
}



export interface HistorialPuesto {
    IdHistorial: number;
    IdEmpleado: number;
    IdPuesto: number;
    NombrePuesto: string;
    TipoAccion: 'ASIGNADO' | 'REMOVIDO';
    FechaAccion: Date;
    UsuarioAccion: string;
    NombreUsuario: string;
}

// Función para obtener una lista simple de empleados activos
export async function getEmpleadosList(): Promise<EmpleadoListItem[]> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const result = await request.query(`
      SELECT IdEmpleado, NombreEmpleado 
      FROM Gen_TEmpleado 
      WHERE IdEstatusEmpleado = 1 
      ORDER BY NombreEmpleado ASC
    `);
    return result.recordset as EmpleadoListItem[];
  } catch (error) {
    console.error("Failed to fetch empleados list:", error);
    return [];
  } 
}

// Obtener empleados con paginación, filtros y ordenamiento
export async function getEmpleados(
  query: string,
  currentPage: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{ empleados: Empleado[]; totalPages: number; totalRecords: number }> {
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

    const result = await request.execute("PF_Gen_TEmpleado");
    const empleados = result.recordset as Empleado[];

    // Obtener puestos para cada empleado
    for (const empleado of empleados) {
      empleado.Puestos = await getPuestosByEmpleado(empleado.IdEmpleado);
    }

    
    const totalRecords = empleados.length > 0 ? (empleados[0] as any).TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { empleados, totalPages, totalRecords };
  } catch (error) {
    console.error("Failed to fetch empleados:", error);
    return { empleados: [], totalPages: 0, totalRecords: 0 };
  }
}


// Función para obtener un empleado por su ID
export async function getEmpleadoById(idEmpleado: number): Promise<EmpleadoFormData | null> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdEmpleado", typeParam.Int, idEmpleado);
    const result = await request.execute("PFK_Gen_TEmpleado");
    
    const empleado = result.recordset[0];
    if (!empleado) return null;

    // Obtener los puestos asignados
    const puestos = await getPuestosByEmpleado(idEmpleado);

    // Obtener los roles asignados
    const roles = await getRolesByEmpleado(idEmpleado);
    
    return {
      IdEmpleado: empleado.IdEmpleado,
      NombreEmpleado: empleado.NombreEmpleado,
      UserName: empleado.UserName,
      Password: empleado.Password,
      Correo: empleado.Correo,
      IdPuestos: puestos.map(p => p.IdPuesto),
      IdRoles: roles.map(r => r.IdRol),
      IdEstatusEmpleado: empleado.IdEstatusEmpleado,
    };
  } catch (error) {
    console.error(`Failed to fetch empleado with ID ${idEmpleado}:`, error);
    return null;
  }
}

// Función para crear un nuevo empleado
export async function createEmpleado(data: EmpleadoFormData): Promise<EmpleadoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const typeParam = await typeParameter();

    // 1. Crear empleado
    const request = await pool.request();
    request.input("p_NombreEmpleado", typeParam.NVarChar(200), data.NombreEmpleado);
    request.input("p_UserName", typeParam.NVarChar(20), data.UserName);
    request.input("p_Password", typeParam.NVarChar(20), data.Password);
    request.input("p_Correo", typeParam.NVarChar(100), data.Correo || null);
    request.input("p_IdEmpleadoAlta", typeParam.Int, userId);

    const result = await request.execute("PI_Gen_TEmpleado");
    const empleadoResult = result.recordset[0] as EmpleadoSPResult;

    console.log( "resultado", empleadoResult.Resultado);

    if (!empleadoResult.Resultado && empleadoResult.Resultado !== 0) {
      return { Resultado: 500, Mensaje: "Error interno al crear el empleado." };
    }

    const idEmpleado = empleadoResult.Resultado;
    
    // 2. Asignar puestos
    await asignarPuestos(idEmpleado, data.IdPuestos, userId);

    // 3. Asignar roles
    await asignarRoles(idEmpleado, data.IdRoles);

    return { 
      ...empleadoResult, 
      Mensaje: "Empleado creado exitosamente con sus puestos asignados" 
    };
  } catch (error) {
    console.error("Failed to create empleado:", error);
    return { Resultado: 500, Mensaje: "Error interno al crear el empleado." };
  }
}

// Función para actualizar un empleado
// ========== ACTUALIZAR EMPLEADO CON MÚLTIPLES PUESTOS ==========

export async function updateEmpleado(id: number, data: EmpleadoFormData): Promise<EmpleadoSPResult> {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (userId === 0)
    return { Resultado: -1, Mensaje: "Error de autenticación." };

  try {
    const pool = await usegetPool("Default");
    const typeParam = await typeParameter();

    // 1. Actualizar datos del empleado
    const request = await pool.request();
    request.input("p_IdEmpleado", typeParam.Int, id);
    request.input("p_NombreEmpleado", typeParam.NVarChar(200), data.NombreEmpleado);
    request.input("p_UserName", typeParam.NVarChar(20), data.UserName);
    request.input("p_Password", typeParam.NVarChar(20), data.Password);
    request.input("p_Correo", typeParam.NVarChar(100), data.Correo || null);
    request.input("p_IdEstatusEmpleado", typeParam.Bit, data.IdEstatusEmpleado);
    request.input("p_IdEmpleadoActualiza", typeParam.Int, userId);
    request.input("p_ReasignarEvaluacion", typeParam.Bit, false);

    const result = await request.execute("PU_Gen_TEmpleado");
    const empleadoResult = result.recordset[0] as EmpleadoSPResult;

    if (empleadoResult.Resultado < 0) {
      return empleadoResult;
    }

    // 2. Actualizar puestos (comparar con los actuales)
    const puestosActuales = await getPuestosByEmpleado(id);
    const idsActuales = puestosActuales.map(p => p.IdPuesto);
    // valores de puestos nuevos, recibidos desde el front
    const idsNuevos = data.IdPuestos;
    // Puestos a agregar
    const puestosAgregar = idsNuevos.filter(id => !idsActuales.includes(id));
    // Puestos a remover
    const puestosRemover = idsActuales.filter(id => !idsNuevos.includes(id));
    if (puestosAgregar.length > 0) {
      await asignarPuestos(id, puestosAgregar, userId);
    }
    if (puestosRemover.length > 0) {
      await removerPuestos(id, puestosRemover, userId);
    }

    // 3. Actualizar roles (comparar con los actuales)
    const rolesActuales = await getRolesByEmpleado(id);
    const idsRolesActuales = rolesActuales.map(r => r.IdRol);
    // valores de roles nuevos, recibidos desde el front
    const idsRolesNuevos = data.IdRoles;
    // Roles a agregar
    const rolesAgregar = idsRolesNuevos.filter(id => !idsRolesActuales.includes(id));
    // Roles a remover
    const rolesRemover = idsRolesActuales.filter(id => !idsRolesNuevos.includes(id));
    if (rolesAgregar.length > 0) {
      await asignarRoles(id, rolesAgregar);
    }
    if (rolesRemover.length > 0) {
      await removerRoles(id, rolesRemover);
    }

    return { 
      ...empleadoResult, 
      Resultado: 200,
      Mensaje: "Empleado actualizado exitosamente" 
    };
  } catch (error) {
    console.error(`Failed to update empleado with ID ${id}:`, error);
    return { Resultado: 500, Mensaje: "Error interno al actualizar el empleado." };
  }
}


// Función para eliminar un empleado
export async function deleteEmpleado(id: number): Promise<EmpleadoSPResult> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdEmpleado", typeParam.Int, id);
    const result = await request.execute("PD_Gen_TEmpleado");
    return result.recordset[0] as EmpleadoSPResult;
  } catch (error) {
    console.error(`Failed to delete empleado with ID ${id}:`, error);
    return { Resultado: 500, Mensaje: "Error interno al eliminar el empleado." };
  }
}

// ========== NUEVAS FUNCIONES PARA PUESTOS ==========

// Obtener puestos asignados a un empleado
export async function getPuestosByEmpleado(idEmpleado: number): Promise<PuestoAsignado[]> {
  try {
    const pool = await usegetPool("Default");
    const result = await pool.request().query(`
      SELECT 
        p.IdPuesto,
        p.NombrePuesto,
        ISNULL(h.FechaAsignacion, GETDATE()) as FechaAsignacion
      FROM Gen_REmpleadoPuesto ep
      INNER JOIN Gen_TPuesto p ON ep.IdPuesto = p.IdPuesto
      LEFT JOIN (
        SELECT IdEmpleado, IdPuesto, MAX(FechaAccion) as FechaAsignacion
        FROM Gen_TEmpleadoPuestoHistorial
        WHERE TipoAccion = 'ASIGNADO'
        GROUP BY IdEmpleado, IdPuesto
      ) h ON ep.IdEmpleado = h.IdEmpleado AND ep.IdPuesto = h.IdPuesto
      WHERE ep.IdEmpleado = ${idEmpleado}
      ORDER BY p.NombrePuesto
    `);
    return result.recordset as PuestoAsignado[];
  } catch (error) {
    console.error("Failed to fetch puestos:", error);
    return [];
  }
}

// Obtener historial de cambios de puestos
export async function getHistorialPuestos(idEmpleado: number): Promise<HistorialPuesto[]> {
  try {
    const pool = await usegetPool("Default");
    const result = await pool.request().query(`
      SELECT 
        h.IdHistorial,
        h.IdEmpleado,
        h.IdPuesto,
        p.NombrePuesto,
        h.TipoAccion,
        h.FechaAccion,
        h.UsuarioAccion,
        e.NombreEmpleado as NombreUsuario
      FROM Gen_TEmpleadoPuestoHistorial h
      INNER JOIN Gen_TPuesto p ON h.IdPuesto = p.IdPuesto
      LEFT JOIN Gen_TEmpleado e ON h.UsuarioAccion = CAST(e.IdEmpleado AS NVARCHAR)
      WHERE h.IdEmpleado = ${idEmpleado}
      ORDER BY h.FechaAccion DESC
    `);
    return result.recordset as HistorialPuesto[];
  } catch (error) {
    console.error("Failed to fetch historial:", error);
    return [];
  }
}

// ========== FUNCIONES AUXILIARES para PUESTOS ==========

async function asignarPuestos(idEmpleado: number, idPuestos: number[], userId: number) {
  const pool = await usegetPool("Default");
  
  for (const idPuesto of idPuestos) {
    //console.log(`Asignando puesto ${idPuesto} al empleado ${idEmpleado}`);
    // Insertar en relación
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM Gen_REmpleadoPuesto WHERE IdEmpleado = ${idEmpleado} AND IdPuesto = ${idPuesto})
      INSERT INTO Gen_REmpleadoPuesto (IdEmpleado, IdPuesto) VALUES (${idEmpleado}, ${idPuesto})
    `);

    //Insertar en historial
    await pool.request().query(`
      INSERT INTO Gen_TEmpleadoPuestoHistorial (IdEmpleado, IdPuesto, TipoAccion, UsuarioAccion)
      VALUES (${idEmpleado}, ${idPuesto}, 'ASIGNADO', '${userId}')
    `);
  }
}

async function removerPuestos(idEmpleado: number, idPuestos: number[], userId: number) {
  const pool = await usegetPool("Default");
  
  for (const idPuesto of idPuestos) {
    // Eliminar de relación
    await pool.request().query(`
      DELETE FROM Gen_REmpleadoPuesto WHERE IdEmpleado = ${idEmpleado} AND IdPuesto = ${idPuesto}
    `);

    // Insertar en historial
    await pool.request().query(`
      INSERT INTO Gen_TEmpleadoPuestoHistorial (IdEmpleado, IdPuesto, TipoAccion, UsuarioAccion)
      VALUES (${idEmpleado}, ${idPuesto}, 'REMOVIDO', '${userId}')
    `);
  }
}


// ========== NUEVAS FUNCIONES PARA Roles ==========

// Obtener roles asignados a un empleado
// Devuelve un array de objetos RolAsignado
export async function getRolesByEmpleado(idEmpleado: number): Promise<RolAsignado[]> {
  try {
    const pool = await usegetPool("Default");
    const typeParam = await typeParameter();

    // 1. recupera los roles asignados al empleado
    const request = await pool.request();
    request.input("p_IdEmpleado", typeParam.Int, idEmpleado);

    const result = await request.execute("PF_Gen_REmpleadoRol");
    const empleadoResult = result.recordset[0] as EmpleadoSPResult;

    if (!empleadoResult ) {
      console.error("Failed to fetch roles:");
      return [];
    }
    else {
      return result.recordset as RolAsignado[];
    }
    
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return [];
  }
}

// Funciones Auziliares de roles
async function asignarRoles(idEmpleado: number, idRoles: number[]) {
  const pool = await usegetPool("Default");
  
  for (const idRol of idRoles) {
    //console.log(`Asignando rol ${idRol} al empleado ${idEmpleado}`);
    // Insertar en relación
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM Gen_REmpleadoRol WHERE IdEmpleado = ${idEmpleado} AND IdRol = ${idRol})
      INSERT INTO Gen_REmpleadoRol (IdEmpleado, IdRol) VALUES (${idEmpleado}, ${idRol})
    `);
    
  }
}

async function removerRoles(idEmpleado: number, idRoles: number[]) {
  const pool = await usegetPool("Default");
  
  for (const idRol of idRoles) {
    // Eliminar de relación
    await pool.request().query(`
      DELETE FROM Gen_REmpleadoRol WHERE IdEmpleado = ${idEmpleado} AND IdRol = ${idRol}
    `);
    
  }
}