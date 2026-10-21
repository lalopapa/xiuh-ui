import type { ReactNode } from 'react';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

type Props = {
  name: string;
  /** Debajo del nombre (p. ej. el rol como badge) */
  detail?: ReactNode;
  /** Entradas extra del menú, cada una en su <li> */
  children?: ReactNode;
  /** Ruta de cierre de sesión; sin ella no se muestra la opción */
  logoutHref?: string;
  logoutLabel?: string;
  label?: string;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

/** Avatar con iniciales y menú desplegable de la cuenta */
export default function UserMenu({ name, detail, children, logoutHref, logoutLabel = 'Cerrar sesión', label = 'Menú de usuario' }: Props) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="avatar avatar-placeholder cursor-pointer" aria-label={label}>
        <div className="w-8 rounded-full bg-primary text-primary-content">
          <span className="text-xs font-bold">{initials(name)}</span>
        </div>
      </div>
      <ul tabIndex={0} className="menu dropdown-content z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-md">
        <li className="menu-title flex flex-col items-start gap-1">
          <span className="text-sm font-semibold text-base-content">{name}</span>
          {detail}
        </li>
        {children}
        {logoutHref && (
          <li>
            {/* Navegación completa (no Link) para que el server limpie la sesión */}
            <a href={logoutHref}>
              <ArrowRightStartOnRectangleIcon className="size-4" />
              {logoutLabel}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
