import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SITE_CONFIG } from "@/lib/site-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cel-Car Funilaria e Pintura | Repintura Automotiva no Rio de Janeiro",
  description:
    "Oficina especializada em repintura, funilaria, polimento e estética automotiva no Rio de Janeiro. Orçamento em 5 minutos, atendimento humano, garantia de serviço. Rua José dos Reis, 2047 - Inhaúma, RJ.",
  keywords: [
    "funilaria Rio de Janeiro",
    "repintura automotiva RJ",
    "pintura de carro",
    "polimento automotivo",
    "estética automotiva Inhaúma",
    "Cel-Car",
    "Célio Evangelista",
    "recuperação de parachoques",
    "cristalização de pintura",
  ],
  authors: [{ name: "Célio Evangelista", url: "https://cel-car.vercel.app" }],
  creator: "Célio Evangelista",
  publisher: "Cel-Car Funilaria e Pintura",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Cel-Car Funilaria e Pintura | Repintura Automotiva no Rio",
    description:
      "Devolvemos o brilho original do seu carro. Orçamento em 5 minutos, garantia de serviço e atendimento humano em Inhaúma, RJ.",
    url: "https://cel-car.vercel.app",
    siteName: "Cel-Car Funilaria e Pintura",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cel-Car Funilaria e Pintura",
    description: "Repintura, funilaria e estética automotiva no Rio de Janeiro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Structured data for Google (LocalBusiness schema)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoBodyShop",
  name: SITE_CONFIG.companyFullName,
  image: "https://cel-car.vercel.app/favicon.svg",
  "@id": "https://cel-car.vercel.app",
  url: "https://cel-car.vercel.app",
  telephone: `+${SITE_CONFIG.phoneRaw}`,
  email: SITE_CONFIG.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address.street,
    addressLocality: SITE_CONFIG.address.city,
    addressRegion: SITE_CONFIG.address.state,
    postalCode: SITE_CONFIG.address.zip,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE_CONFIG.mapsCoords.lat,
    longitude: SITE_CONFIG.mapsCoords.lng,
  },
  hasMap: SITE_CONFIG.mapsUrl,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
  sameAs: [],
  founder: {
    "@type": "Person",
    name: SITE_CONFIG.owner,
  },
  knowsAbout: [
    "Repintura automotiva",
    "Funilaria",
    "Polimento e cristalização",
    "Recuperação de parachoques",
    "Alinhamento de painéis",
    "Estética automotiva",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}
