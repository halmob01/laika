# Handoff P1 — collegamento del prodotto al motore

Data: 20 ottobre 2026. Fase limitata a P1 di [INCARICHI-LAIKA](INCARICHI-LAIKA.md), secondo [PIANO-LAIKA](PIANO-LAIKA.md).

## Fase / PR / base SHA / commit verificato

- Branch: `feat/laika-p1`; [PR #10](https://github.com/halmob01/riv-russa/pull/10) verso `main`, nessun merge né deploy.
- Base finale aggiornata: `ad8ecc52084a59ad87738659c80270d34abe795f` (merge PR #7, P0). Il lavoro era iniziato su `eb6ab8326045add19606e85c1f707ecba6407afa`; il branch è stato riallineato con rebase alla P0 integrata durante la sessione. Preservati appunti, libri, skill e nuovo mandato sulle fonti.
- Commit del codice consegnato: `3dbfe8c19838ebf5147de4016b2c8ffe5b81fdb0`. I browser hanno verificato il predecessore `f2de6a0a3d7664b78d3419fd914ff054cd8749c6`: il rebase aggiunge solo documentazione P0, con diff vuoto di runtime/build/test/configurazione fra i due SHA. `npm test` è stato rieseguito sul nuovo commit: 55/55. Il commit `0deaa67` aggiunge documentazione ed evidenze. Correzione finale `0c756072b386847b4585f6f8bbdfda00ee1d1793`: colore del testo dell’avviso (contrasto 4,53:1) e attesa fine animazione prima dello screenshot. Dopo questa correzione rieseguita la suite P1 mirata su Chromium e WebKit, entrambi PASS; nessuna modifica a core, ledger o build. Il commit finale aggiorna solo questo handoff e l’immagine del player.
- Prerequisito P0 disponibile: [PR #7](https://github.com/halmob01/riv-russa/pull/7) e [handoff P0](P0-BASELINE.md), letti prima della consegna. Inventario e matrice fonti acquisiti senza modificarli. La revisione storica puntuale resta alle fasi contenuti.

## Risultato concreto

Home essenziale in `index.html`, con atti dichiarati in preparazione. Player generico in `play.html`, vecchi URL con `game` inoltrati preservando query e frammento. I tre esempi rimangono funzionanti. LAIKA è un solo corso interno con due atti tecnici; niente lezioni o domande storiche pubblicate come definitive. La home non offre un avvio del percorso storico.

La visita alla home legge i progressi attraverso la ricostruzione del ledger del kit senza scritture; distingue nuovo, riprendibile, completato e incompatibile. `Riprendi la prova tecnica` appare solo con un save valido non concluso. Il player continua a conservare backup incompatibili e richiede un riavvio esplicito per sostituirli.

## File e contratti cambiati

- `src/shell/registry.js`: `validateRegistry`, percorsi locali canonici, `presentation` opzionale con stylesheet e homeHref; applicazione e rimozione del tema per documento. Collegato sia al bootstrap sia al CLI `scripts/packs.js`.
- `src/core/schema.js`, `src/shell/app.js`: `context` opzionale (`documented`, `simulation`, `source`, `assessment`) e cartiglio testuale con data/luogo facoltativi. Nessun effetto su punteggi, transizioni o ledger.
- `src/storage/index.js`: `readProgress(game, storage)`, riuso di `load`/`restore` e replay, senza scritture o parser duplicati.
- `site/laika/`: home, tema e lettura dello stato; nessun asset storico nel core.
- `games/laika/`: sorgenti, indice, banche domande vuote, sedi degli asset, provenienza editoriale e manifest generato. Vedere [istruzioni authoring](../games/laika/README.md).
- `scripts/build-laika.js`, `package.json`: `npm run build:laika`, assemblaggio deterministico e validazione del kit prima della scrittura. ID globali dei quesiti e degli episodi univoci; riferimenti risolti; note riservate `editorial` escluse ricorsivamente; provenienza runtime preservata.
- `tests/p1.test.js`, `tests/browser-p1.cjs`, bootstrap dei test browser: regressioni mirate e ingresso del player aggiornato.

Regole degli effetti e semantica del ledger non modificate. Nessuna dipendenza aggiunta. Nessun prototipo o asset originale modificato.

## Decisioni nuove e motivazione

Lo scheletro usa soltanto due episodi narrativi esplicitamente tecnici per provare ingresso/passaggio/completamento senza inventare contenuti. Non c'è un avvio pubblico del corso storico; la prova resta raggiungibile nel player con etichetta interna. Wordmark testuale e font di sistema provvisori, senza distribuire Propaganda né introdurre una nuova famiglia. Roboto Condensed locale resta lavoro della presentazione di produzione.

`editorial` è la chiave riservata per note e riferimenti interni a qualsiasi profondità; la proiezione dei contenitori esclude anche i campi di indice authoring. `source` e `sources` del contratto runtime rimangono visibili. Il build riusa `validatePack`, compositore e validatore SVG del kit.

## Comandi eseguiti e risultati

| Comando | Risultato |
| --- | --- |
| `npm install --package-lock=false --cache /tmp/riv-npm --no-audit --no-fund` | Playwright 1.58.2 da package.json, nessuna versione alternativa. Il progetto non aveva lockfile; `npm ci` non applicabile. |
| `npm run build:laika` due volte | Byte identici; SHA-256 `5d44de500aaac0b7bbc1a3133859387cf4eb81d3c98c9b1af5aa708d3bca81db`. |
| `npm test` | **55/55** superati, inclusa validazione dei quattro pack. |
| `node tests/p1.test.js` | **6/6** superati; rieseguiti indipendentemente anche dal reviewer. |
| `python3 scripts/build-motion-preview.py` | Preview autonoma generata per la regressione motion. |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/riv-playwright npm run test:browser` | **Chromium PASS**, suite completa. |
| `KIT_BROWSER=webkit PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 PLAYWRIGHT_BROWSERS_PATH=/tmp/riv-playwright npm run test:browser` | **WebKit PASS**, suite completa, con dipendenze locali descritte sotto. |
| `git diff --check` | Superato. |

Browser installati dalla versione Playwright dichiarata: Chromium 145.0.7632.6 e WebKit 26.0, Linux headless, Node 24.19.0. Le librerie Debian mancanti per WebKit sono state scaricate ed estratte in `/tmp` e copiate nelle directory `sys/lib` del browser temporaneo. Nessuna modifica al sistema o alla repo. La verifica preliminare Playwright usa `ldconfig` e non riconosce GLES installato localmente: dopo controllo `ldd` e caricamento effettivo con `ctypes.CDLL`, è stata saltata soltanto quella verifica preliminare tramite la variabile documentata. Il browser e l'intera suite sono stati eseguiti realmente.

Il primo tentativo di suite, prima delle modifiche, incontrava `spawnSync python3 EPERM` nel sandbox; l'esecuzione successiva nell'ambiente con accesso corretto supera anche quel test. Non è stato modificato il test originale per aggirarlo.

La suite browser copre i pacchetti registrati con tastiera, focus, reload, completamento e reduced motion; i due esempi numerici anche con geometrie iniziali/intermedie/finali, touch e salvataggi. I test aggiunti coprono URL diretti e legacy dei tre esempi, query/frammento, tema LAIKA→biblioteca, contesto con markup reso letterale, visita home a scelta/esito senza mutazioni, ripresa valida, completamento, save corrotto/obsoleto preservato e home senza JavaScript.

## Preview e prove visive

Preview locale riproducibile: `npm run serve`, poi `http://localhost:4173/`; player `http://localhost:4173/play.html?game=laika`. Nessun hosting pubblico attivato.

Screenshot del codice consegnato (home Chromium, player WebKit dopo la correzione finale):

- [Home 390×844, primo accesso](evidence/p1/p1-home-mobile.png).
- [Home 1440×900, con prova riprendibile](evidence/p1/p1-home-desktop.png).
- [Player tecnico 390×844, posa finale](evidence/p1/p1-player-mobile.png).

La regressione preesistente usa anche 320/1280 px, il contratto browser 360 px. Nessuna nuova animazione in P1; non si dichiara una prova artistica P2/P3. Non sono stati prodotti video di figure o scene nuove, perché qui non ne sono state implementate.

La misurazione motion dello studio preesistente in Chromium ha registrato 712 frame, mediana 16,7 ms, p95 50 ms, 17 intervalli oltre 50 ms. WebKit ha registrato 397 frame, mediana 38 ms, p95 80 ms, 145 intervalli oltre 50 ms. Sono misure dell’ambiente desktop sullo studio preesistente, non una certificazione di performance su telefono né una nuova scena di produzione; la misura WebKit richiede attenzione in P2/P6. Gli intervalli RAF non attestano direttamente long task.

## Review indipendente

Review richiesta da P1 eseguita con Astra, effort high, sul diff effettivo e sui confini di persistenza. Corrette: coercizione di `context.kind` da array, azione errata nel nuovo test di progressione e note editoriali annidate esportate. Recheck finale: tutti risolti, sei test P1 e controllo whitespace superati; nessun ulteriore blocker concreto individuato. Il reviewer non ha modificato file.

## Fonti e licenze da chiarire

Nessun fatto storico o quesito didattico nuovo da validare in questa fase. Fonti prioritarie e dossier preservati. Licenza di Propaganda non risolta: file non distribuito, wordmark dichiarato provvisorio. Licenza e distribuzione locale di Roboto Condensed da verificare prima della UI di produzione.

## Non verificato / difetti residui

Telefono reale, matrice completa di accessibilità, performance della futura home e scene di produzione appartengono a P2–P6 e non sono certificati qui. I due atti tecnici non costituiscono lezioni o avanzamento editoriale. Append-only dei save non implementato: `contentVersion` resta esatta secondo il kit.

## Prossimo incarico e prerequisiti

P2: famiglia di personaggi, rig minimo e scena campione, preservando gli originali. Utilizzare i contratti P1 e l’inventario P0 ora integrato. Attendere il gate visivo dell'utente prima di derivare folle o moltiplicare le scene. P3 costruirà la home di produzione e la prima unità completa; non considerare questa shell la prova di qualità.
