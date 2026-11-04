# LAIKA — Revisione con un allievo finto: Atto I (I.1–I.6)

4 novembre 2026 · base `main` a `db35091` (merge della PR #36) · branch `revisione-allievo-atto1`

Questo documento è il resoconto di una partita intera all'Atto I fatta da un «allievo finto»: uno script che apre la home, preme «Inizia» e gioca tutte e sei le unità fino all'ultima pagina, scegliendo a caso e scrivendo tutto quello che vede. Le osservazioni sono di chi ha letto le trascrizioni e guardato le schermate. Sono divise in cinque voci (didattica, UX e usabilità, divertimento, correttezza storica, rispetto del piano) e finiscono con l'elenco di ciò che questa PR corregge e di ciò che resta da decidere al docente.

## 1. Come è stata fatta la prova

- Script: `scripts/allievo-finto.cjs` (`npm run serve`, poi `npm run allievo`). Non è un test: non controlla niente, registra. Scrive `trascrizione.md` e una schermata per ogni passo in `.artifacts/allievo/`.
- Tre partite complete, tutte senza errori JavaScript:

| Partita | Finestra | Scelte | Passi | Clic | Durata della partita automatica |
|---|---|---|---|---|---|
| 1 (prima delle correzioni) | 390×844, touch | a caso, seme 7 | 280 | 399 | 243 s |
| 2 (dopo) | 390×844, touch | a caso, seme 11 | 276 | 403 | 240 s |
| 3 (dopo) | 1440×900 | sempre la prima | 278 | 404 | 278 s |

- Browser: Chromium 145 headless (non un telefono vero). Il tempo è quello della macchina: uno studente che legge davvero impiega molto di più. **Quattrocento tocchi per l'atto** è invece una misura reale: è il numero minimo di tocchi per arrivare in fondo.
- Non sono stati provati: un telefono reale, WebKit, lo zoom al 200%, il lettore di schermo.

## 2. Perché sembra che «l'unità 1 arrivi al 1905»

La domanda del docente era: ho visto che è stata completata l'unità 1 fino al 1905, ma il secondo modulo è esplicitamente il 1905; non capisco. Il contenuto del gioco segue il piano (I.4 è il 1905 e viene dopo I.1–I.3). Ma nel gioco e nei documenti erano rimasti i nomi di due numerazioni vecchie: insieme danno proprio quell'impressione.

1. **La pagina finale diceva «Fine dell'unità I.1 (1700–1861)… per ora il percorso si ferma qui»** anche dopo aver giocato fino a marzo 1917. Era il testo di chiusura dell'atto scritto quando esisteva solo I.1 (schermata `docs/evidence/revisione-allievo/prima-fine-atto.png`). Corretto in questa PR.
2. **L'Atto I porta ancora il nome del vecchio Atto 0**, «La terra e lo zar», che copriva 1861–1904. Il vecchio «Atto I» era invece «L'impero in crisi, 1904–1907», cioè il 1905. Il 21 ottobre i due atti sono stati fusi in un solo Atto I (1700–marzo 1917); il nome rimasto è quello del primo. Chi ricorda la vecchia struttura legge «Atto I = La terra e lo zar» e si aspetta che il 1905 sia l'atto (o modulo) successivo. **Da decidere** (§7, D1).
3. **Due rinumerazioni in dieci giorni.** Il 21 ottobre il 1905 era l'unità I.3 (cinque unità); il 29 ottobre I.2 è stata spezzata e il 1905 è diventato I.4 (sei unità). `PIANO-LAIKA.md` e `INCARICHI-LAIKA.md` dicevano ancora «A1.1–A1.4 → unità I.3 (il 1905)» e «cinque unità». Corretto in questa PR.
4. **Gli identificatori interni di I.3 «In città» sono `a1-u2-*`** (`a1-u2-citta`, `a1-u2-salario`…): è una scelta registrata il 29 ottobre per non rompere i salvataggi, ma chi apre i file vede «u2» per l'unità 3. Non si vede nel gioco. Lasciato com'è (§7, D5).

## 3. Didattica

**Che cosa funziona**
- La settimana del servo di I.1 è la parte migliore dell'atto. Il conflitto fra campo della famiglia e corvée si capisce con le mani: si sposta il padre e il grano cambia. Le cinque generazioni con i nomi (Foma, Ivan, Pëtr, Stepan…) fanno sentire il tempo lungo della servitù meglio di qualunque spiegazione. Le carte di corte dentro gli anni (il palazzo di ghiaccio nel 1740, l'elefante di gemme nel 1791) mettono semidei e anime nella stessa inquadratura, come chiede il piano.
- Le richieste del mir di I.2 sono un buon dilemma: ogni risposta sposta due gruppi in direzioni opposte. La domanda «uguale o secondo il bisogno» emerge davvero dalle scelte.
- Le verifiche hanno distrattori sensati e una spiegazione che dice anche perché le risposte sbagliate sono sbagliate (V1: «chi sceglie la terza scambia la speranza delle lettere d'oro con la legge»). È la parte più solida dal punto di vista della valutazione formativa.
- Il filo dei soldati che non sparano attraversa bene I.4 → I.6 (la piazza del 1905, la piazza del 1914, il reparto del 1917).

**Che cosa non funziona**
- **Gli aneddoti concreti si assottigliano unità dopo unità.** In I.1 ci sono quasi tutti; da I.4 in poi spariscono proprio quelli che il piano mette al centro:
  - I.4-e1: manca il diario di Nicola («Giornata terribile!» e subito dopo il pranzo con la madre). È l'aneddoto più forte dell'unità.
  - I.4-e4: mancano il granduca che minaccia di spararsi se lo zar non firma e la ballerina insultata a teatro per le corazzate perdute (C36). Le tre schede sono riassunti astratti («la Duma esiste ma lo zar conserva poteri molto larghi»).
  - I.5-e3: i gioielli senza Fabergé, la ballerina senza nome, «stupidità o tradimento?» senza Miljukov.
  - I.5-e4: manca Rodzjanko che chiede di considerare la frase come non detta; manca la risposta dello zar all'ambasciatore britannico.
  - I.6-e3: mancano lo zar che si tocca i baffi e torna nel vagone (R08) e Frederiks che annuncia in francese e piange. Il «semidio che diventa un uomo con un'abitudine» resta una frase senza l'abitudine.
  - Esempio concreto: oggi I.6-e3 dice «Mentre arrivano i telegrammi Nicola annota nel diario la vita del treno. Poi abdica». La scheda chiede di far vedere che cosa annota (la passeggiata, il tè, il sonno) mentre l'impero cade. Senza il dettaglio la domanda «che cosa resta di un semidio» non ha risposta.
- **La famiglia sparisce dopo I.1.** In I.2 si è «il capofamiglia che l'assemblea ascolta» ma la famiglia di Vasilij e Fëdor non viene mai nominata; nessun indicatore di I.1 passa in I.2. In I.3 il figlio parte sempre, qualunque cosa sia successa nel mir (il piano prevede che sussistenza di I.1 e mir decidano se parte). In I.4 il figlio «è fra i delegati», ma la scelta su Stolypin riguarda «la tua famiglia» al villaggio senza che il gioco dica chi è rimasto. L'unico effetto differito che funziona è il pane di I.5 che passa alla coda di I.6.
- **I.5 cambia punto di vista senza dirlo.** Il piano (I.5-e2) fa dividere il raccolto alla famiglia con il figlio al fronte; il gioco fa decidere a un funzionario dello Stato (prezzo fissato, treni, rapporto alla Duma). Il repertorio approva «quanto serve e quanto c'è», quindi non è un errore, ma lo studente passa da servo a operaio a delegato a ministro senza un raccordo. Una riga di cornice basterebbe («Questa volta guardi dall'alto: sei chi deve far arrivare il grano»).
- **Il confronto di fine atto è troppo corto**: due card, nessuna riga del diario, nessuna delle cinque «domande sotto la scena» richiamata. Il piano lo assegna a Opus come raccordo d'atto.
- **Alcuni esiti non insegnano niente perché non dipendono dalla scelta.** Il commento della petizione era uguale per qualunque distribuzione delle cinque righe (ora almeno la confronta con la petizione vera). Nelle giornate del soviet «Indagare» mostra due letture (il delegato moderato, il delegato radicale) e chiude con «scegli tu a chi dare più peso», ma non c'è nessun modo di scegliere.

