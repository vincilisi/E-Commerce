'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderCircle, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export default function PaypalSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCartStore();
    const [error, setError] = useState('');

    const paypalOrderId = useMemo(() => searchParams.get('token') || '', [searchParams]);

    useEffect(() => {
        const capture = async () => {
            if (!paypalOrderId) {
                setError('Token PayPal non trovato.');
                return;
            }

            try {
                const res = await fetch('/api/payments/paypal/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paypalOrderId })
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Errore nella conferma del pagamento PayPal');
                    return;
                }

                clearCart();
                router.replace(data.redirectUrl || `/ordine/successo?paypal_order=${paypalOrderId}`);
            } catch {
                setError('Errore di rete durante la conferma del pagamento PayPal');
            }
        };

        capture();
    }, [paypalOrderId, clearCart, router]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_36%),linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#f9fafb_100%)]">
            <div className="max-w-lg w-full rounded-4xl shadow-[0_24px_60px_rgba(31,41,55,0.12)] p-8 text-center border border-white/80 bg-white/90 backdrop-blur-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                {!error ? (
                    <>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-blue-700 text-xs sm:text-sm font-semibold">
                            <ShieldCheck className="w-4 h-4" /> Connessione sicura PayPal
                        </div>
                        <LoaderCircle className="w-10 h-10 mx-auto mb-4 animate-spin" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
                            Conferma pagamento PayPal in corso...
                        </h1>
                        <p style={{ color: 'var(--color-text)', opacity: 0.75 }}>
                            Attendi qualche secondo, stiamo finalizzando il tuo ordine.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-3 text-red-600">Errore PayPal</h1>
                        <p className="mb-5" style={{ color: 'var(--color-text)' }}>{error}</p>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="px-5 py-3 rounded-full font-semibold shadow-lg"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                        >
                            Torna al checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
