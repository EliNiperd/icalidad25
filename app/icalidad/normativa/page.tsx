import { Suspense } from "react";
import { getNormativas } from "@/lib/data/normativas";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NormativaTableWrapper from "@/app/ui/normativas/normativa-table-wrapper";
import { Plus } from "lucide-react";

interface NormativaPageProps {
    searchParams?: { 
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
}

export default async function NormativaPage({ searchParams }: NormativaPageProps) {

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'NombreNormativa'; // Columna por defecto para ordenar
    const sortOrder = searchParams?.sortOrder || 'asc'; // Orden por defecto
    const pageSize = 10; // Tamaño de página por defecto

    const { normativas, totalPages, totalRecords } = await getNormativas(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <>
        <div className="flex justify-between items-center mx-auto py-2">
          <h1 className=" text-3xl font-bold  ">Gestión de Normativas</h1>
          <div >
            <Link href="/icalidad/normativa/create">
              <Button className="bg-primary-500 border border-primary-500 hover:bg-primary-600 text-white dark:hover:bg-primary-700 ">
                <Plus className="w-5" />
                <span className="hidden md:block">Crear Normativa</span>
              </Button>
            </Link>
          </div>
          </div>
          
          <Suspense fallback={<div>Cargando normativas...</div>}>
            <NormativaTableWrapper 
                normativas={normativas} 
                totalPages={totalPages} 
                totalRecords={totalRecords}
                pageSize={pageSize}
                defaultSortBy={sortBy}
                defaultSortOrder={sortOrder}
                searchPlaceholder="Buscar normativa..."
                showRowNumber={true}
                 />
          </Suspense>
        </>
    );
}
