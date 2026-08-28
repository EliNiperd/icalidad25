import { getRequisitos } from '@/lib/data/requisitos';
import RequisitoTableWrapper from '@/app/ui/requisitos/requisito-table-wrapper';

interface RequisitosTableProps {
    query: string;
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default async function RequisitosTable({
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}: RequisitosTableProps) {
    const { requisitos, totalPages, totalRecords } = await getRequisitos(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <RequisitoTableWrapper 
            requisitos={requisitos} 
            totalPages={totalPages} 
            totalRecords={totalRecords}
            pageSize={pageSize}
            defaultSortBy={sortBy}
            defaultSortOrder={sortOrder}
            searchPlaceholder="Buscar requisitos..."
            showRowNumber={true}
        />
    );
}
