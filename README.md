# Il Desiderio di una Stella / The Wishy Wish

Bilingual project documentation for the current codebase.

---

# Italiano

## Panoramica

Il Desiderio di una Stella è un e-commerce moderno costruito con Next.js per la vendita di prodotti artigianali, con particolare attenzione a:

- esperienza utente premium
- gestione catalogo prodotti
- checkout con PayPal e pagamento alla consegna
- pannello admin completo
- email transazionali reali via SMTP
- recensioni prodotto
- contenuti dinamici, FAQ, blog e pagine legali
- supporto multilingua e multi-valuta lato frontend

Il progetto è stato evoluto come storefront completo con area pubblica, area amministrativa e numerose API interne.

## Stack Tecnologico

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Zustand per lo state management locale
- react-hot-toast per notifiche UI

### Backend / API

- Next.js App Router API routes
- Prisma ORM
- NextAuth / auth personalizzata per autenticazione admin e utenti
- Zod per validazione payload
- Nodemailer per email reali via SMTP
- pdf-lib per allegati PDF di conferma ordine

### Pagamenti

- PayPal checkout / capture
- Contrassegno (cash on delivery)
- Stripe non attivo per il checkout cliente al momento

## Funzionalità Principali

### Storefront pubblico

- homepage marketing / brand
- catalogo prodotti con card compatte
- pagina dettaglio prodotto
- recensioni prodotto
- carrello
- checkout
- pagina contatti
- FAQ
- blog
- pagine legali
- pagina preferiti
- tracking ordine

### Admin

- dashboard amministrativa
- gestione prodotti
- gestione ordini
- impostazioni sito
- gestione contatti dinamici
- email template e email log
- promo code / sconti
- FAQ e contenuti
- analytics base

### Email e notifiche

- conferma ordine via email
- allegato PDF di conferma ordine non fiscale
- notifiche spedizione
- email ordine consegnato
- welcome email newsletter
- modulo contatti con recapito SMTP reale

## Stato Attuale dei Pagamenti

Attualmente il checkout cliente supporta:

- `PayPal`
- `Pagamento alla consegna`

Stripe è presente tra le dipendenze e in alcune parti del codice storico, ma non è attivo come metodo di pagamento per i clienti nella configurazione corrente.

## Architettura del Progetto

Struttura principale:

```text
app/
  admin/              # Pannello amministrazione
  api/                # API routes server-side
  blog/               # Blog pubblico
  carrello/           # Pagina carrello
  checkout/           # Pagina checkout
  chi-siamo/          # About page
  contatti/           # Contact page
  faq/                # FAQ page
  legal/              # Pagine legali
  login/              # Login
  ordine/             # Flusso successo ordine
  preferiti/          # Wishlist
  prodotti/           # Catalogo + PDP
  registrati/         # Registrazione
  traccia-ordine/     # Order tracking
components/           # Componenti UI condivisi
lib/                  # Utility, email, store, traduzioni, prisma
prisma/               # Schema Prisma
public/               # Asset statici
docs/                 # Documentazione extra
scripts/              # Script di supporto
__tests__/            # Test
```

## Prerequisiti

Assicurati di avere installato:

- Node.js 20+
- npm
- database compatibile con la configurazione Prisma corrente

## Installazione

```bash
npm install
```

## Avvio in sviluppo

```bash
npm run dev
```

Apri:

```text
http://localhost:3000
```

## Build produzione

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Variabili Ambiente

Crea un file `.env` nella root del progetto.

Esempio minimo:

```env
DATABASE_URL="your_database_url"

JWT_SECRET="replace_with_a_secure_secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_URL="http://localhost:3000"

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your_email@example.com"
SMTP_PASS="your_smtp_password"
SMTP_FROM="Il Desiderio di una Stella <your_email@example.com>"
EMAIL_ADMIN_COPY_TO="owner@example.com"
EMAIL_FORCE_TO=""
CONTACT_EMAIL="owner@example.com"
ALLOW_DEV_ETHEREAL="false"

PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_ENVIRONMENT="sandbox"
```

### Note sulle variabili

