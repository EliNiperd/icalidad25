'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { PaginationControls } from './pagination';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  renderType?: 'estatusGerencia'; // Nuevo: para renderizado personalizado
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
  renderActions?: (row: T) => React.ReactNode; // Nueva prop para renderizar acciones
  rowNumber?: boolean; // Nuevo: para mostrar el número de fila
}

export function DataTable<T extends { [key: string]: any }> ({
  data,
  columns,
  totalRecords,
  totalPages,
  pageSize,
  defaultSortBy,
  defaultSortOrder,
  searchPlaceholder = "Buscar...",
  onRowClick,
  renderActions, // Usar la nueva prop
}: DataTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || defaultSortOrder);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', currentPage.toString());
    params.set('query', searchTerm);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    router.push(`?${params.toString()}`);
  }, [searchTerm, currentPage, sortBy, sortOrder, router, searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on new search
  };

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset page on sort change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Función para renderizar celdas personalizadas
  const renderCell = (row: T, column: Column<T>) => {
    if (column.renderType === 'estatusGerencia') {
      const isActivo = (row as any)[column.key]; // Asumiendo que column.key es IdEstatusGerencia (boolean)
      const estatusText = isActivo ? 'Activo' : 'Inactivo';
      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {estatusText}
        </span>
      );
    }
    // Renderizado por defecto
    return (row as any)[column.key];
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        {/* Eliminamos el botón onCreateClick de aquí */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="divide-x divide-gray-200  ">
              {columns.map((column) => (
                
                <th
                  key={String(column.key)}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer  "
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  {column.header}
                  {column.sortable && sortBy === column.key && (
                    <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
              {renderActions && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className={onRowClick ? "cursor-pointer hover:bg-gray-300" : " hover:bg-gray-100"} onClick={() => onRowClick && onRowClick(row)}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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


