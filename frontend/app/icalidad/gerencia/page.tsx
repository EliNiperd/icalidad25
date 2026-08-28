import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TableSkeleton } from "@/app/ui/shared/skeletons";
import GerenciasTable from "@/app/ui/gerencias/gerencias-table";

interface GerenciaPageProps {
    searchParams?: { 
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
}

export default async function GerenciaPage({ searchParams }: GerenciaPageProps) {

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'NombreGerencia';
    const sortOrder = searchParams?.sortOrder || 'asc';
    const pageSize = 10;

    return (
        <>
        <div className="flex justify-between items-center mx-auto py-2">
          <h1 className=" text-3xl font-bold  ">Gestión de Gerencias</h1>
          <div >
            <Link href="/icalidad/gerencia/create">
              <Button className="bg-primary-500 border border-primary-500 hover:bg-primary-600 text-white dark:hover:bg-primary-700 ">
                <Plus className="w-5" />
                <span className="hidden md:block">Crear Gerencia</span>
              </Button>
            </Link>
          </div>
          </div>
          
          <Suspense fallback={<TableSkeleton cols={5} rows={pageSize} />}>
            <GerenciasTable 
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
