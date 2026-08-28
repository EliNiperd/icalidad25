'use client';

import React, { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { PaginationControls } from './pagination';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  renderType?: 'Estatus';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  defaultSortBy: string;
  defaultSortOrder: 'asc' | 'desc';
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  renderActions?: (row: T) => React.ReactNode;
  renderCell?: (row: T, column: Column<T>) => React.ReactNode;
  showRowNumber?: boolean;
  colorHeader?: string;
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  totalRecords,
  totalPages,
  pageSize,
  defaultSortBy,
  defaultSortOrder,
  searchPlaceholder = 'Buscar...',
  onRowClick,
  renderActions,
  renderCell,
  showRowNumber,
  colorHeader,
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  
  const headerStyles = colorHeader ? colorHeader : 'bg-secondary-300';

  // Get current values from URL search params
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchTerm = searchParams.get('query') || '';
  const sortBy = searchParams.get('sortBy') || defaultSortBy;
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || defaultSortOrder;

  const handleUrlChange = (newParams: Partial<{ query: string; page: number; sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUrlChange({ query: e.target.value, page: 1 });
  };

  const handleSort = (columnKey: string) => {
    const newSortOrder = sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc';
    handleUrlChange({ sortBy: columnKey, sortOrder: newSortOrder, page: 1 });
  };

  const handlePageChange = (page: number) => {
    handleUrlChange({ page });
  };


   const renderCellContent = (row: T, column: Column<T>) => {
    // Primero intentar con el renderizado personalizado
    if (renderCell) {
      const customRender = renderCell(row, column);
      if (customRender !== undefined) {
        return customRender;
      }
    }

    // Luego usar los renderTypes predefinidos
    if (column.renderType === 'Estatus') {
      const isActivo = Boolean((row as any)[column.key]);
      return (
        <span
          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
            isActivo
              ? 'bg-success/20 text-success border border-success/30'
              : 'bg-error/20 text-error border border-error/30'
          }`}
        >
          {isActivo ? 'Activo' : 'Inactivo'}
        </span>
      );
    }

    // Por defecto, mostrar el valor directo
    return (row as any)[column.key];
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          defaultValue={searchTerm}
          onChange={handleSearch}
          className="max-w-sm bg-bg-primary border-border-default"
        />
      </div>

      {/* Tabla con mejor contraste */}
      <div className="rounded-lg border-2 border-border-default bg-bg-primary shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-border-default">
            {/* Encabezado con fondo distintivo */}
            <thead className={headerStyles}>
              <tr>
                {showRowNumber && (
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">
                    #
                  </th>
                )}
                {columns.map(column => (
                  <th
                    key={String(column.key)}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                    className={`px-6 py-4 text-left text-sm font-bold text-white ${
                      column.sortable
                        ? 'cursor-pointer hover:bg-secondary-500 transition-colors select-none'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && sortBy === column.key && (
                        <span className="text-white">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {renderActions && (
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>

            {/* Cuerpo de la tabla */}
            <tbody 
              className={`divide-y divide-border-default bg-bg-secondary transition-opacity ${
                isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'
              }`}>

              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (renderActions ? 1 : 0) +
                      (showRowNumber ? 1 : 0)
                    }
                    className="p-24 text-center text-text-secondary"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <span className="font-medium">No se encontraron registros</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-all duration-150 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:shadow-sm ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {showRowNumber && (
                      <td className="px-6 py-3 text-sm font-medium text-text-secondary whitespace-nowrap">
                        {(currentPage - 1) * pageSize + rowIndex + 1}
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-3 text-sm text-text-primary"
                      >
                        {renderCellContent(row, column)}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-6 py-3 text-right text-sm font-medium">
                        {renderActions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />
    </div>
  );
}