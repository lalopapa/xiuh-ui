import Dexie, { type Table } from 'dexie';
import { APP_DB_NAME } from '@/config/app';

/**
 * Campos que toda entidad sincronizable debe tener.
 * - id: UUID generado en el cliente, así un registro creado offline conserva su id al subir al back.
 * - updatedAt: el back usa "el más reciente gana" al resolver conflictos.
 * - deletedAt: borrado lógico; se sube al back y después se puede purgar.
 * - syncedAt: última vez que el back confirmó este registro (vacío = nunca se ha subido).
 */
export interface SyncedEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  syncedAt?: number;
}

// Preferencias del usuario (ver lib/settings.ts)
export interface SettingRow {
  key: string;
  value: unknown;
}

// Entidad de ejemplo: cópiala para tus propias entidades
export interface Note extends SyncedEntity {
  title: string;
  content: string;
  starred?: boolean;
}

export class AppDatabase extends Dexie {
  settings!: Table<SettingRow, string>;
  notes!: Table<Note, string>;

  constructor() {
    super(APP_DB_NAME);
    // Para cambiar tablas o índices agrega this.version(2).stores({...}) debajo; nunca edites una versión ya publicada
    this.version(1).stores({
      settings: 'key',
      notes: 'id, title, starred, updatedAt, deletedAt',
    });
  }
}

export const db = new AppDatabase();

/** Completa una entidad nueva con id y fechas, lista para guardarse y sincronizarse */
export function newEntity<T extends object>(data: T): T & SyncedEntity {
  const now = Date.now();
  return { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
}
