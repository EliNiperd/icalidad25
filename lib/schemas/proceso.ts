import {z} from 'zod';

export interface Proceso {
    IdProceso: number;
    ClaveProceso: string;
    NombreProceso: string;
    IdEstatusProceso: boolean;
    IdEmpleadoResponsable: number;
}

export const procesoSchema = z.object({
    IdProceso: z.number().optional(),
    ClaveProceso: z.string()
        .min(1, 'La clave es requerida')
        .max(20, 'La clave no puede tener más de 20 caracteres'),
    NombreProceso: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
    IdEstatusProceso: z.boolean().default(true),
    IdEmpleadoResponsable: z.coerce.number({
        required_error: "Debes seleccionar un empleado responsable.",
        invalid_type_error: "ID de empleado responsable inválido.",
    })
    .min(1, { message: 'Debes seleccionar un empleado responsable.' }),
});

export type ProcesoFormData = z.infer<typeof procesoSchema>;