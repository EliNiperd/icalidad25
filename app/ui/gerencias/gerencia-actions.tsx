"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteGerencia } from "@/lib/data/gerencias"; // Importar la Server Action
import { useState } from "react";
import { PencilIcon, Trash2, LoaderPinwheel } from "lucide-react";

interface GerenciaActionsProps {
  idGerencia: number;
}

export default function GerenciaActions({ idGerencia }: GerenciaActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta gerencia?")) {
      setIsDeleting(true);
      try {
        const result = await deleteGerencia(idGerencia);
        if (result.Resultado < 0) {
          alert(`Error al eliminar: ${result.Mensaje}`);
        } else {
          router.refresh(); // Refrescar la página para actualizar la tabla
        }
      } catch (error) {
        console.error("Error al eliminar gerencia:", error);
        alert("Error al eliminar la gerencia. Inténtalo de nuevo.");
      } finally {
        setIsDeleting(false);
      }
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
        onClick={handleDelete}
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
