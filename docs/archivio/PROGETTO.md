# RIV-RUSSA — Documento di progetto

**Stato:** specifica condivisa di progettazione, versione 0.1 · 18 ottobre 2026.  
**Repository:** halmob01/riv-russa.  
**Ambito:** percorso storico-didattico interattivo avanzato, dalla Russia zarista allo stalinismo e alla memoria dell’URSS.  
**Regola di governance:** la progettazione viene discussa e approvata insieme; questo documento NON autorizza ad avviare lo sviluppo completo o a inserire in main contenuti non approvati.

## 1. Decisioni già approvate

1. **Impostazione:** grande laboratorio di storia politica, combinazione tra simulazione di governo, analisi di fonti e minigiochi di confronto; non una successione di quiz e slide.
2. **Prospettive multiple:** lo studente assume di volta in volta il ruolo di attori politici e sociali diversi; non segue un protagonista unico.
3. **Conseguenze persistenti entro ogni atto:** decisioni e rapporti di forza evolvono nei successivi episodi dello stesso atto; un atto nuovo riparte dai fatti storicamente documentati. La cronologia dei tentativi resta consultabile.
4. **Preistoria della rivoluzione:** iniziare con un Atto 0 dedicato alla Russia rurale, alla servitù della gleba e alla sua abolizione nel 1861, ai mir, alle tensioni fondiarie e all'industrializzazione. Spiegare perché avviene la rivoluzione, senza presupporre conoscenze pregresse.
5. **Lunghezza e profondità:** prodotto significativamente più lungo e complesso dei giochi precedenti, adatto a una classe con livello alto. Stima iniziale di lavoro: 8 atti più epilogo, circa 35 episodi; durata 8–12 ore da validare, non un vincolo.
6. **Separazione rigorosa:** contenuti storici, regole generali, verifiche, asset grafici e animazioni devono essere disaccoppiati. Il motore deve essere riutilizzabile, ad esempio, per un corso sul fascismo.
7. **Animazioni funzionali:** le illustrazioni devono essere realmente animate e mostrare fenomeni storici (folle, condizioni materiali, passaggio del potere, alleanze, industrializzazione, propaganda). Vietate animazioni ornamentali usate come surrogato delle conseguenze.
8. **Riferimento visuale attuale:** LAIKA: carta `#f3ebdb`, seconda carta `#e9e0cf`, rosso `#cc2a25`, nero `#1c1c1b`, azzurro `#93abb7`; leggere [BRAND-DESIGN](../BRAND-DESIGN.md) e il [piano recente](../PIANO-LAIKA.md). Il riferimento Canva del 18 ottobre (bordeaux/giallo) resta storia della proposta iniziale, superata dalla direzione successiva, non una seconda palette da mescolare.
9. **Verifiche:** integrare la skill allegata 'verifiche-didattiche' nel lavoro sugli esercizi e nella QA didattica. Prove formative distinte dalla valutazione sommativa; scala finale 0–100; niente voto politico sul contenuto delle scelte.
10. **Vincolo storico:** distinguere eventi documentati da simulazioni e ipotesi controfattuali; le simulazioni non alterano la linea dei fatti accaduti; le misure del gioco non sono statistiche storiche.

## 2. Fonte e perimetro storiografico

Fonte didattica principale: gli appunti allegati «La Rivoluzione Russa.docx». Nuclei presenti: Russia zarista e opposizioni; 1905; febbraio e ottobre 1917; Lenin e Tesi di aprile; governo provvisorio; Kornilov; primi atti bolscevichi e Costituente; costituzione dell'URSS; educazione, diritti, arte; Lenin, Trotsky e Stalin; NEP; industrializzazione, collettivizzazione, repressione; stalinismo e mito sovietico.

L'Atto 0 amplia la cornice evocata negli appunti (servitù abolita nel 1861, riforma agraria e mir). La guerra civile 1918–1921, il comunismo di guerra e Kronštadt sono integrazioni proposte per spiegare la transizione alla NEP: non attribuirle erroneamente agli appunti.

**Passaggi da sottoporre a verifica storica prima della stesura definitiva:** suffragio e poteri della Duma; distinzione tra bolscevichi e menscevichi; date del calendario giuliano/gregoriano del 1917; collocazione temporale di Brest-Litovsk; ruoli politici di Kerenskij e Kornilov; dinamica dell'Assemblea costituente; data e condizioni dell'esilio di Trotsky; natura delle riforme agrarie e dei mir; descrizione comparata di gulag e campi nazisti; numeri sulle vittime e sulle produzioni industriali; cronologia dei diritti, dell'educazione e dell'arte sovietica. Le correzioni devono essere esplicitate come revisione, non introdotte di nascosto nella fonte.

