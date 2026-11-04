# LAIKA — Metodo di lavoro

Come si costruisce LAIKA: architettura, regia, verifiche, uso dei modelli e consegna. Viene dal piano operativo del 19–21 ottobre 2026 (`archivio/PIANO-LAIKA.md`), senza lo stato delle fasi, che ora sta in [STATO](STATO.md), e senza i riquadri superati. Le regole che non si toccano sono in testa ad [AGENTS.md](../../AGENTS.md).

## 1. Architettura

### Identità e illustrazioni

- Adottare la direzione crema, rosso, nero e blu attenuato del brand recente e i riferimenti effettivi. Il prototipo v2 è una base, non una specifica pixel-perfect. Niente 3D, gradienti volumetrici, neon, effetti da videogioco o animazioni generiche applicate a tutto.
- Gli asset forniti riducono il lavoro, **non limitano la qualità**. Si possono migliorare, sostituire e creare illustrazioni quando il caso d'uso lo richiede. Conservare gli originali nei prototipi; creare le versioni di produzione nel pacchetto.
- **Personaggi: figura articolata della bottega** (`bottega/figura/`), derivata dallo studio personaggi originale: 14 giunture, pose e varianti come dati, oggetti in mano. Si scelgono posa, variante, ruolo e oggetti; non si disegnano figure nuove. Una posa, una variante o un oggetto mancanti si aggiungono con la procedura del README della bottega. Le figure organiche v2 restano in archivio come riferimento; un'eventuale «pelle» diversa si applica allo stesso scheletro, senza cambiare le schede scena.
- **Ambienti, mezzi, oggetti: catalogo della bottega.** Un disegno mancante si chiede come kit con [CONTRATTO-KIT](../../bottega/CONTRATTO-KIT.md), si importa e si verifica al pixel; non si improvvisa dentro una scena.
- Approvare prima pose e scena campione; poi moltiplicare le scene. La competenza dell'agente non sostituisce il controllo visivo dell'utente.
- Il kit contiene oggetti di epoche diverse: non usare razzi, grattacieli sovietici, stelle rosse e apparati successivi nel 1861–1905. La coda del pane studiata resta per il 1917. Il cane LAIKA può essere un segno di marca esterno alla scena storica; non è una presenza nel 1861.
- `Propaganda` ha una licenza personale non risolta per la distribuzione: verificare il diritto d'uso prima del rilascio. Nel frattempo usare un wordmark testuale provvisorio dichiarato, senza presentarlo come logo definitivo. Corpo e UI: Roboto Condensed locale, con file e licenza della distribuzione ufficiale verificati. Non introdurre altre famiglie per gusto dell'esecutore.

### Architettura e accesso

- `index.html` diventa homepage LAIKA. `play.html?game=laika` ospita il player generico; gli esempi restano accessibili con `play.html?game=biblioteca` e analoghi. Conservare i vecchi URL `index.html?game=...` tramite inoltro compatibile prima dell'avvio della home, preservando il parametro e gli eventuali parametri supportati.
- Un solo corso `laika`, con gli atti nel manifest: non giochi separati. Il completamento di un atto porta al confronto storico e poi all'atto successivo con reset dello stato simulato previsto dal motore.
- `site/laika/` contiene home, tema, font e identità. `games/laika/` contiene contenuti, asset e regie. `src/` resta generico: nessuna condizione su `game.id === 'laika'`, nessuna forma umana disegnata nel motore.
- Aggiungere al registro dei giochi un oggetto opzionale `presentation: {stylesheet, homeHref}`. Solo percorsi locali relativi validati; niente CSS o script arbitrario nel JSON del corso. Il bootstrap applica il tema scelto e un collegamento di ritorno. I giochi senza l'oggetto mantengono il comportamento precedente.
- Per i cartigli degli episodi introdurre il solo metadato opzionale `context: {kind, dateLabel?, placeLabel?}`; `kind` è `documented`, `simulation`, `source` o `assessment`. Validarlo nello schema e renderizzarlo come testo con etichette italiane. Non influenza punteggi o transizioni. Serve a distinguere esplicitamente fatto e modello, non a introdurre regole storiche nel core.
- La home legge lo stato mediante un adattatore pubblico del runner/storage: nessun accesso a chiavi interne di localStorage e nessun secondo parser dei salvataggi. Lo stato mostrato distingue nuovo percorso, ripresa valida, completamento e salvataggio incompatibile; non presenta un pulsante Riprendi funzionante su dati invalidi.
- Nella prima versione «Inizia» avvia l'Atto I; «Riprendi» riprende il punto valido. Non implementare accessi arbitrari a episodi o un editor di progressi. I fascicoli spiegano il percorso; Gli atti successivi diventano raggiungibili attraverso la progressione. Un eventuale riavvio richiede l'azione esplicita già prevista dal player e non cancella silenziosamente i dati.