## 4. UX e usabilità

**Corretti in questa PR**
- **Muro di indicatori.** Gli episodi senza l'elenco `shows` mostravano tutti gli indicatori incontrati da I.1 in poi: alla fine dell'atto erano 22 numeri prima del testo (schermata `prima-treno-indicatori.png`, `dopo-treno.png`). Il piano chiede che ogni unità mostri solo i propri. Ora gli episodi narrativi, di fonte e di verifica senza indicatori propri non ne mostrano.
- **«Torna a casa» nella sala del soviet, nella coda e nel reparto.** Le parole `leaveLabel` e `pointsLabel` scritte nei sorgenti non arrivavano al gioco perché il build non le copiava. Ora il pulsante dice «Finire la giornata».
- Errori di lingua generati dal motore: «Ne mancano 1 braccio», «Al signore mancano 1 braccio», «Hai 8 monete. Tutti assegnati.», «Alla il salario», «I numeri dell'anno» nella partita a settimane. Ora: «Ne manca 1 braccio», «Niente da mettere», «Al salario», «I numeri della settimana».
- Testo «il 8 marzo» → «l'8 marzo».

**Da fare**
- **Previsione e esito del grano si contraddicono** (I.1, 1777): il tabellone dice «Dopo la semina ne restano -18. Non basta», l'esito dice «Si mangia fino al raccolto e avanza qualcosa» e subito sotto «Il grano è finito prima della primavera: la famiglia vende la mucca». La previsione parla del grano fino al raccolto, l'esito dell'inverno dopo; lo studente non lo può sapere. Proposta: nella previsione scrivere «Fino al raccolto mancano 18» e nell'esito un solo verdetto.
- **Un numero negativo nel grano** («ne restano -18») su un telefono si legge come un errore del programma.
- **Didascalie sbagliate sotto la scena.** Quando un episodio riusa la scena di un altro, sotto compare la didascalia dell'altro: «Cinque cose da fare» e «I delegati prendono posto» (soviet del 1905) sotto il treno di Pskov e sotto il confronto finale; «Agosto 1914» e «La folla si inginocchia» sotto l'uccisione di Rasputin; «La carovana cerca il Regno delle Acque Bianche» sotto la colonia di Arakčeev; «Chi ha più bocche vuole più terra» sotto Stolypin; «Scena della simulazione» sotto ogni verifica.
- **Scene riusate.** Il treno fermo nella neve e il confronto finale usano la sala del soviet del 1905; «Che cosa concede lo zar» usa la sala del soviet. Il piano chiede il treno nella neve e il disco rosso che passa dal Palazzo d'Inverno al Palazzo di Tauride. Mancano disegni (PIANO-ATTI §9).
- **Etichette sulla scena che si coprono** su telefono e desktop: «Il ferroviere» è coperto da «Il prefetto» nella sala del soviet; «Orto 0/1» esce dal bordo nella settimana (schermata `telefono-sala-soviet.png`).
- **Lunghezza delle pagine sul telefono.** Il tabellone della settimana è alto circa 2400 px su 844: quattro schermi di scorrimento per una mossa. Le tre migliorie (orto, bosco, stalla) occupano mezzo schermo anche quando nessuno ci lavora.
- **Si può saltare una giornata a punti azione con un tocco**: «Finire la giornata» è attivo anche con 5 punti su 5 non spesi. Il testo dice «quello che lasci fermo costa», ma non c'è conferma.
- **Un'azione che dovrebbe essere prudente aiuta gli insorti.** Nel reparto di I.6 «Tornare in caserma e tenere unito il reparto» dà +4 a «Soldati con gli operai».
- **Un numero sale quando dovrebbe scendere.** Nella coda di I.6, terzo giorno, dopo «Il pane è finito» il pane in città passa da 9 a 21. Da controllare nel sorgente della coda.
- **La lettera iniziale grande** separa le parole di una lettera: «A l Palazzo di Tauride» si legge come due parole sul telefono.
- **Budget della home**: la prova browser misura 623 KB per il primo quadro contro i 500 KB del piano (§5). Era già così prima di questa PR.

