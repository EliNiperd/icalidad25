import { usegetPool, typeParameter } from "@/lib/database/connection";

export interface RawMenuItem {
  id: number;
  nombre: string;
  icono: string;
  ruta: string;
  idPadre: number;
  orden: number;
}

export async function getRawMenuItems(idEmpleado: number, idRol: number, parentMenuId: number | null = null): Promise<RawMenuItem[]> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_IdEmpleado", typeParam.Int, idEmpleado);
    request.input("p_IdRolPrincipal", typeParam.Int, idRol); // Asumiendo que el SP toma el rol principal
    request.input("p_ParentMenuId", typeParam.Int, parentMenuId); // Asumiendo que el SP toma el parent ID

    const result = await request.execute("usp_GetMenuByEmployeeIdAndRole"); // Asumiendo este nombre de SP

    return result.recordset as RawMenuItem[];
  } catch (error) {
    console.error("Failed to fetch raw menu items:", error);
    return [];
  }
}
