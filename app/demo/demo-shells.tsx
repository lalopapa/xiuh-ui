"use client";
import { ArrowLeftIcon, Cog6ToothIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import type { NavItem } from "@/lib/navigation";
import AppShell from "@/components/layout/app-shell";
import Brand from "@/components/layout/brand";
import MobileShell from "@/components/layout/mobile-shell";
import UserMenu from "@/components/layout/user-menu";
import DropdownButton from "@/components/ui/dropdown-button";
import ThemePicker from "@/components/ui/theme-picker";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icons/logo.svg`;

const itemsFor = (base: string): NavItem[] => [
  { label: "Inicio", href: base, icon: HomeIcon },
  { label: "Clientes", href: `${base}/clientes`, icon: UsersIcon },
  { label: "Ajustes", href: `${base}/ajustes`, icon: Cog6ToothIcon, section: "footer" },
];

const CLIENTS = ["Ana López", "Bruno Díaz", "Carla Méndez", "Diego Ruiz"];

function Content({ section }: { section: string }) {
  if (section === "clientes") {
    return (
      <ul className="list rounded-box border border-base-300 bg-base-100">
        {CLIENTS.map((name) => (
          <li key={name} className="list-row items-center">
            <span className="font-medium">{name}</span>
            <DropdownButton items={[{ label: "Editar" }, { label: "Eliminar", className: "text-error" }]} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body">
        <h1 className="card-title">{section === "ajustes" ? "Ajustes" : "Inicio"}</h1>
        <p className="text-sm text-base-content/70">Cambia el ancho de la ventana: en móvil el menú se vuelve drawer.</p>
        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`} className="btn btn-sm btn-ghost self-start">
          <ArrowLeftIcon className="size-4" /> Volver al catálogo
        </a>
      </div>
    </div>
  );
}

export function DashboardDemo({ section }: { section: string }) {
  return (
    <AppShell
      items={itemsFor("/demo/dashboard")}
      sidebarHeader={<Brand logoSrc={logo} />}
      sidebarTitle="Menú"
      badges={{ "/demo/dashboard/clientes": 4 }}
      actions={
        <>
          <ThemePicker />
          <UserMenu name="Lalo Pérez" detail={<span className="badge badge-soft badge-primary badge-xs">Owner</span>} logoutHref="#" />
        </>
      }
    >
      <Content section={section} />
    </AppShell>
  );
}

export function MobileDemo({ section }: { section: string }) {
  return (
    <MobileShell items={itemsFor("/demo/mobile")} brand={<Brand logoSrc={logo} />} badges={{ "/demo/mobile/clientes": 4 }}>
      <div className="p-4">
        <Content section={section} />
      </div>
    </MobileShell>
  );
}
