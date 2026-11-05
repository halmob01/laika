# Gioco di I.2 — Il mir (`mir`)

Scheda di gioco dell'unità `mir` (canone: I.2). Versione 2 · 4 novembre 2026 · costruita il 4 novembre 2026 (la versione 1, approvata il 3 novembre, è in [docs/archivio/GIOCO-MIR-v1-2026-11-03.md](../../archivio/GIOCO-MIR-v1-2026-11-03.md): una partita di sole richieste a scelta, un questionario con barre). Gioco del canone: «decisioni sui gruppi (l'assemblea del mir)». Regole comuni: [GIOCHI](../GIOCHI.md) §2 e §3.2. Motore: `turn_game` con posti, pedine, raccolto incerto, obbligo comune e controllo, già nel motore (nessuna meccanica nuova). Tutti i numeri sono indici della simulazione, non statistiche storiche.

## Il gioco: «Il mir»

**Forma:** gestione con richieste, otto assemblee (1862–1903). **Durata:** circa dieci minuti.

**Chi è il giocatore.** Il capofamiglia che l'assemblea ascolta di più (il ruolo dello starosta non è stato riscontrato).

**Che cosa si fa a ogni assemblea.**
1. **Si leggono le notizie** (una carta, con la distinzione fra fatto documentato e simulazione).
2. **Si assegnano sei strisce di terra** a quattro posti, toccando una striscia e poi il posto: **le famiglie numerose**, **chi ha curato il proprio lotto**, **le vedove e gli anziani soli** e **la cassa del riscatto**. Ogni striscia dà 8 punti al gruppo (10 alla cassa). La cassa del riscatto è un obbligo comune: ogni assemblea ci vuole almeno una striscia, altrimenti l'esattore può presentarsi (5 volte su 10, scritto prima): la cassa perde 8 e i tre gruppi 3 ciascuno.
3. **Si conferma e si vede l'esito.** Il raccolto cambia quanto rendono le strisce: buono (1 volta su 4: i lotti curati rendono di più), normale (2 su 4) o scarso (1 su 4: i lotti curati, le famiglie numerose e i soli rendono la metà). A ogni assemblea i bisogni del villaggio costano 6 punti a ciascun gruppo e i pagamenti 10 alla cassa: chi non viene servito scende.
4. **Una persona si alza e chiede qualcosa** (otto richieste, una per assemblea: rifare la divisione, i pagamenti arretrati, il raccolto scarso, una vedova senza braccia, un giovane che vuole partire, un concime in comune, un arretrato, il figlio che manda soldi). Una risposta ha un esito incerto con la probabilità scritta prima («un campo in comune: riesce 6 volte su 10»).

**Indicatori visibili (quattro):** Famiglie numerose, Lotti curati, Vedove e anziani soli, Cassa del riscatto (da 0 a 100, partono a 50).

**Crisi** (una volta ciascuna, con un gruppo a 10 o meno): un figlio parte per la città (flag `figlio_in_citta`, che I.3 legge); chi ha curato il lotto smette di migliorarlo; il villaggio mantiene le vedove e la cassa perde; con la cassa vuota l'esattore sequestra il bestiame e ogni gruppo ci rimette.

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-mir.test.js` sul motore vero** (quattro piani di assegnazione in quattro blocchi di due assemblee, tre modi di rispondere alle richieste, due semi): nessuna strategia è la migliore su tutti i gruppi insieme, perché le strisce sono sei e ognuna va a un gruppo solo; si può tenere insieme il villaggio senza nessuna crisi, ma solo spendendo bene le strisce; ogni crisi si può provocare; strategie diverse portano a esiti diversi. Misurato con la prima risposta a ogni richiesta (famiglie numerose, lotti curati, soli, cassa): **dare secondo il bisogno** 100, 20, 95, 50 (il lotto curato si trascura); **premiare chi ha curato** 73, 95, 68, 60 (nessuna crisi); **riempire la cassa** 40, 55, 68, 100 (un figlio parte); **trascurare i soli** 100, 95, 12, 90.

**Che cosa deve capire lo studente.** Il mir divide le strisce e il villaggio risponde insieme dei pagamenti (obiettivo 1: lo vede nell'obbligo della cassa e nell'esattore); ogni regola di divisione (a tutti lo stesso o secondo il bisogno) favorisce qualcuno e ne scontenta altri (obiettivo 2: lo vede nelle barre e nelle crisi); il mir non è un soviet né una democrazia moderna (obiettivo 3: «Cosa ti devi ricordare» e la verifica V7).

## Il resto dell'unità

- **Una carta documentata** a inizio partita: dopo il 1861 la terra va riscattata e il villaggio risponde insieme dei pagamenti (riscontri I1-09 e I1-10).
- **Cosa ti devi ricordare** (`a1-mir-ricorda`): i tre obiettivi in parole semplici.
- **Verifica V7** (`a1-mir-v7`, domanda `a1-v7`): «Che cos'è il mir?», legata all'obiettivo 3, con due distrattori (il soviet del 1905 e una democrazia moderna).
- **Aneddoti:** per il mir non c'è un aneddoto riscontrato nell'atlante né negli appunti (cercati «mir», «strisce», «riscatto», «villaggio»): si toglie, come vuole METODO §7.

## Elementi del kit

- **Motore:** posti, pedine (strisce), raccolto incerto, obbligo comune e controllo, richieste dopo l'esito: già nel motore. Nessuna meccanica nuova.
- **Scene:** `mir-assemblea` (strisce prima e dopo, registro, covone, S1). Disegni nuovi: nessuno.
- **Fonti registrate (MATRICE):** I1-09, I1-10, I2-02.

## Dati da riscontrare

- Le ridistribuzioni periodiche delle strisce e le regole dell'assemblea sono conoscenza generale (I2-02): nel testo restano formulate come «in molti villaggi».
- Il ruolo dello starosta e la richiesta di uscire dal villaggio: non entrano nel testo dello studente.
