'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { NAV_ITEMS } from '@/config/navigation';
import { DRAWER_ID, findNavItem, type NavItem } from '@/lib/navigation';

type Props = {
  /** Botones a la derecha (búsqueda, avisos, usuario…) */
  actions?: ReactNode;
  items?: NavItem[];
  openMenuLabel?: string;
};

/** Barra superior del dashboard: botón de menú en móvil y migas Inicio › sección actual */
export default function Topbar({ actions, items = NAV_ITEMS, openMenuLabel = 'Abrir menú' }: Props) {
  const pathname = usePathname();
  const home = items[0];
  const current = findNavItem(pathname, items);

  return (
    <header className="navbar sticky top-0 z-30 gap-2 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur sm:px-6">
      <div className="flex flex-1 items-center gap-2">
        <label htmlFor={DRAWER_ID} aria-label={openMenuLabel} className="btn btn-ghost btn-square btn-sm lg:hidden">
          <Bars3Icon className="size-5" />
        </label>
        {home && (
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href={home.href} className="text-base-content/70">
                  {home.label}
                </Link>
              </li>
              {current && current !== home && (
                <li>
                  <span className="font-semibold">{current.label}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">{actions}</div>
    </header>
  );
}
