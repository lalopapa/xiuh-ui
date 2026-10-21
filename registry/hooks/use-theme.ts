'use client';
import { useCallback, useEffect } from 'react';
import type { Theme } from '@/config/app';
import { useSetting } from '@/hooks/use-setting';
import { applyTheme, getDeviceTheme, isTheme } from '@/lib/theme';

/**
 * Tema elegido por el usuario (guardado en IndexedDB). Sin preferencia guardada sigue al sistema.
 * `theme` es undefined mientras carga.
 */
export function useTheme() {
  const [stored, setStored, loaded] = useSetting('theme');
  const saved = isTheme(stored) ? stored : undefined;

  // Si la cookie se perdió pero IndexedDB conserva la preferencia, se vuelve a aplicar
  useEffect(() => {
    if (saved && document.documentElement.getAttribute('data-theme') !== saved) applyTheme(saved);
  }, [saved]);

  const setTheme = useCallback(
    async (next: Theme) => {
      applyTheme(next);
      await setStored(next);
    },
    [setStored],
  );

  return { theme: saved ?? (loaded ? getDeviceTheme() : undefined), setTheme, loaded };
}
