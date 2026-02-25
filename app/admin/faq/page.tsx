'use client'

import { useState, useEffect } from 'react'
import {
    HelpCircle, Plus, Edit2, Trash2, GripVertical,
    Save, X, ChevronUp, ChevronDown
} from 'lucide-react'

interface FAQ {
    id: string
    question: string
    answer: string
    category: string
    order: number
    active: boolean
}

const categories = [
    { value: 'generale', label: '📋 Generale' },
    { value: 'spedizioni', label: '🚚 Spedizioni' },
    { value: 'pagamenti', label: '💳 Pagamenti' },
    { value: 'resi', label: '🔄 Resi e Rimborsi' },
    { value: 'prodotti', label: '🛍️ Prodotti' },
    { value: 'account', label: '👤 Account' }
]

export default function AdminFAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)

    // Form state
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [category, setCategory] = useState('generale')
    const [active, setActive] = useState(true)

    useEffect(() => {
        fetchFAQs()
    }, [])

    const fetchFAQs = async () => {
        try {
            const res = await fetch('/api/faq?all=true')
            const data = await res.json()
            setFaqs(data.faqs || [])
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (faq?: FAQ) => {
        if (faq) {
            setEditingFaq(faq)
            setQuestion(faq.question)
            setAnswer(faq.answer)
            setCategory(faq.category)
            setActive(faq.active)
        } else {
            setEditingFaq(null)
            setQuestion('')
            setAnswer('')
            setCategory('generale')
            setActive(true)
        }
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const faqData = { question, answer, category, active }

        try {
            if (editingFaq) {
                await fetch(`/api/faq/${editingFaq.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(faqData)
                })
            } else {
                await fetch('/api/faq', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(faqData)
                })
            }

            setShowModal(false)
            fetchFAQs()
        } catch (error) {
            console.error('Errore:', error)
        }
    }

    const deleteFaq = async (id: string) => {
        if (!confirm('Eliminare questa FAQ?')) return

        try {
            await fetch(`/api/faq/${id}`, { method: 'DELETE' })
            fetchFAQs()
        } catch (error) {
            console.error('Errore:', error)
        }
    }

    const toggleActive = async (faq: FAQ) => {
        try {
            await fetch(`/api/faq/${faq.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !faq.active })
            })
            fetchFAQs()
        } catch (error) {
            console.error('Errore:', error)
        }
    }

    // Raggruppa per categoria
    const grouped = faqs.reduce((acc, faq) => {
        if (!acc[faq.category]) acc[faq.category] = []
        acc[faq.category].push(faq)
        return acc
    }, {} as Record<string, FAQ[]>)

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            Gestione FAQ
                        </h1>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        Nuova FAQ
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">Nessuna FAQ ancora</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {categories.map((cat) => {
                            const catFaqs = grouped[cat.value]
                            if (!catFaqs || catFaqs.length === 0) return null

                            return (
                                <div key={cat.value} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 bg-gray-50 border-b font-medium">
                                        {cat.label}
                                    </div>
                                    <div className="divide-y">
                                        {catFaqs.map((faq) => (
                                            <div
                                                key={faq.id}
                                                className={`px-6 py-4 ${!faq.active ? 'opacity-50' : ''}`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                                            {faq.question}
                                                        </p>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {faq.answer.replace(/<[^>]*>/g, '')}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleActive(faq)}
                                                            className={`px-2 py-1 rounded text-xs font-medium ${faq.active
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-600'
                                                                }`}
                                                        >
                                                            {faq.active ? 'Attiva' : 'Nascosta'}
                                                        </button>
                                                        <button
                                                            onClick={() => openModal(faq)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                        >
                                                            <Edit2 className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteFaq(faq.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                                {editingFaq ? 'Modifica FAQ' : 'Nuova FAQ'}
                            </h2>
                            <button onClick={() => setShowModal(false)}>
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Domanda *</label>
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    placeholder="Come posso...?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Risposta *</label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    required
                                    rows={5}
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    placeholder="Supporta HTML..."
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                    className="w-4 h-4 rounded"
                                />
                                <label htmlFor="active" className="text-sm">
                                    Attiva (visibile sul sito)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    <Save className="w-4 h-4" />
                                    Salva
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
