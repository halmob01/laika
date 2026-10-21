# Animazioni: requisito del kit, stile separato

Il docente ha confermato che il sito deve essere animato, anche sensibilmente più ricco della base Feudo, mantenendo forme semplici. Il lavoro sullo stile delle illustrazioni procede separatamente: le demo non fissano la direzione grafica del corso russo.

## Implementato

- Stage SVG persistente con gruppi annidati e ID semantici.
- Timeline dichiarative con tracce simultanee, ritardi, segmenti successivi e tre curve di movimento.
- Traslazione X/Y, rotazione, scala, opacità e geometria numerica.
- Sequenze di ingresso episodio e sequenze specifiche per scelta/esito.
- Binding dei valori simulati animati insieme alle sequenze narrative.
- Pausa/ripresa, replay, skip, interruzione e pausa quando la pagina passa in background.
- Movimento ridotto: finale immediato e stessa spiegazione testuale.
- Ricaricamento: nessuna ripetizione forzata del movimento; stato finale ricostruito.
- Transizioni sobrie dei testi e dei controlli, disabilitate con reduced-motion.

Non dipende da una libreria runtime: la timeline è piccola, controllabile e testata. GSAP resta possibile qualora serva per capacità aggiuntive; la sua assenza non è un vincolo artistico.

## Contratto di authoring

`layer.parent` identifica un gruppo già dichiarato. I gruppi permettono di muovere un personaggio o un edificio con tutte le sue parti.

Uno stage può dichiarare:

```json
{"introSequence":"opening","sequences":[{
  "id":"opening","caption":"Le persone raggiungono il servizio.",
  "tracks":[{"layer":"visitor","attribute":"translateX",
    "from":-90,"to":0,"at":600,"duration":1400,"ease":"smooth"}]
}]}
```

Le unità temporali sono millisecondi. `ease`: `linear`, `smooth`, `out`. Segmenti sulla stessa proprietà devono essere ordinati e non sovrapporsi. Limite per sequenza 12 secondi, 150 tracce; nessun loop obbligatorio o decorativo infinito.

`episode.motionId` seleziona l'ingresso narrativo; `choice.motionId` seleziona la sequenza dell'esito; `episode.resultMotionId` è disponibile per l'allocazione. Tutto resta nel game pack. `validatePack` e `npm run validate` controllano riferimenti e sequenze su tutti i giochi registrati in `config.json`.

### Stato e animazione

Le proprietà legate a metriche/risorse/relazioni sono riservate ai binding: una timeline non può sovrascriverle. Le altre tracce devono terminare nella posa statica dichiarata dal layer (trasformazioni neutre se assenti), così skip e reload producono la stessa informazione. Per un cambiamento persistente si usa un binding o una nuova scenografia, non uno stato nascosto dentro l'animazione.

Il rendering non invia azioni di gioco. Pausa, replay, skip e avanzamento dei frame non fanno maturare effetti o assegnare punti. Le sequenze illustrano processi; non simulano nuove decisioni.

## Demo tecnica

Ambiente con scaffali, materiali, banco, ingresso e figure geometriche. Quattro sequenze: apertura, preparazione/trasferimento, accesso al servizio, confronto tra persone. Due pacchetti usano lo stesso renderer e cambiano colori, testi e dati. È materiale dimostrativo; non costituisce approvazione dello stile finale.

## Limiti

Niente morphing dei path, editor visuale, audio o simulazione fisica. Sono possibili illustrazioni articolate componendo path statici e gruppi animati. Safari/iPhone reale rimangono una verifica manuale da fare; Chromium touch emulato non li sostituisce.

## Composizione riusabile

`validatePack(raw)` restituisce una copia espansa del pacchetto: usare il valore restituito per runner e renderer. I manifest già espansi restano validi. `symbols` appartiene al pacchetto e contiene disegni locali, senza fissare una libreria stilistica nel motore:

