"use client";
 
import { DataTable, type Column } from "@/app/ui/shared/data-table";
import { Proceso } from '@/lib/schemas/proceso';
import ProcesoActions from './proceso-actions';

interface ProcesoTableWrapperProps {
  procesos: Proceso[];
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  defaultSortBy: string;
  defaultSortOrder: 'asc' | 'desc';
  searchPlaceholder?: string;
  showRowNumber?: boolean;
}

export default function ProcesoTableWrapper({
    procesos,
    totalRecords,
    totalPages,
    pageSize,
    defaultSortBy,
    defaultSortOrder,
    searchPlaceholder,
    showRowNumber,
}: ProcesoTableWrapperProps) {

    // Definir las columnas para la tabla de Procesos
    const columns: Column<Proceso>[] = [
        { key: 'ClaveProceso', header: 'Clave', sortable: true },
        { key: 'NombreProceso', header: 'Nombre', sortable: true },
        { key: 'IdEstatusProceso', header: 'Estatus', sortable: true, renderType: 'Estatus' },
    ];

    return (
        <DataTable
            data={procesos}
            columns={columns}
            totalRecords={totalRecords}
            totalPages={totalPages}
            pageSize={pageSize}
            defaultSortBy={defaultSortBy}
            defaultSortOrder={defaultSortOrder}
            searchPlaceholder={searchPlaceholder}
            renderActions={(row) => <ProcesoActions idProceso={row.IdProceso} />}
            showRowNumber={showRowNumber}
        />
    );
}