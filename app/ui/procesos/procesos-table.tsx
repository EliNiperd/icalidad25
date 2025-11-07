import { getProcesos } from '@/lib/data/procesos';
import ProcesoTableWrapper from '@/app/ui/procesos/proceso-table-wrapper';

interface ProcesosTableProps {
    query: string;
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default async function ProcesosTable({
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}: ProcesosTableProps) {
    const { procesos, totalPages, totalRecords } = await getProcesos(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <ProcesoTableWrapper 
            procesos={procesos} 
            totalPages={totalPages} 
            totalRecords={totalRecords}
            pageSize={pageSize}
            defaultSortBy={sortBy}
            defaultSortOrder={sortOrder}
            searchPlaceholder="Buscar procesos..."
            showRowNumber={true}
        />
    );
}
