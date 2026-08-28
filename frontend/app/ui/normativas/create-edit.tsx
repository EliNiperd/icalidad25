"use client";

import { useForm, useWatch, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NormativaFormData, normativaSchema } from "@/lib/schemas/normativa";
import { createNormativa, updateNormativa } from "@/lib/data/normativas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, List, Plus, Save, X } from "lucide-react";

interface CreateEditFormProps {
  normativa?: NormativaFormData;
}

export default function CreateEditForm({ normativa }: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!normativa?.IdNormativa;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
    getValues,
  } = useForm<NormativaFormData>({
    resolver: zodResolver(normativaSchema) as Resolver<NormativaFormData>,
    defaultValues: normativa || {
      ClaveNormativa: "",
      NombreNormativa: "",
      IdEstatusNormativa: true,
    },
    mode: "onChange", // Importante: valida en cada cambio
  });

  // Observar el valor del checkbox para la UI
  const isEstatusChecked = useWatch({ control, name: "IdEstatusNormativa" });

  // 🔍 DEBUG: Mostrar errores en consola cada vez que cambien
//   useEffect(() => {
//     if (Object.keys(errors).length > 0) {
//       console.log("❌ ERRORES DE VALIDACIÓN:", errors);
//       console.log("📋 Valores actuales del form:", getValues());
//     }
//   }, [errors, getValues]);

  // 🔍 DEBUG: Mostrar estado del form
//   useEffect(() => {
//     console.log("📊 Estado del form:", {
//       isValid,
//       isDirty: Object.keys(errors).length === 0,
//       errors: Object.keys(errors),
//     });
//   }, [isValid, errors]);

  const onSubmit = async (data: NormativaFormData) => {
    //console.log("✅ onSubmit ejecutado con data:", data);
    
    setFormError(null);
    setShowSuccessMessage(false);
    try {
      let result;
      if (isEditMode) {
        result = await updateNormativa(normativa.IdNormativa!, data);
      } else {
        result = await createNormativa(data);
      }

      if (result.Resultado < 0) {
        setFormError(result.Mensaje);
      } else {
        if (!isEditMode) {
          setShowSuccessMessage(true);
          reset();
        } else {
          router.push("/icalidad/normativa");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error al guardar normativa:", error);
      setFormError("Error al guardar la normativa. Inténtalo de nuevo.");
    }
  };

  // 🔍 DEBUG: Interceptar el evento de submit del form
  const handleFormSubmit = (e: React.FormEvent) => {
    // console.log("🚀 handleFormSubmit llamado");
    // console.log("📋 Valores del form antes de submit:", getValues());
    // console.log("❌ Errores antes de submit:", errors);
    handleSubmit(onSubmit)(e);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  };

  const handleGoToList = () => {
    router.push("/icalidad/normativa");
  };

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Editar Normativa" : "Crear Normativa"}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-text-secondary mt-1">
            {isEditMode
              ? "Modifica los detalles de la normativa"
              : "Ingresa los detalles de la normativa"}
          </p>
          
          {/* 🔍 DEBUG: Mostrar estado visual del form */}
          {/* <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
            <p className="font-bold mb-1">🐛 DEBUG INFO:</p>
            <p>isValid: {isValid ? "✅ Sí" : "❌ No"}</p>
            <p>Errores: {Object.keys(errors).length > 0 ? Object.keys(errors).join(", ") : "Ninguno"}</p>
            <p>isSubmitting: {isSubmitting ? "Sí" : "No"}</p>
          </div> */}

          {/* Mensaje de error */}
          {formError && (
            <div className="mb-6 bg-error/10 border-2 border-error rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-error flex-shrink-0 mt-0.5" />
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
                <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-success">Normativa creada</p>
                  <p className="text-sm text-success/90 mt-1">
                    La normativa se ha guardado correctamente.
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button onClick={handleCreateAnother}>
                  <Plus className="mr-2 h-4 w-4" /> Crear otra
                </Button>
                <Button onClick={handleGoToList}>
                  <List className="mr-2 h-4 w-4" /> Ver listado
                </Button>
              </div>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleFormSubmit}
          className="bg-bg-secondary border-2 border-border-default rounded-lg shadow-lg p-6 space-y-4"
        >
          <div className="space-y-2">
            <Label>Clave de Normativa</Label>
            <Input
              id="ClaveNormativa"
              {...register("ClaveNormativa")}
              placeholder="ISO- ..."
              className="w-full p-2 border rounded-md bg-bg-primary 
                                    border-border-default text-text-primary placeholder:text-text-secondary
                                    focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
            {errors.ClaveNormativa && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.ClaveNormativa.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nombre de Normativa</Label>
            <Input
              type="text"
              id="NombreNormativa"
              {...register("NombreNormativa")}
              placeholder="Nombre normativa"
              className="w-full p-2 border rounded-md bg-bg-primary 
                                    border-border-default text-text-primary placeholder:text-text-secondary
                                    focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
            {errors.NombreNormativa && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.NombreNormativa.message}
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center space-x-2 pt-2">
              <Controller
                name="IdEstatusNormativa"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="IdEstatusNormativa"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="flex-1">
                <Label
                  htmlFor="IdEstatusNormativa"
                  className="text-text-primary font-semibold cursor-pointer"
                >
                  Activo
                </Label>
                <p className="text-sm text-text-secondary mt-0.5">
                  {isEstatusChecked
                    ? "La normativa se encuentra activa y visible en el sistema"
                    : "Normativa inactiva. No se muestra en el sistema"}
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
              onClick={handleCancel}
              variant="outline"
              className="border-border-default hover:bg-bg-primary"
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700"
              disabled={isSubmitting}
              
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {normativa?.IdNormativa ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}