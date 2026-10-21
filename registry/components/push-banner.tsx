'use client';
import { useState } from 'react';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import { dismissPushBanner, enablePush, usePush } from '@/lib/push';

type Props = {
  invite?: string;
  blocked?: string;
  needsInstall?: string;
  enableLabel?: string;
  notNowLabel?: string;
  gotItLabel?: string;
  /** Después de activarlos (p. ej. para mostrar un toast) */
  onEnabled?: () => void;
  className?: string;
};

/** Invita a activar los avisos mientras este navegador no los tenga; se oculta al activarlos o al cerrarla */
export default function PushBanner({
  invite = 'Activa los avisos para enterarte aunque tengas la app cerrada.',
  blocked = 'Los avisos están bloqueados. Puedes permitirlos desde la configuración del navegador.',
  needsInstall = 'Para recibir avisos en iPhone, primero agrega la app a tu pantalla de inicio.',
  enableLabel = 'Activar',
  notNowLabel = 'Ahora no',
  gotItLabel = 'Entendido',
  onEnabled,
  className = '',
}: Props) {
  const push = usePush();
  const [busy, setBusy] = useState(false);
  if (push.dismissed) return null;

  if (push.status === 'blocked' || push.status === 'needs-install') {
    return (
      <div role="note" className={`alert alert-soft alert-warning text-sm ${className}`}>
        <BellAlertIcon className="size-5 shrink-0" />
        <span className="flex-1">{push.status === 'blocked' ? blocked : needsInstall}</span>
        <button type="button" className="btn btn-ghost btn-xs" onClick={dismissPushBanner}>
          {gotItLabel}
        </button>
      </div>
    );
  }
  if (push.status !== 'off') return null;

  const enable = async () => {
    setBusy(true);
    const status = await enablePush().finally(() => setBusy(false));
    if (status === 'on-push' || status === 'on-local') onEnabled?.();
  };

  return (
    <div role="note" className={`alert alert-soft alert-info text-sm ${className}`}>
      <BellAlertIcon className="size-5 shrink-0" />
      <span className="flex-1">{invite}</span>
      <div className="flex gap-1">
        <button type="button" className="btn btn-ghost btn-xs" onClick={dismissPushBanner}>
          {notNowLabel}
        </button>
        <button type="button" className="btn btn-primary btn-xs" disabled={busy} onClick={enable}>
          {busy && <span className="loading loading-spinner loading-xs" />}
          {enableLabel}
        </button>
      </div>
    </div>
  );
}
