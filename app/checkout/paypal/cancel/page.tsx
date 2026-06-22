'use client';

import Link from 'next/link';

export default function PaypalCancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.1),transparent_34%),linear-gradient(180deg,#fff7f7_0%,#ffffff_45%,#f9fafb_100%)]">
            <div className="max-w-lg w-full rounded-4xl shadow-[0_24px_60px_rgba(31,41,55,0.12)] p-8 text-center border border-white/80 bg-white/90 backdrop-blur-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--color-text)' }}>
                    Pagamento PayPal annullato
                </h1>
                <p className="mb-6" style={{ color: 'var(--color-text)', opacity: 0.75 }}>
                    Nessun addebito e stato effettuato. Puoi riprovare quando vuoi.
                </p>
                <div className="flex justify-center gap-3">
                    <Link
                        href="/checkout"
                        className="px-5 py-3 rounded-full font-semibold shadow-lg"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                    >
                        Riprova pagamento
                    </Link>
                    <Link
                        href="/carrello"
                        className="px-5 py-3 rounded-full border-2 font-semibold"
                        style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                    >
                        Torna al carrello
                    </Link>
                </div>
            </div>
        </div>
    );
}
