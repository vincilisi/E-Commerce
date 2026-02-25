'use client'

import { useState, useEffect } from 'react'
import { FileText, Shield, RotateCcw, Save, Eye, Edit2 } from 'lucide-react'
import Link from 'next/link'

interface LegalPage {
    id: string
    slug: string
    title: string
    content: string
    active: boolean
}

const defaultPages = [
    {
        slug: 'privacy',
        title: 'Privacy Policy',
        icon: Shield,
        description: 'Informativa sulla privacy e trattamento dati personali',
        defaultContent: `<h2>Informativa sulla Privacy</h2>
<p>La presente informativa descrive le modalità di gestione del sito in riferimento al trattamento dei dati personali degli utenti che lo consultano.</p>

<h3>1. Titolare del trattamento</h3>
<p>Il Titolare del trattamento è [Nome Azienda], con sede in [Indirizzo].</p>

<h3>2. Dati raccolti</h3>
<p>Durante la navigazione vengono raccolti i seguenti dati:</p>
<ul>
    <li>Dati di navigazione (IP, browser, sistema operativo)</li>
    <li>Dati forniti volontariamente (nome, email, indirizzo per ordini)</li>
    <li>Dati di pagamento (gestiti tramite Stripe/PayPal)</li>
</ul>

<h3>3. Finalità del trattamento</h3>
<p>I dati sono trattati per:</p>
<ul>
    <li>Gestione degli ordini e spedizioni</li>
    <li>Comunicazioni relative agli acquisti</li>
    <li>Invio newsletter (previo consenso)</li>
    <li>Miglioramento del servizio</li>
</ul>

<h3>4. Diritti dell'interessato</h3>
<p>Hai diritto di accedere, rettificare, cancellare i tuoi dati o opporti al trattamento contattandoci a: [email]</p>`
    },
    {
        slug: 'terms',
        title: 'Termini e Condizioni',
        icon: FileText,
        description: 'Condizioni generali di vendita e utilizzo del sito',
        defaultContent: `<h2>Termini e Condizioni di Vendita</h2>

<h3>1. Premessa</h3>
<p>I presenti termini regolano la vendita di prodotti tramite il sito [Nome Sito].</p>

<h3>2. Ordini</h3>
<p>L'ordine si considera accettato al ricevimento della conferma via email. Ci riserviamo il diritto di non accettare ordini incompleti o sospetti.</p>

<h3>3. Prezzi</h3>
<p>I prezzi indicati sono in Euro e includono l'IVA. Le spese di spedizione sono indicate nel carrello prima del pagamento.</p>

<h3>4. Pagamenti</h3>
<p>Accettiamo pagamenti tramite:</p>
<ul>
    <li>Carta di credito/debito (Visa, Mastercard, American Express)</li>
    <li>PayPal</li>
</ul>

<h3>5. Spedizioni</h3>
<p>Gli ordini vengono elaborati entro 1-3 giorni lavorativi. I tempi di consegna dipendono dalla destinazione.</p>

<h3>6. Prodotti Artigianali</h3>
<p>I nostri prodotti sono realizzati a mano, pertanto piccole variazioni sono normali e rendono ogni pezzo unico.</p>

<h3>7. Contatti</h3>
<p>Per informazioni: [email] o tramite il modulo contatti sul sito.</p>`
    },
    {
        slug: 'resi',
        title: 'Politica Resi e Rimborsi',
        icon: RotateCcw,
        description: 'Modalità di reso, cambio merce e rimborsi',
        defaultContent: `<h2>Politica Resi e Rimborsi</h2>

<h3>1. Diritto di Recesso</h3>
<p>Hai diritto di recedere dall'acquisto entro 14 giorni dalla ricezione del prodotto, senza dover fornire motivazione.</p>

<h3>2. Come Effettuare un Reso</h3>
<ol>
    <li>Contattaci via email a [email] indicando il numero ordine</li>
    <li>Riceverai le istruzioni per il reso</li>
    <li>Imballa accuratamente il prodotto nella confezione originale</li>
    <li>Spedisci all'indirizzo indicato</li>
</ol>

<h3>3. Condizioni del Reso</h3>
<p>Il prodotto deve essere:</p>
<ul>
    <li>Non utilizzato e nelle condizioni originali</li>
    <li>Nella confezione originale</li>
    <li>Con tutti gli accessori inclusi</li>
</ul>

<h3>4. Prodotti Non Restituibili</h3>
<p>Non possono essere resi:</p>
<ul>
    <li>Prodotti personalizzati su richiesta</li>
    <li>Prodotti danneggiati dall'uso</li>
</ul>

<h3>5. Rimborsi</h3>
<p>Il rimborso viene effettuato entro 14 giorni dal ricevimento del reso, con lo stesso metodo di pagamento utilizzato per l'acquisto.</p>

<h3>6. Costi di Spedizione</h3>
<p>Le spese di spedizione per il reso sono a carico del cliente, salvo difetti del prodotto.</p>`
    }
]

export default function AdminLegalPage() {
    const [pages, setPages] = useState<LegalPage[]>([])
    const [loading, setLoading] = useState(true)
    const [editingPage, setEditingPage] = useState<typeof defaultPages[0] | null>(null)
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchPages()
    }, [])

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/legal')
            const data = await res.json()
            setPages(data || [])
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }

    const openEditor = (page: typeof defaultPages[0]) => {
        const existingPage = pages.find(p => p.slug === page.slug)
        setContent(existingPage?.content || page.defaultContent)
        setEditingPage(page)
    }

    const handleSave = async () => {
        if (!editingPage) return

        setSaving(true)
        try {
            await fetch('/api/legal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: editingPage.slug,
                    title: editingPage.title,
                    content
                })
            })

            fetchPages()
            setEditingPage(null)
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setSaving(false)
        }
    }

    const getPageStatus = (slug: string) => {
        return pages.find(p => p.slug === slug) ? 'Configurata' : 'Da configurare'
    }

    const getPageStatusColor = (slug: string) => {
        return pages.find(p => p.slug === slug)
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
    }

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <FileText className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Pagine Legali
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : editingPage ? (
                    // Editor
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-3">
                                <editingPage.icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                                    {editingPage.title}
                                </h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setEditingPage(null)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Salvataggio...' : 'Salva'}
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Modifica il contenuto HTML della pagina. Puoi usare tag come &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, ecc.
                            </p>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={20}
                                className="w-full border rounded-lg px-4 py-3 font-mono text-sm"
                                style={{ borderColor: 'var(--color-border)' }}
                            />
                        </div>
                    </div>
                ) : (
                    // Lista pagine
                    <div className="space-y-4">
                        {defaultPages.map((page) => (
                            <div
                                key={page.slug}
                                className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                                    >
                                        <page.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>
                                            {page.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {page.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            URL: /legal/{page.slug}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPageStatusColor(page.slug)}`}>
                                        {getPageStatus(page.slug)}
                                    </span>

                                    {pages.find(p => p.slug === page.slug) && (
                                        <Link
                                            href={`/legal/${page.slug}`}
                                            target="_blank"
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                            title="Visualizza"
                                        >
                                            <Eye className="w-5 h-5 text-gray-600" />
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => openEditor(page)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Modifica
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info */}
                {!editingPage && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="font-bold text-blue-800 mb-2">ℹ️ Informazione</h3>
                        <p className="text-sm text-blue-700">
                            Le pagine legali sono accessibili pubblicamente agli URL indicati.
                            Assicurati di personalizzare i contenuti con i tuoi dati aziendali prima di pubblicare il sito.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
