---
name: verifiche-didattiche
description: Crea, revisiona e controlla verifiche scolastiche, quiz, domande a scelta multipla ed esercizi didattici a partire da appunti, curricoli o contenuti di app educative. Da usare per generare prove, controllare ripetizioni, indizi nelle risposte, distribuzione delle opzioni, difficoltà, distrattori, attendibilità della valutazione e competenze realmente verificate. Supporta italiano, storia, italiano L2, corsi professionali e simulatori didattici.
---

# Verifiche didattiche — progettazione e quality assurance

## Use When
- L'utente vuole una bozza di verifica partendo da appunti, un testo, una lezione o un curricolo.
- L'utente chiede esercizi, quiz, prove finali, varianti equivalenti, correzioni o una revisione degli esercizi di un'app.
- È necessario controllare che la risposta corretta non sia sempre nella stessa posizione, la più lunga o l'unica plausibile.
- Si prepara un rilascio didattico o una PR che modifica domande o metodi di valutazione.

## Don't Use When
- È chiesta soltanto una spiegazione teorica senza esercizi né verifica.
- L'utente domanda un voto su una prova già svolta senza criteri di correzione: prima esplicitare la rubrica e la base osservabile.
- Si tratta di certificare legalmente competenze o livelli linguistici: questa skill non produce certificazioni.

## Workflow
1. Identifica fonte, destinatari, prerequisiti, obiettivo misurabile, tempo disponibile, modalità di somministrazione, vincoli di accessibilità e tipo di output. Se l'utente ha fornito gli appunti, usali come riferimento prioritario. Se mancano dettagli non bloccanti, fai ipotesi dichiarate e procedi.
2. Distingui `pratica formativa`, `verifica sommativa`, `ripasso` e `simulazione`. Non trasformare automaticamente una pratica in prova valutata. Per italiano L2 autonomo, vedi `references/PROFILI.md`.
3. Costruisci una mini-matrice obiettivi → evidenze → esercizi. Copri il materiale realmente studiato, evitando di valutare contenuti non insegnati come se fossero noti. Prevedi almeno un'applicazione in un contesto nuovo quando è pertinente.
4. Progetta la domanda corretta e la sua spiegazione, quindi almeno due distrattori diagnostici plausibili, associati a errori tipici realmente possibili. Non generare distrattori assurdi o artificialmente lunghi. Usa formati diversi quando misurano meglio le competenze.
5. Esegui **due audit separati**: (a) automatico strutturale/statistico con `python scripts/audit_questions.py <file.json>` quando c'è un archivio di domande normalizzato o contenuti JSON compatibili; (b) semantico e pedagogico secondo `references/CHECKLIST.md`. Nessun test automatico sostituisce la verifica del docente e delle fonti.
6. Per le risposte multiple controlla sia la chiave (`answer` / `correct`) sia le posizioni effettivamente mostrate nell'interfaccia. Se l'app mescola le opzioni, testa il risultato *dopo* il mescolamento e la stabilità durante il ridisegno; la sola analisi del JSON non dimostra la distribuzione a schermo.
7. Correggi indizi involontari: risposta corretta sistematicamente più lunga, grammatica dell'unica opzione compatibile, registro differente, specificità solo nella corretta, formulazioni assolute solo nei distrattori, opzione corretta invariabilmente in B, risposte copiate parola per parola dalla spiegazione, gruppi di domande quasi identiche. Il rapporto di lunghezza 0,85–1,15 usato nel laboratorio elettrico è **un indicatore di revisione**, non una legge universale; preserva la correttezza semantica.
8. Verifica l'univocità o le alternative corrette. Nei completamenti esplicita varianti accettabili, apostrofi, maiuscole e spazi; negli ordinamenti considera sequenze equivalenti; nei casi reali, non dichiarare sbagliata una soluzione difendibile.
9. Per esercizi autovalutati, distingui ciò che è correggibile con regole deterministiche da produzione libera, oralità e competenze non osservate. Non attribuire padronanza di abilità che il test non misura.
10. Consegna: prova per lo studente separata da soluzioni/criteri del docente; matrice di copertura e report QA sintetico con `bloccanti`, `da migliorare`, `verificati`, `limiti`. Se esistono problemi aperti, non dichiarare la prova validata.

