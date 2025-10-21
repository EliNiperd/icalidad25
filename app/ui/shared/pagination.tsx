'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowBigRight, ArrowBigLeft } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}) => {
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-700">
        Mostrando {startRecord} - {endRecord} de {totalRecords} registros
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          
          <ArrowBigLeft className="w-5" />
          <span className="hidden md:block">Anterior</span>
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          <span className="hidden md:block">Siguiente</span>
          <ArrowBigRight className="w-5" />
        </Button>
      </div>
    </div>
  );
};
