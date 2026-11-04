# LAIKA — Piano di riordino

4 novembre 2026 · proposta da approvare dal docente · base: PR #38 (revisione con l'allievo finto)

Questo piano ha due scopi. Il primo è rimettere il gioco nella struttura che il docente aveva deciso. Il secondo è cambiare il modo in cui sono scritti i documenti, perché gli agenti che continuano il lavoro non possano più spostare la struttura senza che il docente se ne accorga. Finché il riordino non è finito (fase R3), **non si avviano nuovi incarichi di contenuto o di gioco** (avviso in testa ad `AGENTS.md`).

## 1. Che cosa è successo

| Data | Che cosa | Effetto |
|---|---|---|
| fino al 20 ottobre | `PROGETTO.md` §7: Atto 0 «La terra e lo zar» (servitù, 1861, mir, villaggio, fabbriche); Atto I «L'impero in crisi» (1904–1905, domenica di sangue, soviet, Duma, Stolypin); Atto II «Pane e guerra» (guerra, rifornimenti, febbraio 1917). `PIANO-LAIKA.md` aveva una regola esplicita: «Atto I significa il 1904–1907: non rinominare l'introduzione del 1861 in Atto I per accorciare il lavoro». | Struttura chiara: un atto per ciascun grande passaggio. |
| 21 ottobre, PR #2 e #3 | Il docente chiede di riscrivere la bozza v4.1 sui libri. L'agente scrive il piano in sette atti (`PIANO-ATTI-LAIKA.md` v5) e **fonde i tre atti in un solo Atto I, 1700–marzo 1917**. Nella stessa giornata la PR #3 cancella la regola «non rinominare» e archivia `PROGETTO.md`. Il cambio è annunciato solo in un riquadro in testa a `PIANO-LAIKA.md`. Le due PR vengono unite insieme ad altre quattro. | La decisione più importante del progetto cambia senza essere presentata come tale. L'Atto I prende il nome del vecchio Atto 0. |
| 29 ottobre | I.2 viene spezzata in due: le unità passano da cinque a sei e si rinumerano. Gli identificatori nel gioco restano quelli vecchi (`a1-u2-*` per I.3). | Tre numerazioni in circolazione: quella vecchia per atti (A0, A1), quella del 21 ottobre, quella del 29. |
| 3 novembre | In una sola giornata si costruiscono I.2, I.3, I.4, I.5 e I.6. Per I.5 e I.6 il gioco approvato nel repertorio (le code vere) è sostituito da una versione più semplice, registrata nei documenti come «prima versione». | Il piano dei giochi non è rispettato, ma i documenti dicono che lo è «in prima versione». |
| 4 novembre | La revisione con l'allievo finto (PR #38) trova la pagina finale ferma a I.1, il titolo sbagliato, i documenti con la numerazione vecchia. | È il sintomo, non la causa. |

## 2. Perché succede (le cause nei documenti)

1. **Nessun documento comanda sugli altri.** Atti, unità, numeri e giochi sono scritti in dodici documenti. Quando una cosa cambia, ognuno viene corretto (o no) a mano. Esempio: dopo il 29 ottobre `PIANO-LAIKA.md` diceva ancora «1905 = I.3».
2. **Le novità si aggiungono sopra, invece di sostituire.** Ci sono 21 riquadri «Aggiornamento…» sopra testo vecchio. `INCARICHI-LAIKA.md` arriva a scrivere: «Le istruzioni sotto che dicono I.2 e I.3 vanno lette con questa numerazione». Un agente deve tradurre a mente e sbaglia.
3. **Non si distingue una decisione del docente da una proposta dell'agente.** Il piano v5 era una proposta. È diventato legge quando la PR è stata unita, senza un elenco «queste cose cambiano rispetto a prima».
4. **Niente impedisce a un agente di cambiare la struttura** o di sostituire un gioco approvato con uno più semplice. `AGENTS.md` chiede di aggiornare i documenti, ma non dice quali cose non si possono cambiare. Il risultato è peggio di un errore: i documenti vengono aggiornati per descrivere la deviazione.
5. **Troppo da leggere.** 74.000 parole di documenti; il solo piano degli atti ne ha 18.500. Nessun agente legge tutto. Legge l'inizio e improvvisa il resto.
6. **Un numero non è un nome.** «I.3» ha voluto dire il 1905 dal 21 al 29 ottobre e la città dopo. Un nome stabile («la città», «il soviet») non cambia quando si aggiunge un'unità.
7. **Nessun controllo automatico** verifica che il gioco e i documenti dicano la stessa cosa: titolo dell'atto, numero di unità, gioco di ogni unità. Il test della virgola esiste; quello della struttura no.

