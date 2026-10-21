'use client';
import { useSetting } from '@/hooks/use-setting';
import { removeSetting } from '@/lib/settings';

export type ColumnVisibility = {
  key: string;
  /** false = siempre visible, el usuario no la puede ocultar */
  hideable?: boolean;
  /** false = oculta hasta que el usuario la active */
  defaultVisible?: boolean;
};

/**
 * Columnas visibles de una tabla, guardadas en IndexedDB (table:<id>:columns).
 * ResponsiveTable y ColumnPicker usan el mismo id y se sincronizan solos.
 */
export function useTableColumns(tableId: string, columns: ColumnVisibility[]) {
  const key = `table:${tableId}:columns` as const;
  const [stored, setStored, loaded] = useSetting(key);
  const chosen = new Set(stored ?? columns.filter((c) => c.defaultVisible !== false).map((c) => c.key));
  const visible = columns.filter((c) => c.hideable === false || chosen.has(c.key)).map((c) => c.key);

  const toggle = (columnKey: string) =>
    setStored(visible.includes(columnKey) ? visible.filter((k) => k !== columnKey) : [...visible, columnKey]);
  // Al borrar la preferencia vuelven los valores por defecto (y se actualizan si cambian en el código)
  const reset = () => removeSetting(key);

  return { visible, toggle, reset, loaded };
}
