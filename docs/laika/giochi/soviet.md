# Gioco di II.2 — Le giornate del soviet (`soviet`)

Scheda di gioco dell'unità `soviet` (canone: II.2). Versione 2 (costruita) · 5 novembre 2026. La versione 1 (approvata il 3 novembre 2026, D-020) è in [docs/archivio](../../archivio/GIOCO-SOVIET-v1-2026-11-05.md): indagare dava sempre le due letture ma nessuna scelta le faceva pesare. La v2 aggiunge «le letture che contano» e fissa il bilanciamento in un test sul motore vero (`tests/laika-soviet.test.js`). Applica [GIOCHI](../GIOCHI.md) §2 (regole comuni) e §3.8 (la giornata a punti azione). I contenuti degli episodi sono in [atto-2](../atti/atto-2.md). I numeri sono indici della simulazione; le notizie e i delegati sono inventati.

## Il gioco

**Forma:** punti azione con informazioni incomplete. **Durata:** circa dieci minuti, tre giornate dell'ottobre 1905 (sciopero generale, nascita del soviet), cinque punti ciascuna. **Chi è il giocatore:** un delegato che il soviet ha mandato a coordinare.

**Gli indicatori visibili (cinque):** Estensione dello sciopero, Cassa di sciopero, Fiducia dei delegati, Rischio di repressione, Notizie capite. In più la **Linea del soviet** (da 0, i moderati, a 100, i radicali; parte a 50): non è fra i cinque ma compare nelle variazioni dei pulsanti e dell'esito.

**Le azioni (un punto, salvo dove scritto):**
1. **Indagare** una notizia (la tessitrice, il ferroviere, il telegrafo): due letture opposte (il delegato moderato e il delegato radicale), le notizie capite salgono e si sblocca la scelta qui sotto.
2. **Dare più peso ai moderati** o **ai radicali** (l'etichetta dice «dopo aver indagato»; una volta ciascuno al giorno): la linea del soviet si sposta di 12 punti. Dare peso a tutte e due la lascia al centro.
3. **Mandare un delegato** dove lo sciopero esita (ripetibile, incerto: la probabilità cresce con le notizie capite).
4. **Distribuire pane e fondi** della cassa (ripetibile; solo se in cassa ci sono almeno 10).
5. **Trattare in nome del soviet** (due punti): si apre solo se la sala segue i moderati (linea 44 o meno), anche nello stesso giorno in cui si dà peso (la linea passa da 50 a 38); abbassa molto la repressione e mette il flag `tratta_prefetto`. **II.3 non lo legge ancora**: lo dicono la scheda di II.2 e II.3 in [atto-2](../atti/atto-2.md) (U-concessioni dovrà leggerlo).
6. **Fermare anche i treni** (due punti): si apre solo se la sala segue i radicali (linea 56 o più); allarga lo sciopero ma alza la repressione.

**Le letture che contano.** La linea resta da un giorno all'altro. Il giorno dopo una card racconta che la sala ha seguito i moderati o i radicali e le azioni a due punti si aprono o si chiudono di conseguenza: la scelta cambia che cosa si può fare nei giorni dopo, non solo i numeri di oggi. Ogni giorno si indaga di nuovo prima di poter dare peso.

**La notte:** un freddo, la fame, un arresto: effetti di inizio giornata (fondi, repressione, sciopero in calo). **Crisi (una volta ciascuna):** la cassa a 10 o meno (alcune fabbriche tornano al lavoro), la fiducia a 10 o meno (il soviet si spacca e si segna `linea_soviet`), la repressione a 90 o più (arresti), lo sciopero a 10 o meno (si sgonfia).

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-soviet.test.js` sul motore vero (cinque piani di giornata, tre giornate, quattro semi).** Nessuna strategia è la migliore su tutti gli indicatori insieme; seguire sempre la lettura dei moderati porta a una repressione bassa e a uno sciopero stretto, seguire sempre quella dei radicali a uno sciopero largo e a una repressione alta (differenze di almeno 10 punti); solo i moderati possono trattare; dare peso a tutte e due non sblocca niente; ogni azione serve in qualche piano; le etichette sulla scena non si sovrappongono.

**Esito.** Nessuna vittoria o sconfitta. Le giornate a punti azione chiudono con il testo fisso dell'episodio (il soviet è un contropotere; dare peso a una lettura apre alcune strade e ne chiude altre) e con gli indicatori. La linea scelta si racconta nelle card del secondo e del terzo giorno («La sala ha seguito i moderati/i radicali»), non in un giudizio finale: i giudizi (`verdicts`) esistono solo nella modalità a posti del motore.

## Il resto dell'unità

- **Cosa ti devi ricordare** (`a2-soviet-ricorda`): i due obiettivi in parole semplici (il soviet è un consiglio di delegati che coordina uno sciopero e non governa; le notizie a pezzi hanno letture opposte che pesano sulle decisioni).
- **Verifica V3** (`a2-soviet-v3`).
- **Che cos'è il soviet** (card documentata del primo giorno): consiglio di delegati di operai, soldati e studenti; contropotere; i socialdemocratici ne prendono presto la maggioranza (appunti «La Rivoluzione Russa», MATRICE A1-03).
- **Aneddoti:** nessuno trovato per il soviet del 1905 negli atlanti e negli appunti (la ricerca è registrata in MATRICE): non se ne inventano.

## Elementi del kit

- **Motore:** `turn_game` a punti azione con offerte `when` sui flag e sui valori delle metriche e un'offerta con `cost` 2; nessuna meccanica nuova (la condizione `when` bastava, K5 non serve).
- **Scena:** `soviet-sala`: tavolo del comitato, telegrafo e bandiera rossa senza scritte (`soviet-tavolo`, `soviet-telegrafo`, `soviet-bandiera`). Le azioni stanno su tre file (alto, centro, basso) con almeno 0,2 di distanza: nessuna etichetta si sovrappone a un'altra su 390 px, e sul telefono la scena si vede per intero (anche la bandiera). Le giornate non portano date nei titoli: le date del 1905 hanno due calendari e restano a II.3.

## Dati da riscontrare

La cronologia dei giorni (17–19 ottobre) è solo la cornice; delegati, notizie e numeri sono simulazione dichiarata.
