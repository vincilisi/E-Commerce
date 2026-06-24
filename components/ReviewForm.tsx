'use client'

import { useState } from 'react'
import { Star, Send, CheckCircle } from 'lucide-react'

interface ReviewFormProps {
    productId: string
    productName: string
    onReviewSubmitted?: () => void
}

export default function ReviewForm({ productId, productName, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [userName, setUserName] = useState('')
    const [comment, setComment] = useState('')
    const [orderNumber, setOrderNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            setError('Seleziona una valutazione')
            return
        }
        if (!userName.trim()) {
            setError('Inserisci il tuo nome')
            return
        }
        if (!comment.trim()) {
            setError('Scrivi un commento')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    userName,
                    rating,
                    comment,
                    orderNumber: orderNumber || undefined
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Errore invio recensione')
            }

            setSubmitted(true)
            onReviewSubmitted?.()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore invio recensione')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="surface-panel p-6 text-center bg-green-50/80 border-green-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-800 mb-2">Grazie per la tua recensione!</h3>
                <p className="text-green-600 text-sm">La tua opinione è preziosa per noi e per gli altri clienti.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="surface-panel p-6 sm:p-7 space-y-5">
            <p className="eyebrow">Recensione cliente</p>
            <h3 className="font-bold text-2xl font-display" style={{ color: 'var(--color-text)' }}>
                Lascia una recensione per &quot;{productName}&quot;
            </h3>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                    {error}
                </div>
            )}

            {/* Rating Stars */}
            <div>
                <label className="form-label mb-2" style={{ color: 'var(--color-text)' }}>
                    Valutazione *
                </label>
                <div className="surface-soft inline-flex gap-1 p-2.5 rounded-full">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Nome */}
            <div>
                <label className="form-label" style={{ color: 'var(--color-text)' }}>
                    Il tuo nome *
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Mario Rossi"
                    className="form-input text-sm"
                />
            </div>

            {/* Numero Ordine (opzionale) */}
            <div>
                <label className="form-label" style={{ color: 'var(--color-text)' }}>
                    Numero Ordine <span className="text-gray-400">(opzionale)</span>
                </label>
                <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="ORD-1234567890123"
                    className="form-input text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Inseriscilo per verificare che hai acquistato il prodotto
                </p>
            </div>

            {/* Commento */}
            <div>
                <label className="form-label" style={{ color: 'var(--color-text)' }}>
                    La tua recensione *
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cosa ne pensi di questo prodotto? Qualità, consegna, packaging..."
                    rows={4}
                    className="form-textarea text-sm resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-lux-primary w-full py-3.5 flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Invio in corso...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Invia Recensione
                    </>
                )}
            </button>
        </form>
    )
}
