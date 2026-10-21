# Profili di utilizzo

## A. Verifica scolastica da appunti (Italiano, Storia, materie tecniche)
- Definisci argomenti effettivamente presenti, capacità, classe ed eventuali strumenti consentiti.
- Distingui una verifica di conoscenze da una prova di comprensione o applicazione; anche a parità di numero di domande i due scopi non coincidono.
- Proponi un tempo coerente, una consegna utilizzabile dagli studenti, e una chiave separata con spiegazioni e punteggio per item.
- Per correzione con voto, somma esattamente 100 punti oppure dichiara esplicitamente la conversione a 0–100. Per quesiti aperti, definisci indicatori osservabili di rubrica, non una risposta chiusa mascherata.
- Per classi con bisogni differenti, considera chiarezza, layout, leggibilità e adattamenti previsti dall'utente; non sottrarre obiettivi essenziali senza una scelta consapevole.
- Non inserire termini o eventi non comparsi negli appunti senza segnalare che sono conoscenze di base presupposte.

## B. Corso di italiano L2 per arabofoni (repo `corso-arabofoni`)
- Lingua iniziale: **italiano**; arabo solo opzione di supporto nel contenuto multilingue. La scelta della lingua non deve alterare la chiave corretta.
- Profilo: soprattutto studenti della formazione professionale; situazioni di classe, scuola, tirocinio, officina, servizi e vita quotidiana. Difficoltà in relazione ad A1, A2, B1, B2; nessun «certificato QCER» prodotto dal gioco.
- App autonoma e mobile-first: la consegna, il feedback e la progressione devono essere comprensibili senza docente né audio obbligatorio.
- Durante le lezioni: pratica con feedback formativo, XP secondo regole del progetto, **nessun voto 0–100 mostrato**.
- Solo verifica finale del modulo: risultato privato **0–100**, varianti equivalenti e nuove situazioni, non semplice riuso degli item svolti. Non modificare premi, rubriche, gradingVersion e stato dei tentativi senza richiesta specifica.
- Esercizi attualmente dimostrati nello spike: `choice`, `gap`, `order`; le altre famiglie in `docs/curriculum/proposta-esercizi-valutazione.md` sono una roadmap, non tutte implementate.
- Per `gap`, varianti ortografiche e morfosintattiche ammesse devono essere specificate esplicitamente; il correttore normalizza Unicode, spazi e apostrofi, ed eventualmente il case-folding.
- Per `order`, considera tutti gli ordini alternativi difendibili; per `choice`, verifica il testo italiano delle opzioni e poi la traduzione, non la sola chiave JSON.
- Per competenze produttive non deterministiche (scrittura spontanea o conversazione), non dichiarare una padronanza automatica fondata solo su completamenti o scelte multiple.
- Esempio di trasferimento: dopo esercizi sul passato prossimo riferiti a «Sami a scuola», la verifica può presentare un nuovo diario di tirocinio, con stesso obiettivo linguistico ma dati e domande differenti.

## C. Simulatore tecnico / laboratorio elettrico
- Verificare quattro aspetti: a cosa serve, come funziona, perché quel collegamento/comando, che cosa succede se è sbagliato.
- Distinguere comprensione concettuale e saper fare su schermo: la demo deve permettere l'azione reale senza sapere in anticipo la soluzione dal codice.
- Sottoporre la dimostrazione a un «allievo finto» che vede interfaccia e materiali studente, non le soluzioni interne.
- Per scelte multiple, `test/opzioni.test.js` del laboratorio è il precedente esistente: preservarne i test di regressione senza esportare regole elettriche nel validatore universale.
