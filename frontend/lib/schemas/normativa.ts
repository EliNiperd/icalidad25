import { z } from "zod";

export interface Normativa {
    IdNormativa: number;
    ClaveNormativa: string;
    NombreNormativa: string;
    IdEstatusNormativa: boolean;
}

export const normativaSchema = z.object({
    IdNormativa: z.number().optional(),
    ClaveNormativa: z.string().min(1, "La clave es requerida"),
    NombreNormativa: z.string().min(1, "El nombre es requerido"),
    IdEstatusNormativa: z.boolean().default(true),
});

export type NormativaFormData = z.infer<typeof normativaSchema>;