### Authoring leggero

Struttura destinazione (nuovi percorsi da creare, non file già esistenti):

```
site/laika/                 home.js, home.css, theme.css, fonts/, hero.config.json, scene/ (schede del hero), hero.json (generato)
games/laika/
  course.json              indice authoring, ordine atti e metadati
  source/acts/              un file per atto (atto-1.json, …; ID tecnici da decidere)
  source/scene/             schede scena della bottega (elencate in course.scene)
  questions/               un file per atto
  sources.json             provenienza e uso delle fonti
  game.json                manifest generato compatibile con il kit
scripts/build-laika.js      assemblaggio deterministico, senza nuovo runtime
bottega/                    disegni, figura, formazioni, azioni (comuni a tutti i progetti)
```

Il build compone le schede elencate in `course.scene` con il tema `laika` e inserisce nel manifest palette, motivi, simboli e stage. L'`id` della scheda è lo `stageId` dell'episodio, l'`id` di una sequenza il suo `motionId`.

Il build risolve riferimenti ai file e agli item delle domande, assembla e valida con gli strumenti del kit. Nessun linguaggio di template, import dinamico di codice dal contenuto o libreria di build aggiuntiva. I file sorgente sono l'autorità; `game.json` si rigenera e non si risolve a mano nei conflitti. Una seconda esecuzione produce gli stessi byte.

Tipi di episodio: `narrative`, `choice`, `resource_allocation`, `role_crisis`, `source_comparison`, `assessment` e `turn_game` (motore a turni). Ogni unità si costruisce con il gioco indicato nel [canone](CANONE.md); i sei tipi originari servono per racconto, fonti e verifiche dentro o intorno al gioco. Le unità didattiche di un atto possono contenere più episodi runtime. Gli identificatori degli episodi derivano dal **nome stabile** dell'unità nel canone, mai dal suo numero: per esempio `a1-citta-salario` (regola del riordino, applicata il 4 novembre 2026: prima erano `a1-u2-salario` e simili). Le meccaniche nuove (decisioni sui gruppi, punti azione, code…) entrano nel motore generico con test, dopo una scheda di gioco approvata.

### Motion: regia prima di nuove API

Le scene si scrivono come schede della bottega: azioni (`walk`, `gather`, `speak`, `raise`, `queue`, `confront`, `replace`, `reveal`, `camera`…) e formazioni, non tracce o coordinate di giunture. Controllo con `npm run scena`, anteprima nella galleria della bottega. Se un movimento necessario non esiste, si aggiunge un'azione alla bottega con test, non una traccia a mano nella scena. Non copiare il runtime semplificato incorporato in `kit-forme-laika.html`.

Ogni scena dichiara ingresso, momento informativo, risposta alla scelta e posa finale leggibile. Movimenti persistenti derivano dallo stato mediante binding o nuova composizione; la posizione alla fine di una timeline non è un salvataggio. Non animare sullo stesso canale una proprietà posseduta da un binding. Il reload deve ricostruire il medesimo significato visivo dello skip.

Budget progettuale iniziale: introduzioni 6–12 secondi, risposte 1–4 secondi, nessuna attesa obbligatoria per leggere o operare. Folle in primo piano 6–12 personaggi articolati; dietro, 12–24 silhouette semplificate o gruppi. Non sono nuovi limiti del motore: aumentare solo dopo una misura. Animare pochi elementi significativi, fermare fuori viewport e a pagina nascosta, non riprodurre tre folle contemporaneamente nella home.

