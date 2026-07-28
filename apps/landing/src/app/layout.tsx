import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Guaimbês Paisagismo — Jardinagem e Paisagismo em Divinópolis, MG",
  description:
    "Plantio e manutenção de jardins, revitalização de áreas verdes e produção de plantas ornamentais em Divinópolis e região. Transformamos espaços ao ar livre em ambientes deslumbrantes e funcionais.",
  keywords: [
    "paisagismo",
    "jardinagem",
    "Divinópolis",
    "plantas ornamentais",
    "manutenção de jardins",
    "áreas verdes",
  ],
  openGraph: {
    title: "Guaimbês Paisagismo",
    description:
      "Jardinagem e paisagismo em Divinópolis e região — verde, vivo e bem cuidado.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
