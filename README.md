# xiuh-ui

Registro de componentes daisyUI de Xiuhlab, al estilo shadcn: las piezas se **copian** al proyecto con el CLI y ahí se pueden modificar libremente.

- Catálogo en vivo: https://lalopapa.github.io/xiuh-ui
- Registro: `https://lalopapa.github.io/xiuh-ui/r/{name}.json`
- Stack base: Next 15.5 · React 19 · Tailwind 4.3 · daisyUI 5.7

## Usarlo en un proyecto

Los proyectos nuevos salen de [xiuh-starter](../xiuh-starter), que ya trae el namespace configurado en `components.json`:

```json
"registries": { "@xiuh": "https://lalopapa.github.io/xiuh-ui/r/{name}.json" }
```

```bash
npx shadcn add @xiuh/modal
npx shadcn add @xiuh/toaster --overwrite   # traer la versión nueva de una pieza
```

En un proyecto que no salió del starter, primero `npx shadcn add @xiuh/base @xiuh/navigation-config`.

### Plantillas editables vs. piezas de código

- **Plantillas** (`base` → `app-config`, `themes`, `db`, `settings`; y `navigation-config`): se instalan una vez y **se editan** (nombre de la app, tus tablas, tus preferencias, tu menú).
- **Piezas de código**: todo lo demás. Pueden depender de otras piezas de código, pero **nunca** de una plantilla; lo que suponen va en su descripción ("Requiere @xiuh/base"). Así, instalar o actualizar una pieza no vuelve a preguntar por (ni pisa) tus plantillas editadas.

## Piezas

| Pieza | Qué trae |
|---|---|
| `base` | Plantillas editables: instala `app-config`, `themes`, `db` y `settings` |
| `app-config` | `config/app.ts`: nombre, base IndexedDB, temas y colores |
| `themes` | `styles/xiuh-themes.css`: temas light, dark, forest y matrix, breakpoint `xs`, utilidades `bb`/`bbi` |
| `db` | `lib/db.ts`: Dexie con tabla `settings` y `SyncedEntity` para sincronizar offline |
| `settings` | `lib/settings.ts`: `getSetting`/`setSetting` tipados, con respaldo en localStorage |
| `navigation-config` | `config/navigation.ts`: `NAV_ITEMS`, fuente única del menú y las migas |
| `use-setting` | `hooks/use-setting.ts`: preferencia reactiva (`useLiveQuery`) |
| `theme` | `lib/theme.ts`, `hooks/use-theme.ts`, `ThemePicker` |
| `pwa` | `app/sw.ts` (Serwist), `app/manifest.ts`, `/~offline`, `usePWA`, `PWAInstallPrompt` (incluye iOS) |
| `navigation` | `NavMenu` (sección activa, badges) y `Brand` |
| `mobile-shell` | Layout PWA: barra con menú hamburguesa y drawer |
| `dashboard-shell` | `AppShell`: sidebar fijo en escritorio, drawer en móvil, `Topbar` con migas y `UserMenu` |
| `dropdown-button` | Menú de acciones ⋮ con popover (no lo recorta el overflow) |
| `search-input` | Buscador con debounce |
| `responsive-table` | Tabla en escritorio y tarjetas en móvil; orden por columna, acciones por fila, columnas visibles en IndexedDB (`useTableColumns`) |
| `column-picker` | Dropdown para elegir columnas visibles de una `ResponsiveTable` |
| `form-fieldset` | Campos de react-hook-form (`TextField`, `NumberField`, `SelectField`, `ToggleField`, `CheckboxesField`) y `FormFieldset` para armar formularios desde una lista de campos |
| `format` | `formatMoney`, `formatNumber`, `formatDate`, `formatDateTime` con `APP_LOCALE` / `APP_CURRENCY` |
| `pwa-push` | Web Push en el service worker (`app/sw-push.ts`), estado del dispositivo (`lib/push.ts`), `PushBanner` y `PushToggle` |
| `toaster` | Avisos react-hot-toast con estilo daisy y `showToast` |
| `modal`, `confirm-modal` | `<dialog class="modal">` controlados |
| `spinner`, `button-copy` | Utilidades pequeñas |

