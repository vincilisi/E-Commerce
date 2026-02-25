'use client';

import Link from 'next/link';
import { BookOpen, Package, Settings, CreditCard, Image, Palette, ArrowLeft, CheckCircle, Globe, DollarSign, Search, MessageCircle, Calendar, Tag, Mail, MapPin, Bot, BarChart3, FileText, HelpCircle, Scale, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

type Section = 'prodotti' | 'impostazioni' | 'pagamenti' | 'ordini' | 'tracking' | 'eventi' | 'promo' | 'email' | 'assistente' | 'traduzione' | 'valuta' | 'analytics' | 'blog' | 'faq' | 'legal' | 'carrelli';

export default function GuidaAdmin() {
    const [activeSection, setActiveSection] = useState<Section>('prodotti');

    const sections = [
        { id: 'prodotti' as Section, label: 'Gestione Prodotti', icon: Package },
        { id: 'impostazioni' as Section, label: 'Personalizzazione', icon: Settings },
        { id: 'pagamenti' as Section, label: 'Sistema Pagamenti', icon: CreditCard },
        { id: 'ordini' as Section, label: 'Gestione Ordini', icon: CheckCircle },
        { id: 'tracking' as Section, label: 'Tracking Ordini', icon: MapPin },
        { id: 'eventi' as Section, label: 'Gestione Eventi', icon: Calendar },
        { id: 'promo' as Section, label: 'Codici Promozionali', icon: Tag },
        { id: 'email' as Section, label: 'Email Automatiche', icon: Mail },
        { id: 'assistente' as Section, label: 'Assistente Virtuale', icon: Bot },
        { id: 'traduzione' as Section, label: 'Traduzione Simultanea', icon: Globe },
        { id: 'valuta' as Section, label: 'Cambio Valuta', icon: DollarSign },
        { id: 'analytics' as Section, label: 'Analytics', icon: BarChart3 },
        { id: 'blog' as Section, label: 'Blog', icon: FileText },
        { id: 'faq' as Section, label: 'FAQ', icon: HelpCircle },
        { id: 'legal' as Section, label: 'Pagine Legali', icon: Scale },
        { id: 'carrelli' as Section, label: 'Carrelli Abbandonati', icon: ShoppingCart },
    ];

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4 max-w-6xl">
                <Link href="/admin" className="flex items-center hover:opacity-80 mb-6" style={{ color: 'var(--color-primary)' }}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Torna alla Dashboard
                </Link>

                <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <div className="p-4 sm:p-6 md:p-8 border-b" style={{ borderColor: 'var(--color-border)', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}>
                        <div className="flex items-center text-white">
                            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-3 md:mr-4 shrink-0" />
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">Guida Amministratore</h1>
                                <p className="text-sm sm:text-base md:text-lg opacity-90 mt-1 md:mt-2">Tutto quello che ti serve sapere per gestire il tuo e-commerce</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Sidebar Menu - Scroll orizzontale su mobile, verticale su desktop */}
                        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                            <nav className="p-2 sm:p-3 lg:p-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition whitespace-nowrap shrink-0 lg:w-full ${activeSection === section.id ? 'shadow-md' : 'hover:bg-gray-100'}`}
                                            style={{
                                                backgroundColor: activeSection === section.id ? 'var(--color-primary)' : 'transparent',
                                                color: activeSection === section.id ? 'var(--color-button-text)' : 'var(--color-text)'
                                            }}
                                        >
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="font-medium text-sm sm:text-base">{section.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-4 sm:p-6 md:p-8">
                            {/* GESTIONE PRODOTTI */}
                            {activeSection === 'prodotti' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            📦 Gestione Prodotti
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Impara a creare, modificare, duplicare ed eliminare i tuoi prodotti artigianali. Questa è la sezione principale per gestire il tuo catalogo.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <Package className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-2 text-sm text-blue-700">
                                                    <Link href="/admin/prodotti" className="font-semibold underline">
                                                        Vai alla Gestione Prodotti →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CREARE NUOVO PRODOTTO */}
                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ➕ Creare un Nuovo Prodotto
                                        </h3>
                                        <ol className="space-y-4 text-gray-700">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
                                                <div>
                                                    <strong>Accedi alla sezione prodotti</strong>
                                                    <p className="text-sm text-gray-600">Dashboard → Gestione Prodotti → clicca il pulsante "Nuovo Prodotto" in alto a destra</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
                                                <div>
                                                    <strong>Compila i campi obbligatori</strong>
                                                    <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc space-y-1">
                                                        <li><strong>Nome prodotto</strong>: es. "Portachiavi Stella Dorata" - deve essere descrittivo e unico</li>
                                                        <li><strong>Descrizione</strong>: Descrivi il prodotto in dettaglio, includi materiali, dimensioni, uso consigliato</li>
                                                        <li><strong>Prezzo</strong>: In Euro (es. 12.99) - sarà convertito automaticamente nelle altre valute</li>
                                                        <li><strong>Categoria</strong>: Scegli tra Classici, Personalizzati, Colorati, Luminosi, Edizione Limitata</li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
                                                <div>
                                                    <strong>Aggiungi dettagli extra (opzionale ma consigliato)</strong>
                                                    <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc space-y-1">
                                                        <li><strong>Dimensioni</strong>: es. "8cm x 3cm x 1cm" - aiuta il cliente a capire le proporzioni</li>
                                                        <li><strong>Materiali</strong>: puoi aggiungerne multipli (resina, metallo, glitter, LED, ecc.)</li>
                                                        <li><strong>Personalizzabile</strong>: attiva se il cliente può richiedere modifiche</li>
                                                        <li><strong>In evidenza</strong>: mostra il prodotto nella homepage</li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>4</span>
                                                <div>
                                                    <strong>Carica le immagini (minimo 1, consigliato 3-5)</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Hai 2 opzioni per ogni immagine - vedi dettagli sotto</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>5</span>
                                                <div>
                                                    <strong>Verifica le traduzioni automatiche</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Il sistema traduce automaticamente nome e descrizione in 9 lingue. Controlla e modifica se necessario prima di salvare.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>6</span>
                                                <div>
                                                    <strong>Salva il prodotto</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Clicca "Salva Prodotto". Il prodotto sarà immediatamente visibile sul sito.</p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* OPZIONI IMMAGINI */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                            <div className="flex items-center mb-4">
                                                <Image className="w-6 h-6 mr-2" style={{ color: 'var(--color-primary)' }} />
                                                <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>Opzione 1: File Locale</h4>
                                            </div>
                                            <ul className="text-sm text-gray-600 space-y-2">
                                                <li>✓ Clicca "Scegli file" o trascina l'immagine</li>
                                                <li>✓ Seleziona un'immagine dal tuo PC</li>
                                                <li>✓ Formati supportati: JPG, PNG, WebP, SVG, GIF</li>
                                                <li>✓ Dimensione massima: 5MB per immagine</li>
                                                <li>✓ Risoluzione consigliata: almeno 800x800px</li>
                                                <li>✓ L'immagine viene salvata localmente sul server</li>
                                            </ul>
                                            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                                                ⚠️ Usa immagini di alta qualità per una migliore presentazione
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                            <div className="flex items-center mb-4">
                                                <Globe className="w-6 h-6 mr-2" style={{ color: 'var(--color-primary)' }} />
                                                <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>Opzione 2: URL Internet</h4>
                                            </div>
                                            <ul className="text-sm text-gray-600 space-y-2">
                                                <li>✓ Carica l'immagine su Imgur, ImgBB o altro hosting</li>
                                                <li>✓ Copia l'URL diretto dell'immagine (termina in .jpg, .png, ecc.)</li>
                                                <li>✓ Incolla nel campo "URL Immagine"</li>
                                                <li>✓ L'anteprima appare automaticamente</li>
                                                <li>✓ Ideale per immagini già online</li>
                                                <li>✓ Nessun limite di dimensione</li>
                                            </ul>
                                            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                                                💡 Consiglio: usa Imgur.com - è gratuito e veloce
                                            </div>
                                        </div>
                                    </div>

                                    {/* MODIFICARE PRODOTTO */}
                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ✏️ Modificare un Prodotto Esistente
                                        </h3>
                                        <ol className="space-y-3 text-gray-700">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-secondary)' }}>1</span>
                                                <div>
                                                    <strong>Trova il prodotto</strong>
                                                    <p className="text-sm text-gray-600">Nella lista prodotti, usa la barra di ricerca o scorri per trovare il prodotto</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-secondary)' }}>2</span>
                                                <div>
                                                    <strong>Clicca sull'icona ✏️ (modifica)</strong>
                                                    <p className="text-sm text-gray-600">Si aprirà il form di modifica con tutti i dati precompilati</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-secondary)' }}>3</span>
                                                <div>
                                                    <strong>Modifica i campi desiderati</strong>
                                                    <p className="text-sm text-gray-600">Puoi modificare qualsiasi campo: nome, prezzo, descrizione, immagini, traduzioni</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-secondary)' }}>4</span>
                                                <div>
                                                    <strong>Salva le modifiche</strong>
                                                    <p className="text-sm text-gray-600">Le modifiche sono immediate e visibili sul sito in tempo reale</p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* ELIMINARE PRODOTTO */}
                                    <div className="border rounded-lg p-6 bg-red-50" style={{ borderColor: '#ef4444' }}>
                                        <h3 className="text-xl font-bold mb-4 text-red-800">
                                            🗑️ Eliminare un Prodotto
                                        </h3>
                                        <div className="space-y-3 text-gray-700">
                                            <p className="text-sm">Per eliminare un prodotto:</p>
                                            <ol className="space-y-2 text-sm ml-4 list-decimal">
                                                <li>Trova il prodotto nella lista</li>
                                                <li>Clicca sull'icona 🗑️ (cestino) rossa</li>
                                                <li>Conferma l'eliminazione nel popup</li>
                                            </ol>
                                            <div className="mt-4 p-3 bg-red-100 rounded text-sm text-red-800">
                                                ⚠️ <strong>ATTENZIONE:</strong> L'eliminazione è permanente e non può essere annullata. Il prodotto verrà rimosso anche dagli ordini in sospeso. Assicurati di non avere ordini attivi per questo prodotto.
                                            </div>
                                        </div>
                                    </div>

                                    {/* BEST PRACTICES */}
                                    <div className="border rounded-lg p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4 text-green-800">
                                            💡 Best Practices per i Prodotti
                                        </h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ <strong>Nomi chiari</strong>: Usa nomi descrittivi che includano il tipo di prodotto</li>
                                            <li>✓ <strong>Descrizioni complete</strong>: Includi materiali, dimensioni, tempo di realizzazione</li>
                                            <li>✓ <strong>Foto multiple</strong>: Mostra il prodotto da diverse angolazioni</li>
                                            <li>✓ <strong>Foto su sfondo neutro</strong>: Bianco o chiaro per evidenziare il prodotto</li>
                                            <li>✓ <strong>Prezzi competitivi</strong>: Ricerca i prezzi di mercato prima di impostare i tuoi</li>
                                            <li>✓ <strong>Categorie corrette</strong>: Aiuta i clienti a trovare facilmente i prodotti</li>
                                            <li>✓ <strong>Controlla le traduzioni</strong>: Le traduzioni automatiche possono avere errori</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* PERSONALIZZAZIONE */}
                            {activeSection === 'impostazioni' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            🎨 Personalizzazione Sito
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Rendi unico il tuo e-commerce con colori, font, logo, barra di ricerca e assistente virtuale personalizzati. Ogni modifica è salvata automaticamente e visibile in tempo reale.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-xs sm:text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
                                                    <Link href="/admin/impostazioni" className="font-semibold underline">
                                                        Vai alle Impostazioni →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB GENERALE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center" style={{ color: 'var(--color-text)' }}>
                                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Tab: Generale
                                        </h3>
                                        <div className="space-y-3 text-sm text-gray-700">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">Nome del Sito</strong>
                                                <p className="text-gray-600 text-xs">Cambia il nome che appare nella navbar, nel footer e nel titolo della pagina. Default: "Il Desiderio di una Stella"</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">Meta Description</strong>
                                                <p className="text-gray-600 text-xs">Descrizione SEO del sito per i motori di ricerca (max 160 caratteri)</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">Informazioni Contatto</strong>
                                                <p className="text-gray-600 text-xs">Email e telefono mostrati nel footer e nella pagina contatti</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB COLORI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center" style={{ color: 'var(--color-text)' }}>
                                            <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Tab: Colori
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Personalizza 8 colori del tema. Ogni colore ha un ruolo specifico nell'interfaccia:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                                                    <strong className="text-sm">Colore Primario</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Pulsanti principali, link, elementi di navigazione attivi</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
                                                    <strong className="text-sm">Colore Secondario</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Gradienti, hover effects, elementi secondari</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                                                    <strong className="text-sm">Colore Accento</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Badges, notifiche, elementi di evidenza</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded border" style={{ backgroundColor: 'var(--color-background)' }}></div>
                                                    <strong className="text-sm">Sfondo Pagina</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Colore di sfondo generale del sito</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded border" style={{ backgroundColor: 'var(--color-card-bg)' }}></div>
                                                    <strong className="text-sm">Sfondo Card</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Sfondo delle schede prodotto e box contenuti</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded" style={{ backgroundColor: 'var(--color-text)' }}></div>
                                                    <strong className="text-sm">Colore Testo</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Testo principale, titoli, paragrafi</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded border" style={{ backgroundColor: 'var(--color-border)' }}></div>
                                                    <strong className="text-sm">Colore Bordi</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Bordi delle card, separatori, linee</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-5 h-5 rounded border" style={{ backgroundColor: 'var(--color-button-text)' }}></div>
                                                    <strong className="text-sm">Testo Pulsanti</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Colore del testo all'interno dei pulsanti</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                            <p className="text-xs text-purple-700">💡 <strong>Suggerimento:</strong> Usa colori con buon contrasto per garantire leggibilità. Puoi usare strumenti come coolors.co per creare palette armoniche.</p>
                                        </div>
                                    </div>

                                    {/* TAB TIPOGRAFIA */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            📝 Tab: Tipografia
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Scegli il font che rappresenta meglio il tuo brand. 10 font professionali preinstallati:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Inter' }}>Inter</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Roboto' }}>Roboto</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Poppins' }}>Poppins</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Open Sans' }}>Open Sans</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Lato' }}>Lato</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Montserrat' }}>Montserrat</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Nunito' }}>Nunito</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Playfair Display' }}>Playfair</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Raleway' }}>Raleway</div>
                                            <div className="p-2 bg-gray-50 rounded text-center text-sm" style={{ fontFamily: 'Source Sans Pro' }}>Source Sans</div>
                                        </div>
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-xs text-blue-700">💡 <strong>Per artigianato:</strong> Playfair Display o Montserrat danno un tocco elegante. Poppins e Nunito sono moderni e leggibili.</p>
                                        </div>
                                    </div>

                                    {/* TAB LOGO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center" style={{ color: 'var(--color-text)' }}>
                                            <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Tab: Logo
                                        </h3>
                                        <div className="space-y-3 text-sm text-gray-700">
                                            <p>Sostituisci la stella predefinita con il logo del tuo brand:</p>
                                            <ul className="space-y-2 text-xs text-gray-600 ml-4 list-disc">
                                                <li><strong>Formati accettati:</strong> PNG (consigliato), SVG, JPG, WebP</li>
                                                <li><strong>Dimensione consigliata:</strong> 200x200px o 400x100px (orizzontale)</li>
                                                <li><strong>Sfondo:</strong> Trasparente per PNG/SVG per migliore integrazione</li>
                                                <li><strong>Peso massimo:</strong> 2MB</li>
                                            </ul>
                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <div className="p-3 bg-gray-50 rounded-lg text-center">
                                                    <div className="text-2xl mb-2">📤</div>
                                                    <strong className="text-xs">Carica File</strong>
                                                    <p className="text-xs text-gray-500 mt-1">Dal tuo PC</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg text-center">
                                                    <div className="text-2xl mb-2">🔗</div>
                                                    <strong className="text-xs">URL Esterno</strong>
                                                    <p className="text-xs text-gray-500 mt-1">Da hosting immagini</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB RICERCA */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center" style={{ color: 'var(--color-text)' }}>
                                            <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Tab: Ricerca
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Personalizza l'aspetto della barra di ricerca nella navbar per integrarla perfettamente con il tuo design:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-4 h-4 rounded bg-white border"></div>
                                                    <strong className="text-sm">Sfondo Barra</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Colore di sfondo dell'input di ricerca</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-4 h-4 rounded bg-gray-800"></div>
                                                    <strong className="text-sm">Colore Testo</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Colore del testo digitato dall'utente</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-4 h-4 rounded bg-gray-400"></div>
                                                    <strong className="text-sm">Placeholder</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Colore del testo segnaposto "Cerca..."</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
                                                    <strong className="text-sm">Bordo</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Colore del bordo della barra di ricerca</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Search className="w-4 h-4 text-gray-500" />
                                                    <strong className="text-sm">Icona Lente</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Colore dell'icona di ricerca</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                                            <p className="text-xs text-yellow-700">💡 <strong>Anteprima Live:</strong> Nella pagina impostazioni vedrai un'anteprima in tempo reale della barra di ricerca mentre modifichi i colori.</p>
                                        </div>
                                    </div>

                                    {/* TAB ASSISTENTE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center" style={{ color: 'var(--color-text)' }}>
                                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Tab: Assistente Virtuale
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Configura il chatbot che aiuta i clienti 24/7 con risposte automatiche a domande frequenti:</p>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-8 h-4 bg-green-500 rounded-full"></div>
                                                    <strong className="text-sm">Attiva/Disattiva</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Abilita o disabilita completamente l'assistente sul sito pubblico</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">💬</span>
                                                    <strong className="text-sm">Nome Assistente</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Il nome che appare nell'header del chat (es. "Stella", "Assistente", "Support")</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-4 h-4 rounded bg-purple-600"></div>
                                                        <strong className="text-sm">Colore Pulsante</strong>
                                                    </div>
                                                    <p className="text-xs text-gray-600">Sfondo del pulsante e header chat</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-4 h-4 rounded bg-white border"></div>
                                                        <strong className="text-sm">Colore Icona</strong>
                                                    </div>
                                                    <p className="text-xs text-gray-600">Icona e testo sul pulsante</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">👋</span>
                                                    <strong className="text-sm">Messaggio di Benvenuto</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Il primo messaggio che l'assistente mostra quando l'utente apre la chat</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">📍</span>
                                                    <strong className="text-sm">Posizione Schermo</strong>
                                                </div>
                                                <p className="text-xs text-gray-600">Scegli se mostrare il pulsante in basso a destra o in basso a sinistra</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                            <p className="text-xs text-green-700 mb-2"><strong>✨ Funzionalità dell'Assistente:</strong></p>
                                            <ul className="text-xs text-green-700 space-y-1 ml-4 list-disc">
                                                <li>Risponde automaticamente a domande su spedizioni, resi, pagamenti</li>
                                                <li>Si adatta alla lingua selezionata dall'utente (9 lingue)</li>
                                                <li>Design personalizzabile per integrarsi con il tuo brand</li>
                                                <li>Disponibile 24/7 per assistere i clienti</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SISTEMA PAGAMENTI */}
                            {activeSection === 'pagamenti' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            💳 Sistema Pagamenti
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Il sito supporta due modalità di pagamento: Test (per sviluppo) e Stripe Reale (per produzione). Scopri come funzionano e come configurarle.
                                        </p>
                                    </div>

                                    {/* MODALITÀ TEST */}
                                    <div className="border-2 rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-accent)' }}>
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 shrink-0" style={{ backgroundColor: 'var(--color-accent)' }}>
                                                🧪
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Modalità Test</h3>
                                                <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded font-semibold">✓ ATTIVA PER DEFAULT</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 text-sm text-gray-700">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">Come Funziona:</strong>
                                                <ol className="space-y-2 ml-4 list-decimal">
                                                    <li>Il cliente aggiunge prodotti al carrello</li>
                                                    <li>Procede al checkout e compila i dati di spedizione</li>
                                                    <li>Clicca "Procedi al Pagamento"</li>
                                                    <li>L'ordine viene creato automaticamente come <strong>"Pagato"</strong></li>
                                                    <li>Nessun pagamento reale viene effettuato</li>
                                                </ol>
                                            </div>
                                            <div className="p-4 bg-yellow-50 rounded-lg">
                                                <strong className="block mb-2 text-yellow-800">⚠️ Quando Usarla:</strong>
                                                <ul className="space-y-1 ml-4 list-disc text-yellow-700">
                                                    <li>Durante lo sviluppo e test del sito</li>
                                                    <li>Per mostrare demo ai clienti</li>
                                                    <li>Per testare il flusso di checkout</li>
                                                    <li>Prima di configurare Stripe reale</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <strong className="block mb-2 text-blue-800">🔍 Come Verificare:</strong>
                                                <p className="text-blue-700">Se nel file <code className="bg-blue-100 px-1 rounded">.env.local</code> NON ci sono le variabili <code className="bg-blue-100 px-1 rounded">STRIPE_SECRET_KEY</code> e <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>, la modalità test è attiva.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STRIPE REALE */}
                                    <div className="border-2 rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-primary)' }}>
                                        <div className="flex items-center mb-4">
                                            <CreditCard className="w-12 h-12 mr-3 shrink-0" style={{ color: 'var(--color-primary)' }} />
                                            <div>
                                                <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Stripe Reale</h3>
                                                <span className="text-sm px-2 py-1 bg-gray-200 text-gray-800 rounded">DA CONFIGURARE</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 text-sm text-gray-700">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-3">📋 Guida Passo-Passo per Attivare Stripe:</strong>
                                                <ol className="space-y-3 ml-4 list-decimal">
                                                    <li>
                                                        <strong>Crea account Stripe</strong>
                                                        <p className="text-gray-600">Vai su <a href="https://stripe.com" target="_blank" className="text-blue-600 underline">stripe.com</a> e registrati gratuitamente</p>
                                                    </li>
                                                    <li>
                                                        <strong>Completa la verifica</strong>
                                                        <p className="text-gray-600">Inserisci i dati della tua attività (P.IVA, IBAN per i pagamenti)</p>
                                                    </li>
                                                    <li>
                                                        <strong>Ottieni le chiavi API</strong>
                                                        <p className="text-gray-600">Dashboard Stripe → Developers → API Keys</p>
                                                    </li>
                                                    <li>
                                                        <strong>Crea/modifica il file .env.local</strong>
                                                        <div className="bg-gray-800 text-green-400 p-3 rounded mt-2 font-mono text-xs overflow-x-auto">
                                                            <div>STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx</div>
                                                            <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <strong>Riavvia il server</strong>
                                                        <p className="text-gray-600">Ferma il server e riavvialo con <code className="bg-gray-100 px-1 rounded">npm run dev</code></p>
                                                    </li>
                                                </ol>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-lg">
                                                <strong className="block mb-2 text-purple-800">💰 Commissioni Stripe:</strong>
                                                <ul className="space-y-1 ml-4 list-disc text-purple-700">
                                                    <li><strong>1.4% + 0.25€</strong> per carte europee</li>
                                                    <li><strong>2.9% + 0.25€</strong> per carte non europee</li>
                                                    <li>Nessun costo fisso mensile</li>
                                                    <li>Paghi solo quando ricevi pagamenti</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <strong className="block mb-2 text-green-800">✅ Metodi di Pagamento Supportati:</strong>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="px-2 py-1 bg-white rounded text-xs border">💳 Carte di Credito</span>
                                                    <span className="px-2 py-1 bg-white rounded text-xs border">💳 Carte di Debito</span>
                                                    <span className="px-2 py-1 bg-white rounded text-xs border">🍎 Apple Pay</span>
                                                    <span className="px-2 py-1 bg-white rounded text-xs border">📱 Google Pay</span>
                                                    <span className="px-2 py-1 bg-white rounded text-xs border">🏦 SEPA Direct Debit</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TESTING STRIPE */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-orange-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-lg font-bold mb-3 text-orange-800">🔧 Testare Stripe Prima di Andare Live</h3>
                                        <p className="text-sm text-orange-700 mb-3">Puoi testare Stripe con chiavi di test prima di usare quelle reali:</p>
                                        <ol className="space-y-2 text-sm text-orange-700 ml-4 list-decimal">
                                            <li>Usa le chiavi che iniziano con <code className="bg-orange-100 px-1 rounded">sk_test_</code> e <code className="bg-orange-100 px-1 rounded">pk_test_</code></li>
                                            <li>Usa carte di test Stripe:
                                                <ul className="ml-4 mt-1 space-y-1 list-disc">
                                                    <li><code className="bg-orange-100 px-1 rounded">4242 4242 4242 4242</code> - Pagamento riuscito</li>
                                                    <li><code className="bg-orange-100 px-1 rounded">4000 0000 0000 0002</code> - Carta rifiutata</li>
                                                </ul>
                                            </li>
                                            <li>Data scadenza: qualsiasi data futura</li>
                                            <li>CVC: qualsiasi 3 cifre</li>
                                        </ol>
                                    </div>
                                </div>
                            )}

                            {/* GESTIONE ORDINI */}
                            {activeSection === 'ordini' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            📋 Gestione Ordini
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Monitora, gestisci e aggiorna lo stato di tutti gli ordini ricevuti. Ogni ordine contiene informazioni dettagliate su cliente, prodotti e spedizione.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-2 sm:ml-3">
                                                <h3 className="text-xs sm:text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
                                                    <Link href="/admin/ordini" className="font-semibold underline">
                                                        Vai alla Gestione Ordini →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATI ORDINI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🏷️ Stati degli Ordini
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Ogni ordine passa attraverso diversi stati. Ecco cosa significa ciascuno:</p>
                                        <div className="space-y-3">
                                            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                                                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-semibold shrink-0">Pending</span>
                                                <div className="ml-3">
                                                    <strong className="text-sm">In attesa di pagamento</strong>
                                                    <p className="text-xs text-gray-600 mt-1">Il cliente ha avviato il checkout ma non ha completato il pagamento. In modalità test, questo stato dura pochi secondi.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-3 bg-green-50 rounded-lg">
                                                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-semibold shrink-0">Paid</span>
                                                <div className="ml-3">
                                                    <strong className="text-sm">Pagamento ricevuto ✓</strong>
                                                    <p className="text-xs text-gray-600 mt-1">Il pagamento è stato confermato. Ora devi preparare l'ordine. Passa a "Processing" quando inizi la lavorazione.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                                                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold shrink-0">Processing</span>
                                                <div className="ml-3">
                                                    <strong className="text-sm">In preparazione</strong>
                                                    <p className="text-xs text-gray-600 mt-1">Stai lavorando al prodotto. Usa questo stato per prodotti artigianali che richiedono tempo di realizzazione.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                                                <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-semibold shrink-0">Shipped</span>
                                                <div className="ml-3">
                                                    <strong className="text-sm">Spedito 📦</strong>
                                                    <p className="text-xs text-gray-600 mt-1">Il pacco è stato consegnato al corriere. Aggiungi il codice tracking per permettere al cliente di tracciare la spedizione.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                                                <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-800 font-semibold shrink-0">Delivered</span>
                                                <div className="ml-3">
                                                    <strong className="text-sm">Consegnato ✓✓</strong>
                                                    <p className="text-xs text-gray-600 mt-1">Il cliente ha ricevuto il pacco. Ordine completato con successo!</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-3 bg-red-50 rounded-lg">
                                                <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 font-semibold shrink-0">Cancelled</span>
                                                <div className="ml-3">
                                                    <strong className="text-sm">Annullato</strong>
                                                    <p className="text-xs text-gray-600 mt-1">L'ordine è stato annullato. Usa questo stato per rimborsi o cancellazioni richieste dal cliente.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COME GESTIRE ORDINE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📝 Come Gestire un Ordine
                                        </h3>
                                        <ol className="space-y-4">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
                                                <div>
                                                    <strong>Visualizza i dettagli</strong>
                                                    <p className="text-sm text-gray-600">Clicca sull'ordine per vedere: prodotti ordinati, quantità, prezzi, dati cliente, indirizzo spedizione</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
                                                <div>
                                                    <strong>Aggiorna lo stato</strong>
                                                    <p className="text-sm text-gray-600">Usa il menu a tendina per cambiare stato. Il cliente riceverà una notifica (se configurato)</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
                                                <div>
                                                    <strong>Aggiungi codice tracking (per spedizioni)</strong>
                                                    <p className="text-sm text-gray-600">Quando spedisci, inserisci il codice tracking del corriere. Appare nell'ordine del cliente.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>4</span>
                                                <div>
                                                    <strong>Note interne (opzionale)</strong>
                                                    <p className="text-sm text-gray-600">Aggiungi note visibili solo a te per ricordare dettagli importanti</p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* INFO ORDINE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📄 Informazioni in Ogni Ordine
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">👤 Dati Cliente</strong>
                                                <p className="text-xs text-gray-600">Nome, cognome, email, telefono</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">📍 Indirizzo Spedizione</strong>
                                                <p className="text-xs text-gray-600">Via, città, CAP, provincia, paese</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">🛒 Prodotti Ordinati</strong>
                                                <p className="text-xs text-gray-600">Nome, quantità, prezzo unitario, totale</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">💰 Riepilogo Pagamento</strong>
                                                <p className="text-xs text-gray-600">Subtotale, spedizione, totale, metodo</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">📅 Date Importanti</strong>
                                                <p className="text-xs text-gray-600">Data ordine, data pagamento, ultima modifica</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">✉️ Personalizzazioni</strong>
                                                <p className="text-xs text-gray-600">Richieste speciali del cliente (se presenti)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BEST PRACTICES */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h4 className="font-bold mb-3 text-base text-green-800">💡 Best Practices per la Gestione Ordini</h4>
                                        <ul className="text-sm text-green-700 space-y-2">
                                            <li>✓ <strong>Aggiorna lo stato entro 24h</strong> dal pagamento per mantenere il cliente informato</li>
                                            <li>✓ <strong>Aggiungi sempre il tracking</strong> quando spedisci - i clienti lo apprezzano molto</li>
                                            <li>✓ <strong>Segna "Delivered" solo dopo conferma</strong> della consegna dal corriere</li>
                                            <li>✓ <strong>Contatta il cliente</strong> se ci sono problemi con l'ordine prima di annullare</li>
                                            <li>✓ <strong>Controlla regolarmente</strong> gli ordini in "Paid" per non dimenticare nulla</li>
                                            <li>✓ <strong>Usa le note interne</strong> per tenere traccia di comunicazioni con il cliente</li>
                                        </ul>
                                    </div>

                                    {/* FILTRI */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-blue-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h4 className="font-bold mb-3 text-base text-blue-800">🔍 Filtri e Ricerca</h4>
                                        <p className="text-sm text-blue-700 mb-3">Nella pagina ordini puoi:</p>
                                        <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                                            <li>Filtrare per stato (Paid, Processing, Shipped, ecc.)</li>
                                            <li>Cercare per nome cliente o numero ordine</li>
                                            <li>Ordinare per data (più recenti/più vecchi)</li>
                                            <li>Vedere statistiche rapide (totale ordini, fatturato)</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* TRACKING ORDINI */}
                            {activeSection === 'tracking' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            📍 Tracking Ordini
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Sistema completo per tracciare le spedizioni. I clienti possono seguire il loro ordine in tempo reale!
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-2 sm:ml-3">
                                                <h3 className="text-xs sm:text-sm font-medium text-blue-800">Pagina Pubblica</h3>
                                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
                                                    <Link href="/traccia-ordine" className="font-semibold underline">
                                                        Vai a Traccia Ordine →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COME FUNZIONA */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🔄 Come Funziona
                                        </h3>
                                        <ol className="space-y-3">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
                                                <div>
                                                    <strong>Cliente completa l&apos;ordine</strong>
                                                    <p className="text-sm text-gray-600">Riceve email con numero ordine e link tracking</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
                                                <div>
                                                    <strong>Tu aggiungi il tracking</strong>
                                                    <p className="text-sm text-gray-600">Nella pagina dettaglio ordine, inserisci il numero di tracking del corriere</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
                                                <div>
                                                    <strong>Invia email spedizione</strong>
                                                    <p className="text-sm text-gray-600">Con un click invii l&apos;email automatica con tracking</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>4</span>
                                                <div>
                                                    <strong>Cliente traccia l&apos;ordine</strong>
                                                    <p className="text-sm text-gray-600">Può vedere stato e tracking su /traccia-ordine</p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* STATI ORDINE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📊 Stati dell&apos;Ordine
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                                <span className="text-2xl">📋</span>
                                                <div>
                                                    <strong className="text-yellow-800">Ordine Ricevuto</strong>
                                                    <p className="text-xs text-yellow-700">L&apos;ordine è stato creato</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                                <span className="text-2xl">💳</span>
                                                <div>
                                                    <strong className="text-purple-800">Pagamento Confermato</strong>
                                                    <p className="text-xs text-purple-700">Il pagamento è andato a buon fine</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                <span className="text-2xl">📦</span>
                                                <div>
                                                    <strong className="text-blue-800">In Preparazione</strong>
                                                    <p className="text-xs text-blue-700">Stai preparando il pacco</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                                                <span className="text-2xl">🚚</span>
                                                <div>
                                                    <strong className="text-indigo-800">Spedito</strong>
                                                    <p className="text-xs text-indigo-700">In viaggio verso il cliente</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                <span className="text-2xl">✅</span>
                                                <div>
                                                    <strong className="text-green-800">Consegnato</strong>
                                                    <p className="text-xs text-green-700">Il cliente ha ricevuto il pacco</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AGGIUNGERE TRACKING - STEP BY STEP */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📝 Come Aggiungere il Tracking (Passo per Passo)
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Vai in Admin → Ordini</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Dalla dashboard, clicca su &quot;Ordini&quot; nel menu laterale o nella card rapida.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">2</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Trova l&apos;ordine da spedire</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Cerca l&apos;ordine per nome cliente, numero ordine o filtra per stato &quot;Processing&quot;.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Clicca sull&apos;ordine per aprire i dettagli</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Vedrai tutti i dettagli: cliente, prodotti, indirizzo, totale.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">4</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Trova la sezione &quot;Tracking Spedizione&quot;</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Scendi fino a vedere la card viola con l&apos;icona del pacco.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">5</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Inserisci il numero tracking del corriere</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Copia il codice dal sito del corriere (es. BRT, Poste, GLS, SDA) e incollalo nel campo.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">6</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Clicca &quot;Salva Tracking&quot;</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Il numero viene salvato e lo stato ordine cambia automaticamente in &quot;Shipped&quot;.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">7</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Clicca &quot;Invia Email Spedizione&quot;</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Il cliente riceve un&apos;email con il numero tracking e il link per seguire la spedizione.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CORRIERI SUPPORTATI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🚛 Corrieri Comuni in Italia
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Il tracking funziona con qualsiasi corriere. Ecco i più usati:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            <div className="p-3 bg-red-50 rounded-lg text-center">
                                                <strong className="text-sm text-red-800 block">📦 BRT (Bartolini)</strong>
                                                <p className="text-xs text-red-700">Tracking tipo: 123456789012</p>
                                            </div>
                                            <div className="p-3 bg-yellow-50 rounded-lg text-center">
                                                <strong className="text-sm text-yellow-800 block">📦 Poste Italiane</strong>
                                                <p className="text-xs text-yellow-700">Tracking tipo: AB123456789IT</p>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-lg text-center">
                                                <strong className="text-sm text-blue-800 block">📦 GLS</strong>
                                                <p className="text-xs text-blue-700">Tracking tipo: 12345678</p>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-lg text-center">
                                                <strong className="text-sm text-green-800 block">📦 SDA</strong>
                                                <p className="text-xs text-green-700">Tracking tipo: 123456789</p>
                                            </div>
                                            <div className="p-3 bg-orange-50 rounded-lg text-center">
                                                <strong className="text-sm text-orange-800 block">📦 DHL</strong>
                                                <p className="text-xs text-orange-700">Tracking tipo: 1234567890</p>
                                            </div>
                                            <div className="p-3 bg-purple-50 rounded-lg text-center">
                                                <strong className="text-sm text-purple-800 block">📦 UPS</strong>
                                                <p className="text-xs text-purple-700">Tracking tipo: 1Z999AA10123456784</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PAGINA TRACCIA ORDINE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🔍 Pagina Pubblica &quot;Traccia Ordine&quot;
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            I clienti possono tracciare i loro ordini visitando <Link href="/traccia-ordine" className="text-purple-600 underline font-semibold">/traccia-ordine</Link>
                                        </p>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <strong className="block mb-3 text-gray-800">Cosa vede il cliente:</strong>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>✓ <strong>Timeline visuale</strong> - Barra di progresso con tutti gli stati</li>
                                                <li>✓ <strong>Data e ora</strong> - Quando ogni fase è stata completata</li>
                                                <li>✓ <strong>Prodotti ordinati</strong> - Lista con immagini e quantità</li>
                                                <li>✓ <strong>Numero tracking</strong> - Codice del corriere (se inserito)</li>
                                                <li>✓ <strong>Indirizzo spedizione</strong> - Dove verrà consegnato</li>
                                                <li>✓ <strong>Totale ordine</strong> - Quanto ha pagato</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* BEST PRACTICES TRACKING */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">💡 Best Practices per il Tracking</h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ <strong>Aggiorna subito</strong> - Inserisci il tracking appena hai il codice</li>
                                            <li>✓ <strong>Invia l&apos;email</strong> - I clienti apprezzano essere aggiornati</li>
                                            <li>✓ <strong>Controlla il codice</strong> - Assicurati di copiare tutto il numero</li>
                                            <li>✓ <strong>Usa il link rapido</strong> - Copia il link tracking da condividere</li>
                                            <li>✓ <strong>Aggiorna lo stato</strong> - Marca come &quot;Delivered&quot; quando consegnato</li>
                                            <li>✓ <strong>Rispondi ai clienti</strong> - Se chiedono info, dai il link tracking</li>
                                        </ul>
                                    </div>

                                    {/* DOMANDE FREQUENTI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ❓ Domande Frequenti sul Tracking
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Il cliente non trova l&apos;ordine?</strong>
                                                <p className="text-sm text-gray-600">Deve usare il numero ordine (es. ORD-1234567) che trova nell&apos;email di conferma.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Posso modificare il tracking dopo averlo salvato?</strong>
                                                <p className="text-sm text-gray-600">Sì! Vai sempre nella pagina ordine e aggiorna il campo, poi clicca Salva di nuovo.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Il tracking del corriere non funziona?</strong>
                                                <p className="text-sm text-gray-600">I corrieri possono impiegare alcune ore per attivare il tracking. Riprova più tardi.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Come so quando l&apos;ordine è stato consegnato?</strong>
                                                <p className="text-sm text-gray-600">Controlla sul sito del corriere e aggiorna lo stato ordine a &quot;Delivered&quot; manualmente.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GESTIONE EVENTI */}
                            {activeSection === 'eventi' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            🎉 Gestione Eventi
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Crea e gestisci eventi speciali come workshop, mercatini, presentazioni o fiere. Gli eventi possono essere gratuiti o a pagamento.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-2 sm:ml-3">
                                                <h3 className="text-xs sm:text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
                                                    <Link href="/admin/eventi" className="font-semibold underline">
                                                        Vai alla Gestione Eventi →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CREARE EVENTO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ➕ Creare un Nuovo Evento
                                        </h3>
                                        <ol className="space-y-3">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
                                                <div>
                                                    <strong>Clicca "Nuovo Evento"</strong>
                                                    <p className="text-sm text-gray-600">Dalla pagina eventi, clicca il pulsante in alto a destra</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
                                                <div>
                                                    <strong>Compila i dettagli</strong>
                                                    <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc space-y-1">
                                                        <li><strong>Titolo</strong>: Nome dell'evento (es. "Workshop Creazione Portachiavi")</li>
                                                        <li><strong>Descrizione</strong>: Dettagli su cosa si farà, cosa portare, ecc.</li>
                                                        <li><strong>Luogo</strong>: Indirizzo o "Online" per eventi virtuali</li>
                                                        <li><strong>Data inizio e fine</strong>: Quando si svolge</li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
                                                <div>
                                                    <strong>Imposta prezzo e partecipanti</strong>
                                                    <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc space-y-1">
                                                        <li><strong>Prezzo</strong>: 0 per eventi gratuiti, altrimenti costo in Euro</li>
                                                        <li><strong>Max Partecipanti</strong>: Limite posti (lascia vuoto per illimitato)</li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>4</span>
                                                <div>
                                                    <strong>Opzioni aggiuntive</strong>
                                                    <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc space-y-1">
                                                        <li><strong>Attivo</strong>: Rende l'evento visibile sul sito</li>
                                                        <li><strong>In Evidenza</strong>: Mostra l'evento in primo piano ⭐</li>
                                                        <li><strong>Immagine</strong>: URL di un'immagine per l'evento</li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* TIPI DI EVENTI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📅 Idee per Eventi
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <strong className="text-sm text-purple-800 block mb-1">🎨 Workshop Creativi</strong>
                                                <p className="text-xs text-purple-700">Insegna ai clienti a creare i propri portachiavi</p>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <strong className="text-sm text-green-800 block mb-1">🏪 Mercatini</strong>
                                                <p className="text-xs text-green-700">Partecipazione a fiere e mercatini artigianali</p>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <strong className="text-sm text-blue-800 block mb-1">🎁 Lanci Prodotti</strong>
                                                <p className="text-xs text-blue-700">Presenta nuove collezioni in anteprima</p>
                                            </div>
                                            <div className="p-3 bg-orange-50 rounded-lg">
                                                <strong className="text-sm text-orange-800 block mb-1">📺 Live Streaming</strong>
                                                <p className="text-xs text-orange-700">Eventi online su Instagram/YouTube</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GESTIONE EVENTI */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">💡 Best Practices per gli Eventi</h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ <strong>Pianifica in anticipo</strong> - Crea l'evento almeno 2 settimane prima</li>
                                            <li>✓ <strong>Immagini accattivanti</strong> - Usa foto di alta qualità</li>
                                            <li>✓ <strong>Descrizioni complete</strong> - Includi orari, cosa portare, costi extra</li>
                                            <li>✓ <strong>Limita i posti</strong> - Crea urgenza con posti limitati</li>
                                            <li>✓ <strong>Promuovi sui social</strong> - Condividi il link dell'evento</li>
                                        </ul>
                                    </div>

                                    {/* GESTIONE PARTECIPANTI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            👥 Gestione Partecipanti
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-2">Come vedere i partecipanti:</strong>
                                                <ol className="text-sm text-gray-600 space-y-2 ml-4">
                                                    <li>1. Vai in Admin → Eventi</li>
                                                    <li>2. Clicca su un evento nella lista</li>
                                                    <li>3. Trovi la sezione &quot;Partecipanti&quot; con email e data iscrizione</li>
                                                </ol>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <strong className="text-blue-800 block mb-2">📊 Statistiche Evento</strong>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    <li>• <strong>Iscritti</strong>: Quante persone si sono registrate</li>
                                                    <li>• <strong>Posti disponibili</strong>: Quanti ne restano</li>
                                                    <li>• <strong>% Riempimento</strong>: Barra progresso visuale</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATI EVENTO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🔄 Ciclo di Vita dell&apos;Evento
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl">📝</span>
                                                <div>
                                                    <strong className="text-gray-800">Bozza</strong>
                                                    <p className="text-xs text-gray-600">Evento non ancora pubblicato - solo tu puoi vederlo</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                <span className="text-2xl">✅</span>
                                                <div>
                                                    <strong className="text-green-800">Attivo</strong>
                                                    <p className="text-xs text-green-700">Visibile sul sito - i clienti possono iscriversi</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                                <span className="text-2xl">⭐</span>
                                                <div>
                                                    <strong className="text-yellow-800">In Evidenza</strong>
                                                    <p className="text-xs text-yellow-700">Mostrato in primo piano nella home</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                                <span className="text-2xl">🔴</span>
                                                <div>
                                                    <strong className="text-red-800">Sold Out</strong>
                                                    <p className="text-xs text-red-700">Posti esauriti - iscrizioni chiuse</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                                <span className="text-2xl">📅</span>
                                                <div>
                                                    <strong className="text-purple-800">Concluso</strong>
                                                    <p className="text-xs text-purple-700">Evento passato - resta visibile nello storico</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* EVENTI ONLINE VS FISICI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🌐 Tipi di Evento
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                                <strong className="text-blue-800 block mb-2">📍 Evento Fisico</strong>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    <li>• Workshop in persona</li>
                                                    <li>• Mercatini e fiere</li>
                                                    <li>• Inaugurazioni negozio</li>
                                                    <li>• Incontri con clienti</li>
                                                </ul>
                                                <p className="text-xs text-blue-600 mt-2">
                                                    <strong>Nel campo Luogo:</strong> Indirizzo completo
                                                </p>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                                <strong className="text-purple-800 block mb-2">💻 Evento Online</strong>
                                                <ul className="text-sm text-purple-700 space-y-1">
                                                    <li>• Live Instagram/YouTube</li>
                                                    <li>• Webinar su Zoom</li>
                                                    <li>• Tutorial in diretta</li>
                                                    <li>• Q&A con i clienti</li>
                                                </ul>
                                                <p className="text-xs text-purple-600 mt-2">
                                                    <strong>Nel campo Luogo:</strong> &quot;Online&quot; o link
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COME GESTIRE UN EVENTO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📋 Checklist Evento
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">📆 2 Settimane Prima</strong>
                                                <p className="text-xs text-gray-600">Crea l&apos;evento, imposta dettagli, pubblica sui social</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">📣 1 Settimana Prima</strong>
                                                <p className="text-xs text-gray-600">Ricorda ai follower, controlla iscrizioni, prepara materiali</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">📧 1 Giorno Prima</strong>
                                                <p className="text-xs text-gray-600">Manda promemoria ai partecipanti (email o messaggio)</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">🎉 Giorno Evento</strong>
                                                <p className="text-xs text-gray-600">Fai foto/video, interagisci, raccogli feedback</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">🙏 Dopo l&apos;Evento</strong>
                                                <p className="text-xs text-gray-600">Ringrazia i partecipanti, condividi foto, chiedi recensioni</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAQ EVENTI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ❓ Domande Frequenti sugli Eventi
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Come rendo un evento a pagamento?</strong>
                                                <p className="text-sm text-gray-600">Imposta un prezzo maggiore di 0. I partecipanti pagheranno al momento dell&apos;iscrizione.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Posso modificare un evento pubblicato?</strong>
                                                <p className="text-sm text-gray-600">Sì! Puoi sempre modificare titolo, descrizione, data. Avvisa i partecipanti se cambi qualcosa di importante.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Come elimino un partecipante?</strong>
                                                <p className="text-sm text-gray-600">Vai nei dettagli evento, trova il partecipante e clicca elimina. Per rimborsi, gestiscili manualmente.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">L&apos;evento non appare sul sito?</strong>
                                                <p className="text-sm text-gray-600">Controlla che &quot;Attivo&quot; sia abilitato e che la data non sia passata.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CODICI PROMOZIONALI */}
                            {activeSection === 'promo' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            🏷️ Codici Promozionali
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Crea codici sconto per incentivare le vendite, premiare i clienti fedeli o promuovere occasioni speciali.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-2 sm:ml-3">
                                                <h3 className="text-xs sm:text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
                                                    <Link href="/admin/promo" className="font-semibold underline">
                                                        Vai ai Codici Promozionali →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIPI DI SCONTO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            💰 Tipi di Sconto
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">%</span>
                                                    <strong className="text-lg text-blue-800">Percentuale</strong>
                                                </div>
                                                <p className="text-sm text-blue-700 mb-2">Sconto in percentuale sul totale del carrello</p>
                                                <div className="text-xs text-blue-600">
                                                    <strong>Esempio:</strong> Codice "ESTATE20" = 20% di sconto<br />
                                                    Carrello €50 → Paghi €40
                                                </div>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">€</span>
                                                    <strong className="text-lg text-green-800">Importo Fisso</strong>
                                                </div>
                                                <p className="text-sm text-green-700 mb-2">Sconto di un importo fisso in Euro</p>
                                                <div className="text-xs text-green-600">
                                                    <strong>Esempio:</strong> Codice "SCONTO5" = €5 di sconto<br />
                                                    Carrello €30 → Paghi €25
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* OPZIONI CODICE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ⚙️ Opzioni Disponibili
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">🔤 Codice</strong>
                                                <p className="text-xs text-gray-600">Il codice che il cliente inserisce al checkout (es. BENVENUTO10, NATALE2024)</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">🛒 Acquisto Minimo</strong>
                                                <p className="text-xs text-gray-600">Il carrello deve raggiungere questo importo per usare il codice (es. min €30)</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">🔢 Max Utilizzi</strong>
                                                <p className="text-xs text-gray-600">Quante volte può essere usato il codice in totale (lascia vuoto per illimitato)</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">📅 Scadenza</strong>
                                                <p className="text-xs text-gray-600">Data dopo la quale il codice non sarà più valido</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <strong className="text-sm block mb-1">✅ Attivo/Inattivo</strong>
                                                <p className="text-xs text-gray-600">Puoi disattivare temporaneamente un codice senza eliminarlo</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* IDEE CODICI */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            💡 Idee per Codici Promozionali
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <strong className="text-sm text-purple-800">BENVENUTO10</strong>
                                                <p className="text-xs text-purple-700">10% sconto per nuovi clienti</p>
                                            </div>
                                            <div className="p-3 bg-red-50 rounded-lg">
                                                <strong className="text-sm text-red-800">NATALE2024</strong>
                                                <p className="text-xs text-red-700">Sconto natalizio a tempo limitato</p>
                                            </div>
                                            <div className="p-3 bg-yellow-50 rounded-lg">
                                                <strong className="text-sm text-yellow-800">SPEDIZIONEGRATIS</strong>
                                                <p className="text-xs text-yellow-700">€5 fissi (copri costo spedizione)</p>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <strong className="text-sm text-green-800">FEDELE15</strong>
                                                <p className="text-xs text-green-700">15% per clienti che tornano</p>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <strong className="text-sm text-blue-800">INSTAGRAM</strong>
                                                <p className="text-xs text-blue-700">Sconto esclusivo per follower</p>
                                            </div>
                                            <div className="p-3 bg-pink-50 rounded-lg">
                                                <strong className="text-sm text-pink-800">FLASH50</strong>
                                                <p className="text-xs text-pink-700">Vendita flash, max 20 utilizzi</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BEST PRACTICES */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">💡 Best Practices</h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ <strong>Nomi memorabili</strong> - Usa codici facili da ricordare e digitare</li>
                                            <li>✓ <strong>Sempre maiuscolo</strong> - I codici vengono convertiti automaticamente</li>
                                            <li>✓ <strong>Limita gli utilizzi</strong> - Crea urgenza con quantità limitate</li>
                                            <li>✓ <strong>Imposta scadenze</strong> - Promozioni a tempo spingono all'acquisto</li>
                                            <li>✓ <strong>Monitora l'uso</strong> - Controlla quante volte viene usato ogni codice</li>
                                            <li>✓ <strong>Non esagerare</strong> - Troppi sconti riducono il valore percepito</li>
                                        </ul>
                                    </div>

                                    {/* CREARE UN CODICE PASSO PASSO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ➕ Come Creare un Codice (Passo per Passo)
                                        </h3>
                                        <ol className="space-y-4">
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</span>
                                                <div>
                                                    <strong className="block text-gray-800">Vai in Admin → Promo</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Dalla dashboard, clicca su &quot;Promo&quot; nel menu.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">2</span>
                                                <div>
                                                    <strong className="block text-gray-800">Clicca &quot;Nuovo Codice&quot;</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Pulsante in alto a destra della pagina.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</span>
                                                <div>
                                                    <strong className="block text-gray-800">Scegli il codice</strong>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Usa lettere e numeri, es: <code className="bg-gray-100 px-2 py-0.5 rounded text-purple-600">ESTATE20</code> o <code className="bg-gray-100 px-2 py-0.5 rounded text-purple-600">BENVENUTO10</code>
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">4</span>
                                                <div>
                                                    <strong className="block text-gray-800">Scegli tipo e valore</strong>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Percentuale (es: 20%) o importo fisso (es: €5)
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">5</span>
                                                <div>
                                                    <strong className="block text-gray-800">Imposta limiti (opzionale)</strong>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Acquisto minimo, max utilizzi, data scadenza
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">6</span>
                                                <div>
                                                    <strong className="block text-gray-800">Salva e condividi!</strong>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Il codice è subito attivo. Condividilo sui social, email, o dove vuoi!
                                                    </p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* STRATEGIE PROMO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📈 Strategie di Marketing
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-purple-50 rounded-lg">
                                                <strong className="text-purple-800 block mb-2">🆕 Acquisizione Nuovi Clienti</strong>
                                                <p className="text-sm text-purple-700 mb-2">Attira nuovi clienti con sconti di benvenuto</p>
                                                <ul className="text-xs text-purple-600 space-y-1">
                                                    <li>• <code className="bg-white px-1 rounded">BENVENUTO10</code> - 10% sul primo ordine</li>
                                                    <li>• Limita a 1 utilizzo per email</li>
                                                    <li>• Promuovi sulla homepage e nei popup</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <strong className="text-green-800 block mb-2">🔁 Fidelizzazione</strong>
                                                <p className="text-sm text-green-700 mb-2">Premia i clienti che tornano</p>
                                                <ul className="text-xs text-green-600 space-y-1">
                                                    <li>• <code className="bg-white px-1 rounded">GRAZIE15</code> - 15% per chi ha già comprato</li>
                                                    <li>• Invialo via email dopo un acquisto</li>
                                                    <li>• Crea senso di esclusività</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-orange-50 rounded-lg">
                                                <strong className="text-orange-800 block mb-2">⚡ Urgenza e Scarsità</strong>
                                                <p className="text-sm text-orange-700 mb-2">Spingi all&apos;azione immediata</p>
                                                <ul className="text-xs text-orange-600 space-y-1">
                                                    <li>• <code className="bg-white px-1 rounded">FLASH30</code> - Valido solo 24 ore</li>
                                                    <li>• Max 10-20 utilizzi totali</li>
                                                    <li>• Annuncia sui social con countdown</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-red-50 rounded-lg">
                                                <strong className="text-red-800 block mb-2">🎄 Stagionali e Festività</strong>
                                                <p className="text-sm text-red-700 mb-2">Sfrutta le occasioni speciali</p>
                                                <ul className="text-xs text-red-600 space-y-1">
                                                    <li>• <code className="bg-white px-1 rounded">NATALE24</code>, <code className="bg-white px-1 rounded">BLACKFRIDAY</code></li>
                                                    <li>• Inizia qualche giorno prima</li>
                                                    <li>• Scadenza il giorno dopo la festività</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <strong className="text-blue-800 block mb-2">📱 Social Media</strong>
                                                <p className="text-sm text-blue-700 mb-2">Esclusivi per follower</p>
                                                <ul className="text-xs text-blue-600 space-y-1">
                                                    <li>• <code className="bg-white px-1 rounded">INSTAGRAM</code>, <code className="bg-white px-1 rounded">TIKTOK</code></li>
                                                    <li>• Traccia da dove arrivano i clienti</li>
                                                    <li>• Premia chi ti segue</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COME FUNZIONA AL CHECKOUT */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🛒 Come Funziona per il Cliente
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">1</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Il cliente aggiunge prodotti al carrello</strong>
                                                        <p className="text-sm text-gray-600 mt-1">Naviga il sito e sceglie cosa comprare</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">2</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Va al carrello</strong>
                                                        <p className="text-sm text-gray-600 mt-1">Vede il riepilogo con tutti i prodotti</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">3</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Inserisce il codice promo</strong>
                                                        <p className="text-sm text-gray-600 mt-1">C&apos;è un campo dedicato nel carrello</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">4</span>
                                                    <div>
                                                        <strong className="block text-gray-800">Lo sconto viene applicato!</strong>
                                                        <p className="text-sm text-gray-600 mt-1">Vede il nuovo totale scontato</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATISTICHE E MONITORAGGIO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📊 Monitorare i Codici
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <strong className="text-blue-800 block mb-2">📈 Cosa puoi vedere</strong>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    <li>• Quante volte è stato usato</li>
                                                    <li>• Utilizzi rimanenti (se limitato)</li>
                                                    <li>• Se è attivo o scaduto</li>
                                                    <li>• Valore totale degli sconti dati</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <strong className="text-green-800 block mb-2">💡 Azioni rapide</strong>
                                                <ul className="text-sm text-green-700 space-y-1">
                                                    <li>• Disattiva temporaneamente</li>
                                                    <li>• Modifica scadenza</li>
                                                    <li>• Aumenta max utilizzi</li>
                                                    <li>• Duplica per nuova promo</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAQ PROMO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ❓ Domande Frequenti sui Codici Promo
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Il cliente dice che il codice non funziona?</strong>
                                                <p className="text-sm text-gray-600">Controlla: è attivo? È scaduto? Ha raggiunto il limite utilizzi? Il carrello supera il minimo richiesto?</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Posso avere più codici attivi insieme?</strong>
                                                <p className="text-sm text-gray-600">Sì! Puoi avere quanti codici vuoi attivi contemporaneamente. Il cliente ne può usare uno alla volta.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Il codice è case-sensitive (maiuscole/minuscole)?</strong>
                                                <p className="text-sm text-gray-600">No! Il sistema converte tutto in maiuscolo. &quot;estate20&quot; e &quot;ESTATE20&quot; sono lo stesso codice.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Posso eliminare un codice usato?</strong>
                                                <p className="text-sm text-gray-600">Sì, ma meglio solo disattivarlo. Così mantieni lo storico di quanto è stato usato.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Come faccio a sapere quale promo funziona meglio?</strong>
                                                <p className="text-sm text-gray-600">Guarda quante volte è stato usato ogni codice. Quelli più usati sono quelli che funzionano!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* EMAIL AUTOMATICHE */}
                            {activeSection === 'email' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            📧 Email Automatiche
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Sistema di email preimpostate per comunicare automaticamente con i clienti in ogni fase dell&apos;acquisto.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-2 sm:ml-3">
                                                <h3 className="text-xs sm:text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
                                                    <Link href="/admin/email" className="font-semibold underline">
                                                        Vai alla Gestione Email →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIPI DI EMAIL */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📬 Template Disponibili
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">🛒</span>
                                                    <strong className="text-green-800">Conferma Ordine</strong>
                                                </div>
                                                <p className="text-sm text-green-700">Inviata automaticamente quando un cliente completa un acquisto. Include riepilogo ordine, totale e link tracking.</p>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">🚚</span>
                                                    <strong className="text-blue-800">Notifica Spedizione</strong>
                                                </div>
                                                <p className="text-sm text-blue-700">Inviata quando aggiungi il tracking. Include numero tracking e link per seguire la spedizione.</p>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">✉️</span>
                                                    <strong className="text-purple-800">Benvenuto Newsletter</strong>
                                                </div>
                                                <p className="text-sm text-purple-700">Inviata automaticamente a chi si iscrive alla newsletter. Include codice sconto BENVENUTO10.</p>
                                            </div>
                                            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">✅</span>
                                                    <strong className="text-yellow-800">Ordine Consegnato</strong>
                                                </div>
                                                <p className="text-sm text-yellow-700">Inviata quando l&apos;ordine risulta consegnato. Invita il cliente a lasciare una recensione.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PLACEHOLDER */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🔤 Placeholder Dinamici
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">I template usano placeholder che vengono sostituiti automaticamente:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            <code className="bg-gray-100 px-3 py-2 rounded text-sm text-purple-600">{'{{customerName}}'}</code>
                                            <code className="bg-gray-100 px-3 py-2 rounded text-sm text-purple-600">{'{{orderNumber}}'}</code>
                                            <code className="bg-gray-100 px-3 py-2 rounded text-sm text-purple-600">{'{{totalAmount}}'}</code>
                                            <code className="bg-gray-100 px-3 py-2 rounded text-sm text-purple-600">{'{{trackingNumber}}'}</code>
                                            <code className="bg-gray-100 px-3 py-2 rounded text-sm text-purple-600">{'{{shippingAddress}}'}</code>
                                            <code className="bg-gray-100 px-3 py-2 rounded text-sm text-purple-600">{'{{siteName}}'}</code>
                                        </div>
                                    </div>

                                    {/* FUNZIONALITÀ */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">✨ Funzionalità</h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ <strong>Template personalizzabili</strong> - Modifica oggetto e corpo email</li>
                                            <li>✓ <strong>Anteprima</strong> - Vedi come apparirà l&apos;email prima di inviarla</li>
                                            <li>✓ <strong>Storico invii</strong> - Traccia tutte le email inviate</li>
                                            <li>✓ <strong>Statistiche</strong> - Monitora email inviate e fallite</li>
                                            <li>✓ <strong>Design professionale</strong> - Template HTML responsive e belli</li>
                                        </ul>
                                    </div>

                                    {/* QUANDO VENGONO INVIATE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📤 Quando Vengono Inviate le Email
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">🛒</span>
                                                    <div>
                                                        <strong className="text-gray-800">Conferma Ordine</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <strong>Quando:</strong> Subito dopo il pagamento completato con successo
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Automatica - Non devi fare nulla
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">🚚</span>
                                                    <div>
                                                        <strong className="text-gray-800">Notifica Spedizione</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <strong>Quando:</strong> Clicchi &quot;Invia Email Spedizione&quot; nella pagina ordine
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Manuale - Devi cliccare dopo aver inserito il tracking
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-400">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">✉️</span>
                                                    <div>
                                                        <strong className="text-gray-800">Benvenuto Newsletter</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <strong>Quando:</strong> Qualcuno si iscrive alla newsletter dal sito
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Automatica - Non devi fare nulla
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-400">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">✅</span>
                                                    <div>
                                                        <strong className="text-gray-800">Ordine Consegnato</strong>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <strong>Quando:</strong> Imposti lo stato ordine su &quot;Delivered&quot;
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Manuale - Cambia stato quando il corriere conferma consegna
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COME GESTIRE I TEMPLATE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ✏️ Come Modificare i Template
                                        </h3>
                                        <ol className="space-y-4">
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</span>
                                                <div>
                                                    <strong className="block text-gray-800">Vai in Admin → Email</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Trovi tutti i template disponibili nella lista.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">2</span>
                                                <div>
                                                    <strong className="block text-gray-800">Clicca il pulsante modifica (matita)</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Si apre il modal di modifica con oggetto e corpo email.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</span>
                                                <div>
                                                    <strong className="block text-gray-800">Modifica l&apos;oggetto</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Cambia il titolo che appare nell&apos;email. Puoi usare i placeholder!</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">4</span>
                                                <div>
                                                    <strong className="block text-gray-800">Modifica il corpo (HTML)</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Personalizza il contenuto. Usa i placeholder per dati dinamici.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">5</span>
                                                <div>
                                                    <strong className="block text-gray-800">Salva le modifiche</strong>
                                                    <p className="text-sm text-gray-600 mt-1">Da ora in poi, tutte le email di quel tipo useranno il nuovo template!</p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* ANTEPRIMA E LOG */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            👁️ Anteprima e Storico
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <strong className="text-blue-800 block mb-2">🔍 Anteprima Template</strong>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    <li>• Clicca l&apos;icona &quot;occhio&quot; accanto al template</li>
                                                    <li>• Vedi come apparirà l&apos;email</li>
                                                    <li>• I placeholder mostrano valori esempio</li>
                                                    <li>• Controlla prima di salvare modifiche</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <strong className="text-green-800 block mb-2">📋 Storico Email (Tab Logs)</strong>
                                                <ul className="text-sm text-green-700 space-y-1">
                                                    <li>• Vedi tutte le email inviate</li>
                                                    <li>• Data, destinatario, tipo</li>
                                                    <li>• Stato: ✓ inviata o ✗ fallita</li>
                                                    <li>• Utile per debug problemi</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PLACEHOLDER IN DETTAGLIO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🔤 Placeholder in Dettaglio
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Usa questi codici nei template - vengono sostituiti con i dati reali:</p>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                                                <code className="shrink-0 bg-purple-100 px-2 py-1 rounded text-sm text-purple-600">{'{{customerName}}'}</code>
                                                <div>
                                                    <strong className="text-sm text-gray-800">Nome Cliente</strong>
                                                    <p className="text-xs text-gray-600">Es: &quot;Ciao Marco&quot; → &quot;Ciao Giovanni&quot;</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                                                <code className="shrink-0 bg-purple-100 px-2 py-1 rounded text-sm text-purple-600">{'{{orderNumber}}'}</code>
                                                <div>
                                                    <strong className="text-sm text-gray-800">Numero Ordine</strong>
                                                    <p className="text-xs text-gray-600">Es: ORD-1234567890123</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                                                <code className="shrink-0 bg-purple-100 px-2 py-1 rounded text-sm text-purple-600">{'{{totalAmount}}'}</code>
                                                <div>
                                                    <strong className="text-sm text-gray-800">Totale Ordine</strong>
                                                    <p className="text-xs text-gray-600">Es: €25.00</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                                                <code className="shrink-0 bg-purple-100 px-2 py-1 rounded text-sm text-purple-600">{'{{trackingNumber}}'}</code>
                                                <div>
                                                    <strong className="text-sm text-gray-800">Numero Tracking</strong>
                                                    <p className="text-xs text-gray-600">Es: AB123456789IT (codice corriere)</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                                                <code className="shrink-0 bg-purple-100 px-2 py-1 rounded text-sm text-purple-600">{'{{shippingAddress}}'}</code>
                                                <div>
                                                    <strong className="text-sm text-gray-800">Indirizzo Spedizione</strong>
                                                    <p className="text-xs text-gray-600">Es: Via Roma 123, 00100 Roma RM</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                                                <code className="shrink-0 bg-purple-100 px-2 py-1 rounded text-sm text-purple-600">{'{{siteName}}'}</code>
                                                <div>
                                                    <strong className="text-sm text-gray-800">Nome Sito</strong>
                                                    <p className="text-xs text-gray-600">Es: Il desiderio di una stella</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BEST PRACTICES EMAIL */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-yellow-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-yellow-800">💡 Best Practices per le Email</h3>
                                        <ul className="space-y-2 text-sm text-yellow-700">
                                            <li>✓ <strong>Non modificare i placeholder</strong> - Devono essere esattamente {'{{nome}}'} con doppie parentesi</li>
                                            <li>✓ <strong>Testa le modifiche</strong> - Usa anteprima prima di salvare</li>
                                            <li>✓ <strong>Mantieni brevi</strong> - Email concise vengono lette di più</li>
                                            <li>✓ <strong>Personalizza il tono</strong> - Usa un linguaggio che rispecchia il tuo brand</li>
                                            <li>✓ <strong>Controlla i log</strong> - Se un&apos;email fallisce, controlla i log per capire perché</li>
                                            <li>✓ <strong>Attiva/disattiva</strong> - Puoi disattivare un template temporaneamente</li>
                                        </ul>
                                    </div>

                                    {/* FAQ EMAIL */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ❓ Domande Frequenti sulle Email
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">L&apos;email non arriva al cliente?</strong>
                                                <p className="text-sm text-gray-600">Controlla i log. Se mostra &quot;failed&quot;, potrebbe essere un problema di configurazione SMTP. Chiedi al cliente di controllare spam.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Posso aggiungere nuovi template?</strong>
                                                <p className="text-sm text-gray-600">I 4 template sono preconfigurati. Per template custom, contatta il supporto tecnico.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Come cambio il design delle email?</strong>
                                                <p className="text-sm text-gray-600">Il design HTML è pre-impostato per essere bello e responsive. Puoi cambiare il testo ma non il layout.</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="text-gray-800 block mb-1">Posso inviare email manualmente?</strong>
                                                <p className="text-sm text-gray-600">Sì! Dalla pagina ordine puoi cliccare &quot;Invia Email Spedizione&quot; o &quot;Invia Email Consegna&quot;.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ASSISTENTE VIRTUALE */}
                            {activeSection === 'assistente' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            🤖 Assistente Virtuale
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Chatbot intelligente che risponde automaticamente alle domande dei clienti 24/7. Aiuta con spedizioni, pagamenti, resi e molto altro!
                                        </p>
                                    </div>

                                    {/* COME FUNZIONA */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            💬 Come Funziona
                                        </h3>
                                        <ol className="space-y-3">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
                                                <div>
                                                    <strong>Cliente apre la chat</strong>
                                                    <p className="text-sm text-gray-600">Clicca sull&apos;icona in basso a destra</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
                                                <div>
                                                    <strong>Sceglie una domanda rapida o scrive</strong>
                                                    <p className="text-sm text-gray-600">Domande frequenti predefinite o testo libero</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
                                                <div>
                                                    <strong>L&apos;assistente analizza e risponde</strong>
                                                    <p className="text-sm text-gray-600">Usa AI per capire la domanda e dare la risposta migliore</p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* DOMANDE SUPPORTATE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ❓ Domande Supportate
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <strong className="text-sm text-blue-800">📦 Spedizioni</strong>
                                                <p className="text-xs text-blue-700">Costi, tempi, tracking</p>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <strong className="text-sm text-green-800">💳 Pagamenti</strong>
                                                <p className="text-xs text-green-700">Metodi accettati, sicurezza</p>
                                            </div>
                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <strong className="text-sm text-purple-800">🔄 Resi</strong>
                                                <p className="text-xs text-purple-700">Come restituire, tempi rimborso</p>
                                            </div>
                                            <div className="p-3 bg-orange-50 rounded-lg">
                                                <strong className="text-sm text-orange-800">✨ Personalizzazioni</strong>
                                                <p className="text-xs text-orange-700">Prodotti custom, preventivi</p>
                                            </div>
                                            <div className="p-3 bg-pink-50 rounded-lg">
                                                <strong className="text-sm text-pink-800">🛍️ Prodotti</strong>
                                                <p className="text-xs text-pink-700">Catalogo, disponibilità, prezzi</p>
                                            </div>
                                            <div className="p-3 bg-yellow-50 rounded-lg">
                                                <strong className="text-sm text-yellow-800">🏪 Info Negozio</strong>
                                                <p className="text-xs text-yellow-700">Chi siamo, contatti</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PERSONALIZZAZIONE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🎨 Personalizzazione
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Puoi personalizzare l&apos;assistente da <Link href="/admin/impostazioni" className="text-purple-600 underline">Impostazioni → Assistente</Link>:</p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>• <strong>Nome</strong> - Come si presenta l&apos;assistente</li>
                                            <li>• <strong>Colore</strong> - Abbinalo al tema del sito</li>
                                            <li>• <strong>Messaggio benvenuto</strong> - Prima cosa che vede il cliente</li>
                                            <li>• <strong>Posizione</strong> - Destra o sinistra dello schermo</li>
                                            <li>• <strong>Attivo/Disattivo</strong> - Nascondi temporaneamente</li>
                                        </ul>
                                    </div>

                                    {/* VANTAGGI */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">💡 Vantaggi</h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ <strong>Disponibile 24/7</strong> - Risponde anche quando non ci sei</li>
                                            <li>✓ <strong>Risposte immediate</strong> - Nessuna attesa per il cliente</li>
                                            <li>✓ <strong>Riduce le email</strong> - Risponde alle domande più comuni</li>
                                            <li>✓ <strong>Migliora le vendite</strong> - Aiuta i clienti indecisi</li>
                                            <li>✓ <strong>Zero manutenzione</strong> - Funziona automaticamente</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* TRADUZIONE SIMULTANEA */}
                            {activeSection === 'traduzione' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            🌍 Traduzione Simultanea
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Il sistema traduce automaticamente tutti i contenuti del sito in 9 lingue. Raggiungi clienti in tutto il mondo senza sforzo!
                                        </p>
                                    </div>

                                    {/* LINGUE SUPPORTATE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🗣️ 9 Lingue Supportate
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇮🇹</span>
                                                <div>
                                                    <div className="font-bold text-sm">Italiano</div>
                                                    <div className="text-xs text-gray-500">Lingua base</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇬🇧</span>
                                                <div>
                                                    <div className="font-bold text-sm">Inglese UK</div>
                                                    <div className="text-xs text-gray-500">British English</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇺🇸</span>
                                                <div>
                                                    <div className="font-bold text-sm">Americano</div>
                                                    <div className="text-xs text-gray-500">US English</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇫🇷</span>
                                                <div>
                                                    <div className="font-bold text-sm">Francese</div>
                                                    <div className="text-xs text-gray-500">Français</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇪🇸</span>
                                                <div>
                                                    <div className="font-bold text-sm">Spagnolo</div>
                                                    <div className="text-xs text-gray-500">Español</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇩🇪</span>
                                                <div>
                                                    <div className="font-bold text-sm">Tedesco</div>
                                                    <div className="text-xs text-gray-500">Deutsch</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇵🇹</span>
                                                <div>
                                                    <div className="font-bold text-sm">Portoghese</div>
                                                    <div className="text-xs text-gray-500">Português</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇷🇺</span>
                                                <div>
                                                    <div className="font-bold text-sm">Russo</div>
                                                    <div className="text-xs text-gray-500">Русский</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-2xl mr-2">🇨🇳</span>
                                                <div>
                                                    <div className="font-bold text-sm">Cinese</div>
                                                    <div className="text-xs text-gray-500">中文</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COME FUNZIONA */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ⚙️ Come Funziona la Traduzione
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">🔄 Traduzione Automatica</strong>
                                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                    <li>Quando crei un prodotto, nome e descrizione vengono tradotti automaticamente in tutte le lingue</li>
                                                    <li>La traduzione usa API intelligenti per risultati naturali</li>
                                                    <li>Tutti i testi statici del sito (pulsanti, menu, messaggi) sono già tradotti</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">✏️ Modifica Manuale</strong>
                                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                    <li>Puoi visualizzare e modificare ogni traduzione nel form prodotto</li>
                                                    <li>Se la traduzione automatica non è perfetta, correggila manualmente</li>
                                                    <li>Le modifiche manuali vengono salvate e non sovrascritte</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">🌐 Selezione Lingua Utente</strong>
                                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                    <li>L'utente seleziona la lingua dal menu in alto a destra (bandierina)</li>
                                                    <li>Tutto il sito si aggiorna istantaneamente nella lingua scelta</li>
                                                    <li>La preferenza viene salvata per le visite future</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COSA VIENE TRADOTTO */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            📝 Cosa Viene Tradotto
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <strong className="text-sm text-green-800 block mb-2">✅ Tradotto Automaticamente</strong>
                                                <ul className="text-xs text-green-700 space-y-1 list-disc ml-4">
                                                    <li>Nomi prodotti</li>
                                                    <li>Descrizioni prodotti</li>
                                                    <li>Categorie</li>
                                                    <li>Menu di navigazione</li>
                                                    <li>Pulsanti e form</li>
                                                    <li>Messaggi di errore/successo</li>
                                                    <li>Checkout e carrello</li>
                                                    <li>Email automatiche</li>
                                                    <li>Assistente virtuale</li>
                                                </ul>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <strong className="text-sm text-blue-800 block mb-2">ℹ️ Non Tradotto (fisso)</strong>
                                                <ul className="text-xs text-blue-700 space-y-1 list-disc ml-4">
                                                    <li>Nome del sito (personalizzabile)</li>
                                                    <li>Prezzi e valute (convertite, non tradotte)</li>
                                                    <li>Codici prodotto</li>
                                                    <li>Numeri d'ordine</li>
                                                    <li>Dati clienti</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MODIFICA TRADUZIONI */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-blue-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-blue-800">📋 Come Modificare le Traduzioni di un Prodotto</h3>
                                        <ol className="space-y-3 text-sm text-blue-700 list-decimal ml-5">
                                            <li>
                                                <strong>Vai alla modifica prodotto</strong>
                                                <p className="text-xs">Dashboard → Prodotti → clicca ✏️ sul prodotto</p>
                                            </li>
                                            <li>
                                                <strong>Scorri fino alle traduzioni</strong>
                                                <p className="text-xs">Sotto ogni campo (nome, descrizione) troverai le versioni tradotte</p>
                                            </li>
                                            <li>
                                                <strong>Espandi la lingua desiderata</strong>
                                                <p className="text-xs">Clicca sulla bandierina per vedere/modificare la traduzione</p>
                                            </li>
                                            <li>
                                                <strong>Modifica e salva</strong>
                                                <p className="text-xs">Le modifiche sono salvate insieme al prodotto</p>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* TIPS */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-purple-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-purple-800">💡 Suggerimenti per Traduzioni Migliori</h3>
                                        <ul className="space-y-2 text-sm text-purple-700">
                                            <li>✓ <strong>Scrivi descrizioni chiare in italiano</strong> - traduzioni migliori partono da testi chiari</li>
                                            <li>✓ <strong>Evita slang e modi di dire</strong> - non si traducono bene automaticamente</li>
                                            <li>✓ <strong>Controlla le lingue principali</strong> - almeno inglese e francese per l'Europa</li>
                                            <li>✓ <strong>Usa frasi brevi</strong> - più facili da tradurre correttamente</li>
                                            <li>✓ <strong>Chiedi feedback</strong> - se hai clienti stranieri, chiedi se le traduzioni sono ok</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* CAMBIO VALUTA */}
                            {activeSection === 'valuta' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            💱 Cambio Valuta Automatico
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            I prezzi vengono convertiti automaticamente nella valuta locale dell'utente. I tassi di cambio sono aggiornati in tempo reale per garantire prezzi sempre corretti.
                                        </p>
                                    </div>

                                    {/* VALUTE SUPPORTATE */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            💰 5 Valute Supportate
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-3xl mr-3">€</span>
                                                    <div>
                                                        <div className="font-bold text-lg">EUR - Euro</div>
                                                        <div className="text-xs text-gray-500">Valuta base del sistema</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-blue-700 mt-2">🇮🇹 Italia, 🇫🇷 Francia, 🇪🇸 Spagna, 🇩🇪 Germania, 🇵🇹 Portogallo</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-3xl mr-3">£</span>
                                                    <div>
                                                        <div className="font-bold text-lg">GBP - Sterlina</div>
                                                        <div className="text-xs text-gray-500">British Pound</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-2">🇬🇧 Regno Unito</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-3xl mr-3">$</span>
                                                    <div>
                                                        <div className="font-bold text-lg">USD - Dollaro</div>
                                                        <div className="text-xs text-gray-500">US Dollar</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-2">🇺🇸 Stati Uniti</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-3xl mr-3">₽</span>
                                                    <div>
                                                        <div className="font-bold text-lg">RUB - Rublo</div>
                                                        <div className="text-xs text-gray-500">Russian Ruble</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-2">🇷🇺 Russia</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-3xl mr-3">¥</span>
                                                    <div>
                                                        <div className="font-bold text-lg">CNY - Yuan</div>
                                                        <div className="text-xs text-gray-500">Chinese Yuan</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-2">🇨🇳 Cina</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COME FUNZIONA */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            ⚙️ Come Funziona il Cambio Valuta
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">🔄 Conversione Automatica</strong>
                                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                    <li>Quando l'utente seleziona una lingua, la valuta si adatta automaticamente</li>
                                                    <li>Esempio: Lingua UK → Prezzi in £ (Sterline)</li>
                                                    <li>I prezzi vengono ricalcolati istantaneamente su tutto il sito</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">📊 Tassi di Cambio in Tempo Reale</strong>
                                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                    <li>I tassi sono aggiornati automaticamente tramite <strong>ExchangeRate-API</strong></li>
                                                    <li>Aggiornamento ogni ora per prezzi sempre accurati</li>
                                                    <li>Se l'API non è disponibile, vengono usati tassi di backup</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <strong className="block mb-2">ℹ️ Tooltip Informativo</strong>
                                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                    <li>Accanto ai prezzi convertiti appare un'icona ℹ️</li>
                                                    <li>Passando il mouse, l'utente vede il prezzo originale in Euro</li>
                                                    <li>Mostra anche il tasso di cambio applicato e la data di aggiornamento</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MAPPATURA LINGUA-VALUTA */}
                                    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                            🗺️ Mappatura Lingua → Valuta
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Ecco come il sistema associa automaticamente lingua e valuta:</p>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="p-2 text-left">Lingua</th>
                                                        <th className="p-2 text-left">Valuta</th>
                                                        <th className="p-2 text-left">Simbolo</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    <tr><td className="p-2">🇮🇹 Italiano</td><td className="p-2">EUR</td><td className="p-2">€</td></tr>
                                                    <tr><td className="p-2">🇬🇧 Inglese UK</td><td className="p-2">GBP</td><td className="p-2">£</td></tr>
                                                    <tr><td className="p-2">🇺🇸 Americano</td><td className="p-2">USD</td><td className="p-2">$</td></tr>
                                                    <tr><td className="p-2">🇫🇷 Francese</td><td className="p-2">EUR</td><td className="p-2">€</td></tr>
                                                    <tr><td className="p-2">🇪🇸 Spagnolo</td><td className="p-2">EUR</td><td className="p-2">€</td></tr>
                                                    <tr><td className="p-2">🇩🇪 Tedesco</td><td className="p-2">EUR</td><td className="p-2">€</td></tr>
                                                    <tr><td className="p-2">🇵🇹 Portoghese</td><td className="p-2">EUR</td><td className="p-2">€</td></tr>
                                                    <tr><td className="p-2">🇷🇺 Russo</td><td className="p-2">RUB</td><td className="p-2">₽</td></tr>
                                                    <tr><td className="p-2">🇨🇳 Cinese</td><td className="p-2">CNY</td><td className="p-2">¥</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* PER L'ADMIN */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">👨‍💼 Informazioni per l'Admin</h3>
                                        <div className="space-y-3 text-sm text-green-700">
                                            <div className="p-3 bg-white rounded-lg">
                                                <strong className="block mb-1">💶 Prezzi sempre in Euro</strong>
                                                <p className="text-xs">Quando inserisci il prezzo di un prodotto, inseriscilo sempre in Euro. Il sistema converte automaticamente nelle altre valute per i clienti.</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-lg">
                                                <strong className="block mb-1">📊 Dashboard in Euro</strong>
                                                <p className="text-xs">Tutte le pagine admin mostrano i prezzi in Euro per coerenza nella gestione. I report e le statistiche sono sempre in valuta base.</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-lg">
                                                <strong className="block mb-1">💳 Pagamenti in Euro</strong>
                                                <p className="text-xs">Anche se il cliente vede il prezzo nella sua valuta, il pagamento Stripe viene elaborato in Euro. Le conversioni sono a scopo informativo.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ESEMPIO */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-blue-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-blue-800">📝 Esempio Pratico</h3>
                                        <div className="space-y-3 text-sm text-blue-700">
                                            <p>Un prodotto costa <strong>€15.00</strong>. Ecco come appare ai clienti:</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                                                <div className="p-2 bg-white rounded text-center">
                                                    <div className="text-xs text-gray-500">🇮🇹 Italia</div>
                                                    <div className="font-bold">€15.00</div>
                                                </div>
                                                <div className="p-2 bg-white rounded text-center">
                                                    <div className="text-xs text-gray-500">🇬🇧 UK</div>
                                                    <div className="font-bold">£12.80</div>
                                                </div>
                                                <div className="p-2 bg-white rounded text-center">
                                                    <div className="text-xs text-gray-500">🇺🇸 USA</div>
                                                    <div className="font-bold">$16.25</div>
                                                </div>
                                                <div className="p-2 bg-white rounded text-center">
                                                    <div className="text-xs text-gray-500">🇷🇺 Russia</div>
                                                    <div className="font-bold">₽1,425</div>
                                                </div>
                                                <div className="p-2 bg-white rounded text-center">
                                                    <div className="text-xs text-gray-500">🇨🇳 Cina</div>
                                                    <div className="font-bold">¥118.50</div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-blue-600 mt-2">* I valori sono indicativi e variano con i tassi di cambio reali</p>
                                        </div>
                                    </div>

                                    {/* TIPS */}
                                    <div className="border rounded-lg p-4 sm:p-6 bg-purple-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-purple-800">💡 Suggerimenti</h3>
                                        <ul className="space-y-2 text-sm text-purple-700">
                                            <li>✓ <strong>Prezzi "psicologici"</strong> - Il prezzo €9.99 potrebbe diventare £8.52 in UK. Considera prezzi tondi per risultati migliori</li>
                                            <li>✓ <strong>Margine di sicurezza</strong> - I tassi di cambio fluttuano. Considera un piccolo margine nei tuoi prezzi</li>
                                            <li>✓ <strong>Spedizioni internazionali</strong> - Ricorda che spedire all'estero costa di più. Valuta le spese di spedizione per paese</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* ANALYTICS */}
                            {activeSection === 'analytics' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            📊 Dashboard Analytics
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Monitora le performance del tuo e-commerce con statistiche dettagliate e grafici interattivi.
                                        </p>
                                    </div>

                                    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <BarChart3 className="h-5 w-5 text-indigo-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-indigo-800">Accesso Rapido</h3>
                                                <p className="mt-2 text-sm text-indigo-700">
                                                    <Link href="/admin/analytics" className="font-semibold underline">
                                                        Vai alla Dashboard Analytics →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>📈 Cosa puoi monitorare</h3>
                                        <ul className="space-y-3 text-gray-700">
                                            <li className="flex items-start">
                                                <span className="text-2xl mr-3">💰</span>
                                                <div><strong>Fatturato totale</strong> - Quanto hai incassato in un periodo</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-2xl mr-3">🛒</span>
                                                <div><strong>Numero ordini</strong> - Quanti ordini hai ricevuto</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-2xl mr-3">👥</span>
                                                <div><strong>Clienti unici</strong> - Quante persone diverse hanno acquistato</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-2xl mr-3">⭐</span>
                                                <div><strong>Recensioni</strong> - Media voti e numero recensioni</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-2xl mr-3">🏆</span>
                                                <div><strong>Top prodotti</strong> - I prodotti più venduti</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-2xl mr-3">📅</span>
                                                <div><strong>Andamento giornaliero</strong> - Grafico delle vendite nel tempo</div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">💡 Suggerimenti</h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ Controlla le analytics ogni settimana per identificare trend</li>
                                            <li>✓ Usa il selettore periodo per confrontare periodi diversi</li>
                                            <li>✓ I prodotti più venduti sono candidati per promozioni future</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* BLOG */}
                            {activeSection === 'blog' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            📝 Gestione Blog
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Crea contenuti per attirare visitatori e migliorare la SEO del tuo sito.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <FileText className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-2 text-sm text-blue-700">
                                                    <Link href="/admin/blog" className="font-semibold underline">
                                                        Vai alla Gestione Blog →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>✍️ Creare un articolo</h3>
                                        <ol className="space-y-3 text-gray-700">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
                                                <div><strong>Clicca "Nuovo Articolo"</strong></div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
                                                <div><strong>Compila titolo, estratto e contenuto</strong> (HTML supportato)</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
                                                <div><strong>Aggiungi tags</strong> separati da virgola per la categorizzazione</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>4</span>
                                                <div><strong>Pubblica</strong> quando sei pronto</div>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="border rounded-lg p-4 sm:p-6 bg-yellow-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-yellow-800">💡 Idee per articoli</h3>
                                        <ul className="space-y-2 text-sm text-yellow-700">
                                            <li>• Come prendersi cura dei prodotti artigianali</li>
                                            <li>• Dietro le quinte: come nascono le nostre creazioni</li>
                                            <li>• Guide regalo per occasioni speciali</li>
                                            <li>• Nuove collezioni e novità</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* FAQ */}
                            {activeSection === 'faq' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            ❓ Gestione FAQ
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Rispondi alle domande frequenti dei clienti per ridurre le richieste di supporto.
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <HelpCircle className="h-5 w-5 text-purple-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-purple-800">Accesso Rapido</h3>
                                                <p className="mt-2 text-sm text-purple-700">
                                                    <Link href="/admin/faq" className="font-semibold underline">
                                                        Vai alla Gestione FAQ →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>📂 Categorie disponibili</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <div className="p-3 bg-gray-100 rounded text-center text-sm">Generale</div>
                                            <div className="p-3 bg-gray-100 rounded text-center text-sm">Spedizioni</div>
                                            <div className="p-3 bg-gray-100 rounded text-center text-sm">Pagamenti</div>
                                            <div className="p-3 bg-gray-100 rounded text-center text-sm">Resi</div>
                                            <div className="p-3 bg-gray-100 rounded text-center text-sm">Prodotti</div>
                                            <div className="p-3 bg-gray-100 rounded text-center text-sm">Account</div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-4 sm:p-6 bg-green-50" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-base sm:text-xl font-bold mb-4 text-green-800">💡 Suggerimenti</h3>
                                        <ul className="space-y-2 text-sm text-green-700">
                                            <li>✓ Scrivi risposte chiare e concise</li>
                                            <li>✓ Organizza le FAQ nelle categorie appropriate</li>
                                            <li>✓ Usa l'ordine per mettere le domande più comuni in cima</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* LEGAL */}
                            {activeSection === 'legal' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            ⚖️ Pagine Legali
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Configura le pagine legali obbligatorie per il tuo e-commerce.
                                        </p>
                                    </div>

                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <Scale className="h-5 w-5 text-red-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">⚠️ Importante</h3>
                                                <p className="mt-2 text-sm text-red-700">
                                                    Le pagine legali sono obbligatorie per legge. Assicurati di configurarle correttamente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>📄 Pagine disponibili</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <span className="text-2xl mr-3">🔒</span>
                                                <div>
                                                    <strong>Privacy Policy</strong>
                                                    <p className="text-sm text-gray-600">Come raccogli e utilizzi i dati personali</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-2xl mr-3">📜</span>
                                                <div>
                                                    <strong>Termini e Condizioni</strong>
                                                    <p className="text-sm text-gray-600">Regole per l'utilizzo del sito e gli acquisti</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-2xl mr-3">📦</span>
                                                <div>
                                                    <strong>Politica Resi</strong>
                                                    <p className="text-sm text-gray-600">Come funzionano resi e rimborsi</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <Scale className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800">Accesso Rapido</h3>
                                                <p className="mt-2 text-sm text-blue-700">
                                                    <Link href="/admin/legal" className="font-semibold underline">
                                                        Vai alla Gestione Pagine Legali →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CARRELLI ABBANDONATI */}
                            {activeSection === 'carrelli' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-text)' }}>
                                            🛒 Recupero Carrelli Abbandonati
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Recupera le vendite perse inviando promemoria ai clienti che non hanno completato l'acquisto.
                                        </p>
                                    </div>

                                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <ShoppingCart className="h-5 w-5 text-orange-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-orange-800">Accesso Rapido</h3>
                                                <p className="mt-2 text-sm text-orange-700">
                                                    <Link href="/admin/carrelli-abbandonati" className="font-semibold underline">
                                                        Vai ai Carrelli Abbandonati →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-6" style={{ borderColor: 'var(--color-border)' }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>🔄 Come funziona</h3>
                                        <ol className="space-y-3 text-gray-700">
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
                                                <div>Il sistema salva automaticamente i carrelli non completati</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
                                                <div>Puoi inviare un'email di recupero con codice sconto 10%</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
                                                <div>Quando il cliente completa l'ordine, segna il carrello come recuperato</div>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>4</span>
                                                <div>Monitora le statistiche di recupero per valutare l'efficacia</div>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-red-100 rounded-lg text-center">
                                            <div className="text-2xl mb-1">⏳</div>
                                            <div className="font-bold text-red-800">In Attesa</div>
                                            <p className="text-xs text-red-600">Non ancora contattati</p>
                                        </div>
                                        <div className="p-4 bg-yellow-100 rounded-lg text-center">
                                            <div className="text-2xl mb-1">📧</div>
                                            <div className="font-bold text-yellow-800">Email Inviata</div>
                                            <p className="text-xs text-yellow-600">Promemoria inviato</p>
                                        </div>
                                        <div className="p-4 bg-green-100 rounded-lg text-center">
                                            <div className="text-2xl mb-1">✓</div>
                                            <div className="font-bold text-green-800">Recuperato</div>
                                            <p className="text-xs text-green-600">Ordine completato</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Guide */}
                <div className="mt-4 sm:mt-6 md:mt-8 text-center text-xs sm:text-sm text-gray-500 px-4">
                    <p>Hai bisogno di aiuto? Consulta la documentazione completa nel file <code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">GUIDA_ADMIN.md</code></p>
                </div>
            </div>
        </div >
    );
}