L'archivio è disponibile agli agenti anche per frasi, aneddoti e dettagli precisi, da localizzare e contestualizzare. Sheila Fitzpatrick è un riferimento da aggiungere e considerare se conosciuto, distinguendo conoscenza pregressa e testi consultati secondo [FONTI-LAIKA](../FONTI-LAIKA.md).

## 3. Obiettivi didattici

- **Cause strutturali:** saper collegare terra, dipendenza sociale, autocrazia, sviluppo industriale, tensioni militari.
- **Periodizzazione e causalità:** spiegare perché avvenimenti del 1905, del 1917 e degli anni 1920–30 si concatenano senza risultare inevitabili.
- **Pluralità di attori:** distinguere interessi, capacità d'azione, alleanze e contraddizioni di contadini, operai, esercito, monarchia, governo, partiti e soviet.
- **Istituzioni e legittimità:** separare potere formale, consenso, controllo della forza, rappresentanza e diritti.
- **Storia economico-sociale:** riconoscere chi paga e chi beneficia delle trasformazioni.
- **Uso delle fonti:** riconoscere tipo di fonte, contesto, prospettiva, limiti probatori e propaganda.
- **Giudizio argomentato:** distinguere fatti, interpretazioni, ipotesi e valutazioni morali senza equiparazioni facili.

## 4. Architettura di esperienza: il ciclo di ciascun episodio

1. **Quadro narrativo**: 2–5 scene sintetiche, illustrate e animate; lo studente conosce contesto e crisi.
2. **Attori e testimonianze**: scopre almeno due prospettive e le informazioni disponibili a ciascuna.
3. **Decisione o operazione**: negoziare, assegnare risorse, ordinare priorità, formare alleanze, valutare una fonte, comporre o decodificare propaganda.
4. **Risposta del sistema**: effetti immediati e un'animazione causale sincronizzata con il cambiamento; mostra quali attori hanno tratto vantaggio o svantaggio.
5. **Memoria delle conseguenze**: effetti differiti, condizioni e vincoli influenzano gli episodi successivi nel medesimo atto, anche dopo il cambio di ruolo.
6. **Ritorno alle fonti**: confronto fra percorso simulato e documentazione di quanto accadde.
7. **Verifica formativa**: esercizio diagnostico sul nesso storico effettivamente insegnato, non sulla somiglianza tra la decisione dello studente e quella degli attori reali.

Il ciclo può essere variato e non è una sequenza obbligatoria in ogni micro-scena; alcuni episodi dedicati alle fonti non avranno gestione di risorse.

## 5. Il sistema di simulazione (riutilizzabile)

Ogni **atto** dichiara dati autonomi:
- attori e istituzioni, poteri e relazioni;
- variabili osservabili (es. risorse, fiducia, coesione, influenza) e loro limiti;
- obiettivi e vincoli strutturali del periodo;
- episodi/scenari con ruoli disponibili;
- eventi e decisioni, incluse condizioni di attivazione;
- conseguenze immediate, differite e cumulative;
- condizioni narrative che trasformano le opzioni disponibili;
- fonti con provenienza e contestualizzazione;
- fine dell'atto, confronto storico, riepilogo e competenze.

Le **regole generali** non devono contenere stringhe come 'zar', 'soviet', 'fascismo', 'mir' o descrizioni di eventi storici specifici. Non devono contenere animazioni ad hoc di un episodio. Devono interpretare un contratto dati esplicito e validabile.

**Stato di un atto:** ruolo corrente; metriche 0–100 solo laddove utili; relazioni attore-attore; disponibilità di risorse; vincoli; flag di eventi; effetti in attesa; prove esaminate; scelte compiute; diario di causazione. I valori di simulazione sono convenzioni modellistiche, esplicitamente etichettate e mai presentate come misure statistiche del passato.

**Un effetto differito** indica il contesto che lo fa maturare (episodio, condizione o numero di turni), un limite temporale e una spiegazione leggibile. Evitare opzioni che sembrano diverse ma producono lo stesso esito senza spiegazione.

**Fine atto:** blocco di confronto storico (timeline documentata e scelte storiche degli attori), bilancio delle conseguenze simulate, una riflessione sui limiti del modello, poi reset dei parametri di simulazione per l'atto successivo. Restano archiviate le scelte dello studente; nessuna storia alternativa diventa fatto canonico.

**Criterio di riuscita:** non premiare ideologie, repressione o scorciatoie arbitrarie. La prestazione valutata è comprendere nessi, riconoscere vincoli e argomentare sul materiale, non ottenere una barra al 100%.

