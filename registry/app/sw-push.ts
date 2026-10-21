/// <reference lib="webworker" />
// Avisos Web Push del service worker (registro @xiuh/pwa-push). Se activa en app/sw.ts:
//   import { registerPushHandlers } from './sw-push';
//   registerPushHandlers(self);

/** Lo que manda el back en cada push, como JSON */
export type PushPayload = {
  title?: string;
  body?: string;
  /** Ruta que se abre al tocar el aviso */
  url?: string;
  /** Avisos con el mismo tag se reemplazan en vez de apilarse */
  tag?: string;
  /** 'high' deja el aviso en pantalla hasta que el usuario lo atienda */
  priority?: 'high' | 'normal';
};

// Mensaje que reciben las pestañas abiertas (ver onPushMessage en lib/push.ts)
export const PUSH_MESSAGE = 'xiuh:push';

export function registerPushHandlers(sw: ServiceWorkerGlobalScope, defaultUrl = '/') {
  sw.addEventListener('push', (event) => {
    let data: PushPayload = {};
    try {
      data = event.data ? event.data.json() : {};
    } catch {
      data = { body: event.data ? event.data.text() : '' };
    }
    const options = {
      body: data.body ?? '',
      tag: data.tag,
      renotify: Boolean(data.tag),
      requireInteraction: data.priority === 'high',
      icon: '/icons/icon-192.png',
      data: { url: data.url || defaultUrl },
    };
    event.waitUntil(
      Promise.all([
        sw.registration.showNotification(data.title || 'Nuevo aviso', options as NotificationOptions),
        // Las pestañas abiertas se enteran al instante (p. ej. para refrescar una lista)
        sw.clients
          .matchAll({ type: 'window', includeUncontrolled: true })
          .then((tabs) => tabs.forEach((tab) => tab.postMessage({ type: PUSH_MESSAGE, tag: data.tag, url: data.url }))),
      ]),
    );
  });

  sw.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = new URL(event.notification.data?.url || defaultUrl, sw.location.origin).href;
    event.waitUntil(
      sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((tabs) => {
        const tab = tabs.find((t) => new URL(t.url).origin === sw.location.origin);
        // navigate() solo funciona en pestañas que controla este service worker; si no, se abre una nueva
        if (tab) return tab.focus().then((t) => t.navigate(url)).catch(() => sw.clients.openWindow(url));
        return sw.clients.openWindow(url);
      }),
    );
  });
}
