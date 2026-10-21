'use client';
import { CheckIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { THEMES, type Theme } from '@/config/app';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label?: string;
  /** Nombre visible de cada tema (por defecto el id) */
  labels?: Partial<Record<Theme, string>>;
  /** Muestra el texto del botón también en móvil */
  showLabel?: boolean;
  className?: string;
};

/** Selector de tema con una muestra de los colores de cada uno */
export default function ThemePicker({ label = 'Tema', labels = {}, showLabel = false, className = '' }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2" aria-label={label}>
        <SwatchIcon className="size-5" />
        <span className={showLabel ? '' : 'hidden sm:inline'}>{label}</span>
      </div>
      <ul tabIndex={0} className="dropdown-content menu z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
        {THEMES.map((t) => (
          <li key={t}>
            <button type="button" onClick={() => setTheme(t)} className={t === theme ? 'menu-active' : ''}>
              {/* data-theme en el span: muestra los colores de ese tema aunque no sea el activo */}
              <span data-theme={t} className="grid shrink-0 grid-cols-2 gap-0.5 rounded-field border border-base-300 bg-base-100 p-1">
                <span className="size-2 rounded-full bg-base-content" />
                <span className="size-2 rounded-full bg-primary" />
                <span className="size-2 rounded-full bg-secondary" />
                <span className="size-2 rounded-full bg-accent" />
              </span>
              <span className="flex-1 text-start">{labels[t] ?? t}</span>
              {t === theme && <CheckIcon className="size-4" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