## 6. Tipi di interazione riutilizzabili

- **Equilibri di potere:** rete animata di soggetti, alleanze e conflitti.
- **Assemblea:** negoziare posizioni e maggioranze entro regole del contesto.
- **Allocazione:** distribuire risorse scarse, rendere visibili benefici e costi.
- **Territorio:** mostrare proprietà, usi, trasporti, migrazioni e cambiamenti.
- **Crisi a fasi:** prendere decisioni sotto vincoli informativi e temporali.
- **Fonte/propaganda:** analizzare, ordinare, confrontare testimonianze, immagini, documenti, dati.
- **Comparazione:** vedere simultaneamente due punti di vista sullo stesso evento.

Difficoltà avanzata: scelte non banali, conflitti di obiettivi, informazioni incomplete, effetti non sempre prevedibili; nessun game over punitivo che interrompa l'apprendimento.

## 7. Piano degli atti — proposta da confermare episodio per episodio

| Atto | Titolo di lavoro | Episodi | Nuclei |
|---|---|---:|---|
| 0 | La terra e lo zar | 4 | servitù, 1861, mir, villaggio, industrializzazione |
| I | L'impero in crisi | 4 | 1904–05, Domenica di sangue, soviet, Duma, Stolypin |
| II | Pane e guerra | 3 | Grande guerra, crisi dei rifornimenti, febbraio 1917 |
| III | Due poteri, una Russia | 5 | governo provvisorio, Tesi di aprile, luglio, Kornilov |
| IV | Tutto il potere ai soviet? | 4 | ottobre, decreti, Costituente, pace separata |
| V | Salvare la rivoluzione | 4 | guerra civile, comunismo di guerra, rivolte, NEP |
| VI | Costruire una società nuova | 4 | istituzioni, scuola, donne, cultura, successione |
| VII | Il prezzo della potenza | 5 | Stalin, collettivizzazione, industria, repressione |
| Epilogo | Il mito dell'URSS | 2 | guerra contro il nazismo, memoria, bilancio |
| **Totale** | | **35** | |

La scansione è una proposta progettuale, non un sillabo chiuso. Gli appunti del docente sono la base, con integrazioni identificate.

## 8. Atto 0 — brief iniziale, da sviluppare e approvare separatamente

**Domanda-guida:** come può una società abolire la servitù della gleba e continuare a produrre conflitti così profondi intorno alla terra, al lavoro e all'autorità?

Quattro episodi proposti:
1. **Chi possiede la terra?** Gerarchia e rapporti di dipendenza nella Russia precedente al 1861.
2. **Liberi, ma a quali condizioni?** Emancipazione del 1861, proprietà e obblighi economici, ruolo della comunità rurale.
3. **Un villaggio sotto pressione.** Crisi multiruolo: contadini, comunità, proprietario, amministrazione. Conseguenze persistenti all'interno dell'atto.
4. **Le due Russie.** Paesaggio rurale e grandi centri industriali; migrazioni e nuove condizioni operaie; comparazione con la vita contadina.

Risoluzione: confronto con i fatti, restituzione delle conseguenze simulate, esercizio causale sul rapporto tra emancipazione, terra e rivoluzione.

**Indicazione di accuratezza:** 'feudalesimo russo' è un ponte didattico, non una perfetta equivalenza con il feudalesimo occidentale; spiegare il sistema della servitù della gleba nel suo contesto.

## 9. Identità visiva e animazioni

**Riferimento visuale attuale:** LAIKA: carta `#f3ebdb`, seconda carta `#e9e0cf`, rosso `#cc2a25`, nero `#1c1c1b`, azzurro `#93abb7`; leggere [BRAND-DESIGN](../BRAND-DESIGN.md) e il [piano recente](../PIANO-LAIKA.md). Il riferimento Canva del 18 ottobre (bordeaux/giallo) resta storia della proposta iniziale, superata dalla direzione successiva, non una seconda palette da mescolare. Font e licenze da completare nell’[inventario](../ASSET-MANIFEST.md).

**Ogni illustrazione animata** deve dichiarare:
- fenomeno storico da rendere visibile;
- elementi SVG e livelli semantici (persone, campi, tracciati, officine, istituzioni);
- stato iniziale, transizione e stato finale;
- evento del motore che attiva la transizione (senza aggancio a stringhe storiche);
- significato delle modifiche, annotazione esplicativa e controlli di riproduzione;
- fallback statico e comportamento con preferenza reduced-motion.

