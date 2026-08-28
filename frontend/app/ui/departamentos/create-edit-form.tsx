"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DepartamentoFormData,
  departamentoSchema,
} from "@/lib/schemas/departamento";
import { GerenciaListItem } from "@/lib/data/gerencias";
import {
  createDepartamento,
  updateDepartamento,
} from "@/lib/data/departamentos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
//import { toast } from "sonner";
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

interface CreateEditFormProps {
  departamento?: DepartamentoFormData;
  gerencias: GerenciaListItem[];
}

export default function CreateEditForm({
  departamento,
  gerencias,
}: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!departamento?.IdDepartamento;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DepartamentoFormData>({
    resolver: zodResolver(departamentoSchema) as Resolver<DepartamentoFormData>,
    defaultValues: departamento || {
      ClaveDepartamento: "",
      NombreDepartamento: "",
      IdGerencia: undefined,
      IdEstatusDepartamento: true,
    },
  });

  // Observar el valor del checkbox para la UI
  const isEstatusChecked = useWatch({ control, name: "IdEstatusDepartamento" });

  const onSubmit = async (data: DepartamentoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);
    try {
      let result;
      if (departamento?.IdDepartamento) {
        result = await updateDepartamento(departamento.IdDepartamento, data);
      } else {
        result = await createDepartamento(data);
      }

      if (result.Resultado < 0) {
        setFormError(result.Mensaje);
      } else {
        if (!departamento?.IdDepartamento) {
          setShowSuccessMessage(true);
          reset({
            ClaveDepartamento: "",
            NombreDepartamento: "",
            IdGerencia: undefined,
            IdEstatusDepartamento: true,
          });
        } else {
          router.push("/icalidad/departamento");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error al guardar departamento:", error);
      setFormError("Error al guardar el departamento. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  };

  const handleGoToList = () => {
    router.push("/icalidad/departamento");
    router.refresh();
  };

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-text-primary">
          {isEditMode ? "Editar Departamento" : "Crear Departamento"}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-text-secondary mt-1">
            {isEditMode
              ? "Actualizar la información del departamento."
              : "Completa los datos para crear un departamento."}
          </p>
          {/* Mensaje de error */}
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
                    ¡Gerencia creada exitosamente!
                  </p>
                  <p className="text-sm text-success/90 mt-1">
                    La gerencia se ha registrado correctamente en el sistema.
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  onClick={handleCreateAnother}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Otra
                </Button>
                <Button
                  type="button"
                  onClick={handleGoToList}
                  variant="outline"
                  className="border-border-default"
                >
                  <List className="h-4 w-4 mr-2" />
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
          className="bg-bg-secondary border-2 border-border-default rounded-lg shadow-lg p-6 space-y-6 "
        >
          {/* Campo: Seleccionar Gerencia */}
          <div className="space-y-2">
            <Label htmlFor="IdGerencia">Gerencia *</Label>
            <select
              id="IdGerencia"
              {...register("IdGerencia")}
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              defaultValue={departamento?.IdGerencia}
            >
              <option value="" disabled>
                Selecciona una gerencia
              </option>
              {gerencias.map((gerencia) => (
                <option key={gerencia.IdGerencia} value={gerencia.IdGerencia}>
                  {gerencia.NombreGerencia}
                </option>
              ))}
            </select>
            {errors.IdGerencia && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.IdGerencia.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ClaveDepartamento">Clave del Departamento *</Label>
            <Input
              id="ClaveDepartamento"
              {...register("ClaveDepartamento")}
              placeholder="Ej. MKT"
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
            {errors.ClaveDepartamento && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.ClaveDepartamento.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="NombreDepartamento">
              Nombre del Departamento *
            </Label>
            <Input
              id="NombreDepartamento"
              {...register("NombreDepartamento")}
              placeholder="Ej. Marketing"
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
            {errors.NombreDepartamento && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.NombreDepartamento.message}
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="IdEstatusDepartamento"
                {...register("IdEstatusDepartamento")}
                checked={isEstatusChecked}
                onCheckedChange={(checked) => {
                  setValue("IdEstatusDepartamento", Boolean(checked));
                }}
              />
              <div className="flex-1">
                <Label
                  htmlFor="IdEstatusDepartamento"
                  className="text-text-primary font-semibold cursor-pointer"
                >
                  Activo
                </Label>
                <p className="text-xs text-text-secondary mt-0.5">
                  {isEstatusChecked
                    ? "El departamento está activo y visible en el sistema"
                    : "Departamento Inactivo y no visible en el sistema"}
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
                  {departamento?.IdDepartamento ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
