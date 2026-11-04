# LAIKA — il pacchetto del corso

- `canone.json`: struttura del percorso (atti, unità, gioco di ogni unità, stato). Fa fede sugli altri documenti; dopo una modifica `npm run canone`.

Un solo corso con l'Atto I (1700–marzo 1917), diviso in sei unità tutte giocabili in prima versione: I.1 la settimana del servo, I.2 il mir, I.3 la città e il salario, I.4 il 1905, I.5 la guerra e il pane, I.6 marzo 1917. Nel gioco l'atto è ancora uno solo: dal 4 novembre 2026 il canone ne prevede tre fino al 1917 (D-024), che il gioco avrà dalla fase R3 del riordino. Stato: [STATO](../../docs/laika/STATO.md). Gli identificatori degli episodi di I.3 sono ancora `a1-u2-*` (scelta del 29 ottobre 2026).

Eseguire dalla radice:

```sh
npm run build:laika
npm test
npm run serve
```

Aprire `/` per la home, `/play.html?game=laika` per il corso: si entra dalla pagina dell'atto I (sei unità). I laboratori dimostrativi restano su `/play.html?game=biblioteca` e analoghi; gli URL `/?game=...` vengono inoltrati preservando query e frammento.

- `course.json`: ordine degli atti, elenco dei file di domande, scene e simboli.
- `source/acts/`: atti sorgente. `questionRef` risolve un ID globale dalle banche domande; `stageId` riferisce le scene indicizzate.
- `source/stages/`: scene dichiarative del compositore esistente (vuota: le scene di produzione sono schede della bottega in `source/scene/`).
- `questions/`: banche in formato runtime, con eventuali dati di redazione in `editorial`.
- `assets/`: simboli e futuri SVG sorgenti. Gli originali restano nei prototipi.
- `sources.json`: provenienza editoriale da compilare nelle fasi contenuti, senza sostituire il dossier delle fonti.
- `game.json`: file generato, mai autorità editoriale. Rigenerarlo dopo un conflitto.

Il build proietta i campi runtime dei contenitori, risolve i riferimenti e rimuove la chiave riservata `editorial` a ogni profondità. Mettere note, localizzazioni bibliografiche interne e motivazioni dei distrattori sotto tale chiave; `source` e `sources` runtime restano disponibili allo studente. Nessuna funzione o import di codice nei contenuti. I percorsi di input restano all'interno del pacchetto. Composizione, schema, binding e SVG usano `validatePack`: non esiste un validatore SVG LAIKA separato.

Due build producono gli stessi byte. Un riferimento mancante, un ID duplicato (anche di episodio fra atti), una domanda non risolta o uno schema invalido interrompono il build prima di riscrivere il manifest.

Per giocare l'atto intero come uno studente e avere una trascrizione: `npm run serve`, poi `npm run allievo` (vedi `scripts/allievo-finto.cjs`).

## Scene della bottega

`course.json` dichiara `scene` (schede in `source/scene/`) e `tema` (predefinito `laika`). Il build le compone con la [bottega](../../bottega/README.md) e aggiunge al manifest `palette`, `patterns`, simboli e scenografie. Finché `scene` è vuoto il manifest resta identico.