**Standard tecnici proposti:** SVG originali a livelli per le scene, CSS/Web Animations API e, se giustificato, GSAP per sequenze complesse; rendering prevedibile, niente dipendenza da un'animazione esterna per mostrare informazioni indispensabili. Test browser desktop e dispositivo mobile reale; test di replay, retroazione, resize, touch, navigazione e framerate. Le animazioni devono funzionare, non semplicemente esistere nel codice.

**Regola UX:** distinguere scene narrate e interazioni, preferire pochi testi ben raccontati per schermata a slide sovraccariche. Contenuto visivo non infantile.

## 10. QA delle verifiche — skill allegata

Skill: pacchetto 'verifiche-didattiche(1).skill', con SKILL.md, CHECKLIST.md, FORMATO.md, PROFILI.md, script Python 'audit_questions.py' e test.

Workflow obbligatorio quando esisteranno gli item:
1. matrice obiettivi → evidenze osservabili → prove, verificando cosa è stato effettivamente insegnato;
2. banca separata dalla logica di gioco, con ID stabili, motivazione della chiave, fonte e livello;
3. audit automatico del formato normalizzato con lo script allegato; verifica di duplicati, chiavi, lunghezza delle opzioni e distribuzione delle posizioni;
4. audit semantico indipendente con la checklist: distrattori plausibili, assenza di indizi grammaticali, ambiguità, affidabilità storica, copertura degli obiettivi;
5. test nel browser delle opzioni **effettivamente mostrate**, inclusi randomizzazione stabile e corretto ri-render; revisione separata delle traduzioni se presenti;
6. prova formativa diversa da sommativa, con rubriche 0–100; distinguere prestazioni auto-correggibili e riflessioni aperte con criteri docente;
7. report con criticità bloccanti, da correggere, verificate e limiti dichiarati. La sola esecuzione di script non equivale a validazione pedagogica.

La skill è un supporto QA, non uno standard di contenuto o un permesso per attribuire voti automaticamente.

## 11. Strategia tecnica di riuso

**Base consigliata:** motore narrativo autonomo di 'epica-romanzo' (engine.js, salvataggi ricostruibili, separazione dei contenuti, test), a sua volta derivato da 'sito-game-template1' / 'sito-feudo'. Non trascinare nella logica attiva il modello del granaio, delle guardie o degli ordini feudali.

**Previsione iniziale (stato tecnico aggiornato in STATO-KIT.md):** scene multi-ruolo, relazioni fra attori, conseguenze differite, atti persistenti, biblioteca di minigiochi, componenti SVG animate, fonti citabili, banca quesiti e tracciamento di competenze. Configurazioni, design token e traduzioni indipendenti dalla logica generale.

**Test iniziali obbligatori:** regressione del motore, coerenza dei flag, effetti differiti, serializzazione e ripristino, riconciliazione del cambio di atto, alternative sempre raggiungibili, dati che non possono eseguire codice arbitrario, browser smoke, accessibilità e prova su iPhone reale.

## 12. Scelte ancora aperte

- Quanta autonomia assegnare allo studente nelle decisioni prima di mostrare le conseguenze probabili; quando rendere visibili i costi attesi.
- Indicatori sempre visibili, parzialmente visibili o ricostruibili tramite fonti.
- Durata target di ogni episodio, lettura autonoma o uso guidato in classe.
- Asset visivi e font precisi; eventuale traduzione araba opzionale (non approvata per questo percorso).
- Fonti primarie da citare e modalità di presentazione dei documenti.
- Modalità di verifica sommativa (solo fine percorso o anche fine atto) e criteri della riflessione aperta.
- Finalizzazione delle meccaniche dell'Atto 0 prima di costruire il motore generale.

## 13. Prossimo passo autorizzato

**Solo progettazione dettagliata dell'Atto 0**, con sceneggiatura, ruoli, stati, regole delle decisioni, animazioni e matrice di apprendimento. Nessuna implementazione, nessun clone eseguibile, nessuna modifica strutturale al motore senza ulteriore approvazione.

## 14. Aggiornamento del mandato tecnico — 18 ottobre 2026

La successiva richiesta del docente autorizza a leggere i documenti, correggere le procedure motivate e implementare direttamente il motore riutilizzabile. Il vincolo di sola progettazione del §13 è quindi superato per il kit tecnico. I contenuti definitivi dell’Atto 0 restano da progettare insieme. Implementazione integrata tramite PR #1 con successiva autorizzazione esplicita al merge del docente. Per il consolidamento e lo stato corrente vedere `STATO-KIT.md`. Vedere `IMPATTO-MOTORE.md`, `CREARE-UN-GIOCO.md` e `REPORT-TEST.md` per decisioni, contratto e limiti verificati.
