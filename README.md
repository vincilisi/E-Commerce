# Il Desiderio di una Stella - E-commerce Portachiavi

Shop online per portachiavi fatti a mano, realizzato con Next.js 16, TypeScript e Stripe.

## 🚀 Caratteristiche

- ✅ **Shop completo** con catalogo prodotti
- ✅ **Carrello funzionale** con gestione quantità
- ✅ **Sistema di autenticazione** con JWT
- ✅ **Dashboard amministratore** per gestione prodotti e ordini
- ✅ **Pagamenti con Stripe** (carte di credito)
- ✅ **Personalizzazione colori** del sito
- ✅ **Tracciabilità ordini**
- 📧 Notifiche email (da implementare)

## 🛠️ Tecnologie

- **Next.js 16** (App Router + Turbopack)
- **TypeScript**
- **Tailwind CSS**
- **Prisma 5** + SQLite
- **Zustand** (state management)
- **Stripe** (pagamenti)
- **JWT** (autenticazione)

## 📦 Installazione

1. Clona il repository e installa le dipendenze:

```bash
npm install
```

2. Configura il database:

```bash
npx prisma generate
npx prisma db push
```

3. Configura le variabili d'ambiente nel file `.env.local`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="il-tuo-secret-key-super-sicuro"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. Avvia il server di sviluppo:

```bash
npm run dev
```

5. Visita http://localhost:3000

## 🔑 Configurazione Stripe

### 1. Crea un account Stripe

Vai su https://dashboard.stripe.com/register e crea un account gratuito.

### 2. Ottieni le chiavi API

1. Accedi alla [Dashboard di Stripe](https://dashboard.stripe.com)
2. Vai su **Developers > API keys**
3. Copia la **Publishable key** (inizia con `pk_test_`)
4. Copia la **Secret key** (inizia con `sk_test_`)
5. Inseriscile nel file `.env.local`

### 3. Configura i Webhook (per ordini in produzione)

1. Vai su **Developers > Webhooks**
2. Clicca su **Add endpoint**
3. Inserisci l'URL: `https://tuo-dominio.com/api/webhook/stripe`
4. Seleziona eventi: `checkout.session.completed` e `payment_intent.payment_failed`
5. Copia il **Signing secret** (inizia con `whsec_`)
6. Inseriscilo in `.env.local` come `STRIPE_WEBHOOK_SECRET`

### 4. Test in locale (opzionale)

Per testare i webhook in locale, usa Stripe CLI:

```bash
# Installa Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Avvia il forward dei webhook
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## 👤 Inizializzazione Database

Visita http://localhost:3000/api/init-db per creare:

- **Admin user**: 
  - Email: `admin@stella.it`
  - Password: `admin123`
  - Ruolo: admin

- **4 prodotti di esempio**

⚠️ **IMPORTANTE**: Cambia la password dell'admin prima di andare in produzione!

## 📂 Struttura Progetto

```
├── app/
│   ├── admin/              # Dashboard amministratore
│   │   ├── prodotti/       # Gestione prodotti
│   │   ├── ordini/         # Gestione ordini
│   │   └── impostazioni/   # Colori e configurazioni
│   ├── api/                # API routes
│   │   ├── auth/           # Autenticazione
│   │   ├── admin/          # API admin
│   │   ├── checkout/       # Stripe checkout
│   │   └── webhook/        # Stripe webhooks
│   ├── carrello/           # Pagina carrello
│   ├── checkout/           # Pagina checkout
│   ├── prodotti/           # Catalogo prodotti
│   └── ordine/successo/    # Pagina conferma ordine
├── components/             # Componenti React
├── lib/
│   ├── store/             # Zustand stores
│   └── prisma.ts          # Prisma client
├── prisma/
│   └── schema.prisma      # Schema database
└── types/                 # TypeScript types
```

## 🎨 Funzionalità Admin

L'admin può accedere a http://localhost:3000/admin e:

1. **Gestire Prodotti**
   - Creare nuovi prodotti
   - Modificare prodotti esistenti
   - Eliminare prodotti
   - Impostare disponibilità

2. **Gestire Ordini**
   - Visualizzare tutti gli ordini
   - Cambiare stato ordine (Pagato → In Elaborazione → Spedito → Consegnato)
   - Vedere dettagli cliente e spedizione

3. **Personalizzare il Sito**
   - Cambiare colori del tema
   - Modificare il nome del sito

## 💳 Test Pagamenti

Usa queste carte di test Stripe:

- **Successo**: `4242 4242 4242 4242`
- **Fallimento**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Usa qualsiasi:
- Data futura (es. 12/25)
- CVC (es. 123)
- CAP (es. 12345)

## 🚀 Deploy in Produzione

### 1. Prepara il database

Per produzione, usa un database PostgreSQL invece di SQLite:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### 2. Aggiorna Prisma

```bash
npx prisma generate
npx prisma db push
```

### 3. Configura le variabili d'ambiente

Assicurati che tutte le variabili siano configurate nel tuo hosting (Vercel, Netlify, etc.)

### 4. Stripe in produzione

1. Attiva il tuo account Stripe
2. Sostituisci le chiavi `test` con quelle `live` (iniziano con `pk_live_` e `sk_live_`)
3. Configura i webhook per il dominio di produzione

## 📝 TODO

- [ ] Upload immagini prodotti (Cloudinary/AWS S3)
- [ ] Email di conferma ordine
- [ ] Email tracking spedizione
- [ ] Sistema di recensioni
- [ ] Codici sconto
- [ ] Multi-lingua

## 🐛 Troubleshooting

### Il pagamento non funziona

- Verifica che le chiavi Stripe siano corrette in `.env.local`
- Controlla che `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` abbia il prefisso `NEXT_PUBLIC_`
- Riavvia il server dopo aver modificato `.env.local`

### Gli ordini non si aggiornano dopo il pagamento

- Configura correttamente i webhook Stripe
- In locale, usa `stripe listen --forward-to localhost:3000/api/webhook/stripe`

### Errore database

```bash
# Resetta il database
rm prisma/dev.db
npx prisma db push
# Reinizializza
curl http://localhost:3000/api/init-db
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
