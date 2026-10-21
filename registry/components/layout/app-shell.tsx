import type { ReactNode } from 'react';
import { DRAWER_ID, type NavItem } from '@/lib/navigation';
import ThemePicker from '@/components/ui/theme-picker';
import Sidebar from './sidebar';
import Topbar from './topbar';

type Props = {
  children: ReactNode;
  /** Botones a la derecha de la barra superior (por defecto el selector de tema) */
  actions?: ReactNode;
  /** Encabezado del sidebar (por defecto logo y nombre) */
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  sidebarTitle?: string;
  badges?: Record<string, number>;
  /** Por defecto NAV_ITEMS; si lo pasas, usa AppShell desde un componente cliente (los íconos no se serializan) */
  items?: NavItem[];
  openMenuLabel?: string;
  closeMenuLabel?: string;
};

/** Layout de dashboard: sidebar fijo en escritorio (lg) y drawer en móvil, con barra superior y migas */
export default function AppShell({
  children,
  actions = <ThemePicker />,
  sidebarHeader,
  sidebarFooter,
  sidebarTitle,
  badges,
  items,
  openMenuLabel = 'Abrir menú',
  closeMenuLabel = 'Cerrar menú',
}: Props) {
  return (
    <div className="drawer lg:drawer-open">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex min-h-svh flex-col bg-base-200">
        <Topbar actions={actions} items={items} openMenuLabel={openMenuLabel} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor={DRAWER_ID} aria-label={closeMenuLabel} className="drawer-overlay" />
        <Sidebar header={sidebarHeader} footer={sidebarFooter} title={sidebarTitle} badges={badges} items={items} />
      </div>
    </div>
  );
}
