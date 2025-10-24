'use client';

import { DataTable, type Column } from '@/app/ui/shared/data-table';
import { Empleado } from '@/lib/schemas/empleado';
import EmpleadoActions from '@/app/ui/empleados/empleado-actions';

interface EmpleadoTableWrapperProps {
    empleados: Empleado[];
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    defaultSortBy: string;
    defaultSortOrder: 'asc' | 'desc';
    searchPlaceholder?: string;
    showRowNumber: boolean; // Nueva prop
}

export default function EmpleadoTableWrapper({ 
    empleados,
    totalRecords,
    totalPages,
    pageSize,
    defaultSortBy,
    defaultSortOrder,
    searchPlaceholder,
    showRowNumber, // Usar la nueva prop
 }: EmpleadoTableWrapperProps) {

    const columns: Column<Empleado>[] = [
        
        { key: 'NombreEmpleado', header: 'Nombre' },
        { key: 'UserName', header: 'Usuario' },
        { key: 'Correo', header: 'Correo' },
        { key: 'Estatus', header: 'Estatus', renderType: 'Estatus' },
    ];

    return (
        <DataTable
            data={empleados}
            columns={columns}
            totalRecords={totalRecords}
            totalPages={totalPages}
            pageSize={pageSize}
            defaultSortBy={defaultSortBy}
            defaultSortOrder={defaultSortOrder}
            searchPlaceholder={searchPlaceholder}
            showRowNumber={showRowNumber} // Pasar la prop a DataTable
            renderActions={(row: Empleado) => <EmpleadoActions idEmpleado={row.IdEmpleado} />}
            
        />
    );
}