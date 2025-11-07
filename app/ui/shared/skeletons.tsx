'use client';

import React from 'react';

const SkeletonPiece = () => <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>;

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  showSearch?: boolean;
  showPagination?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  cols = 3,
  showSearch = true,
  showPagination = true,
}) => {
  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      {showSearch && (
        <div className="flex justify-between items-center">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700">
            {/* Encabezado */}
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                {Array.from({ length: cols }).map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Cuerpo */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: rows }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: cols }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <SkeletonPiece />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {showPagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
        </div>
      )}
    </div>
  );
};
