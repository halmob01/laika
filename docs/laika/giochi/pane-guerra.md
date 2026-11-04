# Gioco di III.1 — Pane e guerra (`pane-guerra`)

Scheda di gioco dell'unità `pane-guerra` (canone: III.1). Versione 1 · 4 novembre 2026 · da far passare alla revisione indipendente prima del codice (METODO §7). Gioco del canone: «quanto serve e quanto c'è (grano, treni, città), prime code». Regole comuni: [GIOCHI](../GIOCHI.md) §2, §3.5 (le code), §3.6 (le merci che camminano) e §3.7 (quanto serve e quanto c'è). Motore: la catena di K2 (`src/core/chain.js`) e la coda di K1 e K6 (`src/core/queue.js`), con le giornate a punti azione già nel motore. Tutti i numeri sono indici della simulazione, non statistiche storiche.

## Il gioco: «Il grano, i treni, la città»

**Forma:** cinque stagioni a punti azione, ciascuna con quattro punti (GIOCHI §3.8 parla di cinque azioni: qui sono quattro, le stagioni sono cinque e il telefono vuole turni brevi). **Durata:** circa otto minuti. Autunno 1915, inverno 1915–1916, primavera 1916, autunno 1916, inverno 1916–1917.

**Chi è il giocatore.** Un funzionario dell'approvvigionamento (il ruolo `capofamiglia` del canone di atto è la famiglia che vedrà le conseguenze: qui decide come lo Stato usa il grano che ha).

**La catena (K2).** Quattro anelli: **i campi** (passano 8 a stagione, 24 in magazzino), **gli ammassi dello Stato** (6), **i treni** (4), **le città**. Il grano fa un anello a stagione. Il raccolto entra nei campi: abbondante in autunno, scarso nelle altre stagioni. Un anello intermedio con 10 o più unità si inceppa (passa metà della capacità). Sulla carta il ministero dichiara un obiettivo di 60; il numero reale è quello che arriva in città. **Lo scarto fra carta e realtà** è un indicatore. Il grano che arriva sposta il **pane in città**.

**La fila (K1, K6).** Davanti ai forni c'è una fila di 12 persone, con pazienza 6. Segnali a 4, 2 e 1 (si stringono nello scialle, guardano l'orologio, battono i piedi). La pazienza scende di 1 a stagione, più 1 se il pane in città è a 30 o meno e più 1 nelle due stagioni d'inverno. Chi arriva a zero torna a casa e racconta: le voci salgono di 6 e resta il flag `coda_lunga` (che III.2 legge). La fila **non è il gioco principale**: è il segnale che il pane non basta («prime code»).

**Indicatori visibili (tre):** Pane in città, Scarto fra carta e realtà, Voci che girano (lo stesso indicatore di III.2, parte da 20).

