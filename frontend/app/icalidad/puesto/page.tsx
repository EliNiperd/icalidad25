import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TableSkeleton } from "@/app/ui/shared/skeletons";
import PuestosTable from "@/app/ui/puestos/puestos-table";

interface PuestoPageProps {
    searchParams?: Promise<{ 
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }>;
}

export default async function PuestoPage({ searchParams }: PuestoPageProps) {
    const resolvedParams = searchParams ? await searchParams : {};
    const query = resolvedParams.query || '';
    const currentPage = Number(resolvedParams?.page) || 1;
    const sortBy = resolvedParams?.sortBy || 'NombrePuesto';
    const sortOrder = resolvedParams?.sortOrder || 'asc';
    const pageSize = 10;

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
          
          <Suspense fallback={<TableSkeleton cols={5} rows={pageSize} />}>
            <PuestosTable 
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
