# Come creare un nuovo gioco dal kit

## Avvio

Con Node 22+ e Python 3 disponibili:

```sh
npm test
npm run serve
```

Aprire `http://localhost:4173/`. Nessuna compilazione, account, API o dipendenza runtime. Servire via HTTP: `file://` non supporta il caricamento dei moduli e dei JSON. Il repository è pubblicabile come sito statico su GitHub Pages; questa PR non pubblica né configura Pages.

Per i test nel browser:

```sh
npm install
npx playwright install chromium
npm run test:browser
```

## Cambiare solo il pacchetto

1. Eseguire `npm run create:game -- nuovo-gioco "Titolo del gioco"`. Crea il modello minimo e registra il pacchetto; rifiuta nomi esistenti. In alternativa copiare una demo per partire da un esempio articolato.
2. Cambiare `id`, `title`, `contentVersion`, tema, attori, testi, episodi e scenografia nel JSON. Gli ID sono stabili, minuscoli, con trattini o underscore.
3. Il comando registra già il percorso in `config.json`; se si copia a mano, registrarlo. Impostare `defaultGame` se necessario. Si può distribuire una sola voce eliminando le altre: nessun modulo importa uno specifico pacchetto.
4. Eseguire `npm test` e `npm run test:browser`: i pacchetti vengono scoperti da `config.json`. Per uso programmatico chiamare `const game = validatePack(raw)` e usare il risultato espanso. Gli errori degli episodi indicano atto ed episodio; il comando aggiunge il percorso del file.
5. Controllare fonti, alternative, prerequisiti e qualità didattica. Le demo sono fixture didattiche fittizie, non un corso già validato.

Non servono modifiche in `src` per cambiare tema, contenuti, quantità e limiti, attori, ruoli, effetti immediati/differiti, rami, SVG e domande a scelta singola.

## Contratto v1

Il manifest ha `schemaVersion:1`, un `contentVersion` indipendente e `acts`, `stages`, `exposureFlags`. Ogni atto dichiara:

- `actors`: ID dei soggetti; `roles`: ID, etichetta, `actorId`, `mandate`.
- `metrics`, `resources`, `relations`: definizioni `{id,label,min,max,start}`; una relazione include `from` e `to`. Nessun limite 0–100 imposto dal motore. `hidden:true` nasconde una metrica alla UI.
- `flags`: elenco di ID booleani, inizializzati a false.
- `episodes`: scene ordinate, con ID, `type`, `title`, `text`, `roleId`, `stageId` opzionale.
- `reconciliation`: confronto esplicito alla chiusura dell'atto; lo stato del successivo viene creato dai suoi valori `start`.

Tipi disponibili:

| Tipo | Input | Quando è completato |
|---|---|---|
| narrative | advance | lettura confermata con Continua |
| choice | select + choiceId | una scelta consentita |
| resource_allocation | allocate + allocations | tutte le unità del budget distribuite entro i limiti |
| role_crisis | view_role / select | il cambio di ruolo non avanza il turno; la decisione sì |
| source_comparison | inspect_source / select | tutte le fonti aperte e confronto svolto |
| assessment | answer + answerId | risposta su conoscenze già affrontate |

Le scelte hanno `id`, `label`, `feedback`, `effects`, `when` opzionale e `roles` opzionale. Deve esistere una scelta senza condizione per ciascun ruolo ammesso, così da evitare blocchi. `resource_allocation` dichiara `budget`, `buckets[{id,label,max,perUnit}]` e feedback. L'allocazione è in unità intere non negative; il motore calcola gli effetti dai coefficienti del pacchetto, mai dagli effetti inviati dalla UI.

### Condizioni e mutazioni

```json
{"op":"gte","kind":"metric","id":"access","value":40}
```

Operatori: `eq`, `gte`, `lte`, `gt`, `lt`; combinazioni `all`/`any` con `items`, `not` con `item`; `flag` con `id,value`; `event` con ID di un episodio di simulazione risolto. Sono confronti dichiarativi, non espressioni JavaScript. Nessun path arbitrario.

```json
[{"kind":"metric","id":"access","delta":10},
 {"kind":"flag","id":"prepared","value":true}]
```

