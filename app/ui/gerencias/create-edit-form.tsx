'use client';

import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GerenciaFormSchema, GerenciaFormData } from '@/lib/schemas/gerencia';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createGerencia, updateGerencia } from '@/lib/data/gerencias';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Save, X, Plus, List } from 'lucide-react';

interface GerenciaFormProps {
  gerencia?: GerenciaFormData;
}

export default function GerenciaForm({ gerencia }: GerenciaFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    control, 
    formState: { errors, isSubmitting } 
  } = useForm<GerenciaFormData>({
    resolver: zodResolver(GerenciaFormSchema) as Resolver<GerenciaFormData>,
    defaultValues: gerencia || {
      ClaveGerencia: '',
      NombreGerencia: '',
      IdEstatusGerencia: true,
    },
  });

  const isEstatusChecked = useWatch({ control, name: "IdEstatusGerencia" });

  const onSubmit = async (data: GerenciaFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);
    try {
      let result;
      if (gerencia?.IdGerencia) {
        result = await updateGerencia(gerencia.IdGerencia, data);
      } else {
        result = await createGerencia(data);
      }

      if (result.Resultado < 0) {
        setFormError(result.Mensaje);
      } else {
        if (!gerencia?.IdGerencia) {
          setShowSuccessMessage(true);
          reset({
            ClaveGerencia: '',
            NombreGerencia: '',
            IdEstatusGerencia: true,
          });
        } else {
          router.push('/icalidad/gerencia');
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error al guardar gerencia:", error);
      setFormError("Error al guardar la gerencia. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  };

  const handleGoToList = () => {
    router.push('/icalidad/gerencia');
    router.refresh();
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header del formulario */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          {gerencia?.IdGerencia ? 'Editar Gerencia' : 'Nueva Gerencia'}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          {gerencia?.IdGerencia 
            ? 'Actualiza la información de la gerencia' 
            : 'Completa los datos para crear una nueva gerencia'
          }
        </p>
      </div>

      {/* Mensaje de error */}
      {formError && (
        <div className="mb-6 bg-error/10 border-2 border-error rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
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
              <p className="font-semibold text-success">¡Gerencia creada exitosamente!</p>
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

      {/* Formulario */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-bg-secondary border-2 border-border-default rounded-lg shadow-lg p-6 space-y-6 "
      >
        {/* Campo: Clave de Gerencia */}
        <div className="space-y-2">
          <Label 
            htmlFor="ClaveGerencia" 
            className="text-text-primary font-semibold"
          >
            Clave de Gerencia
            <span className="text-error ml-1">*</span>
          </Label>
          <Input
            id="ClaveGerencia"
            {...register("ClaveGerencia")}
            className="bg-bg-primary border-border-default text-text-primary placeholder:text-text-secondary/50"
            placeholder="Ej: G-01"
          />
          {errors.ClaveGerencia && (
            <p className="text-error text-sm flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.ClaveGerencia.message}
            </p>
          )}
        </div>

        {/* Campo: Nombre de Gerencia */}
        <div className="space-y-2">
          <Label 
            htmlFor="NombreGerencia" 
            className="text-text-primary font-semibold"
          >
            Nombre de Gerencia
            <span className="text-error ml-1">*</span>
          </Label>
          <Input
            id="NombreGerencia"
            {...register("NombreGerencia")}
            className="bg-bg-primary border-border-default text-text-primary placeholder:text-text-secondary/50"
            placeholder="Ej: Gerencia de Operaciones"
          />
          {errors.NombreGerencia && (
            <p className="text-error text-sm flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.NombreGerencia.message}
            </p>
          )}
        </div>

        {/* Campo: Estado */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="IdEstatusGerencia"
              {...register("IdEstatusGerencia")}
              checked={isEstatusChecked}
              onCheckedChange={(checked) => setValue("IdEstatusGerencia", Boolean(checked))}
            />
            <div className="flex-1">
              <Label 
                htmlFor="IdEstatusGerencia" 
                className="text-text-primary font-semibold cursor-pointer"
              >
                Gerencia Activa
              </Label>
              <p className="text-xs text-text-secondary mt-0.5">
                {isEstatusChecked 
                  ? 'La gerencia está activa y visible en el sistema' 
                  : 'La gerencia está inactiva y no será visible'
                }
              </p>
            </div>
            <span 
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isEstatusChecked 
                  ? 'bg-success/20 text-success border border-success/30' 
                  : 'bg-error/20 text-error border border-error/30'
              }`}
            >
              {isEstatusChecked ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="border-border-default hover:bg-bg-primary"
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
                {gerencia?.IdGerencia ? 'Actualizar Gerencia' : 'Crear Gerencia'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}