- `DATABASE_URL`: connessione database usata da Prisma
- `JWT_SECRET`: segreto usato per token/auth custom
- `NEXT_PUBLIC_SITE_URL`: URL pubblico usato nelle email e nei link
- `NEXT_PUBLIC_URL`: fallback per alcune route checkout
- `SMTP_*`: configurazione server email reale
- `EMAIL_ADMIN_COPY_TO`: copia amministrativa opzionale per alcune email
- `EMAIL_FORCE_TO`: utile per forzare il destinatario in test
- `CONTACT_EMAIL`: fallback per modulo contatti
- `ALLOW_DEV_ETHEREAL`: consente mailbox di sviluppo solo se abilitata esplicitamente
- `PAYPAL_*`: configurazione PayPal sandbox/live

## Configurazione PayPal

Per attivare PayPal:

1. crea una app su PayPal Developer
2. inserisci `PAYPAL_CLIENT_ID` e `PAYPAL_CLIENT_SECRET`
3. usa `PAYPAL_ENVIRONMENT="sandbox"` per test
4. riavvia il server dopo ogni modifica al `.env`

Nel repository è presente anche:

- `PAYPAL_SETUP.md`

## Email Ordine e PDF Allegato

Alla conferma di un ordine PayPal il sistema può inviare:

- email di conferma ordine
- PDF allegato di conferma ordine / ricevuta non fiscale

Il PDF include:

- nome negozio
- logo se configurato
- prodotti acquistati
- quantità e prezzi
- metodo di pagamento
- totale pagato

Nota importante:

- il PDF attuale è un documento riepilogativo non fiscale
- non è pensato come fattura fiscale ufficiale

## Contatti Dinamici

L'email, il telefono e il numero WhatsApp del sito possono essere aggiornati dal pannello admin e vengono propagati nelle superfici pubbliche del sito.

## Multilingua e Valuta

Il progetto contiene:

- sistema di traduzioni frontend
- gestione lingua lato client
- supporto formattazione prezzi / valute
- documentazione dedicata in:
  - `TRANSLATION_SYSTEM.md`
  - `TRADUZIONE_AUTOMATICA.md`
  - `docs/CAMBIO_VALUTA_E_TRADUZIONI.md`

## Testing e Verifiche

La repository include configurazione per:

- Jest
- Testing Library
- Supertest

Cartella:

```text
__tests__/
```

Non tutti i flussi sono necessariamente coperti da test automatici completi, quindi è consigliata anche una verifica manuale di:

- checkout PayPal
- modulo contatti
- pannello admin
- email SMTP

## File di Configurazione Principali

- `next.config.ts`
- `proxy.ts`
- `prisma/schema.prisma`
- `eslint.config.mjs`
- `jest.config.js`
- `tsconfig.json`

## Script Disponibili

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

## Note Operative

- dopo modifiche a `.env`, riavvia sempre il server
- per i pagamenti PayPal, verifica sandbox/live in base all'ambiente
- per l'invio email reale, SMTP deve essere configurato correttamente
- alcuni documenti legacy su Stripe possono essere ancora presenti nella codebase, ma il checkout cliente corrente usa PayPal e contrassegno

## Roadmap Suggerita

- completare la copertura test automatica sui flussi critici
- uniformare ulteriormente le superfici admin secondarie
- rifinire documentazione API interna
- eventuale riattivazione Stripe in futuro quando necessario

---

# English

## Overview

The Wishy Wish is a modern e-commerce application built with Next.js for selling handmade products, with strong focus on:

- premium user experience
- product catalog management
- PayPal and cash-on-delivery checkout
- complete admin panel
- real transactional emails via SMTP
- product reviews
- dynamic content, FAQ, blog, and legal pages
- multilingual and multi-currency frontend support

The project has evolved into a full storefront with public pages, admin area, and multiple internal APIs.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Zustand for local state management
- react-hot-toast for UI notifications

### Backend / API

- Next.js App Router API routes
- Prisma ORM
- NextAuth / custom authentication logic for admin and users
- Zod for payload validation
- Nodemailer for real SMTP email delivery
- pdf-lib for PDF order confirmation attachments

### Payments

- PayPal checkout / capture
- Cash on delivery
- Stripe is not currently active for customer checkout

## Main Features

### Public Storefront

- marketing / brand homepage
- product catalog with compact cards
- product detail page
- product reviews
- cart
- checkout
- contacts page
- FAQ
- blog
- legal pages
- wishlist
- order tracking

### Admin Area

- admin dashboard
- product management
- order management
- site settings
- dynamic contact management
- email templates and email logs
- promo codes / discounts
- FAQ and content management
- basic analytics

### Email and Notifications

- order confirmation email
- non-fiscal PDF order confirmation attachment
- shipping notifications
- delivered order email
- newsletter welcome email
- contact form with real SMTP delivery

