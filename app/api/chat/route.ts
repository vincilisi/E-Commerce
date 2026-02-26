export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Interfaccia per il contesto del sito
interface SiteContext {
    products: Array<{
        name: string;
        description: string;
        price: number;
        category: string;
        inStock: boolean;
    }>;
    categories: string[];
    faq: Array<{
        question: string;
        answer: string;
        keywords: string[];
    }>;
}

// FAQ predefinite
const defaultFAQ = [
    {
        question: 'Quanto costa la spedizione?',
        answer: 'La spedizione costa €5 in tutta Italia. La spedizione è GRATUITA per ordini superiori a €50! Consegniamo in 3-5 giorni lavorativi.',
        keywords: ['spedizione', 'consegna', 'costo', 'spedire', 'corriere', 'tempi', 'giorni', 'gratis', 'gratuita']
    },
    {
        question: 'Come posso pagare?',
        answer: 'Accettiamo pagamenti con tutte le principali carte di credito e debito (Visa, Mastercard, American Express) tramite Stripe. I pagamenti sono sicuri e protetti con crittografia SSL.',
        keywords: ['pagamento', 'pagare', 'carta', 'credito', 'debito', 'stripe', 'metodo', 'visa', 'mastercard']
    },
    {
        question: 'Posso restituire un prodotto?',
        answer: 'Sì! Hai 30 giorni di tempo per restituire qualsiasi prodotto. Il reso è gratuito e riceverai un rimborso completo. Contattaci per avviare la procedura di reso.',
        keywords: ['reso', 'restituire', 'ritorno', 'rimborso', 'indietro', 'restituzione', 'giorni']
    },
    {
        question: 'I prodotti sono personalizzabili?',
        answer: 'Sì, offriamo personalizzazioni su molti prodotti! Puoi richiedere nomi, date, colori specifici e molto altro. Contattaci per ricevere un preventivo personalizzato.',
        keywords: ['personalizzare', 'personalizzazione', 'personalizzato', 'custom', 'nome', 'incisione', 'su misura']
    },
    {
        question: 'Dove vi trovate?',
        answer: 'Siamo un laboratorio artigianale italiano. Tutti i nostri prodotti sono fatti a mano con amore e spediti da Milano. Non abbiamo un negozio fisico, ma puoi acquistare comodamente online!',
        keywords: ['dove', 'trovate', 'siete', 'negozio', 'sede', 'posizione', 'milano', 'italia', 'artigianale']
    },
    {
        question: 'Come tracciare il mio ordine?',
        answer: 'Dopo la spedizione riceverai un\'email con il numero di tracking. Puoi anche andare alla pagina "Traccia Ordine" e inserire il numero del tuo ordine per vedere lo stato in tempo reale!',
        keywords: ['traccia', 'tracking', 'ordine', 'stato', 'dove', 'spedizione', 'arriva', 'seguire']
    },
    {
        question: 'Avete sconti o promozioni?',
        answer: 'Sì! Iscriviti alla nostra newsletter per ricevere un codice sconto del 10% sul primo ordine e restare aggiornato su tutte le promozioni esclusive!',
        keywords: ['sconto', 'promozione', 'offerta', 'coupon', 'codice', 'risparmio', 'saldi']
    },
    {
        question: 'Quanto tempo ci vuole per preparare un ordine?',
        answer: 'I nostri prodotti sono fatti a mano con cura. La preparazione richiede 1-3 giorni lavorativi, poi il pacco viene affidato al corriere. Per prodotti personalizzati potrebbero volerci alcuni giorni in più.',
        keywords: ['tempo', 'preparazione', 'quanto', 'lavorazione', 'pronto', 'artigianale', 'fatto a mano']
    },
    {
        question: 'I materiali sono di qualità?',
        answer: 'Assolutamente! Utilizziamo solo materiali di alta qualità: resina epossidica certificata, fiori veri essiccati, glitter atossici e metalli anallergici. Ogni pezzo è unico e fatto con passione!',
        keywords: ['materiale', 'qualità', 'resina', 'fiori', 'cosa', 'fatto', 'sicuro', 'allergia']
    },
    {
        question: 'Come posso contattarvi?',
        answer: 'Puoi contattarci via email, tramite il modulo di contatto sul sito, o seguirci sui social media (Instagram, Facebook). Rispondiamo solitamente entro 24 ore!',
        keywords: ['contatto', 'contattare', 'email', 'telefono', 'social', 'instagram', 'facebook', 'scrivere']
    }
];

