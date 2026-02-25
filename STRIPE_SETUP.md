# 🔑 Guida Configurazione Stripe

Questa guida ti aiuterà a configurare Stripe per accettare pagamenti con carta di credito nel tuo shop.

## Passo 1: Creare un Account Stripe

1. Vai su [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Inserisci la tua email e crea una password
3. Conferma l'email ricevuta
4. Compila i dati della tua attività

🎉 Hai creato il tuo account Stripe!

## Passo 2: Ottenere le Chiavi API

### Modalità Test (per sviluppo)

1. Accedi alla [Dashboard di Stripe](https://dashboard.stripe.com)
2. In alto a destra, assicurati che sia selezionata la **modalità Test** (toggle blu)
3. Nel menu laterale, vai su **Developers** > **API keys**
4. Troverai due chiavi:
   - **Publishable key** (inizia con `pk_test_...`) - Chiave pubblica
   - **Secret key** (inizia con `sk_test_...`) - Chiave segreta

5. Clicca su **Reveal test key** per vedere la Secret key
6. Copia entrambe le chiavi

### Inserire le Chiavi nel Progetto

1. Apri il file `.env.local` nella root del progetto
2. Sostituisci le chiavi placeholder:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...la_tua_chiave_qui
STRIPE_SECRET_KEY=sk_test_51ABC...la_tua_chiave_segreta_qui
```

⚠️ **IMPORTANTE**: 
- La chiave pubblica (`pk_test_`) deve avere il prefisso `NEXT_PUBLIC_`
- La chiave segreta (`sk_test_`) NON deve essere condivisa pubblicamente
- Non committare mai `.env.local` su Git

3. **Riavvia il server** dopo aver modificato `.env.local`:

```bash
# Premi Ctrl+C per fermare il server
# Poi riavvia con:
npm run dev
```

## Passo 3: Testare i Pagamenti

Stripe fornisce carte di test per simulare pagamenti:

### Carte di Test

| Carta | Risultato |
|-------|-----------|
| `4242 4242 4242 4242` | ✅ Pagamento riuscito |
| `4000 0000 0000 0002` | ❌ Pagamento rifiutato |
| `4000 0027 6000 3184` | 🔐 Richiede autenticazione 3D Secure |

### Dati Aggiuntivi per il Test

- **Data di scadenza**: qualsiasi data futura (es. `12/25`)
- **CVC**: qualsiasi 3 cifre (es. `123`)
- **CAP**: qualsiasi codice (es. `12345`)

### Come Testare

1. Avvia il server: `npm run dev`
2. Vai su http://localhost:3000
3. Aggiungi prodotti al carrello
4. Vai al checkout
5. Inserisci le informazioni di spedizione
6. Clicca su "Procedi al Pagamento"
7. Verrai reindirizzato a Stripe
8. Usa una delle carte di test sopra
9. Dopo il pagamento, sarai reindirizzato alla pagina di successo
10. L'ordine apparirà nell'admin: http://localhost:3000/admin/ordini

## Passo 4: Configurare i Webhook (Importante!)

I webhook permettono a Stripe di notificare il tuo sito quando un pagamento è completato.

### In Locale (Sviluppo)

1. Installa Stripe CLI:

**Windows (con Scoop):**
```bash
scoop install stripe
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.5/stripe_1.19.5_linux_x86_64.tar.gz
tar -xvf stripe_1.19.5_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

2. Login:
```bash
stripe login
```

3. Avvia il forwarding:
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

4. Copia il **webhook signing secret** che appare (inizia con `whsec_`)
5. Inseriscilo in `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...il_tuo_secret_qui
```

6. Riavvia il server

### In Produzione

1. Vai su **Developers** > **Webhooks** nella Dashboard Stripe
2. Clicca su **Add endpoint**
3. Inserisci l'URL: `https://tuo-dominio.com/api/webhook/stripe`
4. Seleziona gli eventi da ascoltare:
   - `checkout.session.completed` ✅
   - `payment_intent.payment_failed` ❌
5. Clicca su **Add endpoint**
6. Copia il **Signing secret** (inizia con `whsec_`)
7. Aggiungilo alle variabili d'ambiente del tuo hosting

## Passo 5: Andare in Produzione

Quando sei pronto per accettare pagamenti reali:

### 1. Attiva il tuo Account Stripe

1. Vai sulla Dashboard Stripe
2. Completa il processo di verifica dell'account
3. Aggiungi le informazioni bancarie per ricevere i pagamenti

### 2. Ottieni le Chiavi Live

1. Nella Dashboard, cambia dalla modalità **Test** a **Live** (toggle in alto a destra)
2. Vai su **Developers** > **API keys**
3. Copia le chiavi **Live** (iniziano con `pk_live_` e `sk_live_`)
4. Aggiornale nelle variabili d'ambiente di produzione

⚠️ **NON usare mai le chiavi Live in sviluppo locale!**

### 3. Configura i Webhook Live

1. In modalità **Live**, vai su **Developers** > **Webhooks**
2. Aggiungi l'endpoint per il tuo dominio di produzione
3. Aggiorna il `STRIPE_WEBHOOK_SECRET` con quello live

## 🔍 Verifica della Configurazione

Controlla che tutto funzioni:

✅ **Checklist:**
- [ ] Account Stripe creato
- [ ] Chiavi test copiate in `.env.local`
- [ ] Server riavviato dopo le modifiche
- [ ] Test pagamento completato con successo
- [ ] Ordine visibile in `/admin/ordini`
- [ ] Webhook configurati (opzionale in sviluppo)

## 🆘 Problemi Comuni

### "Invalid API Key"
- Verifica che le chiavi siano copiate correttamente
- Controlla che non ci siano spazi extra
- Assicurati di aver riavviato il server

### "This test mode API key cannot be used in production"
- Stai usando chiavi `test` in produzione
- Passa alle chiavi `live` per accettare pagamenti reali

### "Webhook signature verification failed"
- Il `STRIPE_WEBHOOK_SECRET` è errato o mancante
- In locale, usa Stripe CLI per il forwarding
- In produzione, verifica che il secret corrisponda all'endpoint

### L'ordine non si aggiorna dopo il pagamento
- I webhook non sono configurati correttamente
- Verifica che Stripe CLI sia in esecuzione (in locale)
- Controlla i log della Dashboard Stripe > Developers > Webhooks

## 📚 Risorse Utili

- [Documentazione Stripe](https://stripe.com/docs)
- [Dashboard Stripe](https://dashboard.stripe.com)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Carte di Test](https://stripe.com/docs/testing)
- [Webhook Guide](https://stripe.com/docs/webhooks)

## 💬 Supporto

Per problemi con Stripe:
1. Consulta la [documentazione ufficiale](https://stripe.com/docs)
2. Visita il [forum di supporto](https://support.stripe.com)
3. Contatta il supporto Stripe dalla Dashboard

---

✨ Buon lavoro con il tuo shop! ✨
