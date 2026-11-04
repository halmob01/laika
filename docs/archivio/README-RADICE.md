# Rivoluzione russa / kit di giochi didattici

Questa versione introduce il kit riutilizzabile richiesto per costruire il percorso. I contenuti storici della Rivoluzione russa non sono ancora implementati.

Tre demo indipendenti — **Una biblioteca per tutti**, **Uno spazio in comune** e **Prima di inoltrare** — funzionano con gli stessi moduli, senza backend e senza dipendenze runtime. Include atti, ruoli, scelte condizionali, allocazione, confronto di fonti, effetti differiti, verifica formativa, salvataggi ricostruiti e stage SVG persistente con sequenze multitraccia, personaggi a gruppi e pausa/ripresa.

```sh
npm test
npm run serve
```

Aprire http://localhost:4173/ (servizio HTTP necessario). Per i test Chromium: `npm install`, `npx playwright install chromium`, `npm run test:browser`.

## Da dove partire

**Il percorso LAIKA**
- [Piano generale degli Atti I–VII](docs/PIANO-ATTI-LAIKA.md): che cosa raccontare, episodio per episodio, con aneddoti, fonti e divisione del lavoro fra agenti.
- [Repertorio dei giochi](docs/REPERTORIO-GIOCHI-LAIKA.md): con quali giochi si vive ogni unità, i modelli da cui vengono, costi e sequenza di lavoro.
- [Piano operativo](docs/PIANO-LAIKA.md): architettura del sito, fasi e uso dei modelli; [incarichi per gli agenti](docs/INCARICHI-LAIKA.md); [brief visivo](docs/BRIEF-HOME-ATTI.md).
- [Fonti: priorità e uso](docs/FONTI-LAIKA.md) · [opere di riferimento](references/fonti/README.md) · [atlante degli aneddoti](references/fonti/atlanti/README.md).

**Il kit**
- [Istruzioni per gli agenti](AGENTS.md) · [bottega: disegni, figure, folle e movimenti](bottega/README.md).
- [Come creare un nuovo gioco e contratto dati](docs/CREARE-UN-GIOCO.md) · [animazioni e sequenze](docs/MOTION.md).
- [Stato del kit](docs/STATO-KIT.md) · [report test e limiti](docs/REPORT-TEST.md).

Documenti superati o di sola cronologia: [archivio](docs/archivio/README.md).

I test originali del motore narrativo restano in `tests/legacy`. Le storie originali sono fixture di regressione, non contenuti caricati dal nuovo sito. La compatibilità v1 riguarda l’API pura, non una migrazione automatica della vecchia interfaccia.

Prima versione integrata; consolidamento documentato sotto. Prova su iPhone reale ancora da eseguire. Nessun deploy eseguito.

## Stato e nuovo gioco

