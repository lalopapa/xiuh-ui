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

## Piezas

| Pieza | Qué trae |
|---|---|
| `app-config` | `config/app.ts`: nombre, base IndexedDB, temas y colores |
| `themes` | `styles/xiuh-themes.css`: temas thunder, thunder-dark y matrix, breakpoint `xs`, utilidades `bb`/`bbi` |
| `db` | `lib/db.ts`: Dexie con tabla `settings` y `SyncedEntity` para sincronizar offline |
| `settings` | `lib/settings.ts`: `getSetting`/`setSetting` tipados, con respaldo en localStorage |
| `use-setting` | `hooks/use-setting.ts`: preferencia reactiva (`useLiveQuery`) |
| `theme` | `lib/theme.ts`, `hooks/use-theme.ts`, `ThemePicker` |
| `pwa` | `app/sw.ts` (Serwist), `app/manifest.ts`, `/~offline`, `usePWA`, `PWAInstallPrompt` (incluye iOS) |
| `navigation` | `config/navigation.ts` (menú y migas), `NavMenu`, `Brand` |
| `mobile-shell` | Layout PWA: barra con menú hamburguesa y drawer |
| `dashboard-shell` | `AppShell`: sidebar fijo en escritorio, drawer en móvil, `Topbar` con migas y `UserMenu` |
| `dropdown-button` | Menú de acciones ⋮ con popover (no lo recorta el overflow) |
| `search-input` | Buscador con debounce |
| `responsive-table` | Tabla en escritorio y tarjetas en móvil; orden por columna, acciones por fila, columnas visibles en IndexedDB (`useTableColumns`) |
| `column-picker` | Dropdown para elegir columnas visibles de una `ResponsiveTable` |
| `toaster` | Avisos react-hot-toast con estilo daisy y `showToast` |
| `modal`, `confirm-modal` | `<dialog class="modal">` controlados |
| `spinner`, `button-copy` | Utilidades pequeñas |

## Agregar o cambiar una pieza

1. Escribe el archivo en `registry/` con la **misma ruta que tendrá en el proyecto** (`registry/components/ui/x.tsx` → `components/ui/x.tsx`). Los imports usan `@/…` y en este repo resuelven primero a `registry/` (ver `tsconfig.json`).
2. Agrégala a `registry.json` con `target: "~/ruta"`, sus `dependencies` (npm) y `registryDependencies` (`@xiuh/…`). Si requiere pasos manuales, ponlos en `docs`: el CLI los muestra al instalar.
3. Agrega una demo en `app/demos.tsx`.
4. `npm run build` (genera `public/r/*.json` y el sitio en `out/`). Al hacer push a `main`, la GitHub Action lo publica.

### Convenciones

- Textos visibles como props con valor por defecto en español; nada de librerías de i18n dentro de las piezas.
- Solo clases de daisy y tokens del tema (`bg-base-100`, `text-primary`…), nunca colores fijos.
- Nada de clases armadas con plantillas (`loading-${size}`): Tailwind no las detecta.
- El CLI borra el comentario de la **primera línea** del archivo: no empieces un archivo con un comentario.
- En temas propios, `default`/`prefersdark` van dentro del bloque `@plugin "daisyui/theme"`; los flags `--default`/`--prefersdark` de `themes:` no les aplican.

## Probar el registro en local

```bash
npm run build
npx serve out -l 4123
# en el proyecto de prueba, cambia temporalmente el registro a http://localhost:4123/r/{name}.json
```
