# LAIKA — Stato del lavoro

A che punto è ogni cosa, con le evidenze. Si aggiorna in ogni PR. La struttura che fa fede è nel [canone](CANONE.md); qui si dice solo che cosa c'è e che cosa manca.

Aggiornato al 5 novembre 2026.

**Per un nuovo agente: leggere prima [PASSAGGIO](PASSAGGIO.md)** (dove siamo, come si lavora, come si verifica, che cosa resta aperto). Le PR fino alla #62 sono unite; lo stato delle altre lo dice il passaggio.

## Adesso

**Riordino finito** ([RIORDINO](RIORDINO.md)). Il gioco segue il canone: tre atti fino al 1917, unità con i nomi stabili, identificatori degli episodi derivati dai nomi (`a1-citta-salario`, `a2-soviet-giornate`, `a3-otto-giorni-coda`). Il build legge titoli, periodi e domande dal canone e si ferma se gli atti o le unità non coincidono; `tests/canone.test.js` e `tests/units.test.js` lo controllano anche per la home.

| Fase | Che cosa | Stato |
|---|---|---|
| R0 | Piano del riordino | PR #39 |
| R1 | Riordino dei documenti; `npm run canone`; test di coerenza dei documenti | PR #40 |
| R2 e R3 | Il build legge il canone; il gioco in tre atti; home con nove fascicoli; usabilità | PR R3 |

**K1 fatto** (motore della coda con la pazienza; revisione indipendente al primo giro: passa): modulo `src/core/queue.js` e test, pannello «La coda» nel gioco, tre pose di attesa (`guarda_orologio`, `batte_piedi`, `si_stringe`), scena di prova `esempio-coda-pazienza` nella galleria, sezione in `docs/CREARE-UN-GIOCO.md`. Evidenze in `docs/evidence/K1/`.

**H-testi fatto** (5 novembre 2026): i testi della home del docente (`docs/laika/TESTI-HOME.md`) sono in `index.html`: il manifesto, gli Atti VI, VII e IX, l'Atto II aggiornato alla verità; tolti «Edizione didattica», «Sezione storica» e «I progressi restano in questo browser». Evidenze in `docs/evidence/H-testi/`.

**U-concessioni fatto** (II.3 Che cosa concede lo zar, 5 novembre 2026): da confronto di tre schede a gioco a punti azione in tre stagioni (carta contro poteri veri, piazza, reazione dello zar; cinque azioni, la Duma con probabilità scritta); la scelta del soviet (`tratta_prefetto`) apre «Il ministro» o «Lo sciopero»; le tre schede restano come giudizio finale («Diritto o tregua?»); «Cosa ti devi ricordare» e verifica V9; un aneddoto registrato (Baletta, C36); il granduca Nikolaj non si usa perché non riscontrato. Test di bilanciamento sul motore vero. Evidenze in `docs/evidence/U-concessioni/`.

**U-petizione fatto** (II.1 La petizione, 5 novembre 2026): da modulo con cinque righe a gestione di tre sere alle officine Putilov (sei ore da dare fra firme, righe di richieste, padre Gapon e polizia; chi bussa con scelte e una probabilità scritta; due crisi); la domenica di sangue con due aneddoti registrati (cannone del 6 gennaio e diario di Nicola, Montefiore) e la voce di Serge (atlante); «Cosa ti devi ricordare» e verifica V8; i punti sulla scena mostrano il nome del posto (`hotspotNames`). Gioco scelto dall'agente: nel canone resta «da confermare» (prova C-II). Test di bilanciamento sul motore vero. Evidenze in `docs/evidence/U-petizione/`.

**U-soviet fatto** (II.2 Il soviet, 5 novembre 2026): dopo aver indagato si sceglie a quale lettura dare peso (linea del soviet da 0 a 100) e la scelta apre o chiude azioni nei giorni dopo (trattare in nome del soviet con i moderati, fermare i treni con i radicali); nessuna meccanica nuova (bastavano `when` sui flag e sulle metriche, K5 non serve); scena con tavolo, telegrafo e bandiera; etichette su tre file senza sovrapposizioni; «Cosa ti devi ricordare» e fonti registrate (nessun aneddoto trovato sul 1905). Test di bilanciamento sul motore vero. Evidenze in `docs/evidence/U-soviet/`.

