# LAIKA — Studi grafici originali e integrazione tecnica

## Stato e provenienza

I tre HTML sono stati caricati dall'utente con la [PR #12](https://github.com/halmob01/riv-russa/pull/12), commit `2ce2cb13db8f859986490b2139ec430bec71237e`, il 20 ottobre 2026. La sistemazione li sposta in `prototypes/laika-studi-originali/` riutilizzando gli stessi blob Git: nessun byte, nome, CSS, script, geometria o colore viene modificato. L'identità verificabile riguarda i file caricati nella PR #12; il download degli allegati della chat resta indisponibile, quindi non si dichiara un confronto diretto con Sediment.

**Asset DA VERIFICARE, normalizzare, gestire e implementare correttamente a livello tecnico. L'accettazione della PR non equivale a certificare l'idoneità alla produzione.** Sono sorgenti/prototipi sperimentali del futuro kit SVG. Non sono registrati nel player, nel build LAIKA o in `game.symbols`.

Lettura effettuata del sorgente e inventario delle dichiarazioni JavaScript. Autore originale, licenza, conformità storica, qualità artistica e idoneità mobile restano da verificare. La dicitura «palette ufficiale» dentro uno studio è parte dell'originale, non una nuova decisione di brand.

## File e integrità

| Originale / consultazione | Byte | Blob Git invariato |
|---|---:|---|
| [Estetiche brutaliste 2.html](../prototypes/laika-studi-originali/Estetiche%20brutaliste%202.html) | 46712 | `462c16fa6a9d4378ef84b9c5596c64cc5e679d8c` |
| [estetiche brutaliste 1.html](../prototypes/laika-studi-originali/estetiche%20brutaliste%201.html) | 47585 | `41e898b985e80869bc41f841f19b745135ba1158` |
| [studio personaggi.html](../prototypes/laika-studi-originali/studio%20personaggi.html) | 58784 | `e5a3a89b403cfcccf3657ea24f4bf2ce42141bec` |

Il [manifest di authoring](../prototypes/laika-studi-originali/manifest.json) conserva SHA-256, blob Git, nome, percorso precedente e commit di provenienza, oltre al catalogo dei contenuti. Non è un manifest/registry runtime. [Indice degli studi e istruzioni di apertura](../prototypes/laika-studi-originali/README.md).

## Fase A — Estetiche brutaliste

`estetiche brutaliste 1.html` genera SVG tramite `drawBrutalistAsset`; non contiene una libreria di elementi `symbol` già importabili. L'oggetto `ASSETS` elenca **21 elementi**: 7 facciate, 6 volumi, 5 dettagli e 3 atmosfere.

| ID nel sorgente | Contenuto | Gruppo |
|---|---|---|
| `cemento_vista` | Cemento a vista | facciate |
| `finestre_modulari` | Finestre modulari | facciate |
| `griglie` | Griglie | facciate |
| `bucature_profonde` | Bucature profonde | facciate |
| `aggetti` | Aggetti | facciate |
| `pareti_scanalate` | Pareti scanalate | facciate |
| `pannelli_prefabbricati` | Pannelli prefabbricati | facciate |
| `pilotis` | Pilotis | volumi |
| `passerelle` | Passerelle | volumi |
| `scale_esterne` | Scale esterne | volumi |
| `rampe` | Rampe | volumi |
| `torri_scala` | Torri scala | volumi |
| `blocchi_sovrapposti` | Blocchi sovrapposti | volumi |
| `ingresso_monumentale` | Ingresso monumentale | dettagli |
| `cortile` | Cortile | dettagli |
| `pensilina` | Pensilina | dettagli |
| `segnaletica` | Segnaletica | dettagli |
| `elementi_modulari` | Elementi modulari | dettagli |
| `piazza_ventosa` | Piazza ventosa | atmosfere |
| `cortile_residenziale` | Cortile residenziale | atmosfere |
| `scalinata_monumentale` | Scalinata monumentale | atmosfere |

