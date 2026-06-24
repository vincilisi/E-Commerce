'use client'

import { useState, useEffect } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react'

interface FAQ {
    id: string
    question: string
    answer: string
    category: string
}

export default function FAQPage() {
    const [grouped, setGrouped] = useState<Record<string, FAQ[]>>({})
    const [loading, setLoading] = useState(true)
    const [openItems, setOpenItems] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchFAQs()
    }, [])

    const fetchFAQs = async () => {
        try {
            const res = await fetch('/api/faq')
            const data = await res.json()
            setGrouped(data.grouped || {})
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleItem = (id: string) => {
        const newOpen = new Set(openItems)
        if (newOpen.has(id)) {
            newOpen.delete(id)
        } else {
            newOpen.add(id)
        }
        setOpenItems(newOpen)
    }

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'generale': '📋 Generale',
            'spedizioni': '🚚 Spedizioni',
            'pagamenti': '💳 Pagamenti',
            'resi': '🔄 Resi e Rimborsi',
            'prodotti': '🛍️ Prodotti',
            'account': '👤 Account'
        }
        return labels[category] || `📁 ${category}`
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'generale': 'bg-gray-100 text-gray-800',
            'spedizioni': 'bg-blue-100 text-blue-800',
            'pagamenti': 'bg-green-100 text-green-800',
            'resi': 'bg-orange-100 text-orange-800',
            'prodotti': 'bg-purple-100 text-purple-800',
            'account': 'bg-pink-100 text-pink-800'
        }
        return colors[category] || 'bg-gray-100 text-gray-800'
    }

    // Filtra FAQ per ricerca
    const filteredGrouped = Object.entries(grouped).reduce((acc, [category, faqs]) => {
        const filtered = faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (filtered.length > 0) {
            acc[category] = filtered
        }
        return acc
    }, {} as Record<string, FAQ[]>)

    if (loading) {
        return (
            <div className="page-shell min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="page-shell min-h-screen">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="hero-shell text-center px-6 py-8 sm:px-8 md:px-10 md:py-11 mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <HelpCircle className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-4xl md:text-5xl font-bold title-balance" style={{ color: 'var(--color-text)' }}>
                            Domande Frequenti
                        </h1>
                    </div>
                    <p className="max-w-2xl mx-auto mb-8 text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.74 }}>
                        Trova rapidamente le risposte alle domande più comuni. Non trovi quello che cerchi? Contattaci!
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cerca nelle FAQ..."
                            className="form-input pl-12 pr-4 text-lg"
                        />
                    </div>
                </div>

                {Object.keys(filteredGrouped).length === 0 ? (
                    <div className="empty-state-panel text-center py-16 px-6">
                        <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                            {searchQuery ? 'Nessun risultato' : 'Nessuna FAQ ancora'}
                        </h2>
                        <p className="text-gray-500">
                            {searchQuery
                                ? 'Prova con termini diversi'
                                : 'Le FAQ saranno aggiunte presto!'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(filteredGrouped).map(([category, faqs]) => (
                            <div key={category} className="surface-panel overflow-hidden">
                                {/* Category Header */}
                                <div className={`px-6 py-4 ${getCategoryColor(category)}`}>
                                    <h2 className="text-lg font-bold">
                                        {getCategoryLabel(category)}
                                    </h2>
                                </div>

                                {/* FAQ Items */}
                                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                    {faqs.map((faq) => (
                                        <div key={faq.id} className="border-b last:border-b-0">
                                            <button
                                                onClick={() => toggleItem(faq.id)}
                                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#fff7ef] transition-colors"
                                            >
                                                <span className="font-medium pr-8" style={{ color: 'var(--color-text)' }}>
                                                    {faq.question}
                                                </span>
                                                {openItems.has(faq.id) ? (
                                                    <ChevronUp className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 shrink-0 text-gray-400" />
                                                )}
                                            </button>

                                            {openItems.has(faq.id) && (
                                                <div className="px-6 pb-4">
                                                    <div
                                                        className="prose prose-sm max-w-none rounded-2xl p-4"
                                                        style={{ backgroundColor: 'rgba(255, 251, 245, 0.9)', color: '#5e463b' }}
                                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Contact CTA */}
                <div className="mt-12 surface-panel p-8 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                        Non hai trovato la risposta?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Il nostro team è pronto ad aiutarti! Contattaci e ti risponderemo il prima possibile.
                    </p>
                    <a
                        href="/contatti"
                        className="btn-lux-primary inline-flex items-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contattaci
                    </a>
                </div>
            </div>
        </div>
    )
}
