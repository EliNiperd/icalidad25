import { z } from 'zod';


export interface Puesto {
  IdPuesto: number;
  NombrePuesto: string;
  IdDepartamento: number;
  NombreDepartamento: string;
  IdEstatusPuesto: boolean;
}

export interface PuestoSPResult {
  Resultado: number;
  Mensaje: string;
}

// Esquema de validación para el formulario de Puesto
export const puestoSchema = z.object({
  IdPuesto: z.number().optional(),
  NombrePuesto: z.string().min(1, 'El nombre es requerido'),
  // Coerce convierte el string del select a un número para la validación
  IdDepartamento: z.coerce.number({
    required_error: "Debes seleccionar un departamento.",
  }).min(1, { message: 'Debes seleccionar un departamento.' }),
  IdEstatusPuesto: z.boolean().default(true),
});

export type PuestoFormData = z.infer<typeof puestoSchema>;