**C-I pronto** (5 novembre 2026): la pagina per la prova dell'Atto I dal telefono è in `docs/laika/revisioni/atto-I-per-il-docente.md`. L'incarico aspetta il docente e non blocca il piano.

**K7 fatto** (motore, 5 novembre 2026): un giudizio dell'anno può valere solo se una risorsa è arrivata al minimo durante l'anno (`verdicts[].floored`), anche quando la crisi è già scattata. Nasce dalla revisione di U-servitu. Evidenze in `docs/evidence/K7/`.

**U-servitu fatto** (I.1 rifiniture, 5 novembre 2026): un solo giudizio dell'anno coerente con la previsione (giudizio «Fame» con `floored`, K7: vale anche quando le crisi sono già scattate); sul telefono i lavori lunghi in un pannello e le etichette dei posti dentro la scena (tabellone sul telefono da circa 2390 px a circa 2000 px con il pannello chiuso; con il pannello aperto resta circa 2430 px); disegni sospesi nel vuoto corretti nelle scene `servitu-anime`, `servitu-feste` e `servitu-anno`. La scena delle utopie con la colonia (K4) era già in `main`. Evidenze in `docs/evidence/U-servitu/`.

**U-citta fatto** (I.3 In città, 5 novembre 2026): il salario ribilanciato con le pressioni della scheda v2 (affitto che sale a tre monete, freddo lungo, settimana di sette monete, multa), la regola G3 fissata in `tests/laika-citta.test.js` (nessuna mossa fissa regge, esiste una strategia senza crisi, nessuna domina); nuovo confronto di fine atto I.3-e7 «Il villaggio e la fabbrica» con la scena `citta-confronto`. Il diario personalizzato aspetta K3. Evidenze in `docs/evidence/U-citta/`.

**U-mir fatto** (I.2 Il mir, 4 novembre 2026): da questionario con barre a gestione, con sei strisce da assegnare a quattro gruppi, la cassa del riscatto come obbligo comune, l'esattore e il raccolto incerti, le richieste dopo l'esito; «Cosa ti devi ricordare» e verifica V7 (obiettivo: distinguere il mir da un soviet e da una democrazia moderna); nessun aneddoto trovato per il mir. Test di bilanciamento sul motore vero. Evidenze in `docs/evidence/U-mir/`.

**U-pane-guerra fatto** (III.1 Pane e guerra, 4 novembre 2026): la catena del grano con i treni come collo di bottiglia, carta e realtà come due numeri, l'evento del fronte a ogni stagione, la fila davanti ai forni; «Cosa ti devi ricordare»; aneddoti C39, C42 e C43 attribuiti in MATRICE. La scheda di gioco ha avuto due «non passa» e il docente ha autorizzato di costruire e misurare sul motore vero. Canone: unità «bozza». Evidenze in `docs/evidence/U-pane-guerra/`.

**U-otto-giorni fatto** (III.2 Otto giorni, scritta il 4 novembre 2026): la coda con la pazienza (tre gruppi, uscite che dipendono dalla partita, ultima giornata «troppo tardi») e il soldato che non spara con le voci e la fame come benzina; «Cosa ti devi ricordare»; fonti R88, R15 e R08 in MATRICE; il passo di Frederiks è stato tolto perché non riscontrato. La scheda di gioco ha avuto cinque revisioni «non passa» (sei versioni) e il docente ha autorizzato di fissare la regola di bilanciamento in un test sul motore vero. Canone: unità «bozza».

**K6 fatto** (inserito il 4 novembre 2026 dalla revisione indipendente della scheda di «Otto giorni», D-041): le crisi dei turni a punti si controllano anche dopo la discesa della coda e un gruppo può avere più uscite scelte da una condizione. «Otto giorni» (U-otto-giorni) riparte dopo K6.

