"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteGerencia } from "@/lib/data/gerencias"; // Importar la Server Action
import { useState } from "react";
import { PencilIcon, Trash2, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";

interface GerenciaActionsProps {
  idGerencia: number;
}

export default function GerenciaActions({ idGerencia }: GerenciaActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);


  const confirmDelete = () => {
    
    toast.warning("¿Estas seguro de que quieres eliminar esta gerencia?",{
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
        const result = await deleteGerencia(idGerencia);
        if (result.Resultado < 0) {
          //alert(`Error al eliminar: ${result.Mensaje}`);
          toast.error(`Error al eliminar: ${result.Mensaje}`, {
            position: "top-center",
          });
        } else {
          toast.success("Gerencia eliminada exitosamente.", {
            position: "top-center",
          });
          router.refresh();
        }
      } catch (error) {
        console.error("Error al eliminar gerencia:", error);
        toast.error("Error al eliminar la gerencia. Inténtalo de nuevo.", {
          position: "top-center",
        });
      } finally {
        setIsDeleting(false);
      }
  };

  return (
    <div className="flex space-x-2">
      <Link href={`/icalidad/gerencia/${idGerencia}/edit`}>
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
          <LoaderPinwheel className="w-5 animate-spin" />
        ) : (
          <>
            <span className="hidden md:block">Eliminar</span>
            <Trash2 className="h-5 md:ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