Reduced motion conserva tutti i contenuti e le conseguenze in una posa statica significativa, senza camera in movimento o oscillazioni continue. I controlli pausa, ripresa, skip e replay riguardano il movimento; il replay non ripete effetti didattici né mutazioni.

## 2. Verifica e criteri di completamento

- Eseguire `npm test` e `npm run test:browser` dopo le modifiche rilevanti; test mirati durante il lavoro. Nessun conteggio di test copiato da una review precedente.
- Percorsi: primo accesso, ingresso dalla home, ripresa in mezzo a una scelta e dopo il suo esito, ritorno alla home, completamento dell'Atto I, confronto finale, passaggio all'atto successivo con reset quando esisterà, completamento corso, replay visivo, reload, riavvio esplicito e salvataggio incompatibile.
- Testare almeno due itinerari didattici contrastanti per atto, i rami condizionati e gli effetti differiti. Le scelte non possono bloccarsi per combinazioni valide dello stato.
- Tutte le domande sono raggiungibili dopo l'esposizione ai contenuti richiesti; sei item per atto, formativi. Non vendere il punteggio 0–100 esistente come voto sommativo validato. Nessun premio per una posizione politica.
- Viewport: 360×800, 390×844, 768×1024 e 1440×900; Chromium e WebKit, più una prova su telefono reale quando disponibile. Registrare browser, dispositivo, viewport, commit e limiti della prova. Emulazione desktop non equivale a telefono reale.
- Tastiera completa, focus visibile, nessuna trappola, titoli e stato comprensibili senza SVG, controlli motion etichettati, contrasto WCAG AA del testo; nessuna informazione affidata solo al colore. Ridimensionamento testo al 200%, portrait/landscape e reduced motion.
- Misurare la scena più costosa con strumenti browser: obiettivo 60 fps sul dispositivo dichiarato, nessun long task >50 ms ripetuto durante la riproduzione normale; verificare teardown e assenza di RAF/timer orfani. Se fallisce, ridurre primo piano animato, tracce simultanee e complessità dei path prima di inventare infrastruttura.
- Budget iniziale home: ≤500 KB trasferiti per HTML/CSS/JS/font/asset necessari al primo quadro, compressi, esclusi gli atti non ancora aperti. Riportare misure, non stime; caricare il corso al bisogno. Una deroga richiede motivazione concreta, non «il computer dell'agente va veloce».
- Documento di evidenza con URL preview, SHA, comandi e risultati, immagini desktop/mobile, video di 15–30 s, un caso reduced motion e limiti noti. Non dichiarare una verifica browser riuscita se il browser non è installato o il job è ancora in coda.

Il test `tests/canone.test.js` (dentro `npm test`) controlla che i documenti seguano il canone: `CANONE.md` rigenerato, stesse unità nelle schede degli atti, collegamenti che portano a file esistenti, nessun riquadro «Aggiornamento». Dalla fase R3 controllerà anche che il gioco abbia gli atti e le unità del canone.

Dal 4 novembre 2026 si aggiunge: a fine di ogni unità una partita completa con l'allievo finto (`npm run serve`, poi `npm run allievo`) e la lettura della trascrizione. Un'unità diventa «approvata» nel canone solo dopo la prova del docente dal telefono (vedi [DECISIONI](DECISIONI.md)).

## 3. Come si fa un atto nuovo

Per ogni nuovo atto si parte dalle sue schede in `docs/laika/atti/` e dalla sua riga nel canone, dopo la verifica delle voci segnate [verificare]. Poi: (1) dossier fonti e obiettivi; (2) le unità del canone, ciascuna con il suo gioco; (3) storyboard e inventario asset: per ogni scena, quali voci del catalogo della bottega servono, con epoca compatibile, e quali disegni mancano (da chiedere con CONTRATTO-KIT prima di scrivere le scene); (4) una unità verticale; (5) review storica e visiva; (6) completamento, esposizioni e verifiche; (7) prove di salvataggio e regressioni; (8) PR con evidenze e richiesta di revisione.

