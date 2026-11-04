# LAIKA — Stato del lavoro

A che punto è ogni cosa, con le evidenze. Si aggiorna in ogni PR. La struttura che fa fede è nel [canone](CANONE.md); qui si dice solo che cosa c'è e che cosa manca.

Aggiornato al 4 novembre 2026.

## Adesso

**Riordino in corso** ([RIORDINO](RIORDINO.md)). Gli incarichi di contenuto e di gioco sono fermi fino alla fine della fase R3 (D-026).

| Fase | Che cosa | Stato |
|---|---|---|
| R0 | Piano del riordino | PR #39 |
| R1 | Riordino dei documenti; `npm run canone`; test di coerenza dei documenti (`tests/canone.test.js`) | PR R1 |
| R2 | Il build legge il canone; il test controlla anche il gioco | da fare, insieme a R3 |
| R3 | Il gioco nei tre atti; home e usabilità | da fare |

**Il gioco non segue ancora il canone.** Fino alla fase R3 il gioco ha un solo atto («Atto I — La terra e lo zar», sei unità I.1–I.6, dal 1700 al 1917). Corrispondenze:

| Nel gioco oggi | Nel canone |
|---|---|
| I.1 Anime e semidei (`i1`, episodi `a1-u1-*`) | I.1 `servitu` |
| I.2 La terra dopo il Manifesto (`i2`, `a1-u2-mir`) | I.2 `mir` |
| I.3 In città (`i3`, episodi `a1-u2-*`) | I.3 `citta` |
| I.4 Il 1905 (`i4`, `a1-u4-*`) | Atto II: II.1 `petizione`, II.2 `soviet`, II.3 `concessioni`, II.4 `stolypin` |
| I.5 Pane e guerra (`i5`, `a1-u5-*`) | III.1 `pane-guerra` |
| I.6 Otto giorni (`i6`, `a1-u6-*`) | III.2 `otto-giorni` |

## Le unità costruite

Tutte in `main` come bozza: nessuna è ancora stata provata e approvata dal docente dal telefono.

| Unità | Che cosa c'è | Che cosa manca | Evidenze |
|---|---|---|---|
| I.1 `servitu` | La settimana del servo: otto anni dal 1740 al 1861, cinque generazioni, migliorie, fiera, chi bussa, verifica V1 | Previsione ed esito del grano che si contraddicono; numeri negativi; pagina lunga sul telefono | `tests/browser-i1.cjs`; [revisione del 4 novembre](revisioni/2026-11-04-allievo-atto-I.md) |
| I.2 `mir` | Otto assemblee, quattro gruppi | È un questionario con barre: niente da gestire fra una richiesta e l'altra | revisione del 4 novembre §5 |
| I.3 `citta` | In città, il salario (otto settimane), il razzo, la corte, i tre volantini, verifica V2 | Il salario si vince con la stessa mossa ogni settimana; manca il confronto di fine atto | revisione §5 |
| Atto II (vecchia I.4) | Petizione, domenica di sangue, giornate del soviet a punti azione, che cosa concede lo zar, Stolypin, verifiche V3 e V4 | Divisione in unità (P-01); giochi di petizione, concessioni e Stolypin; aneddoti dei libri (diario di Nicola, il granduca, Baletta); le notizie del soviet non servono a niente; confronto di fine atto | revisione §3 e §5 |
| III.1 `pane-guerra` | In ginocchio, il grano e i treni come partita di sole decisioni, gioielli e pane, la fine dei semidei, verifica V5 | **Da rifare**: il gioco approvato (quanto serve e quanto c'è, prime code) non c'è; aneddoti (Fabergé, Kšesinskaja, Rodzjanko) | revisione §3 |
| III.2 `otto-giorni` | Giornata della donna, la coda a punti azione, il soldato a punti azione, il treno, verifica V6, confronto | **Da rifare**: la coda vera (figure che lasciano la fila); aneddoti del treno (baffi, Frederiks); scena del treno | revisione §3 e §4 |

## Home e sito

- Home approvata (PR #19) con sette fascicoli: va portata ai nove atti del canone (R3, D-025).
- Pagina dell'atto, dell'unità e chiusura in `main` (#25); tutte le unità si aprono dalla pagina dell'atto (#37).
- Problemi di usabilità aperti dalla revisione del 4 novembre: didascalie sbagliate sotto le scene riusate, etichette sovrapposte sulla scena, pagine lunghe sul telefono, giornate a punti azione che si chiudono con un tocco senza spendere punti, budget della home 623 KB contro 500. Corretti nella PR #38: chiusura dell'atto, muro di indicatori, pulsanti delle giornate, errori di lingua.

## Disegni

Catalogo in `bottega/catalogo.json`. Kit `kit-villaggio-mir`, `kit-interni-citta`, `kit-soviet-coda` in stato «bozza», da approvare dal docente. Mancano il treno nella neve e il Palazzo di Tauride per l'Atto III (le scene oggi riusano la sala del soviet).

## Da fare dopo il riordino (in ordine)

1. Giochi da rifare, uno per PR, ciascuno con la sua scheda approvata: la coda vera (III.2); il grano e i treni (III.1); il soviet con notizie che servono (II.2); i giochi di petizione, concessioni e Stolypin (dopo P-01); il mir come gioco; il salario più difficile.
2. Aneddoti dai libri per gli Atti II e III (Opus, con i libri caricati dal docente).
3. Il filo della famiglia fra gli atti e gli effetti differiti previsti dalle schede.
4. Date da verificare: revisione del 4 novembre §6.
5. Confronto di fine atto per gli Atti I e II.
