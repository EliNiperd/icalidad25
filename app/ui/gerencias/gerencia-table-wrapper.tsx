'use client';

import { DataTable, type Column } from '@/app/ui/shared/data-table';
import { Gerencia } from '@/lib/schemas/gerencia';
import GerenciaActions from './gerencia-actions';

interface GerenciaTableWrapperProps {
  gerencias: Gerencia[];
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  defaultSortBy: string;
  defaultSortOrder: 'asc' | 'desc';
  searchPlaceholder?: string;
  showRowNumber?: boolean; // Nueva prop
}

export default function GerenciaTableWrapper({
  gerencias,
  totalRecords,
  totalPages,
  pageSize,
  defaultSortBy,
  defaultSortOrder,
  searchPlaceholder,
  showRowNumber, // Usar la nueva prop
}: GerenciaTableWrapperProps) {

  const columns: Column<Gerencia>[] = [
    { key: 'ClaveGerencia', header: 'Clave', sortable: true },
    { key: 'NombreGerencia', header: 'Nombre', sortable: true },
    { 
      key: 'IdEstatusGerencia', 
      header: 'Estatus', 
      sortable: true,
      renderType: 'Estatus',
    },
    
  ];

  return (
    <DataTable
      data={gerencias}
      columns={columns}
      totalRecords={totalRecords}
      totalPages={totalPages}
      pageSize={pageSize}
      defaultSortBy={defaultSortBy}
      defaultSortOrder={defaultSortOrder}
      searchPlaceholder={searchPlaceholder}
      renderActions={(row: Gerencia) => <GerenciaActions idGerencia={row.IdGerencia} />}
      showRowNumber={showRowNumber} // Pasar la prop a DataTable
    />
  );
}
