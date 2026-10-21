import type { ReactNode } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@/config/app';
import { DRAWER_ID, type NavItem } from '@/lib/navigation';
import ThemePicker from '@/components/ui/theme-picker';
import Brand from './brand';
import NavMenu from './nav-menu';

type Props = {
  children: ReactNode;
  title?: ReactNode;
  /** Botones a la derecha de la barra (por defecto el selector de tema) */
  actions?: ReactNode;
  /** Encabezado del drawer (por defecto logo y nombre) */
  brand?: ReactNode;
  /** Contenido extra al fondo del drawer */
  drawerFooter?: ReactNode;
  badges?: Record<string, number>;
  items?: NavItem[];
  openMenuLabel?: string;
  closeMenuLabel?: string;
};

/** Layout de app tipo PWA: barra superior con menú hamburguesa y drawer lateral en todos los tamaños */
export default function MobileShell({
  children,
  title = APP_NAME,
  actions = <ThemePicker />,
  brand = <Brand />,
  drawerFooter,
  badges,
  items,
  openMenuLabel = 'Abrir menú',
  closeMenuLabel = 'Cerrar menú',
}: Props) {
  return (
    <div className="drawer">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex h-svh flex-col">
        <header className="navbar sticky top-0 z-30 min-h-14 gap-2 bg-base-200 px-2 pt-[env(safe-area-inset-top)]">
          <label htmlFor={DRAWER_ID} aria-label={openMenuLabel} className="btn btn-square btn-ghost">
            <Bars3Icon className="size-6" />
          </label>
          <div className="flex-1 truncate text-lg font-bold">{title}</div>
          <div className="flex items-center gap-1">{actions}</div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor={DRAWER_ID} aria-label={closeMenuLabel} className="drawer-overlay" />
        <aside className="flex min-h-full w-72 flex-col bg-base-200 p-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <div className="px-2 pb-4">{brand}</div>
          <NavMenu items={items} badges={badges} className="p-0" />
          <div className="mt-auto">
            <NavMenu section="footer" items={items} badges={badges} className="p-0" />
            {drawerFooter}
          </div>
        </aside>
      </div>
    </div>
  );
}
