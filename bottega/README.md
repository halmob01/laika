# Bottega — disegni, figure e movimenti riutilizzabili

La bottega separa due mestieri.

- **Disegno** (questa cartella): edifici, ambienti, mezzi, oggetti, la figura articolata con le sue pose, le formazioni di folla e un vocabolario di movimenti. È neutra: nessun fatto storico, nessun testo didattico, nessun colore fisso (solo token).
- **Regia** (`src/visual`, il motore): monta la scena, anima su un solo orologio, pausa/replay/skip, movimento ridotto, salvataggi. Non sa nulla di persone o palazzi.

Chi progetta un atto o un gioco scrive soltanto **schede scena**: file JSON che dicono *chi c'è, dove, e che cosa succede*. Non si disegna e non si scrivono tracce di animazione.

L'aspetto è quello degli studi originali in `prototypes/laika-studi-originali/`: i disegni sono generati eseguendo le loro stesse funzioni, e un test nel browser verifica che siano **identici al pixel** agli originali.

## Mappa dei file

| File | Che cosa contiene | Si modifica? |
|---|---|---|
| `catalogo.json` | Registro unico: ogni simbolo usabile, stato, epoca d'uso, fonte; elenco delle cose da disegnare; esempi | Sì, quando si aggiunge o si rivede una voce |
| `temi.json` | Token colore (`ink`, `paper`, `red`, …) e i temi che li traducono in colori (`studi`, `laika`, `neutro`) | Sì, per un nuovo progetto si aggiunge un tema |
| `generati/studi.json` | Simboli estratti dai kit originali | **No**: si rigenera con `npm run bottega:importa` |
| `figura/pose.js` | Pose e azioni (angoli), varianti, ruoli, corpi | Sì, per aggiungere pose o varianti |
| `figura/figura.js` | La figura articolata e gli oggetti impugnati | Raramente: nuovi abiti o oggetti in mano |
| `formazioni.js` | Disposizioni di folla | Raramente |
| `movimenti.js` | Le azioni (walk, gather, speak, …) | Solo per un'azione davvero nuova |
| `scena.js` | Compilatore scheda scena → motore | Solo per estendere il formato |
| `esempi/*.json` | Scene di prova che coprono tutte le azioni | Da usare come modello |
| `galleria.html` | Anteprima con il motore reale: scene, pose, catalogo, prova di una scheda incollata | — |
| `strumenti/` | Importatore dei kit, convertitore SVG, CLI `componi.js` | Solo per aggiungere un kit |
| `CONTRATTO-KIT.md` | Il testo da allegare quando si chiede a un modello di produrre un nuovo kit | — |

## Comandi

```sh
npm run serve                      # poi http://localhost:4173/bottega/galleria.html
npm run scena -- percorso/scena.json [altre.json] [--tema neutro]  # controlla e riassume (tema predefinito: neutro)
npm run bottega:importa            # rigenera generati/studi.json dai kit originali
npm run bottega:verifica           # controlla che studi.json sia aggiornato
npm test                           # tutto, comprese le regole della bottega
npm run test:browser               # anche il confronto al pixel con gli originali
```

## La scheda scena

Esempio minimo (vedi `esempi/` per scene complete):