Sono riferimenti architettonici/compositivi brutalisti del Novecento, da datare e attribuire prima del riuso. Non sono scenografie documentate per la Russia del 1861–1907: non inserirli automaticamente in A0/A1. La possibilità di riusare una forma astratta richiede una scelta esplicita.

## Fase B — Palazzi brutalisti

`Estetiche brutaliste 2.html` genera **15 edifici/varianti** tramite `drawBuilding`, raggruppati in quattro righe di `BUILDINGS`.

| ID nel sorgente | Contenuto | Riga |
|---|---|---|
| `torre_residenziale` | Torre residenziale | r1 |
| `torre_residenziale_var` | Torre resid. (Variante) | r1 |
| `blocco_abitativo` | Blocco abitativo | r1 |
| `blocco_abitativo_var` | Blocco abit. (Variante) | r1 |
| `palazzo_amministrativo` | Palazzo amministrativo | r2 |
| `palazzo_amministrativo_var` | Palazzo amm. (Variante) | r2 |
| `centro_civico` | Centro civico | r2 |
| `centro_civico_var` | Centro civico (Variante) | r2 |
| `complesso_gradoni` | Complesso a gradoni | r3 |
| `complesso_gradoni_var` | Gradoni (Variante) | r3 |
| `edificio_pilotis` | Edificio con pilotis | r3 |
| `edificio_pilotis_var` | Pilotis (Variante) | r3 |
| `casa_cultura` | Casa della Cultura | r4 |
| `casa_cultura_var1` | Casa Cultura (Variante 1) | r4 |
| `casa_cultura_var2` | Casa Cultura (Variante 2) | r4 |

Torre, blocco abitativo, palazzo amministrativo, centro civico, complesso a gradoni, edificio con pilotis e Casa della Cultura sono famiglie di studio, non identificazioni di edifici reali. Il commento che cita `image_7.png` è un riferimento di lavorazione: non c'è un'immagine caricata come dipendenza dello studio. Autenticità e cronologia restano aperte.

## Studio personaggi — figure, oggetti e composizioni

`studio personaggi.html` contiene un generatore HTML/JS completo, non un rig runtime certificato. L'oggetto `POSES` contiene **13 pose**, benché il commento/UI ne annunci 12; si registra la discrepanza senza correggere l'originale.

| Famiglia | Contenuti dichiarati nel codice |
|---|---|
| 13 pose | `in_piedi`, `cammina_1`, `cammina_2`, `corre`, `braccia_alzate`, `gira`, `indica`, `saluta`, `parla`, `mani_fianchi`, `seduto`, `inginocchiato`, `a_terra` |
| 13 varianti | `nessuna`, `donna`, `bambino`, `cappello`, `cappello_largo`, `cappotto`, `vestito`, `scialle`, `zaino`, `borsa`, `bastone`, `mantello`, `clero` |
| 11 azioni | `porta_bandiera`, `manifesta`, `lancia`, `sbarra`, `tiene_cartello`, `usa_fucile`, `spara`, `con_megafono`, `costruisce`, `lavora`, `legge` |
| 12 oggetti | `bandiera`, `cartello_vuoto`, `cartello_pane`, `fucile`, `bastone`, `martello`, `megafono`, `cassa`, `barricata`, `tamburo`, `giornale`, `volantini` |
| 4 ruoli / 3 corpi | `popolo`, `protagonista`, `esercito`, `partigiano` / `uomo`, `donna`, `bambino` |
| 6 folle | `statica`, `marcia`, `carica`, `barricata`, `discorso`, `scontro` |
| Ambienti | piazza, fabbrica, stazione, rurale, più assenza di ambiente |
| Mezzi | treno, tram, camion, tank, più assenza di mezzo |

Accessori, abiti, armi, mezzi e simboli sono candidati da verificare per episodio/epoca; il numero di combinazioni possibili non rappresenta il numero di asset approvati. Il debug articolare dello studio non garantisce compatibilità con [RIG-AUTHORING](RIG-AUTHORING.md).

## Osservazioni tecniche sui sorgenti

