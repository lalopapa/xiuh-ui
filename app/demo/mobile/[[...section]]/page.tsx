import { MobileDemo } from "../../demo-shells";

export const generateStaticParams = () => [{ section: [] }, { section: ["clientes"] }, { section: ["ajustes"] }];

export default async function Page({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section } = await params;
  return <MobileDemo section={section?.[0] ?? ""} />;
}
