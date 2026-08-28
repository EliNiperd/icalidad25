'use client';

import { DataTable, type Column } from '@/app/ui/shared/data-table';
import { Normativa } from '@/lib/schemas/normativa';
import NormativaActions from '@/app/ui/normativas/normativa-actions';

interface NormativaTableWrapperProps {
    normativas: Normativa[];
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    defaultSortBy: string;
    defaultSortOrder: 'asc' | 'desc';
    searchPlaceholder?: string;
    showRowNumber?: boolean;
}

export default function NormativaTableWrapper({
    normativas,
    totalRecords,
    totalPages,
    pageSize,
    defaultSortBy,
    defaultSortOrder,
    searchPlaceholder,
    showRowNumber,
}: NormativaTableWrapperProps) {

    const columns: Column<Normativa>[] = [
        { key: 'ClaveNormativa', header: 'Clave', sortable: true },
        { key: 'NombreNormativa', header: 'Nombre', sortable: true },
        { key: 'IdEstatusNormativa', header: 'Estatus', sortable: true, renderType: 'Estatus' },
    ];

    return (
        <DataTable
            data={normativas}
            columns={columns}
            totalRecords={totalRecords}
            totalPages={totalPages}
            pageSize={pageSize}
            defaultSortBy={defaultSortBy}
            defaultSortOrder={defaultSortOrder}
            searchPlaceholder={searchPlaceholder}
            renderActions={(row) => <NormativaActions idNormativa={row.IdNormativa} />}
            showRowNumber={showRowNumber}
        />
    );
}