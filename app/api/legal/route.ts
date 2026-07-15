export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function hydrateLegalContent(content: string, siteName: string, contactEmail: string) {
    return content
        .replace(/\[Nome Azienda\]/g, siteName)
        .replace(/\[Nome Sito\]/g, siteName)
        .replace(/\[Indirizzo\]/g, 'la sede del titolare')
        .replace(/\[email\]/g, contactEmail)
        .replace(/Stripe\/PayPal/g, 'PayPal')
        .replace(/tramite i fornitori attivi/g, 'tramite i fornitori di pagamento attivi')
}

const defaultLegalPages: Record<string, { id: string; slug: string; title: string; content: string; active: boolean }> = {
    privacy: {
        id: 'fallback-privacy',
        slug: 'privacy',
        title: 'Privacy Policy',
        active: true,
        content: `<h2>Informativa sulla Privacy</h2>
<p>La presente informativa descrive le modalità di gestione del sito in riferimento al trattamento dei dati personali degli utenti che lo consultano.</p>

<h3>1. Titolare del trattamento</h3>
<p>Il Titolare del trattamento è [Nome Azienda], con sede in [Indirizzo].</p>

<h3>2. Dati raccolti</h3>
<p>Durante la navigazione possono essere raccolti i seguenti dati:</p>
<ul>
    <li>Dati di navigazione (IP, browser, sistema operativo)</li>
    <li>Dati forniti volontariamente (nome, email, indirizzo per ordini)</li>
    <li>Dati di pagamento gestiti dai fornitori attivi</li>
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
    termini: {
        id: 'fallback-terms',
        slug: 'termini',
        title: 'Termini e Condizioni',
        active: true,
        content: `<h2>Termini e Condizioni di Vendita</h2>

<h3>1. Premessa</h3>
<p>I presenti termini regolano la vendita di prodotti tramite il sito [Nome Sito].</p>

<h3>2. Ordini</h3>
<p>L'ordine si considera accettato al ricevimento della conferma via email. Ci riserviamo il diritto di non accettare ordini incompleti o sospetti.</p>

<h3>3. Prezzi</h3>
<p>I prezzi indicati sono in Euro e possono includere imposte applicabili. Le spese di spedizione sono indicate nel carrello prima della conferma dell'ordine.</p>

<h3>4. Pagamenti</h3>
<p>Accettiamo pagamenti tramite:</p>
<ul>
    <li>PayPal</li>
    <li>Pagamento alla consegna</li>
</ul>

<h3>5. Spedizioni</h3>
<p>Gli ordini vengono elaborati entro 1-3 giorni lavorativi. I tempi di consegna dipendono dalla destinazione.</p>

<h3>6. Prodotti Artigianali</h3>
<p>I nostri prodotti sono realizzati a mano, pertanto piccole variazioni sono normali e rendono ogni pezzo unico.</p>

<h3>7. Contatti</h3>
<p>Per informazioni: [email] o tramite il modulo contatti sul sito.</p>`
    },
    resi: {
        id: 'fallback-resi',
        slug: 'resi',
        title: 'Politica Resi e Rimborsi',
        active: true,
        content: `<h2>Politica Resi e Rimborsi</h2>

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
}

// GET - Pagine legali
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        if (slug) {
            const page = await prisma.legalPage.findUnique({
                where: { slug }
            })
            const settings = await prisma.siteSettings.findFirst({
                select: { siteName: true, contactEmail: true }
            })
            const siteName = settings?.siteName || 'Il Desiderio di una Stella'
            const contactEmail = settings?.contactEmail || 'info@ildesideriodiunastella.it'

            if (page) {
                return NextResponse.json({
                    ...page,
                    content: hydrateLegalContent(page.content, siteName, contactEmail)
                })
            }

            const fallback = defaultLegalPages[slug]
            return NextResponse.json(
                fallback
                    ? {
                        ...fallback,
                        content: hydrateLegalContent(fallback.content, siteName, contactEmail)
                    }
                    : null
            )
        }

        const pages = await prisma.legalPage.findMany({
            where: { active: true }
        })

        return NextResponse.json(pages)
    } catch (error) {
        console.error('Errore pagine legali:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Crea/Aggiorna pagina (admin)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { slug, title, content } = body

        const page = await prisma.legalPage.upsert({
            where: { slug },
            update: { title, content },
            create: { slug, title, content }
        })

        return NextResponse.json(page)
    } catch (error) {
        console.error('Errore pagina legale:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
