import type { NextConfig } from "next";

// En GitHub Pages el sitio vive en /xiuh-ui; en local, en la raíz
const basePath = process.env.GITHUB_PAGES === "true" ? "/xiuh-ui" : "";

const nextConfig: NextConfig = {
  // Sitio estático: catálogo + public/r/*.json del registro
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