## Contrato de `pwa-push` con el back

El registro solo trae el lado del cliente. El back (como en agents-server) necesita:

| Ruta | Qué hace |
|---|---|
| `GET /api/push/key` | `{ publicKey }` (llave VAPID pública, o `null` si no hay push) |
| `POST /api/push/subscriptions` | Guarda `{ endpoint, keys }` para el usuario actual |
| `DELETE /api/push/subscriptions` | Borra `{ endpoint }` |

Las rutas se cambian en el objeto `api` de `lib/push.ts`. Para enviar:

```js
import webPush from 'web-push'; // llaves: npx web-push generate-vapid-keys
webPush.setVapidDetails('mailto:soporte@xiuhlab.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const payload = JSON.stringify({ title: 'Nuevo pedido', body: 'Mesa 4', url: '/pedidos', tag: 'pedido-123', priority: 'high' });
try {
  await webPush.sendNotification({ endpoint, keys }, payload, { TTL: 24 * 3600, urgency: 'high' });
} catch (err) {
  if ([404, 410].includes(err.statusCode)) await borrarSuscripcion(endpoint); // el navegador la dio de baja
}
```

En iPhone/iPad, push solo funciona con la app instalada (iOS 16.4+); `usePush()` lo reporta como `needs-install`.

## Agregar o cambiar una pieza

1. Escribe el archivo en `registry/` con la **misma ruta que tendrá en el proyecto** (`registry/components/ui/x.tsx` → `components/ui/x.tsx`). Los imports usan `@/…` y en este repo resuelven primero a `registry/` (ver `tsconfig.json`).
2. Agrégala a `registry.json` con `target: "~/ruta"`, sus `dependencies` (npm) y `registryDependencies` (`@xiuh/…`, solo piezas de código, nunca plantillas). Si requiere pasos manuales, ponlos en `docs`: el CLI los muestra al instalar.
3. Agrega una demo en `app/demos.tsx`.
4. `npm run build` (genera `public/r/*.json` y el sitio en `out/`). Al hacer push a `main`, la GitHub Action lo publica.

### Convenciones

- Textos visibles como props con valor por defecto en español; nada de librerías de i18n dentro de las piezas.
- Solo clases de daisy y tokens del tema (`bg-base-100`, `text-primary`…), nunca colores fijos.
- Nada de clases armadas con plantillas (`loading-${size}`): Tailwind no las detecta.
- El CLI borra el comentario de la **primera línea** de los archivos que transforma (ui, lib, hook, component): no los empieces con un comentario. Los `registry:file` se copian tal cual (por eso `sw.ts` conserva su `/// <reference>`).
- En temas propios, `default`/`prefersdark` van dentro del bloque `@plugin "daisyui/theme"`; los flags `--default`/`--prefersdark` de `themes:` no les aplican.

## Skill para Claude

`skill/` es la skill `xiuh-ui` para Claude Code: catálogo, reglas (plantillas vs. código, solo tokens de daisy, textos por props) y la API de cada pieza en `skill/references/components.md`. Con ella, Claude usa `npx shadcn add @xiuh/…` en vez de reescribir componentes.

```bash
npm run skill:install   # copia skill/ a ~/.claude/skills/xiuh-ui
```

Al agregar o cambiar una pieza, actualiza también `skill/SKILL.md` (tabla de piezas) y `skill/references/components.md` (props y ejemplo), y vuelve a correr `npm run skill:install`.

## Probar el registro en local

```bash
npm run build
npx serve out -l 4123
# en el proyecto de prueba, cambia temporalmente el registro a http://localhost:4123/r/{name}.json
```
