import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TableSkeleton } from "@/app/ui/shared/skeletons";
import DepartamentosTable from "@/app/ui/departamentos/departamentos-table";

interface DepartamentoPageProps {
    searchParams?: Promise<{ 
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }>;
}

export default async function DepartamentoPage({ searchParams }: DepartamentoPageProps) {
    const resolvedParams = searchParams ? await searchParams : {};
    const query = resolvedParams.query || '';
    const currentPage = Number(resolvedParams.page) || 1;
    const sortBy = resolvedParams.sortBy || 'NombreDepartamento';
    const sortOrder = resolvedParams.sortOrder || 'asc';
    const pageSize = 10;

    const suspenseKey = `${query}-${currentPage}-${sortBy}-${sortOrder}`;

    return (
        <>
        <div className="flex justify-between items-center mx-auto py-2">
          <h1 className=" text-3xl font-bold  ">Gestión de Departamentos</h1>
          <div >
            <Link href="/icalidad/departamento/create">
              <Button className="bg-primary-500 border border-primary-500 hover:bg-primary-600 text-white dark:hover:bg-primary-700 ">
                <Plus className="w-5" />
                <span className="hidden md:block">Crear Departamento</span>
              </Button>
            </Link>
          </div>
          </div>
          
          <Suspense key={suspenseKey} fallback={<TableSkeleton cols={6} rows={pageSize} />}>
            <DepartamentosTable 
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