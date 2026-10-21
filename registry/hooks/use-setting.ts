'use client';
import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { setSetting, type SettingKey, type Settings } from '@/lib/settings';

type Setter<K extends SettingKey> = (value: Settings[K]) => Promise<void>;

/**
 * Preferencia reactiva: se actualiza sola cuando cambia en cualquier componente o pestaña.
 * El tercer valor (`loaded`) es false mientras se lee IndexedDB.
 */
export function useSetting<K extends SettingKey>(key: K): readonly [Settings[K] | undefined, Setter<K>, boolean];
export function useSetting<K extends SettingKey>(key: K, fallback: Settings[K]): readonly [Settings[K], Setter<K>, boolean];
export function useSetting<K extends SettingKey>(key: K, fallback?: Settings[K]) {
  // null = todavía cargando; undefined = no hay nada guardado
  const row = useLiveQuery(() => db.settings.get(key), [key], null);
  const value = row ? (row.value as Settings[K]) : fallback;
  const set = useCallback<Setter<K>>((next) => setSetting(key, next), [key]);
  return [value, set, row !== null] as const;
}
