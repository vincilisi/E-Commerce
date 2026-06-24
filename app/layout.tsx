import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatAssistantSimple from "@/components/ChatAssistantSimple";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/LanguageContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Il Desiderio di una Stella - Portachiavi Artigianali",
  description: "Shop online di portachiavi fatti a mano. Ogni pezzo è unico e realizzato con cura e passione.",
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
