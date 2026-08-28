"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Users, Save } from "lucide-react";

import {
  getProcesoColaboradorDisponible,
  getProcesoColaboradorAsignado,
  ProcesoColaboradorList,
  asignarRemoverColaboradorAProceso,
} from "@/lib/data/procesoColaborador";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import ComboBoxMultiselect from "@/app/ui/shared/combo-box-multiselect";

// Esquema de validación del formulario
const ColaboradorFormSchema = z.object({
  IdEmpleados: z
    .array(z.number())
    .min(0, "Debes seleccionar al menos un colaborador."),
});

type ColaboradorFormData = z.infer<typeof ColaboradorFormSchema>;

interface ProcesoColaboradorFormProps {
  IdProceso: number;
}

// --- COMPONENTE PRINCIPAL ---
export default function ProcesoColaboradorForm({
  IdProceso,
}: ProcesoColaboradorFormProps) {
  const [allOptions, setAllOptions] = useState<ProcesoColaboradorList[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(ColaboradorFormSchema),
    defaultValues: {
      IdEmpleados: [],
    },
  });

  const [isSaving, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      if (!IdProceso) return;

      setIsLoadingData(true);

      try {
        const [disponiblesData, asignadosData] = await Promise.all([
          getProcesoColaboradorDisponible(IdProceso),
          getProcesoColaboradorAsignado(IdProceso),
        ]);

        const combinedMap = new Map<number, ProcesoColaboradorList>();
        [...asignadosData, ...disponiblesData].forEach((collab) => {
          combinedMap.set(collab.IdEmpleado, collab);
        });

        setAllOptions(Array.from(combinedMap.values()));

        const asignadosIds = asignadosData.map((collab) => collab.IdEmpleado);
        form.setValue("IdEmpleados", asignadosIds);
      } catch (error) {
        console.error("Error al cargar datos de colaboradores:", error);
        toast.error("No se pudieron cargar los datos de colaboradores.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [IdProceso, form]);

  const onSubmit = (data: ColaboradorFormData) => {
    startTransition(async () => {
      try {
        await asignarRemoverColaboradorAProceso(data.IdEmpleados, IdProceso);
        toast.success("Colaboradores guardados correctamente.");
      } catch (error) {
        console.error("Error al guardar colaboradores:", error);
        toast.error("Error al guardar los colaboradores.");
      }
    });
  };

  const colaboradorOptions = allOptions.map((collab) => ({
    id: collab.IdEmpleado,
    label: collab.NombreEmpleado,
  }));

  return (
    <div className="p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Asignar Colaboradores</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Busca y selecciona uno o más colaboradores relacionados con el proceso.
      </p>
      <Form {...form}>
        <FormField
          control={form.control}
          name="IdEmpleados"
          render={({ field }) => (
            <FormItem>
              <ComboBoxMultiselect
                label="colaborador"
                searchPlaceholder="Buscar colaborador..."
                options={colaboradorOptions}
                selectedIds={field.value}
                onChange={field.onChange}
                Icon={Users}
                displayMode="table"
                isLoading={isLoadingData}
                loadingMessage="Cargando colaboradores..."
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
