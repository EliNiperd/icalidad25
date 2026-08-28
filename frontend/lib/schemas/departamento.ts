import { z } from 'zod';

export interface Departamento {
    IdDepartamento: number;
    ClaveDepartamento: string;
    NombreDepartamento: string;
    IdGerencia: number;
    IdEstatusDepartamento: boolean;
}

export interface DepartamentoSPResult {
    Resultado: number;
    Mensaje: string;
}

export const departamentoSchema = z.object({
  IdDepartamento: z.number().optional(),
  ClaveDepartamento: z.string().min(1, 'La clave es requerida').max(10, 'La clave no puede tener más de 10 caracteres'),
  NombreDepartamento: z.string().min(1, 'El nombre es requerido'),
  // Coerce convierte el string del select a un número para la validación
  IdGerencia: z.coerce.number({
    required_error: "Debes seleccionar una gerencia.",
    invalid_type_error: "ID de gerencia inválido.",
  }).min(1, { message: 'Debes seleccionar una gerencia.' }),
  IdEstatusDepartamento: z.boolean().default(true),
});

export type DepartamentoFormData = z.infer<typeof departamentoSchema>;