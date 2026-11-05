# Gioco di I.3 — Il salario (`salario`)

Scheda di gioco dell'unità `citta` (canone: I.3). Versione 2 (costruita) · 5 novembre 2026 · la versione 1 (approvata il 3 novembre 2026, D-019) è in [docs/archivio](../../archivio/GIOCO-SALARIO-v1-2026-11-05.md): con la spesa fissa 3 pane, 2 stanza, 2 carbone, 1 villaggio le forze salivano a 100 senza mai una crisi. La v2 aggiunge la pressione che la scheda chiedeva (aumento dell'affitto, freddo lungo, giorno di fabbrica ferma, multa) e fissa il bilanciamento in un test sul motore vero (`tests/laika-citta.test.js`). Regole comuni: [GIOCHI](../GIOCHI.md) §2 e §3.1. Tutti i numeri sono indici della simulazione, non statistiche storiche.

## Il gioco

**Forma:** gestione a più settimane. **Durata:** circa quindici minuti, otto settimane. **Chi è il giocatore:** il figlio partito dal villaggio.

**Le monete.** Ogni sabato arrivano otto monete (indice della simulazione). Si assegnano toccando una moneta e poi un posto: **Pane** (forze +8 a moneta), **Angolo di stanza** (forze +2; massimo 3), **Carbone** (forze +6), **Soldi al villaggio** (legami +8) e **Corso serale** (lettura +10, forze −3; massimo 2).

**Ogni settimana, comunque.** Le forze scendono di 24 e i legami con il villaggio di 8: con tre monete di pane le forze restano ferme; senza lettere e soldi a casa il villaggio smette di rispondere.

**La pressione (eventi delle settimane, regole del motore).**
- **Settimana 3, «L'affitto sale»:** la stanza vuole 3 monete e non più 2, fino alla fine. Se mancano, la padrona di casa può bussare (8 volte su 10) e le monete che mancano diventano debito.
- **Settimane 4–6, «Il freddo si mette»:** le forze scendono di altre 12 a settimana. Il carbone serve (3 monete) e un freddo forte nell'imprevisto lo rende meno efficace.
- **Settimana 5, «La fabbrica si ferma»:** il salario è di sette monete. Il giorno dopo torna intero.
- **Settimana 7, «Il freddo passa».**
- **La multa del caposquadra** (settimana 5): accettare costa forze e debito; protestare riesce 4 volte su 10, scritto prima.
- **Chi bussa:** il compagno malato, la sorella dal villaggio, l'operaio con il foglio, il vecchio operaio, la lettera da casa.
- **Il negozio a credito** (settimane 2, 4 e 6): pane o carbone subito e debito dopo.

**Imprevisti con probabilità scritta prima di confermare:** pane più caro (3 su 10), freddo forte (2 su 10). **Crisi (una volta ciascuna):** le forze a 10 o meno (a letto: si guadagna di meno), il debito a 8 o più (si perde la stanza e si va nel dormitorio), i legami a 0 (a casa non rispondono più).

**Indicatori visibili (quattro):** Forze, Debito, Legami con il villaggio, Quanto sai leggere i fogli.

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-citta.test.js` sul motore vero (cinque piani, tre blocchi di settimane, tre modi di rispondere alle richieste e di comprare a credito).**
1. Con la stessa mossa ogni settimana non si regge: ciascuno dei cinque piani applicato per tutte le otto settimane provoca almeno una crisi in tutti i casi.
2. Cambiando mossa a tempo esiste una strategia senza crisi, ma ogni scelta ha un prezzo (chi tiene la stanza e il pane lascia cadere i legami; chi manda soldi a casa o studia finisce a letto).
3. Nessuna strategia è la migliore su tutti gli indicatori insieme (forze, debito, legami, lettura).
4. Strategie diverse portano a esiti diversi; ogni crisi si può provocare; chi compra a credito finisce più spesso nel dormitorio; ogni posto serve in qualche piano.

**Esito.** Un giudizio di una riga («Allo stremo», «Si tira avanti», «Si regge») e il riepilogo degli indicatori. Nessuna sconfitta.

## Il resto dell'unità

- **In città** (`a1-citta-arrivo`), **Il razzo del condannato** (`a1-citta-razzo`), **La corte dell'ultimo secolo** (`a1-citta-corte`: sala con i lampadari, ciminiere fuori e la tazza smaltata di Chodynka per terra), **Tre volantini** (`a1-citta-volantini`), **Cosa ti devi ricordare**, **Verifica V2**.
- **Il villaggio e la fabbrica** (`a1-citta-confronto`, I.3-e7, confronto di fine atto): che cosa hanno lasciato la servitù, il 1861, il mir e la fabbrica; il diario della famiglia con due case. La scena mette villaggio e fabbrica nella stessa inquadratura, con la lettera in mezzo. Il diario personalizzato (chi è rimasto e chi è partito) aspetta il ponte fra gli atti (K3): oggi il testo vale per tutte le famiglie.

## Elementi del kit

- **Motore:** `turn_game` con pedine come monete, regole per settimana (`rules` del turno: minimo della stanza, mantenimento, numero di monete), probabilità e crisi. Nessuna meccanica nuova.
- **Scene:** `citta-stanza` (il gioco), `citta-fabbrica` (la fabbrica si ferma), `citta-dormitorio` (V2), `citta-corte`, `citta-cella`, `citta-volantini`, `citta-arrivo`, `citta-confronto` (nuova). Disegni nuovi: nessuno.
- **Aneddoti con le fonti registrate (MATRICE):** C30, C31, C34, C35, C37; R02.

## Dati da riscontrare

- Multe in fabbrica e negozio a credito sono ipotesi del modello: nel testo per lo studente non compaiono come fatti. Capacità, monete e costi sono indici.

## Domande per il revisore

1. Giocando, lo studente sente che la stessa mossa non basta ogni settimana e capisce perché (affitto, freddo, salario ridotto)?
2. La regola G3 è rispettata dai numeri del test?
3. Il confronto di fine atto lega servitù, 1861, mir e fabbrica senza dare per fatti le ipotesi del modello?