```json
{
  "id": "corteo-1905",
  "etichetta": "Un corteo con una petizione attraversa una strada innevata.",
  "ruvido": true,
  "elementi": [
    { "id": "fondo", "simbolo": "ambiente-piazza", "x": 480, "y": 430, "scala": 1.8 },
    { "id": "terra", "simbolo": "suolo", "x": 480, "y": 430, "scala": 1.9 }
  ],
  "figure": [
    { "id": "guida", "x": 560, "y": 470, "scala": 1.5, "variante": "cappotto", "ruolo": "protagonista", "posa": "legge" },
    { "gruppo": "corteo", "formazione": { "tipo": "righe", "n": 12, "righe": 2, "x": 420, "y": 470, "passo": 48, "scala": 1.4, "varianti": ["cappotto", "scialle", "nessuna"] } }
  ],
  "sequenze": [
    {
      "id": "ingresso",
      "didascalia": "Il corteo avanza e si raccoglie attorno al documento.",
      "passi": [
        { "azione": "walk", "chi": "corteo", "da": "sinistra", "a": 0, "sfalsa": 120 },
        { "azione": "walk", "chi": "guida", "da": "sinistra", "a": 800 },
        { "azione": "camera", "a": 0, "durata": 8000, "inquadrature": [[0, 150, 600, 338], [0, 0, 960, 540]] }
      ],
      "battute": [{ "a": 0, "testo": "Il corteo si muove." }]
    }
  ],
  "ingresso": "ingresso"
}
```

### Campi della scena

| Campo | Obbligatorio | Significato |
|---|---|---|
| `id` | sì | minuscole, cifre, trattini; inizia con una lettera. È l'`stageId` usato dagli episodi |
| `etichetta` | sì | descrizione testuale della scena (accessibilità) |
| `viewBox` | no | area della scena, predefinita `[0, 0, 960, 540]` |
| `camera` | no | inquadratura finale `[x, y, w, h]`, predefinita tutta la scena |
| `sfondo` | no | token colore del fondo, predefinito `paper` |
| `ruvido` | no | tratto ruvido degli studi: `true` (quello dei personaggi), `"architettura-brutalista"`, `"palazzi-brutalisti"`, oppure assente |
| `elementi` | no | oggetti statici: `{id, simbolo, x, y, scala, flip, davanti}`. `simbolo` è un id del catalogo. `x,y` sono il **punto di appoggio a terra** (centro della base). `davanti: true` li disegna dopo le figure |
| `figure` | no | persone singole o gruppi (sotto) |
| `gruppi` | no | gruppi con nome scelti a mano: `{"oratore": ["comizio-1"]}` |
| `sequenze` | no | animazioni: `{id, didascalia, passi, battute}` |
| `ingresso` | no | sequenza che parte all'apertura della scena |

**Figura singola**: `{id, x, y, scala, variante, corpo, cappello, abito, accessorio, ruolo, posa, flip, oggetti}`. `x,y` sono i piedi. Valori ammessi:

- `posa`: `in_piedi`, `cammina_1`, `cammina_2`, `corre`, `braccia_alzate`, `gira`, `indica`, `saluta`, `parla`, `mani_fianchi`, `seduto`, `inginocchiato`, `a_terra`, e le azioni con oggetto `porta_bandiera`, `manifesta`, `lancia`, `sbarra`, `tiene_cartello`, `usa_fucile`, `spara`, `con_megafono`, `costruisce`, `lavora`, `legge`. L'oggetto dell'azione compare da solo.
- `variante`: `nessuna`, `donna`, `bambino`, `cappello`, `cappello_largo`, `cappotto`, `vestito`, `scialle`, `zaino`, `borsa`, `bastone`, `mantello`, `clero`. `corpo`, `cappello`, `abito`, `accessorio` sovrascrivono la variante.
- `ruolo`: `popolo` (nero), `protagonista` (rosso), `esercito` (azzurro), `partigiano` (fascia rossa).
- `flip: true`: la figura guarda a sinistra. **Senza flip guarda a destra.** Chi cammina verso sinistra deve avere `flip: true`.
- `oggetti`: oggetti in più agganciati alla mano, scelti fra quelli di `figura/figura.js` (es. `borsa`, `bandiera`).

Altezza indicativa: una figura in piedi è alta circa 90 unità × `scala` (con `scala: 1.5` circa 135 su 540).

**Gruppo**: `{gruppo, formazione: {...}, ruolo, flip}`. Le figure si chiamano `<gruppo>-1`, `<gruppo>-2`, … in ordine di disegno. Formazioni:

| `tipo` | Parametri | Note |
|---|---|---|
| `statica`, `marcia`, `carica`, `barricata`, `discorso`, `scontro` | `x, y, scala` | Le sei folle dello studio, identiche. `barricata` include il muro, `discorso` il podio. `y` è la linea dei piedi della prima fila |
| `fila` | `n, passo, x, y, scala, varianti, pose, ruoli, flip` | una riga centrata su `x` |
| `righe` | come `fila` + `righe, perRiga, profondita` | righe dalla più lontana (più piccola) alla più vicina |
| `gruppo` | come `fila` + `raggio, seme` | raggruppamento naturale, riproducibile con `seme` |
| `coda` | come `fila` + `direzione` (`destra` predefinita) | la prima figura è la testa della coda |

`varianti`, `pose`, `ruoli` sono elenchi applicati a turno alle figure.

### Le azioni

Regola fondamentale: **la composizione dichiarata è il fotogramma finale**. Ogni azione racconta come ci si arriva, e alla fine tutto coincide con quanto scritto in `elementi` e `figure`. Per questo il salto al finale, il ricaricamento e il movimento ridotto mostrano sempre la stessa cosa.

Parametri comuni: `chi` (id di figura, elemento o gruppo, oppure elenco), `a` (inizio in ms), `durata` (ms), `sfalsa` (ritardo fra un membro e il successivo, ms).

| Azione (sinonimo) | Che cosa fa | Parametri propri |
|---|---|---|
| `walk` (`cammina`) | arriva camminando nella posizione dichiarata | `da`: `sinistra` / `destra` (da fuori scena), `alto`, `basso`, oppure `[dx, dy]`; `distanza` |
| `march` (`marcia`) | come walk, passo più ampio e serrato | come walk |
| `gather` (`raduna`) | partono sparsi e convergono nella composizione | `fattore` (1.8), `centro` |
| `disperse` (`disperdi`) | partono stretti e si allargano nella composizione | `fattore` (0.3) |
| `speak` (`parla`) | gesto del braccio e della testa | `cicli` |
| `listen` (`ascolta`) | cenni del capo e leggera inclinazione | `cicli` |
| `raise` (`alza`) | passa da una posa alla posa dichiarata | `da` (predefinita `in_piedi`) |
| `lower` (`abbassa`) | come raise, partendo da `braccia_alzate` | `da` |
| `pose` (`posa`) | transizione generica fra due pose | `da` (obbligatoria) |
| `work` (`lavora`) | colpo ripetuto del braccio | `cicli` |
| `repeat` (`ripeti`) | oscillazione di parti con nome, di figure o elementi | `parti`: `{"arm-near": -30}` oppure `{"telo": {"skewY": 5}}`, `cicli` |
| `queue` (`coda`) | la coda si forma: arrivano uno dopo l'altro | `da`, `distanza` (200), `sfalsa` (500) |
| `advance` (`avanza`) | la coda avanza di un posto | `passo` (34) |
| `confront` (`fronteggia`) | due gruppi si avvicinano fino alla composizione | `chi: [A, B]`, `distanza` (120) |
| `retreat` (`arretra`) | due gruppi si allontanano fino alla composizione | `chi: [A, B]`, `distanza` |
| `wave` (`sventola`) | sventolano le bandiere impugnate | `cicli` |
| `transfer` (`passa`) | un elemento arriva da un punto con un arco | `da: [x, y]`, `arco` |
| `replace` (`sostituisci`) | uno sparisce, l'altro compare (passaggio di potere, cambio di controllo) | `esce`, `entra` |
| `reveal` (`rivela`) | comparsa | `modo`: `dissolvenza`, `sale`, `cresce` |
| `transform` (`trasforma`) | il vecchio si dissolve, il nuovo cresce al suo posto | `da`, `verso` |
| `camera` | inquadrature in successione (pan, zoom, pausa ripetendo lo stesso rettangolo) | `inquadrature: [[x,y,w,h], ...]`, `tempi` (0–1); l'ultima deve essere la `camera` della scena |

