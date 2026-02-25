'use client'

import { useState, useEffect, use } from 'react'
import { ArrowLeft, Shield, FileText, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface LegalPage {
    id: string
    slug: string
    title: string
    content: string
}

const icons: Record<string, React.ReactNode> = {
    'privacy': <Shield className="w-8 h-8" />,
    'terms': <FileText className="w-8 h-8" />,
    'resi': <RotateCcw className="w-8 h-8" />
}

export default function LegalPageComponent({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params)
    const [page, setPage] = useState<LegalPage | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPage()
    }, [resolvedParams.slug])

    const fetchPage = async () => {
        try {
            const res = await fetch(`/api/legal?slug=${resolvedParams.slug}`)
            const data = await res.json()
            setPage(data)
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!page) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Pagina non trovata</h1>
                <Link href="/" className="text-purple-600 hover:underline">
                    Torna alla Home
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <article className="max-w-4xl mx-auto px-4">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Torna alla Home
                </Link>

                {/* Header */}
                <header className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className="p-3 rounded-xl"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                        >
                            {icons[resolvedParams.slug] || <FileText className="w-8 h-8" />}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                            {page.title}
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </header>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none"
                    style={{ color: 'var(--color-text)' }}
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />

                {/* Footer */}
                <div className="mt-12 pt-8 border-t text-center text-gray-500" style={{ borderColor: 'var(--color-border)' }}>
                    <p>Per domande su questa pagina, contattaci a <a href="mailto:info@ildesideriodiuna stella.it" className="underline">info@ildesideriodiunastella.it</a></p>
                </div>
            </article>
        </div>
    )
}
