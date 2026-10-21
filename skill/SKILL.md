---
name: xiuh-ui
description: Sistema de diseño de Xiuhlab (Next.js 15 + daisyUI 5 + Tailwind 4) publicado como registro shadcn en @xiuh. Úsala al crear una app/PWA nueva de Xiuhlab, o al construir UI en un proyecto cuyo components.json registra "@xiuh" (layouts, tablas, formularios, modales, temas, preferencias con Dexie, PWA, avisos push). Antes de escribir un componente, revisa si ya existe en el registro.
---

# xiuh-ui

Registro de componentes de Xiuhlab al estilo shadcn: las piezas se **copian** al proyecto con el CLI y luego se modifican libremente.

- Catálogo con demos: https://lalopapa.github.io/xiuh-ui
- Repo del registro: `C:\Users\lalo_\Documents\xiuhlab\xiuh-ui` (github.com/lalopapa/xiuh-ui)
- Template de apps: github.com/lalopapa/xiuh-starter
- API de cada pieza con ejemplos: [references/components.md](references/components.md)

**Cómo saber si un proyecto lo usa:** `components.json` tiene `"registries": { "@xiuh": … }`, y existen `config/app.ts` y `lib/db.ts`.

## App nueva

```bash
npx degit lalopapa/xiuh-starter mi-app && cd mi-app && npm install
```

1. `config/app.ts`: `APP_NAME`, `APP_DESCRIPTION`, y **`APP_DB_NAME` y `APP_STORAGE_PREFIX` únicos por app** (varias apps en el mismo dominio comparten IndexedDB y localStorage).
2. Logo: reemplaza `public/icons/logo.svg` y `logo-maskable.svg`, luego `npm run icons`.
3. Menú: `config/navigation.ts` (`NAV_ITEMS`). Las rutas de la app van en `app/(main)/` (layout con `MobileShell`); `app/~offline` queda fuera a propósito.
4. Moneda e idioma de los formatos: `APP_LOCALE` y `APP_CURRENCY` en `config/app.ts`.
5. Agrega piezas con `npx shadcn add @xiuh/<pieza>`.

**El starter ya trae:** `base` (config/app.ts, temas, lib/db.ts, lib/settings.ts), `navigation-config`, `use-setting`, `theme`, `pwa`, `navigation`, `mobile-shell`, `toaster`, `modal`, `confirm-modal`, `spinner`, `button-copy`, `format`. Todo lo demás se instala cuando se necesite. Ante la duda, mira `components/`, `hooks/` y `lib/` antes de instalar (reinstalar una pieza idéntica no hace nada, pero no hace falta).

## Regla principal: primero el registro

Antes de escribir un layout, tabla, formulario, modal, menú de acciones, buscador, selector de tema o algo de PWA/push, revisa el catálogo. Si existe, instálalo y adáptalo; no lo reescribas. El CLI instala solo las dependencias npm que la pieza necesite (p. ej. `react-hook-form`).

```bash
npx shadcn add @xiuh/responsive-table @xiuh/column-picker
```

| Pieza | Úsala para |
|---|---|
| `mobile-shell` | Apps tipo PWA: barra con hamburguesa y drawer (default del starter) |
| `dashboard-shell` | Paneles de administración: sidebar fijo en escritorio, topbar con migas, `UserMenu` |
| `navigation` | `NavMenu` y `Brand` (los usan los shells) |
| `responsive-table` + `column-picker` | Listados: tabla en escritorio, tarjetas en móvil, orden, acciones por fila, columnas visibles guardadas |
| `form-fieldset` | Formularios con react-hook-form: campos sueltos o `FormFieldset` desde una lista de campos |
| `modal`, `confirm-modal` | Diálogos; `ConfirmModal` para eliminar/confirmar (va en portal) |
| `dropdown-button` | Menú de acciones ⋮ de una fila o tarjeta (popover, no lo recorta el overflow) |
| `search-input` | Buscador con debounce |
| `toaster` | Avisos: `showToast('success' \| 'error' \| 'info', msg)`; `<Toaster />` ya está en el layout |
| `spinner`, `button-copy` | Utilidades pequeñas |
| `format` | `formatMoney`, `formatNumber`, `formatDate`, `formatDateTime` con el locale y la moneda de la app |
| `theme` | `useTheme`, `ThemePicker` (ya en el starter) |
| `use-setting` | Preferencias reactivas guardadas en IndexedDB |
| `pwa` | Service worker, manifest, `/~offline`, `usePWA`, `PWAInstallPrompt` (ya en el starter) |
| `pwa-push` | Avisos Web Push (necesita back con `web-push`; contrato en el README del registro) |

## Plantillas editables vs. piezas de código

- **Plantillas** — se instalan una vez y **son del proyecto**: `config/app.ts`, `styles/xiuh-themes.css`, `lib/db.ts`, `lib/settings.ts` (ítem `base`), `config/navigation.ts` (`navigation-config`), y además `app/sw.ts` y `app/manifest.ts`.
  - Nunca las reinstales con `--overwrite`. Si el CLI pregunta si sobrescribe una de ellas, la respuesta es **no**.
- **Piezas de código** — todo lo demás. Para traer una versión nueva: `npx shadcn add @xiuh/<pieza> --overwrite`, solo si el proyecto no la modificó; revisa `git diff` después.

## Convenciones (al usar o modificar piezas, y al escribir UI nueva)

