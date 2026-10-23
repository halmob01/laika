# LAIKA — Incarichi eseguibili dagli agenti

> **Aggiornamento 21 ottobre 2026, sera.** I contenuti seguono il nuovo arco in sette atti di [PIANO-ATTI-LAIKA](PIANO-ATTI-LAIKA.md): ogni episodio ha una scheda pronta da sviluppare, con aneddoti, passi da cercare e indicazione del modello (sezione 11). Corrispondenze con i codici precedenti: A0.1 → I.1-e4, A0.2 → I.1-e6, A0.3 → I.2-e1, A0.4 → I.2-e2/e3, A1.1–A1.4 → unità I.3. P4 e P5 sono state riallineate di conseguenza.

Usare con [PIANO-LAIKA.md](PIANO-LAIKA.md) e [BRIEF-HOME-ATTI.md](BRIEF-HOME-ATTI.md). Non affidare l'intero piano a un agente con il solo comando «fai tutto».

## Contratto comune da incollare all'inizio di ogni incarico

> **Aggiornamento 20 ottobre 2026.** Ogni incarico parte da [AGENTS.md](../AGENTS.md). Per scene, illustrazioni e animazioni si usa la [bottega](../bottega/README.md): schede scena JSON, catalogo, figura articolata e azioni già pronte. Non si disegnano SVG né si scrivono tracce a mano dentro gli atti.


> Lavora sulla repo halmob01/riv-russa. Esegui soltanto la fase indicata sotto, sulla base aggiornata, in un branch dedicato. Leggi PIANO-LAIKA.md e le sezioni del brief pertinenti. Le decisioni sono già prese: implementale con la soluzione minima compatibile con il codice. Non riscrivere il motore, non cambiare la direzione grafica, non aggiungere dipendenze senza un caso concreto. Gli asset possono essere migliorati o creati; conserva gli originali e rispetta i riferimenti. Non eseguire merge. Se trovi una contraddizione reale, prepara la correzione minima e riportala; non fingere una verifica riuscita. Consegna PR, evidenze e handoff. Se non hai accesso a un servizio o browser, completa il lavoro possibile e dichiara esattamente cosa manca.

A ogni avvio: verificare branch e modifiche locali, leggere eventuali AGENTS.md applicabili, confrontare la base col piano. Un lavoro recente dell'utente prevale sullo snapshot del 19 ottobre: preservarlo e descrivere le differenze prima di adottare una decisione incompatibile. Non resettare modifiche altrui.

**Mandato sulle fonti per tutti gli agenti:** Gli appunti «La Rivoluzione Russa» guidano temi, sequenza e obiettivi. Gli agenti devono consultare i materiali anche per frasi da citare, aneddoti e dettagli precisi, non soltanto per una bibliografia finale. Registrare ogni prelievo e il suo contesto secondo [FONTI-LAIKA](FONTI-LAIKA.md) e la scheda di [FONTI-MATRICE-LAIKA](FONTI-MATRICE-LAIKA.md). Considerare Sheila Fitzpatrick se conosciuta dall'agente: conoscenza pregressa utile a ricerca e confronto, opera/edizione ancora da aggiungere; non inventare citazioni o pagine senza riscontro.

