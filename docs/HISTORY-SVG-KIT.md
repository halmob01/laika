# HISTORY SVG KIT — libreria incrementale di illustrazioni e motion storici

> **Aggiornamento 20 ottobre 2026.** La libreria è stata avviata come `bottega/` nella repo, con decisione esplicita dell'utente: disegni neutri a token, catalogo unico (`bottega/catalogo.json`), azioni compilate nelle primitive esistenti, verifica al pixel con gli originali. Questo documento resta il quadro dei principi e delle famiglie; le procedure operative correnti sono in [bottega/README.md](../bottega/README.md). Nomi delle parti: quelli della figura articolata (`root`, `head`, `arm-near`, `forearm-near`, …), elencati nel catalogo.

**Stato:** proposta di processo, da leggere in P2 e aggiornare durante gli atti. **Non** è un mandato a disegnare adesso tutto il Novecento, né un nuovo motore, né un pacchetto già implementato.

**Contesto:** LAIKA / Rivoluzione russa, 19 ottobre 2026. Questo documento affianca [PIANO-LAIKA](PIANO-LAIKA.md), [BRIEF-HOME-ATTI](BRIEF-HOME-ATTI.md), [LAIKA-ASSET-DIRECTION](LAIKA-ASSET-DIRECTION.md), [SVG-AUTHORING](SVG-AUTHORING.md) e [MOTION](MOTION.md). L'[inventario P0](ASSET-MANIFEST.md) è **l'unica fonte di verità sugli asset attualmente presenti**, una volta integrata la PR #7. Non duplicarne il catalogo qui.

## 1. Scopo e principi

Vogliamo usare il lavoro concreto sugli atti LAIKA per costruire, senza rallentarli, un repertorio riutilizzabile di **forme SVG, personaggi, varianti d'epoca, oggetti, scenografie e coreografie**. Il banco di prova è LAIKA, ma la libreria dovrà poter servire un altro corso o racconto del Novecento senza portarsi dietro il marchio, la palette, i fatti russi o il testo degli atti.

- **Prima il bisogno narrativo, poi il nuovo asset.** Ogni asset nuovo nasce da una scena reale richiesta dall'atto, non da un piano per produrre in anticipo 80 disegni.
- **Riusare prima di ridisegnare.** Ricercare nel catalogo, confrontare, riadattare, derivare una variante; nuovo asset soltanto se la differenza visiva/storica lo richiede.
- **Tre responsabilità distinte:** motore neutro in `src/visual`; libreria neutra di contenuti artistici; tema e composizioni storiche LAIKA nel pacchetto dedicato. Non aggiungere condizioni `if (game === 'laika')` al motore.
- **SVG sorgente sempre conservato.** Il JSON per `game.symbols` e `stage.components` può essere generato con `scripts/svg-to-symbol.py`. Non correggere a mano un generato senza correggere il sorgente.
- **Stile come tema, non come storia.** La silhouette piena, organica ed essenziale concordata per LAIKA è vincolante per le sue produzioni; il contratto di riuso non impone a ogni futuro progetto colori o grafica sovietica.
- **Storicamente preciso.** Distinguere archetipo generico, variante documentata di luogo/anno e pura metafora visiva. Un soldato 1914 non diventa un soldato 1945 cambiando solo il copricapo.

## 2. Architettura desiderata (non directory da creare tutte ora)

```text
history-svg-kit/                 # eventuale package/estrazione dopo prova di riuso
  characters/                   # corpi, pose, accessori, varianti
  objects/                      # strumenti, documenti, segni e arredi
  environments/                 # sfondi/architetture modulari
  eras/                         # varianti esplicite per luogo e periodo
  motions/                      # clip e regie riutilizzabili
  scenes/                       # composizioni dimostrative, senza testi didattici
  themes/                       # palette e regole separate dai simboli neutrali
  catalog/                      # anteprime e schede
  manifest.json                 # indice semantico/versione (futuro)
```

**Non creare ora una seconda repo, un package npm, un editor completo o nuovi formati runtime.** In P2 gli asset di produzione nascono dove il piano li prevede, in `games/laika/assets/`; i prototipi originari restano intatti. Una successiva estrazione nella struttura sopra richiede almeno due consumatori indipendenti, oppure una demo indipendente che provi davvero la separazione. Niente import dal motore verso la libreria.

Per non perdere il lavoro, ogni asset condivisibile va segnato sin dal suo primo ingresso come `candidate`, `ready` o `laika-only` nell'inventario corrente o in un indice derivato. **Non mantenere due manifest concorrenti**: `ASSET-MANIFEST.md` della P0 rimane il registro di provenienza fino a una migrazione esplicita.

## 3. Famiglie di asset — backlog, non ordine di esecuzione

