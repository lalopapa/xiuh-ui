import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Code_Pro } from "next/font/google";
import Toaster from "@/components/ui/toaster";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const sourceCode = Source_Code_Pro({ variable: "--font-source-code", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "xiuh-ui",
  description: "Registro de componentes daisyUI de Xiuhlab",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Sitio estático: no hay cookie en el server; useTheme aplica el tema guardado al cargar
    <html lang="es" className={`${jakarta.variable} ${sourceCode.variable}`} suppressHydrationWarning>
      <body className="min-h-svh bg-base-200 font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