## Current Payment Status

Customer checkout currently supports:

- `PayPal`
- `Cash on delivery`

Stripe is still present in dependencies and some legacy code paths, but it is not currently enabled as a customer-facing payment method.

## Project Architecture

Main structure:

```text
app/
  admin/              # Administration panel
  api/                # Server-side API routes
  blog/               # Public blog
  carrello/           # Cart page
  checkout/           # Checkout page
  chi-siamo/          # About page
  contatti/           # Contact page
  faq/                # FAQ page
  legal/              # Legal pages
  login/              # Login
  ordine/             # Order success flow
  preferiti/          # Wishlist
  prodotti/           # Catalog + PDP
  registrati/         # Registration
  traccia-ordine/     # Order tracking
components/           # Shared UI components
lib/                  # Utilities, email, store, translations, prisma
prisma/               # Prisma schema
docs/                 # Extra documentation
public/               # Static assets
scripts/              # Support scripts
__tests__/            # Tests
```

## Prerequisites

Make sure you have installed:

- Node.js 20+
- npm
- a database compatible with the current Prisma configuration

## Installation

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the project root.

Minimal example:

```env
DATABASE_URL="your_database_url"

JWT_SECRET="replace_with_a_secure_secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_URL="http://localhost:3000"

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your_email@example.com"
SMTP_PASS="your_smtp_password"
SMTP_FROM="Il Desiderio di una Stella <your_email@example.com>"
EMAIL_ADMIN_COPY_TO="owner@example.com"
EMAIL_FORCE_TO=""
CONTACT_EMAIL="owner@example.com"
ALLOW_DEV_ETHEREAL="false"

PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_ENVIRONMENT="sandbox"
```

### Variable Notes

- `DATABASE_URL`: database connection used by Prisma
- `JWT_SECRET`: secret used for custom token/auth handling
- `NEXT_PUBLIC_SITE_URL`: public URL used in emails and generated links
- `NEXT_PUBLIC_URL`: fallback URL for some checkout routes
- `SMTP_*`: real email server configuration
- `EMAIL_ADMIN_COPY_TO`: optional admin copy for certain emails
- `EMAIL_FORCE_TO`: useful to override recipients during testing
- `CONTACT_EMAIL`: fallback recipient for contact form
- `ALLOW_DEV_ETHEREAL`: enables development mailbox only when explicitly set
- `PAYPAL_*`: PayPal sandbox/live configuration

## PayPal Setup

To enable PayPal:

1. create an app in PayPal Developer
2. set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
3. use `PAYPAL_ENVIRONMENT="sandbox"` for testing
4. restart the server after each `.env` update

The repository also includes:

- `PAYPAL_SETUP.md`

## Order Emails and PDF Attachment

When a PayPal order is confirmed, the system can send:

- order confirmation email
- attached PDF order confirmation / non-fiscal receipt

The PDF currently includes:

- store name
- logo if configured
- purchased products
- quantities and prices
- payment method
- total paid

Important note:

- the current PDF is a non-fiscal summary document
- it is not meant to be an official tax invoice

## Dynamic Contact Information

The site email, phone number, and WhatsApp number can be updated from the admin panel and are propagated across public site surfaces.

## Translations and Currency

The project contains:

- frontend translation system
- client-side language switching
- price / currency formatting support
- dedicated documentation in:
  - `TRANSLATION_SYSTEM.md`
  - `TRADUZIONE_AUTOMATICA.md`
  - `docs/CAMBIO_VALUTA_E_TRADUZIONI.md`

## Testing and Verification

The repository includes configuration for:

- Jest
- Testing Library
- Supertest

Folder:

```text
__tests__/
```

Not every flow is necessarily covered by full automated tests, so manual verification is also recommended for:

- PayPal checkout
- contact form
- admin panel
- SMTP email delivery

## Main Configuration Files

- `next.config.ts`
- `proxy.ts`
- `prisma/schema.prisma`
- `eslint.config.mjs`
- `jest.config.js`
- `tsconfig.json`

## Available Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

## Operational Notes

- always restart the server after editing `.env`
- for PayPal, double-check sandbox/live configuration per environment
- real email delivery requires a valid SMTP setup
- some legacy Stripe-related docs may still exist in the codebase, but the current customer checkout uses PayPal and cash on delivery

## Suggested Roadmap

- complete automated test coverage for critical flows
- further align secondary admin surfaces
- refine internal API documentation
- optionally re-enable Stripe in the future if needed
