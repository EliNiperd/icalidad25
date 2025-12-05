"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { FileQuestion, Save } from "lucide-react";

import {
  getProcesoRequisitoDisponible,
  getProcesoRequisitoAsignado,
  ProcesoRequisitoList,
  asignarRemoverRequisitoAProceso,
} from "@/lib/data/procesoRequisito";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import ComboBoxMultiselect from "@/app/ui/shared/combo-box-multiselect";

// Esquema de validación del formulario
const RequisitoFormSchema = z.object({
  IdRequisitos: z
    .array(z.number())
    .min(0, "Debes seleccionar al menos un requisito."),
});

type RequisitoFormData = z.infer<typeof RequisitoFormSchema>;

interface ProcesoRequisitoFormProps {
  IdProceso: number;
}

// --- COMPONENTE PRINCIPAL ---
export default function ProcesoRequisitoForm({
  IdProceso,
}: ProcesoRequisitoFormProps) {
  const [allOptions, setAllOptions] = useState<ProcesoRequisitoList[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true); // 🔥 NUEVO: Estado de carga inicial

  const form = useForm<RequisitoFormData>({
    resolver: zodResolver(RequisitoFormSchema),
    defaultValues: {
      IdRequisitos: [],
    },
  });

  const [isSaving, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      if (!IdProceso) return;

      setIsLoadingData(true); // 🔥 NUEVO: Iniciar carga

      try {
        const [disponiblesData, asignadosData] = await Promise.all([
          getProcesoRequisitoDisponible(IdProceso),
          getProcesoRequisitoAsignado(IdProceso),
        ]);

        const combinedMap = new Map<number, ProcesoRequisitoList>();
        [...asignadosData, ...disponiblesData].forEach((req) => {
          combinedMap.set(req.IdRequisito, req);
        });

        setAllOptions(Array.from(combinedMap.values()));

        const asignadosIds = asignadosData.map((req) => req.IdRequisito);
        form.setValue("IdRequisitos", asignadosIds);
      } catch (error) {
        console.error("Error al cargar datos de requisitos:", error);
        toast.error("No se pudieron cargar los datos de requisitos.");
      } finally {
        setIsLoadingData(false); // 🔥 NUEVO: Finalizar carga
      }
    };

    fetchData();
  }, [IdProceso, form]);

  const onSubmit = (data: RequisitoFormData) => {
    startTransition(async () => {
      try {
        await asignarRemoverRequisitoAProceso(data.IdRequisitos, IdProceso);
        toast.success("Requisitos guardados correctamente.");
      } catch (error) {
        console.error("Error al guardar requisitos:", error);
        toast.error("Error al guardar los requisitos.");
      }
    });
  };

  const requisitoOptions = allOptions.map((req) => ({
    id: req.IdRequisito,
    label: req.NombreRequisito,
  }));

  return (
    <div className="p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Asignar Requisitos</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Busca y selecciona uno o más requisitos relacionados con el proceso.
      </p>
      <Form {...form}>
        <FormField
          control={form.control}
          name="IdRequisitos"
          render={({ field }) => (
            <FormItem>
              <ComboBoxMultiselect
                label="requisito"
                searchPlaceholder="Buscar requisito..."
                options={requisitoOptions}
                selectedIds={field.value}
                onChange={field.onChange}
                Icon={FileQuestion}
                displayMode="table"
                isLoading={isLoadingData} // 🔥 NUEVO: Pasar estado de carga
                loadingMessage="Cargando requisitos..." // 🔥 NUEVO: Mensaje personalizado
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mr-4">
          <Button
            type="submit"
            disabled={isSaving || isLoadingData} // 🔥 NUEVO: Deshabilitar mientras carga
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