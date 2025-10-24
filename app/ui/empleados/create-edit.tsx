"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmpleadoFormData, empleadoSchema } from "@/lib/schemas/empleado";
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
import { useState, useMemo, useEffect } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  X, 
  Plus, 
  List,
  ChevronDown,
  ChevronUp,
  Check,
  Briefcase,
  Search,
  History,
  UserStar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateEditFormProps {
  empleado?: EmpleadoFormData;
  puestos: PuestoListItem[];
}

export default function CreateEditFormCompleto({
  empleado,
  puestos,
}: CreateEditFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [openPuestos, setOpenPuestos] = useState(false);
  const [searchPuesto, setSearchPuesto] = useState("");
  const isEditMode = !!empleado;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema) as Resolver<EmpleadoFormData>,
    defaultValues: empleado || {
      NombreEmpleado: "",
      UserName: "",
      Password: "",
      Correo: "",
      IdPuestos: [],
      IdEstatusEmpleado: true,
    },
  });

  const isEstatusChecked = useWatch({ control, name: "IdEstatusEmpleado" });
  const puestosSeleccionados = watch("IdPuestos") || [];

  // Debug: Verificar que los puestos se carguen en modo edición
  useEffect(() => {
    if (isEditMode && empleado) {
      if (empleado.IdPuestos && empleado.IdPuestos.length > 0) {
        setValue("IdPuestos", empleado.IdPuestos);
      }
    }
  }, [isEditMode, empleado, setValue]);


  // Filtrar puestos según búsqueda
  const puestosFiltrados = useMemo(() => {
    if (!searchPuesto.trim()) return puestos;
    const search = searchPuesto.toLowerCase();
    return puestos.filter(p => 
      p.NombrePuesto.toLowerCase().includes(search)
    );
  }, [puestos, searchPuesto]);

  const onSubmit = async (data: EmpleadoFormData) => {
    setFormError(null);
    setShowSuccessMessage(false);

    try {
      let result;
      if (empleado?.IdEmpleado) {
        //console.log("✏️ Actualizando empleado ID:", empleado.IdEmpleado, 'data:', data);
        result = await updateEmpleado(empleado.IdEmpleado, data);
      } else {
        //console.log("➕ Creando nuevo empleado");
        result = await createEmpleado(data);
      }

      //console.log("📤 Resultado del servidor:", result);

      if (result.Resultado === 500) {
        setFormError(result.Mensaje);
      } else {
        if (!empleado?.IdEmpleado) {
          setShowSuccessMessage(true);
          reset({
            NombreEmpleado: "",
            UserName: "",
            Password: "",
            Correo: "",
            IdPuestos: [],
            IdEstatusEmpleado: true,
          });
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

  const handleCancel = () => {
    reset();
    router.push("/icalidad/empleado");
  };

  const handleCreateAnother = () => {
    setShowSuccessMessage(false);
  };

  const handleGoToList = () => {
    router.push("/icalidad/empleado");
    router.refresh();
  };

  const togglePuesto = (idPuesto: number) => {
    const current = puestosSeleccionados;
    const newSelection = current.includes(idPuesto)
      ? current.filter(id => id !== idPuesto)
      : [...current, idPuesto];
    
    //console.log("🔄 Toggle puesto:", idPuesto, "Nueva selección:", newSelection);
    setValue("IdPuestos", newSelection, { shouldValidate: true });
  };

  const removePuesto = (idPuesto: number) => {
    const newSelection = puestosSeleccionados.filter(id => id !== idPuesto);
    //console.log("🗑️ Removiendo puesto:", idPuesto, "Nueva selección:", newSelection);
    setValue("IdPuestos", newSelection, { shouldValidate: true });
  };

  const getPuestoNombre = (idPuesto: number) => {
    return puestos.find(p => p.IdPuesto === idPuesto)?.NombrePuesto || `Puesto #${idPuesto}`;
  };

  return (
    <Card className="max-w-3xl mx-auto border-none">
      <CardHeader className="text-2xl font-bold text-text-primary">
        <CardTitle className="text-2xl font-bold text-text-primary flex items-center justify-between">
          <span>{isEditMode ? "Editar Empleado" : "Crear Empleado"}</span>
          {isEditMode && empleado?.IdEmpleado && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Aquí puedes abrir el modal de historial cuando lo implementes
                console.log("📜 Ver historial del empleado:", empleado.IdEmpleado);
              }}
            >
              <History className="w-4 h-4 mr-2" />
              Historial
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-text-secondary mt-1">
            {isEditMode
              ? "Actualiza los detalles del empleado y sus puestos asignados."
              : "Crea un nuevo empleado y asigna sus puestos de trabajo."}
          </p>
        </CardDescription>

        {/* Mensaje de error */}
        {formError && (
          <div className="flex items-center space-x-2 mt-2 bg-destructive/10 p-3 rounded-lg border border-destructive/30">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">Error: {formError}</span>
          </div>
        )}

        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div className="mb-6 bg-success/10 border-2 border-success rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
              <div>
                <span className="font-semibold text-success block">
                  ¡Empleado guardado exitosamente!
                </span>
                <p className="text-sm text-success/90 mt-1">
                  El empleado y sus puestos han sido creados exitosamente.
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                onClick={handleCreateAnother}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear otro
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-border-default"
                onClick={handleGoToList}
              >
                <List className="w-4 h-4 mr-2" />
                Ver todos los empleados
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-bg-secondary border-2 border-border-default rounded-lg shadow-md p-6 space-y-6"
        >
          {/* SECCIÓN: DATOS BÁSICOS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary border-b pb-2">
              Datos Básicos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="NombreEmpleado">Nombre del Empleado *</Label>
                <Input
                  id="NombreEmpleado"
                  {...register("NombreEmpleado")}
                  placeholder="Ej. Juan Pérez García"
                  className="bg-bg-primary border-border-default"
                />
                {errors.NombreEmpleado && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.NombreEmpleado.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Correo">Correo Electrónico</Label>
                <Input
                  id="Correo"
                  {...register("Correo")}
                  type="email"
                  placeholder="juan.perez@empresa.com"
                  className="bg-bg-primary border-border-default"
                />
                {errors.Correo && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.Correo.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="UserName">Usuario *</Label>
                <Input
                  id="UserName"
                  {...register("UserName")}
                  placeholder="jperez"
                  className="bg-bg-primary border-border-default"
                />
                {errors.UserName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.UserName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Password">Contraseña *</Label>
                <Input
                  id="Password"
                  {...register("Password")}
                  type="password"
                  placeholder="********"
                  className="bg-bg-primary border-border-default"
                />
                {errors.Password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.Password.message}
                  </p>
                )}
              </div>
            </div>
          </div>
            <div >
                <h3 className="text-lg font-semibold text-text-primary border-b pb-2">
                Datos Adicionales            
                </h3>
           </div>
        <Tabs defaultValue="puestos" className="w-full">
  <TabsList className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-default dark:border-dark-border-default">
    <TabsTrigger 
      value="puestos" 
      className="w-full cursor-pointer data-[state=active]:bg-primary-500 data-[state=active]:text-white hover:bg-light-bg-primary dark:hover:bg-dark-bg-primary transition-colors"
    >
      <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary data-[state=active]:text-white flex items-center gap-2">
        <Briefcase className="w-5 h-5" />
        Puestos Asignados
        {isEditMode && puestosSeleccionados.length > 0 && (
          <span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary data-[state=active]:text-white/80">
            ({puestosSeleccionados.length} asignado{puestosSeleccionados.length !== 1 ? 's' : ''})
          </span>
        )}
      </h3>
    </TabsTrigger>
    <TabsTrigger 
      value="roles" 
      className="w-full cursor-pointer data-[state=active]:bg-primary-500 data-[state=active]:text-white hover:bg-light-bg-primary dark:hover:bg-dark-bg-primary transition-colors"
    >
      <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary data-[state=active]:text-white flex items-center gap-2">
        <UserStar className="w-5 h-5" />
        Roles Asignados
        {isEditMode && puestosSeleccionados.length > 0 && (
          <span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary data-[state=active]:text-white/80">
            ({puestosSeleccionados.length} asignado{puestosSeleccionados.length !== 1 ? 's' : ''})
          </span>
        )}
      </h3>
    </TabsTrigger>
  </TabsList>

  <TabsContent value="puestos" className="mt-6">
    {/* SECCIÓN: PUESTOS */}
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Botón para abrir/cerrar dropdown */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-default dark:border-dark-border-default hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
            onClick={() => setOpenPuestos(!openPuestos)}
          >
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {puestosSeleccionados.length > 0
                ? `${puestosSeleccionados.length} puesto(s) seleccionado(s)`
                : "Seleccionar puestos..."}
            </span>
            {openPuestos ? (
              <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>

          {/* Dropdown personalizado */}
          {openPuestos && (
            <div className="absolute z-50 w-full mt-2 bg-light-bg-primary dark:bg-dark-bg-primary border-2 border-light-border-default dark:border-dark-border-default rounded-lg shadow-lg">
              {/* Barra de búsqueda */}
              <div className="p-3 border-b border-light-border-default dark:border-dark-border-default">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary" />
                  <Input
                    type="text"
                    placeholder="Buscar puesto..."
                    value={searchPuesto}
                    onChange={(e) => setSearchPuesto(e.target.value)}
                    className="pl-9 bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-default dark:border-dark-border-default text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary"
                    autoFocus
                  />
                </div>
              </div>

              {/* Lista de puestos */}
              <div className="max-h-64 overflow-y-auto p-2">
                {puestosFiltrados.length === 0 ? (
                  <div className="p-4 text-center text-light-text-secondary dark:text-dark-text-secondary text-sm">
                    No se encontraron puestos
                  </div>
                ) : (
                  puestosFiltrados.map((puesto) => {
                    const isSelected = puestosSeleccionados.includes(puesto.IdPuesto);
                    return (
                      <button
                        key={puesto.IdPuesto}
                        type="button"
                        onClick={() => togglePuesto(puesto.IdPuesto)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors",
                          isSelected
                            ? "bg-primary-100 text-primary-700 font-medium"
                            : "hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-4 h-4 border-2 rounded transition-colors",
                            isSelected
                              ? "bg-primary-600 border-primary-600"
                              : "border-light-border-default dark:border-dark-border-default"
                          )}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="flex-1">{puesto.NombrePuesto}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer con contador y botón cerrar */}
              <div className="p-3 border-t border-light-border-default dark:border-dark-border-default flex items-center justify-between gap-2">
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {puestosSeleccionados.length} de {puestos.length} seleccionados
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpenPuestos(false);
                    setSearchPuesto("");
                  }}
                  className="bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-default dark:border-dark-border-default text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Badges de puestos seleccionados */}
        {puestosSeleccionados.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-4 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border-default dark:border-dark-border-default">
            {puestosSeleccionados.map((idPuesto) => (
              <Badge
                key={idPuesto}
                variant="secondary"
                className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 border border-primary-300 hover:bg-primary-200 transition-colors"
              >
                {getPuestoNombre(idPuesto)}
                <button
                  type="button"
                  onClick={() => removePuesto(idPuesto)}
                  className="ml-2 hover:text-error transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-dashed border-light-border-default dark:border-dark-border-default text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-light-text-secondary dark:text-dark-text-secondary opacity-50" />
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              No hay puestos asignados. Haz clic arriba para seleccionar.
            </p>
          </div>
        )}

        {errors.IdPuestos && (
          <p className="text-sm text-error flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.IdPuestos.message}
          </p>
        )}
      </div>
    </div>
  </TabsContent>

  <TabsContent value="roles" className="mt-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary border-b border-light-border-default dark:border-dark-border-default pb-2">
        Roles
      </h3>
      {/* Contenido para roles - similar estructura al de puestos */}
    </div>
  </TabsContent>
</Tabs>

          

          {/* SECCIÓN: ESTATUS (solo en edición) */}
          {isEditMode && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary border-b pb-2">
                Estado
              </h3>
              <div className="flex items-center space-x-3 p-4 bg-bg-primary rounded-lg border border-border-default">
                <Checkbox
                  id="IdEstatusEmpleado"
                  checked={isEstatusChecked}
                  onCheckedChange={(checked) => {
                    setValue("IdEstatusEmpleado", Boolean(checked));
                  }}
                />
                <div className="flex-1">
                  <Label
                    htmlFor="IdEstatusEmpleado"
                    className="text-text-primary font-semibold cursor-pointer"
                  >
                    Activo
                  </Label>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {isEstatusChecked
                      ? "El empleado puede acceder al sistema"
                      : "El empleado no puede acceder al sistema"}
                  </p>
                </div>
                <Badge
                  variant={isEstatusChecked ? "default" : "destructive"}
                  className={`${
                    isEstatusChecked
                      ? "bg-success/20 text-success border border-success/30"
                      : "bg-error/20 text-error border border-error/30"
                  }`}
                >
                  {isEstatusChecked ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          )}

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
                  {empleado?.IdEmpleado ? "Actualizar" : "Crear Empleado"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}