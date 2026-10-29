# Report tecnico e QA

## Aggiornamento bottega — 20 ottobre 2026

**77/77 test Node** e nuovo test browser `browser-bottega`: 103 confronti al pixel fra i disegni del motore e l'output degli studi originali (57 simboli, 40 combinazioni di figura, 6 folle), tutti a zero differenze; 7 scene di esempio con riproduzione, pausa e finale stabile; galleria a 390 px e movimento ridotto. In CI la PR #15 è verde su WebKit; su Chromium fallisce il passo browser come già su `main` (commit `113d460`), coerente con l'instabilità del test preesistente `browser-original-studies` osservata in locale. Dettagli in [STATO-KIT](STATO-KIT.md).


## Aggiornamento P1 — 20 ottobre 2026

**55/55 test Node e suite browser complete Chromium/WebKit superati localmente**. Nuovi controlli per routing legacy, temi isolati, contesto testuale, lettura progressi senza mutazioni e build LAIKA deterministico (errori e riferimenti risolti). Browser, SHA, comandi, dipendenze locali WebKit, misure e limiti in [HANDOFF-P1](archivio/HANDOFF-P1.md). Nessuna verifica storico-didattica o artistica P2/P3 dichiarata. Le sezioni seguenti conservano le evidenze precedenti.

## Baseline aggiornata P0 — 19 ottobre 2026

Runtime esaminato: `eb6ab8326045add19606e85c1f707ecba6407afa`, dopo il merge #6. [Evidenze e handoff](archivio/P0-BASELINE.md) distinguono le prove locali dalla [CI sullo stesso main](https://github.com/halmob01/riv-russa/actions/runs/39294716760): **48/48 test Node e suite browser Chromium/WebKit superati in CI**. Le sezioni successive conservano lo storico, non il conteggio attuale.

Locale: tre pack validati, build HTML autonomo e otto test Python della skill riusciti. `npm test` non è tutto verde: il caso d'import SVG incontra `spawnSync python3 EPERM`; diagnosi senza isolamento: 47/48 pass, uno bloccato. L'import Python diretto di `human-a` è corretto, ma non sostituisce l'intero test. Suite browser locale bloccata all'apertura porta (`listen EPERM`), nessuna nuova sessione locale riuscita.

La CI copre motion study e galleria Atto 0 oltre alle demo. Pacing con video: Chromium mediana/p95 16,7/16,8 ms, 0 intervalli >50 ms; WebKit 20/40 ms, 11 intervalli >50 ms. Misura registrata, non soglia imposta dal test né attestazione di 60 fps/long task su telefono. Nessuna verifica storico-didattica degli atti LAIKA completata da P0.

## Esito e perimetro

Prima versione del kit integrata tramite PR #1 (merge c07d71e); non è il corso di storia finito. Stato corrente in [STATO-KIT.md](STATO-KIT.md). Le tabelle seguenti conservano lo storico delle verifiche iniziali. Runtime statico senza librerie esterne. Le due demo esercitano gli stessi moduli senza importare contenuti russi o epici.

## Verifiche iniziali (prima integrazione)

| Controllo | Risultato |
|---|---|
| Baseline originale, motore | 11/11 passano |
| Baseline originale, fake browser | 4/5: il test Destini generali usa una progressione fissa non aggiornata ai nuovi episodi |
| Nuova suite Node | 25/25 passano, inclusi gli 11 originali |
| Due pacchetti, tre percorsi ciascuno | Completamento e replay confrontati dopo ogni azione |
| Effetti differiti | Trigger episodio/turno, condizione falsa, retry, scadenza, uscita atto, exactly-once |
| Integrità | Nessuna mutazione degli input, clamp effettivo, rifiuto di mosse/ruoli/allocazioni non consentiti |
| Salvataggi | Namespace distinti, versioni incompatibili, JSON corrotto, azioni impossibili, errore storage |
| SVG con clock controllato | Geometria iniziale/intermedia/finale, identità nodi, interruzione, replay, skip, reduced-motion, ripristino |
| Chromium su GitHub Actions | Due percorsi completi, movimento intermedio reale e nodi persistenti, reload, touch emulato, 320/390/1280 px, reduced-motion, assenza errori JS |
| iPhone reale / Safari | Non eseguito |

