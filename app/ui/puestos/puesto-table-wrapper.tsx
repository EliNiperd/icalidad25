'use client';

import { DataTable, type Column } from '@/app/ui/shared/data-table';
import { Puesto } from '@/lib/schemas/puesto';
import PuestoActions from '@/app/ui/puestos/puesto-actions';

interface PuestoTableWrapperProps {
  puestos: Puesto[];
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  defaultSortBy: string;
  defaultSortOrder: 'asc' | 'desc';
  searchPlaceholder?: string;
  showRowNumber?: boolean; // Nueva prop
}

export default function PuestoTableWrapper({
  puestos,
  totalRecords,
  totalPages,
  pageSize,
  defaultSortBy,
  defaultSortOrder,
  searchPlaceholder,
  showRowNumber, // Usar la nueva prop
}: PuestoTableWrapperProps) {

  const columns: Column<Puesto>[] = [
    { key: 'NombrePuesto', header: 'Nombre', sortable: true },
    { key: 'NombreDepartamento', header: 'Departamento', sortable: true },
    { 
      key: 'IdEstatusPuesto', 
      header: 'Estatus', 
      sortable: true,
      renderType: 'Estatus',
    },
    
  ];

  return (
    <DataTable
      data={puestos}
      columns={columns}
      totalRecords={totalRecords}
      totalPages={totalPages}
      pageSize={pageSize}
      defaultSortBy={defaultSortBy}
      defaultSortOrder={defaultSortOrder}
      searchPlaceholder={searchPlaceholder}
      renderActions={(row: Puesto) => <PuestoActions idPuesto={row.IdPuesto} />}
      showRowNumber={showRowNumber} // Pasar la prop a DataTable
    />
  );
}
