'use client';

import { useEffect, useState } from 'react';
import { Save, Palette, Type, Image as ImageIcon, Settings, Search, MessageCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

type Tab = 'generale' | 'colori' | 'tipografia' | 'logo' | 'ricerca' | 'assistente';

export default function AdminImpostazioni() {
    const [activeTab, setActiveTab] = useState<Tab>('generale');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'Il Desiderio di una Stella',
        logo: '',
        primaryColor: '#9333ea',
        secondaryColor: '#6366f1',
        accentColor: '#fde047',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        cardBackground: '#ffffff',
        borderColor: '#e5e7eb',
        buttonTextColor: '#ffffff',
        fontFamily: 'Inter',
        customFontUrl: '',
        // Search Bar
        searchBgColor: '#ffffff',
        searchTextColor: '#374151',
        searchPlaceholder: '#9ca3af',
        searchBorderColor: '#e5e7eb',
        searchIconColor: '#6b7280',
        // Virtual Assistant
        assistantEnabled: true,
        assistantName: 'Assistente Virtuale',
        assistantColor: '#9333ea',
        assistantTextColor: '#ffffff',
        assistantWelcome: '👋 Ciao! Sono il tuo assistente virtuale. Come posso aiutarti oggi?',
        assistantPosition: 'right'
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.settings) {
                setSettings(data.settings);
            }
        } catch (error) {
            toast.error('Errore nel caricamento impostazioni');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                toast.success('Impostazioni salvate! Ricarica la pagina per vedere i cambiamenti.');
            } else {
                toast.error('Errore nel salvataggio');
            }
        } catch (error) {
            toast.error('Errore nel salvataggio');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Verifica che sia un'immagine
        if (!file.type.startsWith('image/')) {
            toast.error('Per favore carica solo file immagine');
            return;
        }

        // Verifica dimensione (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Il file è troppo grande. Massimo 5MB');
            return;
        }

        setUploading(true);

        try {
            // Converti il file in base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSettings({ ...settings, logo: base64String });
                toast.success('Logo caricato! Clicca "Salva Impostazioni" per applicare.');
            };
            reader.onerror = () => {
                toast.error('Errore nella lettura del file');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('Errore nel caricamento del file');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    const tabs = [
        { id: 'generale' as Tab, label: 'Generale', icon: Settings },
        { id: 'colori' as Tab, label: 'Colori', icon: Palette },
        { id: 'tipografia' as Tab, label: 'Tipografia', icon: Type },
        { id: 'logo' as Tab, label: 'Logo', icon: ImageIcon },
        { id: 'ricerca' as Tab, label: 'Ricerca', icon: Search },
        { id: 'assistente' as Tab, label: 'Assistente', icon: MessageCircle },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/admin" className="hover:opacity-80 mb-6 inline-block" style={{ color: 'var(--color-primary)' }}>
                    ← Torna alla Dashboard
                </Link>

                <div className="rounded-lg shadow-md" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    {/* Tab Navigation */}
                    <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-6 py-4 font-semibold transition border-b-2 ${activeTab === tab.id
                                            ? 'border-b-2'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        style={{
                                            borderBottomColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                                            color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text)'
                                        }}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* GENERALE TAB */}
                        {activeTab === 'generale' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                                    Impostazioni Generali
                                </h2>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Nome del Sito</label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="Il Desiderio di una Stella"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Questo nome apparirà nella navbar, nel titolo della pagina e nella homepage
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* COLORI TAB */}
                        {activeTab === 'colori' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                                    Colori del Tema
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Primario</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#9333ea"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Pulsanti, link, navbar</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Secondario</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.secondaryColor}
                                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.secondaryColor}
                                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#6366f1"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Gradienti e sfumature</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Accento</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.accentColor}
                                                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.accentColor}
                                                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#fde047"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Elementi evidenziati</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Sfondo Pagina</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.backgroundColor}
                                                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.backgroundColor}
                                                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#ffffff"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Sfondo principale</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Testo</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.textColor}
                                                onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.textColor}
                                                onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#1f2937"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Testo principale</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Sfondo Card</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.cardBackground}
                                                onChange={(e) => setSettings({ ...settings, cardBackground: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.cardBackground}
                                                onChange={(e) => setSettings({ ...settings, cardBackground: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#ffffff"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Card e box bianchi</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Bordi</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.borderColor}
                                                onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.borderColor}
                                                onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#e5e7eb"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Bordi e divisori</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Testo Pulsanti</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.buttonTextColor}
                                                onChange={(e) => setSettings({ ...settings, buttonTextColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.buttonTextColor}
                                                onChange={(e) => setSettings({ ...settings, buttonTextColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="#ffffff"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Testo sui pulsanti</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TIPOGRAFIA TAB */}
                        {activeTab === 'tipografia' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                                    Tipografia
                                </h2>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Font Principale</label>
                                    <select
                                        value={settings.fontFamily}
                                        onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    >
                                        <option value="Inter">Inter (Moderno)</option>
                                        <option value="Roboto">Roboto (Classico)</option>
                                        <option value="Poppins">Poppins (Arrotondato)</option>
                                        <option value="Playfair Display">Playfair Display (Elegante)</option>
                                        <option value="Montserrat">Montserrat (Geometrico)</option>
                                        <option value="Lato">Lato (Leggero)</option>
                                        <option value="Open Sans">Open Sans (Universale)</option>
                                        <option value="Raleway">Raleway (Raffinato)</option>
                                        <option value="Merriweather">Merriweather (Serif)</option>
                                        <option value="Nunito">Nunito (Amichevole)</option>
                                        <option value="Custom">Font Personalizzato (da URL)</option>
                                    </select>
                                    <p className="text-sm text-gray-500 mt-1">Scegli il font per tutto il sito</p>
                                </div>

                                {settings.fontFamily === 'Custom' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            URL Font Personalizzato
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.customFontUrl}
                                            onChange={(e) => setSettings({ ...settings, customFontUrl: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            placeholder="https://fonts.googleapis.com/css2?family=..."
                                        />
                                        <p className="text-sm text-gray-600 mt-2">
                                            <strong>Esempio Google Fonts:</strong>
                                        </p>
                                        <code className="text-xs bg-white px-2 py-1 rounded block mt-1">
                                            https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap
                                        </code>
                                        <p className="text-sm text-gray-600 mt-3">
                                            Dopo aver incollato l&apos;URL, dovrai specificare il nome del font family nelle impostazioni CSS
                                        </p>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Come trovare font personalizzati:</strong>
                                    </p>
                                    <ol className="text-sm text-blue-700 mt-2 ml-4 list-decimal space-y-1">
                                        <li>Vai su <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Fonts</a></li>
                                        <li>Seleziona un font che ti piace</li>
                                        <li>Clicca su &quot;View selected families&quot;</li>
                                        <li>Copia l&apos;URL del link CSS</li>
                                        <li>Incollalo nel campo &quot;URL Font Personalizzato&quot;</li>
                                        <li>Seleziona &quot;Custom&quot; nel menu sopra</li>
                                    </ol>
                                </div>
                            </div>
                        )}

                        {/* LOGO TAB */}
                        {activeTab === 'logo' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                                    Logo del Sito
                                </h2>

                                {/* Upload da File Locale */}
                                <div className="border-2 border-dashed rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Carica Logo da File Locale
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" style={{ borderColor: 'var(--color-border)' }}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Clicca per caricare</span> o trascina qui
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, SVG (MAX. 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                    {uploading && (
                                        <p className="text-sm text-blue-600 mt-2">Caricamento in corso...</p>
                                    )}
                                </div>

                                {/* Divisore OR */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }}></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">OPPURE</span>
                                    </div>
                                </div>

                                {/* URL Logo */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">URL Logo da Internet</label>
                                    <input
                                        type="url"
                                        value={settings.logo && settings.logo.startsWith('data:') ? '' : (settings.logo || '')}
                                        onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="https://esempio.com/logo.png"
                                        disabled={!!(settings.logo && settings.logo.startsWith('data:'))}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Inserisci l&apos;URL del tuo logo. Apparirà nella navbar e nella homepage al posto della stella
                                    </p>
                                    {settings.logo && settings.logo.startsWith('data:') && (
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, logo: '' })}
                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Rimuovi logo caricato e usa URL invece
                                        </button>
                                    )}
                                </div>

                                {settings.logo && (
                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Anteprima Logo:</p>
                                        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                                            <img
                                                src={settings.logo}
                                                alt="Logo Preview"
                                                className="max-w-[200px] max-h-[100px] object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    toast.error('Errore nel caricamento del logo');
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Consigli per il logo:</strong>
                                    </p>
                                    <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc space-y-1">
                                        <li>Usa un&apos;immagine PNG con sfondo trasparente per migliori risultati</li>
                                        <li>Dimensioni consigliate: circa 200x200 pixel</li>
                                        <li><strong>Opzione 1:</strong> Carica un file dal tuo computer (convertito in base64)</li>
                                        <li><strong>Opzione 2:</strong> Carica su servizi come <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline">Imgur</a> o <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline">ImgBB</a> e usa l&apos;URL</li>
                                        <li>Il logo verrà automaticamente ridimensionato per adattarsi alla navbar</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* RICERCA TAB */}
                        {activeTab === 'ricerca' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                                    🔍 Barra di Ricerca
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Sfondo Barra</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.searchBgColor}
                                                onChange={(e) => setSettings({ ...settings, searchBgColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.searchBgColor}
                                                onChange={(e) => setSettings({ ...settings, searchBgColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Testo</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.searchTextColor}
                                                onChange={(e) => setSettings({ ...settings, searchTextColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.searchTextColor}
                                                onChange={(e) => setSettings({ ...settings, searchTextColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Placeholder</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.searchPlaceholder}
                                                onChange={(e) => setSettings({ ...settings, searchPlaceholder: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.searchPlaceholder}
                                                onChange={(e) => setSettings({ ...settings, searchPlaceholder: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Bordo</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.searchBorderColor}
                                                onChange={(e) => setSettings({ ...settings, searchBorderColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.searchBorderColor}
                                                onChange={(e) => setSettings({ ...settings, searchBorderColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Icona</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.searchIconColor}
                                                onChange={(e) => setSettings({ ...settings, searchIconColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.searchIconColor}
                                                onChange={(e) => setSettings({ ...settings, searchIconColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Anteprima */}
                                <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                    <p className="text-sm font-semibold text-gray-700 mb-4">Anteprima Barra di Ricerca:</p>
                                    <div className="p-4 rounded-lg" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}>
                                        <div className="relative max-w-md mx-auto">
                                            <input
                                                type="text"
                                                placeholder="Cerca prodotti..."
                                                className="w-full px-4 py-2 pr-10 rounded-lg focus:outline-none"
                                                style={{
                                                    backgroundColor: settings.searchBgColor,
                                                    color: settings.searchTextColor,
                                                    borderColor: settings.searchBorderColor,
                                                    borderWidth: '1px',
                                                    borderStyle: 'solid'
                                                }}
                                                readOnly
                                            />
                                            <Search
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                                style={{ color: settings.searchIconColor }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ASSISTENTE TAB */}
                        {activeTab === 'assistente' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                                    🤖 Assistente Virtuale
                                </h2>

                                {/* Abilita/Disabilita */}
                                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                                    <div>
                                        <label className="block text-gray-700 font-semibold">Assistente Attivo</label>
                                        <p className="text-sm text-gray-500">Mostra il pulsante dell&apos;assistente virtuale sul sito</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, assistantEnabled: !settings.assistantEnabled })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.assistantEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.assistantEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Nome Assistente</label>
                                        <input
                                            type="text"
                                            value={settings.assistantName}
                                            onChange={(e) => setSettings({ ...settings, assistantName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            placeholder="Assistente Virtuale"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Posizione</label>
                                        <select
                                            value={settings.assistantPosition}
                                            onChange={(e) => setSettings({ ...settings, assistantPosition: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        >
                                            <option value="right">Destra</option>
                                            <option value="left">Sinistra</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Pulsante</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.assistantColor}
                                                onChange={(e) => setSettings({ ...settings, assistantColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.assistantColor}
                                                onChange={(e) => setSettings({ ...settings, assistantColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Colore Icona</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={settings.assistantTextColor}
                                                onChange={(e) => setSettings({ ...settings, assistantTextColor: e.target.value })}
                                                className="w-16 h-16 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.assistantTextColor}
                                                onChange={(e) => setSettings({ ...settings, assistantTextColor: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Messaggio di Benvenuto</label>
                                    <textarea
                                        value={settings.assistantWelcome}
                                        onChange={(e) => setSettings({ ...settings, assistantWelcome: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        rows={3}
                                        placeholder="👋 Ciao! Sono il tuo assistente virtuale..."
                                    />
                                </div>

                                {/* Anteprima */}
                                <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                    <p className="text-sm font-semibold text-gray-700 mb-4">Anteprima Pulsante Assistente:</p>
                                    <div className="flex justify-center">
                                        <div
                                            className="flex items-center gap-3 px-4 py-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                            style={{ backgroundColor: settings.assistantColor }}
                                        >
                                            <MessageCircle className="w-6 h-6" style={{ color: settings.assistantTextColor }} />
                                            <span className="text-sm font-medium" style={{ color: settings.assistantTextColor }}>
                                                Serve aiuto?
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Info and Save Button */}
                        <div className="mt-8 space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Nota:</strong> Dopo aver salvato le impostazioni, ricarica la pagina per vedere i cambiamenti applicati al sito.
                                </p>
                            </div>

                            <div className="flex justify-end pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 rounded-lg hover:opacity-90 transition flex items-center space-x-2 disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{saving ? 'Salvataggio...' : 'Salva Impostazioni'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
