'use client';

import { DataTable, type Column } from '@/app/ui/shared/data-table';
import { Empleado } from '@/lib/schemas/empleado';
import EmpleadoActions from '@/app/ui/empleados/empleado-actions';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        
        { key: 'NombreEmpleado', header: 'Nombre', sortable: true },
        { key: 'UserName', header: 'Usuario', sortable: true },
        { key: 'Correo', header: 'Correo', sortable: true },
        { key: 'Puestos', header: 'Puestos', renderType: undefined },
        //{ key: 'Roles', header: 'Roles', renderType: undefined },
        { key: 'IdEstatusEmpleado', header: 'Estatus', renderType: 'Estatus', sortable: true },
        
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
            renderCell={(row: Empleado, column: Column<Empleado>) => {
        if (column.key === 'Puestos') {
            //console.log('puestos:', row.IdEstatusEmpleado, 'Estatus:', row.Estatus);
          return <PuestosCell puestos={row.Puestos} />;
        }
        return undefined; // Deja que DataTable use su renderizado por defecto
      }}
      renderActions={(row: Empleado) => <EmpleadoActions idEmpleado={row.IdEmpleado} />}
            
        />
    );

    // Componente personalizado para renderizar puestos
function PuestosCell({ puestos }: { puestos: Empleado['Puestos'] }) {
  if (!puestos || puestos.length === 0) {
    return (
      <div className="flex items-center gap-2 text-text-secondary text-sm">
        <Briefcase className="w-4 h-4" />
        <span className="italic">Sin puestos asignados</span>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1.5 max-w-md">
        {puestos.slice(0, 3).map((puesto) => (
          <Tooltip key={puesto.IdPuesto}>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="px-2.5 py-1 text-xs bg-primary-100 text-primary-700 border border-primary-300 hover:bg-primary-200 cursor-help"
              >
                {puesto.NombrePuesto}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-bg-primary border-2 border-border-default">
              <div className="text-xs space-y-1">
                <p className="font-semibold">{puesto.NombrePuesto}</p>
                <p className="text-text-secondary">
                  Asignado: {formatDate(puesto.FechaAsignacion)}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        {puestos.length > 3 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="px-2.5 py-1 text-xs bg-bg-secondary border-border-default text-text-secondary hover:bg-bg-primary cursor-help"
              >
                +{puestos.length - 3} más
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-bg-primary border-2 border-border-default max-w-xs">
              <div className="text-xs space-y-1">
                <p className="font-semibold mb-2">Puestos adicionales:</p>
                {puestos.slice(3).map((puesto) => (
                  <p key={puesto.IdPuesto} className="text-text-secondary">
                    • {puesto.NombrePuesto}
                  </p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
}