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
  metadataBase: new URL("https://www.umenie.net"),
  title: {
    default: "Образователен клуб „УМеНИе“ | Бургас",
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
    title: "Образователен клуб „УМеНИе“ | Бургас",
    description:
      "Образователен клуб „УМеНИе“ в гр. Бургас, к-с Славейков. Уроци и курсове по английски, математика, български език, учебна занималня, шах, плетиво и арт занимания за успешни деца.",
    url: "https://www.umenie.net",
    siteName: "Образователен клуб „УМеНИе“",
    locale: "bg_BG",
    type: "website",
    images: [
      {
        url: "/images/opening-photo.png",
        width: 1200,
        height: 630,
        alt: "Образователен клуб „УМеНИе“ Бургас",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Образователен клуб „УМеНИе“ | Бургас",
    description:
      "Уроци, курсове, занималня, шах, плетиво и арт занимания за деца в гр. Бургас, ж.к. Славейков.",
    images: ["/images/opening-photo.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#887ed8",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Образователен клуб „УМеНИе“",
  alternateName: ["Клуб Умение", "УМеНИе Бургас"],
  url: "https://www.umenie.net",
  logo: "https://www.umenie.net/images/logo.png",
  image: "https://www.umenie.net/images/opening-photo.png",
  description:
    "Уроци, курсове, занималня, шах, плетиво и арт занимания за деца в гр. Бургас, ж.к. Славейков.",
  telephone: "+359877488481",
  email: "umenie48@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ж.к. Славейков, бл. 48, партер",
    addressLocality: "Бургас",
    postalCode: "8000",
    addressCountry: "BG",
  },
  areaServed: "Бургас",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={`${comfortaa.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#f1f2f6] text-brand-dark min-h-screen flex flex-col selection:bg-brand-purple selection:text-white">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
