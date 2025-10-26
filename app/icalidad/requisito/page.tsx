import { Suspense } from "react";
import { getRequisitos } from "@/lib/data/requisitos";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RequisitoTableWrapper from "@/app/ui/requisitos/requisito-table-wrapper";
import { Plus } from "lucide-react";


interface RequisitoPageProps {
    searchParams?: { 
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
}

export default async function RequisitoPage({ searchParams }: RequisitoPageProps) {
  const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'NombreRequisito'; // Columna por defecto para ordenar
    const sortOrder = searchParams?.sortOrder || 'asc'; // Orden por defecto
    const pageSize = 10; // Tamaño de página por defecto

    const { requisitos, totalPages, totalRecords } = await getRequisitos(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <>
        <div className="flex justify-between items-center mx-auto py-2">
          <h1 className=" text-3xl font-bold  ">Gestión de Requisitos</h1>
          <div >
            <Link href="/icalidad/requisito/create">
              <Button className="bg-secondary-300 border border-primary-500 hover:bg-secondary-500 text-white  ">
                <Plus className="w-5" />
                <span className="hidden md:block">Crear Requisito</span>
              </Button>
            </Link>
          </div>
          </div>
          
          <Suspense fallback={<div>Cargando requisitos...</div>}>
            <RequisitoTableWrapper 
                requisitos={requisitos} 
                totalPages={totalPages} 
                totalRecords={totalRecords}
                pageSize={pageSize}
                defaultSortBy={sortBy}
                defaultSortOrder={sortOrder}
                searchPlaceholder="Buscar requisito..."
                showRowNumber={true}
                 />
          </Suspense>
        </>
    );
}