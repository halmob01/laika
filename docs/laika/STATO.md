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

In attesa del docente: le proposte P-01–P-05 in [DECISIONI](DECISIONI.md) (soprattutto P-01, la divisione dell'Atto II in quattro unità, già usata nel gioco come proposta).

## Le unità costruite

Nessuna è ancora stata provata e approvata dal docente dal telefono.

| Unità | Che cosa c'è | Che cosa manca | Evidenze |
|---|---|---|---|
| I.1 `servitu` | La settimana del servo: otto anni dal 1740 al 1861, cinque generazioni, migliorie, fiera, chi bussa, verifica V1 | Previsione ed esito del grano che si contraddicono; numeri negativi; pagina lunga sul telefono | `tests/browser-i1.cjs`; [revisione del 4 novembre](revisioni/2026-11-04-allievo-atto-I.md) |
| I.2 `mir` | Otto assemblee, quattro gruppi | È un questionario con barre: niente da gestire fra una richiesta e l'altra | revisione del 4 novembre §5 |
| I.3 `citta` | In città, il salario (otto settimane), il razzo, la corte, i tre volantini, verifica V2 | Il salario si vince con la stessa mossa ogni settimana; manca il confronto di fine atto | revisione §5 |
| Atto II (II.1–II.4) | Petizione e domenica di sangue (II.1), giornate del soviet a punti azione e V3 (II.2), che cosa concede lo zar (II.3), Stolypin, V4 e «Cosa ti devi ricordare» (II.4) | Approvazione della divisione in unità (P-01); giochi di petizione, concessioni e Stolypin; aneddoti dei libri (diario di Nicola, il granduca, Baletta); le notizie del soviet non servono a niente; confronto di fine atto | revisione §3 e §5 |
| III.1 `pane-guerra` | In ginocchio, il grano e i treni come partita di sole decisioni, gioielli e pane, la fine dello zar, verifica V5 | **Da rifare**: il gioco approvato (quanto serve e quanto c'è, prime code) non c'è; aneddoti (Fabergé, Kšesinskaja, Rodzjanko) | revisione §3 |
| III.2 `otto-giorni` | Giornata della donna, la coda a punti azione, il soldato a punti azione, il treno, verifica V6, confronto | **Da rifare**: la coda vera (figure che lasciano la fila); aneddoti del treno (baffi, Frederiks); disegno del treno nella neve (oggi treno, fine dello zar e confronto sono senza scena, invece di riusare scene sbagliate) | revisione §3 e §4 |

## Home e sito

- Home: nove fascicoli dal canone; i tre atti costruiti hanno titolo e «Apri il fascicolo» che portano alla pagina dell'atto (`play.html?game=laika&atto=atto-N`). Evidenze: `docs/evidence/riordino/`.
- Pagina dell'atto, dell'unità e chiusura (#25); ogni unità si apre dalla pagina del suo atto (#37), anche in un atto diverso da quello della partita salvata.
- Finita l'ultima unità di un atto, la chiusura mostra «Fine dell'atto» e porta alla pagina dell'atto successivo.
- Corretti nella PR #38: chiusura dell'atto, muro di indicatori, pulsanti delle giornate, errori di lingua. Corretti nella PR R3: didascalie di altre scene sotto gli episodi che riusano una scena, didascalia generica sotto le verifiche, giornate a punti azione chiuse senza vedere i punti rimasti, numeri negativi nella previsione del grano.
- Restano: etichette sovrapposte sulla scena (sala del soviet), pagine lunghe sul telefono (tabellone di I.1), la home a 626 KB contro i 500 del budget, «Riprendi» nella home che non compare se si è appena entrati in un'unità senza agire.

## Verifiche automatiche

La CI gioca i tre atti in Chromium e WebKit: circa 11 minuti per browser. Il limite del job è 20 minuti (era 12: il 4 novembre 2026 WebKit è stato interrotto dal limite subito dopo l'unione delle PR del riordino).

## Disegni

Catalogo in `bottega/catalogo.json`. Kit `kit-villaggio-mir`, `kit-interni-citta`, `kit-soviet-coda` in stato «bozza», da approvare dal docente. Mancano il treno nella neve e il Palazzo di Tauride per l'Atto III (le scene oggi riusano la sala del soviet).

## Da fare dopo il riordino (in ordine)

1. Giochi da rifare, uno per PR, ciascuno con la sua scheda approvata: la coda vera (III.2); il grano e i treni (III.1); il soviet con notizie che servono (II.2); i giochi di petizione, concessioni e Stolypin (dopo P-01); il mir come gioco; il salario più difficile.
2. Aneddoti dai libri per gli Atti II e III (Opus, con i libri caricati dal docente).
3. Il filo della famiglia fra gli atti e gli effetti differiti previsti dalle schede.
4. Date da verificare: revisione del 4 novembre §6.
5. Confronto di fine atto per gli Atti I e II.
