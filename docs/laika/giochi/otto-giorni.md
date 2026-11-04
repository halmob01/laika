# Gioco di III.2 — Otto giorni (`otto-giorni`)

Scheda di gioco dell'unità `otto-giorni` (canone: III.2). Versione 1 · 4 novembre 2026 · da far passare alla revisione indipendente prima del codice (METODO §7). Gioco del canone: «code che diventano corteo, poi punti azione (il soldato che non spara)». Regole comuni: [GIOCHI](../GIOCHI.md) §2, §3.5 (le code) e §3.8 (la giornata a punti azione). Motore: la coda con la pazienza (K1, [CREARE-UN-GIOCO](../../CREARE-UN-GIOCO.md)).

Tutti i numeri sono indici della simulazione, non statistiche storiche. Le date sono nei due calendari: 8 marzo (23 febbraio nel calendario russo), 12 marzo (27 febbraio), 15 marzo (2 marzo). Gli appunti dello studio riportano «22 febbraio» e «primo marzo»: in contrasto con le schede dell'atto, si usano le date della scheda e si lasciano fuori dal testo dello studente quelle non riscontrate.

## Le due parti

L'unità ha due giochi collegati dagli stessi indicatori (lo stato dell'atto passa dall'uno all'altro). Fra i due, un breve racconto (l'8 marzo) apre; dopo il secondo, il racconto del treno, la verifica e il confronto di fine atto.

### Parte 1 — La coda (`a3-otto-giorni-coda`)

**Forma:** giornate a punti azione con la coda del motore K1. **Durata:** circa otto minuti, quattro giornate (8, 9, 10 e 11 marzo) da quattro punti.

**Chi è il giocatore.** La figlia operaia tessile (ruolo dell'unità), in coda per il pane e nello stesso tempo dentro la fabbrica.

**Che cosa vede lo studente.** La scena `otto-giorni-coda` (la coda davanti al cartello del pane, la tessera, la fabbrica tessile) e il pannello «La coda»: tre gruppi in fila, ciascuno con la sua pazienza.
- **Le tessili di Vyborg** (8 persone, pazienza 6): se la perdono tornano in fabbrica e portano fuori le compagne.
- **Le madri con i bambini** (6, pazienza 5): se la perdono si uniscono al corteo.
- **I vecchi e gli invalidi** (5, pazienza 8): se la perdono tornano a casa e raccontano quello che hanno visto.

**Segnali a soglie fisse.** A 4 «si stringono nello scialle», a 2 «guardano l'orologio», a 1 «battono i piedi» (pose `si_stringe`, `guarda_orologio`, `batte_piedi`). Il giocatore vede la crisi arrivare: il pannello dice fra quanti turni un gruppo se ne va e che segnale sta per partire.

**Come scende la pazienza.** Di 1 ogni giornata, più 1 per ciascun fattore che vale: **il gelo** (dal 9 marzo), **la fame** (pane in città a 30 o meno), **le voci** (voci a 60 o più), **la coda lunga** (se in III.1 il giocatore ha lasciato partire il grano senza i treni: flag `coda_lunga`).

**Indicatori visibili (tre):**
- **Pane in città** (alto è meglio per la coda, ma non vince il gioco);
- **Voci che girano** (indice nuovo, da 0 a 100);
- **Operai in piazza** (alto significa che la protesta cresce; viene dallo stesso indicatore usato nella parte 2).
La **forza del vecchio ordine** si muove ma non si mostra in questa parte (è un indicatore della parte 2).

**Le azioni di una giornata** (quattro punti, toccando la coda o i luoghi della scena; ogni azione dichiara che cosa fa):
1. **Parlare alle tessili** (1 punto, ripetibile): le tessili +2 di pazienza; voci −2.
2. **Far passare le madri con i bambini** (1 punto, una volta al giorno): le madri +3; pane −3.
3. **Dividere il poco pane** (1 punto, ripetibile): tutti +1; pane −6.
4. **Andare al forno a chiedere** (2 punti, probabilità scritta: 5 su 10): se va bene, pane +12 e tutti +1; se va male il fornaio dice che non c'è niente, le voci +6.
5. **Dire alle tessili che a Vyborg si è già usciti dalle fabbriche** (1 punto, ripetibile): voci +8, operai +4, le tessili −2 di pazienza (se ne andranno prima).
6. **Ascoltare le voci della fila** (1 punto, ripetibile): voci +2; i vecchi +1.

**Che cosa succede.** A fine giornata la pazienza scende, partono i segnali e chi arriva a zero lascia la fila verso la sua destinazione: le tessili portano operai in piazza (+14) e tolgono forza all'ordine; le madri fanno corteo (operai +10, ordine −6); i vecchi tornano a casa (voci +8). Chi se n'è andato non torna.

**Rischio fuori dal controllo.** Il forno (5 su 10, scritto prima). In più il gelo del 9 marzo arriva comunque: lo studente lo legge nella giornata, non lo decide.

**Strategie diverse (devono portare a esiti diversi).**
- **Calmare:** parole, bambini, pane diviso. La coda regge più a lungo, ma il pane finisce: arrivano la fame e il gelo e il crollo è comunque quello, solo più tardi.
- **Organizzare:** le tessili escono prima, la piazza si riempie in anticipo; le madri e i vecchi restano in coda senza pane.
- **Cercare il pane:** il forno (due punti, 5 su 10). Con fortuna la coda tiene due giorni in più; senza, restano meno punti per tutto il resto.
Nessuna strategia salva insieme la coda, il pane e la piazza.

**Esito.** Il testo finale dice dove sono finiti i tre gruppi (fabbrica, corteo, casa) e quanti operai ci sono in piazza. Nessuna sconfitta: la coda, in ogni caso, si scioglie. Che cosa cambia è dove va.

### Parte 2 — Il soldato che non spara (`a3-otto-giorni-soldato`)

**Forma:** giornate a punti azione (già nel motore). **Durata:** circa otto minuti, tre giornate (12, 13 e 14 marzo) da quattro punti. Il giocatore è il soldato del reggimento Volynskij il giorno dopo il rifiuto: il rifiuto è un fatto [D]; la scelta riguarda il dopo (tornare in caserma, convincere le altre caserme, aprire l'arsenale, restare con gli operai, marciare al Palazzo di Tauride).

**Indicatori visibili (tre):** Soldati con gli operai, Operai in piazza, Forza del vecchio ordine. Gli operai partono dal valore con cui è finita la parte 1.

**Revisione degli effetti (richiesta dal piano).** Oggi le cinque azioni cambiano tre indicatori con numeri poco distinti e le giornate hanno gli stessi effetti di inizio turno; con la simulazione si controlla che: nessuna azione sia la migliore in ogni caso; «convincere un'altra caserma» dipenda da quanti soldati sono già con gli operai (probabilità scritta, 4 su 10 più 4 punti per ogni 10 soldati); aprire l'arsenale costi due punti ma cambi due indicatori; marciare al Palazzo di Tauride sia l'unica azione che chiude il gioco in modo diverso (apre il racconto del treno con i due poteri). Regola D-006: nessuna scelta riguarda sparare, reprimere o denunciare.

**Crisi.** Con pochi operai in piazza (10 o meno) il corteo si disperde; con l'ordine a 95 o più riprende la piazza (e porta via forza ai soldati).

**Che cosa deve capire lo studente.** Un ammutinamento diventa rivoluzione quando non resta solo dei soldati: servono operai in piazza, altre caserme e un luogo dove andare (il Palazzo di Tauride). Disobbedire una volta è un gesto; farlo insieme a molti è l'inizio di qualcosa.

## Il resto dell'unità

- **Racconto di apertura (`a3-otto-giorni-donna`).** L'8 marzo (23 febbraio): le tessili escono, chiamano i metallurgici. Nessun partito aveva previsto che quel giorno aprisse una rivoluzione (R88, Trockij: «inaugurare la rivoluzione»). Sotto la scena: *chi fa davvero una rivoluzione?*
- **Racconto del treno (`a3-otto-giorni-treno`).** 15 marzo (2 marzo). Al Palazzo di Tauride nascono lo stesso giorno il Comitato provvisorio della Duma e il soviet di Pietrogrado (due poteri). Il treno dello zar è fermo a Pskov. Mentre arrivano i telegrammi Nicola annota nel diario la vita del treno (R15, Miéville: «nervosamente scribacchiando sul suo diario»). Abdica. Dopo, si tocca i baffi come al solito e torna nel vagone (R08, Miéville: «si toccò con le dita i baffi come era sua abitudine»). Il passo dei telegrammi in francese e del pianto di Frederiks della scheda dell'atto non è stato trovato nelle fonti (atlante e appunti): si toglie, come vuole METODO §7.
- **Verifica V6** (`a3-otto-giorni-v6`), formativa e legata all'obiettivo 2: perché il rifiuto dei soldati trasforma una protesta in una rivoluzione.
- **Cosa ti devi ricordare:** i tre obiettivi dell'unità in parole semplici (sequenza dalle code all'abdicazione; perché i soldati che non sparano cambiano tutto; i due poteri del Palazzo di Tauride, il Comitato della Duma e il soviet).
- **Confronto di fine atto (`a3-otto-giorni-confronto`).** Che cosa aveva preparato la terra, che cosa la fabbrica, che cosa il 1905, che cosa la guerra, che cosa decisero piazza, soldati e generali. Il disco rosso lascia il Palazzo d'Inverno e si posa sul Palazzo di Tauride (scena `otto-giorni-confronto`, con una bandiera rossa perché a catalogo non c'è un disco).

## Elementi del kit

- **Motore:** la coda con la pazienza (K1, già in `main`); giornate a punti azione (già in `main`); flag e metriche dell'atto. Un indicatore nuovo (`voci`) e uno nascosto (`gelo`) nell'atto; il flag `coda_lunga` esiste già.
- **Bottega:** pose `si_stringe`, `guarda_orologio`, `batte_piedi` (K1); `walk` con `da: [dx, dy]` per chi lascia la fila.
- **Scene:** `otto-giorni-donna`, `otto-giorni-coda`, `otto-giorni-soldato`, `otto-giorni-treno`, `otto-giorni-confronto` (S1). Disegni: `coda-tessera`, `oggetto-cartello-pane`, `ambiente-fabbrica`, `oggetto-fucile`, `mezzo-treno`, `infra-binari`, `atmo-neve`, `luogo-palazzo`, `luogo-palazzo-tauride`. Disegni nuovi: nessuno.
- **Aneddoti con le fonti registrate (MATRICE):** R88, R15, R08.

## Dati da riscontrare

- Il gelo del 9 marzo è un parametro della simulazione, non un dato storico: nel testo dello studente non è presentato come fatto.
- Il numero delle persone in coda e dei gruppi è inventato e dichiarato simulazione.
- Il passo di Frederiks (francese e pianto): non trovato, tolto.

## Domande per il revisore

1. Il giocatore capisce, giocando, perché la coda si scioglie comunque e che cosa decide dove va?
2. Le tre strategie portano a esiti davvero diversi? Qualcuna è dominante?
3. D-006 rispettata? Le due parti sono coerenti con le date e con le fonti?
