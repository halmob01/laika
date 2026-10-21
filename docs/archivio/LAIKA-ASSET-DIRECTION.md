# LAIKA — Direzione degli asset (consolidamento 19 ottobre 2026)

> **Aggiornamento 20 ottobre 2026.** Produzione corrente: [bottega](../../bottega/README.md), con disegni derivati dagli studi originali della PR #12. I materiali di questa pagina restano riferimenti d'archivio, elencati nella sezione `archivio` del [catalogo](../../bottega/catalogo.json).


**Aggiornamento P0:** PR #4 e #5 integrate nel main `eb6ab832`; il catalogo è coperto dalla CI Chromium/WebKit sullo stesso commit. Inventario, font e lacune in [ASSET-MANIFEST](../ASSET-MANIFEST.md); nuova review artistica e telefono reale restano da svolgere. Le formule «in questa PR» sotto descrivono lo storico della PR #5.

**Stato originario:** proposta di consolidamento visivo. Nessuna sostituzione dei contenuti didattici, nessuna modifica a `src/`, nessun merge automatico. Il design è sottoposto a revisione visiva e storica.

## Tre materiali, tre ruoli distinti

1. **[Kit forme originale — 20 simboli](../../prototypes/laika-kit/kit-forme-laika.html).** Conservato integralmente come consegnato. **Mantenere** l'inventario di architetture, ambienti, infrastrutture, mezzi, emblemi e la mascotte LAIKA. Comprende le figure geometriche originarie come riferimento tecnico/di confronto, **non** come direzione definitiva dei personaggi. Le cinque scene sono studi compositivi e coprono anche epoche posteriori al 1917.
2. **[Home v2 — cinque sagome organiche](../../prototypes/laika-home/index-v2.html).** Conservata integralmente. Adottare **human-a, human-b, human-c, human-d, human-e** come riferimento di stile per gli omini pieni: curve Bézier, corpi compatti, posture meno regolari. La home è un prototipo separato, non sostituisce automaticamente la homepage esistente.
3. **[Kit Atto 0 — 14 simboli + 4 scene](../../prototypes/laika-kit/index.html).** Nuova versione eseguibile, con [dati separati](../../prototypes/laika-kit/atto0-study.json), creata per salvare e completare il lavoro sul frammento HTML fornito in chat. Comprende campi e confini, proprietario, funzionario, famiglia contadina, assemblea del mir, fabbrica ottocentesca, operaio, documento, monete, grano, attrezzi, soldato, coda del pane e civile in attesa. **Non è una trascrizione integrale** del terzo HTML, che terminava durante la definizione del soldato. Le prime undici forme riprendono la struttura e i tracciati visibili del frammento; soldato, panificio e civile in attesa sono stati completati o ricreati dall'assistente. Eventuali parti successive non erano disponibili e non sono state attribuite all'autore.

## Figure organiche estratte dalla home v2

Sono disponibili anche i cinque SVG standalone:
[human-a](../../prototypes/laika-kit/figure/human-a.svg),
[human-b](../../prototypes/laika-kit/figure/human-b.svg),
[human-c](../../prototypes/laika-kit/figure/human-c.svg),
[human-d](../../prototypes/laika-kit/figure/human-d.svg),
[human-e](../../prototypes/laika-kit/figure/human-e.svg).

I `path d` sono quelli della bozza home allegata; sono stati aggiunti soltanto gruppi e ID semantici `figure`, `head`, `body`, con fill nero esplicito. Si tratta di **silhouette statiche**, non rigging articolati e non asset già integrati nel runtime. Possono essere importati come riferimenti e suddivisi dopo una revisione artistica.

## Convenzioni confermate

- Palette: carta `#f3ebdb`, seconda carta `#e9e0cf`, rosso `#cc2a25`, nero `#1c1c1b`, azzurro `#93abb7`.
- Nessuna fotografia né raster nelle scene finali; le tavole WebP precedenti restano references.
- Edifici, mezzi e simboli: forme piene essenziali, gerarchia forte, nero e azzurro per i contorni architettonici, rosso usato selettivamente.
- Personaggi: **prevalgono le cinque figure organiche della home v2**, non i vecchi manichini a trapezi; nuove figure articolate dell'Atto 0 devono tendere alla stessa silhouette unita.
- Parti animabili con ID semantici e parent corretti, senza rotture visive all'altezza di collo, spalle e anche.
- Separazione tra _riferimento illustrativo_, _asset animabile_, _fatto documentato_ e _simulazione_. Una metrica astratta non è un dato statistico sul 1861.

## Limiti noti / lavori aperti

**Grafica:** raffinare human-b (effetto a Y), sovrapposizioni degli arti e continuità delle sagome in moto. Rendere più coerenti, dove necessario, le sagome articolate del kit Atto 0 con quelle statiche della home. Evitare di aumentare il dettaglio degli edifici indiscriminatamente.

**Storia:** la rappresentazione di assemblea rurale, proprietà fondiaria, uniformi zariste e approvvigionamenti è schematica. Verificare età, genere e composizione delle assemblee, organizzazione del mir, natura dei pagamenti di riscatto, geografia dei manufatti e abiti per ogni episodio. La **coda per il pane** funziona come riferimento per la crisi del febbraio 1917, non come scena intercambiabile della Domenica di sangue del 1905. Distinguere iconografia tardosovietica da paesaggi zaristi nel 1861; attenzione a monumenti inaugurati dopo la data illustrata.

**Tecnica:** il primo file include implementazioni autonome e semplificate di funzioni omonime a quelle del kit; i suoi messaggi di validazione non equivalgono ai test della repository. La nuova galleria Atto 0 usa invece il `composePack` e `createStage` reali di `main`, e i test verificano le scene contro `validateStage`. Il dataset è intenzionalmente **non** un `game.json`: non contiene atti, episodi, fonti o quiz. In questa PR non si registra alcuna demo in `config.json`.

**Animazioni:** gli ingressi del kit Atto 0 sono **solo prove tecniche**. La priorità successiva è una scena storica con un evento e una conseguenza visibile. Il motore di coreografie avanzate della PR #4 è stato integrato in main mentre si preparava questa PR; occorre ancora rivalidare l'uso artistico e il comportamento su telefono reale. Nessun binding della stessa proprietà in conflitto con una timeline. Regole reduced-motion e collaudo su iPhone reale ancora da completare.

**Home:** prototipo v2 separato; verificare uso e ridistribuzione dei contorni della font Propaganda prima di qualsiasi pubblicazione definitiva.

## Come consultare

Con server HTTP dalla radice:

```sh
npm run serve
```

Aprire `/prototypes/laika-kit/`, `/prototypes/laika-kit/kit-forme-laika.html` e `/prototypes/laika-home/index-v2.html`. Il file `atto0-study.json` è materiale di authoring: include `symbols` e `stages`, da inserire o adattare in futuro a un pack didattico. Il test Node `tests/laika-assets.test.js` copre validazione, composizione e conflitti identificabili senza browser; **non** prova ritmo, qualità visiva o accuratezza storiografica.

## Criterio per il merge

Approvazione dell'autore sulla scelta dei simboli e della silhouette organica; test del pacchetto artistico in CI; non modificare il motore in questa PR; la #4 è stata integrata in main e i due percorsi vanno collaudati insieme. Dopo il merge si potranno integrare le parti selezionate nel primo episodio storico, tramite una PR separata.
