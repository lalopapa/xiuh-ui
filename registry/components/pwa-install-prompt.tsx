'use client';
import { useState } from 'react';
import { ArrowDownTrayIcon, ArrowUpOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePWA } from '@/hooks/use-pwa';
import { useSetting } from '@/hooks/use-setting';

type Props = {
  title?: string;
  description?: string;
  installLabel?: string;
  /** Instrucciones para iPhone/iPad, donde no hay botón de instalar */
  iosInstructions?: string;
  dontShowLabel?: string;
  closeLabel?: string;
};

/** Invita a instalar la app. "No volver a mostrar" se guarda en IndexedDB (show_pwa_install). */
export default function PWAInstallPrompt({
  title = 'Instala la app',
  description = 'Ábrela desde tu pantalla de inicio y úsala sin conexión.',
  installLabel = 'Instalar',
  iosInstructions = 'Toca Compartir y luego "Agregar a inicio".',
  dontShowLabel = 'No volver a mostrar',
  closeLabel = 'Cerrar',
}: Props) {
  const { isInstallable, isInstalled, isIOS, install } = usePWA();
  const [show, setShow, loaded] = useSetting('show_pwa_install', true);
  const [closed, setClosed] = useState(false);

  const visible = loaded && show && !closed && !isInstalled && (isInstallable || isIOS);
  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 md:left-auto md:w-96">
      <div role="alert" className="alert items-start border border-base-300 bg-base-100 shadow-lg">
        <ArrowDownTrayIcon className="size-6 shrink-0 text-primary" />
        <div className="flex flex-1 flex-col gap-2">
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-base-content/70">{description}</p>
          </div>
          {isInstallable ? (
            <button type="button" className="btn btn-primary btn-sm self-start" onClick={install}>
              {installLabel}
            </button>
          ) : (
            <p className="flex items-center gap-1 text-sm">
              <ArrowUpOnSquareIcon className="size-5 shrink-0" />
              {iosInstructions}
            </p>
          )}
          <button type="button" className="link link-hover self-start text-xs text-base-content/60" onClick={() => setShow(false)}>
            {dontShowLabel}
          </button>
        </div>
        <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={() => setClosed(true)} aria-label={closeLabel}>
          <XMarkIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
