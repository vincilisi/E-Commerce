import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatAssistantSimple from "@/components/ChatAssistantSimple";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/LanguageContext";
import { getSiteUrl } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Il Desiderio di una Stella | Portachiavi Artigianali Premium",
    template: "%s | Il Desiderio di una Stella",
  },
  description: "Shop online di portachiavi fatti a mano. Ogni pezzo e unico, realizzato con cura artigianale e spedizione tracciata.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    title: "Il Desiderio di una Stella | Portachiavi Artigianali Premium",
    description: "Creazioni artigianali premium: portachiavi unici, personalizzazioni e spedizione tracciata.",
    url: "/",
    siteName: "Il Desiderio di una Stella",
  },
  twitter: {
    card: "summary_large_image",
    title: "Il Desiderio di una Stella | Portachiavi Artigianali Premium",
    description: "Creazioni artigianali premium: portachiavi unici, personalizzazioni e spedizione tracciata.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen lux-shell">
              {children}
            </main>
            <Footer />
            <ChatAssistantSimple />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
