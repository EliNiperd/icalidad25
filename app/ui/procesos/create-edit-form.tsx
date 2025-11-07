"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProcesoFormData, procesoSchema } from "@/lib/schemas/proceso";
import { EmpleadoListItem } from "@/lib/data/empleados";
import { createProceso, updateProceso } from "@/lib/data/procesos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { AlertCircle, CheckCircle2, List, Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";

interface CreateEditFormProps {
  proceso?: ProcesoFormData;
  empleados: EmpleadoListItem[];
}

export default function CreateEditForm({
  proceso,
  empleados,
}: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!proceso?.IdProceso;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProcesoFormData>({
    resolver: zodResolver(procesoSchema) as Resolver<ProcesoFormData>,
    defaultValues: proceso || {
      ClaveProceso: "",
      NombreProceso: "",
      IdProceso: undefined,
      IdEstatusProceso: true,
    },
  });

  // Observar el valor del checkbox para la UI
  const isEstatusChecked = useWatch({ control, name: "IdEstatusProceso" });

  const onSubmit = async (data: ProcesoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);
    try {
      let result;
      if (proceso?.IdProceso) {
        result = await updateProceso(proceso.IdProceso, data);
      } else {
        result = await createProceso(data);
      }
      if (result.Resultado !== 200 && result.Resultado !== 201) {
        setFormError(result.Mensaje);
        return;
      } else {
        if (!proceso?.IdProceso) {
          setShowSuccessMessage(true);
          reset({
            ClaveProceso: "",
            NombreProceso: "",
            IdEstatusProceso: true,
          });
        } else {
          router.push("/icalidad/proceso");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      setFormError("Error al guardar el proceso. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  };

  const handleGoToList = () => {
    router.push("/icalidad/proceso");
    router.refresh();
  };

  const selectStyle = `w-full p-2 border rounded-md bg-primary border-default 
    text-text-primary placeholder:text-text-secondary focus:outline-none 
    focus:border-primary-600 focus:ring-1 focus:ring-primary-600`;
  const inputStyle = `w-full p-2 border rounded-md bg-primary border-border-default 
    text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-600 
    focus:ring-1 focus:ring-primary-600 `;
  const errorInputStyle =
    "border-danger-300 focus:ring-danger-500 dark:border-danger-600 placeholder:text-danger-200 ";
  const errorTextStyle = `text-danger-200 text-sm flex items-center gap-1`;
  const errorIconStyle = "h-4 w-4 text-danger-200 flex-shrink-0";
  const formStyle = `bg-secondary border-2 border-border-default rounded-lg shadow-lg p-6 space-y-6 `;

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary-600">
          {isEditMode ? "Editar Proceso" : "Crear Proceso"}
        </CardTitle>
        <CardDescription>
          <p className="text-primary-600">
            {isEditMode
              ? "Modifica los detalles del proceso."
              : "Crea un nuevo proceso."}
          </p>
          {/* Mensaje de error*/}
          {formError && (
            <div className="mb-6 bg-error/10 border-2 border-error rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-error flex-shrink-0 mt-0.5 " />
              <div>
                <p className="font-semibold text-error">Error al guardar</p>
                <p className="text-sm text-error/90 mt-1">{formError}</p>
              </div>
            </div>
          )}
          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div className="mb-6 bg-success/10 border-2 border-success rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-success">
                    ¡Proceso guardado exitosamente!
                  </p>
                  <p className="text-sm text-success/90 mt-1">
                    El proceso se ha guardado correctamente.
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreateAnother}
                >
                  <Plus className="w-4 h-4" />
                  Crear otro
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoToList}
                >
                  <List className="w-4 h-4" />
                  Ir al Listado
                </Button>
              </div>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className={formStyle}
        >
            
              <div>
                <Label htmlFor="ClaveProceso">Clave Proceso</Label>
                <Input
                  id="ClaveProceso"
                  {...register("ClaveProceso")}
                  placeholder="Eje. PR-01"
                  className={cn(
                    inputStyle,
                    errors.ClaveProceso && errorInputStyle
                  )}
                />
                {errors.ClaveProceso && (
                  <p className={errorTextStyle}>
                    <AlertCircle className={errorIconStyle} />
                    {errors.ClaveProceso.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="NombreProceso">Nombre Proceso</Label>
                <Input
                  id="NombreProceso"
                  {...register("NombreProceso")}
                  placeholder="Eje. Planificación"
                  className={cn(
                    inputStyle,
                    errors.NombreProceso && errorInputStyle
                  )}
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
                  Empleado Responsable *
                </Label>
                <select
                  id="IdEmpleadoResponsable"
                  {...register("IdEmpleadoResponsable")}
                  className={selectStyle}
                  defaultValue={proceso?.IdEmpleadoResponsable}
                >
                  <option value="">Selecciona un empleado responsable</option>
                  {empleados.map((empleado) => (
                    <option
                      key={empleado.IdEmpleado}
                      value={empleado.IdEmpleado}
                    >
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
                    defaultChecked={isEstatusChecked}
                    onCheckedChange={(checked) => {
                      setValue("IdEstatusProceso", Boolean(checked));
                    }}
                  />
                  <Label htmlFor="IdEstatusProceso">Activo</Label>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {isEstatusChecked
                      ? "El proceso está activo y puede ser utilizado."
                      : "El proceso está inactivo y no puede ser utilizado."}
                  </p>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      isEstatusChecked
                        ? "bg-success-100 text-success-700"
                        : "bg-error-100 text-error-700"
                    }`}
                  >
                    {isEstatusChecked ? "Activo" : "Inactivo"}
                  </span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-border-default hover:bg-bg-primary "
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="primary">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {proceso?.IdProceso ? "Actualizar" : "Crear"}
                    </>
                  )}
                </Button>
              </div>
        </form>
      </CardContent>
    </Card>
  );
}
