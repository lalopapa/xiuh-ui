'use client';
import { useId, type ComponentType, type CSSProperties, type ReactNode, type SVGProps } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export type DropdownItem = {
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  /** Navega a esta ruta si no hay onClick */
  href?: string;
  /** Clases del botón (p. ej. text-error para eliminar) */
  className?: string;
  hidden?: boolean;
};

type Props = {
  items: DropdownItem[];
  label?: string;
  /** Ícono del botón (por defecto ⋮) */
  icon?: ReactNode;
  buttonClassName?: string;
  menuClassName?: string;
  className?: string;
};

/** Menú de acciones con popover + anchor positioning: no lo recorta el overflow de tarjetas ni tablas */
export default function DropdownButton({
  items,
  label = 'Acciones',
  icon,
  buttonClassName = 'btn btn-ghost btn-circle btn-sm',
  menuClassName = 'w-52',
  className = '',
}: Props) {
  const router = useRouter();
  // useId trae caracteres que no valen en ids de CSS
  const id = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const popoverId = `dropdown-${id}`;
  const anchorName = `--dropdown-${id}`;

  const select = (item: DropdownItem) => {
    document.getElementById(popoverId)?.hidePopover();
    if (item.onClick) item.onClick();
    else if (item.href) router.push(item.href);
  };

  return (
    <div className={className}>
      <button type="button" className={buttonClassName} popoverTarget={popoverId} aria-label={label} style={{ anchorName } as CSSProperties}>
        {icon ?? <EllipsisVerticalIcon className="size-5" />}
      </button>
      <ul
        popover="auto"
        id={popoverId}
        className={`dropdown dropdown-end menu rounded-box border border-base-300 bg-base-100 p-2 shadow-md ${menuClassName}`}
        style={{ positionAnchor: anchorName } as CSSProperties}
      >
        {items
          .filter((item) => !item.hidden)
          .map((item) => (
            <li key={item.label}>
              <button type="button" className={item.className} onClick={() => select(item)}>
                {item.icon && <item.icon className="size-4" />}
                {item.label}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
