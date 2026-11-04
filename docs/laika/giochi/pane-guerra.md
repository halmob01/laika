# Gioco di III.1 — Pane e guerra (`pane-guerra`)

Scheda di gioco dell'unità `pane-guerra` (canone: III.1). Versione 3 (costruita) · 4 novembre 2026 · le versioni 1 e 2 non sono passate alla revisione indipendente della scheda (la v1: ammassi come collo di bottiglia e un'azione senza costo; la v2: una strategia composta batteva di molto una semplice e tre stagioni su cinque erano vuote); il docente ha autorizzato di costruire il gioco e di fissare il bilanciamento in un test sul motore vero. Gioco del canone: «quanto serve e quanto c'è (grano, treni, città), prime code». Regole comuni: [GIOCHI](../GIOCHI.md) §2, §3.5 (le code), §3.6 (le merci che camminano) e §3.7 (quanto serve e quanto c'è). Motore: la catena di K2 (`src/core/chain.js`) e la coda di K1 e K6 (`src/core/queue.js`), con le giornate a punti azione già nel motore. Tutti i numeri sono indici della simulazione, non statistiche storiche.

## Il gioco: «Il grano, i treni, la città»

**Forma:** cinque stagioni a punti azione, ciascuna con quattro punti (GIOCHI §3.8 parla di cinque azioni: qui sono quattro, le stagioni sono cinque e il telefono vuole turni brevi). **Durata:** circa otto minuti. Autunno 1915, inverno 1915–1916, primavera 1916, autunno 1916, inverno 1916–1917.

**Chi è il giocatore.** Un funzionario dell'approvvigionamento (il ruolo `capofamiglia` del canone di atto è la famiglia che vedrà le conseguenze: qui decide come lo Stato usa il grano che ha).

**La catena (K2).** Quattro anelli: **i campi** (passano 8 a stagione, 24 in magazzino all'inizio), **gli ammassi dello Stato** (passano 8: non sono il collo di bottiglia), **i treni** (passano 3: **il collo di bottiglia**) e **le città**. Il grano fa un anello a stagione. Il raccolto entra nei campi: 12 in autunno, 2 nelle altre stagioni (ipotesi del modello). Un anello intermedio con 14 o più unità si inceppa e passa metà della capacità: succede soprattutto ai treni, davanti ai quali si accumula il grano. **Sulla carta** il ministero dichiara un obiettivo di 20; il **numero reale** è quello che arriva in città. **Lo scarto** fra carta e realtà segue la differenza (parte da 0). Ogni unità arrivata in città vale 2 punti di pane; la città ne consuma 8 a ogni stagione (effetto d'inizio stagione), perciò il pane scende se non arriva grano.

**Il fronte (evento di ogni stagione).** All'inizio di ogni stagione il quartier generale chiede i treni per le munizioni: si può **cedere i treni** (i treni passano 1 in meno per sempre) oppure **rifiutare** (le voci +3: i generali protestano e se ne parla). Così ogni stagione ha una decisione vera e la capacità dei treni è sempre sotto pressione.

**La fila (K1, K6).** Davanti ai forni c'è una fila di 12 persone, con pazienza 6. Segnali a 4, 2 e 1 (si stringono nello scialle, guardano l'orologio, battono i piedi). La pazienza scende di 1 a stagione, più 1 se il pane in città è a 30 o meno e più 1 nelle due stagioni d'inverno. Chi arriva a zero torna a casa e racconta: le voci salgono di 6 e scatta il flag `coda_lunga` (che III.2 legge). La fila **non è il gioco principale**: è il segnale che il pane non basta («prime code»).

**Indicatori visibili (tre):** Pane in città, Scarto fra carta e realtà, Voci che girano (lo stesso indicatore di III.2, parte da 20).