```json
{"symbols":[{"id":"card","layers":[{"id":"sheet","tag":"rect","attrs":{"x":-40,"y":-30,"width":80,"height":60,"fill":"#ffffff"}}]}]}
```

Una scenografia può riusare quel simbolo più volte:

```json
{"components":[{"id":"left","symbol":"card","pose":{"translateX":180,"translateY":180}},{"id":"right","symbol":"card","pose":{"translateX":460,"translateY":180}}]}
```

L'istanza crea un gruppo; i figli diventano `left-sheet`, `right-sheet`. I parent interni vengono risolti nello stesso namespace. `pose` supporta traslazioni, rotazione e scala; vale anche sui normali layer e definisce la posa statica ripristinabile. Per scalare intorno al centro desiderato, disegnare il simbolo attorno all'origine locale. Le componenti vengono aggiunte dopo i layer espliciti, nell'ordine dichiarato.

Le sequenze ammettono `presets`, espansi nelle normali tracce validate:

| Tipo | Parametri specifici | Risultato |
|---|---|---|
| `arrive` | `attribute`: translateX/Y, `distance` | Dalla posizione relativa alla posa finale |
| `reveal` | nessuno | Opacità da 0 al valore statico |
| `excursion` | `attribute`, `amount`, `hold` facoltativo | Spostamento e ritorno alla posa iniziale |
| `emphasis` | `attribute`: scale/opacity, `amount`, `hold` | Evidenziazione e ritorno |

Ogni preset richiede `layer` e accetta `at` (default 0), `duration` (700 ms), `ease` (smooth). Per andata/ritorno, duration è il tempo dei due movimenti, esclusa l'eventuale pausa hold. Esempio:

```json
{"id":"enter","caption":"I documenti vengono affiancati.","presets":[{"type":"arrive","layer":"right","attribute":"translateY","distance":100,"duration":900}]}
```

Le tracce esplicite precedono quelle generate: sulla stessa proprietà vanno mantenute in ordine cronologico senza sovrapposizioni. Tutti i limiti e il divieto di sovrascrivere i binding restano attivi. I preset possono animare qualunque disegno compatibile; la demo usa semplici documenti, sostituibili senza cambiare il controller.

## Evoluzione editoriale — review indipendente, 19 ottobre 2026

**Stato: proposta in PR, da rivedere visivamente; nessun merge autorizzato per questa evoluzione.** Il passaggio dei test dimostra proprietà tecniche, non qualità artistica. I limiti della sezione precedente descrivono la versione già integrata; i valori aggiornati sono sotto.

### Materiali realmente esaminati

- Le quattro tavole `references/laika/*.webp`, integrate con PR #3: cronologia, vita quotidiana, tragedie, tappe della rivoluzione. Osservate visivamente, non soltanto lette le descrizioni.
- `docs/BRAND-DESIGN.md` e il codice SVG del prototipo `prototypes/laika-home/index.html`.
- SVG di lavoro `madrepatria_tavola_svg_v8.svg` fornito in un'altra conversazione: esaminata la struttura (gruppi monumento/edifici, pattern, clipping). Non è adatto a rappresentare una piazza rivoluzionaria e non viene ridisegnato o inserito nella demo.

Le tavole suggeriscono una regia per masse: bande orizzontali di persone, vuoti ampi, architetture azzurre, nero dominante nei gesti, rosso selettivo. Alcune immagini hanno anatomie filiformi e dettagli più fitti del target; prevale l'indicazione dell'autore di usare sagome **piene e ulteriormente semplificate**. Le immagini sono riferimenti compositivi, non prove storiche.

Il prototipo è un punto di partenza: sagome regolari e identiche, scenografie quasi fisse e loop sul disco/bandiere non dimostrano ancora il potenziale narrativo. Non ne trasferiamo i loop CSS nel motore. La demo conserva le forme già disponibili ma cambia disposizione, tempi, articolazione e inquadratura. La ruvidità del tratto definitivo resta aperta: non dichiariamo validato lo stile.

### Giudizio sull'architettura precedente

