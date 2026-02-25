# 🌍 Sistema di Traduzione Automatica

## Panoramica

Il sito **Il Desiderio di una Stella** ora supporta la **traduzione automatica** in **8 lingue**:

- 🇮🇹 **Italiano** (IT) - Lingua base
- 🇬🇧 **Inglese** (EN)
- 🇫🇷 **Francese** (FR)
- 🇪🇸 **Spagnolo** (ES)
- 🇩🇪 **Tedesco** (DE)
- 🇵🇹 **Portoghese** (PT)
- 🇷🇺 **Russo** (RU)
- 🇨🇳 **Cinese** (ZH)

---

## 🤖 Assistente Virtuale Multi-Lingua

L'**assistente virtuale** si adatta automaticamente alla lingua selezionata dall'utente e fornisce:

### Funzionalità tradotte:
- ✅ Messaggi di benvenuto
- ✅ Domande frequenti (Spedizione, Resi, Pagamenti, Orari)
- ✅ Orari di apertura del negozio
- ✅ Pulsante contatto operatore
- ✅ Messaggi di risposta
- ✅ Placeholder e testi dell'interfaccia

### Orari del Negozio (tradotti in tutte le lingue):
- **Lunedì - Venerdì**: 09:00 - 18:00
- **Sabato**: 10:00 - 14:00
- **Domenica**: Chiuso

### Contatti Urgenti:
- **Telefono**: +39 02 1234 5678
- **Email**: info@ildesiderio.it

---

## 🛍️ Traduzione Automatica Prodotti

### Come funziona:

Quando crei un **nuovo prodotto** dal pannello Admin:

1. **Inserisci nome e descrizione in italiano**
2. Il sistema **traduce automaticamente** in tutte le 8 lingue
3. Le traduzioni vengono salvate insieme al prodotto
4. Gli utenti vedono il prodotto nella loro lingua preferita

### Dizionario di Traduzioni

Il sistema utilizza un **dizionario interno** che include:

#### Materiali:
- resina, acciaio, metallo, cuoio, legno, argento, ottone

#### Colori:
- rosso, blu, verde, nero, bianco, oro

#### Descrittori:
- portachiavi, fatto a mano, artigianale, elegante, moderno, classico, vintage, unico

### Esempio di Traduzione:

**Input (IT):** "Portachiavi elegante fatto a mano in resina e metallo oro"

**Traduzioni automatiche:**
- 🇬🇧 EN: "keychain elegant handmade in resin and metal gold"
- 🇫🇷 FR: "porte-clés élégant fait à la main en résine et métal or"
- 🇪🇸 ES: "llavero elegante hecho a mano en resina y metal oro"
- 🇩🇪 DE: "Schlüsselanhänger elegant handgefertigt in Harz und Metall gold"
- 🇵🇹 PT: "chaveiro elegante feito à mão em resina e metal ouro"
- 🇷🇺 RU: "брелок элегантный ручной работы в смола и металл золотой"
- 🇨🇳 ZH: "钥匙扣 优雅 手工制作 在 树脂 和 金属 金色"

---

## ⚙️ File Tecnici

### Componenti Principali:

1. **`lib/translations.ts`**
   - Contiene tutte le traduzioni statiche del sito
   - Include traduzioni per l'assistente virtuale
   - Organizzato per lingua e sezione

2. **`lib/autoTranslate.ts`**
   - Sistema di traduzione automatica prodotti
   - Dizionario di parole comuni
   - Funzioni per generare traduzioni

3. **`components/ChatAssistantSimple.tsx`**
   - Assistente virtuale multi-lingua
   - Integrato con `useLanguage()` hook
   - Traduce dinamicamente tutti i messaggi

4. **`lib/LanguageContext.tsx`**
   - Context React per gestione lingua globale
   - Hook `useLanguage()` per accesso alla lingua corrente
   - Funzione `t()` per traduzioni

---

## 🔧 Espandere il Dizionario

Per aggiungere nuove traduzioni al dizionario automatico:

```typescript
import { addTranslation } from '@/lib/autoTranslate';

// Aggiungi una nuova parola
addTranslation('stella', {
    en: 'star',
    fr: 'étoile',
    es: 'estrella',
    de: 'Stern',
    pt: 'estrela',
    ru: 'звезда',
    zh: '星星'
});
```

---

## 📊 Statistiche

- **Parole nel dizionario**: ~25+ termini base
- **Lingue supportate**: 8
- **Traduzioni per prodotto**: 16 (8 per nome + 8 per descrizione)
- **Componenti tradotti**: Tutto il sito + Assistente virtuale

---

## 🎯 Vantaggi

✅ **Nessun costo di traduzione manuale**
✅ **Traduzioni istantanee** al momento della creazione prodotto
✅ **Coerenza** nelle traduzioni
✅ **Esperienza utente** migliorata per clienti internazionali
✅ **SEO multi-lingua** pronto all'uso
✅ **Assistente virtuale** completamente localizzato

---

## 🚀 Prossimi Passi

Possibili miglioramenti futuri:

1. **Integrazione API traduzione professionale** (Google Translate, DeepL)
2. **Editor traduzioni** per modifiche manuali
3. **Traduzione automatica recensioni** clienti
4. **URL localizzati** per SEO
5. **Valuta multi-currency** basata sulla lingua
6. **Espansione dizionario** con più termini

---

## 📝 Note Importanti

- Le traduzioni automatiche sono **basate su un dizionario**
- Parole non presenti nel dizionario vengono **mantenute in italiano**
- Per traduzioni professionali, considera di integrare **API di traduzione esterne**
- Il sistema è **facilmente espandibile** aggiungendo nuove parole al dizionario

---

**Creato per Il Desiderio di una Stella** 🌟
