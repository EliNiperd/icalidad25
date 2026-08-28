import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProcesosTable from "@/app/ui/procesos/procesos-table";
import { TableSkeleton } from "@/app/ui/shared/skeletons";


interface ProcesoPageProps {
    searchParams?: { 
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
}

export default async function ProcesoPage({ searchParams }: ProcesoPageProps) {
  const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'NombreProceso'; // Columna por defecto para ordenar
    const sortOrder = searchParams?.sortOrder || 'asc'; // Orden por defecto
    const pageSize = 10; // Tamaño de página por defecto

    return (
        <>
        <div className="flex justify-between items-center mx-auto py-2">
          <h1 className=" text-3xl font-bold  ">Gestión de Procesos</h1>
          <div >
            <Link href="/icalidad/proceso/create">
              <Button className="bg-secondary-300 border border-primary-500 hover:bg-secondary-500 text-white  ">
                <Plus className="w-5" />
                <span className="hidden md:block">Crear Proceso</span>
              </Button>
            </Link>
          </div>
          </div>
           <Suspense fallback={<TableSkeleton cols={5} rows={pageSize} />}>
            <ProcesosTable 
              query={query}
              currentPage={currentPage}
              pageSize={pageSize}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </Suspense> 
        </>
    );
}