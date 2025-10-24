'use client';

import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PuestoFormData, puestoSchema } from '@/lib/schemas/puesto';
import { DepartamentoListItem } from '@/lib/data/departamentos';
import { createPuesto, updatePuesto } from '@/lib/data/puestos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Save, X, Plus, List } from 'lucide-react';

interface CreateEditFormProps {
  puesto?: PuestoFormData;
  departamentos: DepartamentoListItem[];
}

export default function CreateEditForm({ puesto, departamentos }: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!puesto?.IdPuesto;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PuestoFormData>({
    resolver: zodResolver(puestoSchema) as Resolver<PuestoFormData>,
    defaultValues: puesto || {
      NombrePuesto: '',
      IdDepartamento: undefined,
      IdEstatusPuesto: true,
    },
  });

  const isEstatusChecked = useWatch({ control, name: "IdEstatusPuesto"});

  const onSubmit = async (data: PuestoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);
    try {
      let result;
      if (puesto?.IdPuesto) {
        result = await updatePuesto(puesto.IdPuesto, data);
      } else {
        result = await createPuesto(data);
      }

      if (result.Resultado < 0) {
        setFormError(result.Mensaje);
      } else {
        if (!puesto?.IdPuesto) {
          setShowSuccessMessage(true);
          reset({
            NombrePuesto: '',
            IdDepartamento: undefined,
            IdEstatusPuesto: true,
          });
        } else {
          router.push('/icalidad/puesto');
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error al guardar puesto:", error);
      setFormError("Error al guardar el puesto. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    router.back();
  }

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  }

  const handleGoToList = () => {
    router.push('/icalidad/puesto');
    router.refresh();
  }

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader className="text-2xl font-bold text-text-primary">
        <CardTitle className="text-2xl font-bold text-text-primary">{isEditMode ? 'Editar Puesto' : 'Crear Puesto'}</CardTitle>
        <CardDescription><p className="text-sm text-text-secondary mt-1">{isEditMode ? 'Modifica los detalles del puesto' : 'Ingresa los detalles del puesto'} </p> </CardDescription>
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
                    Puesto creado exitosamente!
                  </p>
                  <p className="text-sm text-success/90 mt-1">
                    {isEditMode ? 'Los detalles del puesto han sido actualizados.' : 'El puesto ha sido creado exitosamente.'}
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} 
          className="bg-bg-secondary border-2 border-border-default rounded-lg shadow-lg p-6 space-y-6 ">
          
          <div className="space-y-2">
            <Label htmlFor="IdDepartamento">Departamento *</Label>
            <select
              id="IdDepartamento"
              {...register('IdDepartamento')}
              className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              defaultValue={puesto?.IdDepartamento}
            >
              <option value="" disabled>Selecciona un departamento</option>
              {departamentos.map((depto) => (
                <option key={depto.IdDepartamento} value={depto.IdDepartamento}>
                  {depto.NombreDepartamento}
                </option>
              ))}
            </select>
            {errors.IdDepartamento && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.IdDepartamento.message}
              </p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="NombrePuesto">Nombre del Puesto *</Label>
            <Input id="NombrePuesto" 
              {...register('NombrePuesto')} 
              placeholder="Ej. Analista de Calidad" 
               className="w-full p-2 border rounded-md bg-bg-primary 
                border-border-default text-text-primary placeholder:text-text-secondary
                focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              />
            {errors.NombrePuesto && (
              <p className="text-error text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errors.NombrePuesto.message}
                </p>
            )}
          </div>
            
          {isEditMode && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="IdEstatusPuesto" 
                {...register('IdEstatusPuesto')} 
                checked={isEstatusChecked}
                onCheckedChange={(checked) => {
                  setValue("IdEstatusPuesto", Boolean(checked));
                }}
              />
              <div className="flex-1">
                <Label
                  htmlFor="IdEstatusPuesto"
                  className="text-text-primary font-semibold cursor-pointer"
                >
                  Activo
                </Label>
                <p className="text-xs text-text-secondary mt-0.5">
                  {isEstatusChecked
                    ? "El puesto está activo y visible en el sistema"
                    : "Puesto Inactivo y no visible en el sistema"}
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
                  {puesto?.IdPuesto ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}