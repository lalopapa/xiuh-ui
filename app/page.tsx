import registry from "@/registry.json";
import ButtonCopy from "@/components/ui/button-copy";
import ThemePicker from "@/components/ui/theme-picker";
import Demo from "./demos";

type Item = { name: string; title?: string; description?: string; docs?: string; registryDependencies?: string[] };

export default function CatalogPage() {
  const items = registry.items as Item[];
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">xiuh-ui</h1>
          <p className="text-base-content/70">Componentes, temas y piezas PWA de Xiuhlab para copiar con el CLI de shadcn.</p>
        </div>
        <ThemePicker />
      </header>

      <section className="card border border-base-300 bg-base-100">
        <div className="card-body gap-2 text-sm">
          <h2 className="card-title text-base">Cómo se usa</h2>
          <p>
            Los proyectos nuevos salen de <code className="font-mono">xiuh-starter</code>, que ya trae el registro configurado en{" "}
            <code className="font-mono">components.json</code>. Desde ahí:
          </p>
          <code className="rounded-field bg-base-200 p-3 font-mono">npx shadcn add @xiuh/modal</code>
        </div>
      </section>

      {items.map((item) => {
        const command = `npx shadcn add @xiuh/${item.name}`;
        return (
          <section key={item.name} id={item.name} className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="card-title">{item.title ?? item.name}</h2>
                  <p className="text-sm text-base-content/70">{item.description}</p>
                </div>
                <ButtonCopy text={command} label={command} copiedLabel="Copiado" className="btn btn-sm btn-soft btn-primary font-mono" />
              </div>
              {!!item.registryDependencies?.length && (
                <div className="flex flex-wrap gap-1">
                  {item.registryDependencies.map((dep) => (
                    <span key={dep} className="badge badge-ghost badge-sm font-mono">
                      {dep}
                    </span>
                  ))}
                </div>
              )}
              {item.docs && <div className="alert alert-soft alert-info text-sm">{item.docs}</div>}
              <Demo name={item.name} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
