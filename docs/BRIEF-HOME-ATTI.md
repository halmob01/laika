# LAIKA — Brief di produzione visiva e didattica

Parte del [piano operativo](PIANO-LAIKA.md). Stato: decisioni per il prossimo incremento, non contenuti storici già approvati. I testi, i documenti citati e le date vanno verificati nella fase editoriale. Gli asset possono essere migliorati o creati: servono la scena, non il contrario.

## 1. Homepage di produzione

> **Stato al 21 ottobre 2026: home realizzata (PR #19), approvata dall'utente.** Rispetto al brief qui sotto, l'utente ha deciso:
> - **Hero:** tre quadri 1861 «La terra», 1905 «La piazza», 1917 «Il pane», ciascuno con figure minuscole in un luogo grandioso. Le schede stanno in `site/laika/scene/` e sono elencate in `site/laika/hero.config.json`; non stanno in `games/laika/source/scene/`.
> - **Impaginazione costruttivista:** titolo a fasce, piano rosso in diagonale, denominazione in verticale, disco rosso che cambia posto a ogni data. Le regole sono in [BRAND-DESIGN](BRAND-DESIGN.md) §5.
> - **Testi:** ironia burocratica solo in etichette, titoli di sezione e claim; i testi da leggere sono storico-divulgativi e sobri.
> - **Piede:** la sezione con fonti, accessibilità e crediti è eliminata; resta una riga tecnica. Le fonti vanno nelle unità, non nella home.
> I punti 2 e 6 e la sezione «Scena del hero» qui sotto restano come storia della decisione.

### Gerarchia e comportamento

1. Testata essenziale: wordmark LAIKA, «Il percorso», «Come funziona», «Fonti». Menu accessibile anche a tastiera; non nascondere i collegamenti mobili senza un comando funzionante. Senza JavaScript restano testo, navigazione e collegamento al player, con avviso per le attività interattive.
2. Hero asimmetrico: circa 7 colonne al testo e 5 all'illustrazione su desktop; su mobile titolo, descrizione, CTA, scena. Titolo di lavoro: «Come cambia un mondo?». Sottotitolo: «Esplora la Rivoluzione russa attraverso scelte, fonti e conseguenze». Non duplicare un logo gigante e un titolo gigante.
3. Un solo invito principale: «Inizia il percorso», oppure «Riprendi» con atto e unità correnti. Un link secondario porta ai fascicoli. La scena non ritarda né copre il bottone.
4. Fascicoli: Atto 0 e Atto I con periodo, argomento e stato reale; 1917 come breve anticipazione non cliccabile, senza una scheda che sembri già giocabile. La prima versione è una parte del corso: niente promesse di atti implementati o durate misurate inesistenti.
5. «Come funziona»: tre passi brevi, osserva il contesto / agisci nel modello / confronta con le fonti. Spiegare che le scelte non riscrivono i fatti storici.
6. Fonti, accessibilità e crediti a fondo pagina. Rimuovere dalla home pubblica la sezione metaprogettuale «Identità visiva» e i controlli destinati al catalogo asset.

Spaziature ampie ma non vuote, titoli editoriali, corpo minimo 16 px, didascalie normalmente 14 px; nessuna informazione necessaria nel binario di testo a 8 px del prototipo. Controlli con area tattile almeno 44×44 px. Usare i token del brand recente in un solo file del tema, non numeri di colore sparsi negli SVG.

### Scena del hero: tre composizioni, una sola animazione attiva

L'hero anticipa terra → città → assemblea, senza presentare una cronologia completa in dieci secondi. Usare simboli coerenti con gli atti disponibili. Non montare insieme razzo, edificio staliniano e contadino ottocentesco.

- 0–2 s: appare una composizione di campi e una famiglia, con rivelazione dei confini del terreno. Le figure hanno peso e contatto con il suolo.
- 2–5 s: la composizione si apre lateralmente; una figura si orienta verso una sagoma industriale. Movimento di passo e spostamento si coordinano, non un corpo rigido che galleggia.
- 5–8 s: figure in secondo piano compongono un gruppo; entra un foglio/documento e un accento rosso. La camera si assesta e lascia spazio al testo.
- Fine: posa stabile. Replay discreto; nessun loop infinito obbligatorio. Il click sui fascicoli cambia il quadro con una transizione breve, non avvia tre scene simultanee.

Il hero si scrive come scheda scena della bottega (`games/laika/source/scene/`), con una sequenza per quadro; nessun SVG a mano nella pagina. Disegni disponibili oggi per i tre quadri: ambiente rurale, fabbrica, stazione, piazza, binari, lampione, ciminiera e fumo (PR #16), figure con pose `lavora`, `cammina_*`, `parla`, `legge`, formazioni `gruppo` e `discorso`.

La versione reduced motion mostra il quadro finale con una didascalia, senza perdita informativa. Il hero non deve caricare tutto il manifest didattico per visualizzare tre piccoli quadri.

## 2. Direzione degli asset

> **Aggiornamento 20 ottobre 2026.** Gli asset si scelgono dal [catalogo della bottega](../bottega/catalogo.json) e si compongono con schede scena ([bottega/README.md](../bottega/README.md)); le «nuove illustrazioni necessarie» elencate sotto si producono seguendo il [contratto per i kit](../bottega/CONTRATTO-KIT.md) e vanno registrate nel catalogo con la loro epoca.


### Personaggi: contratto grafico

> **Superato il 20 ottobre 2026.** I personaggi sono la figura articolata della bottega, derivata dallo studio personaggi originale e scelta dall'utente come riferimento estetico. I criteri qualitativi sotto (continuità, niente giunture visibili, movimento editoriale, nessuna caricatura sociale) restano validi come criteri di review delle pose; le istruzioni di disegno e separazione delle parti non si applicano più.

I cinque `human-*.svg` erano il riferimento iniziale più utile della repo. Non sono ancora rig completi: separare solo le parti che servono al gesto. Prima consegna: tre archetipi principali (persona contadina, persona operaia, figura in soprabito) e una variante seduta/piegata. Le differenze di abito e postura non devono trasformarsi in caricature sociali.

- Silhouette continua, spalle arrotondate, gomiti/ginocchia suggeriti da curve e pieghe, mani semplici ma non punte triangolari.
- Collo coperto da testa e busto; arti sovrapposti sotto la manica o l'orlo. L'ordine di disegno nasconde le giunture; nessun disco di articolazione visibile. Non rendere tutto un unico path se questo impedisce il movimento.
- Separazione tecnica minima: radice, busto, testa, braccio vicino/lontano, gamba vicina/lontana; accessorio opzionale. A riposo e agli estremi del gesto controllare che non compaiano fessure.
- Movimento da illustrazione editoriale: piccoli trasferimenti di peso, anticipazione del gesto, lieve ritardo tra busto e accessorio. Nessun rimbalzo elastico standard applicato a ogni persona.
- Le figure sullo sfondo possono essere silhouette intere; non articolare trenta personaggi se il quadro non lo richiede.

Convenzioni SVG: viewBox coerente per famiglia, appoggio dei piedi e pivot annotati, ID unici prefissati per simbolo, gruppi semantici stabili (`torso`, `head`, `arm-near`, ecc.), colori tramite token supportati dal compositore. Non assumere che un `<g>` annidato diventi automaticamente un target animabile: esporre le parti come layer/istanze secondo il contratto corrente. Conservare un SVG sorgente leggibile e derivare i simboli per il renderer. Evitare filtri pesanti, immagini raster incorporate e riferimenti esterni.

La tavola di revisione mostra: quattro pose statiche, una figura isolata a dimensione di gioco, una fila di cinque figure e 8–12 secondi di cammino/gesto con pausa, replay e reduced motion. Il disegno non è approvato solo perché il parser SVG lo accetta.

### Inventario di produzione deciso

| Materiale presente | Decisione | Intervento |
|---|---|---|
| Cinque figure organiche v2 | Archiviare | Sostituite dalla figura della bottega; conservate come riferimento |
| Campi, famiglia, proprietario, funzionario, mir | Riutilizzare/adattare | Verifica cronologica, proporzioni e spazio per personaggi in primo piano |
| Fabbrica ottocentesca, operaio, attrezzi | Adattare | Correggere tagli, relazione persona/macchina e composizione |
| Documento, monete, grano | Riutilizzare | Coerenza di scala e semplificazione; non trattare icone come prove storiche |
| Scene dello studio Atto 0 | Ricomporre | Ridurre fascia nera dominante, vuoti non utili e oggetti tagliati; tenere l'intenzione, non il layout |
| Coda del pane e soldato ricostruiti | Conservare per Atto II | Verifica e revisione successiva; non illustrare con essi il 1905 |
| Vecchia folla geometrica | Sostituire in produzione | Formazioni della bottega con la figura articolata |
| Razzi, vysotka, panelki, reattore, monumenti cosmici | Archiviare nel catalogo | Non entrare negli atti iniziali |
| Treno con stelle rosse, tribuna sovietica, torretta | Non usare come sono | Una variante d'epoca richiede disegno e verifica, non solo una nuova etichetta |
| Presunto Palazzo d'Inverno del kit | Verificare o sostituire | Non dare valore documentale a una facciata generica |

**Nuove illustrazioni necessarie**, da realizzare in SVG coerenti con i riferimenti:

1. Una famiglia rurale in due pose e una figura che porta un attrezzo: Atto 0, unità 1–3.
2. Una composizione di passaggio villaggio/città con operaio, facciata industriale e soglia: unità 4. Si possono riutilizzare gli edifici pertinenti.
3. Un corteo del 1905: persone in soprabito, documento/petizione, portatori e sfondo urbano verificato; non una parata sovietica con stemmi posteriori.
4. Una piccola assemblea con posture di ascolto e intervento, riutilizzabile anche per il mir con accessori diversi.
5. Un quadro istituzionale astratto ma leggibile: documento, soglia/palazzo e platea; illustra distanza tra promessa e potere senza fingere un organigramma storico esatto.

Non servono cinque fondali nuovi completi: produrre personaggi/accessori modulari e tre ambienti essenziali. Se un asset esistente richiede più lavoro per essere forzato nella scena che per ridisegnarlo, creare il nuovo e registrare il motivo. La generazione raster può aiutare un'esplorazione esplicitamente separata, ma il deliverable animabile di produzione resta SVG leggero, con parti controllabili.

## 3. Regole editoriali comuni

Fonte didattica prioritaria: gli appunti «La Rivoluzione Russa»; «Dalla modernità alla contemporaneità» serve da cornice concettuale. Entrambi i DOCX sono conservati in [references/fonti](../references/fonti/README.md). I libri e gli altri materiali sono spunti eventuali per approfondire, confrontare e verificare, senza sostituire automaticamente gli appunti o ampliare il programma; sono ammesse ricerche online e richieste di altri volumi all'utente. Registrare le integrazioni e motivare eventuali rettifiche degli appunti, conservando gli originali. Vedere [FONTI-LAIKA](FONTI-LAIKA.md) per lo stato effettivo dell'esame.

Gli appunti «La Rivoluzione Russa» guidano temi, sequenza e obiettivi. Gli agenti devono consultare i materiali anche per frasi da citare, aneddoti e dettagli precisi, non soltanto per una bibliografia finale. Registrare ogni prelievo e il suo contesto secondo [FONTI-LAIKA](FONTI-LAIKA.md) e la scheda di [FONTI-MATRICE-LAIKA](FONTI-MATRICE-LAIKA.md). Considerare Sheila Fitzpatrick se conosciuta dall'agente: conoscenza pregressa utile a ricerca e confronto, opera/edizione ancora da aggiungere; non inventare citazioni o pagine senza riscontro.

Quattro unità didattiche per atto; ciascuna contiene indicativamente 3–5 episodi runtime. Non imporre un numero di schermate a scapito del ritmo. Ogni unità ha contesto documentato, un'attività significativa, risposta visiva, confronto e/o verifica; alternare l'ordine quando serve alla comprensione.

Niente testo storico definitivo inventato per riempire il JSON. Per ogni affermazione centrale registrare fonte, titolo/autore, URL o riferimento bibliografico, data/edizione, localizzazione, sintesi dell'uso e distinzione citazione/parafrasi. Per immagini registrare autore/provenienza/licenza e se sono ricostruzioni. Non fabbricare citazioni d'epoca. Un riassunto moderno di una fonte va etichettato come tale.

La datazione di eventi russi deve dichiarare la convenzione adottata. Usare data gregoriana come principale e giuliana tra parentesi nei casi rilevanti, dopo controllo sulla fonte. Le metriche del modello hanno etichetta «indice della simulazione», non unità statistiche storiche. Usare al massimo tre indicatori contemporaneamente nell'interfaccia.

Le sei domande per atto si distribuiscono 1+2+1+2 nelle quattro unità. Misurano nessi e limiti, non memoria di un numero modellistico. Ogni item ha obiettivo, esposizioni richieste, risposta, motivazione e spiegazione dei distrattori. Le domande sono esterne ai testi del motore e vengono assemblate dal build nel contratto esistente.

## 4. Atto 0 — La terra e lo zar

Obiettivo complessivo: capire perché emancipazione giuridica, distribuzione della terra, istituzioni rurali e industrializzazione producono trasformazioni e tensioni differenti. Non raccontare una rivoluzione inevitabile.

Stato modellistico iniziale da calibrare nella prova verticale: due risorse locali (mezzi di sussistenza, disponibilità per investimenti), una relazione (fiducia comunitaria) e flag sulle decisioni. I valori numerici sono parametri di bilanciamento; l'agente li propone in una tabella con risultati dei due percorsi di prova, non li attribuisce alla Russia reale.

| Unità | Attività usando il kit | Risposta e regia | Confronto obbligatorio |
|---|---|---|---|
| A0.1 — Terra e dipendenza | `narrative` + `resource_allocation`: distribuire un budget astratto fra sussistenza, obblighi e miglioramento degli attrezzi | Campo visto dall'alto che si avvicina alle figure; quantità rappresentate con pochi segni, una famiglia raccoglie e consegna, la postura cambia | Il modello rappresenta vincoli, non una libera gestione della servitù; distinguere soggetti e diritti |
| A0.2 — Che cosa cambia nel 1861 | `source_comparison`: confrontare il cambiamento giuridico con condizioni materiali, usando fonti o estratti verificati | Si apre un documento e si rimuove un confine simbolico; restano terreno, obblighi e distanze, senza metafora semplicistica «tutto libero» | Emancipazione non equivale automaticamente a terra sufficiente o prosperità; esplicitare differenze e tempi |
| A0.3 — Il mir e le scelte collettive | `role_crisis`: due prospettive della comunità e una scelta con costo immediato e conseguenza differita | Assemblea: figura che prende parola, gruppi che si avvicinano o prendono distanza; il cambiamento corrisponde all'esito | Il mir non è un soviet né una democrazia moderna. Il ruolo assunto non esaurisce la società rurale |
| A0.4 — Dalla campagna alla fabbrica | `choice`: confronto tra permanenza e trasferimento dentro uno scenario dichiaratamente simulato; maturazione di una conseguenza precedente | Panorama breve villaggio/città; una figura attraversa la soglia, cambiano densità e ritmi del gruppo | Industrializzazione e vita operaia, senza inventare una biografia universale; timeline documentata e limiti del modello |

L'esito di A0.1 deve ricomparire almeno una volta in A0.3 o A0.4. I due itinerari «priorità sussistenza» e «priorità investimento» producono conseguenze leggibili e nessun game over. Evitare una scelta manifestamente corretta e una irrazionale.

Terminare con un episodio `narrative` esplicito di confronto storico prima dell'avanzamento all'atto successivo: la proprietà `reconciliation` da sola non garantisce la pausa editoriale desiderata. Mostrare i fatti documentati accanto al riepilogo simulato; poi far avanzare il motore con il suo reset.

## 5. Atto I — L'impero in crisi, 1904–1907

Obiettivo: collegare guerra e crisi politica senza ridurre tutto alla guerra; distinguere petizione, protesta, sciopero, soviet, concessione costituzionale e limiti dell'autocrazia.

Stato autonomo da Atto 0: risorsa organizzativa, indice di tensione del modello, relazione di cooperazione tra gruppi e flag delle opzioni. Nessun valore ereditato dalla simulazione rurale diventa un fatto del 1905. Rimane il diario delle scelte precedenti.

| Unità | Attività usando il kit | Risposta e regia | Confronto obbligatorio |
|---|---|---|---|
| A1.1 — Guerra e tensioni | `resource_allocation`: scenario logistico con budget astratto e priorità concorrenti; contesto della guerra russo-giapponese verificato | Documento/cartografia molto semplificata e figure civili; una risorsa spostata lascia un vuoto visibile altrove, non un contatore decorativo | Il modello non ricostruisce bilanci militari reali; le cause sociali precedono il conflitto |
| A1.2 — Petizione e Domenica di sangue | `source_comparison`: due testimonianze/documenti verificati, con domande su autore, scopo e capacità probatoria | Il corteo si aggrega, la camera allarga e poi si arresta; il documento resta punto focale. La violenza è narrata con sobrietà, senza minigioco spettacolare | Nessuna scelta «spara/non sparare», nessun punteggio per la repressione; separare evento accaduto e interpretazioni delle fonti |
| A1.3 — Scioperi e rappresentanza | `role_crisis`: prospettive operaie e organizzative, scelta su coordinamento e priorità con conseguenza differita | Piccoli gruppi diventano assemblea, un gesto passa tra figure, si alternano parola/ascolto. Differenze di densità corrispondono allo stato | Non assimilare il soviet del 1905 al potere statale del 1917; spiegare possibilità e limiti della rappresentanza |
| A1.4 — Promesse e limiti | `source_comparison` + `choice`: confrontare promessa di cambiamento e capacità effettiva delle istituzioni; sintesi su Duma e riforme fino al 1907 | Documento che si apre, platea che compare, soglia che resta controllata: la composizione mostra la distanza fra accesso e potere | Manifesto, Duma, restrizioni e riforme agrarie vanno distinti e datati; nessuna conclusione «nasce una piena democrazia parlamentare» |

La scena dimostrativa centrale è A1.2: non basta far traslare una folla. Storyboard 10–12 s: 2–3 persone in primo piano e gruppi distanti; ingresso scaglionato con passo e gesto; aggregazione attorno al documento; allargamento moderato della camera che rivela la relazione tra gruppo e spazio; arresto e quadro leggibile. Bandiere e segni devono essere storicamente verificati: non usare automaticamente il rosso sovietico. Dopo l'ingresso il tempo è dello studente, non della timeline.

Per A1.3 prevedere una variante visiva con cooperazione maggiore e una con frammentazione, entrambe ricostruibili dopo reload. L'esito differito matura entro l'atto e viene spiegato nel diario. Concludere con confronto storico esplicito e report formativo; il prossimo atto non disponibile non deve aprire una schermata vuota.

## 6. Revisione che l'utente deve poter fare

Consegnare tre prove, senza chiedere di valutare una cartella di SVG in astratto:

1. Personaggi: raccordi, morbidezza, postura e movimento a dimensione reale.
2. Home e A0.1: identità del sito, leggibilità, interazione e conseguenza visiva completa.
3. A1.2 e A1.3: folla, regia e trasformazione del gruppo, con pausa/replay/reload e versione reduced motion.

Domande di review concrete: le figure sembrano persone e non manichini geometrici? Il movimento spiega qualcosa? La posa finale comunica l'esito? Il testo resta protagonista quando necessario? Su smartphone si legge e si controlla tutto? Una risposta negativa genera un intervento localizzato, non la riscrittura del motore.
