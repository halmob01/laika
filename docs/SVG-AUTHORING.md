# Preparare un'illustrazione animabile

L'illustrazione rimane nel pacchetto grafico. Il motore conosce gruppi, forme e proprietà, non persone o bandiere. È possibile usare JSON diretto o importare un SVG con il comando:

```sh
python3 scripts/svg-to-symbol.py disegno.svg figura > figura.json
```

Il risultato è un simbolo da inserire in `game.symbols`; le istanze nella scenografia usano `components`. Non serve scrivere JavaScript per ogni nuova figura.

## Convenzioni minime

- Un ID semantico univoco per ogni forma e gruppo: `head`, `torso`, `leg-left`, `flag-cloth`. Minuscole, numeri e trattini; niente ID generati casualmente.
- Gruppi annidati per elementi che devono muoversi insieme. Disegnare un personaggio attorno all'origine locale, con i piedi vicino a y=0; posizionare l'istanza nella scena.
- Arti o oggetti ruotabili separati. `data-pivot="-3 -1"` nell'SVG diventa `origin:[-3,-1]` nel descrittore: pivot nelle coordinate locali del layer, prima delle trasformazioni dei parent.
- Colori e tracciati restano nell'asset. Un personaggio può essere sostituito con un robot, una pianta o un segno astratto mantenendo gli ID necessari alla coreografia; il motore resta invariato.
- Non duplicare manualmente il disegno per creare la folla: creare istanze del simbolo, con posizioni/scale dichiarate. I gruppi di coreografia sono elenchi di ID, non selettori CSS.
- Una camera è un gruppo come `world`; contiene tutti gli elementi che devono cambiare inquadratura. Il viewBox appartiene alla scenografia.
- Ritagli: nel JSON, un layer `tag:"clipPath"` alla radice con forme figlie; `clip:"nome-ritaglio"` sul gruppo da ritagliare. Le coordinate sono locali al gruppo ritagliato. Il renderer genera ID DOM isolati per ogni montaggio. Non usare URL o clip ricorsivi.

## Subset di importazione esplicito

Supportati: g, path, rect, circle, line, text; colori piatti, stroke, opacità, cap/join, trasformazioni translate/rotate/scale uniforme/skew. La composizione delle trasformazioni è translate → pivot → rotate → skew → scale → pivot inverso. Per un ordine diverso usare gruppi annidati. Il comando rifiuta ciò che non sa rappresentare, anziché alterarlo silenziosamente.

Prima dell'import: espandere use/symbol, CSS, gradienti/pattern e matrici non supportate nell'editor, oppure mantenere quell'asset fuori dal kit finché serve un'estensione motivata. Non appiattire automaticamente un disegno complesso perdendo elementi. Per esempio la tavola della Madrepatria usa pattern: questo importer **non** promette di riprodurla integralmente. Il subset va incontro agli SVG minimali del progetto, non a ogni SVG esportato da ogni programma.

L'importer non è un visualizzatore di SVG non fidati: produce dati, che devono ancora passare da `validatePack`. Nessun markup viene inserito con innerHTML. Tracciati, attributi e riferimenti ammessi sono verificati nel runtime.

## Pose e temporizzazione

La posa di ciascun layer è la composizione finale recuperabile. I clip possono iniziare altrove, convergere o separarsi, e devono terminare nella posa dichiarata. Un cambiamento permanente dei dati di simulazione usa un binding; una composizione permanente diversa può usare un'altra scenografia. Pausa, replay, seek e skip non producono decisioni né punti.

Per un passo: pochi keyframe di rotazione su due gambe con ampiezze opposte; sfasare le istanze e limitare il numero di cicli. Per una bandiera: pivot all'attacco, skew piccolo e finito. Per la camera: alternare movimenti e soste, senza mantenere tutto in movimento. Per una rivelazione: animare la geometria del ritaglio, conservando il disegno sottostante.

Per controllare: validazione, apertura browser, cinque pose lungo la sequenza, pausa/ripresa, replay, skip, reload e reduced motion. Il finale deve trasmettere le informazioni principali anche senza vedere il movimento.

## Preparazione assistita, rig e texture opzionale

Il [percorso di rig authoring](RIG-AUTHORING.md) aggiunge una ricetta di preparazione conservativa, pose e movimenti nominati compilati nelle tracce esistenti, controllo degli intervalli e un filtro ruvido disattivabile. La [demo del cane](../prototypes/rig-study/index.html) conserva i tracciati forniti dall'utente. Queste capacità estendono il subset documentato sopra; non rendono importabile qualsiasi SVG/CSS e non certificano automaticamente la qualità delle giunture.

## Bottega (20 ottobre 2026)

Per le scene dei giochi non si preparano più SVG a mano: si usano i disegni della [bottega](../bottega/README.md) e le schede scena. Questa pagina resta valida per disegni singoli importati con `svg-to-symbol.py` o `prepare-svg.py`. I kit generati da codice si importano con `bottega/strumenti/importa-studi.js` secondo il [contratto](../bottega/CONTRATTO-KIT.md); il convertitore accetta anche `polygon`/`polyline` (tradotti in `path`), `rotate(a cx cy)`, motivi dichiarati e, per le parti animabili, `id` semantici con `data-pivot`.