| Famiglia | Nucleo utile | Derivazioni nel Novecento |
|---|---|---|
| Personaggi | civile, contadino, operaio, soldato, funzionario | ufficiale, poliziotto, oratore, giornalista, bambino, varianti di abito/età |
| Accessori | cappelli, cappotti, elmetti, uniformi, borse, attrezzi | accessori militari e professionali per luogo/decennio |
| Politica/comunicazione | documento, giornale, bandiera, tribuna, manifesto | urna, megafono, radio, microfono, macchina da scrivere, TV |
| Vita quotidiana | pane, valigia, tavolo, bicicletta, pacchi | oggetti di consumo per decennio e regione |
| Spazi | campagna, casa, strada, piazza, fabbrica | stazione, ufficio, caserma, quartiere, catena di montaggio |
| Trasporti | treno e tram | automobile, camion, aereo, nave, carro armato |
| Infrastrutture | lampione, binari, ciminiera, fili | barricate, filo spinato, tralicci, grandi cantieri |
| Tecnologia | meccanismi di fabbrica | macchina fotografica, cinepresa, satellite, razzo, computer |
| Atmosfera | neve, fumo, luce, pioggia stilizzati | polvere, rovine, esplosioni astratte quando giustificate |

La lista non impone che ogni elemento venga realizzato. Evitare di inventare iconografie politiche, insegne, bandiere e uniformi senza riferimenti datati.

## 4. Il primo nucleo P2, senza anticipare gli atti successivi

La fase **P2 — Personaggi, SVG e scena campione** del piano LAIKA resta prioritaria. In P2 si consolidano **solo** gli asset necessari alla scena campione A0.1 e alla prova della famiglia grafica:

1. Tre archetipi fondamentali già previsti nel brief: figura contadina, figura operaia, figura in soprabito, con una posa alternativa seduta o piegata. Confronto obbligatorio con `human-a`…`human-e` e con le tavole di riferimento; niente manichini geometrici.
2. Convenzioni condivise: piedi all'origine locale, viewBox coerente, ID semantici stabili, pivot annotati, sagoma continua anche nei gesti; poche articolazioni necessarie. Figure di fondo possono rimanere statiche.
3. Ricomposizione di un ambiente rurale e di pochi oggetti A0.1 mediante i simboli già esistenti quando adeguati.
4. Un'anteprima affiancata di asset isolati, pose, fila di cinque figure e movimento campione di 8–12 secondi. **Gate visivo dell'autore** prima di estendere gli archetipi.
5. La figura `char-soldato-zarista` esiste nello studio Atto 0, ma **non è pronta come soldato modulare**: uniformi e raccordi da verificare. Si svilupperà quando una scena ne abbia bisogno, non per completare artificialmente P2. La coda del pane resta riservata al 1917 e non va riciclata per il 1905.

Gli asset extra richiesti dal kit non devono ritardare né modificare lo scopo di P2. Il prodotto della P2 sarà al tempo stesso la prima semina della libreria.

## 5. Contratto minimo per le parti riutilizzabili

**Proposta di metadati d'autore, non schema `game.json` già supportato:**

```json
{
  "id": "character-soldier",
  "kind": "character",
  "status": "candidate",
  "sourceSvg": "games/laika/assets/...",
  "runtimeSymbol": "char-soldato-zarista",
  "variants": [{"id": "imperial-russia-1914", "from": 1914, "to": 1917, "place": "Impero russo", "historicalReview": "pending"}],
  "motionParts": ["head", "torso", "arm-near", "arm-far", "leg-near", "leg-far"],
  "license": "to-confirm",
  "provenance": "descrizione e riferimento da compilare",
  "testedWith": ["still", "reduced-motion"]
}
```

I nomi delle parti sono una **convenzione proposta**, da stabilizzare dopo aver osservato i veri rig di P2. Non aggiungere questi campi al validatore del gioco; l'eventuale schema catalogo e un exporter appartengono a una fase successiva. Per ogni variante storica registrare area, anni, riferimento documentale e dubbi; per ogni simbolo registrare origine, licenza/diritti di redistribuzione e revisione artistica.

Niente SVG basati su `<use>` non espanso, CSS incorporato, gradienti, pattern o matrici incompatibili con l'importatore senza una decisione esplicita. Il renderer corrente compone `symbols` e `components`, supporta gruppi/pose/pivot, coreografie, camera e ritagli; **non** supporta morphing dei path o rig scheletrici arbitrari. Verificare il percorso SVG → simbolo JSON → `composePack` → `validateStage` → browser per ogni nuovo archetipo.

## 6. La seconda libreria è quella delle azioni

Azioni proposte da costruire **una per volta quando compaiono nei livelli**:

