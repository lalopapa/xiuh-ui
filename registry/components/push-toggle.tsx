'use client';
import { useState } from 'react';
import { disablePush, enablePush, usePush, type PushStatus } from '@/lib/push';

// Qué significa cada estado para el usuario; cámbialos o tradúcelos aquí
const DESCRIPTIONS: Record<PushStatus, string> = {
  loading: 'Revisando…',
  unsupported: 'Este navegador no permite avisos.',
  'needs-install': 'En iPhone, agrega la app a tu pantalla de inicio para recibir avisos.',
  blocked: 'Bloqueados: permítelos desde la configuración del navegador.',
  off: 'Desactivados en este dispositivo.',
  'on-push': 'Activos: llegan aunque la app esté cerrada.',
  'on-local': 'Activos solo con la app abierta.',
};

type Props = {
  label?: string;
  descriptions?: Partial<Record<PushStatus, string>>;
  className?: string;
};

/** Interruptor de avisos para la página de ajustes, con el estado real de este dispositivo */
export default function PushToggle({ label = 'Avisos en este dispositivo', descriptions = {}, className = '' }: Props) {
  const { status } = usePush();
  const [busy, setBusy] = useState(false);
  const on = status === 'on-push' || status === 'on-local';
  const canToggle = on || status === 'off';

  const toggle = async () => {
    setBusy(true);
    try {
      if (on) await disablePush();
      else await enablePush();
    } finally {
      setBusy(false);
    }
  };

  return (
    <label className={`label cursor-pointer items-start justify-between gap-3 py-2 text-base-content ${className}`}>
      <span className="flex flex-col">
        <span className="text-sm">{label}</span>
        <span className="text-xs whitespace-normal text-base-content/60">{descriptions[status] ?? DESCRIPTIONS[status]}</span>
      </span>
      <input type="checkbox" className="toggle toggle-primary" checked={on} disabled={busy || !canToggle} onChange={toggle} />
    </label>
  );
}
