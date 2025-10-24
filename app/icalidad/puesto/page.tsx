import { Suspense } from 'react';
import { getPuestos } from '@/lib/data/puestos';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PuestoTableWrapper from '@/app/ui/puestos/puesto-table-wrapper';
import { Plus } from 'lucide-react';

interface PuestoPageProps {
  searchParams?: {
    query?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

export default async function PuestoPage({ searchParams }: PuestoPageProps) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const sortBy = searchParams?.sortBy || 'NombrePuesto'; // Columna por defecto para ordenar
  const sortOrder = searchParams?.sortOrder || 'asc'; // Orden por defecto
  const pageSize = 10; // Tamaño de página por defecto

  const { puestos, totalPages, totalRecords } = await getPuestos(
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
  );

  return (
    <>
    <div className="flex justify-between items-center mx-auto py-2">
      <h1 className=" text-3xl font-bold  ">Gestión de Puestos</h1>
      <div >
        <Link href="/icalidad/puesto/create">
          <Button className="bg-primary-500 border border-primary-500 hover:bg-primary-600 text-white dark:hover:bg-primary-700 ">
            <Plus className="w-5" />
            <span className="hidden md:block">Crear Puesto</span>
          </Button>
        </Link>
      </div>
      </div>
      
      <Suspense fallback={<div>Cargando puestos...</div>}>
      <div className="p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border-default dark:border-dark-border-default">
        <PuestoTableWrapper
          puestos={puestos}
          totalRecords={totalRecords}
          totalPages={totalPages}
          pageSize={pageSize}
          defaultSortBy={sortBy}
          defaultSortOrder={sortOrder}
          searchPlaceholder="Buscar por clave o nombre..."
          showRowNumber={true} // Habilitar número de renglón
        />
        </div>
      </Suspense>
    </>
  );
}
