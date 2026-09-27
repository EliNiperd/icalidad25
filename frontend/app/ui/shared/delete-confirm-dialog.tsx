"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertCircle, LoaderPinwheel } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  itemType?: string;
  itemName?: string;
  description?: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Eliminar",
  itemType = "registro",
  itemName,
  description,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border border-border-default bg-bg-primary text-text-primary shadow-2xl p-6 sm:rounded-2xl overflow-hidden">
        {/* Línea superior decorativa con degradado acorde al color danger */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-danger-200 via-destructive to-danger-300" />

        <AlertDialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
              <AlertCircle className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-1.5">
                {title}{" "}
                <span className="text-destructive font-extrabold capitalize">
                  {itemType}
                </span>
              </AlertDialogTitle>
              <p className="text-xs uppercase tracking-wider font-semibold text-text-secondary mt-0.5">
                Confirmación de Eliminación
              </p>
            </div>
          </div>

          <AlertDialogDescription className="text-sm text-text-secondary leading-relaxed bg-bg-secondary/60 rounded-xl p-3.5 border border-border-default/60">
            {description ? (
              description
            ) : (
              <>
                ¿Estás seguro de que deseas eliminar{" "}
                {itemName ? (
                  <span className="font-semibold text-text-primary">
                    &quot;{itemName}&quot;
                  </span>
                ) : (
                  `este ${itemType.toLowerCase()}`
                )}
                ? Esta acción es permanente y no se podrá recuperar.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end space-x-3">
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-border-default bg-bg-secondary hover:bg-bg-primary text-text-primary transition-all rounded-lg px-4 py-2 text-sm font-medium"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-danger-300 text-white font-semibold shadow-sm transition-all rounded-lg px-5 py-2 text-sm flex items-center gap-2 border border-destructive/30"
          >
            {isDeleting ? (
              <>
                <LoaderPinwheel className="h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Confirmar Eliminación"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
