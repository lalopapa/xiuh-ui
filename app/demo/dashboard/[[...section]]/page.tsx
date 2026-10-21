import { DashboardDemo } from "../../demo-shells";

export const generateStaticParams = () => [{ section: [] }, { section: ["clientes"] }, { section: ["ajustes"] }];

export default async function Page({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section } = await params;
  return <DashboardDemo section={section?.[0] ?? ""} />;
}
