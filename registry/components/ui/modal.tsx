'use client';
import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Clases extra del modal-box (p. ej. max-w-md) */
  className?: string;
  closeLabel?: string;
};

/** `<dialog class="modal">` controlado por `open`. En celular sale desde abajo. */
export default function Modal({ open, onClose, children, className = '', closeLabel = 'Cerrar' }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  // El evento close llega después del cambio de estado: solo cuenta si `open` sigue en true (Esc, fondo)
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle" onClose={() => openRef.current && onClose()}>
      <div className={`modal-box ${className}`}>{open && children}</div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label={closeLabel}>{closeLabel}</button>
      </form>
    </dialog>
  );
}
