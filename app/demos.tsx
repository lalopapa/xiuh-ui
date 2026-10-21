"use client";
import { useState, type ComponentType } from "react";
import Link from "next/link";
import { DocumentDuplicateIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import DropdownButton from "@/components/ui/dropdown-button";
import SearchInput from "@/components/ui/search-input";
import ColumnPicker from "@/components/ui/column-picker";
import ResponsiveTable, { type Column } from "@/components/ui/responsive-table";
import { THEMES } from "@/config/app";
import { usePWA } from "@/hooks/use-pwa";
import { useSetting } from "@/hooks/use-setting";
import { useTheme } from "@/hooks/use-theme";
import ButtonCopy from "@/components/ui/button-copy";
import ConfirmModal from "@/components/ui/confirm-modal";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import ThemePicker from "@/components/ui/theme-picker";
import { showToast } from "@/components/ui/toaster";

function ThemesDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {THEMES.map((t) => (
        <div key={t} data-theme={t} className="flex flex-col gap-2 rounded-box border border-base-300 bg-base-100 p-3 text-base-content">
          <span className="font-semibold">{t}</span>
          <div className="flex flex-wrap gap-1">
            <button className="btn btn-primary btn-xs">primary</button>
            <button className="btn btn-secondary btn-xs">secondary</button>
            <button className="btn btn-accent btn-xs">accent</button>
          </div>
          <progress className="progress progress-primary" value={60} max={100} />
        </div>
      ))}
    </div>
  );
}

function SettingsDemo() {
  const [sound, setSound, loaded] = useSetting("sound", true);
  return (
    <label className="flex items-center gap-3">
      <input type="checkbox" className="toggle toggle-primary" checked={sound} disabled={!loaded} onChange={(e) => setSound(e.target.checked)} />
      <span>
        Sonido: <b>{loaded ? (sound ? "activado" : "desactivado") : "cargando…"}</b> (guardado en IndexedDB; abre otra pestaña y cámbialo)
      </span>
    </label>
  );
}

function ThemeDemo() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-3">
      <ThemePicker showLabel />
      <span className="text-sm">
        Tema actual: <b className="font-mono">{theme ?? "…"}</b>
      </span>
    </div>
  );
}

function PwaDemo() {
  const { isInstallable, isInstalled, isIOS, isOnline } = usePWA();
  const flags = { isInstallable, isInstalled, isIOS, isOnline };
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(flags).map(([key, value]) => (
        <span key={key} className={`badge ${value ? "badge-success" : "badge-ghost"}`}>
          {key}: {String(value)}
        </span>
      ))}
    </div>
  );
}

function ToasterDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn btn-sm btn-success" onClick={() => showToast("success", "Guardado")}>success</button>
      <button className="btn btn-sm btn-error" onClick={() => showToast("error", "Algo salió mal")}>error</button>
      <button className="btn btn-sm btn-info" onClick={() => showToast("info", "Para tu información")}>info</button>
    </div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn btn-sm btn-primary" onClick={() => setOpen(true)}>Abrir modal</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold">Hola</h3>
        <p className="py-3 text-sm">En celular sale desde abajo; Esc o clic fuera lo cierra.</p>
        <div className="modal-action">
          <button className="btn" onClick={() => setOpen(false)}>Listo</button>
        </div>
      </Modal>
    </>
  );
}

function ConfirmModalDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      showToast("success", "Eliminado");
    }, 1000);
  };
  return (
    <>
      <button className="btn btn-sm btn-error" onClick={() => setOpen(true)}>Eliminar algo</button>
      <ConfirmModal open={open} title="¿Eliminar?" confirmLabel="Eliminar" confirmClassName="btn-error" loading={loading} onConfirm={confirm} onCancel={() => setOpen(false)}>
        Esta acción no se puede deshacer.
      </ConfirmModal>
    </>
  );
}

function SpinnerDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" message="Cargando…" />
    </div>
  );
}

function DropdownDemo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Acciones de un registro:</span>
      <DropdownButton
        items={[
          { label: "Editar", icon: PencilSquareIcon, onClick: () => showToast("info", "Editar") },
          { label: "Duplicar", icon: DocumentDuplicateIcon, onClick: () => showToast("info", "Duplicar") },
          { label: "Eliminar", icon: TrashIcon, className: "text-error", onClick: () => showToast("error", "Eliminar") },
        ]}
      />
    </div>
  );
}

function SearchDemo() {
  const [term, setTerm] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <SearchInput onSearch={setTerm} placeholder="Busca algo…" />
      <span className="text-sm text-base-content/70">
        onSearch (con 300 ms de debounce): <b className="font-mono">{JSON.stringify(term)}</b>
      </span>
    </div>
  );
}