**K2 fatto** (motore delle merci che camminano): modulo `src/core/chain.js` con test, pannello «La catena» nel gioco, scena di prova `esempio-catena-merci` nella galleria, sezione in `docs/CREARE-UN-GIOCO.md`. Evidenze in `docs/evidence/K2/`.

**K4 fatto** (disegni che mancavano agli Atti I–III): nuovo kit `prototypes/kit-atti-i-iii/` con colonia militare, tazza smaltata, icona da processione, podere con casa isolata e vetrina del gioielliere; variante della figura `dignitario` e posa `scrive`; tutti in bozza, usati in scene (`servitu-utopie`, `citta-corte`, `petizione-domenica`, `stolypin-strisce`, `pane-guerra-pane`, `concessioni-sala`, `petizione-putilov`). Catalogo: 141 disegni. Evidenze in `docs/evidence/K4/`.

Proposte P-01–P-05 chiuse dal docente il 4 novembre (D-038, D-039): si lavora in autonomia con [PIANO-1917](PIANO-1917.md).

**S1 fatto** (scene con i disegni che ci sono; revisione indipendente: due «non passa» corretti, terzo giro «passa»): le schede scena hanno i nomi stabili delle unità; ogni unità ha una scena propria e nessun episodio usa quella di un'altra; 13 scene nuove (`citta-fabbrica`, `citta-dormitorio`, `petizione-putilov`, `soviet-ferrovia`, `concessioni-sala`, `stolypin-strisce`, `stolypin-ricorda`, `pane-guerra-treni`, `pane-guerra-trincea`, `pane-guerra-famiglia`, `otto-giorni-coda`, `otto-giorni-treno`, `otto-giorni-confronto`) e le scene vecchie arricchite; tutti i 35 disegni assegnati sono usati; ogni episodio ha la sua `visualExplanation`. Evidenze: schermate prima e dopo in `docs/evidence/S1/`, trascrizione dell'allievo finto in `docs/evidence/S1/allievo/`. Le regole sulle scene di `tests/unita-ludiche.test.js` ora valgono per tutte le unità. Il manifesto `game.json` è salito a 262 KB compressi: la soglia del test è stata portata da 260 a 300 KB (decisione dell'agente, motivata nel test e nella PR).

## Le unità costruite

Nessuna è ancora stata provata e approvata dal docente dal telefono.

| Unità | Che cosa c'è | Che cosa manca | Evidenze |
|---|---|---|---|
| I.1 `servitu` | La settimana del servo: otto anni dal 1740 al 1861, cinque generazioni, migliorie, fiera, chi bussa, verifica V1 | Risolti il 5 novembre 2026 (U-servitu): previsione ed esito del grano coerenti, nessun numero negativo, tabellone più corto sul telefono, disegni non più sospesi nel vuoto | `tests/browser-i1.cjs`; [revisione del 4 novembre](revisioni/2026-11-04-allievo-atto-I.md) |
| I.2 `mir` | Otto assemblee, quattro gruppi | È un questionario con barre: niente da gestire fra una richiesta e l'altra | revisione del 4 novembre §5 |
| I.3 `citta` | In città, il salario (otto settimane), il razzo, la corte, i tre volantini, verifica V2, confronto di fine atto | Risolti il 5 novembre 2026 (U-citta): il salario ora mette alle strette e c'è il confronto di fine atto | revisione §5 |
| Atto II (II.1–II.4) | Petizione e domenica di sangue (II.1), giornate del soviet a punti azione e V3 (II.2), che cosa concede lo zar (II.3), Stolypin, V4 e «Cosa ti devi ricordare» (II.4) | il gioco di Stolypin (i giochi di petizione e concessioni ci sono dal 5 novembre 2026, con il diario di Nicola e Baletta); il granduca Nikolaj non riscontrato; le notizie del soviet non servivano a niente (risolto il 5 novembre 2026: la scelta della lettura apre azioni nei giorni dopo); confronto di fine atto | revisione §3 e §5 |
| III.1 `pane-guerra` | In ginocchio, il grano e i treni come partita di sole decisioni, gioielli e pane, la fine dello zar, verifica V5 | **Da rifare**: il gioco approvato (quanto serve e quanto c'è, prime code) non c'è; aneddoti (Fabergé, Kšesinskaja, Rodzjanko) | revisione §3 |
| III.2 `otto-giorni` | Giornata della donna, la coda a punti azione, il soldato a punti azione, il treno, verifica V6, confronto | **Da rifare**: la coda vera (figure che lasciano la fila); aneddoti del treno (baffi, Frederiks); scene del treno nella neve e del Palazzo di Tauride da comporre con disegni che ci sono già ([PIANO-KIT](PIANO-KIT.md)); oggi treno, fine dello zar in famiglia e confronto sono senza scena invece di riusare scene sbagliate | revisione §3 e §4 |

## Controllo automatico delle unità (4 novembre 2026)

Uscita di `LAIKA_RAPPORTO=1 node tests/unita-ludiche.test.js` (regole di METODO §7, G3a). Diventa vincolante per ogni unità quando il suo incarico è «fatto». Dal 4 novembre controlla anche lo standard didattico (D-040): la verifica e «Cosa ti devi ricordare» ora ci sono in tutte le unità dell'Atto II.

| Unità | Che cosa manca |
|---|---|
| I.1 `servitu` | niente |
| I.2 `mir` | solo richieste a scelta multipla, niente da distribuire o spendere; nessun contenuto documentato |
| I.3 `citta` | niente (il test G3 del salario prova tutte le mosse fisse) |
| II.4 `stolypin` | nessun gioco; nessuna fonte registrata; scene prese dal mir e dal soviet |
| III.1 `pane-guerra` | solo richieste a scelta multipla; nessuna fonte registrata |
| III.2 `otto-giorni` | nessuna fonte registrata; la coda usa la scena della panetteria di III.1 |

## Home e sito

- Home: nove fascicoli dal canone; i tre atti costruiti hanno titolo e «Apri il fascicolo» che portano alla pagina dell'atto (`play.html?game=laika&atto=atto-N`). Evidenze: `docs/evidence/riordino/`.
- Pagina dell'atto, dell'unità e chiusura (#25); ogni unità si apre dalla pagina del suo atto (#37), anche in un atto diverso da quello della partita salvata.
- Finita l'ultima unità di un atto, la chiusura mostra «Fine dell'atto» e porta alla pagina dell'atto successivo.
- Corretti nella PR #38: chiusura dell'atto, muro di indicatori, pulsanti delle giornate, errori di lingua. Corretti nella PR R3: didascalie di altre scene sotto gli episodi che riusano una scena, didascalia generica sotto le verifiche, giornate a punti azione chiuse senza vedere i punti rimasti, numeri negativi nella previsione del grano.
- Restano: pagine lunghe sul telefono (tabellone di I.1), la home a 626 KB contro i 500 del budget, «Riprendi» nella home che non compare se si è appena entrati in un'unità senza agire.

## Verifiche automatiche

La CI gioca i tre atti in Chromium e WebKit: circa 11 minuti per browser. Il limite del job è 20 minuti (era 12: il 4 novembre 2026 WebKit è stato interrotto dal limite subito dopo l'unione delle PR del riordino).

## Disegni e kit

Catalogo in `bottega/catalogo.json`: 141 disegni, 37 in bozza da approvare dal docente. Che cosa serve dal kit unità per unità, che cosa c'è già e in che ordine si fa: [PIANO-KIT](PIANO-KIT.md). Con S1 il treno nella neve (`otto-giorni-treno`) e il Palazzo di Tauride (`otto-giorni-confronto`) hanno la loro scena.

## Da fare

Gli incarichi fino al 1917, in ordine e con lo stato di ciascuno, sono in [PIANO-1917](PIANO-1917.md) (`npm run prossimo` per il prossimo). Gli elementi del kit di ogni unità sono in [PIANO-KIT](PIANO-KIT.md).
