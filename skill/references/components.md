# API de las piezas de @xiuh

Rutas tal como quedan en el proyecto. Todas las props de texto tienen valor por defecto en español.

## Contenido

- [Layouts](#layouts): MobileShell, AppShell, UserMenu, NavMenu/Brand, NAV_ITEMS
- [Listados](#listados): ResponsiveTable, ColumnPicker, useTableColumns, DropdownButton, SearchInput
- [Formularios](#formularios): FormFieldset, campos sueltos, FIELD_MESSAGES
- [Diálogos y avisos](#diálogos-y-avisos): Modal, ConfirmModal, showToast/Toaster, Spinner, ButtonCopy
- [Tema y preferencias](#tema-y-preferencias): useTheme, ThemePicker, useSetting, getSetting/setSetting
- [Datos](#datos-dexie): db, SyncedEntity, newEntity, página de edición, formatos
- [PWA y push](#pwa-y-push): usePWA, PWAInstallPrompt, usePush, PushBanner, PushToggle, onPushMessage

## Layouts

```tsx
// app/(main)/layout.tsx — app tipo PWA
import MobileShell from '@/components/layout/mobile-shell';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <MobileShell>{children}</MobileShell>;
}
```

`MobileShell` props: `title?` (default `APP_NAME`), `actions?` (default `<ThemePicker />`), `brand?`, `drawerFooter?`, `badges?: Record<href, number>`, `items?: NavItem[]`, `openMenuLabel?`, `closeMenuLabel?`.

```tsx
// Dashboard
import AppShell from '@/components/layout/app-shell';
import UserMenu from '@/components/layout/user-menu';
import ThemePicker from '@/components/ui/theme-picker';

<AppShell
  sidebarTitle="Menú"
  badges={{ '/pedidos': 3 }}
  actions={<><ThemePicker /><UserMenu name={user.name} detail={<span className="badge badge-soft badge-primary badge-xs">Admin</span>} logoutHref="/logout" /></>}
>
  {children}
</AppShell>
```

`AppShell` props: `actions?`, `sidebarHeader?` (default `<Brand />`), `sidebarFooter?`, `sidebarTitle?`, `badges?`, `items?`, `openMenuLabel?`, `closeMenuLabel?`.
`UserMenu` props: `name`, `detail?`, `children?` (cada entrada extra en su `<li>`), `logoutHref?`, `logoutLabel?`, `label?`.

Menú (`config/navigation.ts`), la primera entrada es el inicio de las migas:

```ts
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/', icon: HomeIcon },
  { label: 'Pedidos', href: '/pedidos', icon: ShoppingBagIcon },   // ya cubre /pedidos/nuevo y /pedidos/123
  // alsoMatches solo para rutas FUERA de su href, p. ej. el menú de un agente vive bajo /agentes:
  { label: 'Menú', href: '/menu', icon: BookOpenIcon, alsoMatches: ['/agentes/:id/menu'] },
  { label: 'Ajustes', href: '/ajustes', icon: Cog6ToothIcon, section: 'footer' },
];
```

`items` como prop solo desde un componente cliente (los íconos no se serializan de server a client). `closeDrawer()` y `DRAWER_ID` están en `lib/navigation.ts`.

## Listados

```tsx
'use client';
import ResponsiveTable, { type Column } from '@/components/ui/responsive-table';
import ColumnPicker from '@/components/ui/column-picker';
import DropdownButton from '@/components/ui/dropdown-button';
import SearchInput from '@/components/ui/search-input';

const COLUMNS: Column<Pedido>[] = [
  { key: 'cliente', label: 'Cliente', sortable: true, mobile: 'title', hideable: false },
  { key: 'estado', label: 'Estado', mobile: 'always', render: (p) => <span className="badge badge-sm">{p.estado}</span> },
  { key: 'total', label: 'Total', sortable: true, className: 'text-end tabular-nums', render: (p) => formatMoney(p.total) },
  { key: 'createdAt', label: 'Fecha', sortable: true, defaultVisible: false, render: (p) => formatDate(p.createdAt) },
];

<div className="flex items-center gap-2">
  <SearchInput onSearch={setQuery} className="input-sm flex-1" />
  <ColumnPicker tableId="pedidos" columns={COLUMNS} />
</div>
<ResponsiveTable
  id="pedidos"
  columns={COLUMNS}
  rows={rows}
  rowKey={(p) => p.id}
  loading={isLoading}
  emptyMessage="Sin pedidos"
  onRowClick={(p) => router.push(`/pedidos/${p.id}`)}
  actions={(p) => (
    <DropdownButton items={[
      { label: 'Editar', icon: PencilSquareIcon, href: `/pedidos/${p.id}` },
      { label: 'Eliminar', icon: TrashIcon, className: 'text-error', onClick: () => setToDelete(p) },
    ]} />
  )}
/>
```

- `Column<T>`: `key`, `label`, `render?`, `sortable?: boolean | (row) => valor`, `mobile?: 'title' | 'always' | 'expand' (default) | 'hidden'`, `hideable?`, `defaultVisible?`, `className?`.
- `ResponsiveTable` props: `id` (clave para guardar columnas), `columns`, `rows`, `rowKey`, `actions?`, `onRowClick?`, `loading?`, `emptyMessage?`, `actionsLabel?`, `showMoreLabel?`, `showLessLabel?`, `zebra?`, `className?`.
- `ColumnPicker` usa el **mismo `tableId`** que la tabla; ambos leen `useTableColumns(id, columns)` → `{ visible, toggle, reset, loaded }`.
- `DropdownItem`: `label`, `icon?`, `onClick?`, `href?` (navega si no hay onClick), `className?`, `hidden?`. Props: `items`, `label?`, `icon?`, `buttonClassName?`, `menuClassName?`.
- `SearchInput` props: `onSearch` (no se llama al montar), `placeholder?`, `delay?` (300), `defaultValue?`, `clearLabel?`, `className?`.

## Formularios

```tsx
'use client';
import { FormProvider, useForm } from 'react-hook-form';
import FormFieldset, { type FieldConfig } from '@/components/form/form-fieldset';
import { showToast } from '@/components/ui/toaster';

const FIELDS: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', required: true, maxLength: 60, showCounter: true },
  { name: 'correo', label: 'Correo', type: 'email', required: true },
  { name: 'plan', label: 'Plan', type: 'select', required: true, options: [{ value: 'pro', label: 'Pro' }] },
  { name: 'personas', label: 'Personas', type: 'number', min: 1, max: 20, required: true },
  { name: 'monto', label: 'Monto', type: 'number', prefix: '$', step: 0.01 },
  { name: 'intereses', label: 'Intereses', type: 'checkboxes', options: [...], className: 'sm:col-span-2' },
  { name: 'notas', label: 'Notas', type: 'textarea', rows: 4, className: 'sm:col-span-2' },
  { name: 'avisos', label: 'Recibir avisos', type: 'toggle' },
];

const methods = useForm({ mode: 'onTouched', defaultValues });
const onSubmit = methods.handleSubmit(async (values) => {
  try { await guardar(values); showToast('success', 'Guardado'); methods.reset(values); }
  catch (e) { methods.setError('correo', { message: 'Ya existe' }); }
});

<FormProvider {...methods}>
  <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
    <FormFieldset fields={FIELDS} disabled={methods.formState.isSubmitting} />
    <button className="btn btn-primary" disabled={methods.formState.isSubmitting || !methods.formState.isDirty}>Guardar</button>
  </form>
</FormProvider>
```

- `FormFieldset` props: `fields`, `disabled?`, `className?` (default `grid gap-x-4 sm:grid-cols-2`).
- Campos sueltos en `components/form/fields.tsx` (mismas props que en `FieldConfig`): `TextField` (`type` text/email/password/tel/url/date/time/datetime-local, `maxLength`, `showCounter`, `rows` → textarea, `autoComplete`), `NumberField` (`min`, `max`, `step`, `prefix`, `suffix`; valor `number | null`), `SelectField` (`options`, `placeholder`), `ToggleField`, `CheckboxesField` (valor `string[]`). Todos aceptan `required`, `disabled`, `help`, `className`, `rules` (reglas extra de RHF).
- `FieldShell` y `useFieldError(name)` para armar campos propios con el mismo estilo.
- Textos de validación: `FIELD_MESSAGES` en `fields.tsx`. Con zod/yup: pasa `resolver` a `useForm`; los errores se muestran igual.

## Diálogos y avisos

```tsx
<Modal open={open} onClose={() => setOpen(false)} className="max-w-md">…</Modal>

<ConfirmModal
  open={!!toDelete}
  title="¿Eliminar pedido?"
  confirmLabel="Eliminar"
  confirmClassName="btn-error"
  loading={deleting}
  onConfirm={eliminar}
  onCancel={() => setToDelete(null)}
>
  Esta acción no se puede deshacer.
</ConfirmModal>

showToast('success' | 'error' | 'info', 'Mensaje');
<Spinner size="xs|sm|md|lg|xl" message="Cargando…" />
<ButtonCopy text={url} label="Copiar link" />
```

`ConfirmModal` también acepta `cancelLabel?`, `closeLabel?`, `confirmDisabled?`, `extraAction?`. Va en un portal: se puede usar dentro de un `<form>`.

## Tema y preferencias

```tsx
const { theme, setTheme, loaded } = useTheme();   // guarda en IndexedDB + cookie + meta theme-color
<ThemePicker label="Tema" labels={{ light: 'Claro', dark: 'Oscuro', forest: 'Bosque', matrix: 'Matrix' }} />

// lib/settings.ts → interface Settings { …; vista_compacta: boolean }
const [compacta, setCompacta, loaded] = useSetting('vista_compacta', false);
await getSetting('language');  await setSetting('sound', true);  await removeSetting('theme');
```

Temas disponibles: `THEMES` en `config/app.ts` (deben existir en `styles/xiuh-themes.css`). `app/layout.tsx` lee la cookie `theme` para pintar `<html data-theme>` sin parpadeo.

## Datos (Dexie)

```ts
// lib/db.ts
export interface Pedido extends SyncedEntity { cliente: string; total: number; estado: 'nuevo' | 'listo' }
pedidos!: Table<Pedido, string>;
this.version(2).stores({ pedidos: 'id, estado, updatedAt, deletedAt' });   // la versión 1 no se toca

await db.pedidos.add(newEntity({ cliente: 'Ana', total: 120, estado: 'nuevo' }));
await db.pedidos.update(id, { ...cambios, updatedAt: Date.now() });
await db.pedidos.update(id, { deletedAt: Date.now(), updatedAt: Date.now() });   // borrar (lógico)

const activos = useLiveQuery(() => db.pedidos.orderBy('updatedAt').reverse().filter((p) => !p.deletedAt).toArray(), []);
```

Página de edición:

```tsx
'use client';
const { id } = useParams<{ id: string }>();
const pedido = useLiveQuery(async () => {
  const p = await db.pedidos.get(id);
  return p && !p.deletedAt ? p : null;   // null = no existe
}, [id]);

if (pedido === undefined) return <Spinner />;   // cargando
if (pedido === null) return <p className="p-4 text-base-content/70">Ese pedido no existe.</p>;
return <PedidoForm key={pedido.id} defaultValues={pedido} onSubmit={(v) => db.pedidos.update(pedido.id, { ...v, updatedAt: Date.now() })} />;
```

## Formatos

```ts
import { formatMoney, formatNumber, formatDate, formatDateTime } from '@/lib/format';
formatMoney(1250)        // "$1,250.00" con APP_LOCALE 'es-MX' y APP_CURRENCY 'MXN'
formatDate(p.createdAt)  // acepta Date, timestamp o ISO; vacío → "—"
```

## PWA y push

```tsx
const { isInstallable, isInstalled, isIOS, isOnline, install } = usePWA();
<PWAInstallPrompt />   // ya en el layout del starter; "no volver a mostrar" en show_pwa_install

const { status, pushError, dismissed } = usePush();
// status: loading | unsupported | needs-install | blocked | off | on-push | on-local
<PushBanner onEnabled={() => showToast('success', 'Avisos activados')} />
<PushToggle />
useEffect(() => onPushMessage(({ tag }) => refetch()), []);   // push con la app abierta
showLocalNotification('Título', 'Texto', () => router.push('/x'));   // sin push en el back
```

Push requiere: descomentar `registerPushHandlers(self)` en `app/sw.ts`, y en el back `GET /api/push/key`, `POST`/`DELETE /api/push/subscriptions` (rutas en el objeto `api` de `lib/push.ts`). Payload: `{ title, body, url, tag, priority }`.
