"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Loader2,
} from "lucide-react";

// --- Interfaces y Tipos ---
export interface MultiSelectOption {
  id: number;
  label: string;
}

type DisplayMode = "badge" | "table" | "none";

interface ComboBoxMultiselectProps {
  options: MultiSelectOption[];
  selectedIds: number[];
  onChange: (newSelectedIds: number[]) => void;
  label: string;
  searchPlaceholder: string;
  Icon?: React.ElementType;
  displayMode?: DisplayMode;
  isLoading?: boolean; // 🔥 NUEVO: Prop para estado de carga
  loadingMessage?: string; // 🔥 NUEVO: Mensaje personalizado
}

// --- Componente Skeleton ---
const ComboBoxSkeleton = ({ 
  label, 
  displayMode, 
  loadingMessage 
}: { 
  label: string; 
  displayMode: DisplayMode;
  loadingMessage?: string;
}) => (
  <div className="space-y-3">
    {/* Skeleton del botón principal */}
    <Skeleton className="h-10 w-full rounded-md" />
    
    {/* Skeleton del área de items seleccionados */}
    {displayMode !== 'none' && (
      <div className="p-6 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-dashed border-light-border-default dark:border-dark-border-default">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 className="size-8 animate-spin text-primary-600" />
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {loadingMessage || `Cargando ${label.toLowerCase()}...`}
          </p>
          {/* Skeletons de items */}
          {displayMode === "badge" && (
            <div className="flex flex-wrap gap-2 w-full justify-center">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

// --- Componentes de Visualización ---

const BadgeDisplay = ({ selectedIds, getLabelById, removeSelection }: any) => (
  <div className="flex flex-wrap gap-2 p-4 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border-default dark:border-dark-border-default">
    {selectedIds.map((id: number) => (
      <Badge
        key={id}
        variant="secondary"
        className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 border border-primary-300 hover:bg-primary-200 transition-colors"
      >
        {getLabelById(id)}
        <button
          type="button"
          onClick={() => removeSelection(id)}
          className="ml-2 hover:text-error transition-colors"
        >
          <X className="size-3" />
        </button>
      </Badge>
    ))}
  </div>
);

const TableDisplay = ({ selectedIds, getLabelById, removeSelection }: any) => (
  <div className="mt-4">
    <ScrollArea className="h-[288px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-[50px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedIds.map((id: number) => (
            <TableRow key={id}>
              <TableCell>{getLabelById(id)}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSelection(id)}
                >
                  <X className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  </div>
);

const EmptyDisplay = ({ Icon, label }: any) => (
  <div className="p-6 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-dashed border-light-border-default dark:border-dark-border-default text-center">
    <Icon className="size-8 mx-auto mb-2 text-light-text-secondary dark:text-dark-text-secondary opacity-50" />
    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
      No hay {label} asignados.
    </p>
  </div>
);


// --- Componente Principal ---

export default function ComboBoxMultiselect({
  options,
  selectedIds,
  onChange,
  label,
  searchPlaceholder,
  Icon = Briefcase,
  displayMode = "badge",
  isLoading = false, // 🔥 NUEVO
  loadingMessage, // 🔥 NUEVO
}: ComboBoxMultiselectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const search = searchTerm.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(search));
  }, [options, searchTerm]);

  const toggleSelection = (id: number) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    onChange(newSelection);
  };

  const removeSelection = (id: number) => {
    const newSelection = selectedIds.filter((selectedId) => selectedId !== id);
    onChange(newSelection);
  };

  const getLabelById = (id: number) => {
    return options.find((opt) => opt.id === id)?.label || `ID #${id}`;
  };

  const renderSelectedItems = () => {
    if (selectedIds.length === 0) {
      return displayMode !== 'none' ? <EmptyDisplay Icon={Icon} label={label} /> : null;
    }

    switch (displayMode) {
      case "badge":
        return <BadgeDisplay selectedIds={selectedIds} getLabelById={getLabelById} removeSelection={removeSelection} />;
      case "table":
        return <TableDisplay selectedIds={selectedIds} getLabelById={getLabelById} removeSelection={removeSelection} />;
      case "none":
        return null;
      default:
        return null;
    }
  };

  // 🔥 NUEVO: Mostrar skeleton si está cargando
  if (isLoading) {
    return (
      <ComboBoxSkeleton 
        label={label} 
        displayMode={displayMode}
        loadingMessage={loadingMessage}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-default dark:border-dark-border-default hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            {selectedIds.length > 0
              ? `${selectedIds.length} ${label}(s) seleccionado(s)`
              : `Seleccionar ${label}...`}
          </span>
          {isOpen ? (
            <ChevronUp className="ml-2 size-4 shrink-0 opacity-50" />
          ) : (
            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </Button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-bg-primary dark:bg-dark-bg-primary border-2 border-light-border-default dark:border-dark-border-default rounded-lg shadow-lg">
            <div className="p-3 border-b border-light-border-default dark:border-dark-border-default">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-light-text-secondary dark:text-dark-text-secondary" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-default dark:border-dark-border-default text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleSelection(option.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-4 border-2 rounded transition-colors",
                        isSelected
                          ? "bg-primary-600 border-primary-600"
                          : "border-light-border-default dark:border-dark-border-default"
                      )}
                    >
                      {isSelected && <Check className="size-3 text-white" />}
                    </div>
                    <span className="flex-1">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-light-border-default dark:border-dark-border-default flex items-center justify-between gap-2">
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {selectedIds.length} de {options.length} seleccionados
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setIsOpen(false); setSearchTerm(""); }}
                className="bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-default dark:border-dark-border-default text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>

      {renderSelectedItems()}
    </div>
  );
}