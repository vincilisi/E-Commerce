'use client';

import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Carica le impostazioni dal database
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    const {
                        primaryColor,
                        secondaryColor,
                        accentColor,
                        backgroundColor,
                        textColor,
                        cardBackground,
                        borderColor,
                        buttonTextColor,
                        fontFamily,
                        customFontUrl,
                        siteName
                    } = data.settings;

                    // Applica tutti i colori come variabili CSS
                    document.documentElement.style.setProperty('--color-primary', primaryColor);
                    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
                    document.documentElement.style.setProperty('--color-accent', accentColor);
                    document.documentElement.style.setProperty('--color-background', backgroundColor);
                    document.documentElement.style.setProperty('--color-text', textColor);
                    document.documentElement.style.setProperty('--color-card-bg', cardBackground);
                    document.documentElement.style.setProperty('--color-border', borderColor);
                    document.documentElement.style.setProperty('--color-button-text', buttonTextColor);

                    // Applica il colore di sfondo al body
                    document.body.style.backgroundColor = backgroundColor;

                    // Aggiorna il titolo della pagina
                    if (siteName) {
                        document.title = `${siteName} - Portachiavi Artigianali`;
                    }

                    // Applica il font
                    if (fontFamily) {
                        if (fontFamily === 'Custom' && customFontUrl) {
                            // Usa il font personalizzato da URL
                            const link = document.createElement('link');
                            link.href = customFontUrl;
                            link.rel = 'stylesheet';
                            document.head.appendChild(link);

                            // Estrai il nome del font dall'URL (es: "Dancing+Script" -> "Dancing Script")
                            const fontNameMatch = customFontUrl.match(/family=([^&:]+)/);
                            if (fontNameMatch) {
                                const fontName = fontNameMatch[1].replace(/\+/g, ' ');
                                document.documentElement.style.setProperty('--font-family', `"${fontName}", sans-serif`);
                                document.body.style.fontFamily = `"${fontName}", sans-serif`;
                            }
                        } else {
                            // Carica il font da Google Fonts
                            const link = document.createElement('link');
                            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
                            link.rel = 'stylesheet';
                            document.head.appendChild(link);

                            // Applica il font al body
                            document.documentElement.style.setProperty('--font-family', `"${fontFamily}", sans-serif`);
                            document.body.style.fontFamily = `"${fontFamily}", sans-serif`;
                        }
                    }
                }
            })
            .catch(() => {
                // Usa i colori di default se il fetch fallisce
                document.documentElement.style.setProperty('--color-primary', '#AA3939');
                document.documentElement.style.setProperty('--color-secondary', '#BB5B80');
                document.documentElement.style.setProperty('--color-accent', '#fde047');
                document.documentElement.style.setProperty('--color-background', '#f9fafb');
                document.documentElement.style.setProperty('--color-text', '#1f2937');
                document.documentElement.style.setProperty('--color-card-bg', '#ffffff');
                document.documentElement.style.setProperty('--color-border', '#e5e7eb');
                document.documentElement.style.setProperty('--color-button-text', '#ffffff');
                document.body.style.backgroundColor = '#f9fafb';
            });
    }, []);

    if (!mounted) return null;

    return <>{children}</>;
}