"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, X, Save } from "lucide-react";

import { SubprocesoFormData, subprocesoSchema } from "@/lib/schemas/subproceso";
import {
  getSubProcesos,
  createSubProceso,
  updateSubProceso,
  deleteSubProceso,
  SubProcesoList
} from "@/lib/data/subprocesos";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


// --- COMPONENTE PRINCIPAL ---
export default function SubProcesosForm({ IdProceso }: { IdProceso: number }) {
  const [subProcesos, setSubProcesos] = useState<SubProcesoList[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubproceso, setEditingSubproceso] =
    useState<SubProcesoList | null>(null);
  const [subprocesoToDelete, setSubprocesoToDelete] =
    useState<SubProcesoList | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchAndSetSubProcesos = () => {
    startTransition(async () => {
      const data = await getSubProcesos(IdProceso);
      setSubProcesos(data);
    });
  };

  useEffect(() => {
    if (IdProceso) {
      fetchAndSetSubProcesos();
    }
  }, [IdProceso]);

  const handleAddNew = () => {
    setEditingSubproceso(null);
    setShowForm(true);
  };

  const handleEdit = (subproceso: SubProcesoList) => {
    setEditingSubproceso(subproceso);
    setShowForm(true);
  };

  const handleConfirmDelete = () => {
    if (!subprocesoToDelete) return;

    startTransition(async () => {
      const result = await deleteSubProceso(subprocesoToDelete.IdSubProceso);
      if (result.Resultado === 1) {
        toast.success(result.Mensaje);
        fetchAndSetSubProcesos();
      } else {
        toast.error(result.Mensaje);
      }
      setSubprocesoToDelete(null);
    });
  };

  const onFormFinish = () => {
    setShowForm(false);
    setEditingSubproceso(null);
    fetchAndSetSubProcesos();
  };

  return (
    <>
      <Card className="border-none" >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="h-5" >Sub-Procesos</CardTitle>
          <Button onClick={handleAddNew} size="sm" type="button" variant="primary" >
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <SubProcesoCUForm
              IdProceso={IdProceso}
              subprocesoToEdit={editingSubproceso}
              onFinished={onFormFinish}
            />
          ) : (
            <div className="rounded-lg border-2 border-border-default shadow-lg">
              <Table >
                <TableHeader className="bg-secondary-300 " >
                  <TableRow className="border-b border-border-default text-left text-sm font-bold text-white " >
                    <TableHead className="rounded-tl-md" >Clave</TableHead>
                    <TableHead >Nombre</TableHead>
                    <TableHead className="text-center rounded-tr-md">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subProcesos.length > 0 ? (
                    subProcesos.map((sp) => (
                      <TableRow
                        key={sp.IdSubProceso}
                        className="transition-all duration-150 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:shadow-sm border-b border-border-default"
                      >
                        <TableCell>{sp.ClaveSubProceso}</TableCell>
                        <TableCell>{sp.DescripcionSubProceso}</TableCell>
                        <TableCell className="text-center ">
                          <Button
                            variant="outline"
                            className="mr-2 border-border-default hover:bg-bg-primary"
                            size="icon"
                            onClick={() => handleEdit(sp)}
                            type="button"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setSubprocesoToDelete(sp)}
                            disabled={isLoading}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-16 text-center">
                        No hay sub-procesos registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!subprocesoToDelete}
        onOpenChange={() => setSubprocesoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el sub-proceso\n              <span className="font-bold">
                {subprocesoToDelete?.DescripcionSubProceso}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Continuar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// --- FORMULARIO DE CREACIÓN/EDICIÓN ---
interface SubProcesoCUFormProps {
  IdProceso: number;
  subprocesoToEdit: SubProcesoList | null;
  onFinished: () => void;
}

function SubProcesoCUForm({
  IdProceso,
  subprocesoToEdit,
  onFinished,
}: SubProcesoCUFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!subprocesoToEdit;

  const form = useForm<SubprocesoFormData>({
    resolver: zodResolver(subprocesoSchema),
    defaultValues: {
      ClaveSubproceso: subprocesoToEdit?.ClaveSubProceso || "",
      DescripcionSubproceso: subprocesoToEdit?.DescripcionSubProceso || "",
    },
  });

  const onSubmit = (data: SubprocesoFormData) => {
    startTransition(async () => {
      if (isEditing) {
        const result = await updateSubProceso(subprocesoToEdit!.IdSubProceso, data);
        if (result.Resultado === 200) {
          toast.success(result.Mensaje);
          onFinished();
        } else {
          toast.error(result.Mensaje);
        }
      } else {
        const result = await createSubProceso(IdProceso, data);
        if (result.Resultado === 201) {
          toast.success(result.Mensaje);
          onFinished();
        } else {
          toast.error(result.Mensaje);
        }
      }
    });
  };

  return (
    <Form {...form}  >
      <div className="space-y-2">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="ClaveSubproceso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clave del Sub-Proceso</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej. PR-01-01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="DescripcionSubproceso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Sub-Proceso</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej. Revisión de Documentos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            className="border-border-default hover:bg-bg-primary "
            onClick={onFinished}
            disabled={isPending}
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
             {isPending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />{" "}
                        {isEditing ? "Actualizar" : "Crear"}
                      </>
                    )}
          </Button>
        </div>
      </div>
    </Form>
  );
}