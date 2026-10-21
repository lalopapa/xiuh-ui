'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { APP_STORAGE_PREFIX } from '@/config/app';

// ---- Cómo habla con tu back: ajusta estas tres llamadas (el contrato está en el README del registro) ----
async function request(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} → ${res.status}`);
  return res.status === 204 ? null : res.json();
}
const api = {
  /** Llave pública VAPID; null si el back no tiene push configurado */
  getPublicKey: async (): Promise<string | null> =>
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ((await request('/api/push/key')) as { publicKey: string | null }).publicKey,
  saveSubscription: (sub: PushSubscriptionJSON) =>
    request('/api/push/subscriptions', { method: 'POST', body: JSON.stringify({ endpoint: sub.endpoint, keys: sub.keys }) }),
  deleteSubscription: (endpoint: string) => request('/api/push/subscriptions', { method: 'DELETE', body: JSON.stringify({ endpoint }) }),
};
// ---------------------------------------------------------------------------------------------------------

/**
 * Avisos en ESTE navegador:
 *   unsupported · needs-install (iPhone/iPad: push solo funciona con la app instalada) · blocked (el usuario los bloqueó)
 *   off (no se han activado) · on-push (llegan con la app cerrada)
 *   on-local (solo con la app abierta: el back no tiene push o la suscripción falló; `pushError` dice dónde)
 */
export type PushStatus = 'loading' | 'unsupported' | 'needs-install' | 'blocked' | 'off' | 'on-push' | 'on-local';

/** Por qué no quedó Web Push: el navegador rechazó la suscripción, el back falló o algo nunca respondió */
export type PushError = 'browser' | 'server' | 'timeout';

type State = { status: PushStatus; dismissed: boolean; pushError: PushError | null };

class PushFailure extends Error {
  constructor(
    readonly kind: PushError,
    readonly detail: unknown,
  ) {
    super(kind);
  }
}

/** Corre un paso de la suscripción y, si falla, lo etiqueta con el lado que falló */
const step = <T,>(kind: PushError, p: () => Promise<T>) =>
  p().catch((err) => {
    throw new PushFailure(kind, err);
  });

const pushErrorOf = (err: unknown): PushError => {
  console.warn('[push] Web Push no quedó activo:', err instanceof PushFailure ? err.detail : err);
  return err instanceof PushFailure ? err.kind : 'timeout';
};

// Que el usuario cerró la invitación es por dispositivo: va en localStorage
const DISMISSED_KEY = `${APP_STORAGE_PREFIX}push_banner_dismissed`;
const SW_URL = '/sw.js';

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
};
const writeDismissed = () => {
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {}
};

let state: State = { status: 'loading', dismissed: false, pushError: null };
const listeners = new Set<() => void>();
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const supported = () => typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

// Safari en iPhone/iPad solo expone Notification/PushManager dentro de la app instalada (iOS 16.4+)
const iosWithoutInstall = () => {
  const nav = navigator as Navigator & { standalone?: boolean };
  const ios = /iphone|ipad|ipod/i.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
  return ios && nav.standalone !== true && !window.matchMedia('(display-mode: standalone)').matches;
};

/** "BCRY…" (base64url) → bytes para applicationServerKey */
function keyBytes(base64url: string) {
  const b64 = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/** Rechaza si la promesa tarda más de `ms` (p. ej. un service worker que nunca queda listo, como en dev) */
function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);
}

async function registration() {
  return (await navigator.serviceWorker.getRegistration(SW_URL)) ?? navigator.serviceWorker.register(SW_URL);
}

/** Suscribe este navegador a Web Push y lo registra en el back. false si el back no tiene push. */
async function subscribe(): Promise<boolean> {
  const publicKey = await step('server', api.getPublicKey);
  if (!publicKey) return false;
  const sub = await step('browser', async () => {
    const reg = await registration();
    await navigator.serviceWorker.ready;
    return (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) }));
  });
  await step('server', () => api.saveSubscription(sub.toJSON()));
  return true;
}

let initialized = false;
/** Lee el estado real del navegador una vez por carga y vuelve a registrar la suscripción en el back si ya existía */
export async function initPush() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  set({ dismissed: readDismissed() });
  if (!supported()) return set({ status: iosWithoutInstall() ? 'needs-install' : 'unsupported' });
  if (Notification.permission === 'denied') return set({ status: 'blocked' });
  if (Notification.permission !== 'granted') return set({ status: 'off' });
  try {
    set({ status: (await withTimeout(subscribe())) ? 'on-push' : 'on-local', pushError: null });
  } catch (err) {
    set({ status: 'on-local', pushError: pushErrorOf(err) });
  }
}

/** Desde un clic del usuario (los navegadores no dejan pedir permiso sin uno): pide permiso y suscribe */
export async function enablePush(): Promise<PushStatus> {
  if (!supported()) {
    const status = iosWithoutInstall() ? 'needs-install' : 'unsupported';
    set({ status });
    return status;
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    const status = permission === 'denied' ? 'blocked' : 'off';
    set({ status });
    return status;
  }
  let status: PushStatus = 'on-local';
  let pushError: PushError | null = null;
  try {
    if (await withTimeout(subscribe())) status = 'on-push';
  } catch (err) {
    // Sin push quedan los avisos con la app abierta (showLocalNotification)
    pushError = pushErrorOf(err);
  }
  writeDismissed();
  set({ status, pushError, dismissed: true });
  return status;
}

/** Deja de recibir push en este navegador (el permiso del sistema no se puede quitar desde la página) */
export async function disablePush() {
  try {
    const reg = await navigator.serviceWorker.getRegistration(SW_URL);
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await api.deleteSubscription(sub.endpoint).catch(() => {});
      await sub.unsubscribe();
    }
  } finally {
    set({ status: 'off', pushError: null });
  }
}

export function dismissPushBanner() {
  writeDismissed();
  set({ dismissed: true });
}

/** Estado de los avisos en este navegador; el primer uso dispara initPush */
export function usePush(): State {
  useEffect(() => {
    void initPush();
  }, []);
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}

/** Escucha los push que llegan con la app abierta (el service worker avisa a las pestañas). Devuelve cómo dejar de escuchar. */
export function onPushMessage(callback: (message: { tag?: string; url?: string }) => void) {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'xiuh:push') callback(event.data);
  };
  navigator.serviceWorker.addEventListener('message', handler);
  return () => navigator.serviceWorker.removeEventListener('message', handler);
}

/** Notificación del sistema desde la pestaña (cuando este navegador no tiene push) */
export function showLocalNotification(title: string, body: string, onClick?: () => void, tag?: string) {
  if (!supported() || Notification.permission !== 'granted') return;
  const notification = new Notification(title, { body, tag, icon: '/icons/icon-192.png' });
  notification.onclick = () => {
    window.focus();
    onClick?.();
    notification.close();
  };
}
