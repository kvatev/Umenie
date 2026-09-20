import type { Metadata, Viewport } from "next";
import { Comfortaa, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants";

const comfortaa = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | Уроци, курсове и занимания в Бургас`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: `${SITE_CONFIG.tagline}. ${SITE_CONFIG.subtagline} Малки групи, индивидуално внимание, в ж.к. Славейков, гр. Бургас.`,
  keywords: [
    "образователен клуб УМеНИе",
    "уроци Бургас",
    "занималня Бургас Славейков",
    "математика Бургас",
    "български език",
    "английски език",
    "шах за деца Бургас",
    "арт занимания Бургас",
    "плетиво за деца",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  metadataBase: new URL("https://ymenie.bg"),
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    locale: "bg_BG",
    type: "website",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: "/images/opening-photo.png",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#887ed8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={`${comfortaa.variable} ${montserrat.variable}`}>
      <body className="font-sans bg-[#f1f2f6] text-brand-dark min-h-screen flex flex-col selection:bg-brand-purple selection:text-white">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
