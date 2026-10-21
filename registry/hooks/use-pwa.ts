'use client';
import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Estado de instalación y conexión de la PWA.
 * - isInstallable: el navegador ofrece instalar (Chrome, Edge, Android).
 * - isIOS: Safari en iPhone/iPad no ofrece `beforeinstallprompt`; hay que explicar "Compartir → Agregar a inicio".
 */
export function usePWA() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true);
    // iPadOS se presenta como Mac: se distingue por la pantalla táctil
    setIsIOS(/iphone|ipad|ipod/i.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1));
    setIsOnline(nav.onLine);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
    };
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  /** Abre el diálogo de instalación del navegador. Devuelve true si el usuario aceptó. */
  const install = useCallback(async () => {
    if (!installEvent) return false;
    try {
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      if (outcome === 'accepted') setInstallEvent(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error('No se pudo instalar la PWA:', error);
      return false;
    }
  }, [installEvent]);

  return { isInstallable: !!installEvent, isInstalled, isIOS, isOnline, install };
}