type Client = { id: string; name: string; email: string; city: string; plan: "Pro" | "Básico"; amount: number; since: Date | null };

const CLIENTS: Client[] = [
  { id: "1", name: "Ana López", email: "ana@ejemplo.com", city: "Melbourne", plan: "Pro", amount: 1250, since: new Date("2025-03-12") },
  { id: "2", name: "Bruno Díaz", email: "bruno@ejemplo.com", city: "Guadalajara", plan: "Básico", amount: 320, since: new Date("2026-01-08") },
  { id: "3", name: "Carla Méndez", email: "carla@ejemplo.com", city: "CDMX", plan: "Pro", amount: 980, since: null },
  { id: "4", name: "Diego Ruiz", email: "diego@ejemplo.com", city: "Monterrey", plan: "Básico", amount: 45, since: new Date("2024-11-30") },
];

const CLIENT_COLUMNS: Column<Client>[] = [
  { key: "name", label: "Nombre", sortable: true, mobile: "title", hideable: false },
  { key: "email", label: "Correo", mobile: "always" },
  { key: "city", label: "Ciudad", sortable: true },
  {
    key: "plan",
    label: "Plan",
    sortable: true,
    render: (c) => <span className={`badge badge-sm ${c.plan === "Pro" ? "badge-primary" : "badge-ghost"}`}>{c.plan}</span>,
  },
  { key: "amount", label: "Monto", sortable: true, className: "text-end tabular-nums", render: (c) => `$${c.amount.toLocaleString("es-MX")}` },
  { key: "since", label: "Cliente desde", sortable: (c) => c.since, defaultVisible: false, render: (c) => c.since?.toLocaleDateString("es-MX") ?? "—" },
];

export function TableDemo() {
  const [query, setQuery] = useState("");
  const [empty, setEmpty] = useState(false);
  const rows = empty ? [] : CLIENTS.filter((c) => `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SearchInput onSearch={setQuery} placeholder="Buscar cliente" className="input-sm flex-1" />
        <ColumnPicker tableId="demo-clientes" columns={CLIENT_COLUMNS} />
        <label className="label gap-2 text-sm">
          <input type="checkbox" className="toggle toggle-sm" checked={empty} onChange={(e) => setEmpty(e.target.checked)} />
          Vacía
        </label>
      </div>
      <ResponsiveTable
        id="demo-clientes"
        columns={CLIENT_COLUMNS}
        rows={rows}
        rowKey={(c) => c.id}
        emptyMessage="Ningún cliente coincide"
        actions={(c) => (
          <DropdownButton
            items={[
              { label: "Editar", icon: PencilSquareIcon, onClick: () => showToast("info", `Editar a ${c.name}`) },
              { label: "Eliminar", icon: TrashIcon, className: "text-error", onClick: () => showToast("error", `Eliminar a ${c.name}`) },
            ]}
          />
        )}
      />
      <span className="text-xs text-base-content/60">Angosta la ventana para ver las tarjetas; las columnas elegidas se guardan en IndexedDB.</span>
    </div>
  );
}

const ShellLink =({ href, text }: { href: string; text: string }) => (
  <Link href={href} className="btn btn-sm btn-primary">
    {text}
  </Link>
);

const DEMOS: Record<string, ComponentType> = {
  navigation: () => <span className="text-sm">Se ve en acción dentro de los dos layouts de abajo.</span>,
  "mobile-shell": () => <ShellLink href="/demo/mobile" text="Abrir demo del layout móvil" />,
  "dashboard-shell": () => <ShellLink href="/demo/dashboard" text="Abrir demo del dashboard" />,
  "dropdown-button": DropdownDemo,
  "search-input": SearchDemo,
  "responsive-table": () => (
    <div className="flex flex-col gap-3">
      <TableDemo />
      <ShellLink href="/demo/table" text="Abrir a pantalla completa" />
    </div>
  ),
  "column-picker": () => <span className="text-sm">Se ve junto a la tabla de arriba.</span>,
  themes: ThemesDemo,
  "use-setting": SettingsDemo,
  theme: ThemeDemo,
  pwa: PwaDemo,
  toaster: ToasterDemo,
  modal: ModalDemo,
  "confirm-modal": ConfirmModalDemo,
  spinner: SpinnerDemo,
  "button-copy": () => <ButtonCopy text="npx shadcn add @xiuh/button-copy" />,
};

/** Demo en vivo del ítem del registro (si tiene) */
export default function Demo({ name }: { name: string }) {
  const Component = DEMOS[name];
  if (!Component) return null;
  return (
    <div className="rounded-box border border-dashed border-base-300 bg-base-200 p-4">
      <Component />
    </div>
  );
}