**Le azioni di una stagione** (quattro punti):
1. **Alzare il prezzo fissato del grano** (1 punto, una volta a stagione): gli ammassi +6 di grano (i contadini vendono di più); le voci +3 (con i rubli di oggi non si compra più niente).
2. **Imporre una quota di consegna ai villaggi** (1 punto, una volta a stagione): gli ammassi +10; le voci +5 (i contadini ricordano l'obbligo).
3. **Dare la precedenza ai treni del grano** (2 punti): i treni passano 2 in più (fino al doppio della partenza); le voci +2.
4. **Fissare il prezzo del pane** (1 punto, una volta a stagione): la pazienza della fila +2; gli ammassi −4 di grano (i fornai tengono il pane per il mercato nero).
5. **Mandare un rapporto ottimista** (1 punto, ripetibile): la carta sale di 15; le voci −2.
6. **Mandare un ispettore sui treni** (1 punto, **5 su 10**, scritto prima): se riesce, i treni passano 1 in più e la carta scende di 5 (il rapporto si corregge); se non riesce, le voci salgono di 4.
7. **Dividere il pane della città** (1 punto, ripetibile): la pazienza della fila +1; il pane in città −5.

**Crisi** (una volta ciascuna, dopo ogni azione e dopo ogni stagione): con il pane in città a 10 o meno «le code cominciano di notte»: flag `coda_lunga` e pane +15; con lo scarto a 70 o più un giornale smentisce il rapporto: scarto −20 e voci +8. L'inceppo non ha una crisi: si vede nel pannello della catena.

**Rischio fuori dal controllo.** L'ispettore (5 su 10, scritto prima). Il raccolto delle stagioni non lo decide il giocatore: lo legge.

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-pane-guerra.test.js` sul motore vero.** Nessuna strategia è la migliore su tutti gli indicatori insieme: più pane contro meno scarto contro meno voci. Una strategia composta può battere per poco una semplice (è dichiarato); non ne esiste una che vinca su tutto. Il test gioca ogni combinazione di piani di stagione (cinque piani per cinque stagioni) con pane iniziale 30, 50 e 70, e controlla anche che ogni azione serva in qualche strategia, che almeno tre strategie portino a esiti diversi e che il rischio sia scritto prima.

**Strategie tipiche.**
- **Spremere i villaggi** (prezzo e quote): gli ammassi si riempiono, i treni non reggono e il granaio si inceppa; il pane arriva poco e le voci salgono.
- **Aprire il collo di bottiglia** (precedenza ai treni, ispettore): arriva più pane e lo scarto si chiude, ma restano pochi punti per tutto il resto.
- **Rassicurare** (rapporto, prezzo del pane): la fila regge più a lungo e il numero sulla carta sale, ma lo scarto cresce e prima o poi il giornale smentisce.

**Esito.** Un testo finale dice che sulla carta il grano bastava e in città contava solo quello che arrivava; nessuna sconfitta.

## Il resto dell'unità

- **In ginocchio sulla stessa piazza** (`a3-pane-guerra-ginocchio`): racconto, 2 agosto 1914 (20 luglio); scena della piazza e del palazzo.
- **Gioielli e pane** (`a3-pane-guerra-gioielli`, confronto di tre schede): il gioielliere della corte (C39, Trockij, parafrasi: nell'inverno 1915–1916 avrebbe venduto come mai prima mentre mancavano pane e combustibile; testimonianza di un autore ostile al regime); la ballerina e le commesse d'artiglieria (C42: un'accusa riferita da Rodzjanko, non dimostrata); «stupidità o tradimento?» alla Duma (appunti) e la voce dell'imperatrice spia. Sotto la scena: *quando una voce falsa diventa più forte di un fatto vero?*
- **La fine dello zar comincia in famiglia** (`a3-pane-guerra-famiglia`): dicembre 1916, Rasputin ucciso da un principe e da un granduca; una granduchessa propone di «eliminare» l'imperatrice e Rodzjanko chiede di considerare la frase come non detta (C43, parole riferite da un avversario dei Romanov, testimonianza indiretta); all'ambasciatore britannico che lo invita a riconquistare la fiducia del suo popolo lo zar risponde che dovrebbe essere il popolo a riconquistare la sua (Montefiore, riscontrato in MATRICE; senza data nel testo dello studente). Nessuna scelta riguarda il violento: sono fatti riferiti (D-006).
- **Cosa ti devi ricordare** (`a3-pane-guerra-ricorda`): i tre obiettivi in parole semplici (il grano c'è ma non arriva: trasporti, prezzi fissati, guerra; le voci sulla corte più forti dei fatti; il trono perde il sostegno della famiglia e delle élite).
- **Verifica V5** (`a3-pane-guerra-v5`): perché manca il pane in città.

## Elementi del kit

- **Motore:** la catena (K2), la coda (K1, K6), giornate a punti azione. Nessuna meccanica nuova. Dati nuovi nell'atto: nessuno (usa `pane_citta`, `scarto` e `voci`); si tolgono le metriche `treni` e `grano_stato` e il flag `coda_corteo`, ora inutilizzati.
- **Bottega:** pose di attesa (K1).
- **Scene:** `pane-guerra-ginocchio`, `pane-guerra-treni` (la catena), `pane-guerra-pane` (la fila e la vetrina), `pane-guerra-famiglia` (il palazzo isolato), `pane-guerra-trincea` (V5). Disegni nuovi: nessuno. Il legame fra le figure della scena e gli anelli della catena (campo `figure`) non è nel motore: la scena mostra gli anelli come elementi fissi e il pannello dice dove si inceppa.
- **Aneddoti con le fonti registrate (MATRICE):** C39, C42, C43, la battuta all'ambasciatore.

## Dati da riscontrare

- Capacità, magazzini, quota del ministero e durata della fila sono ipotesi del modello, dichiarate simulazione.
- C39 e C42 sono testimonianze riferite da Trockij: nel testo restano attribuite alla fonte e non presentate come fatti dimostrati.

## Domande per il revisore

1. Giocando, lo studente capisce perché il pane non arriva anche se il grano c'è (trasporti, prezzi fissati, guerra)?
2. Il motore (K2, K1, K6) basta a realizzare tutto? La regola G3 letterale è rispettata dai numeri?
3. D-006, date e fonti: le voci sono attribuite e non presentate come fatti?