## 5. Divertimento

- **I.1 è un gioco.** Ci sono rischio (gelo tardivo 25%), piccole costruzioni che si vedono (orto, bosco, sokha), la fiera, chi bussa con probabilità dichiarate. Si ha voglia di rigiocare per vedere che cosa succede se si costruisce di più.
- **I.2 e I.5 sono questionari con barre.** Otto e cinque richieste a tre risposte: non c'è niente da gestire fra una richiesta e l'altra. Il repertorio lo sa («partita di sole decisioni»); resta il gioco meno divertente dell'atto.
- **Il salario di I.3 si gioca da solo.** Con la stessa distribuzione (3 pane, 2 stanza, 1 carbone, 1 villaggio, 1 corso) tutte e otto le settimane finiscono «Si regge». La scelta vera non c'è: nessuna settimana mette alle strette. Proposta: un evento che costringa a scegliere fra stanza e pane (l'affitto aumenta, la multa del caposquadra pesa di più).
- **Le giornate del soviet e la coda** hanno la struttura giusta (punti azione, notizie a pezzi) ma ogni azione è un pulsante in un elenco con i numeri scritti accanto: si sceglie leggendo i +15 e i −10, non la situazione. Le notizie dei delegati sono la parte più interessante e non servono a niente.
- **Tempo e fatica.** Quattrocento tocchi per l'atto, circa ottanta per unità. Per una quinta che gioca da sola è tanto ma accettabile se diviso in sei sedute; va detto agli studenti che si può smettere e riprendere.

