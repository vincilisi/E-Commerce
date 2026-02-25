import { useEffect, useState } from 'react';

interface SiteSettings {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    siteName: string;
}

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>({
        primaryColor: '#AA3939',
        secondaryColor: '#BB5B80',
        accentColor: '#fde047',
        siteName: 'Il Desiderio di una Stella'
    });

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setSettings(data.settings);
                    applyColors(data.settings);
                }
            })
            .catch(() => {
                // Usa i colori di default
                applyColors(settings);
            });
    }, []);

    const applyColors = (colors: SiteSettings) => {
        document.documentElement.style.setProperty('--color-primary', colors.primaryColor);
        document.documentElement.style.setProperty('--color-secondary', colors.secondaryColor);
        document.documentElement.style.setProperty('--color-accent', colors.accentColor);
    };

    return settings;
}
