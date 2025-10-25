'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteNormativa } from '@/lib/data/normativas'; // Importar la Server Action
import { useState } from 'react';
import { PencilIcon, Trash2, LoaderPinwheel } from 'lucide-react';
import { toast } from 'sonner';

export default function NormativaActions({ idNormativa }: { idNormativa: number }) {
    
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = () => {
        toast.warning("¿Estas seguro de que quieres eliminar esta normativa?",{
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
            const result = await deleteNormativa(idNormativa);
            if (result.Resultado < 0) {
                //alert(`Error al eliminar: ${result.Mensaje}`);
                toast.error(`Error al eliminar: ${result.Mensaje}`, {
                    position: "top-center",
                });
            } else {
                toast.success('Normativa eliminada exitosamente.', {
                    position: "top-center",
                });
                //router.refresh();
            }
        } catch (error) {
            console.error('Error al eliminar normativa:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
        <div className="flex space-x-2">
            <Link href={`/icalidad/normativa/${idNormativa}/edit`} className="mr-2">
                <Button variant="outline" size="sm">
                    <span className="hidden md:block">Editar</span>
                    <PencilIcon className="mr-2 h-4 w-4" />
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