'use client'

import { useState, useEffect } from 'react'
import { Star, User, ThumbsUp, Calendar } from 'lucide-react'

interface Review {
    id: string
    userName: string
    rating: number
    comment: string
    createdAt: string
}

interface ReviewListProps {
    productId: string
}

export default function ReviewList({ productId }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [avgRating, setAvgRating] = useState(0)

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`)
            const data = await res.json()
            setReviews(data.reviews || [])

            // Calcola media
            if (data.reviews?.length > 0) {
                const sum = data.reviews.reduce((acc: number, r: Review) => acc + r.rating, 0)
                setAvgRating(sum / data.reviews.length)
            }
        } catch (error) {
            console.error('Errore caricamento recensioni:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nessuna recensione ancora</p>
                <p className="text-sm text-gray-400">Sii il primo a lasciare una recensione!</p>
            </div>
        )
    }

    // Calcola distribuzione stelle
    const starDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
    }))

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col sm:flex-row gap-6">
                {/* Average Rating */}
                <div className="text-center sm:text-left">
                    <div className="text-5xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        {avgRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center sm:justify-start mt-2">
                        {renderStars(Math.round(avgRating))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {reviews.length} {reviews.length === 1 ? 'recensione' : 'recensioni'}
                    </p>
                </div>

                {/* Distribution */}
                <div className="flex-1 space-y-2">
                    {starDistribution.map(({ star, count, percentage }) => (
                        <div key={star} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-12">{star} stelle</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: 'var(--color-primary)'
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border rounded-lg p-4"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    {review.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                                        {review.userName}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {formatDate(review.createdAt)}
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                            {review.comment}
                        </p>

                        {/* Badge Acquisto Verificato (se ha ordine) */}
                        <div className="mt-3 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                <ThumbsUp className="w-3 h-3" />
                                Acquisto verificato
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