Positivi: core puro; DOM persistente; dati separati; un solo clock; ripristino verificabile. Limiti concreti: due estremi per traccia, moltiplicazione manuale dei passi per ogni figura, nessun pivot esplicito, viewport fissa, mancanza di ritagli, trasformazione riscritta più volte nello stesso frame. Il vincolo della posa finale statica è utile e viene mantenuto: una scena narrativa può evolvere fra molte pose, ma alla fine coincide con la composizione ripristinabile.

### Tre strumenti compositivi

1. **Coreografie:** gruppi semantici di target, fotogrammi chiave, proprietà relative alla posa statica, sottoelementi `part`, sfasamento `stagger` e ripetizioni finite. Passo, gesti, afflusso, raggruppamento o dispersione sono configurazioni degli stessi strumenti; nessun simulatore di folla nel core.
2. **Regia:** `shots` dichiara rettangoli d'inquadratura nel sistema di coordinate della scena. Il compilatore produce scala e traslazione su un gruppo scelto; il fit conserva le proporzioni. Elementi esterni al gruppo restano fermi. Non c'è camera 3D né parallasse automatica.
3. **Rivelazione:** clipPath locale con forme validate e animabili. Permette finestre, tendine e apparizioni di masse senza introdurre immagini raster o filtri costosi. Solo riferimenti interni generati dal renderer, nessun URL dal contenuto.

Pivot locali e skew permettono arti e bandiere senza morphing dei path. Le didascalie `beats` segnano i passaggi narrativi sullo stesso clock. Un metodo `seek(ms)` consente di esplorare le pose, anche all'indietro, senza inviare azioni di gioco. Riprendere dopo seek prosegue dal punto scelto; reduced motion va sempre alla composizione finale.

### Contratto dichiarativo

```json
{
  "groups":{"people":["person-a","person-b"]},
  "sequences":[{
    "id":"gather", "caption":"Le persone occupano la piazza.",
    "clips":[{
      "group":"people", "part":"leg-left", "relative":true,
      "at":0, "duration":650, "iterations":8, "stagger":80,
      "frames":[
        {"offset":0,"values":{"rotate":0}},
        {"offset":0.5,"values":{"rotate":18}},
        {"offset":1,"values":{"rotate":0}}
      ]
    }],
    "shots":[{
      "layer":"world", "at":0, "duration":6000,
      "frames":[
        {"offset":0,"rect":[0,0,960,540]},
        {"offset":0.5,"rect":[200,180,640,360]},
        {"offset":1,"rect":[0,0,960,540]}
      ]
    }]
  }]
}
```

Tutti i fotogrammi di un clip dichiarano le stesse proprietà; offset strettamente crescenti da 0 a 1. `relative` somma valori alla posa statica, non al frame precedente. Un clip può usare `targets` espliciti invece di `group`. `part` risolve l'ID composto dell'istanza (`person-a-leg-left`). Ripetizioni maggiori di una devono chiudersi sulla stessa posa. `hold` è un easing opzionale per montaggio a scatti; gli altri easing restano linear/smooth/out. `shots` applica il rettangolo alle coordinate locali del gruppo: mantenerne pivot neutro per una camera convenzionale.

Le tracce esplicite, i vecchi preset, i clip e le inquadrature si espandono in questo ordine. Sulla stessa proprietà devono rimanere in ordine temporale e non sovrapporsi. La validazione rifiuta collisioni con i binding di simulazione. `viewBox` della scenografia è configurabile; default invariato 640×360.

### Costi e limiti motivati

Nessuna dipendenza runtime aggiunta. Il controller scrive una trasformazione per nodo per frame e salta i valori immutati; cicli e keyframe vengono campionati sul tempo assoluto, senza espandere ogni passo in nuove tracce. Il termine della sequenza viene precalcolato.

