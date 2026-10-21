'use client';
import { SignalSlashIcon } from '@heroicons/react/24/outline';

// La muestra el service worker cuando no hay red y la página pedida no está en caché
export default function OfflinePage() {
  return (
    <main className="hero min-h-svh bg-base-200">
      <div className="hero-content flex-col text-center">
        <SignalSlashIcon className="size-14 text-base-content/50" />
        <h1 className="text-2xl font-bold">Sin conexión</h1>
        <p className="max-w-xs text-base-content/70">Esta página no está disponible sin internet. Revisa tu conexión e inténtalo de nuevo.</p>
        <button type="button" className="btn btn-primary" onClick={() => location.reload()}>
          Reintentar
        </button>
      </div>
    </main>
  );
}
