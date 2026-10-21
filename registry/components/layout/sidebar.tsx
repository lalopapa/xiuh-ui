import type { ReactNode } from 'react';
import type { NavItem } from '@/lib/navigation';
import Brand from './brand';
import NavMenu from './nav-menu';

type Props = {
  /** Encabezado (por defecto logo y nombre; p. ej. un selector de organización) */
  header?: ReactNode;
  /** Debajo de las entradas 'footer' (p. ej. el usuario) */
  footer?: ReactNode;
  title?: string;
  badges?: Record<string, number>;
  items?: NavItem[];
};

export default function Sidebar({ header = <Brand />, footer, title, badges, items }: Props) {
  return (
    <aside className="flex min-h-full w-[260px] flex-col border-r border-base-300 bg-base-100">
      <div className="border-b border-base-300 p-4">{header}</div>
      <NavMenu title={title} items={items} badges={badges} className="flex-1 px-4 py-4" />
      <div className="border-t border-base-300 p-4">
        <NavMenu section="footer" items={items} badges={badges} className="p-0" />
        {footer}
      </div>
    </aside>
  );
}