Non aggiungere un tipo di interazione perché compare in un'idea. Aprire una decisione architetturale solo con una scena concreta impossibile da esprimere bene, due usi plausibili, contratto dati minimo e costo di mantenimento. Non fare un DSL per una sola scena.

Prima di aggiungere l'Atto II a una versione già distribuita, implementare e testare la compatibilità **append-only** dei salvataggi: l'attuale contentVersion esatta non basta. Conservare il vecchio save, verificare che il prefisso di contenuti e regole già giocati sia equivalente, rieseguire il ledger con il motore e continuare dal nuovo atto. Se la verifica fallisce, offrire riavvio esplicito con spiegazione, senza perdere silenziosamente i dati. Non costruire ora un framework universale di migrazioni.

Il brief del nuovo atto deve fissare: periodo e calendario, quattro obiettivi osservabili, attori/ruoli, scelte e limiti del modello, trasformazioni visive, fonti, sei item formativi motivati, asset mancanti, percorso di test e reset. Riutilizzare la struttura dell'Atto I, non duplicare il runtime.

## 4. Uso dei modelli e controllo dei costi

Raccomandazioni operative, non promesse di qualità o costo. Valgono in Claude (app, Claude Code) e in Codex. Con la bottega quasi tutto il lavoro sulle scene è **scelta e composizione** guidata da `AGENTS.md`, errori leggibili ed esempi: per questo le fasi di produzione (le unità degli atti) possono andare a modelli di fascia media.

| Compito | Claude | GPT | Confine |
|---|---|---|---|
| Schede scena, contenuti già progettati, test mirati, kit di disegni con il contratto | Sonnet 5.5 | GPT-6.1 Sol / medium | Un incarico alla volta, file autorizzati e criteri già decisi |
| Home, regia della scena campione, estensioni del motore o della bottega, debugging difficile, test instabili | Opus 5.5 | GPT-6.1 Sol / high | Aumentare solo se il problema resta irrisolto |
| Review architetturale, critica visiva e storico-didattica prima di replicare | Opus 5.5 (se l'autore è GPT) | GPT-6 Astra / high (se l'autore è Claude) | Leggere diff, prova e fonti; non riscrivere durante la review |
| Inventari, rinomina ID, serializzazione di testi approvati, controlli meccanici | Haiku 5.5 | GPT-6 Luna / low o medium | Nessuna decisione storica, artistica o architetturale autonoma |

Se usi un solo modello: Opus 5.5 o GPT-6.1 Sol / high per le estensioni del motore e la verifica finale, Sonnet 5.5 o GPT-6.1 Sol / medium per il resto. Fable 5.1 e le impostazioni Max/Ultra non servono come impostazione ordinaria: riservarli a un blocco che i modelli sopra non risolvono. «Agente meno competente» significa affidargli un contratto più preciso, non chiedergli di decidere dettagli lasciati aperti.


