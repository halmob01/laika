> **Archivio, 5 novembre 2026.** Versione 1 della scheda di gioco delle giornate del soviet (le due letture si leggevano ma non cambiavano niente), sostituita dalla versione 2 in `docs/laika/giochi/soviet.md`. Non vale come istruzione.

# Gioco di IV.2 — Le giornate del soviet (`soviet`)

Scheda di gioco dell'unità `soviet` (canone: IV.2; fino al 4 novembre 2026 era la vecchia unità Atto IV «Il 1905»). Approvata dal docente il 3 novembre 2026 (D-020).

Versione 1 · 3 novembre 2026 · **approvata dal docente il 3 novembre 2026** con le impostazioni proposte (tre giornate da cinque azioni; due letture date da un delegato moderato e uno radicale senza nome di partito; il gioco sostituisce la scelta di ruolo di II.2-e1) · **costruita lo stesso giorno** (vedi «Scostamenti dalla scheda»). Applica [GIOCHI](../GIOCHI.md) §2 (regole comuni) e §3.8 (la giornata a punti azione). I contenuti degli episodi sono in [atto-2](../atti/atto-2.md).

I numeri sono indici della simulazione. I fatti non riscontrati sono segnati **[da riscontrare]** e non entrano nel testo per lo studente come dati.

**Forma:** punti azione con informazioni incomplete. **Durata:** circa dieci minuti, tre giornate dell'ottobre 1905 (sciopero generale, nascita del soviet). Si colloca come II.2-e1 «Il primo soviet», al posto della scelta semplice tra tre ruoli.

## Che cosa vede lo studente

In alto la sala del soviet (o la strada con le ciminiere); sotto, quattro indicatori; al centro la giornata: **cinque punti azione** da spendere, un'azione per volta, toccando un pulsante. Le notizie non sono complete: arrivano a pezzi e ognuno le legge a modo suo.

## Chi è il giocatore

Lo studente che il soviet ha mandato a coordinare: non sceglie per tutti ma sceglie dove spendere il proprio tempo. Resta il ruolo della scheda (II.2-e1: «lo studente decide come continuare lo sciopero»).

## Le azioni (ognuna costa 1 punto)

1. **Indagare** una notizia (una fabbrica che esita, una voce sui cosacchi, il telegrafo che tace): svela un pezzo in più; ogni notizia ha due letture opposte, date da un delegato moderato e da uno radicale.
2. **Mandare un delegato** a una fabbrica o a una linea ferroviaria: allarga lo sciopero ma lascia scoperto un altro posto.
3. **Distribuire** pane e fondi alla cassa di sciopero: tiene unito il fronte ma consuma la cassa.
4. **Trattare** con un'autorità (il prefetto, il direttore della fabbrica): abbassa il rischio di repressione ma fa calare la fiducia dei più radicali.
5. **Riposare / aspettare:** non fa nulla ma evita un errore.

Le azioni non si annullano. Alla fine della giornata arriva una notte: il freddo, la fame, un arresto, una voce confermata o smentita.

## Gli indicatori (da 0 a 100, partono a 50)

- **Estensione dello sciopero** (alto è meglio ai fini dello sciopero).
- **Cassa di sciopero** (alto è meglio).
- **Fiducia dei delegati** (alto è meglio).
- **Rischio di repressione** (basso è meglio).

## Regole della crisi

Un indicatore a 10 o meno apre una crisi, una sola volta: la cassa vuota rompe lo sciopero in alcune fabbriche; la fiducia a zero spezza il soviet in due linee; la repressione a 90 porta un arresto dei delegati.

## Il rischio si vede

Le azioni incerte mostrano la probabilità prima di spendere il punto («il delegato arriva in tempo: 7 volte su 10»).

## Che cosa deve capire lo studente

- Il soviet del 1905 è un contropotere: coordina uno sciopero, non governa.
- Chi decide con notizie incomplete sceglie spesso in base a chi gliele racconta.
- Una concessione ottenuta con lo sciopero (il Manifesto di ottobre) dipende da quanto regge lo sciopero stesso. **[da riscontrare]** la cronologia di dettaglio dei giorni.

## Esito

Nessuna vittoria o sconfitta. Un giudizio di una riga sullo stato dello sciopero e il riepilogo dei quattro indicatori. Si porta avanti il flag `linea_soviet` (a II.3-e1 e a II.4-e1, poi a IV.2).

## Il codice

Serve una modalità generica del motore: **giornata a punti azione** (azioni con costo e effetti, notizie con due letture, notte come evento). Parte in `src/` con test; contenuto in `games/laika/source/`. Disegni: sala del soviet e strada con ciminiere (il catalogo ha già le ciminiere e le figure; mancano il tavolo dei delegati e il telegrafo).

## Domande per il docente

1. Tre giornate e cinque punti sono giuste o preferisci una giornata sola più lunga?
2. Le due letture della stessa notizia le dà un delegato moderato e uno radicale (come in [GIOCHI](../GIOCHI.md) §3.8): va bene tenerli senza nome di partito nel testo dello studente?
3. Il gioco sostituisce la scelta di ruolo di II.2-e1 oppure la precede?

## Scostamenti dalla scheda (costruzione del 3 novembre 2026)

- **Modalità a punti azione del motore (3 novembre 2026):** il gioco usa il `market` con `points`: tre giornate da cinque punti, azioni toccabili sulla scena (le due letture opposte si vedono indagando, un punto ciascuna), delegato ripetibile e incerto (la probabilità cresce con le notizie capite), la notte come effetti di inizio giornata. Sostituisce la prima versione a 15 turni di scelte.
- **Disegni:** nessun disegno nuovo. Scena della sala con `ambiente-sala` e figure del catalogo; il tavolo dei delegati e il telegrafo non ci sono.
- **Episodi di Atto IV costruiti:** tutti e sei (e1 domenica di sangue, e2 petizione a cinque righe, e3 giornate del soviet, e4 confronto sul Manifesto di ottobre, e5 Stolypin, e6 verifiche V3 e V4) più la pagina «Cosa ti devi ricordare». Le fonti di e4 sono sintesi per il gioco dagli appunti, non testi originali; la scelta di Stolypin (`uscita_dal_mir`, `stolypin_resta`, `stolypin_vende`) non ha ancora effetti a valle.
- **Taratura:** simulazioni su sei strategie fisse e venti partite ciascuna: nessuna strategia vince senza costi, ma «mandare sempre un delegato» rende molto. Da ritoccare.
- **Fatti da riscontrare:** la cronologia dei giorni è indicativa; i personaggi e le notizie sono inventati e dichiarati simulazione.

III.2 usa la stessa modalità per «La coda per il pane» e «Il soldato che non spara» (episodi `a1-u6-coda-gioco` e `a1-u6-soldato`).
