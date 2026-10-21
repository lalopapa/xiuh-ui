import { APP_CURRENCY, APP_LOCALE } from '@/config/app';

// Formateadores creados una vez (Intl es caro de construir en cada render)
const money = new Intl.NumberFormat(APP_LOCALE, { style: 'currency', currency: APP_CURRENCY });
const number = new Intl.NumberFormat(APP_LOCALE);
const date = new Intl.DateTimeFormat(APP_LOCALE, { dateStyle: 'medium' });
const dateTime = new Intl.DateTimeFormat(APP_LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

type DateInput = Date | number | string | null | undefined;
const toDate = (value: DateInput) => (value == null || value === '' ? null : new Date(value));

/** Dinero en la moneda de la app; vacío → '—' */
export const formatMoney = (value: number | null | undefined) => (value == null ? '—' : money.format(value));

export const formatNumber = (value: number | null | undefined) => (value == null ? '—' : number.format(value));

/** Fecha (acepta Date, timestamp como los de SyncedEntity, o ISO) */
export const formatDate = (value: DateInput) => {
  const d = toDate(value);
  return d && !Number.isNaN(d.getTime()) ? date.format(d) : '—';
};

export const formatDateTime = (value: DateInput) => {
  const d = toDate(value);
  return d && !Number.isNaN(d.getTime()) ? dateTime.format(d) : '—';
};
