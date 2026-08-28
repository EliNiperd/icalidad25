"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePuesto } from "@/lib/data/puestos"; 
import { useState } from "react";
import { PencilIcon, Trash2, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";

interface PuestoActionsProps {
  idPuesto: number;
}

export default function PuestoActions({ idPuesto }: PuestoActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);


  const confirmDelete = () => {
    
    toast.warning("¿Estas seguro de que quieres eliminar este puesto?",{
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
        const result = await deletePuesto(idPuesto);
        if (result.Resultado < 0) {
          //alert(`Error al eliminar: ${result.Mensaje}`);
          toast.error(`Error al eliminar: ${result.Mensaje}`, {
            position: "top-center",
          });
        } else {
          toast.success("Puesto eliminada exitosamente.", {
            position: "top-center",
          });
          router.refresh();
        }
      } catch (error) {
        console.error("Error al eliminar puesto:", error);
        toast.error("Error al eliminar el puesto. Inténtalo de nuevo.", {
          position: "top-center",
        });
      } finally {
        setIsDeleting(false);
      }
  };

  return (
    <div className="flex space-x-2">
      <Link href={`/icalidad/puesto/${idPuesto}/edit`}>
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
            <Trash2 className="h-5 md:ml-2" />
          </>
        )}
        Eliminar
      </Button>
    </div>
  );
}
