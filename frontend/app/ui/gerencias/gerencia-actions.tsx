"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteGerencia } from "@/lib/data/gerencias";
import { useState } from "react";
import { PencilIcon, Trash2, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DeleteConfirmDialog } from "@/app/ui/shared/delete-confirm-dialog";

interface GerenciaActionsProps {
  idGerencia: number;
  canDelete?: boolean;
}

export default function GerenciaActions({ idGerencia, canDelete = true }: GerenciaActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteGerencia(idGerencia);
      if (result.Resultado < 0) {
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
    <>
      <div className="flex space-x-2">
        <Link href={`/icalidad/gerencia/${idGerencia}/edit`}>
          <Button variant="outline" size="sm">
            <span className="hidden md:block">Editar</span>
            <PencilIcon className="h-5 md:ml-2" />
          </Button>
        </Link>
        {!canDelete ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-block cursor-not-allowed">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled
                    className="opacity-50 pointer-events-none"
                  >
                    <span className="hidden md:block">Eliminar</span>
                    <Trash2 className="h-5 md:ml-2" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>No se puede eliminar porque tiene departamentos asociados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowConfirm(true)}
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
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleDelete}
        itemType="Gerencia"
        description="¿Estás seguro de que deseas eliminar esta gerencia? Esta acción no se puede deshacer y se removerán sus configuraciones."
      />
    </>
  );
}