- I tre HTML sono autonomi: CSS e JavaScript inline, font di sistema, nessun import/fetch di moduli o risorse esterne individuato. Hanno UI proprie, selettori globali e generazione SVG con `innerHTML`; conservarli come documenti separati, senza copiare queste scelte nel motore.
- Fase A e Fase B usano entrambe l'ID fisso `brutal-ink`, con definizioni differenti; i pattern sono `concrete-speckle` e `concrete-tex`. Lo studio personaggi usa `laika-rough`. Comporre gli export nello stesso DOM richiede isolamento e namespacing di tutte le definizioni e dei loro riferimenti.
- I filtri usano `feTurbulence` e `feDisplacementMap`; compaiono pattern, poligoni e forme generate. Il supporto di ellipse/rig/texture della PR #9 ora integrata non rende questi HTML automaticamente importabili: [SVG-AUTHORING](SVG-AUTHORING.md) mantiene un subset esplicito.
- I tre export disegnano un rettangolo di fondo chiaro: non sono asset trasparenti pronti da sovrapporre. Non rimuovere il fondo dagli originali; valutare una variante derivata e confrontarla visivamente.
- Palette comune: fondo `#F6F1E3`, inchiostro `#161614`, rosso `#E02A1B`. Fase A usa blu `#C6D5DF/#8DA9BC/#4A687A`; Fase B `#C9D6DF/#8EA8B8/#4F6B7C`; personaggi `#6B92A4` e sabbia `#DECBA8`. Non uniformarle nell'acquisizione.
- ViewBox: Fase A singolo `245×205` o `440×205`, tavola `1480×1060`; Fase B singolo larghezza dichiarata +30, altezza 225, tavola `1520×1080`; personaggi singolo `260×260`, folla `560×300`, tavola `1350×940`. Coordinate locali, piedi, ancoraggi, scala e ritagli richiedono normalizzazione nei derivati.
- Lo studio personaggi usa l'etichetta `Volantini & Sassi` interpolata senza escaping XML nella tavola: l'export SVG XML e l'anteprima PNG possono risultare invalidi/non aggiornati. Il test registra lo stato dell'originale e ne verifica la conservazione, senza correggerlo. Questa è una questione da risolvere nel futuro derivato.
- Ogni studio mantiene un proprio `requestAnimationFrame`, modifica `state.tick` e rigenera l'SVG. Non trasferire questo clock nel player. Le UI desktop a tre colonne, i filtri, il numero di nodi e l'aggiornamento PNG da canvas richiedono prove mobili e di performance specifiche.

## Verifiche necessarie prima di proporre un derivato

Tutte le voci seguenti sono **DA VERIFICARE** per ciascun elemento selezionato; la tabella è una coda di lavoro, non un elenco di controlli già superati.

