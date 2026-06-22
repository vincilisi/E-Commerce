# Guida Configurazione PayPal

Questa guida attiva i pagamenti PayPal reali nel checkout.

## 1) Crea app PayPal

1. Vai su https://developer.paypal.com
2. Crea una app REST nella dashboard developer
3. Copia Client ID e Secret
4. Inizia con ambiente Sandbox per i test

## 2) Variabili ambiente

Aggiungi nel file .env:

PAYPAL_CLIENT_ID="il_tuo_client_id"
PAYPAL_CLIENT_SECRET="il_tuo_client_secret"
PAYPAL_ENVIRONMENT="sandbox"

Per produzione usa:
- PAYPAL_ENVIRONMENT="live"
- credenziali live della app PayPal

## 3) Riavvia il server

Dopo modifiche alle variabili:
1. Ferma il server
2. Avvia di nuovo con npm run dev

## 4) Come testare

1. Vai su /checkout
2. Compila i dati spedizione
3. Seleziona PayPal
4. Clicca Paga con PayPal
5. Approva su PayPal
6. Verrai riportato al sito su pagina successo ordine

## Note tecniche

- L'ordine locale viene creato in stato pending prima del redirect PayPal.
- Alla conferma (capture) viene aggiornato a paid.
- Alla conferma viene scalato lo stock dei prodotti acquistati.
