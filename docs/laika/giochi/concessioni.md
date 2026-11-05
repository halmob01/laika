# Gioco di II.3 — Le tre stagioni delle concessioni (`concessioni`)

Scheda di gioco dell'unità `concessioni` (canone: II.3). Versione 1 (costruita) · 5 novembre 2026 · gioco scelto dall'agente fra quelli del repertorio (D-038, D-039) al posto del confronto di tre schede; nel canone lo stato è «da confermare» finché il docente non lo prova (C-II). Applica [GIOCHI](../GIOCHI.md) §2 e §3.8 (la giornata a punti azione, qui «stagione»). I contenuti degli episodi sono in [atto-2](../atti/atto-2.md). I numeri sono indici della simulazione; ministri, deputati e numeri sono inventati.

## Il gioco

**Forma:** punti azione, tre stagioni da quattro punti (ottobre 1905, 1906, 1907). **Durata:** circa otto minuti. **Chi è il giocatore:** il figlio della famiglia, fra chi dentro e fuori il soviet prova a far diventare vero quello che lo zar ha promesso.

**Gli indicatori (quattro):** **Promesso sulla carta** (il Manifesto lo riempie), **Poteri veri** (quello che i deputati e il soviet possono davvero fare), **Piazza organizzata** e **Reazione dello zar** (bassa è meglio). Il senso è nel divario fra carta e poteri.

**Le azioni (un punto, salvo dove scritto):** **Chiedere le libertà per iscritto** (la carta sale, la reazione un po'); **Tenere la piazza organizzata** (ripetibile: la piazza e un po' i poteri, la reazione sale); **Mandare deputati in Duma** (dalla seconda stagione, incerta: la probabilità cresce con la piazza, scritta prima: se riesce una legge passa davvero); **Trattare con il ministro** (si apre solo se il soviet ha trattato col prefetto: poteri su, reazione giù); **Minacciare un altro sciopero** (si apre solo se il soviet non ha trattato: piazza e poteri su, ma la reazione cresce molto). Le azioni chiuse restano visibili e dicono quando si aprono (la Duma «dal 1906», il ministro e lo sciopero secondo la scelta del soviet).

**La scelta del soviet.** Il flag `tratta_prefetto` (II.2) decide quale delle due strade è aperta: chi aveva trattato ha un canale con il governo, chi non l'aveva ha solo la piazza e la sua forza costosa. Se si gioca l'unità senza passare dal soviet il flag è falso: si apre lo sciopero.

**Le stagioni:** il Manifesto riempie la carta (+20) e porta qualche potere (+4); nel 1906 le Leggi fondamentali tolgono potere vero (−8) e aprono la Duma; nel 1907 la reazione dello zar sale (+6). **Crisi (una volta ciascuna):** la reazione a 60 o più (lo zar scioglie la Duma: poteri e carta calano), la carta a 40 o più con i poteri a 10 o meno («sulla carta c'è tutto e nelle mani non c'è niente»).

**Esito.** Nessuna vittoria o sconfitta: un testo che rimanda al giudizio. Poi le tre schede (II.3-e2, «Diritto o tregua?»): il Manifesto, le Leggi fondamentali, le due Dume sciolte, e la scelta con due fatti.

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-concessioni.test.js` sul motore vero (cinque piani, tre stagioni, tre semi, il soviet che ha trattato o no).** Nessuna strategia è la migliore su tutti gli indicatori insieme; la scelta del soviet apre azioni diverse e porta a esiti diversi (chi minaccia senza trattativa alza la reazione di almeno 10 punti rispetto a chi tratta); la carta è sempre almeno quanto i poteri; ogni azione serve; ogni crisi si può provocare; le etichette sulla scena non si sovrappongono.

## Il resto dell'unità

- **Aneddoto registrato (uno):** la ballerina Baletta, «Indossi le nostre corazzate», dopo Tsushima (atlante C36, Montefiore). Il racconto è attribuito e detto «grido di un pubblico arrabbiato, non un fatto da tribunale».
- **Non usato:** il granduca Nikolaj che minaccia di spararsi se lo zar non firma. Il passo non è riscontrato nelle fonti dell'archivio (solo citato in `docs/laika/fonti/LIBRI.md`): resta da riscontrare su Montefiore (MATRICE).
- **Cosa ti devi ricordare** (`a2-concessioni-ricorda`) e **Verifica V9** (`a2-concessioni-v9`).
- **Scena:** `concessioni-sala` (sala di San Giorgio con l'aquila, palco del teatro); disegni nuovi: nessuno.

## Dati da riscontrare

Il contenuto del Manifesto (libertà civili e una Duma eletta), le Leggi fondamentali «autocratiche» e la durata delle due Dume sono sintesi dagli appunti: dettagli e date restano da riscontrare su un libro (MATRICE); la data del 30 ottobre (17 ottobre nel calendario russo) compare solo nella chiusura dell'unità.
