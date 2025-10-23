import { Suspense } from "react";
import { getDepartamentos } from "@/lib/data/departamentos";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DepartamentoTableWrapper from "@/app/ui/departamentos/departamento-table-wrapper";
import { Plus } from "lucide-react";

interface DepartamentoPageProps {
    searchParams?:{
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
}

export default async function DepartamentoPage({ searchParams }: DepartamentoPageProps) {

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'NombreDepartamento'; // Columna por defecto para ordenar
    const sortOrder = searchParams?.sortOrder || 'asc'; // Orden por defecto
    const pageSize = 10; // Tamaño de página por defecto

    const { departamentos, totalPages, totalRecords } = await getDepartamentos(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );
       

    return (
        <>
        <div className="flex justify-between items-center mx-auto py-2">
          <h1 className=" text-3xl font-bold  ">Gestión de Departamentos</h1>
          <div >
            <Link href="/icalidad/departamento/create">
              <Button className="bg-primary-500 border border-primary-500 hover:bg-primary-600 text-white dark:hover:bg-primary-700 " >
                <Plus className="w-5" />
                <span className="hidden md:block">Crear Departamento</span>
              </Button>
            </Link>
          </div>
          </div>
          
          <Suspense fallback={<div>Cargando departamentos...</div>}>
            <div className="p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border-default dark:border-dark-border-default">
                <DepartamentoTableWrapper 
                departamentos={departamentos}
                totalRecords={totalRecords}
                totalPages={totalPages}
                pageSize={pageSize}
                defaultSortBy={sortBy}
                defaultSortOrder={sortOrder}
                searchPlaceholder="Buscar departamento..."
                />
            </div>
          </Suspense>
        </>     
    )
}