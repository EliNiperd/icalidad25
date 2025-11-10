"use client";

import { useFormContext } from "react-hook-form";
import { ProcesoFormData } from "@/lib/schemas/proceso";
import { EmpleadoListItem } from "@/lib/data/empleados";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface DatosGeneralesFormProps {
  empleados: EmpleadoListItem[];
  isEditMode: boolean;
}

// Estilos compartidos (pueden moverse a un archivo de constantes si se usan en más lugares)
const inputStyle = `w-full p-2 border rounded-md bg-primary border-border-default 
  text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-600 
  focus:ring-1 focus:ring-primary-600 `;
const selectStyle = `w-full p-2 border rounded-md bg-primary border-default 
  text-text-primary placeholder:text-text-secondary focus:outline-none 
  focus:border-primary-600 focus:ring-1 focus:ring-primary-600`;
const errorInputStyle = "border-danger-300 focus:ring-danger-500 dark:border-danger-600 placeholder:text-danger-200 ";
const errorTextStyle = `text-danger-200 text-sm flex items-center gap-1`;
const errorIconStyle = "h-4 w-4 text-danger-200 flex-shrink-0";


export default function DatosGeneralesForm({ empleados, isEditMode }: DatosGeneralesFormProps) {
  const { register, formState: { errors }, watch, setValue } = useFormContext<ProcesoFormData>();
  
  const isEstatusChecked = watch("IdEstatusProceso");

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="ClaveProceso">
          Clave Proceso
          <span className="text-error ml-1">*</span>
        </Label>
        <Input
          id="ClaveProceso"
          {...register("ClaveProceso")}
          placeholder="Eje. PR-01"
          className={cn(inputStyle, errors.ClaveProceso && errorInputStyle)}
        />
        {errors.ClaveProceso && (
          <p className={errorTextStyle}>
            <AlertCircle className={errorIconStyle} />
            {errors.ClaveProceso.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="NombreProceso">
          Nombre Proceso
          <span className="text-error ml-1">*</span>
        </Label>
        <Input
          id="NombreProceso"
          {...register("NombreProceso")}
          placeholder="Eje. Planificación"
          className={cn(inputStyle, errors.NombreProceso && errorInputStyle)}
        />
        {errors.NombreProceso && (
          <p className={errorTextStyle}>
            <AlertCircle className={errorIconStyle} />
            {errors.NombreProceso.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="IdEmpleadoResponsable">
          Empleado Responsable
          <span className="text-error ml-1">*</span>
        </Label>
        <select
          id="IdEmpleadoResponsable"
          {...register("IdEmpleadoResponsable")}
          className={cn(selectStyle, errors.IdEmpleadoResponsable && errorInputStyle)}
        >
          <option value="">Selecciona un empleado responsable</option>
          {empleados.map((empleado) => (
            <option key={empleado.IdEmpleado} value={empleado.IdEmpleado}>
              {empleado.NombreEmpleado}
            </option>
          ))}
        </select>
        {errors.IdEmpleadoResponsable && (
          <p className={errorTextStyle}>
            <AlertCircle className={errorIconStyle} />
            {errors.IdEmpleadoResponsable.message}
          </p>
        )}
      </div>

      {isEditMode && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="IdEstatusProceso"
            {...register("IdEstatusProceso")}
            checked={isEstatusChecked}
            onCheckedChange={(checked) => setValue("IdEstatusProceso", Boolean(checked))}
          />
          <Label htmlFor="IdEstatusProceso">Activo</Label>
        </div>
      )}
    </div>
  );
}
