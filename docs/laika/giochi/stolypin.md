# Gioco di II.4 — Il podere e il mir (`stolypin`)

Scheda di gioco dell'unità `stolypin` (canone: II.4). Versione 1 (costruita) · 5 novembre 2026 · gioco scelto dall'agente fra quelli del repertorio (D-038, D-039) al posto della scelta unica fra tre risposte; nel canone lo stato è «da confermare» finché il docente non lo prova (C-II). Applica [GIOCHI](../GIOCHI.md) §2 e §3.8 (la giornata a punti azione, qui «anno»). I contenuti degli episodi sono in [atto-2](../atti/atto-2.md). I numeri sono indici della simulazione; la famiglia e i suoi anni sono inventati.

## Il gioco

**Forma:** punti azione, quattro anni da quattro punti (novembre 1906, 1907, 1909, 1911). **Durata:** circa otto minuti. **Chi è il giocatore:** il capofamiglia di un villaggio della Russia centrale, davanti al decreto che permette di uscire dal mir.

**Gli indicatori (quattro):** **Pane in casa**, **Chi ti aiuta** (i vicini nel mir; in città i parenti e i conoscenti), **Debiti** (meglio bassi) e **Ombra dei tribunali** (meglio bassa: i tribunali militari che mandano alla forca i rivoltosi). Il senso è nel prezzo di ogni strada: più pane da solo o meno pane insieme agli altri.

**Le tre strade (si sceglie una volta: le altre due si chiudono):** **Restare nel mir** (1 punto: i vicini ti sostengono), **Uscire dal mir e unire le strisce** (2 punti: più pane e più debiti, meno vicini), **Vendere la terra e partire** (2 punti: i debiti si pagano, il viaggio e la città costano).

**Le azioni di ogni strada (si aprono solo dopo averla scelta):**
- **Chi resta:** dividere le strisce all'assemblea (aiuto), lavorare le strisce (poco pane per punto, ripetibile).
- **Chi esce:** recintare il podere (2 punti: pane e debiti), prendere denaro a prestito per gli attrezzi (pane subito e debiti, ripetibile), lavorare il podere (più pane per punto, ripetibile, un po' meno aiuto), chiedere ai vicini di aiutare alla mietitura (incerta: la probabilità sale con l'aiuto, scritta prima).
- **Chi parte:** cercare lavoro in fabbrica (incerta e ripetibile: la probabilità sale con l'aiuto dei conoscenti), scrivere ai parenti già partiti (aiuto).
- **Chi non parte:** aprire la casa a una riunione del villaggio (aiuto, ma l'ombra dei tribunali sale molto: è il rischio che viene dalla repressione).

**Che cosa resta negli anni (le conseguenze si sommano).** Ogni anno passa con un costo fisso (scritto nel testo del gioco): nel 1906 salgono i tribunali; dal 1907 l'inverno mangia il pane e gli interessi fanno salire i debiti; nel 1909 il villaggio si sfilaccia (l'aiuto cala) e i tribunali si allentano. Chi ha tagliato i ponti con i vicini lo paga alla mietitura e, se l'aiuto scende troppo, alla semina. **Crisi (una volta ciascuna):** i tribunali arrivano al villaggio (ombra a 40 o più: un giovane finisce alla forca e le assemblee si svuotano); «solo sul podere» (chi è uscito e ha l'aiuto a 20 o meno perde pane e prende debiti); il creditore (debiti a 40 o più: si prende parte del raccolto). Nessuna scelta riguarda sparare, reprimere o denunciare (D-006): i tribunali sono una conseguenza che il giocatore non controlla del tutto e di cui vede il prezzo.

**Esito.** Nessuna vittoria o sconfitta: un testo che rimanda al giudizio. Poi «Cosa ti devi ricordare», la verifica V4 e il confronto di fine atto (II.4-e3).

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-stolypin.test.js` sul motore vero (sei piani, quattro anni, tutte le combinazioni, tre semi).** Nessuna strategia è la migliore su tutti gli indicatori insieme; le tre strade aprono azioni diverse e portano a esiti diversi (chi esce ha più pane ma almeno 15 punti di aiuto in meno di chi resta, e più debiti; chi parte ha meno debiti e non rischia i tribunali); ogni azione serve; ogni crisi si può provocare; le etichette sulla scena non si sovrappongono.

## Elementi del kit

Punti azione con `cost`, `repeat`, `when` sui flag (le tre strade che si escludono) e `chance` con la probabilità che cresce con una metrica; carte condizionate (`cards[].when`) per il racconto di ogni strada; `hotspotNames`; crisi con condizione su flag e metrica; effetti fissi a inizio anno. Nessuna novità del motore (K7 non serve).

## Il resto dell'unità

- **Aneddoto registrato (uno):** «la cravatta di Stolypin», la corda dei tribunali militari (nominata nella scheda dell'atto, che la attribuisce a Montefiore; il passo esatto resta da riscontrare, vedi MATRICE). **Secondo aneddoto:** nessuno trovato nelle fonti dell'archivio (MATRICE).
- **Cosa ti devi ricordare** (`a2-stolypin-ricorda`, riscritto: prima parlava del 1905), **Verifica V4** (`a2-stolypin-v4`) e **confronto di fine atto** (`a2-stolypin-confronto`, II.4-e3): la petizione portata in supplica e finita sotto i fucili, lo sciopero e il Manifesto, le Dume sciolte e la «cravatta di Stolypin» (il contenuto della petizione non si dice). Il diario della famiglia aspetta K3.
- **Scene:** `stolypin-strisce` (il gioco e V4; le strisce diventano un podere), `stolypin-ricorda`, `stolypin-confronto` (nuova: l'icona del corteo, la bandiera dello sciopero, il Palazzo di Tauride e il podere in fila); disegni nuovi: nessuno.
- **Effetti a valle.** I flag `stolypin_resta`, `uscita_dal_mir` e `stolypin_vende` restano nello stato dell'atto; nessuna unità dopo li legge ancora (il diario di Atto III aspetta K3).

## Dati da riscontrare

La data del decreto (novembre 1906), il contenuto esatto del decreto, la durata dei tribunali militari e il fatto che il mir sia sopravvissuto in molti villaggi sono sintesi dagli appunti e da conoscenza generale: restano da riscontrare su un libro (MATRICE).
