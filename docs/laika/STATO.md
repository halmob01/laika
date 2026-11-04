# LAIKA — Stato del lavoro

A che punto è ogni cosa, con le evidenze. Si aggiorna in ogni PR. La struttura che fa fede è nel [canone](CANONE.md); qui si dice solo che cosa c'è e che cosa manca.

Aggiornato al 4 novembre 2026.

## Adesso

**Riordino finito** ([RIORDINO](RIORDINO.md)). Il gioco segue il canone: tre atti fino al 1917, unità con i nomi stabili, identificatori degli episodi derivati dai nomi (`a1-citta-salario`, `a2-soviet-giornate`, `a3-otto-giorni-coda`). Il build legge titoli, periodi e domande dal canone e si ferma se gli atti o le unità non coincidono; `tests/canone.test.js` e `tests/units.test.js` lo controllano anche per la home.

| Fase | Che cosa | Stato |
|---|---|---|
| R0 | Piano del riordino | PR #39 |
| R1 | Riordino dei documenti; `npm run canone`; test di coerenza dei documenti | PR #40 |
| R2 e R3 | Il build legge il canone; il gioco in tre atti; home con nove fascicoli; usabilità | PR R3 |

Proposte P-01–P-05 chiuse dal docente il 4 novembre (D-038, D-039): si lavora in autonomia con [PIANO-1917](PIANO-1917.md).

## Le unità costruite

Nessuna è ancora stata provata e approvata dal docente dal telefono.

| Unità | Che cosa c'è | Che cosa manca | Evidenze |
|---|---|---|---|
| I.1 `servitu` | La settimana del servo: otto anni dal 1740 al 1861, cinque generazioni, migliorie, fiera, chi bussa, verifica V1 | Previsione ed esito del grano che si contraddicono; numeri negativi; pagina lunga sul telefono | `tests/browser-i1.cjs`; [revisione del 4 novembre](revisioni/2026-11-04-allievo-atto-I.md) |
| I.2 `mir` | Otto assemblee, quattro gruppi | È un questionario con barre: niente da gestire fra una richiesta e l'altra | revisione del 4 novembre §5 |
| I.3 `citta` | In città, il salario (otto settimane), il razzo, la corte, i tre volantini, verifica V2 | Il salario si vince con la stessa mossa ogni settimana; manca il confronto di fine atto | revisione §5 |
| Atto II (II.1–II.4) | Petizione e domenica di sangue (II.1), giornate del soviet a punti azione e V3 (II.2), che cosa concede lo zar (II.3), Stolypin, V4 e «Cosa ti devi ricordare» (II.4) | giochi di petizione, concessioni e Stolypin; aneddoti dei libri (diario di Nicola, il granduca, Baletta); le notizie del soviet non servono a niente; confronto di fine atto | revisione §3 e §5 |
| III.1 `pane-guerra` | In ginocchio, il grano e i treni come partita di sole decisioni, gioielli e pane, la fine dello zar, verifica V5 | **Da rifare**: il gioco approvato (quanto serve e quanto c'è, prime code) non c'è; aneddoti (Fabergé, Kšesinskaja, Rodzjanko) | revisione §3 |
| III.2 `otto-giorni` | Giornata della donna, la coda a punti azione, il soldato a punti azione, il treno, verifica V6, confronto | **Da rifare**: la coda vera (figure che lasciano la fila); aneddoti del treno (baffi, Frederiks); scene del treno nella neve e del Palazzo di Tauride da comporre con disegni che ci sono già ([PIANO-KIT](PIANO-KIT.md)); oggi treno, fine dello zar in famiglia e confronto sono senza scena invece di riusare scene sbagliate | revisione §3 e §4 |

## Controllo automatico delle unità (4 novembre 2026)

Uscita di `LAIKA_RAPPORTO=1 node tests/unita-ludiche.test.js` (regole di METODO §7, G3a). Diventa vincolante per ogni unità quando il suo incarico è «fatto». Dal 4 novembre controlla anche lo standard didattico (D-040): a mir, petizione e concessioni manca anche la verifica; a mir, petizione, soviet, concessioni, pane e guerra e otto giorni manca «Cosa ti devi ricordare».

| Unità | Che cosa manca |
|---|---|
| I.1 `servitu` | niente |
| I.2 `mir` | solo richieste a scelta multipla, niente da distribuire o spendere; nessun contenuto documentato |
| I.3 `citta` | niente (ma il salario si vince con una mossa fissa: lo controlla G3) |
| II.1 `petizione` | nessun gioco; un modulo con caselle numeriche; nessuna fonte registrata |
| II.2 `soviet` | nessuna fonte registrata; nessun contenuto documentato (le notizie che non contano le vede G4) |
| II.3 `concessioni` | nessun gioco; nessuna fonte registrata; nessuna scena propria |
| II.4 `stolypin` | nessun gioco; nessuna fonte registrata; scene prese dal mir e dal soviet |
| III.1 `pane-guerra` | solo richieste a scelta multipla; nessuna fonte registrata |
| III.2 `otto-giorni` | nessuna fonte registrata; la coda usa la scena della panetteria di III.1 |

## Home e sito

- Home: nove fascicoli dal canone; i tre atti costruiti hanno titolo e «Apri il fascicolo» che portano alla pagina dell'atto (`play.html?game=laika&atto=atto-N`). Evidenze: `docs/evidence/riordino/`.
- Pagina dell'atto, dell'unità e chiusura (#25); ogni unità si apre dalla pagina del suo atto (#37), anche in un atto diverso da quello della partita salvata.
- Finita l'ultima unità di un atto, la chiusura mostra «Fine dell'atto» e porta alla pagina dell'atto successivo.
- Corretti nella PR #38: chiusura dell'atto, muro di indicatori, pulsanti delle giornate, errori di lingua. Corretti nella PR R3: didascalie di altre scene sotto gli episodi che riusano una scena, didascalia generica sotto le verifiche, giornate a punti azione chiuse senza vedere i punti rimasti, numeri negativi nella previsione del grano.
- Restano: etichette sovrapposte sulla scena (sala del soviet), pagine lunghe sul telefono (tabellone di I.1), la home a 626 KB contro i 500 del budget, «Riprendi» nella home che non compare se si è appena entrati in un'unità senza agire.

## Verifiche automatiche

La CI gioca i tre atti in Chromium e WebKit: circa 11 minuti per browser. Il limite del job è 20 minuti (era 12: il 4 novembre 2026 WebKit è stato interrotto dal limite subito dopo l'unione delle PR del riordino).

## Disegni e kit

Catalogo in `bottega/catalogo.json`: 136 disegni, 32 in bozza da approvare dal docente. Che cosa serve dal kit unità per unità, che cosa c'è già e in che ordine si fa: [PIANO-KIT](PIANO-KIT.md). Il treno nella neve e il Palazzo di Tauride si possono già comporre con i disegni che ci sono.

## Da fare

Gli incarichi fino al 1917, in ordine e con lo stato di ciascuno, sono in [PIANO-1917](PIANO-1917.md) (`npm run prossimo` per il prossimo). Gli elementi del kit di ogni unità sono in [PIANO-KIT](PIANO-KIT.md).
