import { BRAND_COLOR, DARK_THEME, DEFAULT_THEME, THEME_COLORS, THEMES, type Theme } from '@/config/app';

// La cookie deja que el server pinte <html data-theme> desde el primer render (sin parpadeo)
export const THEME_COOKIE = 'theme';

export const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);

export const getThemeColor = (theme?: string | null) => (isTheme(theme) ? THEME_COLORS[theme] : BRAND_COLOR);

/** Tema que corresponde al sistema operativo (solo en el cliente) */
export const getDeviceTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? DARK_THEME : DEFAULT_THEME;

/** Aplica el tema: data-theme, color de la barra del navegador y cookie */
export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // El layout puede traer dos meta theme-color (light/dark por media query): se deja una sola, sin media
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach((meta, i) => i > 0 && meta.remove());
  const meta = metas[0] ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }));
  meta.removeAttribute('media');
  meta.setAttribute('content', getThemeColor(theme));

  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
