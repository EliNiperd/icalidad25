"use client";

import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProcesoFormData, procesoSchema } from "@/lib/schemas/proceso";
import { EmpleadoListItem } from "@/lib/data/empleados";
import { createProceso, updateProceso } from "@/lib/data/procesos";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatosGeneralesForm from "./datos-generales-form";
import SubProcesosForm from "./sub-procesos-form";

interface CreateEditFormProps {
  proceso?: ProcesoFormData;
  empleados: EmpleadoListItem[];
}

export default function CreateEditForm({
  proceso,
  empleados,
}: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!proceso?.IdProceso;

  const methods = useForm<ProcesoFormData>({
    resolver: zodResolver(procesoSchema) as Resolver<ProcesoFormData>,
    defaultValues: proceso || {
      ClaveProceso: "",
      NombreProceso: "",
      IdEmpleadoResponsable: undefined,
      IdEstatusProceso: true,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ProcesoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);
    
    try {
      const result = isEditMode
        ? await updateProceso(proceso.IdProceso!, data)
        : await createProceso(data);

      if (result.Resultado !== 200 && result.Resultado !== 201) {
        setFormError(result.Mensaje);
      } else {
        if (isEditMode) {
          router.push("/icalidad/proceso");
          router.refresh();
        } else {
          setShowSuccessMessage(true);
          reset();
        }
      }
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      setFormError("Error al guardar el proceso. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => router.back();
  const handleCreateAnother = () => setShowSuccessMessage(false);
  const handleGoToList = () => {
    router.push("/icalidad/proceso");
    router.refresh();
  };

  const formStyle = `bg-secondary border-2 border-border-default rounded-lg shadow-lg p-6`;
  const tabsTriggerStyle = `px-4 py-2 -mb-[2px] cursor-pointer border-t-2 border-l-2 border-r-2 border-transparent rounded-t-md rounded-b-none
    data-[state=active]:bg-primary-400 data-[state=active]:text-white 
    data-[state=active]:border-border-default data-[state=active]:border-b-primary-400
    hover:bg-muted/50 transition-colors`;

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary-600">
          {isEditMode ? "Editar Proceso" : "Crear Proceso"}
        </CardTitle>
        <CardDescription>
          <p className="text-primary-600">
            {isEditMode
              ? "Modifica los detalles del proceso."
              : "Crea un nuevo proceso."}
          </p>
          {formError && (
            <div className="mb-6 bg-error/10 border-2 border-error rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-error flex-shrink-0 mt-0.5 " />
              <div>
                <p className="font-semibold text-error">Error al guardar</p>
                <p className="text-sm text-error/90 mt-1">{formError}</p>
              </div>
            </div>
          )}
          {showSuccessMessage && (
            <div className="mb-6 bg-success/10 border-2 border-success rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-success">
                    ¡Proceso guardado exitosamente!
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreateAnother}
                >
                  <Plus className="w-4 h-4" /> Crear otro
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoToList}
                >
                  <List className="w-4 h-4" /> Ir al Listado
                </Button>
              </div>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={formStyle}>
            <Tabs defaultValue="general" className="w-full gap-4">
              <TabsList className="bg-background justify-start rounded-none p-0 border-b-2 border-border-default">
                <TabsTrigger value="general" className={tabsTriggerStyle}>
                  General
                </TabsTrigger>
                {isEditMode && (
                  <>
                    <TabsTrigger
                      value="subprocesos"
                      className={tabsTriggerStyle}
                    >
                      Sub-procesos
                    </TabsTrigger>
                    <TabsTrigger
                      value="requisitos"
                      className={tabsTriggerStyle}
                    >
                      Requisitos
                    </TabsTrigger>
                    <TabsTrigger
                      value="departamentos"
                      className={tabsTriggerStyle}
                    >
                      Departamentos
                    </TabsTrigger>
                    <TabsTrigger
                      value="colaboradores"
                      className={tabsTriggerStyle}
                    >
                      Colaboradores
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="general">
                <DatosGeneralesForm
                  empleados={empleados}
                  isEditMode={isEditMode}
                />
                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-border-default">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border-default hover:bg-bg-primary "
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" /> Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />{" "}
                        {isEditMode ? "Actualizar" : "Crear"}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="subprocesos">
                <SubProcesosForm IdProceso={proceso?.IdProceso ? proceso.IdProceso : 0} />
              </TabsContent>
              <TabsContent value="requisitos">
                <div>Requisitos (contenido pendiente)</div>
              </TabsContent>
              <TabsContent value="departamentos">
                <div>Departamentos (contenido pendiente)</div>
              </TabsContent>
              <TabsContent value="colaboradores">
                <div>Colaboradores (contenido pendiente)</div>
              </TabsContent>
            </Tabs>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
