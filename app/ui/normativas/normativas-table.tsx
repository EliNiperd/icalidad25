import { getNormativas } from '@/lib/data/normativas';
import NormativaTableWrapper from '@/app/ui/normativas/normativa-table-wrapper';

interface NormativasTableProps {
    query: string;
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default async function NormativasTable({
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}: NormativasTableProps) {
    const { normativas, totalPages, totalRecords } = await getNormativas(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <NormativaTableWrapper 
            normativas={normativas} 
            totalPages={totalPages} 
            totalRecords={totalRecords}
            pageSize={pageSize}
            defaultSortBy={sortBy}
            defaultSortOrder={sortOrder}
            searchPlaceholder="Buscar normativas..."
            showRowNumber={true}
        />
    );
}
