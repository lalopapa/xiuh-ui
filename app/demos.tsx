"use client";
import { useState, type ComponentType } from "react";
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

const DEMOS: Record<string, ComponentType> = {
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