Limiti aggiornati: **1.200 layer, 700 canali, 30 secondi, 24 ripetizioni finite, 32 keyframe per canale**. Sono limiti di authoring, non una promessa di prestazioni identiche su tutti i telefoni. La demo usa 48 figure articolate, 410 layer e 346 canali. Il collaudo browser registra intervallo mediano/p95 dei frame, anche con video attivo; i valori CI non sostituiscono un telefono reale.

Non introdotti: fisica/agenti autonomi, path morphing, shader, filtri, timeline annidate illimitate, editor visuale o dipendenze come GSAP. Servirebbero casi d'uso ulteriori per giustificarli. La dispersione è componibile tramite traiettorie e pose finali dichiarate; questa prima demo mette in scena l'afflusso, non tutte le dinamiche possibili.

### Demo e revisione richiesta

Aprire `prototypes/motion-lab/index.html` tramite server HTTP. La sequenza dura 16 secondi: presenze isolate, afflusso, inquadratura che segue i gruppi, bandiere, vista complessiva. Pausa/ripresa, salto al finale, replay, barra temporale, cinque momenti selezionabili, reduced motion e reload sono parte della demo. `python3 scripts/build-motion-preview.py` produce `dist/motion-study.html`, autonomo, con gli stessi moduli e dati incorporati: nessun renderer alternativo per l'anteprima.

Da valutare dall'autore: leggibilità dei gesti; ritmo della marcia; rapporto tra vuoto e folla; utilità dei cambi d'inquadratura; quanto la regolarità delle sagome del prototipo si discosta dalla ruvidità desiderata. I test non approvano questi aspetti. Nessuna scena storica definitiva o homepage viene sostituita.

Preparazione degli asset: [SVG-AUTHORING.md](SVG-AUTHORING.md). Provenienza della demo: [assets/README.md](../games/motion-study/assets/README.md).

### Revisione delle figure dopo il primo collaudo

Su richiesta dell’autore, seconda prova limitata agli omini: le tre sagome del prototipo erano troppo geometriche. I nuovi SVG del pacchetto hanno proporzioni esili, teste irregolari, busti inclinati e arti piegati. Collo, spalle e anche si sovrappongono: le parti rimangono distinte per animarle, ma la figura deve apparire unita anche agli estremi del passo. Pivot adattati alle nuove anatomie; sei parti per figura, stesso numero di layer e canali, nessuna modifica al motore o alla regia. Il generatore ora legge questi SVG come sorgenti, senza sostituirli con i vecchi simboli. Lo stile resta una proposta in revisione.

### Rig leggero e preparazione degli asset — 20 ottobre 2026

La nuova [procedura di authoring](RIG-AUTHORING.md) conserva la geometria sorgente e compila pose/movimenti del simbolo nelle timeline esistenti. Introduce intervalli articolari verificati sui dati e una texture ruvida opzionale con ID isolati e disattivazione a runtime. Nessuna nuova libreria o secondo clock. Il cane fornito dall'utente è il banco visivo; il collaudo di Safari reale e l'approvazione delle animazioni restano distinti dai test. Il controllo degli angoli non è una garanzia geometrica contro ogni distacco.

## Estensioni per la bottega — 20 ottobre 2026

Estensioni generiche del compositore e del renderer, con test in `tests/bottega.test.js`:

- `palette` del pacchetto: `fill`/`stroke` possono essere nomi di token; `component.recolor` scambia token per una sola istanza.
- `component.rigPose` e `component.joints`: posa statica di un'istanza articolata, controllata sugli intervalli del rig. Le pose del rig ammettono anche `translateX`/`translateY` per giuntura.
- `patterns` del pacchetto, usati come `fill: "pattern:<id>"` e iniettati una volta per scena con ID isolati.
- Canale di trasformazione `scaleX` (specchio), `component.opacity` statica, attributi `font-family` (monospace, sans-serif, serif), `font-weight`, `letter-spacing`.

Il vincolo resta: le sequenze terminano nella posa statica. Le ricette della bottega (`bottega/movimenti.js`) sono zucchero di authoring che produce clip e inquadrature già esistenti.
