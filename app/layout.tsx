import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Lato } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
})

export const metadata: Metadata = {
  title: "Guaimbês Paisagismo | Jardinagem e Paisagismo em Divinópolis",
  description:
    "Especialistas em Paisagismo e Manutenção de Jardins em Divinópolis e região. Transformamos seu espaço em um refúgio natural com técnica agronômica e design exclusivo.",
  keywords:
    "paisagismo divinópolis, jardinagem divinópolis, paisagista divinópolis, empresa paisagismo centro-oeste MG, jardins, manutenção jardins",
  openGraph: {
    title: "Guaimbês Paisagismo | Jardinagem e Paisagismo em Divinópolis",
    description: "Transformamos seu espaço em um refúgio natural. Especialistas em Paisagismo e Manutenção de Jardins.",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${lato.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
