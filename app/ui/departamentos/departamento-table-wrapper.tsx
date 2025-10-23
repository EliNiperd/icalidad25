'use client';

import { DataTable, type Column } from '@/app/ui/shared/data-table';
import { Departamento } from '@/lib/schemas/departamento';
import DepartamentoActions from '@/app/ui/departamentos/departamento-actions';

interface DepartamentoTableWrapperProps {
    departamentos: Departamento[];
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    defaultSortBy: string;
    defaultSortOrder: 'asc' | 'desc';
    searchPlaceholder?: string;
    showRowNumber?: boolean;
}

export default function DepartamentoTableWrapper({
    departamentos,
    totalRecords,
    totalPages,
    pageSize,
    defaultSortBy,
    defaultSortOrder,
    searchPlaceholder,
    showRowNumber,
}: DepartamentoTableWrapperProps) {
    
    const columns: Column<Departamento>[] = [
        { key: 'IdDepartamento', header: 'ID', sortable: true },
        { key: 'ClaveDepartamento', header: 'Clave', sortable: true },
        { key: 'NombreDepartamento', header: 'Nombre', sortable: true },
        { key: 'IdGerencia', header: 'Gerencia', sortable: true },
        { key: 'IdEstatusDepartamento', header: 'Estatus', sortable: true, renderType: 'estatusGerencia' },
    ];

    return (
        <DataTable
            data={departamentos}
            columns={columns}
            totalRecords={totalRecords}
            totalPages={totalPages}
            pageSize={pageSize}
            defaultSortBy={defaultSortBy}
            defaultSortOrder={defaultSortOrder}
            searchPlaceholder={searchPlaceholder}
            renderActions={(row) => <DepartamentoActions idDepartamento={row.IdDepartamento} />}
            showRowNumber={showRowNumber}
        />
    );
}