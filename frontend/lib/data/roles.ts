"use server";

import { usegetPool } from "@/lib/database/connection";
//import { RolFormData, RolSPResult } from "@/lib/schemas/rol";
//import { revalidatePath } from "next/cache";

// Interfaz para la lista de roles (para dropdowns)

export type RolListItem = {
  IdRol: number;
  NombreRol: string;
};

// Obtener la lista de roles para los listados
export const getRolesList = async () => {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();

    const result = await request.query(`
        SELECT IdRol, NombreRol 
        FROM Gen_TRol 
        WHERE IdEstatusRol = 1 
        ORDER BY NombreRol ASC
      `);
    return result.recordset as RolListItem[];
  } catch (error) {
    console.error("Failed to fetch roles list:", error);
    return [];
  }
};
