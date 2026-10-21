# LAIKA — Tavole illustrative di riferimento

Questa cartella conserva **quattro tavole distinte inviate dall'autore il 19 ottobre 2026**. I cinque file ricevuti comprendevano una copia duplicata, identica byte per byte.

Sono **versioni WebP ottimizzate per la consultazione nella repository** (dimensione massima 720 px); le immagini JPEG originali, non compresse in questo passaggio, restano tra gli allegati della conversazione sorgente. Non si tratta di scene definitive del gioco.

| File | Contenuto | Utilità |
|---|---|---|
| [01-cronologia-urss.webp](01-cronologia-urss.webp) | Dieci momenti della storia sovietica | cronologie, folle, eventi e composizioni piccole |
| [02-vita-quotidiana.webp](02-vita-quotidiana.webp) | Infanzia, vacanze, spazio, lavoro, sport | quotidianità, comunità, atmosfere sovietiche |
| [03-eventi-tragici.webp](03-eventi-tragici.webp) | Rivoluzione/guerra civile, carestia, purghe, guerra, Černobyl' | differenziare il tono visivo delle tragedie |
| [04-rivoluzione-tappe.webp](04-rivoluzione-tappe.webp) | Dodici tappe del 1917 e degli eventi successivi | storyboard narrativo dei livelli |

## Regole di traduzione in SVG

1. **Omini SEMPRE PIENI**: teste, busti e arti sono superfici riempite, non linee/stickman a contorno.
2. I riferimenti sono volutamente più dettagliati del target: **semplificare ulteriormente** per le scene di gioco.
3. Usare forme piatte, cielo/carta avorio, architettura azzurrina, sagome nere e interventi rossi.
4. Comporre piccole cronache, non poster sovraccarichi; i gesti di una folla devono restare riconoscibili anche su smartphone.
5. Animazioni reali in codice: movimenti di folle, cambi di configurazione, costruzione, conflitti, mutamenti di potere. Separare personaggi e architetture in gruppi SVG semanticamente riconoscibili.
6. **Non** importare questi WebP nel gioco finale, né inserirli in `src/`: sono riferimenti di progetto, non asset di runtime. Le scene definitive vanno costruite in SVG originali.
7. Controllare anacronismi e precisione storica: le tavole sono suggestioni grafiche, non fonti didattiche convalidate.

Documento generale: [Brand Design](../../docs/BRAND-DESIGN.md). Prototipo separato: [Homepage LAIKA](../../prototypes/laika-home/index.html).