Gli elementi indicati in `esce` (replace) e `da` (transform) diventano invisibili nella composizione finale.

### Regole che evitano gli errori più comuni

1. **Una scena, una composizione finale.** Raduno e dispersione delle stesse persone sono due scene (vedi `esempi/raduno.json` e `esempi/dispersione.json`). Per cambiare stato dentro la stessa scena si usano `replace` o `transform`.
2. **Due passi non possono muovere la stessa cosa nello stesso momento**: per esempio `walk` e `gather` sullo stesso gruppo sovrapposti. Il compilatore indica i due passi e l'intervallo; sfalsare con `a` oppure dividere il gruppo.
3. **La camera finisce sull'inquadratura finale della scena.**
4. **Direzione**: chi entra da destra deve avere `flip: true`.
5. **Epoca**: prima di usare un simbolo leggere il suo campo `epoca` nel catalogo. Esempio: i palazzi brutalisti non esistono prima del 1945, quindi non vanno nel 1861 o nel 1905.
6. **Niente colori esadecimali nelle scene**: solo token (`paper`, `ink`, `red`, `blue`, …). Il tema decide i colori.
7. **Movimenti al servizio della storia.** Pochi movimenti che mostrano una causa e una conseguenza; nessun movimento continuo decorativo. Ingresso 6–12 s, risposte 1–4 s.
8. **Limiti del motore**: 1200 layer e 700 tracce per scena. `npm run scena` stampa i conteggi; una figura articolata pesa circa 30-35 layer. Folle grandi: poche figure articolate in primo piano (20-30 al massimo) e, dietro, `luogo-folla`: una massa di sagome minuscole che è un solo disegno. Per farla avanzare con il corteo si usa `transfer` con `arco: 0` e gli stessi tempi del `walk`.
10. **Scala dei luoghi grandi** (`famiglia: luoghi`, linea di terra 400): una figura a scala 0.2 è alta circa 23 unità; `luogo-folla` a scala 0.55-0.6 ha la stessa altezza. Per «figure minuscole in scene grandiose» si tengono le figure fra 0.15 e 0.3 e si lasciano spazi vuoti (cielo, piazza, ghiaccio): la grandezza la dà il vuoto, non il numero di oggetti. Il piano stradale di `luogo-ponte` è 88 unità sopra la sua base.
9. **Non modificare** `generati/studi.json` né gli originali in `prototypes/`.

## Procedura: una scena per un atto o un gioco

1. Dal brief dell'episodio, scrivere in due righe *che cosa deve capire lo studente guardando la scena* e qual è la composizione finale.
2. Scegliere i pezzi nel catalogo (`catalogo.json` o scheda Catalogo della galleria), controllando `stato` ed `epoca`. Se manca qualcosa, vedere la sezione successiva: non improvvisare un disegno dentro la scena.
3. Scrivere la scheda in `games/<gioco>/source/scene/<id>.json`, partendo dall'esempio più simile in `esempi/`.
4. `npm run scena -- games/<gioco>/source/scene/<id>.json` finché non ci sono errori.
5. Guardarla: galleria → «Prova una scena» (incollare il JSON), oppure build del gioco e player. Controllare il primo fotogramma, la metà e il finale, e il movimento ridotto.
6. Collegarla: in LAIKA aggiungere il file a `scene` in `games/laika/course.json` e usare l'`id` della scena come `stageId` dell'episodio, la sequenza come `motionId`. Poi `npm run build:laika` e `npm test`.

## Procedura: aggiungere disegni

**Una posa nuova**: aggiungere una voce in fondo a `POSE` in `figura/pose.js`, con tutti gli angoli. Rig, intervalli e galleria si aggiornano da soli. Verificare nella scheda Figure della galleria.

