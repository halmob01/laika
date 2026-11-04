# Gioco di III.2 — Otto giorni (`otto-giorni`)

Scheda di gioco dell'unità `otto-giorni` (canone: III.2). Versione 2 · 4 novembre 2026 · la versione 1 non è passata alla revisione indipendente (errore di data nel racconto del treno, obiettivo 3 solo nominato, numeri che non sostenevano la tesi); questa la corregge. Gioco del canone: «code che diventano corteo, poi punti azione (il soldato che non spara)». Regole comuni: [GIOCHI](../GIOCHI.md) §2, §3.5 (le code) e §3.8 (la giornata a punti azione). Motore: la coda con la pazienza (K1, [CREARE-UN-GIOCO](../../CREARE-UN-GIOCO.md)).

Tutti i numeri sono indici della simulazione, non statistiche storiche. Le date sono nei due calendari: 8 marzo (23 febbraio nel calendario russo), 12 marzo (27 febbraio), 15 marzo (2 marzo), 16 marzo (3 marzo). Gli appunti dello studio riportano «22 febbraio» e «primo marzo»: in contrasto con le schede dell'atto, si usano le date della scheda e si lasciano fuori dal testo dello studente quelle non riscontrate.

**Punti azione.** GIOCHI §3.8 parla di cinque azioni al giorno; il motore ammette da 1 a 9. Qui i punti sono quattro al giorno: le giornate sono sette in tutto e una scelta in meno per giornata le tiene brevi sul telefono.

## Le due parti