`kind` numerici: metric, resource, relation. `flag` imposta/azzera un booleano. Il risultato riporta valore precedente, finale e delta realmente applicato dopo il clamp. Mutazioni in ordine di dichiarazione; un calo seguito da un aumento vicino a un limite non viene semplificato algebricamente.

### Bivi e tempo

`branches:[{when,to}]`: primo ramo vero; altrimenti `next`, oppure episodio successivo. `to:"end"` termina l'atto. Tutte le destinazioni devono essere successive: nessun ciclo. La validazione controlla raggiungibilità strutturale e intersezione dei prerequisiti lungo tutti i percorsi; non cerca di risolvere matematicamente ogni combinazione di condizioni.

Una decisione/allocazione/confronto risolto incrementa `turn`. Lettura, navigazione, cambio di ruolo, risposta formativa e replay visuale non lo incrementano. Un effetto differito scatta su uno di due trigger:

```json
{"id":"benefit","episodeId":"allocation","expiresAfterTurns":2,
 "onExit":"discard","explanation":"La preparazione facilita il servizio.",
 "effects":[{"kind":"metric","id":"access","delta":20}]}
```

In alternativa usare `afterTurns:1` al posto di `episodeId`. Una condizione `when` falsa resta in attesa fino alla scadenza, valutata alle successive transizioni di simulazione/ingressi. La finestra parte alla prima maturazione del trigger; il limite è inclusivo. Gli effetti si valutano nell'ordine della coda (non si promette una risoluzione a punto fisso). Ogni effetto ha una causa derivata dal motore, viene applicato al massimo una volta e viene scartato con traccia se si chiude l'atto. Gli effetti non maturano con il tempo reale.

### Esposizione e verifiche

`exposes` viene acquisito quando si prosegue dopo un episodio completato. `viewedSources` registra l'apertura, `processedSources` il confronto: aprire una fonte non basta per un quesito sul confronto. Ogni domanda richiede `requiredExposureFlags`, obiettivi, provenienza e motivazione. Il validatore rifiuta domande i cui prerequisiti non siano garantiti su tutti i rami. Il runtime li controlla nuovamente.

Le risposte sono rimescolate con seed persistente e ID del quesito: la posizione resta stabile dopo refresh. Il punteggio 0–100 compare soltanto nel riepilogo della demo e riguarda la comprensione. Nessuna metrica simulata contribuisce al punteggio. La modalità sommativa del futuro corso non è stata decisa.

### Scenografie

Ogni `stage` contiene layer con ID, tag SVG ammesso e attributi verificati. `bindings` collega un attributo numerico a `kind,id,scale,offset`. `intro` definisce valori iniziali visuali; `duration` è in millisecondi. Una scena può spiegare il mapping con `visualExplanation`.

Il controller conserva i nodi fra episodi che usano la stessa scenografia, interpola geometrie e opacità, gestisce replay, interruzione, skip e reduced-motion. Al caricamento di un salvataggio disegna direttamente il finale. Nessun SVG arbitrario, script, handler o URL esterno è accettato. Questa prima versione non interpola tracciati `d`, supporta timeline multitraccia ma non ha editor visuale; si possono comporre scene usando forme e binding numerici.

## API ed estensioni

`runner`: `newSession`, `currentScene`, `transition`, `select`, `advance`, `recap`, `replay`. `transition` restituisce `{nextState,appliedChanges,events,feedback}` e non modifica l'input. La sessione è un valore runtime affidabile; un JSON esterno deve sempre passare da `storage.restore`.

`storage`: `exportSave`, `restore`, `load`, `save`, `storageKey`. `restore` restituisce `{ok,state}` oppure `{ok:false,error}`. Conserva il backup incompatibile: niente reset silenziosi, migrazioni implicite o sincronizzazione cloud. Le versioni differenti richiedono una migrazione esplicita, da implementare con test quando sarà necessaria. Non è un registro antifrode.

Il motore originale è preservato in `src/core/legacy.cjs` con i test originali: compatibilità della sua API pura, non promessa di compatibilità automatica tra la vecchia UI e il nuovo manifest. Le fixture delle vecchie storie sono solo nei test, non vengono caricate dal sito.

