// Datos de la app en un solo lugar: al crear un proyecto, empieza por aquí
export const APP_NAME = 'Xiuh App';
export const APP_SHORT_NAME = 'Xiuh';
export const APP_DESCRIPTION = 'Una app de Xiuhlab.';
// Nombre de la base IndexedDB y prefijo de localStorage (cámbialos por app para que no choquen en el mismo dominio)
export const APP_DB_NAME = 'XiuhAppDB';
export const APP_STORAGE_PREFIX = 'xiuhapp_';
// Idioma y moneda de los formatos (lib/format.ts): p. ej. 'en-AU' y 'AUD' para un cliente en Australia
export const APP_LOCALE = 'es-MX';
export const APP_CURRENCY = 'MXN';

// Temas que se ofrecen al usuario: cada uno debe existir en styles/xiuh-themes.css
export const THEMES = ['light', 'dark', 'forest', 'matrix'] as const;
export type Theme = (typeof THEMES)[number];
// Sin preferencia guardada se usa DEFAULT_THEME, o DARK_THEME si el sistema está en modo oscuro
export const DEFAULT_THEME: Theme = 'light';
export const DARK_THEME: Theme = 'dark';

// Color de la barra del navegador / status bar por tema (el base-200 de cada uno)
export const THEME_COLORS: Record<Theme, string> = {
  light: '#F6F5FB',
  dark: '#0F0D17',
  forest: '#161212',
  matrix: '#0d1529',
};
// Colores del manifest (splash screen e ícono en Android)
export const BRAND_COLOR = '#1CC4B4';
export const BACKGROUND_COLOR = '#F6F5FB';
