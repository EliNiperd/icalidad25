"use server";

import { apiFetch } from "@/lib/api-client";

export type RolListItem = {
  IdRol: number;
  NombreRol: string;
};

// Obtener la lista de roles para dropdowns desde la WebAPI de .NET
export const getRolesList = async (): Promise<RolListItem[]> => {
  try {
    const roles = await apiFetch<RolListItem[]>("/roles/list");
    return roles || [];
  } catch (error) {
    console.error("Failed to fetch roles list from API:", error);
    return [];
  }
};