| Area | Lavoro richiesto e prova attesa |
|---|---|
| Isolamento SVG e HTML | Separare la geometria utile dall'impaginazione del prototipo; censire CSS globale, script, risorse esterne e riferimenti. Per la consultazione aprire il documento separatamente, dopo la lettura del sorgente; non inserirlo nel DOM del player tramite HTML grezzo. |
| `defs` e ID namespacing | Inventariare ID, `use`, clip, mask, filtri, gradienti e riferimenti `url(#...)`; definire il namespace per asset e istanza. Provare più copie e più simboli insieme, senza collisioni né riferimenti mancanti. Verificare il supporto di ogni costrutto. |
| Palette | Registrare colori e ruoli presenti; valutare una mappatura esplicita alla palette LAIKA solo nei derivati. Nessuna ricolorazione implicita degli originali. |
| Coordinate, `viewBox` e ancoraggi | Annotare dimensioni, unità, trasformazioni, bounding box, origine, contatto col suolo e punti di aggancio. Verificare scale, ritagli, allineamento e composizioni responsive. |
| Trasparenza | Distinguere fondali, forme opache, alpha, maschere e filtri. Controllare bordi e sovrapposizioni su sfondi chiari, scuri e colorati; evitare fondi incorporati involontariamente. |
| Rig e animazioni | Distinguere silhouette statiche e parti articolabili. Definire gruppi, pivot, gerarchie e pose senza alterare il disegno; usare la temporizzazione esistente. Controllare pause, ripresa, seek, replay, skip, reload, reduced motion e stato finale leggibile. |
| Performance mobile | Misurare costo di path, nodi, filtri, texture e istanze sul carico reale e viewport mobili. Registrare dispositivo/browser e risultati; le prove desktop non certificano il telefono reale. |
| Riuso | Definire varianti, limiti delle pose, scala e contratto delle parti. Riutilizzare simboli/istanze anziché duplicare disegni e animazioni; tenere marca LAIKA e contenuti storici fuori dal motore generico. |
| Manifest/registry | L'inventario di authoring non è il registro runtime. Registrare provenienza, autore/licenza da verificare, periodo, sorgente, derivato, hash, dipendenze, ancoraggi e stato. Inserire nel manifest/registry del prodotto soltanto il derivato validato attraverso i contratti esistenti. |
| Test di rendering e regressione visiva | Conservare baseline degli originali e confronti del derivato a viewport, sfondi, browser e tempi dichiarati. Controllare pose intermedie, sovrapposizioni e più istanze; conservare screenshot/differenze e motivare gli scarti. La sola validazione dati non prova l'equivalenza visiva. |
| Verifica editoriale e provenienza | Controllare epoca, abiti, edifici e simboli rispetto alla scena. Registrare attribuzioni, font e diritti effettivamente verificati; non attribuire agli studi una validazione artistica o storica per il solo caricamento. |

Non è richiesta in questa PR la realizzazione di tutti i derivati: è richiesta la conservazione integrale degli studi con inventario e limiti espliciti. L'integrazione nel player richiederà verifiche proprie.


## Controlli di conservazione e confini

Il test Node `tests/laika-originals.test.js` verifica dimensioni, SHA-256, blob Git e l'indice editoriale. Il test browser `tests/browser-original-studies.cjs`, rimosso il 21/10/2026 a trasloco concluso perché instabile e ridondante, confrontava i file ricollocati con i blob originari della PR #12, serviti a un URL di riferimento separato: SVG esportato, anteprima PNG e screenshot nelle modalità singolo/tavola, a 1440×1000 e 390×844, in Chromium e WebKit attraverso la CI esistente. Queste prove riguardano la conservazione nel trasloco; non dimostrano idoneità mobile, equivalenza fra browser o correttezza di ogni combinazione/animazione.

Originali separati da eventuali futuri derivati nel pacchetto LAIKA, nessuna estensione del motore o importazione automatica. Inventario generale: [ASSET-MANIFEST](ASSET-MANIFEST.md); roadmap: [HISTORY-SVG-KIT](HISTORY-SVG-KIT.md); atlante editoriale: [ANEDDOTI-SCENE-LAIKA](ANEDDOTI-SCENE-LAIKA.md).

## Derivati realizzati — 20 ottobre 2026

I tre studi sono la fonte della [bottega](../bottega/README.md). Gli originali restano intatti: l'importatore esegue le loro funzioni di disegno in un contenitore isolato, sostituendo la palette con token, e converte il markup nei layer del motore. Risultato: 21 elementi della Fase A, 15 palazzi della Fase B, 4 ambienti, 4 mezzi, i tralicci e 12 oggetti dello studio personaggi, più i due motivi di grana e i tre filtri ruvidi come parametri. La figura dello studio è stata portata a mano con le stesse forme, giunture e tabelle di pose; le sei folle sono formazioni della bottega.

Il test `tests/browser-bottega.cjs` confronta al pixel ogni simbolo importato, 40 combinazioni di figura e le sei folle con l'output degli originali: nessuna differenza. Restano aperti: autore e licenza, idoneità storica per epoca (indicata nel catalogo), resa su telefono reale. Le discrepanze del sorgente (13 pose annunciate come 12, testo non escapato nel poster) non toccano i derivati: il poster non è importato.
