'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductImage {
    id: string;
    url: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    images: ProductImage[];
    category: string;
}

interface RelatedProductsProps {
    currentProductId: string
    category: string
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRelatedProducts()
    }, [currentProductId, category])

    const fetchRelatedProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const data = await res.json()

            // Filtra prodotti della stessa categoria, escludendo quello corrente
            const related = data
                .filter((p: Product) =>
                    p.id !== currentProductId &&
                    p.category === category
                )
                .slice(0, 4)

            // Se non ci sono abbastanza prodotti della stessa categoria, prendi altri casuali
            if (related.length < 4) {
                const others = data
                    .filter((p: Product) =>
                        p.id !== currentProductId &&
                        !related.find((r: Product) => r.id === p.id)
                    )
                    .slice(0, 4 - related.length)

                related.push(...others)
            }

            setProducts(related)
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }


    const getFirstImage = (images: ProductImage[]) => {
        if (images && images.length > 0) {
            return images[0].url;
        }
        return '/placeholder.jpg';
    }

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-xl mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                🛍️ Potrebbe piacerti anche
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/prodotti/${product.id}`}
                        className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
                    >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden">
                            <Image
                                src={getFirstImage(product.images)}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Info */}
                        <div className="p-3">
                            <h3
                                className="font-medium text-sm line-clamp-2 mb-1 group-hover:underline"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {product.name}
                            </h3>
                            <p className="font-bold" style={{ color: 'var(--color-primary)' }}>
                                €{product.price.toFixed(2)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