L'unità ha due giochi collegati dagli stessi indicatori (lo stato dell'atto passa dall'uno all'altro). Un racconto apre (l'8 marzo); dopo il secondo gioco vengono il racconto del treno, la verifica, «Cosa ti devi ricordare» e il confronto di fine atto.

### Parte 1 — La coda (`a3-otto-giorni-coda`)

**Forma:** giornate a punti azione con la coda del motore K1. **Durata:** circa otto minuti, quattro giornate (8, 9, 10 e 11 marzo) da quattro punti.

**Chi è il giocatore.** La figlia operaia tessile (ruolo dell'unità), in coda per il pane e nello stesso tempo dentro la fabbrica.

**Obiettivo dichiarato al giocatore.** «Tieni la coda in fila il più a lungo che puoi: ma guarda dove va chi se ne va.» Chi gioca scopre che la coda si scioglie comunque e che quello che sceglie decide quando e dove.

**Che cosa vede lo studente.** La scena `otto-giorni-coda` e il pannello «La coda»: tre gruppi in fila, ciascuno con la sua pazienza.
- **Le tessili di Vyborg** (8 persone, pazienza 6): se la perdono tornano in fabbrica e portano fuori le compagne.
- **Le madri con i bambini** (6, pazienza 5): se la perdono si uniscono al corteo.
- **I vecchi e gli invalidi** (5, pazienza 6): se la perdono tornano a casa e raccontano quello che hanno visto.

**Segnali a soglie fisse.** A 4 «si stringono nello scialle», a 2 «guardano l'orologio», a 1 «battono i piedi» (pose `si_stringe`, `guarda_orologio`, `batte_piedi`). Il pannello dice fra quanti turni un gruppo se ne va e che segnale sta per partire: il giocatore vede la crisi arrivare.

**Come scende la pazienza (a fine giornata).** Di 1 più 1 per ciascun fattore che vale: **il gelo** (dal 9 marzo; è un parametro della simulazione), **la fame** (pane in città a 30 o meno), **le voci** (voci a 60 o più), **la coda lunga** (se in III.1 la città è arrivata al 1917 con la coda già lunga: flag `coda_lunga`). Nell'ultima giornata la discesa del turno è di 5 in più: la fila non regge oltre l'11 marzo, per qualunque cosa si faccia (è l'ipotesi del modello: tre anni di guerra, il freddo e la fame; non è un dato).

**Il pane cala da solo.** Ogni giornata il pane in città scende di 8 (nel testo: «Ogni notte ne arriva meno»), a partire dal valore con cui finisce III.1.

**Indicatori visibili (tre):** Pane in città; Voci che girano (nuovo, da 0 a 100); Operai in piazza (lo stesso indicatore della parte 2). La forza del vecchio ordine si muove ma si mostra solo nella parte 2.

**Le azioni di una giornata** (quattro punti; ogni azione dichiara che cosa fa):
1. **Parlare alle tessili** (1 punto, ripetibile): le tessili +2 di pazienza; voci −2.
2. **Far passare le madri con i bambini** (1 punto, una volta al giorno): le madri +3; pane −3.
3. **Dividere il poco pane** (1 punto, ripetibile): tutti +1; pane −6.
4. **Andare al forno a chiedere** (2 punti, **5 su 10**, scritto prima): se va bene, pane +12 e tutti +1; se va male il fornaio non ha niente e le voci salgono di 6.
5. **Dire alle tessili che a Vyborg si è già usciti dalle fabbriche** (1 punto, ripetibile): voci +8, operai +4, le tessili −2 di pazienza.
6. **Ascoltare le voci della fila** (1 punto, ripetibile): voci +2; i vecchi +1.

**Dove vanno.** Chi arriva a zero lascia la fila, e l'uscita sposta gli indicatori: le tessili portano operai in piazza (+14) e tolgono forza all'ordine; le madri fanno corteo (operai +10, ordine −6); i vecchi tornano a casa (voci +8). Chi se n'è andato non torna. Quando in piazza ci sono 45 operai o più (una sola volta) le fabbriche si fermano: operai +10, ordine −6.

**Rischio fuori dal controllo.** Il forno (5 su 10, scritto prima). Il gelo del 9 marzo arriva comunque: lo studente lo legge, non lo decide.

**Strategie diverse (devono portare a esiti diversi, verificati con la simulazione).**
- **Calmare** (parole, bambini, pane diviso): la fila regge fino all'ultima giornata e le voci restano basse, ma il pane in città finisce e la piazza si riempie solo l'ultimo giorno, quando tutti se ne vanno insieme.
- **Organizzare** (dire che a Vyborg si è già usciti): le tessili escono presto, la piazza si riempie in anticipo e le voci salgono; le madri e i vecchi restano in coda senza pane.
- **Cercare il pane** (il forno, due punti): con fortuna la coda tiene e il pane resta; senza, restano meno punti per tutto il resto.
Nessuna strategia tiene insieme la fila, il pane, le voci basse e la piazza. Una prova con un modello semplificato (200 partite per strategia) dà, a fine parte 1: calmare, pane 0, voci 18, operai 74, fila fino al giorno 4; organizzare, pane 18, voci 100, operai 100, gruppi usciti al giorno 3; cercare il pane, pane 65, voci 58, operai 74, fila fino al giorno 4; non fare niente, pane 18, voci 34, operai 74, gruppi usciti al giorno 3. La simulazione col motore vero (`tests/laika-otto-giorni.test.js`) la sostituisce.

**Esito.** Il testo finale dice dove sono finiti i tre gruppi (fabbrica, corteo, casa). Nessuna sconfitta.

### Parte 2 — Il soldato che non spara (`a3-otto-giorni-soldato`)

**Forma:** giornate a punti azione (già nel motore). **Durata:** circa otto minuti, tre giornate (12, 13 e 14 marzo) da quattro punti. Il giocatore è un soldato del reggimento Volynskij la mattina del 12 marzo (27 febbraio): il rifiuto di sparare è un fatto [D]; la scelta riguarda il dopo (tornare in caserma, convincere le altre caserme, aprire l'arsenale agli operai, restare in piazza, marciare verso il Palazzo di Tauride).

**Indicatori visibili (tre):** Soldati con gli operai, Operai in piazza (parte dal valore con cui finisce la parte 1), Forza del vecchio ordine.

**Revisione degli effetti (richiesta dal piano).** «Convincere un'altra caserma» riesce con probabilità scritta: 4 su 10 più 4 punti per ogni 10 soldati già con gli operai. Aprire l'arsenale costa due punti e muove due indicatori. Nessuna azione è la migliore in ogni caso: lo verifica la simulazione. Regola D-006: nessuna scelta riguarda sparare, reprimere o denunciare.

**Marciare al Palazzo di Tauride** (2 punti): è l'unica azione che mostra i due poteri. Scatta una volta (flag `verso_tauride`) e il testo dice che cosa sono, con una parola per ciascuno: il **Comitato provvisorio della Duma** è fatto di deputati della vecchia Duma e dal 15 marzo darà il governo provvisorio di L'vov (appunti); il **soviet di Pietrogrado** è fatto di delegati di operai e soldati e decide per alzata di mano (appunti). Nascono lo stesso giorno, il 12 marzo, nello stesso palazzo. Chi non ci va, lo legge nel racconto del treno.

**Crisi.** Con 10 operai o meno in piazza il corteo si disperde; con l'ordine a 95 o più riprende la piazza e porta via forza ai soldati.

**Che cosa deve capire lo studente.** Un ammutinamento diventa rivoluzione quando non resta solo dei soldati: servono operai in piazza, altre caserme e un luogo dove andare. Disobbedire una volta è un gesto; farlo insieme a molti è l'inizio di qualcosa.

## Il resto dell'unità

- **Racconto di apertura (`a3-otto-giorni-donna`).** L'8 marzo (23 febbraio): le tessili escono dalle fabbriche e chiamano i metallurgici. Nessun partito aveva previsto che quel giorno aprisse una rivoluzione (R88, Trockij; testo in parafrasi). Sotto la scena: *chi fa davvero una rivoluzione?*
- **Racconto del treno (`a3-otto-giorni-treno`).** Il 12 marzo (27 febbraio) al Palazzo di Tauride nascono lo stesso giorno il Comitato provvisorio della Duma e il soviet. Il 15 marzo (2 marzo) il treno dello zar è fermo a Pskov; mentre arrivano i telegrammi Nicola continua ad annotare nel diario la vita del treno (R15, Miéville, parafrasi). Abdica. Dopo, saluta, si tocca i baffi per abitudine e torna nel suo vagone (R08, Miéville, parafrasi). Il 16 marzo (3 marzo) anche il fratello Michele rinuncia al trono (appunti). Il passo dei telegrammi in francese e del pianto di Frederiks della scheda dell'atto non si trova nelle fonti (atlante e appunti): si toglie (METODO §7) e `docs/laika/atti/atto-3.md` si aggiorna.
- **Verifica V6** (`a3-otto-giorni-v6`), formativa, legata all'obiettivo 2: perché il rifiuto dei soldati trasforma una protesta in una rivoluzione.
- **Cosa ti devi ricordare** (`a3-otto-giorni-ricorda`): i tre obiettivi dell'unità in parole semplici: la sequenza dalle code all'abdicazione; perché i soldati che non sparano cambiano tutto; i due poteri del Palazzo di Tauride (il Comitato della Duma e il soviet).
- **Confronto di fine atto (`a3-otto-giorni-confronto`).** Che cosa aveva preparato la terra, che cosa la fabbrica, che cosa il 1905, che cosa la guerra, che cosa decisero piazza, soldati e generali. Il disco rosso lascia il Palazzo d'Inverno e si posa sul Palazzo di Tauride (scena `otto-giorni-confronto`, con una bandiera rossa perché a catalogo non c'è un disco).

## Elementi del kit

- **Motore:** la coda con la pazienza (K1, in `main`); giornate a punti azione (in `main`). Nessuna meccanica nuova. Dati nuovi nell'atto: metrica `voci`, metrica nascosta `gelo`.
- **Bottega:** pose `si_stringe`, `guarda_orologio`, `batte_piedi` (K1); `walk` con `da: [dx, dy]` per chi lascia la fila.
- **Scene:** `otto-giorni-donna`, `otto-giorni-coda`, `otto-giorni-soldato`, `otto-giorni-treno`, `otto-giorni-confronto` (S1). Disegni nuovi: nessuno.
- **Aneddoti con le fonti registrate (MATRICE):** R88, R15, R08.

## Dati da riscontrare

- Il gelo, la durata della fila e i gruppi sono ipotesi del modello, dichiarate simulazione.
- Il passo di Frederiks: non trovato, tolto.

## Domande per il revisore

1. Lo studente capisce, giocando, perché la coda si scioglie comunque e che cosa decide dove va?
2. Le tre strategie portano a esiti diversi e nessuna domina?
3. D-006 rispettata? Date e fatti coerenti con le fonti?
