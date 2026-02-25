'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContattiPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        messaggio: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implementare invio form
        alert('Grazie per il tuo messaggio! Ti risponderemo al più presto.');
        setFormData({ nome: '', email: '', messaggio: '' });
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12" style={{ color: 'var(--color-text)' }}>
                Contattaci
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Form Contatti */}
                <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--color-text)' }}>
                        Inviaci un Messaggio
                    </h2>

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
                                value={formData.messaggio}
                                onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="Scrivi qui il tuo messaggio..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center space-x-2"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                        >
                            <Send className="w-5 h-5" />
                            <span>Invia Messaggio</span>
                        </button>
                    </form>
                </div>

                {/* Info Contatti */}
                <div>
                    <div className="text-white rounded-lg p-8 mb-6" style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` }}>
                        <h2 className="text-2xl font-bold mb-6">
                            Informazioni di Contatto
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Email</h3>
                                    <p>info@ildesideriodiunastella.it</p>
                                    <p className="text-sm opacity-90 mt-1">
                                        Rispondiamo entro 24 ore
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Telefono</h3>
                                    <p>+39 123 456 7890</p>
                                    <p className="text-sm opacity-90 mt-1">
                                        Lun-Ven: 9:00 - 18:00
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
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

                    <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: 'var(--color-card-bg)' }}>
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
    );
}
