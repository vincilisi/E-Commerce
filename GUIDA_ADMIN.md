# 📚 Guida Amministratore - Il Desiderio di una Stella

## 🎯 Panoramica

Questa guida spiega come utilizzare il pannello amministrativo per gestire il tuo e-commerce di portachiavi artigianali.

## 🔐 Accesso Admin

- **URL**: `/login`
- **Email**: `admin@stella.it`
- **Password**: `admin123`

## 📦 Gestione Prodotti

### Creare un Nuovo Prodotto

1. Vai su `/admin/prodotti`
2. Clicca su "Nuovo Prodotto"
3. Compila i campi:
   - **Nome** (obbligatorio): es. "Portachiavi Stella Dorata"
   - **Descrizione** (obbligatorio): descrizione dettagliata
   - **Prezzo** (obbligatorio): in Euro, es. 12.99
   - **Categoria**: Scegli tra Classici, Personalizzati, Colorati, Eleganti, Novità
   - **Dimensioni**: es. "8cm x 3cm"
   - **Materiali**: Aggiungi più materiali cliccando "+ Aggiungi materiale"
   - **Immagini**: Puoi caricare da file locale O inserire URL da internet
   - **Disponibile**: Spunta se il prodotto è in stock

### Gestire le Immagini

Per ogni prodotto puoi aggiungere più immagini. Hai 2 opzioni:

**Opzione 1 - File Locale:**
- Clicca su "Scegli file" e seleziona un'immagine dal tuo computer
- L'immagine viene convertita in base64 e salvata nel database
- Formati supportati: JPG, PNG, SVG
- Dimensione massima: 5MB

**Opzione 2 - URL Internet:**
- Carica l'immagine su servizi come [Imgur](https://imgur.com) o [ImgBB](https://imgbb.com)
- Copia l'URL diretto dell'immagine
- Incollalo nel campo "URL Immagine"

### Modificare un Prodotto

1. Vai su `/admin/prodotti`
2. Clicca sull'icona matita accanto al prodotto
3. Modifica i campi desiderati
4. Clicca "Salva Modifiche"

### Eliminare un Prodotto

1. Vai su `/admin/prodotti`
2. Clicca sull'icona cestino
3. Conferma l'eliminazione

## 🎨 Personalizzazione Sito

### Accesso alle Impostazioni

Vai su `/admin/impostazioni` per personalizzare completamente il tuo sito.

### Tab: Generale

**Nome del Sito:**
- Cambia "Il Desiderio di una Stella" con il nome che preferisci
- Il nome apparirà nella navbar, homepage e nel titolo della pagina

### Tab: Colori

Personalizza 8 colori del tema:

1. **Colore Primario**: Pulsanti, link, navbar
2. **Colore Secondario**: Gradienti e sfumature
3. **Colore Accento**: Elementi evidenziati (stelle, badge)
4. **Sfondo Pagina**: Colore di sfondo principale
5. **Colore Testo**: Testo principale
6. **Sfondo Card**: Card e box bianchi
7. **Colore Bordi**: Bordi e divisori
8. **Testo Pulsanti**: Colore del testo sui pulsanti

Per ogni colore puoi:
- Usare il color picker
- Inserire il codice HEX manualmente

### Tab: Tipografia

**Font Preimpostati:**
Scegli tra 10 font Google Fonts professionali:
- Inter (Moderno)
- Roboto (Classico)
- Poppins (Arrotondato)
- Playfair Display (Elegante)
- Montserrat (Geometrico)
- Lato (Leggero)
- Open Sans (Universale)
- Raleway (Raffinato)
- Merriweather (Serif)
- Nunito (Amichevole)