Prima esecuzione browser riuscita: [Actions 39152777511](https://github.com/halmob01/riv-russa/actions/runs/39152777511), commit `f14450f`. Il download locale di Chromium ha restituito un archivio non valido; il controllo browser è stato eseguito nel runner GitHub, non dichiarato come prova locale. La revisione successiva aggiunge il controllo delle posizioni effettive dei quesiti su nove seed e la raccolta delle immagini (la prima configurazione ometteva le directory nascoste dagli artifact).

## QA didattica delle fixture

Applicata la skill allegata `verifiche-didattiche(1).skill`: letti SKILL.md, FORMATO e CHECKLIST; esportazione tramite `scripts/export-questions.py`, esecuzione dello script originale `audit_questions.py`, revisione semantica dell'item.

| Obiettivo | Evidenza osservata | Attività |
|---|---|---|
| Distinguere informazioni e limiti di due documenti | Riconoscere una conclusione sostenuta da entrambi, senza inventare causa o generalizzare | Confronto guidato + domanda formativa |
| Comprendere costi e benefici delle scelte | Osservazione di conseguenze e diario | Simulazione; nessun voto assegnato a questa prestazione |

Campione: un quesito per pacchetto, intenzionalmente la stessa fixture di compatibilità. Non sono due prove sommative né una banca variata. Destinatari ipotizzati: adolescenti in lettura autonoma; difficoltà introduttiva. I materiali sono dichiaratamente inventati.

Audit automatico, separatamente per pacchetto: 0 errori, 0 avvisi, chiave valida; corretta non unica più lunga; rapporto lunghezza 0,921. La posizione nel JSON è A, mentre il runtime mescola con seed persistente. Un solo item non permette di stimare bilanciamento statistico o affidabilità di una prova.

Revisione semantica: riscritti i distrattori iniziali per eliminare un'alternativa troppo estrema e domandare una conclusione concreta. Errori diagnostici: attribuzione causale non documentata e generalizzazione dall'esperienza individuale. Grammatica e lunghezza comparabili, motivazione esplicita. Fonte disponibile prima della domanda su tutti i percorsi, controllata anche dal validatore. Pronto come fixture formativa; non validato come verifica scolastica o misura di padronanza.

## Limiti residui dichiarati

- Nessuna prova con studenti, su dispositivo iPhone reale o con screen reader. I controlli touch sono emulati in Chromium.
- Nessuna dichiarazione di framerate minimo per le future scene complesse; la demo usa pochi layer.
- Nessun editor visuale, morphing dei tracciati o simulatore geografico. Le primitive sono forme SVG e binding numerici; scene complesse richiederanno ulteriori componenti generici.
- La crisi multiruolo implementa mandati e azioni lecite, non un sistema di informazioni segrete o negoziazione tra utenti.
- Registro locale di tentativi corrente: Ricomincia sostituisce il salvataggio dopo conferma; esportare per conservare altri tentativi. Non c'è archivio automatico di più partite o sincronizzazione.
- Migrazioni non implementate finché non esiste una seconda versione: incompatibilità visibile con una frase semplice, backup originale conservato nel browser (pulsante di scarico nascosto nel corso LAIKA dal 29 ottobre 2026).
- Sono presenti verifica formativa e punteggio finale delle demo, non criteri sommativi approvati per il corso storico.
- Le due demo condividono deliberatamente l'archetipo; dimostrano configurabilità, non che qualunque futuro gioco richieda soltanto JSON.
- Compatibilità legacy limitata all'API pura originale; la nuova shell richiede il contratto manifest v1.

## Provenienza sorgenti

- `epica-romanzo`: revisione `433cf6cdf7538f101064b83651063b442a84e7ce`.
- `sito-game-template1`: revisione `045975ab71e90b045a37d92a776d6bb53939d6ff`.
- Base `riv-russa`: `cbe041e3ff36cdc71d4eae6078f79f631d1f2d90`.

Nessuna modifica alle repository sorgenti.

## Integrazione animazioni — 19 ottobre

Aggiunte sequenze multitraccia, gruppi annidati, trasformazioni, pausa/ripresa e animazioni specifiche delle scelte. 29 test Node superati, inclusi controlli delle pose finali rispetto al reload, overlap, riferimenti e collisioni tra timeline e binding. Il browser test aggiunge pausa/ripresa effettiva e controllo del movimento dei gruppi. I risultati CI del commit finale sono riportati nella PR. Lo stile delle scene rimane dimostrativo e modificabile dal docente.

## Consolidamento del riuso — 19 ottobre

36 test Node superati localmente su tre pacchetti. Aggiunti namespace dei simboli, pose non neutre, preset, rifiuto di input errati, creazione senza sovrascrittura e verifica di entrambi i rami della terza demo. Pipeline estesa a Chromium e WebKit; risultato sul commit esatto nella PR del consolidamento. Focus, tastiera e visibilità dei pannelli controllati nel contratto browser generico. Nessuna prova su telefono reale o con lettore di schermo dichiarata.

La demo messaggio contiene due quesiti formativi: audit della skill verifiche-didattiche, 0 errori e 0 avvisi, nessuna corretta unica più lunga. Chiavi nel sorgente in prima posizione, rimescolamento affidato al runtime. Revisione semantica: primo item distingue contraddizione osservabile e intenzione presunta; secondo distingue ripetizione e conferma indipendente. Campione tecnico limitato, nessuna stima di affidabilità sommativa.

**Diagnostica in CI (29 ottobre 2026).** Se un test del browser fallisce, `tests/browser.cjs` scrive l'errore anche come annotazione del controllo («Test del browser (chromium|webkit)»): si legge con `gh api repos/…/check-runs/ID/annotations` anche quando i log non sono scaricabili.
