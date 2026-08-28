'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteRequisito } from '@/lib/data/requisitos'; // Importar la Server Action
import { useState } from 'react';
import { PencilIcon, Trash2, LoaderPinwheel } from 'lucide-react';
import { toast } from 'sonner';

export default function RequisitoActions({ idRequisito }: { idRequisito: number }) {
    
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = () => {
        toast.warning("¿Estas seguro de que quieres eliminar esta requisito?",{
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
            const result = await deleteRequisito(idRequisito);
            if (result.Resultado < 0) {
                //alert(`Error al eliminar: ${result.Mensaje}`);
                toast.error(`Error al eliminar: ${result.Mensaje}`, {
                    position: "top-center",
                });
            } else {
                toast.success('Requisito eliminada exitosamente.', {
                    position: "top-center",
                });
                //router.refresh();
            }
        } catch (error) {
            console.error('Error al eliminar requisito:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
        <div className="flex space-x-2">
            <Link href={`/icalidad/requisito/${idRequisito}/edit`} className="mr-2">
                <Button variant="outline" size="sm">
                    <PencilIcon className=" h-4 w-4" />
                     <span className="hidden md:block">Editar</span>
                </Button>
            </Link>
            <Button 
                variant="danger"
                size="sm"
                onClick={confirmDelete} 
                disabled={isDeleting}
                >
                {isDeleting ? (
                    <LoaderPinwheel className=" h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className=" h-4 w-4" />
                )}
                <span className="hidden md:block">Eliminar</span>
            </Button>
        </div>
        </>
    );
}