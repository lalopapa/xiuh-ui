'use client';
import { useState, type ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTableColumns } from '@/hooks/use-table-columns';

type SortValue = string | number | boolean | Date | null | undefined;

export type Column<T> = {
  key: string;
  label: string;
  /** Contenido de la celda; por defecto row[key] */
  render?: (row: T) => ReactNode;
  /** true ordena por row[key]; una función ordena por lo que devuelva */
  sortable?: boolean | ((row: T) => SortValue);
  /**
   * En móvil (tarjetas): 'title' encabeza la tarjeta, 'always' siempre se ve,
   * 'expand' (por defecto) aparece con "Ver más", 'hidden' nunca se ve.
   */
  mobile?: 'title' | 'always' | 'expand' | 'hidden';
  /** false = el usuario no la puede ocultar con ColumnPicker */
  hideable?: boolean;
  /** false = oculta hasta que el usuario la active */
  defaultVisible?: boolean;
  className?: string;
};

type Props<T> = {
  /** Identifica la tabla para guardar sus columnas visibles (mismo id en ColumnPicker) */
  id: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Acciones por fila (p. ej. un DropdownButton): última columna en escritorio, esquina de la tarjeta en móvil */
  actions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: ReactNode;
  actionsLabel?: string;
  showMoreLabel?: string;
  showLessLabel?: string;
  zebra?: boolean;
  className?: string;
};

type Sort = { key: string; dir: 'asc' | 'desc' };

const valueOf = <T,>(row: T, column: Column<T>): SortValue =>
  typeof column.sortable === 'function' ? column.sortable(row) : ((row as Record<string, unknown>)[column.key] as SortValue);

function compare(a: SortValue, b: SortValue) {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function sortRows<T>(rows: T[], column: Column<T> | undefined, dir: Sort['dir']) {
  if (!column) return rows;
  return [...rows].sort((rowA, rowB) => {
    const a = valueOf(rowA, column);
    const b = valueOf(rowB, column);
    // Los vacíos siempre al final, sin importar la dirección
    if (a == null || a === '') return b == null || b === '' ? 0 : 1;
    if (b == null || b === '') return -1;
    return dir === 'asc' ? compare(a, b) : compare(b, a);
  });
}

// En móvil cada fila es una tarjeta y cada celda una línea "etiqueta: valor" (la etiqueta sale de data-label).
// max-md:text-start anula alineaciones de escritorio (p. ej. text-end en montos) que moverían también la etiqueta
const MOBILE_CELL =
  'max-md:grid max-md:grid-cols-[minmax(6rem,40%)_1fr] max-md:items-center max-md:text-start max-md:gap-2 max-md:border-0 max-md:px-0 max-md:py-1 max-md:before:text-sm max-md:before:text-base-content/60 max-md:before:content-[attr(data-label)]';
const MOBILE_TITLE_CELL = 'max-md:block max-md:border-0 max-md:px-0 max-md:pt-0 max-md:pb-1 max-md:pr-10 max-md:text-base max-md:font-semibold';

/** Tabla en escritorio y tarjetas en móvil, con orden por columna y columnas visibles guardadas */
export default function ResponsiveTable<T>({
  id,
  columns,
  rows,
  rowKey,
  actions,
  onRowClick,
  loading = false,
  emptyMessage = 'No hay registros',
  actionsLabel = 'Acciones',
  showMoreLabel = 'Ver más',
  showLessLabel = 'Ver menos',
  zebra = false,
  className = '',
}: Props<T>) {
  const { visible } = useTableColumns(id, columns);
  const [sort, setSort] = useState<Sort | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const shown = columns.filter((c) => visible.includes(c.key));
  const sortColumn = sort ? shown.find((c) => c.key === sort.key && c.sortable) : undefined;
  const sorted = sortRows(rows, sortColumn, sort?.dir ?? 'asc');
  const hasExpandable = shown.some((c) => (c.mobile ?? 'expand') === 'expand');
  const colSpan = shown.length + (actions ? 1 : 0);

  // asc → desc → sin orden
  const toggleSort = (key: string) =>
    setSort((prev) => (prev?.key !== key ? { key, dir: 'asc' } : prev.dir === 'asc' ? { key, dir: 'desc' } : null));

  const toggleExpanded = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const message = (content: ReactNode) => (
    <tr className="max-md:block max-md:rounded-box max-md:border max-md:border-base-300 max-md:bg-base-100">
      <td colSpan={colSpan} className="py-8 text-center text-base-content/60 max-md:block">
        {content}
      </td>
    </tr>
  );

  return (
    <div className={`md:overflow-x-auto md:rounded-box md:border md:border-base-300 md:bg-base-100 ${className}`}>
      <table className={`table max-md:block ${zebra ? 'md:table-zebra' : ''}`}>
        <thead className="max-md:hidden">
          <tr>
            {shown.map((column) => {
              const dir = sort?.key === column.key ? sort.dir : undefined;
              const Icon = dir === 'asc' ? ChevronUpIcon : dir === 'desc' ? ChevronDownIcon : ChevronUpDownIcon;
              return (
                <th key={column.key} className={column.className} aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}>
                  {column.sortable ? (
                    <button type="button" className="flex items-center gap-1 hover:text-base-content" onClick={() => toggleSort(column.key)}>
                      {column.label}
                      <Icon className={`size-3.5 ${dir ? '' : 'opacity-40'}`} />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
            {actions && <th className="w-0 text-end">{actionsLabel}</th>}
          </tr>
        </thead>
        <tbody className="max-md:flex max-md:flex-col max-md:gap-3">
          {loading
            ? message(<span className="loading loading-spinner loading-md" />)
            : !sorted.length
              ? message(emptyMessage)
              : sorted.map((row) => {
                  const key = rowKey(row);
                  const isExpanded = expanded.has(key);
                  return (
                    <tr
                      key={key}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      className={`max-md:relative max-md:block max-md:rounded-box max-md:border max-md:border-base-300 max-md:bg-base-100 max-md:p-3 ${onRowClick ? 'cursor-pointer md:hover:bg-base-200' : ''}`}
                    >
                      {shown.map((column) => {
                        const mode = column.mobile ?? 'expand';
                        const mobileClass =
                          mode === 'title'
                            ? MOBILE_TITLE_CELL
                            : mode === 'hidden' || (mode === 'expand' && !isExpanded)
                              ? 'max-md:hidden'
                              : MOBILE_CELL;
                        return (
                          <td key={column.key} data-label={column.label} className={`${mobileClass} ${column.className ?? ''}`}>
                            {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                          </td>
                        );
                      })}
                      {actions && (
                        // stopPropagation: abrir el menú de acciones no dispara onRowClick
                        <td className="w-0 whitespace-nowrap text-end max-md:absolute max-md:top-2 max-md:right-2 max-md:w-auto max-md:border-0 max-md:p-0" onClick={(e) => e.stopPropagation()}>
                          {actions(row)}
                        </td>
                      )}
                      {hasExpandable && (
                        <td className="md:hidden max-md:block max-md:border-0 max-md:px-0 max-md:pt-2 max-md:pb-0">
                          <button
                            type="button"
                            className="link link-primary text-sm no-underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(key);
                            }}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? showLessLabel : showMoreLabel}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
        </tbody>
      </table>
    </div>
  );
}
