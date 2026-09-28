import type { Metadata, Viewport } from "next";
import { Comfortaa, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { SITE_CONFIG } from "@/lib/constants";

const headingFont = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  weight: ["400", "600", "700"],
  display: "swap",
});

const bodyFont = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.umenie.net"),
  title: {
    default: "Образователен клуб „УМеНИе“ – Начало | Бургас",
    template: "%s | Клуб УМеНИе",
  },
  description:
    "Образователен клуб „УМеНИе“ в гр. Бургас, к-с Славейков. Уроци и курсове по английски, математика, български език, учебна занималня, шах, плетиво и арт занимания за успешни деца.",
  keywords: [
    "умение",
    "клуб умение",
    "образователен клуб умение",
    "умение бургас",
    "занималня бургас",
    "занималня славейков",
    "уроци бургас",
    "курсове за деца бургас",
    "шах бургас",
    "плетиво бургас",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  alternates: {
    canonical: "https://www.umenie.net",
  },
  openGraph: {
    title: "Образователен клуб „УМеНИе“ – Начало | Бургас",
    description:
      "Образователен клуб „УМеНИе“ в гр. Бургас, к-с Славейков. Уроци и курсове по английски, математика, български език, учебна занималня, шах, плетиво и арт занимания за успешни деца.",
    url: "https://www.umenie.net",
    siteName: "Образователен клуб „УМеНИе“",
    locale: "bg_BG",
    type: "website",
    images: [
      {
        url: "https://www.umenie.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Образователен клуб „УМеНИе“ Бургас",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Образователен клуб „УМеНИе“ – Начало | Бургас",
    description:
      "Уроци, курсове, учебна занималня, шах, плетиво и арт занимания за успешни деца в гр. Бургас, ж.к. Славейков.",
    images: ["https://www.umenie.net/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#887ed8",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Образователен клуб „УМеНИе“",
      "alternateName": ["Умение", "Клуб Умение", "УМеНИе", "Умение Начало"],
      "url": "https://www.umenie.net/"
    },
    {
      "@type": "EducationalOrganization",
      "name": "Образователен клуб „УМеНИе“",
      "alternateName": ["Клуб Умение", "УМеНИе Бургас"],
      "url": "https://www.umenie.net",
      "logo": "https://www.umenie.net/icon.png",
      "image": "https://www.umenie.net/og-image.jpg",
      "description":
        "Уроци, курсове, занималня, шах, плетиво и арт занимания за деца в гр. Бургас, ж.к. Славейков.",
      "telephone": SITE_CONFIG.phoneRaw,
      "email": SITE_CONFIG.email,
      "address": {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.locationFull,
        addressLocality: "Бургас",
        postalCode: "8000",
        addressCountry: "BG",
      },
      "sameAs": [
        SITE_CONFIG.social.facebook,
        SITE_CONFIG.social.instagram,
      ],
      "areaServed": "Бургас",
      "priceRange": "$$",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans bg-[#f1f2f6] text-slate-800 antialiased overflow-x-hidden min-h-screen flex flex-col selection:bg-brand-purple selection:text-white`}>
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <ConditionalFooter>
          <Footer />
        </ConditionalFooter>
      </body>
    </html>
  );
}