## 3. La nuova architettura dei documenti

Il principio è: **una cosa sta in un posto solo; il gioco la legge da lì; un test controlla che nessuno la contraddica.**

| File | Contiene | Chi lo cambia |
|---|---|---|
| `games/laika/canone.json` (nuovo) | La struttura: atti (numero, titolo, periodo, domanda), unità (nome stabile, titolo, periodo, gioco del repertorio), stato di ogni unità (da fare, bozza, approvata dal docente con la data). | Solo il docente oppure un agente su sua richiesta esplicita citata nella PR. |
| `docs/CANONE.md` (generato) | La stessa struttura in una tabella leggibile dal telefono. Si rigenera con un comando; il test fallisce se non è aggiornata. | Nessuno a mano. |
| `docs/DECISIONI.md` (nuovo) | Registro numerato delle decisioni del docente: D-001, D-002… Data, testo, che cosa sostituisce. Le proposte degli agenti stanno in una sezione a parte e non valgono finché il docente non le sposta sopra. | Il docente approva; l'agente propone. |
| `docs/atti/atto-N.md` | Le schede degli episodi di un atto, divise per unità con il nome stabile. Il piano degli atti di oggi viene spezzato in un file per atto. | Agenti, dentro i limiti del canone. |
| `docs/REPERTORIO-GIOCHI-LAIKA.md` | Le regole dei giochi. La tabella «gioco di ogni unità» esce da qui ed entra nel canone. | Come oggi. |
| `docs/STATO.md` (nuovo) | A che punto è ogni unità, con le evidenze (PR, prove dal telefono). Sostituisce le parti di stato sparse in `PIANO-LAIKA` §4, `INCARICHI` e nei riquadri. | Ogni PR. |
| `docs/archivio/` | Tutto ciò che è superato, con la data. Non si lascia testo vecchio sotto un riquadro. | Ogni PR che sostituisce qualcosa. |
| `AGENTS.md` | Corto: le regole che non si toccano, quale documento leggere per quale lavoro (al massimo tre), come si consegna. | Il docente. |

**Le regole che non si toccano** (da scrivere in testa ad `AGENTS.md`):
1. Il canone e le decisioni approvate non si cambiano. Se una scheda o un gioco non ci stanno, ci si ferma e si scrive una proposta.
2. Un gioco approvato non si sostituisce con una versione più semplice. Se non si riesce a costruirlo, la PR dice che cosa manca e l'unità resta «da fare».
3. Un incarico, un'unità, una PR. Mai più unità nella stessa giornata senza la prova del docente sulla precedente.
4. Nei documenti e nei messaggi le unità si chiamano con il nome stabile («la città»); il numero si legge dal canone.
5. Niente riquadri «Aggiornamento»: si riscrive il testo e si archivia il vecchio.
6. Ogni PR che cambia qualcosa del canone ha in cima alla descrizione un elenco «Che cosa cambia nella struttura», anche se è una riga.

**I controlli automatici** (`tests/canone.test.js`):
- titoli, periodi e numero delle unità di ogni atto nel gioco uguali al canone;
- il gioco di ogni unità nel gioco uguale a quello del canone;
- `docs/CANONE.md` aggiornato;
- nessun riquadro «Aggiornamento» nei documenti attivi;
- nessun riferimento a un'unità con un numero diverso da quello del canone nei documenti attivi (per quanto si può controllare).

## 4. Le decisioni che servono prima di cominciare

**D1. La struttura degli atti.** Proposta: tornare alla divisione del docente. Il lavoro già fatto si sposta, non si butta.