**Le azioni di una stagione** (quattro punti):
1. **Alzare il prezzo fissato del grano** (1 punto, una volta a stagione): gli ammassi +6 di grano (i contadini vendono di più); le voci +3 (con i rubli di oggi non si compra più niente).
2. **Imporre una quota di consegna ai villaggi** (1 punto, una volta a stagione): gli ammassi +10; le voci +5 (i contadini ricordano l'obbligo).
3. **Dare la precedenza ai treni del grano** (2 punti, una volta a stagione): i treni passano 1 in più (fino al doppio della partenza, cioè 6); le voci +2. È l'azione che apre il vero collo di bottiglia, e il fronte la rimette in discussione a ogni stagione.
4. **Fissare il prezzo del pane** (1 punto, una volta a stagione): la pazienza della fila +2; il pane in città −4 (i fornai tengono il pane per il mercato nero).
5. **Mandare un rapporto ottimista** (1 punto, ripetibile): la carta sale di 15; le voci −2.
6. **Mandare un ispettore sui treni** (1 punto, **5 su 10**, scritto prima, una volta a stagione): se riesce, i treni passano 1 in più e la carta scende di 5 (il rapporto si corregge); se non riesce, le voci salgono di 4.
7. **Dividere il pane della città** (1 punto, ripetibile): la pazienza della fila +1; il pane in città −5.

**Crisi** (una volta ciascuna, dopo ogni azione e dopo ogni stagione): con il pane in città a 10 o meno «le code cominciano di notte»: flag `coda_lunga` e pane +15; con lo scarto a 70 o più un giornale smentisce il rapporto: le voci +8 (non cambia la catena). L'inceppo non ha una crisi: si vede nel pannello della catena.

**Rischio fuori dal controllo.** L'ispettore (5 su 10, scritto prima). Il raccolto delle stagioni non lo decide il giocatore: lo legge.

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-pane-guerra.test.js` sul motore vero (quattro piani di stagione per cinque stagioni, pane iniziale 30 e 70, fronte ceduto o rifiutato).** Nessuna strategia è la migliore su tutti gli indicatori insieme: più pane contro meno scarto contro meno voci contro più grano arrivato. Una strategia composta può battere per poco una semplice (è dichiarato); non ne esiste una che vinca su tutto. Il test controlla anche che ogni azione serva in qualche strategia, che almeno tre strategie portino a esiti diversi e che il rischio sia scritto prima.

**Strategie tipiche (misurate dal test sul motore vero, pane iniziale 70; pane, scarto, voci, grano arrivato; la prima riga con il fronte che ottiene i treni, la seconda con il fronte rifiutato).**
- **Spremere i villaggi** (prezzo, quote, rapporti): 40, 100, 54, 1 e 62, 100, 69, 12. Gli ammassi si riempiono e i treni non reggono; la carta sale e lo scarto esplode.
- **Aprire il collo di bottiglia** (precedenza ai treni, ispettore): 64, 0, 44, 13 e 74, 0, 59, 18. Arriva più grano e lo scarto si chiude; costa voci.
- **Rassicurare** (prezzo del pane, pane diviso, rapporti): 8, 100, 8, 0 e 22, 100, 23, 7. La fila regge e le voci restano basse, ma il pane finisce e lo scarto è al massimo.
- **Non fare niente:** 38, 20, 26, 0 e 52, 13, 41, 7.
Nessuna strategia è la migliore su tutti gli indicatori: chi apre i treni ha più pane e meno scarto; chi rassicura ha meno voci. Una strategia composta può battere per poco una semplice: è dichiarato. Non fare niente non è mai la mossa migliore: esiste sempre una strategia che porta più pane e più grano.

**Esito.** Un testo finale dice che sulla carta il grano bastava e in città contava solo quello che arrivava; nessuna sconfitta.

## Il resto dell'unità

- **In ginocchio sulla stessa piazza** (`a3-pane-guerra-ginocchio`): racconto, 2 agosto 1914 (20 luglio); scena della piazza e del palazzo.
- **Gioielli e pane** (`a3-pane-guerra-gioielli`, confronto di tre schede): il gioielliere della corte (C39, Trockij, parafrasi: nell'inverno 1915–1916 avrebbe venduto come mai prima mentre mancavano pane e combustibile; testimonianza di un autore ostile al regime); la ballerina e le commesse d'artiglieria (C42: un'accusa riferita da Rodzjanko, non dimostrata); «stupidità o tradimento?» alla Duma (appunti) e la voce dell'imperatrice spia. Sotto la scena: *quando una voce falsa diventa più forte di un fatto vero?*
- **La fine dello zar comincia in famiglia** (`a3-pane-guerra-famiglia`): dicembre 1916, Rasputin ucciso da un principe e da un granduca; una granduchessa propone di «eliminare» l'imperatrice e Rodzjanko chiede di considerare la frase come non detta (C43, parole riferite da un avversario dei Romanov, testimonianza indiretta); all'ambasciatore britannico che lo invita a riconquistare la fiducia del suo popolo lo zar risponde che dovrebbe essere il popolo a riconquistare la sua (Montefiore, riscontrato in MATRICE; senza data nel testo dello studente). Nessuna scelta riguarda il violento: sono fatti riferiti (D-006).
- **Cosa ti devi ricordare** (`a3-pane-guerra-ricorda`): i tre obiettivi in parole semplici (il grano c'è ma non arriva: trasporti, prezzi fissati, guerra; le voci sulla corte più forti dei fatti; il trono perde il sostegno della famiglia e delle élite).
- **Verifica V5** (`a3-pane-guerra-v5`): perché manca il pane in città.

## Elementi del kit

- **Motore:** la catena (K2), la coda (K1, K6), giornate a punti azione. Nessuna meccanica nuova. Dati nuovi nell'atto: nessuno (usa `pane_citta`, `scarto` e `voci`); si tolgono le metriche `treni` e `grano_stato` (ora la capacità dei treni è nella catena) e il flag `coda_corteo`, inutilizzati.
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
