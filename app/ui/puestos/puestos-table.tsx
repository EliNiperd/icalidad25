import { getPuestos } from '@/lib/data/puestos';
import PuestoTableWrapper from '@/app/ui/puestos/puesto-table-wrapper';

interface PuestosTableProps {
    query: string;
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default async function PuestosTable({
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}: PuestosTableProps) {
    const { puestos, totalPages, totalRecords } = await getPuestos(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <PuestoTableWrapper 
            puestos={puestos} 
            totalPages={totalPages} 
            totalRecords={totalRecords}
            pageSize={pageSize}
            defaultSortBy={sortBy}
            defaultSortOrder={sortOrder}
            searchPlaceholder="Buscar puestos..."
            showRowNumber={true}
        />
    );
}
