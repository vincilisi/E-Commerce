import type { Metadata } from "next";
<<<<<<< HEAD
import { Inter } from "next/font/google";
=======
import { Manrope, Playfair_Display } from "next/font/google";
>>>>>>> master
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatAssistantSimple from "@/components/ChatAssistantSimple";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/LanguageContext";
<<<<<<< HEAD

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Il Desiderio di una Stella - Portachiavi Artigianali",
  description: "Shop online di portachiavi fatti a mano. Ogni pezzo è unico e realizzato con cura e passione.",
};
=======
import { prisma } from "@/lib/prisma";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst({
    select: { siteName: true }
  }).catch(() => null);

  const siteName = settings?.siteName?.trim() || 'Il tuo sito';

  return {
    title: `${siteName} - Portachiavi Artigianali`,
    description: "Shop online di portachiavi fatti a mano. Ogni pezzo è unico e realizzato con cura e passione.",
  };
}
>>>>>>> master

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
<<<<<<< HEAD
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
=======
      <body className={`${manrope.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
>>>>>>> master
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen">
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
