import { z } from 'zod';

export interface Requisito {
    IdRequisito: number;
    ClaveRequisito: string;
    NombreRequisito: string;
    IdEstatusRequisito: boolean;
    TextoRequisito: string;
}

// Esquema de validación para el formulario de Requisito
export const requisitoSchema = z.object({
  IdRequisito: z.number().optional(),
  ClaveRequisito: z.string().min(1, 'La clave es requerida'),
  NombreRequisito: z.string().min(1, 'El nombre es requerido'),
  IdNormativa: z.coerce.number({
    required_error: "Debes seleccionar una normativa.",
  }).min(1, { message: 'Debes seleccionar una normativa.' }),
  IdEstatusRequisito: z.boolean().default(true),
  TextoRequisito: z.string().optional(),
});

export type RequisitoFormData = z.infer<typeof requisitoSchema>;

