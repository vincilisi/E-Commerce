'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCartStore();
    const [order, setOrder] = useState<any>(null);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Svuota il carrello dopo l'acquisto
            clearCart();

            // Qui potresti fare una chiamata API per ottenere i dettagli dell'ordine
            // Per ora mostriamo solo un messaggio di successo
        }
    }, [sessionId, clearCart]);

    return (
        <div className="min-h-screen flex items-center justify-center py-12" style={{ background: `linear-gradient(to bottom right, var(--color-background), var(--color-card-bg))` }}>
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="rounded-2xl shadow-2xl p-12 text-center" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full p-6" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                            <CheckCircle className="w-20 h-20 text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Ordine Confermato! 🎉
                    </h1>

                    <p className="text-xl mb-8" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        Grazie per il tuo acquisto. Il tuo ordine è stato ricevuto e sarà elaborato a breve.
                    </p>

                    <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: 'var(--color-background)' }}>
                        <div className="flex items-center justify-center space-x-3 mb-3" style={{ color: 'var(--color-primary)' }}>
                            <Package className="w-6 h-6" />
                            <h2 className="text-lg font-semibold">Prossimi Passi</h2>
                        </div>
                        <ul className="text-left space-y-2" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                            <li className="flex items-start">
                                <span className="mr-2" style={{ color: 'var(--color-primary)' }}>•</span>
                                <span>Riceverai un'email di conferma all'indirizzo fornito</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2" style={{ color: 'var(--color-primary)' }}>•</span>
                                <span>Il tuo ordine sarà preparato con cura nelle prossime 24-48 ore</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2" style={{ color: 'var(--color-primary)' }}>•</span>
                                <span>Ti invieremo un numero di tracking una volta spedito il pacco</span>
                            </li>
                        </ul>
                    </div>

                    {sessionId && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-8">
                            <p className="text-sm text-gray-600">
                                <strong>ID Sessione:</strong> {sessionId.substring(0, 30)}...
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/prodotti"
                            className="px-8 py-4 rounded-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                        >
                            <span>Continua gli Acquisti</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/"
                            className="border-2 px-8 py-4 rounded-lg hover:opacity-80 transition"
                            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                        >
                            Torna alla Home
                        </Link>
                    </div>

                    <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                            Hai domande? <Link href="/contatti" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Contattaci</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
