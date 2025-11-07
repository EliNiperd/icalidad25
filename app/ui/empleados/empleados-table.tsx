import { getEmpleados } from '@/lib/data/empleados';
import EmpleadoTableWrapper from '@/app/ui/empleados/empleado-table-wrapper';

interface EmpleadosTableProps {
    query: string;
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default async function EmpleadosTable({
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}: EmpleadosTableProps) {
    const { empleados, totalPages, totalRecords } = await getEmpleados(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <EmpleadoTableWrapper 
            empleados={empleados} 
            totalPages={totalPages} 
            totalRecords={totalRecords}
            pageSize={pageSize}
            defaultSortBy={sortBy}
            defaultSortOrder={sortOrder}
            searchPlaceholder="Buscar empleados..."
            showRowNumber={true}
        />
    );
}
