'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteEmpleado } from '@/lib/data/empleados'; // Importar la Server Action
import { useState } from 'react';
import { PencilIcon, Trash2, LoaderPinwheel } from 'lucide-react';
import { toast } from 'sonner';

interface EmpleadoActionsProps {
    idEmpleado: number;
}

export default function EmpleadoActions({ idEmpleado }: EmpleadoActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = () => {
        toast.warning('¿Estas seguro de que quieres eliminar este empleado?', {
            position: 'top-center',
            duration: Infinity,
            action: {
                label: 'Eliminar',
                onClick: () => handleDelete(),
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => toast.dismiss(),
            },
        });
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteEmpleado(idEmpleado);
            if (result.Resultado < 0) {
                //alert(`Error al eliminar: ${result.Mensaje}`);
                toast.error(`Error al eliminar: ${result.Mensaje}`, {
                    position: 'top-center',
                });
            } else {
                toast.success('Empleado eliminado exitosamente.', {
                    position: 'top-center',
                });
                router.refresh();
            }
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            toast.error('Error al eliminar el empleado. Inténtalo de nuevo.', {
                position: 'top-center',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex space-x-2">
            <Link href={`/icalidad/empleado/${idEmpleado}/edit`}>
                <Button variant="outline" size="sm">
                    <span className="mr-2">Editar</span>
                    <PencilIcon className="mr-2 h-4 w-4" />
                </Button>
            </Link>
            <Button 
                variant="destructive" 
                size="sm" 
                onClick={confirmDelete} 
                disabled={isDeleting}>
                {isDeleting ? (
                    <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                )}
                Eliminar
            </Button>
        </div>
    );
}