'use client';

import { useEffect, useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PreviewPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            setSettings(data.settings || {});
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: settings?.backgroundColor || '#ffffff' }}>
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <Eye className="w-8 h-8" style={{ color: settings?.primaryColor }} />
                        <h1 className="text-4xl font-bold" style={{ color: settings?.textColor }}>Anteprima Tema</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={loadSettings}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90 transition"
                            style={{ backgroundColor: settings?.primaryColor, color: settings?.buttonTextColor }}
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Ricarica</span>
                        </button>
                        <Link
                            href="/admin/impostazioni"
                            className="px-4 py-2 rounded-lg border-2 hover:opacity-80 transition"
                            style={{ borderColor: settings?.primaryColor, color: settings?.primaryColor }}
                        >
                            Modifica Impostazioni
                        </Link>
                    </div>
                </div>

                {/* Griglia di elementi di anteprima */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card Esempio */}
                    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: settings?.cardBackground, borderColor: settings?.borderColor, borderWidth: '1px' }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: settings?.textColor }}>Card di Esempio</h2>
                        <p className="mb-4" style={{ color: settings?.textColor, opacity: 0.8 }}>
                            Questa è una card di esempio che mostra come apparirà il contenuto con i colori personalizzati.
                        </p>
                        <button
                            className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition"
                            style={{ backgroundColor: settings?.primaryColor, color: settings?.buttonTextColor }}
                        >
                            Pulsante Primario
                        </button>
                    </div>

                    {/* Colori */}
                    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: settings?.cardBackground }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: settings?.textColor }}>Palette Colori</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: settings?.primaryColor }}>
                                <span className="font-semibold" style={{ color: settings?.buttonTextColor }}>Primario</span>
                                <span className="text-sm" style={{ color: settings?.buttonTextColor }}>{settings?.primaryColor}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: settings?.secondaryColor }}>
                                <span className="font-semibold text-white">Secondario</span>
                                <span className="text-sm text-white">{settings?.secondaryColor}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: settings?.accentColor }}>
                                <span className="font-semibold text-gray-800">Accento</span>
                                <span className="text-sm text-gray-800">{settings?.accentColor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tipografia */}
                    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: settings?.cardBackground, fontFamily: settings?.fontFamily }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: settings?.textColor }}>Tipografia</h2>
                        <p className="text-sm mb-2" style={{ color: settings?.textColor, opacity: 0.7 }}>Font: {settings?.fontFamily}</p>
                        <div className="space-y-2">
                            <p className="text-3xl font-bold" style={{ color: settings?.textColor }}>Heading Grande</p>
                            <p className="text-xl font-semibold" style={{ color: settings?.textColor }}>Heading Medio</p>
                            <p className="text-base" style={{ color: settings?.textColor }}>Testo normale per il corpo del contenuto.</p>
                            <p className="text-sm" style={{ color: settings?.textColor, opacity: 0.7 }}>Testo piccolo per note e dettagli.</p>
                        </div>
                    </div>

                    {/* Gradienti */}
                    <div className="rounded-lg shadow-lg p-6" style={{
                        background: `linear-gradient(to right, ${settings?.primaryColor}, ${settings?.secondaryColor})`
                    }}>
                        <h2 className="text-2xl font-bold mb-4 text-white">Gradiente</h2>
                        <p className="text-white mb-4">
                            Questo gradiente usa i colori primario e secondario per creare sfumature dinamiche.
                        </p>
                        <div className="inline-block px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: settings?.accentColor, color: settings?.textColor }}>
                            Pulsante Accento
                        </div>
                    </div>

                    {/* Bordi e Divisori */}
                    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: settings?.cardBackground, borderColor: settings?.borderColor, borderWidth: '2px' }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: settings?.textColor }}>Bordi e Divisori</h2>
                        <div className="space-y-4">
                            <div className="p-3 rounded border" style={{ borderColor: settings?.borderColor }}>
                                <p style={{ color: settings?.textColor }}>Elemento con bordo</p>
                            </div>
                            <div className="h-px" style={{ backgroundColor: settings?.borderColor }}></div>
                            <div className="p-3 rounded border-2" style={{ borderColor: settings?.primaryColor }}>
                                <p style={{ color: settings?.primaryColor }}>Elemento con bordo colorato</p>
                            </div>
                        </div>
                    </div>

                    {/* Stato Hover */}
                    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: settings?.cardBackground }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: settings?.textColor }}>Stati Interattivi</h2>
                        <div className="space-y-3">
                            <button className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition" style={{ backgroundColor: settings?.primaryColor, color: settings?.buttonTextColor }}>
                                Pulsante Hover
                            </button>
                            <button className="w-full py-3 rounded-lg font-semibold border-2 hover:opacity-80 transition" style={{ borderColor: settings?.primaryColor, color: settings?.primaryColor }}>
                                Pulsante Outline
                            </button>
                            <button className="w-full py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed" style={{ backgroundColor: settings?.primaryColor, color: settings?.buttonTextColor }}>
                                Pulsante Disabilitato
                            </button>
                        </div>
                    </div>
                </div>

                {/* Istruzioni */}
                <div className="mt-8 rounded-lg p-6" style={{ backgroundColor: settings?.cardBackground, borderColor: settings?.primaryColor, borderWidth: '2px', borderStyle: 'dashed' }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: settings?.primaryColor }}>💡 Come usare l'anteprima</h3>
                    <ul className="space-y-2" style={{ color: settings?.textColor }}>
                        <li>• Apri le <Link href="/admin/impostazioni" className="underline hover:opacity-80" style={{ color: settings?.primaryColor }}>Impostazioni</Link> in un'altra scheda</li>
                        <li>• Modifica i colori e il font</li>
                        <li>• Clicca "Ricarica" qui per vedere i cambiamenti in tempo reale</li>
                        <li>• Quando sei soddisfatto, salva le impostazioni!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
