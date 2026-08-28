"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteDepartamento } from "@/lib/data/departamentos"; // Importar la Server Action
import { useState } from "react";
import { PencilIcon, Trash2, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";

interface DepartamentoActionsProps {
  idDepartamento: number;
}

export default function DepartamentoActions({
  idDepartamento,
}: DepartamentoActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = () => {
    toast.warning("¿Estas seguro de que quieres eliminar este departamento?", {
      position: "top-center",
      duration: Infinity,
      action: {
        label: "Eliminar",
        onClick: () => handleDelete(),
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDepartamento(idDepartamento);
      if (result.Resultado < 0) {
        //alert(`Error al eliminar: ${result.Mensaje}`);
        toast.error(`Error al eliminar: ${result.Mensaje}`, {
          position: "top-center",
        })
      } else {
        toast.success("Departamento eliminado exitosamente.", {
          position: "top-center",
        })
        //router.refresh(); // Refrescar la página para actualizar la tabla
      }
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      //alert("Error al eliminar el departamento. Inténtalo de nuevo.");
      toast.error("Error al eliminar el departamento. Inténtalo de nuevo.", {
        position: "top-center",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Link href={`/icalidad/departamento/${idDepartamento}/edit`}>
        <Button variant="outline" size="sm">
          <span className="hidden md:block">Editar</span>
          <PencilIcon className="h-5 md:ml-2" />
        </Button>
      </Link>
      <Button
        variant="destructive"
        size="sm"
        onClick={confirmDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-5" />
        )}
        <span className="hidden md:block">Eliminar</span>
      </Button>
    </div>
  );
}
