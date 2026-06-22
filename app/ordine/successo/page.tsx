'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCartStore();
    const [order, setOrder] = useState<any>(null);
    const sessionId = searchParams.get('session_id');
    const paypalOrderId = searchParams.get('paypal_order');
    const codOrderId = searchParams.get('cod_order');

    useEffect(() => {
        if (sessionId || paypalOrderId || codOrderId) {
            // Svuota il carrello dopo l'acquisto
            clearCart();

            // Qui potresti fare una chiamata API per ottenere i dettagli dell'ordine
            // Per ora mostriamo solo un messaggio di successo
        }
    }, [sessionId, paypalOrderId, codOrderId, clearCart]);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_34%),linear-gradient(180deg,#f7fff9_0%,#ffffff_45%,#f9fafb_100%)]">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="rounded-4xl shadow-[0_24px_70px_rgba(31,41,55,0.14)] p-8 md:p-12 text-center border border-white/80 bg-white/85 backdrop-blur-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold">
                        <BadgeCheck className="w-4 h-4" /> Ordine registrato con successo
                    </div>
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

                    {codOrderId && (
                        <div className="rounded-2xl p-4 mb-8 bg-yellow-50 border border-yellow-200">
                            <p className="text-sm font-semibold text-yellow-800">
                                Pagamento alla consegna selezionato. Pagherai quando riceverai il pacco.
                            </p>
                        </div>
                    )}

                    <div className="rounded-3xl p-6 mb-8 border" style={{ backgroundColor: 'var(--color-background)', borderColor: 'rgba(229,231,235,0.9)' }}>
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

                    {(sessionId || paypalOrderId || codOrderId) && (
                        <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-200">
                            <p className="text-sm text-gray-600">
                                <strong>{codOrderId ? 'ID Ordine' : 'ID Pagamento'}:</strong> {(codOrderId || paypalOrderId || sessionId || '').substring(0, 30)}...
                            </p>
                        </div>
                    )}

                    <div className="mb-8 flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Dati ordine salvati</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 font-semibold text-blue-700"><Package className="w-4 h-4" /> Preparazione in corso</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/prodotti"
                            className="px-8 py-4 rounded-full hover:opacity-90 transition flex items-center justify-center space-x-2 shadow-lg"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                        >
                            <span>Continua gli Acquisti</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/"
                            className="border-2 px-8 py-4 rounded-full hover:opacity-80 transition"
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
