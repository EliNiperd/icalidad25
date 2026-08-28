import { getDepartamentos } from '@/lib/data/departamentos';
import DepartamentoTableWrapper from '@/app/ui/departamentos/departamento-table-wrapper';

interface DepartamentosTableProps {
    query: string;
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default async function DepartamentosTable({
    query,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}: DepartamentosTableProps) {
    const { departamentos, totalPages, totalRecords } = await getDepartamentos(
        query,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    );

    return (
        <DepartamentoTableWrapper 
            departamentos={departamentos} 
            totalPages={totalPages} 
            totalRecords={totalRecords}
            pageSize={pageSize}
            defaultSortBy={sortBy}
            defaultSortOrder={sortOrder}
            searchPlaceholder="Buscar departamentos..."
            showRowNumber={true}
        />
    );
}
