# Passaggio di consegne (5 novembre 2026, sera)

Per un nuovo agente che continua il piano. Si legge dopo [AGENTS.md](../../AGENTS.md) e prima di `npm run prossimo`. Quello che qui è «fatto» sta in `main`; dove non è così è scritto.

## 1. Dove siamo

- **In `main` (5 novembre 2026, sera):** S1, K1, K2, K4, K6, K7; unità U-otto-giorni, U-pane-guerra, U-mir, U-citta, U-servitu, U-soviet, U-petizione (PR #61), U-concessioni (PR #62), U-stolypin (PR #64); H-testi, i testi della home del docente (PR #63); C-I e C-III preparate (pagine per il docente, «aspetta il docente»).
- **C-II, PR #65:** unita il 5 novembre 2026 con CI verde (pagina `docs/laika/revisioni/atto-II-per-il-docente.md`; incarico «aspetta il docente»). Non c'è nessuna PR aperta.
- **Dopo C-II: K3** (ponte fra gli atti e famiglia), poi U-sito, V-1917, C-1917. `npm run prossimo` stampa il messaggio giusto.
- **Il piano di adesso finisce con C-1917.** Il docente ha detto di **non aggiungere** per ora gli Atti IV e V al piano.
- **Dal docente in attesa:** prove C-I, C-II, C-III (e poi C-1917), «più avanti» e senza data. I giochi di II.1, II.3 e II.4 sono **confermati dal docente il 5 novembre 2026** (D-042: `stato_gioco` «approvato»); le unità restano «bozza» finché non fa le prove.

## 2. Come si lavora (lezioni di questi giorni)

1. **Un incarico, un'unità, una PR**, nell'ordine; la PR comincia con «Che cosa cambia nella struttura». Il canone si tocca solo per i campi dell'unità che l'incarico assegna (`gioco`, `stato_gioco`, `scheda_gioco`, `nota`) e poi `npm run canone`. Il piano: `docs/laika/piano-1917.json` poi `npm run piano`; il numero di PR scritto in anticipo è il successivo (verificalo dopo `create_pull_request`).
2. **Un gioco si costruisce con il motore vero e il bilanciamento si fissa in un test** (`tests/laika-<unità>.test.js`, regola G3 alla lettera): nessuna strategia vince su tutti gli indicatori, strategie diverse portano a esiti diversi, ogni crisi si può provocare, ogni azione serve, il rischio è scritto prima. **Prova a mano che il test fallisce** con una mutazione su una copia di `game.json` (mai nel repository).
3. **Una meccanica che il motore non ha** non si improvvisa: incarico `K…` subito prima dell'unità, in un'altra PR, con test e voce in `docs/CREARE-UN-GIOCO.md` (così è stato per K7). Prima prova a vedere se bastano `when` sui flag e sulle metriche (per U-soviet bastavano: K5 non serve).
4. **Revisione indipendente G4:** agente con `model: opus`, un revisore nuovo a ogni giro, prompt con compito, difetti già corretti e prove da fare (partite casuali sul motore vero, mutazioni, documenti). Segnala come bloccante solo ciò che rende falso un documento, rotto un controllo o il gioco fuorviante. **Due «non passa» di fila: ci si ferma e si scrive al docente** (METODO §7); finora il docente ha risposto «ok, unisci a CI verde». Se un agente di revisione cade per il limite d'uso, riprendilo con `SendMessage` allo stesso id dopo il reset.
5. **Documenti veri:** quando una scheda cambia, la vecchia va in `docs/archivio/<NOME>-v1-<data>.md` con il banner «Archivio…»; mai riquadri «Aggiornamento» sopra testo vecchio. Ogni PR aggiorna la scheda di gioco in `docs/laika/giochi/`, `docs/laika/atti/atto-N.md`, MATRICE (fonti), STATO, piano, evidenze in `docs/evidence/<incarico>/`.
6. **Fonti:** nessun fatto inventato. Quello che non è in `references/fonti/` si attribuisce (Montefiore, Serge) solo se MATRICE lo riscontra; altrimenti «da riscontrare» in MATRICE e nella scheda, **mai nel testo dello studente** come nota di lavoro. Se non si trova un aneddoto, si scrive «Nessun aneddoto trovato» in MATRICE (è già successo per mir e soviet).
7. **Stile:** nessuna virgola prima di e, ed, o, od, né nei testi del gioco (`tests/laika-virgola.test.js`); nessuna emoji; date nei due calendari con il calendario occidentale per primo; nessuna scelta di gioco riguarda sparare, reprimere o denunciare (D-006).
8. **Disegni:** a ogni scena nuova o toccata guarda il quadro finale con `node scripts/scene-schermate.cjs <cartella> scena.json` e controlla che nulla sia **sospeso nel vuoto** (la base di un disegno sta sulla linea del campo: per le scene a 900 px di altezza l'orizzonte è a y=610; per quella delle feste a 1080 px, y=738). Il docente li nota.

## 3. Come si verifica (comandi)

- `npm test` (circa 8 minuti, tutto verde: 192 test in `main` dopo U-stolypin); `npm run build:laika` dopo ogni modifica ai sorgenti in `games/laika/source/`; `npm run piano`, `npm run canone`.
- `npm run test:browser` completo e WebKit **solo in CI**. In locale: `node scripts/browser-i1-solo.cjs` (Atto I, desktop e telefono, circa 6 minuti, spegni prima un altro server su 4173).
- Allievo finto: `npm run serve` (o `python3 -m http.server 4173`: **muore a ogni riavvio della sessione, controlla `curl localhost:4173`**) poi `OUT=/tmp/allievo node scripts/allievo-finto.cjs` in background (circa 10 minuti, non in primo piano: il limite dei comandi è 2 minuti). Gioca tutto l'Atto I e passa per l'Atto II; scrive trascrizione e schermate.
- Percorsi sul telefono (390x844) con misura delle etichette: `node scripts/percorso-soviet-telefono.cjs`, `node scripts/percorso-petizione-telefono.cjs`; si copiano per le altre unità a gestione.
- I comandi lunghi vanno in background con `run_in_background` e si aspetta la notifica; non si usano `sleep` lunghi.

## 4. La CI e le unioni

- Il flusso è «Kit regression and browser» con due job (Chromium e WebKit), circa 15 minuti, a volte 25 con la coda. Non si può rilanciare (403): se WebKit cade per instabilità, quasi sempre `game.json due to access control checks` in `tests/browser-p1.cjs` (fetch annullato), si aspetta la run del commit successivo; se resta rosso si avvisa il docente.
- Si unisce solo con CI verde sull'**ultimo** commit e `expectedHeadSha` (`merge_method: merge`). Dopo ogni push parte una nuova run: controlla che sia quella dell'ultima head.
- Per aspettare: `send_later` a 12-15 minuti con il testo completo di che cosa fare dopo; poi `ReadNotifications`. I server MCP (GitHub) a volte si scollegano: ricaricali con `ToolSearch` («github actions list merge pull request»).
- Il limite d'uso dell'abbonamento (5 ore) può fermare gli agenti di revisione: si riprendono dopo il reset.

## 5. Che cosa è nel motore e nei giochi (novità di questi giorni)

- `src/core/queue.js` (K1, K6) e `src/core/chain.js` (K2): code con la pazienza e merci che camminano.
- `verdicts[].floored: id` (K7): il giudizio dell'anno vale se una risorsa è arrivata al minimo durante l'anno, anche se la crisi è già scattata (le crisi scattano una sola volta per partita).
- `hotspotNames: true` (U-petizione): i punti sulla scena mostrano il nome breve oltre al numero. `keepInside`: le etichette restano dentro la scena. Il pannello «Lavori lunghi» (`<details>`) mantiene lo stato dell'anno. Un effetto di zero non si mostra.
- Giornate a punti azione: `market.points`, offerte con `when`, `cost` da 1 in su, `at` (posizione sulla scena), `repeat`, `chance`. Le offerte chiuse dalla condizione restano visibili e disabilitate: le variazioni di una stessa azione non si scrivono come offerte con la stessa posizione.
- Il gioco a posti con giudizi (`verdicts`) esiste solo nella modalità a posti; a mercato l'esito è il `feedback` fisso.

## 6. Che cosa resta aperto (da non perdere)

- **Fatti da riscontrare su un libro** (in MATRICE, mai nei testi come note): Gapon alla guida del corteo e lo zar non in città; il contenuto della petizione; la cronologia di dettaglio del soviet; multe e negozio a credito del salario; il contenuto del Manifesto e la durata delle Dume; la data e il contenuto del decreto di Stolypin; la «cravatta di Stolypin» (Montefiore, non in archivio). Nessun secondo aneddoto trovato per II.4 e per mir e soviet.
- **Il diario personalizzato di I.3-e7** (chi è partito e chi è rimasto) e il diario di fine Atto II aspettano K3.
- **Flag senza effetti a valle:** `uscita_dal_mir`, `stolypin_resta`, `stolypin_vende` (II.4) nessuna unità dopo li legge ancora: è un compito di K3. `tratta_prefetto` (soviet) è letto da II.3.
- **Osservazioni non bloccanti dell'ultima revisione (U-stolypin):** il legame riforma-repressione vive nei testi più che nella meccanica (la scelta fra le tre strade non tocca l'ombra dei tribunali); «Lavorare il podere» sta nella colonna di destra della scena; la «cravatta di Stolypin» va riscontrata su Montefiore; il modello dichiarato in atto-2 («Opus gioco») e nel piano (Sonnet) differiscono.
- **Tabellone di I.1 sul telefono** resta alto (circa 2000 px con il pannello chiuso). **Fiducia nello zar** arriva a 100 in quattro piani su sei in II.1.
- **Tre giochi su quattro dell'Atto II sono a punti azione** (II.2, II.3, II.4): il docente dovrebbe dire se sono troppo simili (domanda già in C-II).
- **WebKit** gira solo in CI; nessun telefono vero è stato provato.
- **Home** a circa 659 KB contro il budget di 500 (compito di U-sito); «Riprendi» non compare se si è appena entrati in un'unità senza agire (vedi STATO, «Restano»).
- **Aggiornare i documenti alla fine di tutto il piano** (richiesta del docente): STATO, PASSAGGIO, PIANO-1917.

## 7. Prossimi passi, in ordine

1. **Cominciare da K3** (nessuna PR da unire prima): `git checkout main && git pull`, poi `npm run prossimo`.
2. **K3 in dettaglio** (incarico di motore, Opus consigliato): flag e righe del diario che passano da un atto al successivo (oggi lo stato riparte da capo); contenuti: l'episodio breve «Che cosa porti con te» all'inizio degli Atti II e III, i tre effetti differiti previsti dalle schede (chi parte per la città, il soviet e le concessioni, il raccolto e la coda), il filo della famiglia in ogni unità; usa i flag di Stolypin. Test: un flag dell'Atto I cambia un testo dell'Atto II e uno dell'Atto III. Leggi `docs/laika/PERCORSO.md` §5 (la famiglia), `docs/CREARE-UN-GIOCO.md` (`carries`, effetti differiti `delayed`). Un incarico di motore ha la sua PR, la sua voce in CREARE-UN-GIOCO e la revisione G4.
3. **U-sito:** home entro 500 KB, «Riprendi» dopo un ingresso diretto, pagine lunghe.
4. **V-1917 e C-1917.**