## Rules
- Non fabbricare fonti o affermare che un concetto fosse negli appunti se non vi compare.
- Non privilegiare sempre lo stesso schema di domanda; varia l'operazione cognitiva, non solo nomi e numeri.
- Non considerare la posizione dell'opzione nel sorgente come equivalente alla posizione nell'app.
- Non forzare artificialmente il 25% di A/B/C/D quando il campione è piccolo. Su banche sufficienti evita concentrazioni evidenti; nei singoli compiti considera anche varianti/versioni.
- Evita domande ambigue o con più risposte valide se il formato ammette una sola risposta. In caso di ambiguità non risolvibile, segnala e riscrivi.
- Le spiegazioni devono motivare il **perché**, non solo rivelare la lettera corretta. Se l'esercizio è operativo, chiarire anche come fare, quando necessario, e la conseguenza tipica dell'errore.
- Le competenze dichiarate devono corrispondere alle prestazioni osservabili; memorizzare il percorso non equivale a saperlo applicare.
- Per verifiche scolastiche valutate, proponi una rubrica trasparente **0–100** se l'utente non indica una scala diversa; per i moduli dell'app L2 rispetta la distinzione tra XP formativi e punteggio privato della verifica finale.
- Per il corso L2 italiano resta la lingua iniziale; arabo come supporto opzionale solo nei contenuti che lo prevedono. Non assumere che l'insegnante conosca l'arabo. Usa contesti scuola, tirocinio e lavoro senza escludere l'italiano quotidiano.
- Se lavori in una repo, leggi il contratto dati reale prima di scrivere JSON: la struttura semplificata usata dall'auditor **non** è lo schema runtime del corso arabofoni. Non modificare motore, punteggi o UX oltre il perimetro richiesto.
- Nelle riscritture ri-esegui controlli e test regressivi; registra la dimensione del campione e la distinzione tra audit automatico e revisione umana.

## Examples
- «Prepara una verifica di storia da questi appunti, per la seconda, da 45 minuti» → matrice di copertura, prova differenziata, correzioni e QA.
- «Crea dieci esercizi sul passato prossimo per il corso arabofoni» → scenari scuola/tirocinio, scelta/completamento/ordinamento, varianti linguistiche, nessun voto durante la lezione, audit delle scelte.
- «Controlla i quiz nel JSON prima della PR» → estrazione nel formato di audit, esecuzione script, analisi semantica, severità e modifiche minime.
- «La risposta corretta è sempre la più lunga?» → analisi quantitativa con esempi e correzioni, non solo impressione.

## Edge Cases
- Se sono disponibili solo appunti informali, conserva l'incertezza e chiedi chiarimento solo sui punti essenziali; non inventare contenuti disciplinari.
- Se le risposte devono avere inevitabilmente lunghezze differenti, non alterare la verità per pareggiare caratteri: crea distrattori simili per specificità o usa un altro formato.
- Se il banco ha meno di otto domande, la distribuzione delle posizioni è indicativa e non costituisce da sola prova di distorsione.
- Se un esercizio ammette una produzione aperta, fornisci rubrica docente o limita esplicitamente la pretesa di correzione automatica.
- Se il contenuto dell'app è multilingue, controlla ogni localizzazione separatamente; l'auditor estrae di norma l'italiano e non verifica l'equivalenza semantica con l'arabo.

## References
- `references/CHECKLIST.md`: checklist dettagliata con severità e verifica contro gli appunti.
- `references/PROFILI.md`: profilo del corso arabofoni, esercizi per app e verifica cartacea.
- `references/FORMATO.md`: formato JSON di audit, estrazione da repo e limiti dello script.
- `scripts/audit_questions.py`: controllo deterministico con output testo o JSON, libreria standard Python.
- `assets/esempio-banca.json`: piccolo insieme di domande di esempio.
