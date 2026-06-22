'use client';

import { Mail, Phone, MapPin, Send, MessageCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ContattiPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        messaggio: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string; previewUrl?: string } | null>(null);
    const [contactInfo, setContactInfo] = useState({
        assistantEmail: 'info@ildesideriodiunastella.it',
        assistantPhone: '+39 123 456 7890',
        assistantWhatsapp: '+39 123 456 7890'
    });

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setContactInfo({
                        assistantEmail: data.settings.assistantEmail || 'info@ildesideriodiunastella.it',
                        assistantPhone: data.settings.assistantPhone || '+39 123 456 7890',
                        assistantWhatsapp: data.settings.assistantWhatsapp || '+39 123 456 7890'
                    });
                }
            })
            .catch(() => { });
    }, []);

    const whatsappHref = `https://wa.me/${contactInfo.assistantWhatsapp.replace(/\D/g, '')}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormMessage(null);
        setSubmitting(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setFormMessage({
                    type: 'error',
                    text: data.error || 'Errore durante l\'invio del messaggio'
                });
                return;
            }

            setFormMessage({
                type: 'success',
                text: 'Messaggio inviato! Ti risponderemo al più presto.',
                previewUrl: data.previewUrl
            });
            setFormData({ nome: '', email: '', messaggio: '' });
        } catch {
            setFormMessage({
                type: 'error',
                text: 'Errore di connessione. Riprova tra poco.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.06),transparent_30%),linear-gradient(180deg,#fff_0%,#faf7ff_38%,#fff_100%)]">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto text-center mb-14 sm:mb-16">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">Customer care</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6" style={{ color: 'var(--color-text)' }}>
                        Parliamo del tuo ordine.
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
                        Richieste personalizzate, assistenza diretta e risposte in 24 ore. Il supporto umano non è optional.
                    </p>
                    <div className="flex justify-center gap-3 text-xs sm:text-sm flex-wrap">
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Dati protetti</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 font-semibold text-blue-700">📧 Risposta veloce</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 font-semibold text-purple-700">💬 Supporto umano</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Form Contatti */}
                    <div className="rounded-4xl shadow-[0_20px_50px_rgba(31,41,55,0.08)] p-8 border border-white/70 bg-white/80 backdrop-blur-xl">
                        <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6" style={{ color: 'var(--color-text)' }}>
                            Inviaci un Messaggio
                        </h2>

                        {formMessage && (
                        <div
                                className="mb-4 rounded-2xl px-4 py-3 text-sm font-medium border"
                                style={{
                                    backgroundColor: formMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                                    color: formMessage.type === 'success' ? '#166534' : '#991b1b',
                                    borderColor: formMessage.type === 'success' ? '#bbf7d0' : '#fecaca'
                                }}
                            >
                                <p>{formMessage.text}</p>
                                {formMessage.previewUrl && (
                                    <a
                                        href={formMessage.previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline underline-offset-2 hover:no-underline"
                                    >
                                        Apri anteprima email (sviluppo)
                                    </a>
                                )}
                            </div>
                        )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Nome *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="Il tuo nome"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="tua@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Messaggio *
                            </label>
                            <textarea
                                required
                                minLength={10}
                                value={formData.messaggio}
                                onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="Scrivi qui il tuo messaggio..."
                            />
                            <p className="mt-1 text-sm text-gray-500">Minimo 10 caratteri.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center space-x-2 shadow-lg"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                        >
                            <Send className="w-5 h-5" />
                            <span>{submitting ? 'Invio in corso...' : 'Invia Messaggio'}</span>
                        </button>
                    </form>
                </div>

                {/* Info Contatti */}
                <div className="lg:sticky lg:top-6 self-start">
                    <div className="text-white rounded-4xl p-8 mb-6 shadow-[0_24px_70px_rgba(31,41,55,0.18)] relative overflow-hidden" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-6">
                                Informazioni di Contatto
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <Mail className="w-6 h-6 mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p>
                                            <a href={`mailto:${contactInfo.assistantEmail}`} className="underline underline-offset-2 hover:no-underline">
                                                {contactInfo.assistantEmail}
                                            </a>
                                        </p>
                                        <p className="text-sm opacity-90 mt-1">
                                            Rispondiamo entro 24 ore
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <Phone className="w-6 h-6 mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Telefono</h3>
                                        <p>
                                            <a href={`tel:${contactInfo.assistantPhone}`} className="underline underline-offset-2 hover:no-underline">
                                                {contactInfo.assistantPhone}
                                            </a>
                                        </p>
                                        <p className="text-sm opacity-90 mt-1">
                                            Lun-Ven: 9:00 - 18:00
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <MessageCircle className="w-6 h-6 mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                                        <p>
                                            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline">
                                                {contactInfo.assistantWhatsapp}
                                            </a>
                                        </p>
                                        <p className="text-sm opacity-90 mt-1">
                                            Chat veloce con il nostro supporto
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
                    </div>

                    <div className="rounded-4xl shadow-[0_20px_50px_rgba(31,41,55,0.08)] p-8 border border-white/70 bg-white/80 backdrop-blur-xl">
                        <h3 className="text-xl font-black mb-4" style={{ color: 'var(--color-text)' }}>
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
