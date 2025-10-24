import { Suspense } from "react";
import { getEmpleados } from "@/lib/data/empleados";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EmpleadoTableWrapper from "@/app/ui/empleados/empleado-table-wrapper";
import { Plus } from "lucide-react";

interface EmpleadoPageProps {
  searchParams?: {
    query?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
}

export default async function EmpleadosPage({
  searchParams,
}: EmpleadoPageProps) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortBy = searchParams?.sortBy || "NombreEmpleado"; // Columna por defecto para ordenar
  const sortOrder = searchParams?.sortOrder || "asc"; // Orden por defecto
  const pageSize = 10; // Tamaño de página por defecto

  const { empleados, totalPages, totalRecords } = await getEmpleados(
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
  );
  return (
    <>
      <div className="flex justify-between items-center mx-auto py-2">
        <h1 className=" text-3xl font-bold  ">Gestión de Empleados</h1>
        <div>
          <Link href="/icalidad/empleado/create">
            <Button className="bg-primary-500 border border-primary-500 hover:bg-primary-600 text-white dark:hover:bg-primary-700 ">
              <Plus className="w-5" />
              <span className="hidden md:block">Crear Empleado</span>
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<div>Cargando empleados...</div>}>
        {/*  Definición principal de la tabla */ }
        <EmpleadoTableWrapper
          empleados={empleados}
          totalRecords={totalRecords}
          totalPages={totalPages}
          pageSize={pageSize}
          defaultSortBy={sortBy}
          defaultSortOrder={sortOrder}
          searchPlaceholder="Buscar empleado"
          showRowNumber={true}
        />
      </Suspense>
    </>
  );
}
