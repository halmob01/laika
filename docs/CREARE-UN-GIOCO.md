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

Nel registro `config.json` una voce può dichiarare `presentation: {"stylesheet":"./site/nome/theme.css","homeHref":"./"}`. Entrambi sono percorsi locali relativi canonici; niente URL esterni, traversal, query o frammenti. `stylesheet` deve finire in `.css`. L'assenza conserva il comportamento precedente. Il player applica il solo tema del pack aperto, oltre al CSS generico e agli eventuali token `game.theme` già supportati. Due campi opzionali: `homeLabel` (testo di al massimo 40 caratteri, sostituisce «Laboratori interattivi» nel ritorno alla home) e `standalone: true` (il gioco si apre da solo: nessun menu degli altri laboratori; `<html>` riceve l'attributo `data-standalone`). Il pannello porta `data-type` con il tipo dell'episodio, perché il tema possa adattare le etichette.

Un episodio narrativo con almeno due paragrafi (separati da una riga vuota) può dichiarare `display: "cards"`: il player lo mostra un paragrafo alla volta con «Indietro» e «Avanti», e «Continua» compare all'ultima card. Lo stato del gioco e il salvataggio non cambiano. Una scenografia può dichiarare `mobile: {center, zoom}` (dalla bottega: `telefono`); il player la espone al tema come variabili CSS `--stage-center` e `--stage-zoom` su `#stage`.

### Partita a turni (`turn_game`)

Un episodio `turn_game` è una partita di più turni dentro un solo episodio. Campi:

- `stageId`: la scenografia del tabellone; `places`: almeno due posti `{id, label, x, y, perToken, max?}`, con `x` e `y` da 0 a 1 sulla scena (il player li mostra come pulsanti sopra l'illustrazione) ed effetti numerici per ogni pedina;
- `tokens` e `tokenLabel`: quante pedine per turno e come si chiamano («giorni»);
- `rules` iniziali e per turno: `tokens`, `tokensDelta`, `min` (obblighi per posto), `places` (nuova etichetta o nuovi effetti di un posto), `upkeep` (consumi in più);
- `upkeep`: effetti applicati ogni turno; `luck`: imprevisti con `weight` e `yield` per posto (le probabilità sono mostrate prima di confermare);
- `control` facoltativo: se un obbligo non è rispettato, con probabilità `chance` (`base` + `factor` × metrica) si applicano `effects` e `perMissing` moltiplicato per le pedine mancanti;
- `crises`: `{id, when, text, effects, rules}`, ciascuna scatta una volta quando la condizione è vera;
- `turns`: `{label, cards?, rules?, preview?, event?}`. Le `cards` hanno `text` e facoltativi `title`, `kind` (`documented`, `simulation`, `source`: etichetta mostrata sulla card), `stageId` e `motionId` (la card è illustrata da quella scena); l'`event` è «chi bussa»: `{who, text, choices}`, ogni risposta con `text` ed effetti o con `chance` ed esiti `success`/`failure`, che possono cambiare le regole;
- `feedback`: testo finale.

#### Gestione (facoltativa)

Con questi campi la partita diventa una gestione: le pedine sono persone, alcuni posti sono lavori che restano, una risorsa si può investire e qualche anno c'è un mercato. Tutto è facoltativo e i giochi senza questi campi funzionano come prima.

- `workers`: al posto di `tokens`, da 1 a 8 persone `{id, label, strength, figure?}`. `strength` (da 1 a 5) moltiplica gli effetti del posto e conta per gli obblighi `min`; `strengthLabel` dice come si chiama («braccia»). `figure` è l'id di una figura della scena del tabellone: il player la sposta nel posto scelto (`stage.position`) e la riporta al punto di partenza quando resta senza posto. Le regole possono cambiare una persona con `workers: {id: {strength?, label?, away?}}`; `away: true` la toglie dalla partita. Chi lavorava in un posto ci resta l'anno dopo, se il posto c'è ancora.
- `places[]` accetta anche `when` (il posto compare solo se la condizione è vera), `short` (nome breve sul pulsante della scena) e `stand: {x, y}` (dove stanno le figure, se diverso dal pulsante).
- `projects`: lavori lunghi `{id, label, short?, text, x, y, stand?, work, cost?, when?, done}`. Si scelgono come un posto; ogni anno avanzano della forza messa; il `cost` (solo effetti negativi) si paga il primo anno; finito il lavoro si applicano `done.effects` e `done.rules`, chi ci lavorava torna libero e il lavoro resta segnato sulla scena.
- Nelle regole `boost: {posto: n}` si somma alla resa di un posto (0.2 = +20%, cumulabile) e `yearly` aggiunge effetti a ogni anno (cumulabili): così si scrivono le migliorie.
- `reserve`: `{from, label, text?, step, start, full, floor, places}`. Prima dell'anno il giocatore mette da parte una quantità di `from` (a passi di `step`); quella quantità si toglie e la resa dei `places` vale `floor + (1 - floor) × min(1, riserva / full)`. È la semina: più si mette da parte meno si mangia.
- `turns[].market`: `{who, text, offers}`. Dopo chi bussa si apre il mercato; ogni offerta `{id, label, text, when?, once?, effects, rules?}` si prende una volta per visita (`once`: una volta nella partita).
- Le risposte di chi bussa accettano `when`: se la condizione è falsa la risposta resta visibile ma non si può scegliere.
- `upkeepLabel`, `yearlyLabel`, `crisisLabel` e `control.label` danno il nome alle voci dell'esito: il player mostra, per ogni anno, da dove viene ogni variazione (`result.steps`) e poi il totale.

#### Capire il gioco: obiettivo, passi, verso degli indicatori, esito (facoltativi)

- `goal` (ogni episodio): una riga, al massimo 140 caratteri, mostrata sempre accanto alla scena («Obiettivo: …»). Dice perché si gioca, non come.
- `shows` (ogni episodio): gli id degli indicatori da mostrare in quell'episodio (al massimo cinque). Senza `shows` si vedono tutti quelli non `hidden`. Serve perché ogni unità mostri solo i propri.
- Nelle definizioni di `metrics` e `resources`, `good: "high" | "low"`: il player scrive il livello e il verso («basso · meglio basso») e colora la barra; il colore non porta mai da solo il significato.
- `phaseLabels`: nomi dei passi dell'anno nella barra in alto (`cards`, `place`, `result`, `event`, `market`), per esempio «Notizie», «La settimana», «L'anno», «Chi bussa», «La fiera». Si mostrano solo i passi presenti in quel turno.
- `verdicts`: `[{when?, tone: "good"|"neutral"|"bad", text}]`. Dopo l'anno vale il primo la cui condizione è vera: è la frase di giudizio in cima all'esito («Si mangia fino al raccolto»). Sotto, il perché in elenco; i numeri stanno in un «I numeri dell'anno» da aprire.
- `strengthOne`: il singolare di `strengthLabel` («braccio»), per scrivere «per ogni braccio» e «1 braccio».
- Card condizionate: `turns[].cards[].when`. La card si legge solo se all'inizio del turno la condizione è vera; servono a scrivere varianti del racconto (per esempio un passaggio di generazione quando qualcuno è stato mandato via).
- `turns[].effects`: effetti applicati all'inizio del turno, dopo aver scelto le card (per esempio azzerare un flag a ogni generazione). Con `rules.workers.{id}` (`strength`, `label`, `away`) si cambia chi c'è in casa.

Sul telefono, durante la partita, scena, obiettivo e indicatori restano fissi in alto mentre si sceglie sotto (tema LAIKA); i pulsanti sulla scena sono piccoli ma con un'area di tocco più grande.

Ordine di un anno: si pagano i lavori che cominciano e la riserva; si applica il mantenimento e si controllano le crisi (si può restare senza prima del raccolto); poi imprevisto e resa dei posti, rendite delle migliorie, avanzamento dei lavori, controllo degli obblighi e di nuovo le crisi.

Le mosse sono azioni `{type:"turn", step}` con `step` fra `card`, `back`, `place` (`placeId`, `delta` ±1), `assign` (`workerId`, `placeId`), `reserve` (`delta` ±1), `confirm`, `choose` (`choiceId`), `continue`, `buy` (`offerId`) e `leave`. Il caso dipende dal seme della sessione: il salvataggio (registro delle mosse) rigioca la stessa partita. Il player mostra una riga per metrica con la variazione netta. Il codice sta in `src/core/turns.js`; la prova neutra in `tests/turns.test.js`.

Un episodio può dichiarare `context: {"kind":"simulation","dateLabel":"1861","placeLabel":"Russia"}`. `kind` ammette `documented`, `simulation`, `source`, `assessment`; le etichette opzionali sono testo. Il cartiglio non cambia stato, punteggi o transizioni e non interpreta HTML.

`readProgress(game, storage)` in `src/storage/index.js` restituisce `status` uguale a `new`, `resumable`, `complete` o `incompatible`. Per una ripresa restituisce ID/titoli di atto/episodio e fase corrente. Legge e ricostruisce il ledger con `load`/`restore`; non scrive, inizializza o cancella salvataggi. La home non deve interpretare direttamente chiavi o JSON di localStorage.

LAIKA usa un [assemblatore di sorgenti separati](../games/laika/README.md), facoltativo per gli altri giochi. Il CLI di validazione controlla anche i contratti del registro prima di caricare i pacchetti.

## Unità dentro l'atto (opzionale)

Un atto può dichiarare `period` e `question` (una riga ciascuno) e `units`: tappe con una pagina propria. Se ci sono, il player mostra prima la **pagina dell'atto** (le unità in fila con il loro stato), poi la **pagina dell'unità** e solo dopo il gioco; a fine unità compare la **pagina di chiusura**. Senza `units` il corso funziona come prima.

Ogni unità: `id`, `title`, `period`, `question`, `summary`, `game` (che cosa farà il giocatore), `concepts` (fino a 8), `carries` (facoltativo: che cosa porta dall'unità precedente), `episodes` (id, contigui e nell'ordine dell'atto; ogni episodio sta in una sola unità) e `closing` con `did`, `fact` e `simulation`. Un'unità con `episodes: []` è una tappa non ancora giocabile: compare come «Più avanti» e può stare solo in coda. Lo stato (finita, in corso, più avanti) si ricava dall'episodio corrente: nessun dato nuovo nel salvataggio. Codice: `src/core/units.js` (funzioni pure), `src/shell/hub.js` (pagine), validazione in `src/core/schema.js`.

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
