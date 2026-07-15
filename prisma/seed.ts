import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Crea utente admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@stella.it' },
        update: {},
        create: {
            email: 'admin@stella.it',
            name: 'Amministratore',
            password: hashedPassword,
            role: 'admin'
        }
    });

    console.log('Admin user created:', admin.email);

    // Crea settings iniziali
    const settings = await prisma.siteSettings.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            primaryColor: '#9333ea',
            secondaryColor: '#6366f1',
            accentColor: '#fde047',
            siteName: 'Il Desiderio di una Stella'
        }
    });

    console.log('Site settings created');

    const legalPages = [
        {
            slug: 'privacy',
            title: 'Privacy Policy',
            content: `<h2>Informativa sulla Privacy</h2>
<p>La presente informativa descrive le modalità di gestione del sito in riferimento al trattamento dei dati personali degli utenti che lo consultano.</p>

<h3>1. Titolare del trattamento</h3>
<p>Il Titolare del trattamento è Il Desiderio di una Stella, con sede nella sede del titolare.</p>

<h3>2. Dati raccolti</h3>
<p>Durante la navigazione possono essere raccolti i seguenti dati:</p>
<ul>
    <li>Dati di navigazione (IP, browser, sistema operativo)</li>
    <li>Dati forniti volontariamente (nome, email, indirizzo per ordini)</li>
    <li>Dati di pagamento gestiti dai fornitori di pagamento attivi</li>
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
<p>Hai diritto di accedere, rettificare, cancellare i tuoi dati o opporti al trattamento contattandoci a: info@ildesideriodiunastella.it</p>`
        },
        {
            slug: 'termini',
            title: 'Termini e Condizioni',
            content: `<h2>Termini e Condizioni di Vendita</h2>

<h3>1. Premessa</h3>
<p>I presenti termini regolano la vendita di prodotti tramite il sito Il Desiderio di una Stella.</p>

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
<p>Per informazioni: info@ildesideriodiunastella.it o tramite il modulo contatti sul sito.</p>`
        },
        {
            slug: 'resi',
            title: 'Politica Resi e Rimborsi',
            content: `<h2>Politica Resi e Rimborsi</h2>

<h3>1. Diritto di Recesso</h3>
<p>Hai diritto di recedere dall'acquisto entro 14 giorni dalla ricezione del prodotto, senza dover fornire motivazione.</p>

<h3>2. Come Effettuare un Reso</h3>
<ol>
    <li>Contattaci via email a info@ildesideriodiunastella.it indicando il numero ordine</li>
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
    ];

    for (const legalPage of legalPages) {
        await prisma.legalPage.upsert({
            where: { slug: legalPage.slug },
            update: {
                title: legalPage.title,
                content: legalPage.content,
                active: true
            },
            create: {
                slug: legalPage.slug,
                title: legalPage.title,
                content: legalPage.content,
                active: true
            }
        });
    }

    // Migra prodotti esistenti nel database
    const productsData = [
        {
            id: '1',
            name: 'Portachiavi Stella Dorata',
            description: 'Elegante portachiavi fatto a mano con stella dorata e perline cristallo',
            price: 12.99,
            images: JSON.stringify(['/products/stella-dorata.jpg']),
            category: 'Classici',
            inStock: true,
            materials: JSON.stringify(['Metallo dorato', 'Perline cristallo', 'Catena']),
            dimensions: '8cm x 3cm'
        },
        {
            id: '2',
            name: 'Portachiavi Luna Argentata',
            description: 'Portachiavi artigianale con ciondolo luna e charm stelline',
            price: 10.99,
            images: JSON.stringify(['/products/luna-argentata.jpg']),
            category: 'Classici',
            inStock: true,
            materials: JSON.stringify(['Metallo argentato', 'Charm decorativi']),
            dimensions: '7cm x 3cm'
        },
        {
            id: '3',
            name: 'Portachiavi Costellazione',
            description: 'Design unico con perline che formano una costellazione personalizzabile',
            price: 15.99,
            images: JSON.stringify(['/products/costellazione.jpg']),
            category: 'Personalizzati',
            inStock: true,
            materials: JSON.stringify(['Perline vetro', 'Filo metallico', 'Moschettone']),
            dimensions: '10cm x 4cm'
        },
        {
            id: '4',
            name: 'Portachiavi Stelle Colorate',
            description: 'Set di mini stelle colorate con dettagli brillanti',
            price: 9.99,
            images: JSON.stringify(['/products/stelle-colorate.jpg']),
            category: 'Colorati',
            inStock: true,
            materials: JSON.stringify(['Resina colorata', 'Glitter', 'Anello portachiavi']),
            dimensions: '6cm x 2.5cm'
        }
    ];

    for (const product of productsData) {
        const { images, materials, ...productFields } = product;
        await prisma.product.upsert({
            where: { id: product.id },
            update: {},
            create: {
                ...productFields,
                images: {
                    create: images.map((url) => ({ url }))
                },
                materials: {
                    create: materials.map((name) => ({ name }))
                }
            }
        });
    }

    console.log('Products seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