**Un oggetto in mano nuovo**: aggiungere una voce alla tabella `P` in `figura/figura.js`, con `presa` (`hand-near`, `grip-near`, `wrist-near`, `forearm-far`, `slot-front`, `slot-back`) e markup con colori a token. Usarlo con `oggetti` nella figura o come `prop` di una posa.

Esempi già svolti: `prototypes/kit-luoghi-monumentali/` (luoghi di grande scala per figure minuscole, linea di terra 400, tratto disegnato a mano: le funzioni `linea`, `riga`, `bordo`, `macchia`, `tratteggio` e il motivo `grana` si possono copiare in un kit nuovo) e `prototypes/kit-infrastrutture-atmosfera/` (lampione, binari, ciminiera, filo spinato, fumo, neve, pioggia), e `prototypes/kit-ambienti-primo-novecento/` (strada, panetteria, interni di isba e di ufficio, caserma, sala a colonne, trincea: lo stesso tratto a mano, a scala umana; le note del catalogo indicano la scala delle figure per ciascun ambiente). Un kit senza motivi né ruvidità non ha bisogno della chiave `definizioni` nella voce `KIT`. Gli elementi atmosferici sono riquadri di 200 x 150 con la base sulla linea di terra e un gruppo con `id` (`fiocchi`, `gocce`, `sbuffo-1`…) da muovere.

**Una famiglia nuova (edifici, mezzi, oggetti, ambienti)**: chiedere il kit a un modello allegando `CONTRATTO-KIT.md`. Poi:

1. salvare l'HTML ricevuto, **senza modificarlo**, in `prototypes/<nome-kit>/`;
2. aggiungere una voce all'elenco `KIT` in `strumenti/importa-studi.js`: file, costante palette, token, definizioni, famiglie;
3. `npm run bottega:importa`. Se un costrutto non è supportato l'errore lo dice: si corregge il kit, non l'importatore;
4. aggiungere le voci a `catalogo.json` con stato ed epoca. Il test fallisce finché catalogo e simboli non coincidono;
5. `npm run test:browser`: il confronto al pixel con l'originale è automatico per ogni simbolo importato;
6. aggiornare l'elenco `da_fare` del catalogo.

**Palette del kit e confronto al pixel**: la costante colori di un kit usa i valori del tema `studi`, perché il test confronta il disegno originale con quello importato e reso con quel tema. I colori di un progetto stanno solo nel suo tema.

**Un nuovo progetto (non LAIKA)**: aggiungere un tema in `temi.json` con tutti i token. Disegni, figure e movimenti restano gli stessi.

## Procedura: il hero di una home di progetto

1. Schede scena in `site/<progetto>/scene/` (stesse regole delle scene degli atti).
2. `site/<progetto>/hero.config.json` con `scene` (ordine dei quadri), `tema` e `uscita` (di solito `hero.json`). Esempio: `site/laika/hero.config.json`.
3. `npm run build:home -- site/<progetto>` scrive il pacchetto con i soli simboli usati; `--check` verifica che sia aggiornato. Lo script è generico: non vi si scrivono nomi di scene o temi.
4. La pagina monta il pacchetto con `composePack` e `createStage` del motore (vedi `site/laika/home.js`): una sola scena attiva, pausa fuori schermo, quadro finale con movimento ridotto.

## Che cosa la bottega non fa (ancora)

- Non deforma i tracciati (niente morphing): i cambiamenti di forma si fanno con parti articolate o con `replace` / `transform`.
- Non calcola il contatto preciso del piede: il passo è proporzionato alla distanza, non vincolato al suolo.
- L'abbassamento del corpo (`yOff`, es. seduto) segue la regola dello studio: è in unità di scena e non cresce con la scala della figura.
- La figura è quella degli studi (arti a capsula, testa staccata). Le sagome organiche della home v2 (`prototypes/laika-kit/figure/`) potranno diventare una pelle alternativa sullo stesso scheletro: le giunture restano le stesse, quindi le scene non cambiano.
- Gli elementi importati sono statici, salvo le parti con `id` dichiarate dai kit futuri.
