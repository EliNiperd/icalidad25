"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProceso } from "@/lib/data/procesos"; // Importar la Server Action
import { useState } from "react";
import { PencilIcon, Trash2, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";

export default function ProcesoActions({ idProceso }: { idProceso: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = () => {
    toast.warning("¿Estas seguro de que quieres eliminar este proceso?", {
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
      const result = await deleteProceso(idProceso);
      if (result.Resultado < 0) {
        //alert(`Error al eliminar: ${result.Mensaje}`);
        toast.error(`Error al eliminar: ${result.Mensaje}`, {
          position: "top-center",
        });
      } else {
        //alert(result.Mensaje);
        toast.success(result.Mensaje, {
          position: "top-center",
        });
        router.refresh();
      }
    } catch (error) {
      //alert(`Error al eliminar: ${error}`);
      toast.error(`Error al eliminar: ${error}`, {
        position: "top-center",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Link href={`/icalidad/proceso/${idProceso}/edit`} className="mr-2">
          <Button variant="outline" size="sm">
            <PencilIcon className="mr-2 h-4 w-4" />
            <span className="hidden md:block">Editar</span>
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
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          <span className="hidden md:block">Eliminar</span>
        </Button>
      </div>
    </>
  );
}
