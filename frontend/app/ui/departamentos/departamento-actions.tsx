"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteDepartamento } from "@/lib/data/departamentos";
import { useState } from "react";
import { PencilIcon, Trash2, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/app/ui/shared/delete-confirm-dialog";

interface DepartamentoActionsProps {
  idDepartamento: number;
}

export default function DepartamentoActions({
  idDepartamento,
}: DepartamentoActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDepartamento(idDepartamento);
      if (result.Resultado < 0) {
        toast.error(`Error al eliminar: ${result.Mensaje}`, {
          position: "top-center",
        });
      } else {
        toast.success("Departamento eliminado exitosamente.", {
          position: "top-center",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      toast.error("Error al eliminar el departamento. Inténtalo de nuevo.", {
        position: "top-center",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <LoaderPinwheel className="h-5 animate-spin" />
          ) : (
            <>
              <span className="hidden md:block">Eliminar</span>
              <Trash2 className="h-5 md:ml-2" />
            </>
          )}
        </Button>
      </div>

      <DeleteConfirmDialog
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleDelete}
        itemType="Departamento"
        description="¿Estás seguro de que deseas eliminar este departamento? Esta acción no se puede deshacer y desvinculará sus configuraciones."
      />
    </>
  );
}
