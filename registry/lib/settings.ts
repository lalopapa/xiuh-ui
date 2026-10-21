import { APP_STORAGE_PREFIX, type Theme } from '@/config/app';
import { db } from '@/lib/db';

/** Preferencias del usuario y su tipo. Agrega aquí las de tu app. */
export interface Settings {
  theme: Theme;
  language: string;
  sound: boolean;
  show_pwa_install: boolean;
  // Columnas visibles de cada responsive-table, por id de tabla
  [key: `table:${string}:columns`]: string[];
}
export type SettingKey = keyof Settings & string;

const storageKey = (key: string) => `${APP_STORAGE_PREFIX}${key}`;

function readLocal(key: string): unknown {
  try {
    const raw = localStorage.getItem(storageKey(key));
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/** Lee una preferencia. Si IndexedDB no está disponible (modo privado, navegador viejo) usa localStorage. */
export async function getSetting<K extends SettingKey>(key: K): Promise<Settings[K] | undefined>;
export async function getSetting<K extends SettingKey>(key: K, fallback: Settings[K]): Promise<Settings[K]>;
export async function getSetting(key: SettingKey, fallback?: unknown) {
  try {
    const row = await db.settings.get(key);
    if (row) return row.value;
  } catch (error) {
    console.warn('IndexedDB no disponible, se lee de localStorage:', error);
  }
  return readLocal(key) ?? fallback;
}

export async function setSetting<K extends SettingKey>(key: K, value: Settings[K]): Promise<void> {
  try {
    await db.settings.put({ key, value });
  } catch (error) {
    console.warn('IndexedDB no disponible, se guarda en localStorage:', error);
    try {
      localStorage.setItem(storageKey(key), JSON.stringify(value));
    } catch {}
  }
}

export async function removeSetting(key: SettingKey): Promise<void> {
  try {
    await db.settings.delete(key);
  } catch {}
  try {
    localStorage.removeItem(storageKey(key));
  } catch {}
}
