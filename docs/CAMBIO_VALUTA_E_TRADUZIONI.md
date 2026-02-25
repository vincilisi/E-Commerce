# Guida: Cambio Valuta e Traduzione Simultanea

## Cambio Valuta Automatico

- Il sistema converte automaticamente tutti i prezzi nella valuta locale in base alla lingua selezionata.
- Le valute supportate sono:
  - EUR (€) — Italia, Francia, Spagna, Germania, Portogallo
  - GBP (£) — Inglese (UK)
  - USD ($) — Americano (US)
  - RUB (₽) — Russo
  - CNY (¥) — Cinese
- I tassi di cambio sono aggiornati in tempo reale tramite API (ExchangeRate-API). Se l’API non è disponibile, viene usato un tasso di cambio di backup.
- Un tooltip accanto ai prezzi mostra il tasso applicato e la data di aggiornamento.
- Il cambio valuta avviene automaticamente al cambio lingua, senza bisogno di ricaricare la pagina.

## Traduzione Simultanea

- Tutti i testi del sito sono tradotti automaticamente in 8 lingue: Italiano, Inglese, Francese, Spagnolo, Tedesco, Portoghese, Russo, Cinese, Americano (US).
- I nomi e le descrizioni dei prodotti sono tradotti automaticamente quando vengono creati tramite l’admin.
- Il sistema usa un dizionario interno e può essere esteso o integrato con servizi esterni.
- Le traduzioni possono essere modificate manualmente dall’admin in ogni momento.

## Come Funziona per l’Admin

- Quando aggiungi un nuovo prodotto, le traduzioni vengono generate in tutte le lingue supportate.
- Puoi visualizzare e modificare ogni traduzione prima di salvare.
- I prezzi saranno sempre mostrati nella valuta della lingua selezionata dall’utente.
- Puoi aggiornare i tassi di cambio manualmente o lasciare che il sistema li aggiorni ogni ora.

---

Per domande o problemi, contatta il supporto tecnico.
