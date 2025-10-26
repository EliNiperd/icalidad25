"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequisitoFormData, requisitoSchema } from "@/lib/schemas/requisito";
import { NormativaListItem } from "@/lib/data/normativas";
import { createRequisito, updateRequisito } from "@/lib/data/requisitos";
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
import { cn } from "@/lib/utils";

interface CreateEditFormProps {
  requisito?: RequisitoFormData;
  normativas: NormativaListItem[];
}

export default function CreateEditForm({
  requisito,
  normativas,
}: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!requisito?.IdRequisito;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequisitoFormData>({
    resolver: zodResolver(requisitoSchema) as Resolver<RequisitoFormData>,
    defaultValues: requisito || {
      ClaveRequisito: "",
      NombreRequisito: "",
      IdRequisito: undefined,
      IdEstatusRequisito: true,
      TextoRequisito: "",
    },
  });

  // Observar el valor del checkbox para la UI
  const isEstatusChecked = useWatch({ control, name: "IdEstatusRequisito" });

  const onSubmit = async (data: RequisitoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);

    try {
      let result;
      if (requisito?.IdRequisito) {
        result = await updateRequisito(requisito.IdRequisito, data);
      } else {
        result = await createRequisito(data);
      }

      if (result.Resultado < 0) {
        setFormError(result.Mensaje);
      } else {
        if (!requisito?.IdRequisito) {
          setShowSuccessMessage(true);
          reset({
            ClaveRequisito: "",
            NombreRequisito: "",
            IdNormativa: undefined,
            IdEstatusRequisito: true,
          });
        } else {
          router.push("/icalidad/requisito");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error al guardar requisito:", error);
      setFormError("Error al guardar el requisito. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  };

  const handleGoToList = () => {
    router.push("/icalidad/requisito");
    router.refresh();
  };

  const selectStyle =`w-full p-2 border rounded-md bg-primary border-default 
    text-text-primary placeholder:text-text-secondary focus:outline-none 
    focus:border-primary-600 focus:ring-1 focus:ring-primary-600`;
  const inputStyle = `w-full p-2 border rounded-md bg-primary border-border-default 
    text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-600 
    focus:ring-1 focus:ring-primary-600 `;
  const errorInputStyle = 'border-danger-300 focus:ring-danger-500 dark:border-danger-600 placeholder:text-danger-200 '
  const errorTextStyle = `text-danger-200 text-sm flex items-center gap-1`;
  const errorIconStyle = 'h-4 w-4 text-danger-200 flex-shrink-0'
  const formStyle = `bg-secondary border-2 border-border-default rounded-lg shadow-lg p-6 space-y-6 `;

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-text-primary">
          {isEditMode ? "Editar Requisito" : "Crear Requisito"}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-text-secondary mt-1">
            {isEditMode
              ? "Actualizar la información del requisito."
              : "Completa los datos para crear un requisito."}
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
                    ¡Requisito creado exitosamente!
                  </p>
                  <p className="text-sm text-success/90 mt-1">
                    El requisito se ha registrado correctamente.
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  onClick={handleCreateAnother}
                  variant="primary"
                >
                  <Plus className="h-4 w-4" />
                  Crear Otro
                </Button>
                <Button
                  type="button"
                  onClick={handleGoToList}
                  variant="outline"
                  className="border-border-default"
                >
                  <List className="h-4 w-4" />
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
          {/* Campo: Seleccionar Normativa */}
          <div className="space-y-2">
            <Label htmlFor="IdNormativa">Normativa *</Label>
            <select
              id="IdNormativa"
              {...register("IdNormativa")}
              className={selectStyle}
              defaultValue={requisito?.IdNormativa}
            >
              <option value="" disabled>
                Selecciona una normativa
              </option>
              {normativas.map((normativa) => (
                <option
                  key={normativa.IdNormativa}
                  value={normativa.IdNormativa}
                >
                  {normativa.NombreNormativa}
                </option>
              ))}
            </select>
            {errors.IdNormativa && (
              <p className={errorTextStyle}>
                {errors.IdNormativa.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ClaveRequisito">Clave del Requisito *</Label>
            <Input id="ClaveRequisito" 
              {...register("ClaveRequisito")} 
              placeholder="Eje. 4.5"
              className={
                cn( inputStyle, errors.ClaveRequisito && errorInputStyle)
              }
            />
            {errors.ClaveRequisito && (
              <p className={errorTextStyle}>
                <AlertCircle className={errorIconStyle} />
                {errors.ClaveRequisito.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="NombreRequisito">Nombre del Requisito *</Label>
            <Input id="NombreRequisito" 
              {...register("NombreRequisito")} 
              placeholder="Ej. Documentación..."
              className={
                cn( inputStyle, errors.ClaveRequisito && errorInputStyle)
              }
            />
            {errors.NombreRequisito && (
              <p className={errorTextStyle}>
                <AlertCircle className={errorIconStyle} />
                {errors.NombreRequisito.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="TextoRequisito">Texto *</Label>
            <Input id="TextoRequisito" 
              type="text"
              
              {...register("TextoRequisito")} 
              placeholder="Ej. Texto..."
              className={
                cn( inputStyle, errors.TextoRequisito && errorInputStyle)
              }
            />
            {errors.NombreRequisito && (
              <p className={errorTextStyle}>
                <AlertCircle className={errorIconStyle} />
                {errors.NombreRequisito.message}
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="IdEstatusRequisito"
                {...register("IdEstatusRequisito")}
                defaultChecked={isEstatusChecked}
                onCheckedChange={(checked) =>{
                  setValue("IdEstatusRequisito", Boolean(checked));
                }}
              />
              <div className="flex-1">
                <Label
                  htmlFor="IdEstatusRequisito"
                  className="text-text-primary font-semibold cursor-pointer"
                >
                  Activo
                </Label>
                <p className="text-xs text-text-secondary mt-0.5">
                  {isEstatusChecked
                    ? "El requisito está activo y visible en el sistema"
                    : "Requisito inactivo y no visible en el sistema"}
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
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {requisito?.IdRequisito ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