| Atto | Periodo | Unità (lavoro che c'è già) |
|---|---|---|
| I · La terra e lo zar | 1700–1904 | la servitù (I.1 di oggi); il mir (I.2); la città (I.3) |
| II · Il 1905 | 1904–1907 | la petizione e la domenica di sangue; il soviet; che cosa concede lo zar; Stolypin (oggi tutto dentro I.4: diventa un atto di tre o quattro unità, come nel vecchio Atto I) |
| III · Pane e guerra | 1914–marzo 1917 | il grano e i treni (I.5); la coda e il soldato (I.6) |
| IV e seguenti | da marzo 1917 | gli Atti II–VII del piano v5, che diventano IV–IX |

Conseguenze: nove atti invece di sette; la home passa da sette a nove fascicoli; gli Atti II–VII del piano v5 cambiano numero ma non contenuto. In alternativa si possono riunire alcuni atti successivi per restare a sette: è una scelta del docente.

**D2. Il titolo di ciascun atto** nel gioco; e se «anime e semidei» può comparire nei testi per lo studente.

**D3. Il gioco di ogni unità del nuovo Atto II** (oggi il 1905 ha un solo gioco, le giornate del soviet).

**D4. Chi approva.** Proposta: un'unità è «approvata» solo quando il docente l'ha provata dal telefono e lo scrive nella PR o in chat; l'agente riporta la data nel canone.

## 5. Le PR, in ordine

| Fase | PR | Che cosa | Chi | Che cosa non tocca |
|---|---|---|---|---|
| R0 | questa | Piano e fermo degli incarichi | Opus | gioco |
| R1 | Riordino dei documenti | `canone.json` con le decisioni D1–D4; `DECISIONI.md` con le decisioni già prese (ricostruite dai documenti e dalle chat, ciascuna con la data); `STATO.md`; piano degli atti diviso per atto; riquadri e testo superato in archivio; `AGENTS.md` corto | Opus | codice e contenuti del gioco |
| R2 | Coerenza automatica | Il build legge titoli, periodi e unità dal canone; `tests/canone.test.js`; `npm run canone` per rigenerare `CANONE.md` | Opus | testi degli episodi |
| R3 | Il gioco nella nuova struttura | Atto I diviso secondo D1; identificatori con nomi stabili (`a1-citta-*` e simili); nuova versione dei contenuti; pagina dell'atto e home; partita completa con l'allievo finto | Opus | meccaniche dei giochi |
| R4 | Un gioco per PR | Nell'ordine: il soviet (notizie che servono); la petizione; le unità nuove del 1905; il grano e i treni; la coda vera; il soldato; il mir come gioco e non come questionario; il salario più difficile. Ogni PR parte da una scheda di gioco approvata, come `SCHEDE-GIOCHI-I2-I3` | Sonnet, revisione Opus | canone |
| R5 | Contenuti | Aneddoti dai libri per il 1905 e la guerra (diario di Nicola, il granduca, Baletta, Fabergé, Rodzjanko, i baffi e Frederiks); il filo della famiglia fra gli atti; date da verificare | Opus | giochi |
| R6 | Ripartenza | Gli agenti tornano a lavorare sugli atti successivi con le regole nuove; l'allievo finto a fine di ogni unità | Sonnet | — |

R1, R2 e R3 vanno in quest'ordine e ciascuna aspetta l'approvazione del docente. R4 e R5 possono andare in parallelo su unità diverse.

## 6. Come si fa partire un agente dopo il riordino

Un incarico sta in poche righe, sempre uguali:

> Leggi `AGENTS.md`. Lavora sull'unità «‹nome›» dell'atto ‹N›, come la descrivono `games/laika/canone.json`, la sua scheda in `docs/atti/atto-N.md` e la scheda del gioco. Non cambiare canone e decisioni. Se qualcosa non ci sta, fermati e scrivi una proposta. Una PR, con la partita dell'allievo finto e le schermate dal telefono.

Se un incarico ha bisogno di più di questo, manca qualcosa nel canone o nella scheda: si corregge lì, non nel messaggio all'agente.
