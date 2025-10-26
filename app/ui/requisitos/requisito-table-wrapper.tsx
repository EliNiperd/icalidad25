"use client";

import { DataTable, type Column } from "@/app/ui/shared/data-table";
import { Requisito } from "@/lib/schemas/requisito";
import RequisitoActions from "@/app/ui/requisitos/requisito-actions"

interface RequisitoTableWrapperProps {
  requisitos: Requisito[];
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  defaultSortBy: string;
  defaultSortOrder: "asc" | "desc";
  searchPlaceholder?: string;
  showRowNumber?: boolean;
  colorHeader?: string;
}

export default function RequisitoTableWrapper({
  requisitos,
  totalRecords,
  totalPages,
  pageSize,
  defaultSortBy,
  defaultSortOrder,
  searchPlaceholder,
  showRowNumber,
  colorHeader,
}: RequisitoTableWrapperProps) {
  
  // Definir las columnas para la tabla de requisitos
  const columns: Column<Requisito>[] = [
    { key: "ClaveRequisito", header: "Clave", sortable: true },
    { key: "NombreRequisito", header: "Nombre", sortable: true },
    { key: "NombreNormativa", header: "Normativa", sortable: true }, // Asumiendo que el SP devuelve este campo
    {
      key: "IdEstatusRequisito",
      header: "Estatus",
      sortable: true,
      renderType: "Estatus",
    }, // Reutilizando el renderType
  ];

  return (
          <DataTable
              data={requisitos}
              columns={columns}
              totalRecords={totalRecords}
              totalPages={totalPages}
              pageSize={pageSize}
              defaultSortBy={defaultSortBy}
              defaultSortOrder={defaultSortOrder}
              searchPlaceholder={searchPlaceholder}
              renderActions={(row) => <RequisitoActions idRequisito={row.IdRequisito} />}
              showRowNumber={showRowNumber}
              colorHeader="bg-secondary-300"
          />
      );
}
