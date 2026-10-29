# LAIKA — struttura authoring P1

Questo pacchetto è una prova tecnica interna, non un atto didattico disponibile. Un solo corso con Atto 0 e Atto I; i due episodi provvisori servono esclusivamente a verificare ingresso, ripresa e passaggio fra atti. La home non offre un avvio del corso storico.

Eseguire dalla radice:

```sh
npm run build:laika
npm test
npm run serve
```

Aprire `/` per la home, `/play.html?game=laika` per il corso: si entra dalla pagina dell'atto I (sei unità; le prime tre giocabili). I laboratori dimostrativi restano su `/play.html?game=biblioteca` e analoghi; gli URL `/?game=...` vengono inoltrati preservando query e frammento.

- `course.json`: ordine degli atti, elenco dei file di domande, scene e simboli.
- `source/acts/`: atti sorgente. `questionRef` risolve un ID globale dalle banche domande; `stageId` riferisce le scene indicizzate.
- `source/stages/`: scene dichiarative del compositore esistente. Per ora nessuna scena di produzione.
- `questions/`: banche in formato runtime, con eventuali dati di redazione in `editorial`. Per ora vuote: nessuna domanda storica fittizia.
- `assets/`: simboli e futuri SVG sorgenti. Gli originali restano nei prototipi.
- `sources.json`: provenienza editoriale da compilare nelle fasi contenuti, senza sostituire il dossier delle fonti.
- `game.json`: file generato, mai autorità editoriale. Rigenerarlo dopo un conflitto.

Il build proietta i campi runtime dei contenitori, risolve i riferimenti e rimuove la chiave riservata `editorial` a ogni profondità. Mettere note, localizzazioni bibliografiche interne e motivazioni dei distrattori sotto tale chiave; `source` e `sources` runtime restano disponibili allo studente. Nessuna funzione o import di codice nei contenuti. I percorsi di input restano all'interno del pacchetto. Composizione, schema, binding e SVG usano `validatePack`: non esiste un validatore SVG LAIKA separato.

Due build producono gli stessi byte. Un riferimento mancante, un ID duplicato (anche di episodio fra atti), una domanda non risolta o uno schema invalido interrompono il build prima di riscrivere il manifest.

La fase successiva è P2: famiglia grafica e scena campione. Non espandere gli atti prima delle review previste dal piano.

## Scene della bottega

`course.json` dichiara `scene` (schede in `source/scene/`) e `tema` (predefinito `laika`). Il build le compone con la [bottega](../../bottega/README.md) e aggiunge al manifest `palette`, `patterns`, simboli e scenografie. Finché `scene` è vuoto il manifest resta identico.