**Stato al 21 ottobre 2026:** P0 e P1 concluse ([P0-BASELINE](archivio/P0-BASELINE.md), [HANDOFF-P1](archivio/HANDOFF-P1.md)); P2 tecnica conclusa con la bottega, gate visivo aperto; P3: homepage conclusa e approvata (PR #19), resta l'unità I.1 (ex A0.1); P2b: kit ambienti approvato dall'utente il 21 ottobre 2026 (PR #1 di `laika`).

## P0 — Baseline e risoluzione dei documenti

**Modello:** GPT-6.1 Sol, medium (conclusa con la PR #7). **Dipendenza:** nessuna.

**Leggere:** README, tutti i documenti di progetto, package.json, config.json, workflow, test browser e struttura degli asset. Controllare main e stato reale delle PR #4/#5, non le descrizioni storiche.

**Modifiche ammesse:** documentazione e inventario; nessun runtime o ridisegno ancora.

**Azioni:**

1. Eseguire la suite esistente e una sessione browser dove disponibile; registrare SHA e risultati. Non installare un'altra versione di Playwright per aggirare una dipendenza senza prima leggere il lockfile/configurazione del progetto.
2. Aggiornare `STATO-KIT.md`, `REPORT-TEST.md` e il cappello di `MOTION.md`: distinguere stato attuale, decisioni future e storia. Correggere conteggio/limiti solo dopo verifica del codice corrente. Aggiornare il riferimento palette in `PROGETTO.md`, senza cancellare il contesto storico delle scelte.
3. Creare `docs/ASSET-MANIFEST.md`: percorso, anteprima o pagina catalogo, ruolo, periodo compatibile, decisione riuso/adattamento/nuovo, licenza/provenienza e dubbio aperto. Includere licenza del font e originali degli asset.
4. Completare `docs/FONTI-LAIKA.md`, già avviato con il caricamento delle fonti: matrice affermazioni da verificare, localizzazioni e provenienza prevista. Leggere prima `references/fonti/appunti/la-rivoluzione-russa.docx`, fonte didattica prioritaria per temi, sequenza e obiettivi; usare l'altro DOCX come cornice concettuale. Consultare eventualmente libri, trascrizione e scheda in `references/fonti/` per approfondimenti e controlli, secondo il dossier. La scheda HOEPLI di Miéville non è il testo del libro. Si possono integrare ricerche online e chiedere altri libri all'utente. La skill è disponibile in [`.agents/skills/verifiche-didattiche/SKILL.md`](../.agents/skills/verifiche-didattiche/SKILL.md): leggerla per le fasi contenuti, insieme ai riferimenti pertinenti. L'auditor usa un formato di controllo distinto dal contratto runtime LAIKA: normalizzare le domande senza modificare lo schema del motore. Non considerare l'inventario iniziale una verifica storica completata.

**Accettazione:** nessun documento presenta come già fatto il contenuto di questo piano; link corretti; baseline riproducibile. Fonti o licenze mancanti sono questioni circoscritte, non motivo per bloccare la scaffolding tecnica.

## P1 — Collegare il prodotto al motore

**Modello:** GPT-6.1 Sol, high (conclusa con la PR #10). **Dipendenza:** P0.

**Leggere:** `src/shell/app.js`, `src/storage/index.js`, `src/runner/index.js`, `src/core/schema.js`, `src/validation/game-pack.js`, `src/assessment/index.js`, `index.html`, config, template e test di contratto. Cercare funzioni esistenti prima di creare helper equivalenti.

**File ammessi:** bootstrap/shell/storage/runner e schema solo per i contratti qui descritti; `index.html`, nuovo `play.html`, config, nuovi `site/laika/`, `games/laika/`, build e test pertinenti. Non cambiare regole degli effetti o semantica del ledger.

**Azioni, nell'ordine:**

1. Spostare l'entrypoint del player su `play.html`, preservando gli esempi e il routing legacy. All'inizio la home può essere una pagina onesta essenziale, non il prototipo spacciato per produzione.
2. Aggiungere `presentation` opzionale nel registro e `context` opzionale nell'episodio secondo il piano. Testare assenza, dati validi e input invalidi; usare rendering testuale, non HTML dal contenuto. Theme scoping: aprire biblioteca dopo LAIKA non deve ereditare la sua identità.
3. Esporre una lettura pubblica e priva di mutazioni del riepilogo progressi. Riutilizzare la validazione storage corrente; distinguere salvataggio valido/incompatibile. Nessun avvio o reset del gioco solo visitando la homepage.
4. Creare sorgenti authoring, assemblatore deterministico e manifest minimo valido per il lavoro interno. Segnalare chiaramente il contenuto provvisorio e non pubblicarlo come atto finito. Esportare soltanto campi runtime supportati; mantenere fonti/redazione nei sorgenti.
5. Collegare schema, validazione CLI e test del build. Il build fallisce su riferimenti mancanti, ID duplicati, domande non risolte e schema invalido. Evitare un secondo validatore SVG parallelo.

**Accettazione:** gli esempi precedenti funzionano nei nuovi URL e tramite compatibilità legacy; la home non altera un save; doppio build identico; tema per pack e context retrocompatibili; nessun nome/asset storico nel core. Test mirati su accesso, ripresa, save invalido e isolamento dei temi; suite e browser di regressione.

**Review:** Astra high sul diff dei confini e della persistenza, con incarico di review soltanto. Correggere difetti concreti, non una preferenza stilistica del reviewer.

## P2 — Tavola pose e gate visivo

**Stato.** La parte tecnica è conclusa con la bottega (PR #15): figura articolata a 14 giunture con pose, varianti e oggetti; cammino con appoggio; formazioni; azioni; galleria; confronto al pixel con lo studio personaggi originale. La PR #14 (figure disegnate a mano) è chiusa. Resta il **gate visivo dell'utente**.

**Modello:** Claude Opus 5.5 o GPT-6.1 Sol medium per la tavola; Sonnet 5.5 per aggiungere pose o varianti chieste dall'utente. **Dipendenza:** nessuna.

**Leggere:** `AGENTS.md`, `bottega/README.md`, `bottega/figura/pose.js`; aprire la scheda «Figure» della galleria.

**File ammessi:** `bottega/figura/` (solo nuove pose, varianti o oggetti), `bottega/esempi/`, documenti di stato.

**Azioni:**

1. Preparare una tavola con le figure di LAIKA nei ruoli e nelle varianti che servono agli atti 0 e I (contadina, operaio, figura in soprabito, funzionario, clero, soldato), a dimensione di gioco, in tema `laika`.
2. Aggiungere una fila di cinque e 8–12 s di cammino, gesto e arresto come scheda di esempio, con pausa, skip e reduced motion.
3. Se l'utente chiede correzioni: modificare pose o varianti con la procedura del README; non disegnare figure separate.

**Accettazione:** tavola PNG e scena di esempio valide (`npm run scena`), `npm test` e test browser della bottega verdi. **Gate utente:** approvazione delle pose prima di moltiplicare le scene degli atti. Un test tecnico non chiude questo gate.

## P2b — Base stabile e disegni mancanti

**Modello:** Claude Sonnet 5.5 o GPT-6.1 Sol medium; Opus 5.5 o Sol high se il test resta instabile. **Dipendenza:** nessuna; può procedere in parallelo a P2 e P3.

**Azioni:**

1. ~~Stabilizzare `tests/browser-original-studies.cjs`~~ Fatto il 21/10/2026: il test è stato rimosso. Confrontava al pixel gli studi prima e dopo un trasloco ormai concluso; la conservazione degli originali è garantita da `tests/laika-originals.test.js` (SHA-256 e blob Git), il confronto bottega/studi da `browser-bottega`.
2. Unire la PR #16 (kit infrastrutture e atmosfera) dopo la revisione dell'utente.
3. Dall'elenco `da_fare` del catalogo, produrre come kit con `CONTRATTO-KIT.md` i disegni che servono all'Atto I e alla home (elenco in PIANO-ATTI §9): strada urbana, interno contadino o izba, ufficio o cancelleria, caserma. Indicare epoca e luogo; evitare insegne e simboli inventati.

**Stato al 21 ottobre 2026.** Punto 2 superato: la PR #16 è già in `main`. Punto 3 svolto nel branch `feat/p2b-kit-ambienti`: nuovo kit `prototypes/kit-ambienti-primo-novecento/` con otto voci in stato `bozza` (strada, panetteria, interno di isba, ufficio, caserma, sala a colonne, trincea, parapetto), scelte sull'Atto I fuso del nuovo arco in sette atti; due scene di esempio (`esempi/pane.json`, `esempi/isba.json`). Verifiche locali: `npm test` 81/81, `npm run test:browser` su Chromium con 130 confronti al pixel a zero differenze; WebKit solo in CI. Evidenze in `docs/evidence/p2b/`. Resta il gate visivo dell'utente: dopo l'approvazione le voci passano da `bozza` a `pronto`. **Approvato dall'utente il 21 ottobre 2026 sera** e unito in `main`.

**Accettazione:** CI verde su Chromium e WebKit con `browser-bottega` eseguito; nuovi disegni a catalogo con stato ed epoca, confronto al pixel a zero differenze.

## P3 — Homepage e prima unità verticale

**Modello:** Claude Opus 5.5 o GPT-6.1 Sol high. **Dipendenze:** P1 e bottega (concluse); la bozza della home può partire con il gate P2 aperto.

**Stato al 22 ottobre 2026:** gate P2 superato (tavola pose I.1 e kit `prototypes/kit-feste-di-corte/` approvati dall'utente). Azioni 3 e 4 svolte nel branch `feat/p3-unita-i1`: unità I.1 con nove episodi runtime (e1–e7, più i due esiti di e4), otto schede scena, V1, effetto differito e4 → e6, collegamento dalla home; evidenze in `docs/evidence/p3/`. Resta il gate utente sulla qualità complessiva.

**Stato al 21 ottobre 2026:** azioni 1, 2 e 5 concluse per la home (PR #19). Restano le azioni 3 e 4 (unità I.1, ex A0.1, e collegamento scelta → scena) e la verifica finale da home a fine A0.1. Non modificare impaginazione e illustrazioni della home senza richiesta dell'utente: le regole sono in BRAND-DESIGN §5.

**Leggere:** `AGENTS.md`, schede I.1-e1…e7 di PIANO-ATTI, brief home, prototipo home v2, `bottega/README.md`, sorgenti del pack e adattatore progressi. Non copiare il JS del catalogo come runtime.

**File ammessi:** `index.html`, `site/laika/`, schede in `games/laika/source/scene/`, unità I.1 e fonti correlate; shell solo per difetti d'integrazione riproducibili. Il hero è una o più schede scena della bottega, non SVG scritto a mano nella pagina.

**Azioni:**

1. Implementare gerarchia home del brief, CTA reale, ripresa, fascicoli e layout mobile. Caricare il corso al bisogno; rispettare il budget trasferito del primo quadro.
2. Implementare il hero come scheda scena con tre sequenze (terra, città, assemblea), una sola attiva alla volta e posa finale; montarla con `createStage` del motore; interrompere il lavoro fuori viewport o a pagina nascosta. Usare solo voci del catalogo con epoca compatibile (niente architettura successiva al 1917).
3. Scrivere e verificare l'unità I.1 completa (schede I.1-e1…e7): contesto, allocazione, feedback causale, confronto e un item formativo. Registrare le fonti; non lasciare lorem ipsum nel traguardo di qualità.
4. Collegare stato e scena: scelta → effetto leggibile → salvataggio → reload con la stessa conseguenza rappresentata. Il replay della scena non ricompie la scelta.
5. Verificare tastiera, ridimensionamento, telefono emulato, reduced motion e nuovo accesso/ripresa dalla home.

**Accettazione:** demo realmente giocabile da home fino a fine I.1; due allocazioni producono risposte distinguibili e spiegate; font/diritti risolti o sostituzione provvisoria chiaramente dichiarata; preview e video. **Gate utente:** valutazione della qualità complessiva prima di produrre tutte le scene. La UI non promette un Atto I completo mentre è ancora assente.

## P3R — Rifacimento: player, motore a turni, I.1 nuova

**Perché:** la prima versione di I.1 (PR #7) ha troppo testo e poco gioco; la meccanica non è integrata e l'impaginazione del player è quella generica delle demo. Decisioni del docente del 22 ottobre 2026 in [REPERTORIO-GIOCHI](REPERTORIO-GIOCHI-LAIKA.md).

**Modello:** Claude Opus 5.5. **Leggere:** `AGENTS.md`, REPERTORIO-GIOCHI, BRAND-DESIGN §5 e §5ter, `bottega/README.md`, `docs/CREARE-UN-GIOCO.md`.

**Azioni, una PR ciascuna, con prova del docente dal telefono prima della successiva:**

1. **Redesign del player** secondo BRAND-DESIGN §5ter: tema in `site/laika/`, parte generica nello shell con test, menu dei giochi dimostrativi nascosto per LAIKA, mobile bilanciato.
2. **Prototipo della settimana**: tre anni giocabili, pagina da buttare in `prototypes/`, nessuna modifica al motore.
3. **Motore a turni** con gestione e decisioni sui gruppi, piazzamento «tocca la pedina, poi tocca il posto» (niente trascinamento), salvataggio a metà turno, test Node e browser; schede di lettura in `docs/meccaniche/`.
4. **I.1 ricostruita** sul motore (REPERTORIO §5), con le fonti già registrate e bilanciamento provato su almeno due strategie contrastanti.
5. **I.1 come gestione** (richiesta del docente del 23 ottobre 2026): persone con forza diversa al posto dei giorni, figure che si spostano sulla scena, lavori lunghi che restano, semina, fiera, esito spiegato voce per voce. Motore generico (`workers`, `projects`, `reserve`, `market`, `boost`, `yearly`) con prova neutra; `stage.position` nel motore visivo. **Restano aperti:** i disegni delle migliorie (orto, stalla rifatta, campo nel bosco, sokha) da chiedere alla bottega con CONTRATTO-KIT: per ora sulla scena c'è un'etichetta; le pose delle figure non cambiano con il posto (tutti zappano).

**Accettazione:** il docente gioca I.1 dal telefono e la approva. Nessun merge senza la sua richiesta.

## P4 — Atto I, prima parte: unità I.2 e I.3

**Modello:** Claude Sonnet 5.5 o GPT-6.1 Sol medium; Opus 5.5 o Sol high solo per scene difficili. Review storica: modello dell'altra famiglia (Astra high o Opus 5.5). **Dipendenza:** P3.

**Leggere:** schede I.2 e I.3 di PIANO-ATTI, brief (sezioni 4–5 per la regia), dossier fonti, schema dei sei tipi e unità I.1 approvata.

**File ammessi:** sorgenti/asset/domande/fonti LAIKA, manifest generato, test di percorso; documenti di stato. Non aggiungere tipi di interazione.

**Azioni:**

1. Implementare le unità I.2 e I.3 secondo le schede. Per ogni unità produrre una scheda breve obiettivo → fonti → attività → effetti → trasformazione visiva → limiti.
2. Calibrare i parametri del modello in una tabella, provare priorità sussistenza e priorità investimento. Almeno una conseguenza differita deve maturare e risultare comprensibile; non provocare dead end.
3. Completare sei domande formative totali, esposizioni e feedback. Applicare la skill didattica se realmente disponibile; in alternativa fare review esplicita degli item senza dichiarare quel controllo eseguito.
4. Preparare gli effetti differiti verso I.4 e I.5 senza simulare il completamento dell'atto.
5. Controllare cronologia, anacronismi e fonti con reviewer distinto. Ogni feedback storico importante ha una fonte verificabile, non solo consenso fra modelli.

**Accettazione:** unità I.1–I.3 complete, item formativi delle tre unità, asset coerenti, due itinerari provati, reload e diario funzionanti, nessun placeholder pubblico. Review storica Astra high su fonti/testo/item, non su una descrizione riassunta dall'autore.

## P5 — Atto I, seconda parte: I.4, I.5, confronto finale e demo di folla

**Modello:** Claude Sonnet 5.5 o GPT-6.1 Sol medium per dati e testi; Opus 5.5 o Sol high per il corteo del 1905 (I.3-e1), il soviet (I.3-e3) e il confronto finale (I.5-e5). **Dipendenza:** P4.

**Leggere:** schede I.4 e I.5 di PIANO-ATTI, brief sezione 5 per la regia del corteo, fonti verificate, rig approvato e contratto del compositore.

**Azioni:**

1. Realizzare le unità I.4 e I.5, le verifiche V5–V6 e il confronto finale dell'atto. Separare rigorosamente fatti, fonti e simulazione; controllare calendario, Duma e riforme.
2. Creare il corteo del 1905 e l'assemblea come schede scena con le formazioni della bottega (`marcia`, `discorso`, `gruppo`) e le pose approvate. Usare dettagli pertinenti, non adattare una parata sovietica con una didascalia diversa.
3. A1.2 deve avere aggregazione, coordinamento dei passi, gesto, cambio d'inquadratura e arresto narrativo; A1.3 ha almeno due composizioni finali corrispondenti agli esiti. Versioni statiche per reduced motion e reload.
4. Testare il passaggio fra le unità e la fine dell'atto: reset delle variabili dove previsto, mantenimento diario/esposizioni secondo il contratto, nessuna eredità controfattuale spacciata per storia. Provare refresh prima e dopo l'avanzamento.
5. Terminare il corso con riepilogo e indicazione onesta del seguito; nessun bottone verso atti vuoti.

**Accettazione:** Atto I completo giocabile e riprendibile, due itinerari senza blocchi, demo visiva con pause/replay/reload, zero duplicazione di effetti da animazione. Review utente della folla e review storica separata prima della chiusura.

## P6 — QA e candidato alla consegna

**Modello:** Claude Opus 5.5 o GPT-6.1 Sol high. **Dipendenza:** P5. Reviewer indipendente dell'altra famiglia (GPT-6 Astra high o Opus 5.5), solo review.

**Leggere:** diff di tutte le fasi, criteri del piano e prove già prodotte. Non riscrivere file perché lunghi se non esiste un difetto concreto.

**Azioni:** eseguire la matrice di PIANO §5; misurare home e scena peggiore, salvare risultati e profilo sintetico; controllare viewport, tastiera, reduced motion, focus, errori console, lifecycle e save invalidi; verificare anche i giochi non LAIKA. Correggere e riprovare i difetti trovati, senza moltiplicare test che ripetono la stessa implementazione.

Creare `docs/CONSEGNA-LAIKA.md` con URL preview, SHA, itinerari provati, tabella comandi/esiti, browser/dispositivi, immagini/video, misure performance, stato licenze e fonti, limiti conosciuti. La preview deve essere utilizzabile: una raccolta di screenshot non basta a valutare l'animazione.

**Accettazione:** nessun blocker didattico, funzionale o visivo aperto; eventuali prove non disponibili dichiarate; PR pronta da valutare. Nessun merge senza autorizzazione dell'utente. Se una prova è bloccata, riportare «non verificato», non «pass».

## P7 — Procedura di prosecuzione

**Modello:** Claude Sonnet 5.5 o GPT-6.1 Sol medium. **Dipendenza:** P6.

**Azioni:** aggiornare stato/documenti con ciò che è veramente presente; aggiungere a CREARE-UN-GIOCO un collegamento alla struttura authoring LAIKA senza renderla obbligatoria per altri progetti; preparare `docs/BRIEF-ATTO-II.md` usando la procedura del piano, con fonti/asset da verificare e nessuna implementazione anticipata. Aprire nel backlog il lavoro append-only sui save prima di distribuire nuovi atti.

**Accettazione:** un nuovo agente sa da quali sorgenti partire, quale comando rigenera il manifest, quali asset può riusare, quali prove deve eseguire e quale review deve attendere. Il prossimo incarico riguarda Atto II, non una nuova riprogettazione generale.

## Protocollo di review e conflitti

- Il reviewer restituisce difetti con file, comportamento osservato, impatto e correzione minima. Distingue errore, limite non verificato e preferenza. Non usa «mi sembra meglio» per annullare una decisione già approvata.
- Per gli asset confrontare visivamente originale, proposta e riferimento. Per i contenuti confrontare affermazione e fonte. Per il motore usare contratto e test di comportamento.
- Assegnare un proprietario per fase/file; asset e contenuti possono avanzare su branch distinti dopo P1. Il responsabile integrazione aggiorna la base e rigenera il manifest. Mai risolvere un conflitto scegliendo in blocco «ours/theirs».
- Se un nuovo asset dell'utente arriva durante il lavoro, confrontarlo con quello in produzione e incorporarlo dove migliora la scena, senza invalidare automaticamente il rig. Se cambia la direzione, fermare solo la moltiplicazione degli asset interessati.

## Formato obbligatorio dell'handoff

```
Fase / PR / base SHA / commit verificato:
Risultato concreto:
File e contratti cambiati:
Decisioni nuove e motivazione:
Comandi eseguiti e risultati:
Preview e prove visive:
Fonti e licenze da chiarire:
Non verificato / difetti residui:
Prossimo incarico e prerequisiti:
```

## Prompt iniziale pronto

> Esegui la parte restante di P3 di docs/INCARICHI-LAIKA.md (unità I.1 completa e collegata alla home: schede I.1-e1…e7 di docs/PIANO-ATTI-LAIKA.md) seguendo docs/PIANO-LAIKA.md e AGENTS.md. I passi da citare si cercano nei libri forniti dal docente; non inventare dati e segnala ciò che non trovi. La home è approvata: non cambiarne impaginazione né illustrazioni. Le scene dell'unità sono schede della bottega (bottega/README.md): scegli i disegni dal catalogo rispettando l'epoca, non disegnare SVG a mano; tieni la parte generica nel motore o nella bottega e quella specifica in games/laika/. Verifica la base attuale, preserva il lavoro recente, apri una PR senza merge e consegna l'handoff previsto.

Per un'altra fase sostituire il numero e aggiungere il link alla PR precedente e al suo handoff. Non incollare tutta la cronologia della conversazione: piano, brief pertinente, diff e risultati bastano.
