# NOTA: Colori Purple Rimanenti

Per rimuovere completamente i colori purple hardcoded, cambia manualmente nei file:

## Focus rings (focus:ring-purple-600)
Questi elementi usano ancora `focus:ring-purple-600` che è un ring di Tailwind CSS.
Dato che è un effetto di focus, non interferisce con il tema principale ma per consistenza si può:
- Rimuovere `focus:ring-2 focus:ring-purple-600`
- Sostituire con uno stile custom se necessario

Files da aggiornare:
- app/contatti/page.tsx (linee 43, 57, 71)
- app/login/page.tsx (linee 72, 87)
- app/registrati/page.tsx (linee 89, 104, 119, 134)
- app/checkout/page.tsx (linee 127, 139, 152, 165, 177, 189)
- app/admin/prodotti/nuovo/page.tsx (vari input)
- app/admin/prodotti/[id]/page.tsx (vari input)
- app/admin/impostazioni/page.tsx (vari input)

## Pagina Successo Ordine
File: app/ordine/successo/page.tsx
- Sfondo gradiente purple/indigo
- Tutti i colori purple nei bullet points e pulsanti

## Pagina Homepage
File: app/page.tsx
- Sezione CTA con sfondo purple/indigo
- Pulsanti con colori purple

## Icone e Badge
- app/admin/ordini/page.tsx (badge shipped purple)
- app/admin/ordini/page.tsx (icona Package purple)

SOLUZIONE: Rimuovere o sostituire con var(--color-primary)
