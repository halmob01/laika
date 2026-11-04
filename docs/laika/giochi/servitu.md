# Gioco di I.1 — La settimana del servo (`servitu`)

Scheda di gioco dell'unità `servitu` (canone: I.1). Gioco: gestione con decisioni sui gruppi ([GIOCHI](../GIOCHI.md) §3.1 e §3.2). Codice: `games/laika/source/acts/atto-1.json` (episodio `a1-u1-settimana`); bilanciamento in `tests/laika-i1.test.js`.

## Forma

Una partita di otto-dieci anni dal 1740 al 1861. Ogni anno:

1. **Dall'alto:** una o due card della corte (il dono di Caterina a Zorič; le feste) che cambiano una regola quaggiù (nuovo padrone, più giorni di corvée).
2. **La settimana:** sei giorni da piazzare sulla mappa del villaggio (campo della famiglia, campi del signore, bosco, isba); poi la card del tempo; poi il controllo dell'amministratore.
3. **Chi bussa:** una persona con una scelta (il pellegrino di Belovod'e, l'amministratore, il prete, il vicino con la lettera d'oro, il figlio che vuole partire).
4. **La stagione:** raccolto e inverno; sulla scena i sacchi accanto alla stufa o la stufa vuota; l'avviso dell'anno dopo.

**Gestione (decisione del docente del 23 ottobre 2026, «facciamola diventare una gestione vera»).** Le pedine non sono più giorni ma persone: il padre (●●●), la madre (●●), il nonno (●) e il figlio, che cresce (● nel 1740, ●●● dal 1787) e può partire. Si tocca una persona e poi il posto; la figura sulla scena si sposta lì. Oltre al campo, alla corvée e ai vicini ci sono quattro lavori lunghi che restano: l'orto (rendita fissa che il gelo non tocca), la stalla rifatta, un campo nel bosco e la sokha con le punte di ferro (che si comprano alla fiera). Prima di ogni anno si decide quanto grano tenere per la semina: si mangia prima del raccolto, quindi troppo seme porta alla fame e poco seme a un campo che rende poco. Tre anni (1761, 1787, 1820) hanno la fiera d'autunno, dove si paga in grano. L'esito spiega voce per voce da dove viene ogni variazione. Bilanciamento provato in `tests/laika-i1.test.js` su cinque strategie: obbedire tiene in vita ma non arricchisce; saltare poco rende poco e alza l'occhio; saltare molto porta qualcuno in Siberia; aiutare i vicini costa grano e crea legami; costruire costa fame subito e alla fine rende di più. Tutti i numeri sono simulazione.

**Generazioni (decisione del docente del 25 ottobre 2026, scelta A).** Dal 1740 al 1861 passano cinque generazioni: i quattro posti della casa (padre, madre, nonno, figlio) restano, le persone cambiano. Nel 1761, 1787, 1820, 1840 e 1861 una card racconta il passaggio con i nomi (Foma, Ivan, Pëtr, Stepan, Grigorij, Mikita, Vasilij, Fëdor; famiglia inventata [S]) e la forza del figlio riparte da quella di un ragazzo. Se il figlio o il padre sono stati mandati via, la card ha una variante. Lo studente vede che servi si nasce.

Metriche: Grano, Occhio del padrone, Speranza, Legami nel villaggio. Nel 1861 il Manifesto si legge in card; l'ultimo anno si gioca con la rata al posto della corvée. Chiusura: «Cosa ti devi ricordare» e la verifica V1. Fonti: le stesse della matrice (I1-01…I1-21).
