'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/config/navigation';
import { closeDrawer, findNavItem, type NavItem } from '@/lib/navigation';

type Props = {
  section?: NonNullable<NavItem['section']>;
  /** Contador junto a la etiqueta, por href (p. ej. { '/pedidos': 3 }) */
  badges?: Record<string, number>;
  title?: string;
  /** Por defecto NAV_ITEMS de config/navigation.ts */
  items?: NavItem[];
  className?: string;
};

/** Entradas del menú como `menu` de daisy: resalta la activa y al navegar cierra el drawer en móvil */
export default function NavMenu({ section = 'main', badges = {}, title, items = NAV_ITEMS, className = '' }: Props) {
  const pathname = usePathname();
  const active = findNavItem(pathname, items);
  const visible = items.filter((item) => (item.section ?? 'main') === section);
  if (!visible.length) return null;

  return (
    <ul className={`menu w-full gap-1 ${className}`}>
      {title && <li className="menu-title text-xs uppercase tracking-wider">{title}</li>}
      {visible.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={() => closeDrawer()}
            aria-current={item === active ? 'page' : undefined}
            className={`gap-3 rounded-field py-2.5 font-medium ${item === active ? 'menu-active' : 'text-base-content/70'}`}
          >
            <item.icon className="size-5" />
            <span className="flex-1">{item.label}</span>
            {!!badges[item.href] && <span className="badge badge-error badge-sm">{badges[item.href]}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
