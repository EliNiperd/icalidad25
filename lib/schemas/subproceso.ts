import { z } from 'zod';

export interface Subproceso {
    IdSubproceso: number;
    ClaveSubproceso: string;
    NombreSubproceso: string;
    IdProceso?: number;
}

export const subprocesoSchema = z.object({
    IdSubproceso: z.number().optional(),
    ClaveSubproceso: z.string().min(1, 'La clave es requerida'),
    DescripcionSubproceso: z.string().min(1, 'El nombre es requerido'),
});

export type SubprocesoFormData = z.infer<typeof subprocesoSchema>;