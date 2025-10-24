import { z } from 'zod';

// Interfaces para las respuestas de los SPs
export interface EmpleadoSPResult {
  Resultado: number;
  Mensaje: string;
  IdEmpleado?: number;
}

// Interface para mostrar en la tabla
export interface Empleado {
  IdEmpleado: number;
  NombreEmpleado: string;
  UserName: string;
  Password: string;
  Correo: string;
  IdEstatusEmpleado: boolean;
  Estatus: string;
  Puestos?: PuestoAsignado[]; // NUEVO: Array de puestos
  Roles?: RolAsignado[]; // NUEVO: Array de roles
}

// Interface para puestos asignados
export interface PuestoAsignado {
  IdPuesto: number;
  NombrePuesto: string;
  FechaAsignacion: Date;
}

// Interfaz para roles asignados a un empleado
export interface RolAsignado {
    IdRol: number;
    NombreRol: string;
}

// Interface para historial
export interface HistorialPuesto {
  IdHistorial: number;
  IdEmpleado: number;
  IdPuesto: number;
  NombrePuesto: string;
  TipoAccion: 'ASIGNADO' | 'REMOVIDO';
  FechaAccion: Date;
  UsuarioAccion: string;
  NombreUsuario: string;
}

// Schema para el formulario con múltiples puestos
export const empleadoSchema = z.object({
  NombreEmpleado: z
    .string()
    .min(1, "El nombre del empleado es requerido")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  UserName: z
    .string()
    .min(1, "El usuario es requerido")
    .max(20, "El usuario no puede exceder 20 caracteres"),
  Password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(20, "La contraseña no puede exceder 20 caracteres"),
  Correo: z
    .string()
    .email("Correo electrónico inválido")
    .max(100, "El correo no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  IdPuestos: z
    .array(z.number())
    .min(1, "Debes seleccionar al menos un puesto")
    .max(5, "No puedes asignar más de 5 puestos"),
  IdRoles: z
    .array(z.number())
    .min(1, "Debes seleccionar al menos un rol"),
  IdEstatusEmpleado: z.boolean().default(true),
  IdEmpleado: z.number().optional(),
});

export type EmpleadoFormData = z.infer<typeof empleadoSchema>;
