"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Building2, Save } from "lucide-react";

import {
  getProcesoDepartamentoDisponible,
  getProcesoDepartamentoAsignado,
  ProcesoDepartamentoList,
  asignarRemoverDepartamentoAProceso,
} from "@/lib/data/procesoDepartamento";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import ComboBoxMultiselect from "@/app/ui/shared/combo-box-multiselect";

// Esquema de validación del formulario
const DepartamentoFormSchema = z.object({
  IdDepartamentos: z
    .array(z.number())
    .min(0, "Debes seleccionar al menos un departamento."),
});

type DepartamentoFormData = z.infer<typeof DepartamentoFormSchema>;

interface ProcesoDepartamentoFormProps {
  IdProceso: number;
}

// --- COMPONENTE PRINCIPAL ---
export default function ProcesoDepartamentoForm({
  IdProceso,
}: ProcesoDepartamentoFormProps) {
  const [allOptions, setAllOptions] = useState<ProcesoDepartamentoList[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<DepartamentoFormData>({
    resolver: zodResolver(DepartamentoFormSchema),
    defaultValues: {
      IdDepartamentos: [],
    },
  });

  const [isSaving, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      if (!IdProceso) return;

      setIsLoadingData(true);

      try {
        const [disponiblesData, asignadosData] = await Promise.all([
          getProcesoDepartamentoDisponible(IdProceso),
          getProcesoDepartamentoAsignado(IdProceso),
        ]);

        const combinedMap = new Map<number, ProcesoDepartamentoList>();
        [...asignadosData, ...disponiblesData].forEach((dept) => {
          combinedMap.set(dept.IdDepartamento, dept);
        });

        setAllOptions(Array.from(combinedMap.values()));

        const asignadosIds = asignadosData.map((dept) => dept.IdDepartamento);
        form.setValue("IdDepartamentos", asignadosIds);
      } catch (error) {
        console.error("Error al cargar datos de departamentos:", error);
        toast.error("No se pudieron cargar los datos de departamentos.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [IdProceso, form]);

  const onSubmit = (data: DepartamentoFormData) => {
    startTransition(async () => {
      try {
        await asignarRemoverDepartamentoAProceso(data.IdDepartamentos, IdProceso);
        toast.success("Departamentos guardados correctamente.");
      } catch (error) {
        console.error("Error al guardar departamentos:", error);
        toast.error("Error al guardar los departamentos.");
      }
    });
  };

  const departamentoOptions = allOptions.map((dept) => ({
    id: dept.IdDepartamento,
    label: dept.NombreDepartamento,
  }));

  return (
    <div className="p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Asignar Departamentos</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Busca y selecciona uno o más departamentos relacionados con el proceso.
      </p>
      <Form {...form}>
        <FormField
          control={form.control}
          name="IdDepartamentos"
          render={({ field }) => (
            <FormItem>
              <ComboBoxMultiselect
                label="departamento"
                searchPlaceholder="Buscar departamento..."
                options={departamentoOptions}
                selectedIds={field.value}
                onChange={field.onChange}
                Icon={Building2}
                displayMode="table"
                isLoading={isLoadingData}
                loadingMessage="Cargando departamentos..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mr-4">
          <Button
            type="submit"
            disabled={isSaving || isLoadingData}
            variant="primary"
            className="w-full sm:w-auto mt-4"
            onClick={form.handleSubmit(onSubmit)}
          >
            <Save className="mr-2 size-4" />
            {isSaving ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                Guardando...
              </>
            ) : (
              <span>Guardar</span>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
