"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmpleadoFormData, empleadoSchema } from "@/lib/schemas/empleado";
import { PuestoListItem } from "@/lib/data/puestos";
import { createEmpleado, updateEmpleado } from "@/lib/data/empleados";
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
import { AlertCircle, CheckCircle2, Save, X, Plus, List } from "lucide-react";

interface CreateEditFormProps {
  empleado?: EmpleadoFormData;
  puestos: PuestoListItem[];
}

export default function CreateEditForm({
  empleado,
  puestos,
}: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!empleado;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema) as Resolver<EmpleadoFormData>,
    defaultValues: empleado || {
      NombreEmpleado: "",
      UserName: "",
      Password: "",
      Correo: "",
      IdPuesto: undefined,
      IdEstatusEmpleado: true,
    },
  });

  const isEstatusChecked = useWatch({ control, name: "IdEstatusEmpleado" });

  const onSubmit = async (data: EmpleadoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);

    try {
      let result;
      if (empleado?.IdEmpleado) {
        result = await updateEmpleado(empleado.IdEmpleado, data);
      } else {
        result = await createEmpleado(data);
      }

      if (result.Resultado < 0) {
        setFormError(result.Mensaje);
      } else {
        if (!empleado?.IdEmpleado) {
          setShowSuccessMessage(true);
          reset({
            NombreEmpleado: "",
            UserName: "",
            Password: "",
            Correo: "",
            IdPuesto: undefined,
            IdEstatusEmpleado: true,
          });
        } else {
          router.push("/icalidad/empleado");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      setFormError("Error al guardar el empleado. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    reset();
    router.push("/icalidad/empleado");
  };

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  };

  const handleGoToList = () => {
    router.push("/icalidad/empleado");
    router.refresh();
  };

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader className="text-2xl font-bold text-text-primary">
        <CardTitle className="text-2xl font-bold text-text-primary">
          {isEditMode ? "Editar Empleado" : "Crear Empleado"}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-text-secondary mt-1">
            {isEditMode
              ? "Actualiza los detalles del empleado."
              : "Crea un nuevo empleado."}
          </p>
        </CardDescription>
        {/* Mensaje de error */}
        {formError && (
          <div className="flex items-center space-x-2 mt-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">Error: </span>
            <span className="text-sm text-destructive">{formError}</span>
          </div>
        )}
        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div className="mb-6 bg-success/10 border-2 border-success rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="font-semibold text-success">
                Empleado guardado exitosamente!
              </span>
              <p className="text-sm text-success/90 mt-1">
                {isEditMode
                  ? "Los cambios se han guardado correctamente."
                  : "El empleado ha sido creado exitosamente."}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                onClick={handleCreateAnother}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear otro
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-border-default"
                onClick={handleGoToList}
              >
                <List className="w-4 h-4 mr-2" />
                Ver todos los empleados
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-bg-secondary border-2 border-border-default rounded-lg shadow-md p-4 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="IdPuesto">Puesto *</Label>
            <select
              id="IdPuesto"
              {...register("IdPuesto")}
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              defaultValue={empleado?.IdPuesto}
            >
              <option value="" disabled>
                Selecciona un puesto
              </option>
              {puestos.map((puesto) => (
                <option key={puesto.IdPuesto} value={puesto.IdPuesto}>
                  {puesto.NombrePuesto}
                </option>
              ))}
            </select>
            {errors.IdPuesto && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.IdPuesto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="NombreEmpleado">Nombre del Empleado *</Label>
            <Input
              id="NombreEmpleado"
              {...register("NombreEmpleado")}
              placeholder="Ej. Juan Pérez"
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
            {errors.NombreEmpleado && (
              <p className="text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.NombreEmpleado.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="UserName">Usuario *</Label>
            <Input
              id="UserName"
              {...register("UserName")}
              placeholder="ePerez"
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
            {errors.UserName && (
              <p className="text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.UserName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Password">Contraseña *</Label>
            <Input
              id="Password"
              {...register("Password")}
              type="password"
              placeholder="********"
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
            {errors.Password && (
              <p className="text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.Password.message}
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="IdEstatusEmpleado"
                {...register("IdEstatusEmpleado")}
                checked={isEstatusChecked}
                onCheckedChange={(checked) => {
                  setValue("IdEstatusEmpleado", Boolean(checked));
                }}
              />
              <div className="flex-1">
                <Label
                  htmlFor="IdEstatusEmpleado"
                  className="text-text-primary font-semibold cursor-pointer"
                >
                  Activo
                </Label>
                <p className="text-xs text-text-secondary mt-0.5">
                  {isEstatusChecked
                    ? "El empleado se encuentra activo"
                    : "El empleado se encuentra inactivo"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isEstatusChecked
                    ? "bg-success/20 text-success border border-success/30"
                    : "bg-error/20 text-error border border-error/30"
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
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {empleado?.IdEmpleado ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