| Preset narrativo | Prima scena possibile | Riutilizzo |
|---|---|---|
| `walk`, `stop`, `turn` | A0: transizione campagna-fabbrica | qualsiasi passaggio/arrivo |
| `work`, `carry`, `hand-over` | A0: lavoro e sussistenza | produzione/distribuzione |
| `speak`, `listen`, `raise` | A0: assemblea del mir | assemblee e comizi |
| `gather`, `march`, `disperse` | A1: corteo/scioperi 1905 | manifestazioni di epoche diverse |
| `confront`, `retreat` | solo se l'episodio lo richiede | proteste, conflitti |
| `queue`, `advance` | 1917: approvvigionamenti | code e servizi |
| `reveal`, `camera-pan`, `camera-hold` | A0.1 e A1.2 | regia trasversale |

Questi sono **nomi di ricette di authoring**, non nuovi preset già accettati da `composePack`. Compilarli nelle primitive esistenti (`clips`, `shots`, `presets`, `tracks`) se bastano. Estendere `src/visual` solo davanti a una capacità mancante dimostrata da una scena, con test di regressione. Pausa, seek, replay, skip, reload e `prefers-reduced-motion` devono terminare in una posa informativa coerente; l'animazione non applica mai da sola effetti sullo stato di gioco.

## 7. Procedura operativa per ogni nuovo atto

1. **Storyboard storico:** stabilire evento, luogo, data, azione e cosa deve essere mostrato; distinguere fatto, fonte e simulazione.
2. **Ricerca nel catalogo P0:** classificare gli asset come `reuse`, `adapt`, `new`; dichiarare la ragione se `new`.
3. **Produzione minima:** creare SVG sorgenti leggibili, varianti necessarie, simboli JSON generati e una scena con il renderer esistente. I prototipi non vengono sovrascritti.
4. **Prova visuale:** valutare forma a dimensione reale, continuità di sagoma nelle pose estreme, ritmo, leggibilità dei pieni/vuoti e comportamento mobile.
5. **Revisione storica:** verificare uniformi, bandiere, edifici, tecnologia e simboli per data e contesto; non retrodatare stile sovietico a Russia imperiale.
6. **Controlli:** eseguire suite Node, validatori, test browser pertinenti, reduced motion e test su telefono reale quando disponibile; annotare ciò che non è verificato.
7. **Registrazione:** aggiornare il registro asset (e più avanti il catalogo neutro); dichiarare variante/versione, provenienza, licenza, stato `candidate/ready/laika-only` e azioni supportate.
8. **Estrazione:** promuovere nel kit condiviso solo ciò che ha superato la review, senza hardcodare contenuti LAIKA. I componenti condivisi hanno ID e interfacce stabili; le modifiche che li rompono diventano versioni maggiori o nuove varianti.

## 8. Checkpoint tra fasi

- **P0 / PR #7:** acquisire l'inventario corrente e i dubbi di provenienza. Non modificare o copiare il suo `ASSET-MANIFEST.md` in questa PR.
- **P2:** approvare 3 archetipi + pose e scena A0.1; iniziare nomi, metadati e catalogo visuale minimo *solo quanto necessario*. Il gate sulla direzione degli omini prevale sulla produzione in massa.
- **P3–P4:** ampliare personaggi, oggetti e gesti richiesti dal percorso rurale/industriale; consolidare l'authoring dove si osserva una duplicazione vera.
- **P5 (1905):** famiglia folla, corteo, assemblea, regia di massa; verificare gli attori e la simbologia prima di riusare le uniformi. Non anticipare la scena del 1917.
- **Atti successivi:** aumentare gli ambienti, le varianti del soldato e i mezzi per epoche diverse senza imporre un inventario a priori.
- **Solo dopo una prova cross-progetto:** separare un package o una nuova repo versionata, con demo indipendente e catalogo che possa essere importato da un secondo sito.

## 9. Definizione di successo del kit

Il kit è pronto a diventare indipendente quando:

- la stessa figura/azione viene usata in **due scene differenti** senza copiarne e modificare a mano il motore;
- uno stesso archetipo può ricevere una variante di periodo senza perdere continuità grafica o animazioni essenziali;
- un gioco non LAIKA riesce a importare elementi neutrali senza palette o testi LAIKA;
- una galleria permette di vedere asset, pose, animazioni e metadati, e il catalogo distingue gli asset approvati dai prototipi;
- importazione, validazione, riduzione del movimento e regressione dei giochi esistenti sono verificabili;
- nessun simbolo storico ambiguo viene spacciato per rappresentazione documentata.

**Caso di prova futuro (non target P2):** una strada reinterpretata per Pietrogrado 1917, Berlino 1933 e New York 1929, con le stesse primitive di scena e tre set di varianti documentate. La differenza tra contesti deve essere leggibile anche senza nomi, senza riutilizzi storicamente scorretti.

## 10. Decisione su questa PR

Questa PR aggiunge **soltanto la roadmap e il contratto di lavoro**. Nessun asset nuovo, modifica a `src/`, modifica al `README` o conflitto intenzionale con la PR #7. Non dichiarare un nuovo kit funzionante. Dopo il merge, chi esegue P2 legge anche questo documento e annota gli asset prodotti man mano che avanzano gli atti.