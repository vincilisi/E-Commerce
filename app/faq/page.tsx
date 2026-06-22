'use client'

import { useState, useEffect } from 'react'
<<<<<<< HEAD
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react'
=======
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Sparkles } from 'lucide-react'
>>>>>>> master

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
<<<<<<< HEAD
        <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <HelpCircle className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                            Domande Frequenti
                        </h1>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Trova rapidamente le risposte alle domande più comuni. Non trovi quello che cerchi? Contattaci!
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
=======
        <div className="min-h-screen py-12 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.08),transparent_32%),linear-gradient(180deg,#fff_0%,#faf7ff_38%,#fff_100%)]" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 animate-slideUp">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Customer support</p>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <HelpCircle className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
                            Domande Frequenti
                        </h1>
                    </div>
                    <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed">
                        Risposte rapide alle domande più comuni. Supporto umano disponibile 24/7 per assistenza personalizzata.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative animate-slideUp animation-delay-150">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
>>>>>>> master
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cerca nelle FAQ..."
<<<<<<< HEAD
                            className="w-full pl-12 pr-4 py-4 rounded-full border text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{
                                borderColor: 'var(--color-border)'
                            }}
=======
                            className="w-full pl-14 pr-5 py-3.5 md:py-4 rounded-full border-2 text-base md:text-lg shadow-[0_12px_35px_rgba(31,41,55,0.08)] bg-white/90 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium"
                            style={{
                                borderColor: 'var(--color-border)',
                                '--tw-ring-color': 'var(--color-primary)'
                            } as any}
>>>>>>> master
                        />
                    </div>
                </div>

                {Object.keys(filteredGrouped).length === 0 ? (
<<<<<<< HEAD
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
=======
                    <div className="text-center py-16 bg-white/90 rounded-4xl shadow-[0_20px_55px_rgba(31,41,55,0.08)] border border-white/70 backdrop-blur-xl">
>>>>>>> master
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
<<<<<<< HEAD
                    <div className="space-y-8">
                        {Object.entries(filteredGrouped).map(([category, faqs]) => (
                            <div key={category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                {/* Category Header */}
                                <div className={`px-6 py-4 ${getCategoryColor(category)}`}>
                                    <h2 className="text-lg font-bold">
                                        {getCategoryLabel(category)}
                                    </h2>
=======
                    <div className="space-y-6 animate-fadeIn">
                        {Object.entries(filteredGrouped).map(([category, faqs], catIndex) => (
                            <div key={category} className="bg-white/90 rounded-4xl shadow-[0_18px_50px_rgba(31,41,55,0.08)] border border-white/70 overflow-hidden backdrop-blur-xl hover:shadow-[0_24px_65px_rgba(31,41,55,0.12)] transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${catIndex * 50}ms` }}>
                                {/* Category Header */}
                                <div className={`px-6 md:px-8 py-5 md:py-6 ${getCategoryColor(category)} border-b-2`}>
                                    <h2 className="text-lg md:text-xl font-bold">{getCategoryLabel(category)}</h2>
>>>>>>> master
                                </div>

                                {/* FAQ Items */}
                                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                    {faqs.map((faq) => (
<<<<<<< HEAD
                                        <div key={faq.id} className="border-b last:border-b-0">
                                            <button
                                                onClick={() => toggleItem(faq.id)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium pr-8" style={{ color: 'var(--color-text)' }}>
                                                    {faq.question}
                                                </span>
                                                {openItems.has(faq.id) ? (
                                                    <ChevronUp className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 shrink-0 text-gray-400" />
=======
                                        <div key={faq.id} className="border-b last:border-b-0 hover:bg-gray-50/40 transition-colors">
                                            <button
                                                onClick={() => toggleItem(faq.id)}
                                                className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
                                            >
                                                <span className="font-semibold md:text-lg pr-8 leading-relaxed" style={{ color: 'var(--color-text)' }}>
                                                    {faq.question}
                                                </span>
                                                {openItems.has(faq.id) ? (
                                                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 shrink-0 transition-transform" style={{ color: 'var(--color-primary)' }} />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-gray-400" />
>>>>>>> master
                                                )}
                                            </button>

                                            {openItems.has(faq.id) && (
<<<<<<< HEAD
                                                <div className="px-6 pb-4">
                                                    <div
                                                        className="prose prose-sm max-w-none text-gray-600 bg-gray-50 rounded-lg p-4"
=======
                                                <div className="px-6 md:px-8 pb-6 md:pb-8 bg-linear-to-b from-gray-50/60 to-transparent animate-slideDown">
                                                    <div
                                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
>>>>>>> master
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
<<<<<<< HEAD
                <div className="mt-12 bg-white rounded-2xl shadow-sm p-8 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                        Non hai trovato la risposta?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Il nostro team è pronto ad aiutarti! Contattaci e ti risponderemo il prima possibile.
                    </p>
                    <a
                        href="/contatti"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contattaci
                    </a>
                </div>
            </div>
=======
                <div className="mt-16 bg-linear-to-br from-purple-50 to-indigo-50 rounded-4xl shadow-[0_20px_55px_rgba(31,41,55,0.08)] border border-white/70 p-10 md:p-12 text-center backdrop-blur-xl animate-slideUp animation-delay-300" style={{ borderColor: 'var(--color-primary)', borderOpacity: 0.15 }}>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}>
                        <MessageCircle className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Non hai trovato la risposta?
                    </h3>
                    <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                        Siamo qui per aiutarti. Contattaci direttamente e il nostro team ti risponderà entro 24 ore con supporto personalizzato.
                    </p>
                    <a
                        href="/contatti"
                        className="inline-flex items-center gap-2 px-8 md:px-10 py-3.5 md:py-4 rounded-full text-white font-semibold transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contattaci ora
                    </a>
                </div>
>>>>>>> master
        </div>
    )
}
