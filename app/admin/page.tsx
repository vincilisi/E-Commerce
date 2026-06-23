'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Settings, ShoppingBag, Palette, Plus, LogOut, BookOpen, Calendar, Tag, Mail, MapPin, BarChart3, FileText, HelpCircle, Scale, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (!data.user || data.user.role !== 'admin') {
                    router.push('/login');
                } else {
                    setUser(data.user);
                }
                setLoading(false);
            });
    }, [router]);

=======
    const [assistantPhone, setAssistantPhone] = useState('+39 02 1234 5678');
    const [assistantWhatsapp, setAssistantWhatsapp] = useState('+39 02 1234 5678');
    const [assistantEmail, setAssistantEmail] = useState('info@ildesiderio.it');
    const [contactsSaving, setContactsSaving] = useState(false);
    const [contactsMessage, setContactsMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const authRes = await fetch('/api/auth/me');
                const authData = await authRes.json();

                if (!authData.user || authData.user.role !== 'admin') {
                    router.push('/login');
                    return;
                }

                setUser(authData.user);

                const settingsRes = await fetch('/api/admin/settings');
                const settingsData = await settingsRes.json();
                if (settingsData.settings) {
                    setAssistantPhone(settingsData.settings.assistantPhone || '+39 02 1234 5678');
                    setAssistantWhatsapp(settingsData.settings.assistantWhatsapp || '+39 02 1234 5678');
                    setAssistantEmail(settingsData.settings.assistantEmail || 'info@ildesiderio.it');
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [router]);

    const saveContacts = async () => {
        if (!assistantPhone.trim() || !assistantWhatsapp.trim() || !assistantEmail.trim()) {
            setContactsMessage('Inserisci telefono, WhatsApp ed email validi.');
            return;
        }

        setContactsSaving(true);
        setContactsMessage('');

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assistantPhone,
                    assistantWhatsapp,
                    assistantEmail,
                }),
            });

            if (!res.ok) {
                setContactsMessage('Errore durante il salvataggio.');
                return;
            }

            setContactsMessage('Contatti aggiornati con successo.');
        } catch {
            setContactsMessage('Errore durante il salvataggio.');
        } finally {
            setContactsSaving(false);
        }
    };

>>>>>>> master
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Caricamento...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard Admin</h1>
                    <div style={{ color: 'var(--color-text)', opacity: 0.7 }}>Benvenuto, {user.name}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gestione Prodotti */}
                    <Link href="/admin/prodotti" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <Package className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                            <Plus className="w-8 h-8" style={{ color: 'var(--color-border)' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Prodotti</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Gestisci i prodotti del catalogo</p>
                    </Link>

                    {/* Gestione Ordini */}
                    <Link href="/admin/ordini" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <ShoppingBag className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Ordini</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Visualizza e gestisci gli ordini</p>
                    </Link>

                    {/* Impostazioni Sito */}
                    <Link href="/admin/impostazioni" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <Palette className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                            <Settings className="w-8 h-8" style={{ color: 'var(--color-border)' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Impostazioni</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Colori, logo e configurazioni</p>
                    </Link>

                    {/* Anteprima Tema */}
                    <Link href="/admin/anteprima" className="rounded-lg shadow-md p-6 hover:shadow-xl transition border-2" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-primary)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}>👁️</div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Anteprima Tema</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Vedi i colori in tempo reale</p>
                    </Link>

                    {/* Guida Admin */}
                    <Link href="/admin/guida" className="rounded-lg shadow-md p-6 hover:shadow-xl transition border-2 border-dashed" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-accent)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <BookOpen className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Guida Admin</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Tutorial completo del pannello</p>
                    </Link>

                    {/* Gestione Eventi */}
                    <Link href="/admin/eventi" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <Calendar className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-primary)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Eventi</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Crea e gestisci eventi speciali</p>
                    </Link>

                    {/* Codici Promozionali */}
                    <Link href="/admin/promo" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <Tag className="w-12 h-12" style={{ color: 'var(--color-secondary)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-secondary)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Codici Promo</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Gestisci sconti e promozioni</p>
                    </Link>

                    {/* Gestione Email */}
                    <Link href="/admin/email" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <Mail className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-primary)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Email</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Template email e storico invii</p>
                    </Link>

                    {/* Traccia Ordine */}
                    <Link href="/traccia-ordine" className="rounded-lg shadow-md p-6 hover:shadow-xl transition border" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <MapPin className="w-12 h-12" style={{ color: 'var(--color-secondary)' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Tracking</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Pagina pubblica traccia ordine</p>
                    </Link>

                    {/* Analytics */}
                    <Link href="/admin/analytics" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <BarChart3 className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-accent)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Analytics</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Statistiche dettagliate vendite</p>
                    </Link>

                    {/* Carrelli Abbandonati */}
                    <Link href="/admin/carrelli-abbandonati" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <ShoppingCart className="w-12 h-12" style={{ color: 'var(--color-secondary)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-secondary)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Carrelli Abbandonati</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Recupera vendite perse</p>
                    </Link>

                    {/* Blog */}
                    <Link href="/admin/blog" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-primary)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Blog</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Gestisci articoli del blog</p>
                    </Link>

                    {/* FAQ */}
                    <Link href="/admin/faq" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <HelpCircle className="w-12 h-12" style={{ color: 'var(--color-secondary)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-secondary)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>FAQ</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Domande frequenti</p>
                    </Link>

                    {/* Pagine Legali */}
                    <Link href="/admin/legal" className="rounded-lg shadow-md p-6 hover:shadow-xl transition" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <Scale className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                            <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-primary)' }}>NUOVO</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Pagine Legali</h2>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Privacy, Termini, Resi</p>
                    </Link>
                </div>

                <div className="mt-8 rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--color-card-bg)' }}>
<<<<<<< HEAD
=======
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Contatti Assistenza</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Numero telefono</label>
                            <input
                                type="text"
                                value={assistantPhone}
                                onChange={(e) => setAssistantPhone(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                                placeholder="+39 02 1234 5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Numero WhatsApp</label>
                            <input
                                type="text"
                                value={assistantWhatsapp}
                                onChange={(e) => setAssistantWhatsapp(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                                placeholder="+39 02 1234 5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Email assistenza</label>
                            <input
                                type="email"
                                value={assistantEmail}
                                onChange={(e) => setAssistantEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                                placeholder="info@ildesiderio.it"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={saveContacts}
                                disabled={contactsSaving}
                                className="w-full px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                            >
                                {contactsSaving ? 'Salvataggio...' : 'Salva Contatti'}
                            </button>
                        </div>
                    </div>
                    {contactsMessage && (
                        <p className="mt-3 text-sm" style={{ color: contactsMessage.includes('successo') ? '#16a34a' : '#dc2626' }}>
                            {contactsMessage}
                        </p>
                    )}
                </div>

                <div className="mt-8 rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--color-card-bg)' }}>
>>>>>>> master
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Statistiche Rapide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-background)' }}>
                            <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>--</div>
                            <div style={{ color: 'var(--color-text)', opacity: 0.7 }}>Prodotti Totali</div>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-background)' }}>
                            <div className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>--</div>
                            <div style={{ color: 'var(--color-text)', opacity: 0.7 }}>Ordini in Attesa</div>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-background)' }}>
                            <div className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>€--</div>
                            <div style={{ color: 'var(--color-text)', opacity: 0.7 }}>Vendite Totali</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
