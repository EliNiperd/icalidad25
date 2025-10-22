'use client';

import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GerenciaFormSchema, GerenciaFormData } from '@/lib/schemas/gerencia';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createGerencia, updateGerencia } from '@/lib/data/gerencias'; // Importar las Server Actions
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GerenciaFormProps {
  gerencia?: GerenciaFormData; // Opcional para edición
}

export default function GerenciaForm({ gerencia }: GerenciaFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  
  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<GerenciaFormData>({
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
        // Edición
        result = await updateGerencia(gerencia.IdGerencia, data);
      } else {
        // Creación
        result = await createGerencia(data);
      }

      if (result.Resultado < 0) {
        setFormError(result.Mensaje);
      } else {
        if (!gerencia?.IdGerencia) { // Solo para creación
          setShowSuccessMessage(true);
          reset({ // Limpiar el formulario para una nueva entrada
            ClaveGerencia: '',
            NombreGerencia: '',
            IdEstatusGerencia: true,
          });
        } else {
          router.push('/icalidad/gerencia'); // Redirigir a la tabla después de editar
          router.refresh(); // Refrescar los datos de la tabla
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
    // El formulario ya se reseteó en onSubmit
  };

  const handleGoToList = () => {
    router.push('/icalidad/gerencia');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">¡Éxito!</strong>
          <span className="block sm:inline"> La gerencia se ha creado correctamente.</span>
          <div className="mt-2 flex justify-center space-x-4">
            <Button type="button" onClick={handleCreateAnother}>Crear Otra</Button>
            <Button type="button" onClick={handleGoToList} variant="outline">Ir al Listado</Button>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="ClaveGerencia">Clave de Gerencia</Label>
        <Input
          id="ClaveGerencia"
          {...register("ClaveGerencia")}
          className="mt-1 block w-full"
          //disabled={!!gerencia?.IdGerencia} // Deshabilitar en edición
        />
        {errors.ClaveGerencia && <p className="text-red-500 text-sm mt-1">{errors.ClaveGerencia.message}</p>}
      </div>

      <div>
        <Label htmlFor="NombreGerencia">Nombre de Gerencia</Label>
        <Input
          id="NombreGerencia"
          {...register("NombreGerencia")}
          className="mt-1 block w-full"
        />
        {errors.NombreGerencia && <p className="text-red-500 text-sm mt-1">{errors.NombreGerencia.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
        id="IdEstatusGerencia"
        {...register("IdEstatusGerencia")}
        checked={isEstatusChecked} // Usar useWatch para controlar el estado
        onCheckedChange={(checked) => setValue("IdEstatusGerencia", Boolean(checked))}
      />
        <Label htmlFor="IdEstatusGerencia">Activo</Label>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : gerencia?.IdGerencia ? 'Actualizar Gerencia' : 'Crear Gerencia'}
        </Button>
      </div>
    </form>
  );
}
