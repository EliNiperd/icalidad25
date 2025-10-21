import { Suspense } from 'react';
import { getGerencias } from '@/lib/data/gerencias';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GerenciaTableWrapper from '@/app/ui/gerencias/gerencia-table-wrapper';
import { Plus } from 'lucide-react';

interface GerenciaPageProps {
  searchParams?: {
    query?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

export default async function GerenciaPage({ searchParams }: GerenciaPageProps) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const sortBy = searchParams?.sortBy || 'NombreGerencia'; // Columna por defecto para ordenar
  const sortOrder = searchParams?.sortOrder || 'asc'; // Orden por defecto
  const pageSize = 10; // Tamaño de página por defecto

  const { gerencias, totalPages, totalRecords } = await getGerencias(
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
  );

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Gestión de Gerencias</h1>
      <div className="flex justify-end mb-4">
        <Link href="/icalidad/gerencia/create">
          <Button>
            <Plus className="w-5" />
            <span className="hidden md:block">Crear Gerencia</span>
          </Button>
        </Link>
      </div>
      <Suspense fallback={<div>Cargando gerencias...</div>}>
        <GerenciaTableWrapper
          gerencias={gerencias}
          totalRecords={totalRecords}
          totalPages={totalPages}
          pageSize={pageSize}
          defaultSortBy={sortBy}
          defaultSortOrder={sortOrder}
          searchPlaceholder="Buscar por clave o nombre..."
        />
      </Suspense>
    </>
  );
}
