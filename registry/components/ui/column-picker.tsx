'use client';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useTableColumns, type ColumnVisibility } from '@/hooks/use-table-columns';

type Props = {
  /** El mismo id que la ResponsiveTable que controla */
  tableId: string;
  /** Las mismas columnas de la tabla */
  columns: (ColumnVisibility & { label: string })[];
  label?: string;
  resetLabel?: string;
  className?: string;
};

/** Elige qué columnas ver; la elección se guarda en IndexedDB y la tabla se actualiza sola */
export default function ColumnPicker({ tableId, columns, label = 'Columnas', resetLabel = 'Restablecer', className = '' }: Props) {
  const { visible, toggle, reset } = useTableColumns(tableId, columns);
  const hideable = columns.filter((c) => c.hideable !== false);

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2" aria-label={label}>
        <AdjustmentsHorizontalIcon className="size-5" />
        <span className="hidden sm:inline">{label}</span>
      </div>
      <div tabIndex={0} className="dropdown-content z-50 mt-2 w-60 rounded-box border border-base-300 bg-base-100 p-3 shadow-lg">
        <fieldset className="fieldset gap-1">
          <legend className="fieldset-legend pt-0">{label}</legend>
          {hideable.map((column) => (
            <label key={column.key} className="label cursor-pointer gap-3 py-1 text-base-content">
              <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={visible.includes(column.key)} onChange={() => toggle(column.key)} />
              {column.label}
            </label>
          ))}
        </fieldset>
        <button type="button" className="btn btn-ghost btn-xs mt-2" onClick={reset}>
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
