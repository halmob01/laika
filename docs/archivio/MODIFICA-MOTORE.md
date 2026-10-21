# MODIFICA-MOTORE — incarico tecnico per Astra

**Progetto:** RIV-RUSSA · [halmob01/riv-russa](https://github.com/halmob01/riv-russa)  
**Stato attuale:** prima implementazione integrata con PR #1 su autorizzazione esplicita del docente; consolidamento e limiti in [STATO-KIT.md](../STATO-KIT.md). Il testo seguente conserva l’incarico originale e le relative fasi.  
**Documento di contesto:** [docs/PROGETTO.md](PROGETTO.md).  
**Base sorgente effettiva:** [epica-romanzo](https://github.com/halmob01/epica-romanzo), a sua volta derivata da [sito-game-template1](https://github.com/halmob01/sito-game-template1) / [sito-feudo](https://github.com/halmob01/sito-feudo).  
**Aggiornamento:** 18 ottobre 2026.

> **VINCOLO ARCHITETTURALE MASSIMO:** non stiamo costruendo un motore *per la Rivoluzione russa*. Stiamo costruendo un **kit di realizzazione di giochi didattici autonomo e riutilizzabile**, e «Rivoluzione russa» sarà soltanto uno dei pacchetti di contenuti. Il kit deve comprendere **logica, orchestrazione, interfaccia generica, interazioni, salvataggi, animazioni e sistema di verifiche**: non basta avere un `engine.js` astrattamente generico se per un nuovo gioco occorre riscrivere tutto il resto. Il risultato deve funzionare indipendentemente da contenuti russi, personaggi o immagini storiche.

## 0. Mandato e limiti

**Cosa si chiede ad Astra:** esaminare il codice sorgente reale, pianificare e realizzare in una o più PR *revisionabili* un refactoring/estensione mirati e un esempio dimostrativo indipendente. Presentare prima la mappa delle dipendenze e le modifiche previste, poi procedere con commit verificati. Non cambiare codice del progetto `epica-romanzo` originale; prenderlo come sorgente in lettura. Non modificare `main` in `riv-russa` se non tramite PR approvata dall'utente.

**Cosa NON fare:** realizzare subito i 35 episodi, riempire contenuti russi inventati, disegnare tutte le illustrazioni storiche, imporre framework o server, riscrivere da zero una base già collaudata, costruire una DSL estesa e opaca, cambiare ogni vecchio nome solo per gusto stilistico, dichiarare verificati su iPhone test eseguiti soltanto in un browser emulato, inserire testo di dominio in librerie generiche.

Il risultato atteso è **un kit capace di eseguire un piccolo gioco didattico completo cambiando solo un pacchetto di dati/assets** (vedi §8). Le meccaniche specifiche dell'Atto 0 saranno sviluppate a parte, a progettazione didattica approvata.

## 1. Ricognizione obbligatoria prima di intervenire

Leggere integralmente e confrontare almeno:

- `epica-romanzo/engine.js` (API attuali: `validateStory`, `newSession`, `currentScene`, `select`, `advance`, `recap`, `restore`);
- `epica-romanzo/epica-app.js`, `epica-map.js`, `storie.js`, `index.html`, `stile.css`, `epica.css`;
- test di Epica, inclusi `tests/engine.test.cjs`, `tests/browser-flow.test.cjs`, `tests/visual-smoke.cjs`; workflow esistenti;
- `sito-game-template1/prologo.js`, `mappa.js`, `index.html`, `README.md`;
- `riv-russa/docs/PROGETTO.md`.

**Constatazioni già verificate e da non smentire senza prove:**

1. L'attuale `epica-romanzo/engine.js` **non ha** variabili feudali hardcoded né una logica di game-over su risorsa zero. `story.stats` è già dinamico; gli indicatori sono però vincolati a interi 0–100.
2. Il motore usa una **sequenza lineare di scene** (`session.index`) e tipi `narrative`, `decision`, `reflection`, con esiti immediati `choices[].effects` e `scene.afterEffects`. **Non ha ancora** vere diramazioni condizionali, coda di effetti differiti o stato per atto.
3. `restore` ricostruisce/valida lo stato rigiocando le scelte. Questa proprietà è preziosa: preservarla o sostituirla solo con una soluzione ugualmente verificabile e motivata.
4. Il codice della UI è **meno generico** del motore. `epica-app.js` presenta condizioni hardcoded relative a Ettore, Troia, Penelope, ecc.; `roleSeen` e `roleSelection` sono soprattutto nello strato UI. Rimuovere l'accoppiamento per una vera base riutilizzabile.
5. Le illustrazioni di `epica-map.js` sono SVG derivati dallo stato ma vengono spesso reinseriti via `innerHTML`: questo **sostituisce i nodi DOM**, non anima con continuità una scena persistente.
6. `sito-game-template1/prologo.js` ha helper SVG e scene animate (`pSvg`, `pAnim`, `pMove`, `pFig`, `pTree`, `pWheel`, ecc.). `mappa.js` del template, invece, usa **Canvas**, non SVG: può fornire idee su movimento ed eventi, ma non va copiato come renderer SVG.
7. I vecchi test verificano navigazione, stato, restauri e presenza/variazione del markup. **Non dimostrano** da soli la riuscita delle animazioni su telefono.

Consegnare una **nota d'impatto** che classifica ciascuna componente in `riuso senza modifiche`, `adattamento mirato`, `sostituzione`, motivando le scelte.

## 2. Confini rigorosi dei moduli

Proposta di organizzazione logica (nomi/cartelle adattabili, **responsabilità no**):

```text
src/
  core/            # motore puro, validazione, stati, condizioni, mutazioni
  runner/          # atti, episodi, ruoli, progressione, reconciliazione
  storage/         # registro, salvataggi versionati, export/import
  interactions/    # plugin UI generici: decision, allocation, sources...
  visual/          # stage SVG, layer semantici, animazione/riduzione moto
  shell/           # layout, navigation, feedback, accessibilità
  assessment/      # selezione item, somministrazione, scoring (non la skill)
games/
  riv-russa/       # dati futuri; NON nel motore
  demo-indipendente/ # pacchetto di prova realmente non russo
tests/
docs/
```

Non introdurre import circolari. `core` non deve importare DOM, CSS, GSAP, contenuti, asset né localStorage. `runner` usa `core`, mentre `shell` coordina runtime, renderer e interazioni. `visual` legge descrittori e transizioni, non oggetti di dominio storici.

**Motore autosufficiente** = un pacchetto software documentato che consente di comporre un nuovo gioco funzionante con *sole configurazioni, contenuti, assets e tema grafico*. Non è richiesto che ogni possibile gioco sia esprimibile soltanto con JSON: possono esistere plugin generici riutilizzabili con API stabili. Se serve un nuovo *tipo* di interazione, si aggiunge un plugin, **non** si cabla un singolo episodio nella `shell`.

Compatibilità: web statico e GitHub Pages senza backend obbligatorio; Node per i test; uso da browser mobile e touch. Nessuna dipendenza runtime pesante senza una dimostrazione del beneficio, un criterio di fallback e approvazione motivata.

## 3. Core puro: estensione minima, non riscrittura

Preservare la semantica testata di `newSession`, `select`, `advance`, `restore` ove possibile. Si può mantenere un adapter compatibile con lo schema Epica durante la migrazione.

Nuove capacità indispensabili:

- **Stato dichiarato dal pacchetto:** `actConfig.metrics`, `actors`, `relations`, `flags`, `resources` opzionali. Le metriche non devono essere per forza visibili né costituire voti. Documentare per ciascuna eventuali range e clamp; non confondere indicatori di simulazione con statistiche storiche.
- **Ruoli e mandati:** il ruolo corrente è parte dello stato tracciabile, con capacità, vincoli, informazioni disponibili e azioni lecite dichiarati nel contenuto. Cambiare una tab del pannello dei punti di vista **non** deve di per sé rappresentare un turno di simulazione.
- **Condizioni dichiarative sicure:** predicati elementari (es. confronti, `all`, `any`, `not`, flag, presenza evento), validati con liste consentite; no `eval`, callback JS arbitrarie nei dati, path iniettati, prototype pollution.
- **Mutazioni dichiarative tipizzate:** almeno modifiche metriche, set/clear flag, relazioni, eventuale disponibilità risorse. Le destinazioni devono essere note e valide.
- **Scelte e rami condizionali limitati:** scene alternative/azioni abilitate da condizioni, preservando un percorso raggiungibile e una struttura ispezionabile. Evitare un linguaggio di workflow di complessità non giustificata.
- **Esiti e tracce causali:** ogni transizione restituisce lo stato nuovo, le mutazioni **effettivamente applicate**, il nesso causale con decisioni/eventi e una descrizione visuale astratta; mai applicare mutazioni in fase di render.

**Caso zero/cento:** nessun game-over automatico. Se una condizione deve diventare vera quando una metrica raggiunge una soglia, va descritta nei contenuti e applicata come evento deterministico.

## 4. Persistenza per atto ed effetti differiti

Raccomandazione architetturale: **CourseRunner sopra il core**, non trasformare il core in un monolite dell'intero corso.

- `currentAct`: `actId`, `episodeId`, `roleId`, `metrics`, `relations`, `flags`, `pendingEffects`, `appliedEffectIds`, `exposureFlags`, progressione locale;
- `ledger`: registro logico append-only di scelte, azioni, fonti lavorate, completamento e prove; preservato fra atti, non necessariamente un elenco infinito di snapshot DOM;
- `historySnapshots`: sintesi immutabili degli atti conclusi, per il riepilogo;
- `contentVersion` e `saveSchemaVersion`: versioni indipendenti, chiavi stabili di atti/episodi/decisioni; introdurre una policy dichiarata per migrazioni e salvataggi incompatibili.

Alla fine dell'atto: concludere effetti locali pertinenti, congelare riepilogo e cause, **riconciliare** ai fatti documentati come da `initialState` del nuovo atto, conservare il ledger; impedire che variabili ipotetiche contaminino la cronologia documentata.

**Effetti differiti:** `pendingEffects` sono programmati su transizioni *di simulazione* inequivocabili (es. ingresso nel prossimo episodio o fine turno), non a ogni click o cambio visivo di ruolo. Devono essere:
- deterministici;
- applicati **una volta sola** anche dopo save/restore/replay;
- condizionati con regole validate;
- dotati di un `sourceDecisionId` e spiegazione nel diario;
- associati a un `effectId` stabile e tracciato;
- dotati di comportamento esplicito se la condizione non matura o si esce dall'atto.

La riproduzione ricostruita deve produrre lo stesso stato e le stesse conseguenze. Non fare affidamento sull'ora di sistema per l'esecuzione di mutazioni; timestamp nel ledger solo per usabilità e audit, non come fonte di causalità.

**Diario di causazione:** all'avvio di una nuova sessione mostra un breve riepilogo delle decisioni che spiegano la situazione attuale, con particolare attenzione alle conseguenze differite. Deve distinguere simulazione da fatti storici.

**Backup:** `localStorage` può essere il primo supporto locale, ma aggiungere export/import validati del progresso. Trattare la compatibilità dei salvataggi e la privacy; non promettere sincronizzazione cross-device senza backend. Un JSON/Base64 locale non è una protezione crittografica o un registro attendibile contro manomissioni.

## 5. Interazioni: l'engine non disegna né interpreta gesti

Un episodio dichiara `interactionType` e il payload specifico di un archetipo. Minimo prototipale:
- `choice` / decisione classica;
- `resource_allocation`;
- `role_crisis` / strategia multiruolo;
- `source_comparison` / analisi documenti.

Prevedere punti di estensione per `power_network`, `assembly_vote`, `territory_map` senza implementare subito sette sistemi completi.

**Contratto consigliato:** il plugin UI invia una **azione normalizzata** (es. `{ type:"allocate", allocations: {...} }`), non mutazioni privilegiate liberamente costruite dall'interfaccia. Il core valida la mossa contro il contenuto e calcola gli effetti. Plugin e shell ricevono `{ nextState, appliedChanges, events, feedback }` o equivalente. Gli stessi input devono poter essere testati senza UI.

Il flusso avanzato non deve obbligare ogni episodio al ciclo di 7 fasi: episodi Pivot lunghi e intermezzi Fonte/Ponte brevi, senza gestione di metriche ove superflua.

## 6. Controller visuale SVG — componente prioritario

**NON inserire `EventEmitter` con eventi browser, `CustomEvent` o GSAP dentro `core/engine.js`.** Le funzioni pure del core devono restituire transizioni; `runner/shell` possono notificare al renderer gli eventi. L'event bus, se utile, vive **fuori dal core**.

### Principio

- Scenografie **modulari, persistenti nel DOM mentre si animano**, con `data-layer` / ID semantici standard.
- Varianti in pacchetti di gioco; motore visuale non ha nomi `soviet`, `zar`, `feudo`, `ettore`, ecc.
- Binding dichiarativo tra cambiamenti di stato e *azioni visuali tipizzate*: geometria, posizione, opacità, presenza di elementi, tracciato di relazioni, densità rappresentata, highlight, pannelli di documenti. Non è obbligatorio che ogni numero produca automaticamente una geometria; il mapping grafico va definito e validato a livello di scenografia.
- Animazioni **causali** con stato iniziale, sequenza, stato finale, messaggio interpretativo e possibilità di skip/replay. Le animazioni ornamentali non sostituiscono informazioni; salvataggio e reload ricostruiscono lo stato finale senza richiedere che il movimento si ripeta.
- `prefers-reduced-motion`, fallback statico, accessibilità e tasti/gesti devono lasciare disponibili le stesse informazioni.
- Primitive condivise fra scenografie (persona stilizzata, casa, campo, freccia, edificio, folla, trasporto, pannello, barra o nodo di relazione), ma **nessun simbolo storico specifico** nel visual core.

### Riuso realistico

Dal `sito-game-template1/prologo.js`: helper di composizione SVG, personaggi e trasformazioni se opportuni, dopo averli isolati e tolto naming/temi specifici. Da `epica-map.js`: logica di assemblaggio e identificatori `data-feature`/varianti di stato; **non** trasferire una strategia di sostituzione totale del markup per ogni frame o conseguenza. Da `mappa.js` del feudo: idee su cammini, elementi mobili ed effetti, tenendo conto che è Canvas.

**Famiglie visuali proposte per l'intero corso (non 5–6 per atto):** villaggio/campagna, città/fabbrica, assemblea/istituzione, mappa geografica, rete dei poteri, documento/propaganda. Le varianti di contesto appartengono ai giochi.

CSS/SVG/WAAPI per interventi semplici; GSAP **solo se** una sequenza complessa lo giustifica, con dipendenza esplicita e fallback. Non esiste obbligo di introdurre GSAP per ogni animazione.

### Test obbligatori SVG

Testare *effettiva evoluzione visiva* (stato iniziale/intermedio/finale), aggiornamento coerente delle proprietà e dei layer, replay e skip, ripristino dopo refresh, gestione di animazioni consecutive e dell'interruzione, resize, touch, reduced-motion. Uno smoke test che si limita a trovare `<svg>` non è sufficiente. Browser desktop automatizzato; prova reale su smartphone richiesta prima della validazione finale, non dichiararla completata se non eseguita.

## 7. Verifiche e contenuti: confine rigoroso

Non confondere:
- `assessment/`: motore riutilizzabile di esercizi, selezione, feedback, punteggi e report;
- `games/*/questions`: banche di item, fonti, obiettivi e rubriche;
- **skill `verifiche-didattiche`**: pipeline di audit della qualità degli item (script `audit_questions.py`, checklist, revisione didattica). La skill è QA di authoring, non una dipendenza runtime da caricare nel browser.

Associare a ogni quesito gli obiettivi e `requiredExposureFlags` o uno schema semanticamente equivalente. **Distinguere** l'aver visualizzato una fonte dall'aver svolto l'attività richiesta su di essa. Le verifiche sommative devono riferirsi a conoscenze garantite lungo tutti i percorsi, non a bivi facoltativi.

Non assegnare punti per la fedeltà politica o la produttività di una fazione. Valutazione formativa e sommativa indipendenti dai numeri di simulazione; punteggio di riferimento 0–100 dove previsto dal percorso.

## 8. Criterio di accettazione decisivo: un secondo gioco senza toccare il motore

Oltre a un banco di prova tecnico per Rivoluzione russa, Astra deve fornire **una demo indipendente completa e funzionante** su un tema diverso, per esempio:
- un piccolo gioco di organizzazione di una biblioteca scolastica; oppure
- un mini-corso interattivo sulla sicurezza informatica di base; oppure
- un micro-simulatore di distribuzione delle risorse in una città immaginaria.

La demo deve includere minimo: introduzione animata, scelta con effetti, almeno una decisione che influisca su un episodio successivo, cambio o confronto di prospettive, una prova formativa, salvataggio/ripresa, una piccola scenografia SVG animata e un riepilogo finale.

**Test di riuso obbligatorio:**
1. Il kit si installa/si apre senza caricare `riv-russa` o `epica-romanzo`.
2. Sostituendo solo un pacchetto di `games/` e la configurazione di avvio, la demo funziona senza modificare `src/core`, `src/runner`, `src/shell`, `src/visual` e gli altri componenti comuni.
3. La suite di test di base gira invariata sui due pacchetti; i test di specificità stanno nei rispettivi giochi.
4. Nessun riferimento a nomi propri storici e personaggi di Epica nei moduli comuni; ricerca automatica su codice, non solo verifica visiva.
5. I nuovi minigiochi sono integrabili con un'interfaccia pubblica documentata, senza inserire condizioni `if (gameId === ...)` nel codice comune.
6. Esiste una guida **«Come creare un nuovo gioco dal kit»** che richiede di copiare un esempio di `game pack`, sostituire manifest/asset/testi e lanciare i test; niente copia-incolla dell'engine.
7. Tutti i salvataggi sono namespace/versionati per gioco; avviare la demo alternativa non distrugge i salvataggi di Rivoluzione russa.

Se questi criteri non sono rispettati, **la modifica non è accettabile**, anche se la demo sulla Russia è visivamente buona.

## 9. Strategia di PR e controllo regressioni

Astra può proporre suddivisione diversa se documentata. Sequenza raccomandata, ciascuna verificabile:

- **PR A — Foundation:** import selettivo di Epica, separazione `core`/runner/shell e scenari di test, rimozione hardcode UI, compatibilità esistente, game pack dimostrativo minimo; verifiche Node.
- **PR B — Simulation:** stato per atto, ledger, ruoli, flags, condizioni, effetti differiti, ricostruzione deterministica e backup validato; test di scenari e ripresa.
- **PR C — Interaction & Visual:** plugin per allocazione/fonte/crisi, controller SVG persistente e binding dichiarativo, primo esempio animato con fallback accessibile; test automatizzati e report test manuali.
- **PR D — Reuse & Assessment:** demo indipendente completa e guida di riuso, item formativi con exposure flags, audit e test end-to-end in due game pack.

**Non anticipare i contenuti storici dell'Atto 0** in queste PR. Se Astra necessita di esempi russi per testare gli schemi, usare fixture minime e chiaramente non definitive.

Per ogni PR: descrizione delle modifiche, API e schemi, test prima/dopo, rischi residui, compatibilità, screenshot o registrazione delle animazioni ove utile; niente merge autonomo. Riportare esplicitamente cosa non è stato verificato (es. telefono reale).

### Regressioni minime

- `validateStory`, `select`, `advance`, `restore`, controlli di validità e divieto di doppia scelta dove applicabili.
- Nessuna mutazione dell'input per le transizioni.
- Salvare a metà scena, prima/dopo evento ritardato, a fine atto; reload e replay producono stati equivalenti.
- Effetti differiti **exactly once**; condizioni false non applicano effetti; cambio prospettiva grafica non fa avanzare la simulazione.
- Migrazione di versione o messaggio di recupero esplicito; nessuna perdita silenziosa del progresso.
- Scene e plugin sconosciuti rifiutati con messaggio e non eseguiti.
- Nessuna domanda su contenuti non incontrati; corretta attribuzione punteggi 0–100.
- Animazione terminata sempre allineata allo stato effettivo, anche dopo skip e reduced-motion.
- Prova di indipendenza tematica e salvataggi separati fra due giochi.

## 10. Priorità e questioni da segnalare prima dell'implementazione

**Non negoziabile:** autonomia del kit rispetto a Rivoluzione russa; separazione core/UI/dati; test di riuso su **secondo gioco completo**; animazioni visibili e funzionanti; niente regressioni silenziose.

**Preferenze tecniche, negoziabili con motivazione:** nomi dei moduli, forma esatta dello schema dichiarativo, libreria per le animazioni, ordine delle PR, tecnica storage locale.

**Scelte ancora aperte da non inventare:** font/palette esatti; natura e percentuali storiche delle metriche; durata obbligatoria di ciascun episodio; lingua araba; modalità di scoring sommativo e contenuti finali dell'Atto 0.

**Deliverable finale da Astra:** PR revisionabili + guida riuso + mappa delle dipendenze + report test + demo indipendente funzionante. Spiegare precisamente in quali casi un futuro gioco richiede *solo dati/assets* e in quali richiede la realizzazione di un *nuovo plugin*.

---

## Prompt sintetico per Astra

«Leggi `docs/MODIFICA-MOTORE.md` e `docs/PROGETTO.md` di `halmob01/riv-russa`. Analizza il codice effettivo di `halmob01/epica-romanzo` e degli helper SVG di `halmob01/sito-game-template1`, quindi progetta e implementa tramite PR isolate e senza merge un **kit completo di giochi didattici a contenuti separati**. Il motore, la shell, i minigiochi, i salvataggi, le verifiche e il sistema SVG devono funzionare senza conoscere la Rivoluzione russa. Mantieni dove possibile l'engine puro e i test esistenti; estendi solo quanto serve per ruoli, effetti differiti e atti. Il controller visuale vive fuori dal core. Fornisci una demo non russa realmente eseguibile senza modifiche al motore e dimostra il riuso con test. Non scrivere ora i contenuti definitivi dell'Atto 0. Prima consegna la mappa delle dipendenze e il piano PR, poi procedi all'implementazione incrementale.»