La prima versione è integrata in main (PR #1). Stato corrente, verifiche e limiti: [docs/STATO-KIT.md](docs/STATO-KIT.md).

`npm run create:game -- nome-gioco "Titolo"` crea e registra un pacchetto minimo. `npm test` valida automaticamente tutti i pacchetti configurati. La demo `?game=messaggio` esercita tre atti, bivi, scene diverse e un percorso senza indicatori numerici.


## Identità visiva: LAIKA (prototipo separato)

Il percorso sulla Rivoluzione russa assume il nome pubblico **LAIKA**, con il sottotitolo:

> Direzione Centrale per la Pianificazione, l'Attuazione e la Rettifica dei Processi Rivoluzionari.

- [Prototipo homepage HTML/CSS/SVG](prototypes/laika-home/index.html) — esperimento standalone, non sostituisce `index.html` del kit.
- [BRAND-DESIGN — regole approvate, scelte aperte e motion](docs/BRAND-DESIGN.md).
- [Illustrazioni fornite come riferimento visivo](references/laika/README.md) — quattro tavole ottimizzate, non usate nel runtime.

**Vincoli di illustrazione:** solo grafica in codice per il prodotto finale, personaggi **sempre sagome piene**, stile essenziale e senza immagini stock. Il font Propaganda appartiene all'identità del progetto, non al motore riutilizzabile; nessun file font viene pubblicato nel kit.

## Studio editoriale delle animazioni (proposta)

[Apri lo studio di movimento](prototypes/motion-lab/index.html) dopo `npm run serve`. La demo riusa gli SVG del prototipo LAIKA e aggiunge una coreografia di 48 figure, regia e rivelazioni. Decisioni e limiti in [MOTION.md](docs/MOTION.md); convenzioni per nuove illustrazioni in [SVG-AUTHORING.md](docs/SVG-AUTHORING.md).

Per una demo autonoma da condividere: `python3 scripts/build-motion-preview.py` produce `dist/motion-study.html`. I test browser verificano anche questo file. È uno studio da valutare visivamente, non una scena storica definitiva.

## Nuovo studio grafico LAIKA — Atto 0

- [Catalogo visivo Atto 0 (14 simboli, 4 scene)](prototypes/laika-kit/index.html), basato sui moduli del renderer già in `main`.
- [Primo kit di forme (20 simboli, originale)](prototypes/laika-kit/kit-forme-laika.html), conservato come materiale illustrativo e confronto tecnico.
- [Home v2 (5 figure organiche)](prototypes/laika-home/index-v2.html), proposta di direzione per gli omini; [SVG autonomi delle cinque figure](prototypes/laika-kit/figure/human-a.svg) disponibili in `prototypes/laika-kit/figure/`.
- [Criteri di selezione, limiti, provenienza e revisioni necessarie](docs/archivio/LAIKA-ASSET-DIRECTION.md).

Questi sono studi visivi: non sostituiscono la home o le demo del kit, non costituiscono episodi storici e non modificano il motore e vanno ricontrollati sulle capacità già integrate dalla PR #4.


## Piano di produzione LAIKA

Il percorso è progettato in sette atti, dal 1700 al 1991; la prima versione giocabile sarà l'Atto I. Documenti di riferimento:

- [Piano, decisioni architetturali, fasi e modelli consigliati](docs/PIANO-LAIKA.md).
- [Piano generale degli Atti I–VII: episodi, aneddoti, fonti e divisione del lavoro fra agenti](docs/PIANO-ATTI-LAIKA.md).
- [Brief di homepage e illustrazioni](docs/BRIEF-HOME-ATTI.md).
- [Incarichi circoscritti per gli agenti, criteri di accettazione e prompt iniziale](docs/INCARICHI-LAIKA.md).

Gli asset sono una base migliorabile: il piano include nuovi disegni quando necessari, revisione visiva delle animazioni e separazione fra motore generico e identità LAIKA. Non rappresenta funzionalità già completate.

## Baseline P0

Stato e limiti verificati: [P0-BASELINE](docs/archivio/P0-BASELINE.md). [Inventario asset/font](docs/ASSET-MANIFEST.md) e [matrice delle fonti](docs/FONTI-MATRICE-LAIKA.md) preparano le fasi successive. Alla consegna P0 homepage e atti non erano ancora implementati; l’aggiornamento P1 è descritto sotto.

## Fonti di lavoro LAIKA

**Gli appunti «La Rivoluzione Russa» sono la fonte didattica prioritaria**; «Dalla modernità alla contemporaneità» è la cornice concettuale. Originali, testi estratti, trascrizione e scheda bibliografica di approfondimento sono raccolti in [references/fonti](references/fonti/README.md); criteri d'uso e stato della verifica sono in [FONTI-LAIKA](docs/FONTI-LAIKA.md). È autorizzata l'integrazione con ricerche online e la richiesta di altri libri quando necessari. Il caricamento dei materiali non equivale alla validazione dei contenuti.

## Skill per le verifiche didattiche

Pacchetto completo in [`.agents/skills/verifiche-didattiche/`](.agents/skills/verifiche-didattiche/SKILL.md), fornito dall'utente. Comprende istruzioni, checklist, profili, formato di audit, esempio e controlli Python senza dipendenze esterne.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s .agents/skills/verifiche-didattiche/scripts -p 'test_*.py'
python3 .agents/skills/verifiche-didattiche/scripts/audit_questions.py .agents/skills/verifiche-didattiche/assets/esempio-banca.json
```

L'auditor analizza le domande nel formato descritto dalla skill: il manifest runtime LAIKA richiede un'estrazione dedicata. Gli avvisi sono indicatori da revisionare; il controllo automatico non valida correttezza storica o qualità didattica. Otto test del pacchetto superati all'acquisizione; nessun audit dei futuri atti dichiarato eseguito.

## P1 — collegamento tecnico LAIKA

`index.html` è la home LAIKA; il player generico è in `play.html`. Nei corsi con unità il player passa da pagina dell'atto, pagina dell'unità e chiusura (`docs/CREARE-UN-GIOCO.md`). I vecchi URL `index.html?game=...` e `/?game=...` inoltrano al player preservando query e frammento. I tre laboratori restano disponibili.

`npm run build:laika` rigenera un pacchetto interno con due atti di prova, senza lezioni storiche. [Struttura authoring e comando di build](games/laika/README.md); [evidenze e handoff P1](docs/archivio/HANDOFF-P1.md). Il tema opzionale appartiene al registro; il riepilogo pubblico dei progressi non modifica i salvataggi. Grafica e contenuti restano alle fasi successive.

## Studi grafici originali e atlante editoriale

- [Tre studi HTML originali](prototypes/laika-studi-originali/README.md): estetiche/palazzi brutalisti e personaggi, conservati integralmente come prototipi sperimentali del futuro kit SVG. [Inventario, limiti e integrazione tecnica](docs/LAIKA-STUDI-SPERIMENTALI.md).
- [Atlante di 140 aneddoti e 17 frasi](references/fonti/atlanti/README.md): originale e indice editoriale per la costruzione delle scene, con [verifiche di fonte e criteri d'uso](docs/ANEDDOTI-SCENE-LAIKA.md).

Materiali da verificare; il caricamento e l'accettazione della PR non certificano idoneità alla produzione, correttezza storica o compatibilità col runtime. Nessuna importazione automatica nel motore.

## Bottega — scene senza disegnare a mano (20 ottobre 2026)

Le scene si descrivono con una **scheda scena** JSON e la [bottega](bottega/README.md) le compone con il motore: 58 disegni (architetture e palazzi brutalisti, ambienti, mezzi, oggetti) estratti dagli studi originali, una figura articolata con 24 pose, 13 varianti e 4 ruoli, 10 formazioni di folla e 21 azioni (walk, march, gather, disperse, speak, listen, raise, lower, work, queue, advance, confront, retreat, transfer, replace, reveal, transform, camera e altre). I disegni sono **identici al pixel** agli studi, verificato in browser su 103 casi. Colori a token con temi (`studi`, `laika`, `neutro`).

- [Galleria](bottega/galleria.html) dopo `npm run serve`: scene di esempio, pose, catalogo, prova di una scheda.
- `npm run scena -- file.json` controlla una scena; `npm run bottega:importa` rigenera i disegni dai kit.
- [Catalogo con stato, epoca d'uso e cose da disegnare](bottega/catalogo.json); [contratto per i nuovi kit](bottega/CONTRATTO-KIT.md).
- [Istruzioni per gli agenti](AGENTS.md), lette anche da Claude Code tramite `CLAUDE.md`.