## 6. Correttezza storica

**Corretto in questa PR**
- Chiusura di I.6: «nacquero la Duma e il soviet» era sbagliato, la Duma esisteva dal 1906. Ora: «Al Palazzo di Tauride nacquero il Comitato provvisorio della Duma e il soviet di Pietrogrado».
- Fonti e appunti dentro il testo per lo studente: «Secondo Miéville…» (I.3), «Secondo gli appunti…» (I.5 due volte, I.6). Il docente non vuole storici citati come autorità e «gli appunti» sono i suoi materiali, non qualcosa che lo studente conosce. Riscritti come fatti; la provenienza resta nei campi delle fonti.
- La petizione del 1905 ora si scrive prima del corteo (vedi §7) e il commento la confronta con la petizione vera di Gapon: giornata di otto ore, assemblea eletta da tutti, fine della guerra.

**Da controllare prima del testo definitivo** [verificare]
- I.1, carta del 1761: «Muore l'imperatrice Elisabetta». Morì il 5 gennaio 1762 (25 dicembre 1761 nel calendario giuliano): con le date gregoriane del piano va «1762 (g. 1761)» o va spostata la carta.
- I.1, 1777: Zorič fu congedato nel 1778, non nel 1777.
- I.1, card 3 delle anime: «il principe Menšikov… arriva a trecentomila». La scheda I.1-e1 attribuisce i trecentomila servi a Potëmkin (Montefiore). Uno dei due è sbagliato; l'atlante e le schede delle fonti non riportano il passo.
- I.4, giornate del soviet: «Primo giorno · 17 ottobre». Senza indicazione del calendario si legge come gregoriano; il 17 ottobre giuliano (30 ottobre gregoriano) è il giorno del Manifesto, ma nel gioco il Manifesto arriva come voce il secondo e il terzo giorno. Il soviet si riunì la prima volta il 26 ottobre (g. 13). Proposta: «26 ottobre (g. 13)» e seguenti.
- I.5, gennaio 1917: le tessere del pane a Pietrogrado furono annunciate alla fine di febbraio; a gennaio come scelta simulata va bene, ma l'esito non dovrebbe sembrare un fatto.
- Home: «quattro generazioni» nella premessa e «quattro o cinque unità» per atto, mentre I.1 ha cinque generazioni e l'Atto I sei unità. La home è approvata: da decidere se cambiare.

## 7. Rispetto del piano

