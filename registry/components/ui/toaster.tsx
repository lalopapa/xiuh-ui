'use client';
import { Toaster as HotToaster, ToastBar, toast } from 'react-hot-toast';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info';

export const showToast = (type: ToastType, message: string) => {
  if (type === 'success') toast.success(message);
  else if (type === 'error') toast.error(message);
  else toast(message, { icon: <InformationCircleIcon className="size-5 shrink-0 text-info" /> });
};

/** Contenedor de avisos con estilo daisy. Va una vez en el layout. */
export default function Toaster({ closeLabel = 'Cerrar' }: { closeLabel?: string }) {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        style: { padding: 0, margin: 0, background: 'none', boxShadow: 'none' },
        duration: 4000,
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-center gap-2 rounded-box border border-base-300 bg-base-100 p-3 text-base-content shadow-md">
              {icon}
              <span className="text-sm">{message}</span>
              <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={() => toast.dismiss(t.id)} aria-label={closeLabel}>
                <XMarkIcon className="size-4" />
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
}