Per una nuova meccanica (rete di potere, voto di assemblea, mappa interattiva) occorre codice generico: definire il payload, aggiungere la validazione in schema, una nuova azione pura nel core, registrare il renderer con `registerInteraction(type, render)` e aggiungere test. La shell non deve conoscere il titolo del gioco. Un semplice nuovo aspetto della stessa interazione richiede soltanto un renderer registrato e dati compatibili; tipi semantici nuovi richiedono anche core/validator, non basta registrare un pulsante.

## Aggiornamento motion

Le animazioni sono parte del contratto stabile del kit. Vedere [MOTION.md](MOTION.md) per gruppi annidati, sequenze, scelta/esito, pausa e vincoli di ripristino. `npm run validate` legge tutti i pacchetti di `config.json`: aggiungere un gioco non richiede modificare lo script. La stessa `validatePack` viene eseguita nel browser.

## Presentazione e contesto opzionali (P1)

Nel registro `config.json` una voce può dichiarare `presentation: {"stylesheet":"./site/nome/theme.css","homeHref":"./"}`. Entrambi sono percorsi locali relativi canonici; niente URL esterni, traversal, query o frammenti. `stylesheet` deve finire in `.css`. L'assenza conserva il comportamento precedente. Il player applica il solo tema del pack aperto, oltre al CSS generico e agli eventuali token `game.theme` già supportati.

Un episodio può dichiarare `context: {"kind":"simulation","dateLabel":"1861","placeLabel":"Russia"}`. `kind` ammette `documented`, `simulation`, `source`, `assessment`; le etichette opzionali sono testo. Il cartiglio non cambia stato, punteggi o transizioni e non interpreta HTML.

`readProgress(game, storage)` in `src/storage/index.js` restituisce `status` uguale a `new`, `resumable`, `complete` o `incompatible`. Per una ripresa restituisce ID/titoli di atto/episodio e fase corrente. Legge e ricostruisce il ledger con `load`/`restore`; non scrive, inizializza o cancella salvataggi. La home non deve interpretare direttamente chiavi o JSON di localStorage.

LAIKA usa un [assemblatore di sorgenti separati](../games/laika/README.md), facoltativo per gli altri giochi. Il CLI di validazione controlla anche i contratti del registro prima di caricare i pacchetti.

## Scene con la bottega

Un gioco può descrivere le scenografie con schede scena invece di scrivere layer e tracce: vedere [bottega/README.md](../bottega/README.md). `node bottega/strumenti/componi.js scene... --out frammento.json` produce `palette`, `patterns`, `symbols` e `stages` da unire al manifest; LAIKA lo fa nel suo build. Per un progetto con un'altra identità basta aggiungere un tema in `bottega/temi.json`.

## Dove sta ogni cosa (riuso del kit)

Il kit si riusa perché ogni parte vive in un livello diverso e i livelli dipendono solo verso il basso.

| Livello | Cartella | Contiene | Non contiene |
|---|---|---|---|
| Motore | `src/` | runner, stage, coreografia, storage, validazione | nomi, fatti, disegni o colori di un progetto |
| Bottega | `bottega/` | disegni a token, figura articolata, formazioni, azioni, compilatore, temi | testi storici, scene di un progetto |
| Script | `scripts/` | build generici (`build-home.js`, `create-game.js`, `validate-games.js`) e build del singolo corso (`build-laika.js`) | scene o temi scritti nel codice dei build generici |
| Contenuti | `games/<gioco>/` | corso, episodi, domande, fonti, schede scena degli atti | CSS della home |
| Sito | `site/<progetto>/` | home, tema, font, `hero.config.json`, schede scena del hero | logica del gioco |

## Una home per un nuovo progetto

1. Copiare la struttura di `site/laika/` in `site/<progetto>/`: `home.css` (palette e tipografia del progetto), `home.js` (monta il hero e legge i progressi in sola lettura), `scene/`, `hero.config.json`.
2. Aggiungere il tema del progetto in `bottega/temi.json` e indicarlo in `hero.config.json`.
3. `npm run build:home -- site/<progetto>`; poi `npm test`.
4. La pagina usa solo API pubbliche: `composePack`, `createStage`, `validateRegistry`, `validatePack`, `readProgress`. Nessun accesso diretto a chiavi di `localStorage`.