| Punto | Piano | Gioco prima della PR | Ora |
|---|---|---|---|
| Ordine di I.4 | I.4-e2 «La petizione: **prima** del corteo» | Prima la domenica di sangue, poi «Prima del corteo si scrive la petizione»: lo studente scrive la petizione sapendo già che spareranno | Petizione e poi domenica; la petizione apre con la guerra e lo sciopero alla Putilov |
| Indicatori | «ogni unità mostra solo i propri» (PIANO-ATTI §6) | Tutti gli indicatori del percorso negli episodi senza `shows` | Rispettato |
| Testo di chiusura dell'atto | Atto I fino a marzo 1917 | «Fine dell'unità I.1… per ora il percorso si ferma qui» | Riscritto per l'atto intero |
| Date di I.3 | «fine Ottocento–1904» | Cartigli «1861–1904» | «fine Ottocento–1904» |
| «Anime e semidei» nei testi | Decisione aperta 6: l'espressione resta solo nei documenti di lavoro, non nei testi per lo studente | Titolo di I.1 «Anime e semidei» e di I.5-e4 «La fine dei semidei comincia in famiglia» | **Da decidere** (D2) |
| Titolo dell'Atto I | «Anime e semidei» (titolo di lavoro), formula da trovare | «La terra e lo zar» (vecchio Atto 0) | **Da decidere** (D1) |
| Aneddoti | Schede I.4–I.6 con aneddoti precisi | Quasi tutti assenti (§3) | **Da fare** (D3) |
| Effetti differiti | Sussistenza → partenza del figlio; soviet → opzione sul Manifesto; raccolto → coda | Solo raccolto → coda | **Da fare** (D4) |
| Cannone alla benedizione delle acque | Da togliere se non si trova una fonte (PIANO-ATTI §10) | Non c'è | Rispettato |
| Il motore resta generico | Nessun testo di un gioco in `src/` | «Al signore manca…» è scritto nel motore | Da spostare in una parola della partita |

## 8. Che cosa cambia in questa PR

- `games/laika/source/acts/atto-1.json`: chiusura dell'atto; `shows: []` negli episodi che non dichiaravano indicatori; ordine petizione → domenica; contesto della petizione e confronto con la petizione vera; date di I.3; quattro frasi senza «secondo…»; Comitato provvisorio della Duma; «l'8 marzo».
- `scripts/build-laika.js`: il build copia anche `leaveLabel` e `pointsLabel`.
- `src/interactions/index.js`: accordo «manca/mancano», «Niente da mettere», preposizione articolata davanti al nome del passo («Al salario»), «I numeri della settimana/della giornata».
- `games/laika/course.json`: `contentVersion` `p4-revisione-1`. I salvataggi della versione precedente risultano incompatibili e il player propone di ricominciare (l'ordine di I.4 è cambiato).
- `tests/units.test.js`: nuovo ordine di I.4.
- `scripts/allievo-finto.cjs` e `npm run allievo`: l'allievo finto.
- Documenti: questo file, `PIANO-LAIKA.md` (numerazione e stato), `INCARICHI-LAIKA.md` (numerazione e incarichi nati dalla revisione), `PIANO-ATTI-LAIKA.md` §10, `CREARE-UN-GIOCO.md` (build e parole), `games/laika/README.md` (era ancora la descrizione della fase P1).

## 9. Decisioni per il docente

- **D1. Titolo dell'Atto I.** Oggi «La terra e lo zar», che era il vecchio Atto 0 (fino al 1904) ed è la causa principale della confusione. Proposte: tenerlo; «Il mondo da rovesciare» (dal piano, §3, primo movimento); un'altra formula per la decisione aperta 6.
- **D2. «Anime e semidei» nei testi dello studente** (titolo di I.1 e di I.5-e4): il piano dice di no finché non c'è la formula definitiva.
- **D3. Rimettere gli aneddoti di I.4–I.6.** Serve un lavoro di Opus con i libri (Montefiore, Miéville, Trockij) per riprendere i passi: diario di Nicola, granduca e Manifesto, Baletta, Fabergé e Kšesinskaja, Miljukov, Rodzjanko, i baffi e Frederiks.
- **D4. Il filo della famiglia** da I.1 a I.6: quali effetti differiti costruire davvero (il piano ne prevede tre) e se il figlio può anche non partire.
- **D5. Identificatori `a1-u2-*` di I.3.** Rinominarli in `a1-u3-*` costa una nuova `contentVersion` (già cambiata in questa PR: è il momento meno costoso) e la modifica di test e scene. Proposta: farlo ora, in una PR a parte, se il docente è d'accordo.
- **D6. Salario troppo facile e soviet con le notizie inutili** (§5): ritoccare le schede dei giochi prima di passare alle code vere.
