import { z } from 'zod';

export interface Gerencia {
  IdGerencia: number;
  ClaveGerencia: string;
  NombreGerencia: string;
  IdEstatusGerencia: boolean; // bit en SQL se mapea a boolean
  Estatus: string; // 'Activo' o 'Inactivo'
  //BorrarGerencia: string; // 'NoBorrar' o '' (para indicar si se puede borrar)
}

export interface GerenciaSPResult {
  Resultado: number;
  Mensaje: string;
}

export const GerenciaFormSchema = z.object({
  IdGerencia: z.number().optional(), // Opcional para creación, requerido para edición
  ClaveGerencia: z.string()
    .min(1, { message: "La clave de gerencia es requerida." })
    .max(40, { message: "La clave de gerencia no debe exceder los 40 caracteres." })
    .length(3, { message: "La clave de gerencia debe ser de 3 caracteres." }), // Según tu especificación de 3 posiciones
  NombreGerencia: z.string()
    .min(1, { message: "El nombre de gerencia es requerido." })
    .max(100, { message: "El nombre de gerencia no debe exceder los 100 caracteres." }),
  IdEstatusGerencia: z.boolean().default(true), // Por defecto, activo
});

export type GerenciaFormData = z.infer<typeof GerenciaFormSchema>;
