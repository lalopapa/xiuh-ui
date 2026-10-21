import type { NextConfig } from "next";

// En GitHub Pages el sitio vive en /xiuh-ui; en local, en la raíz
const basePath = process.env.GITHUB_PAGES === "true" ? "/xiuh-ui" : "";

const nextConfig: NextConfig = {
  // Sitio estático: catálogo + public/r/*.json del registro
  output: "export",
  basePath,
  images: { unoptimized: true },
  // Para rutas que no pasan por next/link (p. ej. <img src>)
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
