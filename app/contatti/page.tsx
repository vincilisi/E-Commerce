'use client';

import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ContattiPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        oggetto: '',
        messaggio: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
    const [contactInfo, setContactInfo] = useState({
        contactEmail: 'info@ildesideriodiunastella.it',
        contactPhone: '+39 123 456 7890',
        contactWhatsapp: '+39 123 456 7890'
    });

    useEffect(() => {
        fetch('/api/settings', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                if (data?.settings) {
                    setContactInfo({
                        contactEmail: data.settings.contactEmail || 'info@ildesideriodiunastella.it',
                        contactPhone: data.settings.contactPhone || '+39 123 456 7890',
                        contactWhatsapp: data.settings.contactWhatsapp || data.settings.contactPhone || '+39 123 456 7890'
                    });
                }
            })
            .catch(() => {});
    }, []);

    const whatsappNumber = contactInfo.contactWhatsapp.replace(/\D/g, '');
    const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setNotice(null);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) {
                setNotice({ type: 'error', text: data.error || 'Errore durante l\'invio del messaggio' });
                return;
            }

            setNotice({ type: 'ok', text: 'Messaggio inviato con successo. Ti risponderemo al piu presto.' });
            setFormData({ nome: '', email: '', oggetto: '', messaggio: '' });
        } catch {
            setNotice({ type: 'error', text: 'Errore di rete durante l\'invio. Riprova tra poco.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <div className="container mx-auto px-4 max-w-6xl">
                <section className="hero-shell px-6 py-8 sm:px-8 md:px-10 md:py-11 mb-8 md:mb-10">
                    <p className="eyebrow mb-3">Supporto reale</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold title-balance" style={{ color: 'var(--color-text)' }}>
                        Un contatto umano, rapido e coerente con il brand.
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.74 }}>
                        Scrivici per ordini, personalizzazioni, preventivi e assistenza. Il tono resta premium, la risposta resta concreta.
                    </p>
                </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
                {/* Form Contatti */}
                <div className="surface-panel p-6 sm:p-8 md:p-9">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                        Inviaci un Messaggio
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="form-label">
                                Nome *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="form-input"
                                placeholder="Il tuo nome"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="form-input"
                                placeholder="tua@email.com"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Oggetto *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.oggetto}
                                onChange={(e) => setFormData({ ...formData, oggetto: e.target.value })}
                                className="form-input"
                                placeholder="Richiesta informazioni prodotto"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Messaggio *
                            </label>
                            <textarea
                                required
                                value={formData.messaggio}
                                onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                                rows={6}
                                className="form-textarea"
                                placeholder="Scrivi qui il tuo messaggio..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-lux-primary w-full py-3.5 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                            <span>{submitting ? 'Invio in corso...' : 'Invia Messaggio'}</span>
                        </button>

                        {notice && (
                            <div
                                className="rounded-lg px-4 py-3 text-sm"
                                style={{
                                    backgroundColor: notice.type === 'ok' ? '#ecfdf5' : '#fef2f2',
                                    color: notice.type === 'ok' ? '#065f46' : '#991b1b',
                                    border: `1px solid ${notice.type === 'ok' ? '#a7f3d0' : '#fecaca'}`
                                }}
                            >
                                {notice.text}
                            </div>
                        )}
                    </form>
                </div>

                {/* Info Contatti */}
                <div className="space-y-6">
                    <div className="surface-panel text-white p-8" style={{ background: `linear-gradient(145deg, rgba(165,59,47,0.95), rgba(196,108,50,0.92))` }}>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-display">
                            Informazioni di Contatto
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <Mail className="w-6 h-6 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Email</h3>
                                    <p>{contactInfo.contactEmail}</p>
                                    <p className="text-sm opacity-90 mt-1">
                                        Rispondiamo entro 24 ore
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <Phone className="w-6 h-6 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Telefono</h3>
                                    <p>{contactInfo.contactPhone}</p>
                                    <p className="text-sm opacity-90 mt-1">
                                        Lun-Ven: 9:00 - 18:00
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <MessageCircle className="w-6 h-6 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                                    {whatsappUrl ? (
                                        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="underline hover:opacity-80">
                                            {contactInfo.contactWhatsapp}
                                        </a>
                                    ) : (
                                        <p>{contactInfo.contactWhatsapp}</p>
                                    )}
                                    <p className="text-sm opacity-90 mt-1">
                                        Chat veloce per richieste e preventivi
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <MapPin className="w-6 h-6 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Sede</h3>
                                    <p>Italia</p>
                                    <p className="text-sm opacity-90 mt-1">
                                        Spediamo in tutta Italia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="surface-panel p-8">
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                            Orari di Lavoro
                        </h3>
                        <div className="space-y-2" style={{ color: 'var(--color-text)' }}>
                            <div className="flex justify-between">
                                <span>Lunedì - Venerdì:</span>
                                <span className="font-semibold">9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sabato:</span>
                                <span className="font-semibold">9:00 - 13:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Domenica:</span>
                                <span className="font-semibold">Chiuso</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
