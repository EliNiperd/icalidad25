"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmpleadoFormData,
  empleadoSchema,
  RolAsignado,
} from "@/lib/schemas/empleado";
import { PuestoListItem } from "@/lib/data/puestos";
import { createEmpleado, updateEmpleado } from "@/lib/data/empleados";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Save,
  X,
  Plus,
  List,
  History,
  Briefcase,
  UserStar,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComboBoxMultiselect from "@/app/ui/shared/combo-box-multiselect";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface CreateEditFormProps {
  empleado?: EmpleadoFormData;
  puestos: PuestoListItem[];
  roles: RolAsignado[];
}

export default function CreateEditFormCompleto({
  empleado,
  puestos,
  roles,
}: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditMode = !!empleado;
  const [showHistory, setShowHistory] = useState(false);

  const form = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema) as Resolver<EmpleadoFormData>,
    defaultValues: empleado || {
      NombreEmpleado: "",
      UserName: "",
      Password: "",
      Correo: "",
      IdPuestos: [],
      IdRoles: [],
      IdEstatusEmpleado: true,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const isEstatusChecked = useWatch({ control, name: "IdEstatusEmpleado" });
  const puestosSeleccionados = useWatch({ control, name: "IdPuestos" }) || [];
  const rolesSeleccionados = useWatch({ control, name: "IdRoles" }) || [];

  // Adaptar los datos para el componente reutilizable
  const puestoOptions = puestos.map(p => ({ id: p.IdPuesto, label: p.NombrePuesto }));
  const rolOptions = roles.map(r => ({ id: r.IdRol, label: r.NombreRol }));

  const onSubmit = async (data: EmpleadoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);

    try {
      const result = isEditMode
        ? await updateEmpleado(empleado.IdEmpleado!, data)
        : await createEmpleado(data);

      if (result.Resultado === 500) {
        setFormError(result.Mensaje);
      } else {
        toast.success(result.Mensaje);
        if (!isEditMode) {
          setShowSuccessMessage(true);
          reset();
        } else {
          router.push("/icalidad/empleado");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("❌ Error al guardar empleado:", error);
      toast.error("Error al guardar el empleado. Inténtalo de nuevo.");
      setFormError("Error al guardar el empleado. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => router.back();
  const handleCreateAnother = () => setShowSuccessMessage(false);
  const handleGoToList = () => router.push("/icalidad/empleado");

  const tabsTriggerStyle = `px-4 py-2 -mb-[2px] cursor-pointer border-t-2 border-l-2 border-r-2 border-transparent rounded-t-md rounded-b-none
    data-[state=active]:bg-primary-400 data-[state=active]:text-white 
    data-[state=active]:border-border-default data-[state=active]:border-b-primary-400
    hover:bg-muted/50 transition-colors`;

  const tabsListStyle = `bg-background justify-start rounded-none p-0 border-b-2 border-border-default`;

  return (
    <Card className="max-w-3xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-text-primary flex items-center justify-between">
          <span>{isEditMode ? "Editar Empleado" : "Crear Empleado"}</span>
          {isEditMode && showHistory && (
            <Button type="button" variant="outline" size="sm"  >
              <History className="w-4 h-4 mr-2" />
              Historial
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-text-secondary mt-1">
            {isEditMode
              ? "Actualiza los detalles del empleado."
              : "Crea un nuevo empleado."}
          </p>
        </CardDescription>

        {formError && (
          <div className="flex items-center space-x-2 mt-2 bg-destructive/10 p-3 rounded-lg border border-destructive/30">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">
              Error: {formError}
            </span>
          </div>
        )}

        {showSuccessMessage && (
          <div className="mb-6 bg-success/10 border-2 border-success rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
              <div>
                <span className="font-semibold text-success block">
                  ¡Empleado guardado exitosamente!
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button type="button" onClick={handleCreateAnother} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Crear otro
              </Button>
              <Button type="button" variant="outline" onClick={handleGoToList}>
                <List className="w-4 h-4 mr-2" />
                Ver todos los empleados
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-bg-secondary border-2 border-border-default rounded-lg shadow-md p-6 space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary border-b pb-2">
                Datos Básicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="NombreEmpleado"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Nombre del Empleado *</Label>
                      <Input {...field} placeholder="Ej. Juan Pérez García" />
                      {errors.NombreEmpleado && <FormMessage>{errors.NombreEmpleado.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="Correo"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Correo Electrónico</Label>
                      <Input {...field} type="email" placeholder="juan.perez@empresa.com" />
                      {errors.Correo && <FormMessage>{errors.Correo.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="UserName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Usuario *</Label>
                      <Input {...field} placeholder="jperez" />
                      {errors.UserName && <FormMessage>{errors.UserName.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="Password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Contraseña *</Label>
                      <Input {...field} type="password" placeholder="********" />
                      {errors.Password && <FormMessage>{errors.Password.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary border-b pb-2">
                Asignaciones
              </h3>
            </div>

            <Tabs defaultValue="puestos" className="w-full">
              <TabsList className={tabsListStyle}>
                <TabsTrigger value="puestos" className={tabsTriggerStyle}>
                    <Briefcase className="w-5 h-5 mr-2" />
                    Puestos ({puestosSeleccionados.length})
                </TabsTrigger>
                <TabsTrigger value="roles" className={tabsTriggerStyle}>
                    <UserStar className="w-5 h-5 mr-2" />
                    Roles ({rolesSeleccionados.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="puestos" className="mt-6">
                <FormField
                  control={control}
                  name="IdPuestos"
                  render={({ field }) => (
                    <FormItem>
                      <ComboBoxMultiselect
                        label="puesto"
                        searchPlaceholder="Buscar puesto..."
                        options={puestoOptions}
                        selectedIds={field.value}
                        onChange={field.onChange}
                        Icon={Briefcase}
                      />
                      <FormMessage>{errors.IdPuestos?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="roles" className="mt-6">
                <FormField
                  control={control}
                  name="IdRoles"
                  render={({ field }) => (
                    <FormItem>
                      <ComboBoxMultiselect
                        label="rol"
                        searchPlaceholder="Buscar rol..."
                        options={rolOptions}
                        selectedIds={field.value}
                        onChange={field.onChange}
                        Icon={UserStar}
                      />
                      <FormMessage>{errors.IdRoles?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {isEditMode && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary border-b pb-2">
                  Estado
                </h3>
                <FormField
                  control={control}
                  name="IdEstatusEmpleado"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-4 bg-bg-primary rounded-lg border border-border-default">
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <div className="flex-1">
                            <Label>Activo</Label>
                            <p className="text-xs text-text-secondary">
                                {field.value ? "El empleado puede acceder al sistema" : "El empleado no puede acceder al sistema"}
                            </p>
                        </div>
                        <Badge variant={field.value ? "default" : "destructive"}>
                            {field.value ? "Activo" : "Inactivo"}
                        </Badge>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="primary">
                {isSubmitting ? "Guardando..." : <><Save className="h-4 w-4 mr-2" />{isEditMode ? "Actualizar" : "Crear Empleado"}</>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}