// Risposte generiche per quando non si trova una corrispondenza
const genericResponses = [
    'Grazie per la tua domanda! Per assistenza specifica, ti consiglio di contattarci via email o utilizzare il modulo di contatto. Saremo felici di aiutarti! 😊',
    'Non sono sicuro di aver capito bene la tua domanda. Puoi riformularla oppure contattare il nostro servizio clienti per assistenza diretta.',
    'Questa è una domanda interessante! Per darti una risposta precisa, ti consiglio di contattarci direttamente. Rispondiamo sempre entro 24 ore!'
];

// Funzione per calcolare la similarità tra due stringhe
function calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    // Controlla parole in comune
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(w => words2.some(w2 => w2.includes(w) || w.includes(w2)));

    return commonWords.length / Math.max(words1.length, 1);
}

// Funzione per trovare la migliore risposta
function findBestAnswer(message: string, context: SiteContext): string {
    const normalizedMessage = message.toLowerCase().trim();

    // 1. Cerca nei FAQ usando le keywords
    let bestMatch = { faq: defaultFAQ[0], score: 0 };

    for (const faq of defaultFAQ) {
        let score = 0;

        // Controlla keywords
        for (const keyword of faq.keywords) {
            if (normalizedMessage.includes(keyword)) {
                score += 2;
            }
        }

        // Controlla similarità con la domanda
        score += calculateSimilarity(normalizedMessage, faq.question) * 3;

        if (score > bestMatch.score) {
            bestMatch = { faq, score };
        }
    }

    // Se troviamo una buona corrispondenza nei FAQ
    if (bestMatch.score >= 2) {
        return bestMatch.faq.answer;
    }

    // 2. Cerca informazioni sui prodotti
    const productKeywords = ['prodotto', 'prodotti', 'comprare', 'acquistare', 'vendete', 'avete', 'catalogo', 'cosa', 'quale'];
    if (productKeywords.some(kw => normalizedMessage.includes(kw))) {
        if (context.products.length > 0) {
            const categories = [...new Set(context.products.map(p => p.category))];
            return `Abbiamo una bellissima selezione di prodotti artigianali! 🌟\n\nLe nostre categorie: ${categories.join(', ')}.\n\nAbbiamo ${context.products.length} prodotti disponibili. Dai un'occhiata al catalogo per scoprire tutte le nostre creazioni uniche fatte a mano!`;
        }
    }

    // 3. Cerca informazioni sui prezzi
    const priceKeywords = ['prezzo', 'prezzi', 'costa', 'costano', 'quanto', 'euro', '€'];
    if (priceKeywords.some(kw => normalizedMessage.includes(kw))) {
        if (context.products.length > 0) {
            const prices = context.products.map(p => p.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            return `I nostri prezzi variano da €${minPrice.toFixed(2)} a €${maxPrice.toFixed(2)} 💰\n\nOgni prodotto è fatto a mano con materiali di alta qualità. Ricorda: la spedizione è GRATUITA per ordini sopra i €50!`;
        }
    }

    // 4. Saluti e convenevoli
    const greetings = ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hello', 'hi'];
    if (greetings.some(g => normalizedMessage.includes(g))) {
        return 'Ciao! 👋 Benvenuto! Sono qui per aiutarti. Puoi chiedermi informazioni su:\n\n• 📦 Spedizioni e consegne\n• 💳 Metodi di pagamento\n• 🔄 Resi e rimborsi\n• ✨ Personalizzazioni\n• 🛍️ I nostri prodotti\n\nCome posso aiutarti oggi?';
    }

    // 5. Ringraziamenti
    const thanks = ['grazie', 'thank', 'gentile', 'perfetto', 'ottimo'];
    if (thanks.some(t => normalizedMessage.includes(t))) {
        return 'Prego, è stato un piacere aiutarti! 😊 Se hai altre domande, sono sempre qui. Buona giornata! ✨';
    }

    // 6. Risposta generica
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Messaggio richiesto' }, { status: 400 });
        }

        // Carica il contesto del sito (prodotti)
        let products: SiteContext['products'] = [];
        try {
            const dbProducts = await prisma.product.findMany({
                select: {
                    name: true,
                    description: true,
                    price: true,
                    category: true,
                    inStock: true
                },
                where: {
                    inStock: true
                },
                take: 50 // Limita per performance
            });
            products = dbProducts;
        } catch (e) {
            console.error('Error loading products for assistant:', e);
        }

        const context: SiteContext = {
            products,
            categories: [...new Set(products.map(p => p.category))],
            faq: defaultFAQ
        };

        // Trova la risposta migliore
        const answer = findBestAnswer(message, context);

        return NextResponse.json({
            response: answer,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in chat assistant:', error);
        return NextResponse.json(
            { error: 'Errore nel processamento della richiesta' },
            { status: 500 }
        );
    }
}