Riferimenti consultati il 19 ottobre 2026 per i modelli GPT: [Model selection](https://developers.openai.com/api/docs/guides/model-selection), [Models in ChatGPT and Codex](https://learn.chatgpt.com/docs/models). Disponibilità e selettori dipendono dal client e dall'account; le assegnazioni sono giudizio progettuale.

## 5. Chi fa che cosa: Sonnet e Opus

Le schede degli atti sono pensate perché una scena si possa affidare a Sonnet senza che debba ricostruire il quadro. La scheda dice che cosa accade, che cosa c'è sotto, quali materiali usare e dove trovarli. Opus serve dove una scheda non basta.

**A Sonnet, scheda per scheda.**
- Scrivere il testo dell'episodio (narrazione, scelte, conseguenze, voce della famiglia) dalla scheda, rispettando la domanda «sotto la scena» senza scriverla come domanda d'esame.
- Ritrovare nei libri i passi indicati e registrarli con `FONTI-MATRICE` (libro, parole da cercare, citazione breve o parafrasi).
- Trasformare la regia in una scheda scena della bottega e controllarla con `npm run scena`.
- Scrivere le verifiche con la skill `verifiche-didattiche`.
- Chiedere i disegni mancanti con `CONTRATTO-KIT`.
- Fermarsi e segnalare quando un dato segnato [verificare] non si trova o una fonte contraddice la scheda.

**A Opus, in quest'ordine.**
1. **Verifica dei dati segnati [verificare]** degli Atti VIII e IX e di VI.4-e2 (spazio, *besprizornye*, Černobyl'), con fonti stabili. Va fatta prima di affidare quelle scene.
2. **Le scene-manifesto**, dove contano tono e profondità: VI.3-e1 (i sogni), V.3-e2 (le anime nella casa dei semidei, in revisione), VIII.3-e1 e VIII.3-e2 (lo Sputnik e Laika), VIII.4-e1 e VIII.4-e3 (Gagarin e Korolëv), IX.4-e2 (l'ultimo cittadino sovietico).
3. **I temi delicati**: la carestia (VII.1-e3), la valigia (VII.3-e2), l'assedio (VII.4-e2), il confronto gulag-campi nazisti (VII.5-e1), la fine della famiglia imperiale (VI.1-e1).
4. **Le posizioni da non ridurre a fantocci**: il deputato menscevico (IV.2-e2), chi esce dal Congresso (V.3-e4).
5. **I confronti di fine atto e il finale del percorso**, che tengono insieme fili, famiglia e diario.
6. **Una revisione a fine di ogni atto** di ciò che ha scritto Sonnet: coerenza fra atti, ritmo, equilibrio fra sogno e prezzo.

**Ordine di lavoro.** Atti I, II e III per primi (sono costruiti in bozza); poi V, che contiene le immagini centrali del 1917; poi VI, che è il cuore; poi IV, VII, VIII e IX. Prima di ogni atto Opus fa il punto 1 per quell'atto.

## 6. Consegna

- Un incarico, un'unità, una PR, da un branch partito dalla base aggiornata. Niente force-push su `main`, niente modifiche concorrenti allo stesso file da agenti diversi.
- La descrizione della PR comincia con **«Che cosa cambia nella struttura»** (anche «niente»), poi i documenti toccati, le verifiche eseguite con comandi e risultati, ciò che non è stato verificato e ciò che resta aperto.
- Correzioni visive e di contenuto si registrano nel documento che le governa (canone, decisioni, schede); non si mascherano come semplici refactor.
- Le proposte diventano «fatte» in [STATO](STATO.md) solo con un'evidenza (schermate, trascrizione dell'allievo finto, prova del docente).

## 7. Lavoro autonomo fino al 1917

Decisioni D-038 e D-039. Il docente non approva ogni passo: approva il piano una volta, prova un atto quando è finito e risponde solo quando un agente si ferma per una delle condizioni di arresto. Tutto il resto lo decidono i controlli qui sotto.

**Il giro di ogni incarico.**
1. `npm run prossimo` dice qual è il prossimo incarico di [PIANO-1917](PIANO-1917.md) e stampa il messaggio da dare all'agente. Si prende sempre quello: l'ordine non si cambia.
2. L'agente segna l'incarico «in corso» in `docs/laika/piano-1917.json` (poi `npm run piano`) su un branch nuovo da `main`.
3. Se l'incarico è un gioco, prima scrive la scheda di gioco (una pagina, con «Elementi del kit») e la fa passare alla **revisione indipendente** (G4); solo dopo scrive il codice.
4. Costruisce, fa passare i controlli G1–G5, apre la PR che comincia con «Che cosa cambia nella struttura».
5. Se tutti i controlli passano **unisce da solo la PR**, segna l'incarico «fatto» con il numero della PR e le evidenze e passa al prossimo.

**I controlli (al posto delle approvazioni del docente).**
- **G1 Test.** `npm test` e `npm run test:browser` verdi in locale; CI verde su Chromium e WebKit.
- **G2 Allievo finto.** `npm run serve` e `npm run allievo`: la partita intera arriva in fondo e tutti i controlli automatici dello script passano (nessun errore, nessuna pagina senza comandi, nessuna didascalia generica, nessun numero negativo, nessuna nota di lavoro, niente «anime e semidei», pulsanti giusti). La trascrizione e le schermate dell'unità toccata vanno in `docs/evidence/<incarico>/`.
- **G3a Unità ludica, didattica e scene (automatico).** `tests/unita-ludiche.test.js` controlla ogni unità il cui incarico è «fatto»: c'è un gioco; il gioco non è solo una serie di richieste a scelta multipla ma ha qualcosa da distribuire, spostare o spendere (persone, posti, monete, punti, coda, catena); almeno tre turni e un rischio dichiarato; da 2 a 5 indicatori; nessun modulo con caselle numeriche; domanda dell'unità, chiusura con fatto e simulazione, almeno un contenuto documentato e le fonti registrate nelle note; almeno una scena propria e nessuna scena presa da un'altra unità. Lo stesso test vieta di aggiungere al catalogo un disegno che nessuna scena usa. `LAIKA_RAPPORTO=1 node tests/unita-ludiche.test.js` stampa che cosa manca alle unità non ancora rifatte.
- **G3 Divertimento (solo i giochi).** Un test di bilanciamento come `tests/laika-i1.test.js`: almeno tre strategie diverse arrivano in fondo con esiti diversi; nessuna strategia vince su tutti gli indicatori; ogni scelta si può raggiungere; c'è almeno un rischio che il giocatore non controlla e la cui probabilità è scritta prima di scegliere (GIOCHI §1–§2).
- **G4 Revisione indipendente.** Un agente nuovo, che non ha scritto il lavoro (preferibilmente Opus; se l'autore è Opus va bene un'altra istanza senza il suo contesto), legge la scheda, il diff, la trascrizione dell'allievo finto e le fonti, e risponde «passa» o «non passa» con i motivi, come commento nella PR. Domande: rispetta canone, decisioni e scheda dell'atto? Rispetta le regole dei giochi e D-006 (nessuna scelta di sparare, reprimere, denunciare)? I fatti sono nelle fonti o nell'atlante, con le date nei due calendari fino al 1918? Lo studente capisce la domanda sotto la scena giocando? Ci sono aneddoti concreti dove la scheda li chiede? Due «non passa» di fila sullo stesso incarico: ci si ferma (condizione di arresto).
- **G5 Documenti.** STATO, scheda di gioco, scheda dell'atto, canone (stato dell'unità: «bozza» quando è costruita; «approvata» solo dopo il controllo del docente) e piano aggiornati nella stessa PR; `npm test` controlla canone, piano e collegamenti.

**Libri e aneddoti.** Se il docente ha caricato i libri in chat si usano quelli. Altrimenti si usano l'atlante (`references/fonti/atlanti/`), gli appunti e fonti in rete affidabili: sempre in parafrasi, mai citazioni inventate, ogni prelievo registrato in MATRICE. Un aneddoto che non si riscontra si toglie; non si ferma il lavoro per questo.

**Disegni nuovi.** Restano «bozza» e si possono usare; il docente li vede tutti insieme nella galleria al controllo dell'atto.

**Condizioni di arresto: l'agente si ferma e scrive al docente solo se**
- serve cambiare il canone o una decisione (un'unità in più o in meno, un gioco diverso da quello del canone);
- un fatto centrale per la scena non si trova in nessuna fonte e senza quel fatto la scena non regge;
- la revisione indipendente dice «non passa» due volte di fila;
- un controllo automatico non si riesce a far passare senza indebolirlo;
- il gioco di un'unità richiede una meccanica del motore che non è nel piano (le meccaniche nuove sono solo K1, K2, K3 e, se serve, K5);
- la CI resta rossa per motivi che non dipendono dal lavoro dell'incarico.

Fuori da questi casi l'agente non chiede: sceglie la soluzione più vicina alle schede e ai giochi già approvati e scrive nella PR che cosa ha scelto e perché.

**I controlli del docente** (incarichi `C-III`, `C-I`, `C-II`, `C-1917`) non bloccano il piano: l'agente prepara una pagina con che cosa provare, segna l'incarico «aspetta il docente» e va avanti. Le osservazioni del docente diventano incarichi nuovi inseriti subito dopo quello in corso.
