import { Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/outline';
import type { NavItem } from '@/lib/navigation';

// Fuente única del menú y de las migas: agrega aquí las secciones de tu app (la primera es el inicio)
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/', icon: HomeIcon },
  { label: 'Ajustes', href: '/ajustes', icon: Cog6ToothIcon, section: 'footer' },
];
