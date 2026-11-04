# LAIKA — Piano degli elementi del kit per gli Atti I–III

4 novembre 2026. Che cosa serve dal kit (motore, bottega, scene) per finire ogni unità dei tre atti fino al 1917, che cosa c'è già e che cosa va fatto prima. Struttura e stato delle unità: [canone](CANONE.md). Lavoro sui giochi: [STATO](STATO.md), «Da fare».

## 1. Come si usa

Il kit si compone **insieme all'unità**, non dopo. Ogni pezzo sta in uno di questi tre livelli:

| Livello | Che cos'è | Dove | Quando si fa |
|---|---|---|---|
| Motore | una regola di gioco nuova (la coda con la pazienza, la catena delle merci) | `src/`, con test e una riga in `docs/CREARE-UN-GIOCO.md` | in una **PR propria, prima** dell'unità che la usa; generica, senza nomi di LAIKA. Se ne serve una non prevista qui, l'agente la aggiunge al piano come incarico `K…` e la costruisce senza chiedere (D-041) |
| Bottega | un disegno, una posa, una variante di figura, un'azione | `bottega/`, disegni con `bottega/CONTRATTO-KIT.md` | in una PR propria (kit) prima dell'unità; stato «bozza» finché il docente non lo approva nella galleria |
| Scene | le schede scena dell'unità, composte con quello che c'è | `games/laika/source/scene/` | **dentro la PR dell'unità** |

Regole:
- La scheda di gioco di ogni unità ha una sezione **«Elementi del kit»** che copia la riga di questo piano e dice che cosa c'è, che cosa si compone e che cosa manca. Se manca qualcosa di motore o di bottega, la PR dell'unità aspetta la PR del kit.
- Un episodio non riusa la scena di un altro episodio se la scena dice un'altra cosa (la sala del soviet non è il treno di Pskov): meglio nessuna scena finché manca la sua.
- Un disegno nuovo entra nel catalogo solo se una scena lo usa nella stessa PR (lo controlla `tests/unita-ludiche.test.js`). Prima di chiederne uno si cerca nel catalogo: dei 100 disegni utili fino al 1917, 53 non sono ancora usati da nessuna scena; l'incarico S1 li mette nelle unità già fatte.
- Un disegno «bozza» si può usare in una scena; l'unità però diventa «approvata» solo quando anche i suoi disegni sono stati approvati.

## 2. Che cosa c'è già

- **Bottega:** 136 disegni a catalogo, di cui 32 in bozza; figura articolata con 25 pose, 17 varianti (4 in bozza), 3 corpi; 10 formazioni (fra cui `fila` e `coda`); 21 azioni (fra cui `queue`, `disperse`, `transfer`, `replace`, `reveal`, `camera`).
- **Motore:** episodi a racconto, scelta, distribuzione, fonti, verifica; partita a turni con gestione (persone e posti, lavori lunghi, semina, fiera), sole decisioni, monete, giornate a punti azione.
- **Disegni mai usati:** con S1 (4 novembre 2026) tutti i disegni elencati qui sotto, sia in bozza sia pronti, sono in almeno una scena di LAIKA; restano da usare solo quelli dei kit non ancora importati (K4) e quelli degli atti successivi.

## 3. Unità per unità