- **Solo clases de daisyUI y tokens del tema** (`bg-base-100`, `text-base-content/70`, `btn-primary`, `rounded-box`). Nunca colores fijos (`#fff`, `bg-[#f2f2f2]`): rompen los temas oscuros (`dark`, `forest`, `matrix`).
- **Clases completas**, nunca armadas con plantillas (`loading-${size}`): Tailwind no las detecta. Usa un mapa de clases.
- **Textos como props con valor por defecto en español**; las piezas no importan librerías de i18n. Si la app usa i18n, pasa los textos traducidos por props.
- Íconos: `@heroicons/react/24/outline`, tamaño con `size-4` / `size-5`.
- `'use client'` solo donde hace falta. Los layouts pueden ser server components; los íconos (funciones) no se pasan de server a client: por eso `NavMenu` lee `NAV_ITEMS` directo.
- Móvil primero: probar a 390px. Breakpoint de tabla/tarjetas: `md`. Existe `xs` (460px).

## Datos y preferencias (Dexie)

- **Entidades:** agrega la tabla en `lib/db.ts` extendiendo `SyncedEntity` (`id` UUID del cliente, `createdAt`, `updatedAt`, `deletedAt` para borrado lógico, `syncedAt`) y declara su `Table<Entidad, string>`. Indexa siempre `updatedAt` y `deletedAt`.
- **Versiones del esquema:** una versión está "publicada" en cuanto corrió en algún navegador (producción, el teléfono de alguien o tu propio dev con datos que quieras conservar). Para agregar tablas o índices crea `this.version(N + 1).stores({ ... })` con **solo las tablas que cambian**, debajo de las anteriores, sin tocarlas. Solo en un proyecto recién creado que nadie ha abierto puedes editar la versión 1.
- **Crear:** `db.x.add(newEntity(data))`. **Editar:** `db.x.update(id, { ...cambios, updatedAt: Date.now() })` (Dexie no lo actualiza solo).
- **Borrar = borrado lógico:** `db.x.update(id, { deletedAt: Date.now(), updatedAt: Date.now() })`, nunca `delete()` (el back necesita enterarse al sincronizar). **Toda consulta filtra `!deletedAt`.**
- **Preferencias del usuario:** declara la clave y su tipo en la interfaz `Settings` de `lib/settings.ts` y usa `const [valor, setValor, loaded] = useSetting('clave', default)`. Es reactivo entre componentes y pestañas.
- Las llamadas a `/api/` nunca salen del caché del service worker (`NetworkOnly`): lo offline vive en IndexedDB.

## Patrones

- **Listado:** `SearchInput` + `ColumnPicker` + `ResponsiveTable` (con `actions` → `DropdownButton`) + `ConfirmModal` para eliminar + `showToast` al terminar. Montos y fechas con `formatMoney` / `formatDate`.
- **Formulario:** `useForm` + `<FormProvider>` + `FormFieldset` (o campos sueltos) + `showToast`. El botón de guardar es un `btn` de daisy con `{isSubmitting && <span className="loading loading-spinner loading-sm" />}` y `disabled={isSubmitting || !isDirty}`. Los errores del back se muestran con `methods.setError(campo, { message })`.
  - `NumberField` entrega `number | null` (vacío = `null`): el tipo del formulario no es igual al de la entidad; convierte al guardar o marca el campo `required`.
- **Crear y editar con el mismo formulario:** un componente `XForm` con `defaultValues` y `onSubmit`. En la página de edición carga con `useLiveQuery(() => db.x.get(id), [id])`: `undefined` = cargando (muestra `Spinner`), `null`/borrado = "no existe". Monta el form con `key={registro.id}` para que `defaultValues` no se quede con datos viejos.
- **Rutas:** listado `/x`, alta `/x/nuevo`, edición `/x/[id]`.
- **Ajustes:** página con `useTheme`/`ThemePicker`, toggles con `useSetting`, y `PushToggle` si hay push.

## Gotchas

- La PWA solo funciona en build (`npm run build && npm start`); en `dev` el service worker está apagado.
- Offline: el service worker (`defaultCache` de Serwist, NetworkFirst) guarda el HTML de las páginas **después de visitarlas** con red, también las dinámicas como `/x/[id]`, pero solo las **32 más recientes y por 24 h**. Las demás muestran `/~offline`. Los datos salen de IndexedDB, así que una página en caché funciona completa sin red. Si una app debe abrir sin red días después, agrega sus rutas clave a `additionalPrecacheEntries` en `next.config.ts` o una regla propia en `app/sw.ts`.
- Temas propios de daisy: `default: true` / `prefersdark: true` van **dentro** del bloque `@plugin "daisyui/theme"`; los flags `--default` de `themes:` no les aplican.
- El CLI de shadcn borra el comentario de la primera línea de archivos que transforma (ui/lib/hook/component); los `registry:file` se copian tal cual.
- En iPhone, push requiere la app instalada (`usePush().status === 'needs-install'`).

## Cuando hagas algo reutilizable

Si en un proyecto construyes un componente que serviría en otras apps, propón agregarlo al registro (pasos en el README de `xiuh-ui`: archivo en `registry/` con la ruta destino, entrada en `registry.json`, demo en `app/demos.tsx`, `npm run build`, push a `main` publica). Respeta la regla: las piezas de código nunca dependen de plantillas.
