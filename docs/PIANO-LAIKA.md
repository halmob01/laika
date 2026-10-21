# LAIKA — Piano operativo: homepage, Atto 0 e Atto I

Prima stesura: 19 ottobre 2026. **Revisione: 20 ottobre 2026**, base `main` a `21504d5` (merge della PR #15, bottega). **Aggiornamento 21 ottobre 2026:** homepage di produzione realizzata e approvata (PR #19); resta di P3 l'unità A0.1.

**Questo documento pianifica il lavoro; non dichiara implementate le modifiche.** Stato delle fasi in §4. P0 e P1 sono concluse ([P0-BASELINE](P0-BASELINE.md), [HANDOFF-P1](HANDOFF-P1.md)); la parte tecnica di P2 è stata sostituita dalla bottega (§3, «Identità e illustrazioni»). Nessun merge automatico: la qualità visiva richiede revisione dell'utente.

**Cosa è cambiato con la revisione del 20 ottobre.** Le illustrazioni non si disegnano più scena per scena: si compongono con la [bottega](../bottega/README.md) (catalogo di disegni neutri, figura articolata, formazioni, azioni) scrivendo **schede scena** JSON. Lo stile di riferimento sono i tre studi originali forniti dall'utente (`prototypes/laika-studi-originali/`), riprodotti al pixel dal motore. Le figure organiche v2 non sono più la base dei personaggi. Di conseguenza le fasi successive chiedono meno disegno e più regia, e una parte del lavoro può passare a modelli meno costosi (§7).

Leggere insieme [brief di produzione](BRIEF-HOME-ATTI.md) e [incarichi per gli agenti](INCARICHI-LAIKA.md). I tre documenti sono il riferimento operativo per questo incremento; non cancellano la storia delle decisioni precedenti.

## 1. Risultato da consegnare

Un sito LAIKA riconoscibile e animato, con homepage di produzione, accesso e ripresa del percorso, Atto 0 «La terra e lo zar» e Atto I «L'impero in crisi», giocabili da inizio a fine e verificati su desktop e smartphone. Atto I significa il 1904–1907: non rinominare l'introduzione del 1861 in Atto I per accorciare il lavoro.

Il kit deve continuare a funzionare con i giochi dimostrativi non storici. Asset, contenuti, palette e regia di LAIKA rimangono nel pacchetto LAIKA. L'obiettivo non è completare tutti gli atti, costruire un CMS o aggiungere una nuova libreria di animazione.

Due traguardi:

1. **Prova di qualità:** homepage e un'unità completa dell'Atto 0, con grafica e movimento rappresentativi. Serve una revisione visiva prima di moltiplicare le scene.
2. **Prima versione completa:** homepage, quattro unità dell'Atto 0, quattro dell'Atto I, fonti, verifiche formative, confronto storico e salvataggi affidabili.

## 2. Stato reale e review indipendente

| Area | Presente | Lavoro necessario |
|---|---|---|
| Motore | Sei tipi di episodio, effetti immediati/differiti, validazione, assessment, ledger e salvataggi | Integrazione del prodotto; piccole estensioni presentazionali, non una riscrittura |
| Motion | Composizione SVG dichiarativa, coreografia, camera, gruppi/repliche e controlli del ciclo di vita | Regia e asset animabili, dimostrazione espressiva e verifica su dispositivi |
| Brand | Palette, riferimenti, proposte e due prototipi home | Selezione, tipografia distribuibile, responsive e accessibilità di produzione |
| Illustrazioni | Bottega: 77 disegni a catalogo con epoca (architettura, ambienti, mezzi, infrastrutture, atmosfera, oggetti, luoghi monumentali disegnati a mano, folla lontana), figura a 14 giunture con 25 pose e 13 varianti, 10 formazioni, 21 azioni, 8 scene di esempio | Disegni mancanti per gli atti (ambienti urbani, caserma, ufficio, interni), schede scena degli episodi, gate visivo dell'utente |
| Corso | Documento progettuale e studi | Pacchetto storico effettivo: gli esempi del kit non sono il corso LAIKA |
| Homepage | Home di produzione (PR #19): hero con tre scene della bottega, impaginazione costruttivista, CTA e ripresa reali, stato in sola lettura | Prova su WebKit e telefono reale; fascicoli cliccabili quando gli atti esistono |
| Verifica | 81 test Node; confronto al pixel bottega/studi (122 confronti) | Il test instabile `browser-original-studies` è stato rimosso (ridondante con `laika-originals.test.js`); suite Chromium locale verde |

Sono stati esaminati documenti, manifest, moduli del motore, test, prototipi e materiali grafici. Sono state viste le immagini di riferimento e rese le figure organiche e le scene dello studio. La homepage è stata esaminata anche nel sorgente: non scambiare questa analisi per una verifica del layout in browser.

Le indicazioni «PR #4 non unita» sono superate dal merge. P0 ha aggiornato `STATO-KIT.md`, `REPORT-TEST.md`, il cappello di `MOTION.md` e il riferimento palette in `PROGETTO.md`; il codice esaminato arriva a 1200 layer, 700 track, 30 secondi, 24 cicli e 32 keyframe. Sono limiti di validazione, **non budget artistici da riempire**. La CI del main aggiornato supera 48 test e i percorsi browser Chromium/WebKit; limiti delle prove locali e pacing WebKit sono documentati in P0. La vecchia palette in `PROGETTO.md` è stata marcata come antecedente del brand successivo. Le restrizioni del vecchio incarico di prototipazione non sono un divieto permanente di integrare il prodotto.

Aggiornamento fonti del 19 ottobre 2026: l'utente ha fornito «La Rivoluzione Russa.docx» e «Dalla modernità alla contemporaneità.docx», con priorità esplicita agli appunti «La Rivoluzione Russa»; «Dalla modernità alla contemporaneità» resta la cornice concettuale. I libri e gli altri materiali aggiunti successivamente servono solo come eventuale approfondimento, confronto e verifica, secondo il dossier aggiornato. Gli originali sono in [references/fonti](../references/fonti/README.md); [FONTI-LAIKA](FONTI-LAIKA.md) ne registra gerarchia, stato e criteri d'uso. È consentito integrare con ricerche online e chiedere all'utente altri libri quando servono. L'acquisizione e l'inventario non sostituiscono la verifica storica puntuale prevista nelle fasi contenuti. La skill `verifiche-didattiche` fornita dall'utente è ora inclusa integralmente in [`.agents/skills/verifiche-didattiche`](../.agents/skills/verifiche-didattiche/SKILL.md). Gli otto test Python del pacchetto sono superati; questo verifica lo strumento, non i contenuti LAIKA. Applicare audit automatico su domande normalizzate e revisione storico-didattica separata nelle fasi contenuti; la struttura e il lavoro tecnico possono procedere.

## 3. Decisioni ferme per gli esecutori

### Impiego delle fonti

Gli appunti «La Rivoluzione Russa» guidano temi, sequenza e obiettivi. Gli agenti devono consultare i materiali anche per frasi da citare, aneddoti e dettagli precisi, non soltanto per una bibliografia finale. Registrare ogni prelievo e il suo contesto secondo [FONTI-LAIKA](FONTI-LAIKA.md) e la scheda di [FONTI-MATRICE-LAIKA](FONTI-MATRICE-LAIKA.md). Considerare Sheila Fitzpatrick se conosciuta dall'agente: conoscenza pregressa utile a ricerca e confronto, opera/edizione ancora da aggiungere; non inventare citazioni o pagine senza riscontro.

### Identità e illustrazioni

- Adottare la direzione crema, rosso, nero e blu attenuato del brand recente e i riferimenti effettivi. Il prototipo v2 è una base, non una specifica pixel-perfect. Niente 3D, gradienti volumetrici, neon, effetti da videogioco o animazioni generiche applicate a tutto.
- Gli asset forniti riducono il lavoro, **non limitano la qualità**. Si possono migliorare, sostituire e creare illustrazioni quando il caso d'uso lo richiede. Conservare gli originali nei prototipi; creare le versioni di produzione nel pacchetto.
- **Personaggi: figura articolata della bottega** (`bottega/figura/`), derivata dallo studio personaggi originale: 14 giunture, pose e varianti come dati, oggetti in mano. Si scelgono posa, variante, ruolo e oggetti; non si disegnano figure nuove. Una posa, una variante o un oggetto mancanti si aggiungono con la procedura del README della bottega. Le figure organiche v2 restano in archivio come riferimento; un'eventuale «pelle» diversa si applica allo stesso scheletro, senza cambiare le schede scena.
- **Ambienti, mezzi, oggetti: catalogo della bottega.** Un disegno mancante si chiede come kit con [CONTRATTO-KIT](../bottega/CONTRATTO-KIT.md), si importa e si verifica al pixel; non si improvvisa dentro una scena.
- Approvare prima pose e scena campione; poi moltiplicare le scene. La competenza dell'agente non sostituisce il controllo visivo dell'utente.
- Il kit contiene oggetti di epoche diverse: non usare razzi, grattacieli sovietici, stelle rosse e apparati successivi nel 1861–1905. La coda del pane studiata resta per il 1917. Il cane LAIKA può essere un segno di marca esterno alla scena storica; non è una presenza nel 1861.
- `Propaganda` ha una licenza personale non risolta per la distribuzione: verificare il diritto d'uso prima del rilascio. Nel frattempo usare un wordmark testuale provvisorio dichiarato, senza presentarlo come logo definitivo. Corpo e UI: Roboto Condensed locale, con file e licenza della distribuzione ufficiale verificati. Non introdurre altre famiglie per gusto dell'esecutore.

### Architettura e accesso

- `index.html` diventa homepage LAIKA. `play.html?game=laika` ospita il player generico; gli esempi restano accessibili con `play.html?game=biblioteca` e analoghi. Conservare i vecchi URL `index.html?game=...` tramite inoltro compatibile prima dell'avvio della home, preservando il parametro e gli eventuali parametri supportati.
- Un solo corso `laika`, con due atti nel manifest: non due giochi separati. Il completamento dell'Atto 0 porta al confronto storico e poi all'Atto I con reset dello stato simulato previsto dal motore.
- `site/laika/` contiene home, tema, font e identità. `games/laika/` contiene contenuti, asset e regie. `src/` resta generico: nessuna condizione su `game.id === 'laika'`, nessuna forma umana disegnata nel motore.
- Aggiungere al registro dei giochi un oggetto opzionale `presentation: {stylesheet, homeHref}`. Solo percorsi locali relativi validati; niente CSS o script arbitrario nel JSON del corso. Il bootstrap applica il tema scelto e un collegamento di ritorno. I giochi senza l'oggetto mantengono il comportamento precedente.
- Per i cartigli degli episodi introdurre il solo metadato opzionale `context: {kind, dateLabel?, placeLabel?}`; `kind` è `documented`, `simulation`, `source` o `assessment`. Validarlo nello schema e renderizzarlo come testo con etichette italiane. Non influenza punteggi o transizioni. Serve a distinguere esplicitamente fatto e modello, non a introdurre regole storiche nel core.
- La home legge lo stato mediante un adattatore pubblico del runner/storage: nessun accesso a chiavi interne di localStorage e nessun secondo parser dei salvataggi. Lo stato mostrato distingue nuovo percorso, ripresa valida, completamento e salvataggio incompatibile; non presenta un pulsante Riprendi funzionante su dati invalidi.
- Nella prima versione «Inizia» avvia Atto 0; «Riprendi» riprende il punto valido. Non implementare accessi arbitrari a episodi o un editor di progressi. I fascicoli spiegano il percorso; Atto I diventa raggiungibile attraverso la progressione. Un eventuale riavvio richiede l'azione esplicita già prevista dal player e non cancella silenziosamente i dati.

### Authoring leggero

Struttura destinazione (nuovi percorsi da creare, non file già esistenti):

```
site/laika/                 home.js, home.css, theme.css, fonts/, hero.config.json, scene/ (schede del hero), hero.json (generato)
games/laika/
  course.json              indice authoring, ordine atti e metadati
  source/acts/              atto-0.json, atto-1.json
  source/scene/             schede scena della bottega (elencate in course.scene)
  questions/               atto-0.json, atto-1.json
  sources.json             provenienza e uso delle fonti
  game.json                manifest generato compatibile con il kit
scripts/build-laika.js      assemblaggio deterministico, senza nuovo runtime
bottega/                    disegni, figura, formazioni, azioni (comuni a tutti i progetti)
```

Il build compone le schede elencate in `course.scene` con il tema `laika` e inserisce nel manifest palette, motivi, simboli e stage. L'`id` della scheda è lo `stageId` dell'episodio, l'`id` di una sequenza il suo `motionId`.

Il build risolve riferimenti ai file e agli item delle domande, assembla e valida con gli strumenti del kit. Nessun linguaggio di template, import dinamico di codice dal contenuto o libreria di build aggiuntiva. I file sorgente sono l'autorità; `game.json` si rigenera e non si risolve a mano nei conflitti. Una seconda esecuzione produce gli stessi byte.

Usare i sei tipi esistenti: `narrative`, `choice`, `resource_allocation`, `role_crisis`, `source_comparison`, `assessment`. Le quattro unità didattiche di un atto possono contenere più episodi runtime. Identificatori stabili, ad esempio `a0-u01-quadro`, `a0-u01-scelta`, `a0-u01-confronto`. Nessun plugin assemblea o rete politica finché queste unità non dimostrano un limite concreto.

### Motion: regia prima di nuove API

Le scene si scrivono come schede della bottega: azioni (`walk`, `gather`, `speak`, `raise`, `queue`, `confront`, `replace`, `reveal`, `camera`…) e formazioni, non tracce o coordinate di giunture. Controllo con `npm run scena`, anteprima nella galleria della bottega. Se un movimento necessario non esiste, si aggiunge un'azione alla bottega con test, non una traccia a mano nella scena. Non copiare il runtime semplificato incorporato in `kit-forme-laika.html`.

Ogni scena dichiara ingresso, momento informativo, risposta alla scelta e posa finale leggibile. Movimenti persistenti derivano dallo stato mediante binding o nuova composizione; la posizione alla fine di una timeline non è un salvataggio. Non animare sullo stesso canale una proprietà posseduta da un binding. Il reload deve ricostruire il medesimo significato visivo dello skip.

Budget progettuale iniziale: introduzioni 6–12 secondi, risposte 1–4 secondi, nessuna attesa obbligatoria per leggere o operare. Folle in primo piano 6–12 personaggi articolati; dietro, 12–24 silhouette semplificate o gruppi. Non sono nuovi limiti del motore: aumentare solo dopo una misura. Animare pochi elementi significativi, fermare fuori viewport e a pagina nascosta, non riprodurre tre folle contemporaneamente nella home.

Reduced motion conserva tutti i contenuti e le conseguenze in una posa statica significativa, senza camera in movimento o oscillazioni continue. I controlli pausa, ripresa, skip e replay riguardano il movimento; il replay non ripete effetti didattici né mutazioni.

## 4. Fasi, dipendenze e cancelli

| Fase | Stato | Risultato e confine | Claude | GPT | Uscita richiesta |
|---|---|---|---|---|---|
| P0 | conclusa (#7) | Baseline, documenti, inventario asset/font e fonti | — | — | — |
| P1 | conclusa (#10) | Routing home/player, tema per pack, lettura progressi, build e scheletro LAIKA | — | — | — |
| P2 | tecnica conclusa (#15); gate aperto | Bottega: disegni, figura, azioni, schede scena. Resta la **tavola pose per il gate dell'utente** | Opus 5.5 per la tavola; Sonnet 5.5 per pose o varianti aggiuntive | GPT-6.1 Sol medium | Pose approvate dall'utente |
| P2b | da fare | Disegni mancanti per Atto 0 (ambienti urbani, caserma, ufficio, interni) via kit | Sonnet 5.5 (kit, test); Opus 5.5 se il test resta instabile | GPT-6.1 Sol medium/high | CI verde su Chromium e WebKit; disegni a catalogo con epoca |
| P3 | in corso: home conclusa (#19), A0.1 da fare | Homepage di produzione con hero come scheda scena + unità A0.1 completa | Opus 5.5 | GPT-6.1 Sol high | Traguardo «prova di qualità» desktop/mobile, gate utente |
| P4 | — | Atto 0 completo: quattro unità e sei item formativi | Sonnet 5.5 (schede, contenuti approvati); review storica Opus 5.5 | GPT-6.1 Sol medium; review GPT-6 Astra high | Percorsi, fonti e confronto finale verificati |
| P5 | — | Atto I completo (1904–1907), corteo e assemblea come schede scena | Sonnet 5.5; Opus 5.5 per A1.2–3 e review | GPT-6.1 Sol medium/high; review Astra | 1904–1907 completo, reset tra atti e continuità salvata |
| P6 | — | QA integrata, performance, accessibilità, regressioni e consegna | Opus 5.5; review indipendente dell'altra famiglia | GPT-6.1 Sol high; review Astra | Evidenze riproducibili, revisione utente, nessun merge autonomo |
| P7 | — | Procedura per il prossimo atto e backlog verificato | Sonnet 5.5 | GPT-6.1 Sol medium | Handoff e modello authoring utilizzabile senza rifare il motore |

La PR #14 (P2 con figure disegnate a mano) è stata chiusa: sostituita dalla bottega. La PR #16 (kit infrastrutture e atmosfera) è la prima prova della procedura «famiglia nuova» e fa parte di P2b.

**Regola per la review:** chi rivede non è chi ha scritto. Quando l'autore è un modello Claude, rivede preferibilmente un modello GPT, e viceversa; in mancanza, almeno un'istanza nuova senza il contesto dell'autore.

Ordine: P2 (gate) → P2b → P3 → P4 → P5 → P6 → P7. La home di P3 può partire in bozza mentre il gate P2 è aperto, perché usa la bottega già unita; non si moltiplicano però le scene degli atti prima dell'approvazione. P2b e il dossier storico procedono in parallelo su branch distinti, senza toccare gli stessi file.

P2/P3 non si considerano riuscite soltanto con screenshot o test verdi: consegnare una preview utilizzabile e registrazioni brevi di movimento e reduced motion. L'utente decide la qualità artistica; l'agente può continuare lavoro indipendente su fonti, non propagare una direzione visiva respinta.

## 5. Verifica e criteri di completamento

- Eseguire `npm test` e `npm run test:browser` dopo le modifiche rilevanti; test mirati durante il lavoro. Nessun conteggio di test copiato da una review precedente.
- Percorsi: primo accesso, ingresso dalla home, ripresa in mezzo a una scelta e dopo il suo esito, ritorno alla home, completamento Atto 0, confronto finale, ingresso Atto I con reset, completamento corso, replay visivo, reload, riavvio esplicito e salvataggio incompatibile.
- Testare almeno due itinerari didattici contrastanti per atto, i rami condizionati e gli effetti differiti. Le scelte non possono bloccarsi per combinazioni valide dello stato.
- Tutte le domande sono raggiungibili dopo l'esposizione ai contenuti richiesti; sei item per atto, formativi. Non vendere il punteggio 0–100 esistente come voto sommativo validato. Nessun premio per una posizione politica.
- Viewport: 360×800, 390×844, 768×1024 e 1440×900; Chromium e WebKit, più una prova su telefono reale quando disponibile. Registrare browser, dispositivo, viewport, commit e limiti della prova. Emulazione desktop non equivale a telefono reale.
- Tastiera completa, focus visibile, nessuna trappola, titoli e stato comprensibili senza SVG, controlli motion etichettati, contrasto WCAG AA del testo; nessuna informazione affidata solo al colore. Ridimensionamento testo al 200%, portrait/landscape e reduced motion.
- Misurare la scena più costosa con strumenti browser: obiettivo 60 fps sul dispositivo dichiarato, nessun long task >50 ms ripetuto durante la riproduzione normale; verificare teardown e assenza di RAF/timer orfani. Se fallisce, ridurre primo piano animato, tracce simultanee e complessità dei path prima di inventare infrastruttura.
- Budget iniziale home: ≤500 KB trasferiti per HTML/CSS/JS/font/asset necessari al primo quadro, compressi, esclusi gli atti non ancora aperti. Riportare misure, non stime; caricare il corso al bisogno. Una deroga richiede motivazione concreta, non «il computer dell'agente va veloce».
- Documento di evidenza con URL preview, SHA, comandi e risultati, immagini desktop/mobile, video di 15–30 s, un caso reduced motion e limiti noti. Non dichiarare una verifica browser riuscita se il browser non è installato o il job è ancora in coda.

## 6. Come continuare con gli atti successivi

Per ogni nuovo atto: (1) dossier fonti e obiettivi; (2) quattro o meno unità con meccaniche esistenti; (3) storyboard e inventario asset: per ogni scena, quali voci del catalogo della bottega servono, con epoca compatibile, e quali disegni mancano (da chiedere con CONTRATTO-KIT prima di scrivere le scene); (4) una unità verticale; (5) review storica e visiva; (6) completamento, esposizioni e verifiche; (7) prove di salvataggio e regressioni; (8) PR con evidenze e richiesta di revisione.

Non aggiungere un tipo di interazione perché compare in un'idea. Aprire una decisione architetturale solo con una scena concreta impossibile da esprimere bene, due usi plausibili, contratto dati minimo e costo di mantenimento. Non fare un DSL per una sola scena.

Prima di aggiungere l'Atto II a una versione già distribuita, implementare e testare la compatibilità **append-only** dei salvataggi: l'attuale contentVersion esatta non basta. Conservare il vecchio save, verificare che il prefisso di contenuti e regole già giocati sia equivalente, rieseguire il ledger con il motore e continuare dal nuovo atto. Se la verifica fallisce, offrire riavvio esplicito con spiegazione, senza perdere silenziosamente i dati. Non costruire ora un framework universale di migrazioni.

Il brief del nuovo atto deve fissare: periodo e calendario, quattro obiettivi osservabili, attori/ruoli, scelte e limiti del modello, trasformazioni visive, fonti, sei item formativi motivati, asset mancanti, percorso di test e reset. Riutilizzare la struttura dell'Atto 0, non duplicare il runtime.

## 7. Uso dei modelli e controllo dei costi

Raccomandazioni operative, non promesse di qualità o costo. Valgono in Claude (app, Claude Code) e in Codex. Con la bottega quasi tutto il lavoro sulle scene è **scelta e composizione** guidata da `AGENTS.md`, errori leggibili ed esempi: per questo le fasi di produzione (P4, P5, P7) possono andare a modelli di fascia media.

| Compito | Claude | GPT | Confine |
|---|---|---|---|
| Schede scena, contenuti già progettati, test mirati, kit di disegni con il contratto | Sonnet 5.5 | GPT-6.1 Sol / medium | Un incarico alla volta, file autorizzati e criteri già decisi |
| Home, regia della scena campione, estensioni del motore o della bottega, debugging difficile, test instabili | Opus 5.5 | GPT-6.1 Sol / high | Aumentare solo se il problema resta irrisolto |
| Review architetturale, critica visiva e storico-didattica prima di replicare | Opus 5.5 (se l'autore è GPT) | GPT-6 Astra / high (se l'autore è Claude) | Leggere diff, prova e fonti; non riscrivere durante la review |
| Inventari, rinomina ID, serializzazione di testi approvati, controlli meccanici | Haiku 5.5 | GPT-6 Luna / low o medium | Nessuna decisione storica, artistica o architetturale autonoma |

Se usi un solo modello: Opus 5.5 o GPT-6.1 Sol / high per P3 e P6, Sonnet 5.5 o GPT-6.1 Sol / medium per il resto. Fable 5.1 e le impostazioni Max/Ultra non servono come impostazione ordinaria: riservarli a un blocco che i modelli sopra non risolvono. «Agente meno competente» significa affidargli un contratto più preciso, non chiedergli di decidere dettagli lasciati aperti.

**Prova da fare:** affidare a Sonnet 5.5 (o a GPT-6.1 Sol medium), con il solo `AGENTS.md`, una scheda scena nuova non presente negli esempi. Se la porta a `npm run scena` valida e leggibile senza aiuto, l'assegnazione di P4–P5 sopra è confermata; altrimenti si corregge la documentazione della bottega, non si alza il modello.

Riferimenti consultati il 19 ottobre 2026 per i modelli GPT: [Model selection](https://developers.openai.com/api/docs/guides/model-selection), [Models in ChatGPT and Codex](https://learn.chatgpt.com/docs/models). Disponibilità e selettori dipendono dal client e dall'account; le assegnazioni sono giudizio progettuale.

## 8. Disciplina di consegna

Una fase per PR, branch dedicato dalla base aggiornata. Niente force-push su main, niente merge automatico, niente modifiche concorrenti allo stesso file da agenti diversi. Un reviewer legge prima le evidenze, poi il diff. Correzioni visive e di contenuto vanno riportate nel registro decisioni, non mascherate come semplici refactor.

Ogni handoff contiene: SHA di base e finale, obiettivo, file modificati, decisioni e scostamenti, comandi eseguiti, risultati, preview, cosa non è stato verificato e prossimo incarico. Gli asset originali restano disponibili; il manifest generato si rigenera dopo un conflitto. Le proposte di questo piano diventano «completate» nei documenti di stato soltanto dopo la relativa evidenza.
