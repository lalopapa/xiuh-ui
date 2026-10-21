'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  closeLabel?: string;
  loading?: boolean;
  /** Clase del botón de confirmar (por defecto `btn-primary`; p. ej. `btn-error` para eliminar) */
  confirmClassName?: string;
  confirmDisabled?: boolean;
  /** Botón extra entre Cancelar y Confirmar */
  extraAction?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmación con `<dialog class="modal">`. Va en un portal: se puede usar dentro de un <form> sin anidar forms. */
export default function ConfirmModal({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancelar',
  closeLabel = 'Cerrar',
  loading,
  confirmClassName = 'btn-primary',
  confirmDisabled,
  extraAction,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open, mounted]);

  if (!mounted) return null;
  return createPortal(
    <dialog ref={ref} className="modal" onClose={onCancel} aria-labelledby={titleId}>
      <div className="modal-box">
        <h3 id={titleId} className="text-lg font-semibold">
          {title}
        </h3>
        <div className="py-3 text-sm text-base-content/80">{children}</div>
        <div className="modal-action flex-wrap">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          {extraAction}
          <button type="button" className={`btn ${confirmClassName}`} onClick={onConfirm} disabled={loading || confirmDisabled}>
            {loading && <span className="loading loading-spinner loading-sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label={closeLabel}>{closeLabel}</button>
      </form>
    </dialog>,
    document.body,
  );
}
