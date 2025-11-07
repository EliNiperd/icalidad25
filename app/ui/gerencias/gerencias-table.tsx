import { getGerencias } from '@/lib/data/gerencias';
import GerenciaTableWrapper from '@/app/ui/gerencias/gerencia-table-wrapper';

interface GerenciasTableProps {
    query: string;
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default async function GerenciasTable({
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}: GerenciasTableProps) {
    const { gerencias, totalPages, totalRecords } = await getGerencias(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <GerenciaTableWrapper 
            gerencias={gerencias} 
            totalPages={totalPages} 
            totalRecords={totalRecords}
            pageSize={pageSize}
            defaultSortBy={sortBy}
            defaultSortOrder={sortOrder}
            searchPlaceholder="Buscar gerencias..."
            showRowNumber={true}
        />
    );
}
