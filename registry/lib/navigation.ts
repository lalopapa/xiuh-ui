import type { ComponentType, SVGProps } from 'react';

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** 'main' (por defecto) va arriba; 'footer', al fondo del menú */
  section?: 'main' | 'footer';
  /** Otras rutas que marcan esta entrada como activa (`:param` acepta cualquier segmento) */
  alsoMatches?: string[];
};

// id del checkbox que abre y cierra el drawer
export const DRAWER_ID = 'app-drawer';

export function closeDrawer(id = DRAWER_ID) {
  const toggle = document.getElementById(id) as HTMLInputElement | null;
  if (toggle) toggle.checked = false;
}

const matches = (pattern: string, pathname: string) =>
  pattern === '/' ? pathname === '/' : new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}(/.*)?$`).test(pathname);

/** Entrada activa para la ruta actual: gana la coincidencia más larga ('/' solo coincide con '/') */
export function findNavItem(pathname: string, items: NavItem[]): NavItem | undefined {
  let best: NavItem | undefined;
  let bestLength = -1;
  for (const item of items) {
    for (const pattern of [item.href, ...(item.alsoMatches ?? [])]) {
      if (pattern.length > bestLength && matches(pattern, pathname)) {
        best = item;
        bestLength = pattern.length;
      }
    }
  }
  return best;
}