**Font Personalizzati:**
1. Vai su [Google Fonts](https://fonts.google.com)
2. Seleziona un font
3. Clicca su "View selected families"
4. Copia l'URL del link CSS (es: `https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap`)
5. Torna su `/admin/impostazioni` → Tab "Tipografia"
6. Seleziona "Font Personalizzato (da URL)"
7. Incolla l'URL
8. Salva

### Tab: Logo

Sostituisci l'icona stella con il tuo logo personalizzato.

**Opzione 1 - Upload File:**
- Trascina un file nell'area di upload
- Formati: PNG, JPG, SVG
- Dimensione max: 5MB
- Consigliato: PNG con sfondo trasparente, 200x200px

**Opzione 2 - URL Internet:**
- Carica il logo su [Imgur](https://imgur.com) o [ImgBB](https://imgbb.com)
- Copia l'URL diretto
- Incollalo nel campo "URL Logo da Internet"

Il logo apparirà:
- Nella navbar
- Nella homepage (sezione hero)

## 📊 Gestione Ordini

### Visualizzare gli Ordini

Vai su `/admin/ordini` per vedere tutti gli ordini ricevuti.

**Informazioni visibili:**
- Numero ordine
- Cliente
- Totale
- Stato (Pending, Paid, Processing, Shipped, Delivered, Cancelled)
- Data

### Stati degli Ordini

1. **Pending**: In attesa di pagamento
2. **Paid**: Pagato
3. **Processing**: In elaborazione
4. **Shipped**: Spedito
5. **Delivered**: Consegnato
6. **Cancelled**: Annullato

### Modificare uno Stato

1. Clicca sull'ordine
2. Usa il menu a tendina per cambiare stato
3. Aggiungi tracking number se spedito
4. Salva modifiche

## 💳 Sistema Pagamenti

<<<<<<< HEAD
=======
Questa sezione spiega in modo pratico come usare i pagamenti reali con **PayPal** e **Stripe**, dalla configurazione al test fino alla produzione.

### Panoramica Metodi Disponibili

Nel checkout ora puoi scegliere:
- **PayPal**: pagamento con account PayPal o carta tramite flusso PayPal
- **Carta (Stripe)**: pagamento carta su checkout Stripe

Se un provider non è configurato correttamente, il sistema mostra un errore esplicito lato checkout/API.

### Variabili Ambiente Necessarie

Nel file `.env` (o `.env.local` in deploy) configura:

```env
# PayPal
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."
PAYPAL_ENVIRONMENT="sandbox"   # sandbox | live

# Stripe
STRIPE_SECRET_KEY="sk_test_... oppure sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_... oppure pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # raccomandato

# URL pubblico applicazione (raccomandato)
NEXT_PUBLIC_URL="https://tuodominio.it"
```

Dopo ogni modifica alle variabili ambiente: **riavvia il server**.

### Flusso Admin: Come Verificare Che Funzioni

1. Vai su `/checkout`
2. Compila i dati spedizione
3. Scegli metodo pagamento (PayPal o Stripe)
4. Completa il pagamento
5. Verifica in `/admin/ordini` che l'ordine sia stato creato e portato a stato corretto

Controlli consigliati:
- Numero ordine presente
- Importo corretto (inclusa spedizione)
- Stato ordine aggiornato
- Tracciabilità disponibile in area ordini

### Setup Dettagliato PayPal

#### 1) Creazione credenziali
1. Vai su [PayPal Developer](https://developer.paypal.com)
2. Crea una REST app
3. Copia **Client ID** e **Secret**
4. Inizia con ambiente `sandbox`

#### 2) Configurazione nel progetto
- Inserisci `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT`
- Riavvia il server

#### 3) Test end-to-end
1. In checkout seleziona **PayPal**
2. Verrai reindirizzato su PayPal
3. Approva pagamento
4. Ritorno automatico su pagina successo ordine

#### 4) Cosa fa il sistema internamente
- Crea ordine locale in stato `pending`
- Crea ordine remoto PayPal
- Alla conferma (capture) imposta ordine locale `paid`
- Scala stock prodotti acquistati

#### 5) Passaggio a produzione
- Cambia `PAYPAL_ENVIRONMENT=live`
- Sostituisci credenziali sandbox con credenziali live
- Esegui test con importi reali controllati

### Setup Dettagliato Stripe

#### 1) Creazione credenziali
1. Vai su [Stripe Dashboard](https://dashboard.stripe.com)
2. Copia chiavi API test (`pk_test`, `sk_test`)
3. Configura webhook (`checkout.session.completed`)

#### 2) Configurazione nel progetto
- Inserisci `STRIPE_SECRET_KEY`
- Inserisci `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Inserisci `STRIPE_WEBHOOK_SECRET`
- Riavvia server

#### 3) Test end-to-end
1. In checkout seleziona **Carta (Stripe)**
2. Completa pagamento su pagina Stripe
3. Verifica ritorno su successo ordine
4. Verifica stato ordine in `/admin/ordini`

#### 4) Passaggio a produzione
- Usa chiavi live (`pk_live`, `sk_live`)
- Webhook live sul dominio produzione
- Testa almeno un pagamento reale a basso importo

### Diagnostica Rapida Errori

**PayPal non configurato**
- Controlla `PAYPAL_CLIENT_ID` e `PAYPAL_CLIENT_SECRET`
- Verifica ambiente `sandbox/live`
- Riavvia server

**Stripe non parte in reale**
- Verifica chiavi valide con prefissi corretti
- Controlla che `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sia esposta lato client
- Verifica webhook secret

**Ordine creato ma non aggiornato come pagato**
- Stripe: controlla webhook e firma
- PayPal: controlla callback successo/capture
- Leggi i log server per il dettaglio errore

Per approfondimento:
- [STRIPE_SETUP.md](STRIPE_SETUP.md)
- [PAYPAL_SETUP.md](PAYPAL_SETUP.md)

>>>>>>> master
## 🌍 Traduzione Simultanea e Cambio Valuta

### Traduzione Simultanea

- Tutti i testi del sito sono tradotti automaticamente in 8 lingue: Italiano, Inglese, Francese, Spagnolo, Tedesco, Portoghese, Russo, Cinese, Americano (US).
- Quando aggiungi o modifichi un prodotto, nome e descrizione vengono tradotti automaticamente in tutte le lingue supportate.
- Puoi visualizzare e modificare ogni traduzione prima di salvare il prodotto.
- Le traduzioni possono essere aggiornate manualmente in qualsiasi momento dalla pagina di modifica prodotto.
- Il sistema usa un dizionario interno, ma può essere esteso o integrato con servizi esterni.

**Come modificare una traduzione prodotto:**
1. Vai su `/admin/prodotti` e seleziona il prodotto.
2. Sotto ogni campo di testo, troverai le versioni tradotte per ogni lingua.
3. Modifica liberamente le traduzioni e salva.

### Cambio Valuta Automatico

- I prezzi sono convertiti automaticamente nella valuta locale in base alla lingua selezionata dall’utente.
- Valute supportate: EUR (€), GBP (£), USD ($), RUB (₽), CNY (¥).
- I tassi di cambio sono aggiornati in tempo reale tramite API (ExchangeRate-API). Se l’API non è disponibile, viene usato un tasso di backup.
- Un tooltip accanto ai prezzi mostra il tasso applicato e la data di aggiornamento.
- Il cambio valuta avviene automaticamente al cambio lingua, senza bisogno di ricaricare la pagina.

**Come funziona per l’admin:**
- Quando inserisci il prezzo di un prodotto, inseriscilo in Euro. Il sistema convertirà automaticamente nelle altre valute.
- Puoi aggiornare i tassi di cambio manualmente dalla sezione impostazioni oppure lasciare che il sistema li aggiorni ogni ora.
- In ogni pagina admin, i prezzi sono sempre mostrati in Euro per coerenza gestionale.

Per maggiori dettagli tecnici, consulta anche il file `docs/CAMBIO_VALUTA_E_TRADUZIONI.md`.

<<<<<<< HEAD
### Modalità Test (Default)

Il sito è configurato per simulare pagamenti senza usare carte reali.

**Come funziona:**
- Gli utenti compilano il checkout normalmente
- Cliccando "Procedi al Pagamento" l'ordine viene creato automaticamente come "Pagato"
- Non serve Stripe configurato
- Perfetto per test e demo

**Indicatore:**
Nella pagina checkout appare un banner giallo:
> "Modalità Test Attiva: I pagamenti vengono simulati automaticamente"

### Attivare Stripe Reale

Quando sei pronto per pagamenti reali:

1. Crea account su [Stripe](https://stripe.com)
2. Ottieni le chiavi API
3. Nel file `.env.local` aggiungi:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
4. Riavvia il server

Il sistema passerà automaticamente a Stripe reale.
=======
>>>>>>> master

## 🔍 Dashboard Admin

### Statistiche Visibili

- Totale ordini
- Totale prodotti
- Ordini recenti

### Navigazione Rapida

Dal dashboard puoi accedere rapidamente a:
- Gestione Prodotti
- Gestione Ordini  
- Impostazioni Tema
- Anteprima Sito

## 📝 Anteprima Modifiche

Visita `/admin/anteprima` per vedere il sito con le tue modifiche prima di pubblicarle.

## ⚠️ Note Importanti

1. **Ricarica la pagina** dopo aver salvato le impostazioni per vedere i cambiamenti
2. **Backup regolari**: Il database è in `prisma/dev.db`
3. **Immagini base64**: Le immagini caricate da file locale vengono salvate come base64. Per siti con molte immagini, considera servizi di hosting immagini
4. **Modalità Test**: Ricorda di configurare Stripe prima di andare in produzione

## 🆘 Risoluzione Problemi

**Le modifiche non si vedono:**
- Ricarica la pagina (CTRL+F5)
- Svuota cache del browser

**Immagini non si caricano:**
- Verifica dimensione < 5MB
- Usa formati supportati (JPG, PNG, SVG)
- Controlla URL se usi link esterni

**Ordini non arrivano:**
- Verifica configurazione email (se attivata)
- Controlla il database in `/admin/ordini`

## 📧 Contatti

Per supporto tecnico o domande, contatta lo sviluppatore del sito.

---

**Versione**: 1.0  
**Ultimo aggiornamento**: Gennaio 2026