**I.1 `servitu` · gestione della settimana**
- Scene: ci sono tutte (anime, feste, inventari, anno, due inverni, utopie, manifesto).
- Da comporre: nella scena delle utopie le case rosa in fila della colonia di Arakčeev (oggi solo isbe e foschia).
- Disegni da chiedere: colonia militare con case in fila (già nell'elenco del piano degli atti).
- Motore: niente di nuovo. Correzioni: previsione ed esito del grano che si contraddicono; etichette dei posti che escono dal bordo sul telefono; tabellone troppo lungo sul telefono (proposta: le migliorie chiuse in un pannello).

**I.2 `mir` · decisioni sui gruppi, da ripensare come gioco**
- Scene: piazzale, isba di chi presiede, pozzo.
- Da comporre: le strisce di terra che cambiano con le decisioni (`mir-strisce-prima` → `mir-strisce-dopo` con l'azione `replace`); il registro della cassa (`mir-registro`); il covone per il raccolto.
- Figure: madre con sei figli (donna, scialle), anziano (bastone), vedova, giovane che parte: pose e varianti ci sono.
- Motore: dipende dalla scheda di gioco nuova. Proposta: le strisce come posti della gestione (si assegnano alle famiglie) e la cassa come risorsa, così fra una richiesta e l'altra c'è qualcosa da gestire. Probabilmente basta il motore di gestione esistente.

**I.3 `citta` · gestione del salario, da rendere più difficile**
- Scene: stanza, città, cella, corte, volantini.
- Da comporre: il dormitorio di fabbrica (`citta-dormitorio`) per le settimane senza stanza; il carbone (`citta-carbone`); la corte del 1896 con la sala da ballo (`ambiente-salone-lampadari`) invece del palazzo visto da fuori.
- Disegni da chiedere: tazza smaltata (Chodynka).
- Motore: niente di nuovo; eventi e bilanciamento sono contenuti. Confronto di fine atto: scena composta con villaggio e fabbrica nella stessa inquadratura.

**II.1 `petizione` · gioco da scegliere nella scheda di gioco**
- Scene: piazza con neve (la domenica).
- Da comporre: il Palazzo d'Inverno sullo sfondo della piazza (`luogo-palazzo`); il corteo con il ritratto dello zar (`oggetto-ritratto-zar`) e le icone; le officine Putilov (`luogo-fabbrica`) per la scrittura della petizione.
- Disegni da chiedere: icona portata in processione; posa «scrive».
- Motore: dipende dal gioco che si sceglie.

**II.2 `soviet` · punti azione, notizie che devono contare**
- Scene: sala a colonne.
- Da comporre: tavolo del comitato, telegrafo e bandiera senza scritte (`soviet-tavolo`, `soviet-telegrafo`, `soviet-bandiera`, già disegnati e mai usati).
- Correzione di bottega: etichette dei posti sovrapposte («Il ferroviere» sotto «Il prefetto»): posizioni `at` delle azioni.
- Motore: «letture che contano». Dopo aver indagato si sceglie a quale delle due letture dare peso e la scelta cambia gli effetti delle azioni dei giorni dopo. Forse bastano le condizioni `when` sui flag (da verificare nella scheda); altrimenti una PR di motore piccola.

**II.3 `concessioni` · gioco da scegliere nella scheda di gioco**
- Scene: oggi riusa la sala del soviet.
- Da comporre: la sala di San Giorgio (`ambiente-sala`) con due blocchi di figure, uniformi da una parte e giacche dall'altra (formazione `righe`); il palco del teatro per la ballerina insultata (`ambiente-teatro-palco`); l'aquila imperiale per le Leggi fondamentali.
- Figure: uniforme da ufficiale o dignitario (non c'è: oggi esiste solo il soldato di guarnigione).

**II.4 `stolypin` · gioco da scegliere nella scheda di gioco**
- Scene: oggi riusa il mir.
- Da comporre: le strisce che si uniscono in un podere.
- Disegni da chiedere: podere consolidato (*chutor*) con casa isolata. La forca non si disegna: la violenza si vede nelle conseguenze (D-006).

**III.1 `pane-guerra` · quanto serve e quanto c'è, da rifare**
- Scene: piazza con la folla in ginocchio, panetteria.
- Da comporre: la catena del grano che si vede: granaio (`campagna-granaio`), carro, treno sui binari (`mezzo-treno`, `infra-binari`), panetteria; il fronte con la trincea (`ambiente-trincea`); il manifesto del prestito di guerra; il palazzo isolato nella foschia per la fine dello zar in famiglia (oggi senza scena).
- Disegni da chiedere: vetrina del gioielliere (Fabergé e il pane nella stessa strada).
- Motore: **«merci che camminano»** (GIOCHI §3.6–§3.7): figure che portano il grano lungo la catena e si vede dove si inceppa. Fatto con K1 (`src/core/queue.js`, sezione «La coda con la pazienza» di CREARE-UN-GIOCO).

**III.2 `otto-giorni` · code che diventano corteo, da rifare**
- Scene: strada con neve, caserma.
- Da comporre: la coda vera (formazione `coda`, azioni `queue`, `walk`, `disperse`) con la tessera (`coda-tessera`); le tessili che escono dalla fabbrica (`luogo-fabbrica`); il soldato che abbassa il fucile (azione `lower`); **il treno fermo nella neve** (`mezzo-treno`, `infra-binari`, `atmo-neve`); il confronto con il disco rosso che passa dal Palazzo d'Inverno (`luogo-palazzo`) al Palazzo di Tauride (`luogo-palazzo-tauride`, azione `transfer`).
- Pose (fatte con K1): i segnali di chi aspetta (`guarda_orologio`, `batte_piedi`, `si_stringe`), come nella scheda di lettura di CorsixTH (GIOCHI §3.5).
- Motore: **coda con pazienza**: ogni persona in fila ha una pazienza che scende, manda segnali a soglie fisse e a zero lascia la fila e va altrove (fabbrica, corteo). PR di motore propria.

**Tutti gli atti**
- Motore: **il ponte fra gli atti**. Oggi a fine atto lo stato della simulazione riparte da capo: per la famiglia e per «Che cosa porti con te» serve che alcuni flag passino all'atto successivo e che l'atto possa leggere due righe del diario precedente.
- Scene: le schede scena hanno i nomi stabili delle unità (`soviet-sala`, `otto-giorni-coda`…), rinominate con S1.

## 4. Ordine delle PR del kit

Le PR del kit vengono prima delle unità che le usano. Una PR, un elemento.

| PR | Che cosa | Livello | Serve a |
|---|---|---|---|
| K1 | Coda con pazienza, segnali e uscita dalla fila; pose dei segnali | motore + bottega | III.2, poi le code degli atti successivi |
| K2 | Merci che camminano lungo una catena | motore | III.1, poi i piani degli anni Trenta |
| K3 | Ponte fra gli atti (flag e diario che passano) | motore | la famiglia, tutti gli atti |
| K4 | Disegni da chiedere: colonia militare, tazza smaltata, icona, podere, vetrina del gioielliere, uniforme da dignitario; posa «scrive» | bottega | I.1, I.3, II.1, II.3, II.4, III.1 |
| K5 | Letture che contano (se le condizioni esistenti non bastano) | motore | II.2 |

L'ordine che fa fede, intrecciato con le unità, è quello di [PIANO-1917](PIANO-1917.md). I disegni in bozza (vecchi e nuovi) si usano e il docente li approva tutti insieme nella galleria ai controlli di fine atto (D-039).
