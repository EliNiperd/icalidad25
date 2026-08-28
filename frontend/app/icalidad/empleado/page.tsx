import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TableSkeleton } from "@/app/ui/shared/skeletons";
import EmpleadosTable from "@/app/ui/empleados/empleados-table";

interface EmpleadoPageProps {
    searchParams?: { 
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
}

export default async function EmpleadoPage({ searchParams }: EmpleadoPageProps) {

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'NombreEmpleado';
    const sortOrder = searchParams?.sortOrder || 'asc';
    const pageSize = 10;

    return (
        <>
        <div className="flex justify-between items-center mx-auto py-2">
          <h1 className=" text-3xl font-bold  ">Gestión de Empleados</h1>
          <div >
            <Link href="/icalidad/empleado/create">
              <Button className="bg-primary-500 border border-primary-500 hover:bg-primary-600 text-white dark:hover:bg-primary-700 ">
                <Plus className="w-5" />
                <span className="hidden md:block">Crear Empleado</span>
              </Button>
            </Link>
          </div>
          </div>
          
          <Suspense fallback={<TableSkeleton cols={7} rows={pageSize} />}>
            <EmpleadosTable 
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
