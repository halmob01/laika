# LAIKA — Piano fino al 1917

**File generato da `docs/laika/piano-1917.json` con `npm run piano`: non si modifica a mano.** Piano degli incarichi fino al 1917 (D-038, D-039, D-040). Gli agenti prendono sempre il primo incarico «da fare» le cui dipendenze sono «fatto» (npm run prossimo), lo portano a termine con i controlli di METODO §7, lo segnano «fatto» con PR ed evidenze e passano subito al successivo. L'ordine non si cambia; si possono solo inserire incarichi nuovi: un motore che serve a un'unità (K…, subito prima dell'unità) e le osservazioni del docente. Dopo ogni modifica: npm run piano.

Come si lavora in autonomia, controlli e condizioni di arresto: [METODO](METODO.md) §7. Il prossimo incarico e il messaggio da dare all'agente: `npm run prossimo`.

Incarichi fatti: 14 su 22. Prossimo: U-stolypin.

| # | Incarico | Tipo | Modello | Dopo | Stato |
|---:|---|---|---|---|---|
| 1 | **S1** Le scene delle unità già fatte con i disegni che ci sono | scene | Sonnet | — | fatto (PR #47) |
| 2 | **K1** Motore: la coda con la pazienza | motore | Opus | S1 | fatto (PR #48) |
| 3 | **K6** Motore: le crisi dopo la coda e le uscite che dipendono dalla partita | motore | Opus | K1 | fatto (PR #49) |
| 4 | **U-otto-giorni** III.2 Otto giorni: la coda vera, il soldato, il treno, Tauride | unità | Opus | S1, K1, K6 | fatto (PR #50) |
| 5 | **K4** Bottega: i disegni che mancano agli Atti I–III | bottega | Sonnet | S1 | fatto (PR #51) |
| 6 | **K2** Motore: le merci che camminano | motore | Opus | S1 | fatto (PR #52) |
| 7 | **U-pane-guerra** III.1 Pane e guerra: grano, treni e città | unità | Opus | S1, K2, K4 | fatto (PR #53) |
| 8 | **C-III** Il docente prova l'Atto III dal telefono | controllo | — | U-pane-guerra, U-otto-giorni | aspetta il docente |
| 9 | **U-mir** I.2 Il mir: da questionario a gioco | unità | Opus | S1, K4 | fatto (PR #55) |
| 10 | **U-citta** I.3 In città: un salario che mette alle strette e il confronto di fine atto | unità | Sonnet | S1, K4 | fatto (PR #56) |
| 11 | **K7** Motore: il giudizio dell'anno sa quando una risorsa è arrivata al minimo | motore | Opus | S1 | fatto (PR #58) |
| 12 | **U-servitu** I.1 La terra e lo zar: rifiniture | unità | Sonnet | S1, K4, K7 | fatto (PR #57) |
| 13 | **C-I** Il docente prova l'Atto I dal telefono | controllo | — | U-mir, U-citta, U-servitu | aspetta il docente |
| 14 | **U-soviet** II.2 Il soviet: notizie che contano | unità | Opus | S1 | fatto (PR #60) |
| 15 | **U-petizione** II.1 La petizione: il gioco e la domenica di sangue | unità | Opus | S1, K4 | fatto (PR #61) |
| 16 | **U-concessioni** II.3 Che cosa concede lo zar: il gioco e gli aneddoti | unità | Opus | S1, K4, U-soviet | fatto (PR #62) |
| 17 | **U-stolypin** II.4 Stolypin: il gioco e il confronto di fine atto | unità | Sonnet | S1, K4 | da fare |
| 18 | **C-II** Il docente prova l'Atto II dal telefono | controllo | — | U-soviet, U-petizione, U-concessioni, U-stolypin | da fare |
| 19 | **K3** Motore e contenuti: il ponte fra gli atti e la famiglia | motore | Opus | U-citta, U-stolypin, U-pane-guerra | da fare |
| 20 | **U-sito** Il sito sul telefono: pagine, pesi, ripresa | trasversale | Sonnet | K3 | da fare |
| 21 | **V-1917** Verifica finale degli Atti I–III | verifica | Opus | U-sito, C-I, C-II, C-III | da fare |
| 22 | **C-1917** Il docente prova il percorso fino al 1917 | controllo | — | V-1917 | da fare |

## S1 — Le scene delle unità già fatte con i disegni che ci sono

- Usare nelle scene delle unità esistenti i disegni già a catalogo e mai usati (53 su 100 fino al 1917), rispettando l'epoca scritta nel catalogo. Assegnazione: I.1 `campagna-mucca`, `campagna-sacchi`, `campagna-banco-fiera`, `campagna-cavallo` (fiera, raccolto, mucca venduta); I.2 `mir-strisce-prima`, `mir-strisce-dopo`, `mir-registro`, `mir-covone`; I.3 `ambiente-fabbrica`, `infra-ciminiera`, `citta-dormitorio`, `citta-carbone`, `oggetto-volantini`, `ambiente-salone-lampadari` (la corte); II.1 `luogo-fabbrica` (Putilov), `oggetto-ritratto-zar` e il Palazzo d'Inverno sulla piazza; II.2 `soviet-tavolo`, `soviet-telegrafo`, `soviet-bandiera`, `mezzo-treno` e `infra-binari` (i ferrovieri); II.3 una scena propria con `ambiente-sala` (sala di San Giorgio), `oggetto-aquila-imperiale`, `ambiente-teatro-palco`, `oggetto-giornale`; II.4 una scena propria con le strisce che si uniscono e le isbe; III.1 `ambiente-trincea`, `ambiente-parapetto`, `ambiente-stazione`, `mezzo-treno`, `infra-binari`, `campagna-sacchi`, `oggetto-manifesto-prestito`, `oggetto-cartello-pane`; III.2 una scena propria per la coda con `coda-tessera` e `oggetto-cartello-pane`, le tessili all'uscita della fabbrica, il soldato con `oggetto-fucile` abbassato, il treno fermo nella neve (`mezzo-treno`, `infra-binari`, `atmo-neve`) e il confronto con `luogo-palazzo` e `luogo-palazzo-tauride`.
- Ogni unità ha almeno una scena propria e nessun episodio usa la scena di un'altra unità; treno, fine dello zar in famiglia e confronto dell'Atto III tornano ad avere una scena.
- Le schede scena prendono i nomi stabili (`servitu-*`, `mir-*`, `citta-*`, `petizione-*`, `soviet-*`, `concessioni-*`, `stolypin-*`, `pane-guerra-*`, `otto-giorni-*`) al posto di `a1-u*-*`; si aggiornano i riferimenti negli atti e nei test.
- Ogni episodio ha una `visualExplanation` che descrive la sua scena.

È fatto quando: Le regole sulle scene di `tests/unita-ludiche.test.js` passano per tutte le unità (diventano vincolanti quando S1 è «fatto»); Schermate prima e dopo di ogni unità in `docs/evidence/S1/`; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/S1/, docs/evidence/S1/allievo/trascrizione.md.

## K1 — Motore: la coda con la pazienza

- Contratto dati generico in `src/core/turns.js` (o un modulo accanto): gruppi in fila con una pazienza che scende a ogni turno, segnali a soglie fisse, uscita dalla fila verso una destinazione che muove un indicatore; il gelo e le voci accelerano la discesa. Parte dalla scheda di lettura di CorsixTH in GIOCHI §3.5.
- Bottega: tre pose di attesa per la figura (guarda l'orologio, batte i piedi, si stringe nello scialle) con la procedura del README della bottega; azione o formazione per chi lascia la fila se `queue`/`disperse` non bastano.
- Una scena di prova nella galleria e una sezione in `docs/CREARE-UN-GIOCO.md`.

È fatto quando: Test del motore: pazienza, segnali alle soglie, uscita dalla fila, salvataggio e ripresa a metà; Scena di prova nella galleria della bottega; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/K1/, tests/queue.test.js.

## K6 — Motore: le crisi dopo la coda e le uscite che dipendono dalla partita

- Inserito il 4 novembre 2026 dalla revisione indipendente della scheda di «Otto giorni» (D-041): due meccaniche mancavano alla coda di K1.
- Le crisi dei turni a punti si controllano anche dopo la discesa della coda a fine giornata (oggi solo dopo un'azione), anche dopo l'ultima giornata.
- Un gruppo in fila può avere più destinazioni scelte da una condizione sugli indicatori al momento dell'uscita (`exit` come elenco di regole con `when`, l'ultima senza condizione); il pannello mostra dove andrebbe adesso.
- Test del motore, sezione aggiornata in `docs/CREARE-UN-GIOCO.md`.

È fatto quando: Test del motore: la crisi scatta dopo l'ultima discesa; l'uscita cambia con gli indicatori; la lettura per l'interfaccia mostra la destinazione di adesso; salvataggio e ripresa; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: tests/queue.test.js, docs/CREARE-UN-GIOCO.md.

## U-otto-giorni — III.2 Otto giorni: la coda vera, il soldato, il treno, Tauride

Unità del canone: `otto-giorni`.

- Scheda di gioco `docs/laika/giochi/otto-giorni.md` con la sezione «Elementi del kit» (PIANO-KIT, III.2), passata alla revisione indipendente prima del codice.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- La coda per il pane sulla coda del motore K1: chi lascia la fila va in fabbrica o in corteo; il pane in città arriva da III.1.
- Il soldato che non spara resta a punti azione; si ricontrollano gli effetti delle azioni.
- Scene da comporre: il treno fermo nella neve (`mezzo-treno`, `infra-binari`, `atmo-neve`); il confronto con il disco rosso dal Palazzo d'Inverno al Palazzo di Tauride (`luogo-palazzo`, `luogo-palazzo-tauride`, `transfer`). Le schede scena dell'unità prendono il nome stabile (`otto-giorni-*`).
- Aneddoti R08 e R15 (lo zar che si tocca i baffi e torna nel vagone; il diario del treno) e Frederiks che annuncia in francese: dall'atlante e dai libri se il docente li ha caricati, in parafrasi, registrati in MATRICE.
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento della coda: almeno tre strategie arrivano in fondo con esiti diversi; nessuna vince su tutti gli indicatori; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-otto-giorni/, tests/laika-otto-giorni.test.js, docs/laika/giochi/otto-giorni.md.

## K4 — Bottega: i disegni che mancano agli Atti I–III

- Con `bottega/CONTRATTO-KIT.md`: colonia militare con case in fila; tazza smaltata; icona da processione; podere consolidato con casa isolata; vetrina del gioielliere; uniforme da dignitario (variante della figura); posa «scrive».
- Epoca e fonte registrate nel catalogo, stato «bozza»; confronto al pixel nel test della bottega.

È fatto quando: Disegni a catalogo con epoca e fonte; galleria aggiornata; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/K4/, prototypes/kit-atti-i-iii/kit-atti-i-iii.html, bottega/catalogo.json.

## K2 — Motore: le merci che camminano

- Contratto dati generico per una catena di quattro o cinque anelli (per esempio campo, granaio, treno, città) con figure che portano le merci e un anello che si inceppa; obiettivo sulla carta e quantità reale come due numeri distinti (GIOCHI §3.6–§3.7).
- Una scena di prova e una sezione in `docs/CREARE-UN-GIOCO.md`.

È fatto quando: Test del motore: la catena si inceppa dove deve, carta e realtà si separano, salvataggio a metà; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/K2/, tests/chain.test.js, docs/CREARE-UN-GIOCO.md.

## U-pane-guerra — III.1 Pane e guerra: grano, treni e città

Unità del canone: `pane-guerra`.

- Scheda di gioco `docs/laika/giochi/pane-guerra.md` con «Elementi del kit», passata alla revisione indipendente prima del codice.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Il gioco «quanto serve e quanto c'è» sulla catena del motore K2, con le prime code; il pane che resta passa a III.2.
- Scene: la catena del grano, la trincea, il manifesto del prestito, la vetrina del gioielliere accanto alla coda, il palazzo isolato nella foschia per «La fine dello zar comincia in famiglia».
- Aneddoti C39 (Fabergé), C42 (Kšesinskaja e l'artiglieria), Miljukov («stupidità o tradimento?»), C43 (Rodzjanko), la battuta dello zar all'ambasciatore britannico: dall'atlante e dai libri, in parafrasi, registrati in MATRICE.
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento: almeno tre strategie con esiti diversi; nessuna vince su tutto; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-pane-guerra/, tests/laika-pane-guerra.test.js, docs/laika/giochi/pane-guerra.md.

## C-III — Il docente prova l'Atto III dal telefono

Unità del canone: `pane-guerra`, `otto-giorni`.

- L'agente prepara `docs/laika/revisioni/atto-III-per-il-docente.md`: che cosa provare (al massimo dieci righe) e che cosa è cambiato.
- Il controllo non blocca il piano: si va avanti con gli incarichi successivi. Le osservazioni del docente diventano incarichi nuovi, inseriti subito dopo quello in corso.

È fatto quando: Il docente ha giocato e ha scritto «va bene» oppure un elenco di cose da cambiare.

## U-mir — I.2 Il mir: da questionario a gioco

Unità del canone: `mir`.

- Scheda di gioco `docs/laika/giochi/mir.md` riscritta (la versione approvata il 3 novembre va in archivio): le strisce come posti da assegnare alle famiglie e la cassa come risorsa, così fra una richiesta e l'altra c'è qualcosa da gestire (PIANO-KIT, I.2). Revisione indipendente prima del codice.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Scene: le strisce che cambiano (`mir-strisce-prima`, `mir-strisce-dopo`), il registro, il covone.
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento del mir: almeno tre strategie; ogni gruppo può andare in crisi; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-mir/, tests/laika-mir.test.js, docs/laika/giochi/mir.md.

## U-citta — I.3 In città: un salario che mette alle strette e il confronto di fine atto

Unità del canone: `citta`.

- Ribilanciare il salario con eventi che costringono a scegliere fra pane e stanza (aumento dell'affitto, multa che pesa, freddo lungo): con la stessa mossa ogni settimana non si deve più reggere.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Scene: dormitorio e carbone; la corte del 1896 nella sala con i lampadari e la tazza smaltata di Chodynka.
- Scrivere I.3-e7, il confronto di fine atto, e la sua scena.
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento del salario: la mossa fissa non regge tutte le settimane; almeno tre strategie con esiti diversi; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-citta/, tests/laika-citta.test.js, docs/laika/giochi/salario.md.

## K7 — Motore: il giudizio dell'anno sa quando una risorsa è arrivata al minimo

- Inserito il 5 novembre 2026 dalla revisione indipendente di U-servitu (D-041): le crisi scattano una sola volta, quindi nelle partite lunghe la previsione dice «non basta» e il giudizio dell'anno dice «si mangia fino al raccolto».
- Un giudizio (`verdicts[]`) può avere `floored: id`: vale quando in quell'anno una risorsa o metrica è stata portata al suo minimo da un effetto negativo (mantenimento, semina, resa dei posti, controllo), anche se poi il raccolto la rialza o la crisi è già scattata.
- Test del motore con un gioco neutro e sezione in `docs/CREARE-UN-GIOCO.md`.

È fatto quando: Test del motore: il giudizio con `floored` vale con e senza crisi, si valida l'id, il test fallisce se la funzione manca; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/K7/, tests/turns.test.js, docs/CREARE-UN-GIOCO.md.

## U-servitu — I.1 La terra e lo zar: rifiniture

Unità del canone: `servitu`.

- Previsione ed esito del grano: un solo verdetto, coerente con la previsione.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Telefono: tabellone più corto (migliorie chiuse in un pannello), etichette dei posti dentro la scena.
- Scena delle utopie con la colonia militare (K4).
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-servitu/, tests/laika-servitu.test.js, docs/laika/giochi/servitu.md.

## C-I — Il docente prova l'Atto I dal telefono

Unità del canone: `servitu`, `mir`, `citta`.

- Come C-III, con `docs/laika/revisioni/atto-I-per-il-docente.md`. Non blocca il piano.

È fatto quando: Il docente ha giocato e ha scritto «va bene» oppure un elenco di cose da cambiare.

## U-soviet — II.2 Il soviet: notizie che contano

Unità del canone: `soviet`.

- Scheda `docs/laika/giochi/soviet.md` aggiornata: dopo aver indagato si sceglie a quale lettura dare peso e la scelta cambia gli effetti dei giorni dopo. Se le condizioni `when` del motore non bastano, prima una PR di motore piccola (K5) con test.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Scena: tavolo, telegrafo e bandiera nella sala; etichette dei posti senza sovrapposizioni.
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento: seguire una lettura o l'altra porta a esiti diversi; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-soviet/, tests/laika-soviet.test.js, docs/laika/giochi/soviet.md.

## U-petizione — II.1 La petizione: il gioco e la domenica di sangue

Unità del canone: `petizione`.

- Scheda di gioco `docs/laika/giochi/petizione.md`: un gioco del repertorio al posto del modulo con cinque righe (proposta da valutare nella scheda: decisioni sui gruppi fra operai, Gapon e polizia mentre si raccolgono le firme). Revisione indipendente prima del codice.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Scene: le officine Putilov, il Palazzo d'Inverno sullo sfondo della piazza, il corteo con le icone e il ritratto dello zar.
- Aneddoto: il diario di Nicola («Giornata terribile!» e subito dopo il pranzo con la madre), in parafrasi se il passo non si riscontra.
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-petizione/, tests/laika-petizione.test.js, docs/laika/giochi/petizione.md.

## U-concessioni — II.3 Che cosa concede lo zar: il gioco e gli aneddoti

Unità del canone: `concessioni`.

- Scheda di gioco `docs/laika/giochi/concessioni.md` (un gioco del repertorio, non tre schede da leggere); la scelta nel soviet (II.2) apre o chiude un'opzione qui.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Scene: la sala di San Giorgio con uniformi e giacche in due blocchi; il palco del teatro; l'aquila imperiale.
- Aneddoti: il granduca Nikolaj che minaccia di spararsi se lo zar non firma; la ballerina insultata a teatro per le corazzate perdute (C36).
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento; Controlli comuni G1–G5 passati (METODO §7).

Evidenze: docs/evidence/U-concessioni/, tests/laika-concessioni.test.js, docs/laika/giochi/concessioni.md.

## U-stolypin — II.4 Stolypin: il gioco e il confronto di fine atto

Unità del canone: `stolypin`.

- Scheda di gioco `docs/laika/giochi/stolypin.md`: restare nel mir, uscire e unire le strisce, vendere e partire, con conseguenze in più anni (gestione), non una scelta sola.
- Se il gioco richiede una meccanica che il motore non ha, l'agente non la improvvisa dentro l'unità e non la semplifica: inserisce nel piano un incarico di motore K… subito prima di questo, lo costruisce (generico, con test e documentazione in CREARE-UN-GIOCO), lo unisce e poi torna all'unità.
- Scena: le strisce che diventano un podere (K4).
- Scrivere II.4-e3, il confronto di fine atto, e la sua scena.
- Didattica (PERCORSO §7): gli obiettivi dell'unità nel canone guidano gioco e testi; «Cosa ti devi ricordare» dice gli obiettivi in parole semplici; almeno una verifica formativa legata a un obiettivo, scritta con la skill `verifiche-didattiche`; due aneddoti concreti con le fonti registrate.

È fatto quando: Il test `tests/unita-ludiche.test.js` passa per l'unità (gioco con qualcosa da distribuire, spostare o spendere, almeno tre turni e un rischio, da 2 a 5 indicatori, nessun modulo con caselle numeriche; domanda, obiettivi, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti, chiusura, fonti registrate; scene proprie); Test di bilanciamento; Controlli comuni G1–G5 passati (METODO §7).

## C-II — Il docente prova l'Atto II dal telefono

Unità del canone: `petizione`, `soviet`, `concessioni`, `stolypin`.

- Come C-III, con `docs/laika/revisioni/atto-II-per-il-docente.md`. Non blocca il piano.

È fatto quando: Il docente ha giocato e ha scritto «va bene» oppure un elenco di cose da cambiare.

## K3 — Motore e contenuti: il ponte fra gli atti e la famiglia

- Motore generico: alcuni flag e righe del diario passano da un atto al successivo (oggi lo stato riparte da capo).
- Contenuti: l'episodio breve «Che cosa porti con te» all'inizio degli Atti II e III; i tre effetti differiti previsti dalle schede (chi parte per la città, il soviet e le concessioni, il raccolto e la coda); il filo della famiglia nominato in ogni unità.

È fatto quando: Test: un flag dell'Atto I cambia un testo dell'Atto II e uno dell'Atto III; Controlli comuni G1–G5 passati (METODO §7).

## U-sito — Il sito sul telefono: pagine, pesi, ripresa

- Home entro 500 KB per il primo quadro (oggi 626).
- «Riprendi» nella home anche subito dopo l'ingresso diretto in un'unità.
- Pagine lunghe e etichette della scena su 360 e 390 px; prova WebKit in CI.

È fatto quando: Controlli comuni G1–G5 passati (METODO §7).

## V-1917 — Verifica finale degli Atti I–III

- Revisione indipendente completa (storia, didattica, divertimento) su tutte le unità con l'allievo finto in tre strategie; correzioni piccole nella stessa PR, le altre come incarichi nuovi.
- Tutte le date [verificare] degli Atti I–III riscontrate o tolte.

È fatto quando: Nessun problema aperto di gravità alta nella revisione; Controlli comuni G1–G5 passati (METODO §7).

## C-1917 — Il docente prova il percorso fino al 1917

- Come C-III. Dopo il «va bene» le unità diventano «approvata» nel canone.

È fatto quando: Il docente ha scritto «va bene».
