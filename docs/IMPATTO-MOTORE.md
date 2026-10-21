# Ricognizione e decisioni tecniche — 18 ottobre 2026

Mandato aggiornato: il docente autorizza lo sviluppo del kit e le correzioni tecniche motivate. Restano fuori i contenuti definitivi del corso. La PR #1 è stata successivamente integrata con autorizzazione esplicita del docente. Per lo stato corrente vedere STATO-KIT.md.

## Impatto

| Componente sorgente | Trattamento | Motivo |
|---|---|---|
| engine.js di epica-romanzo | Riuso invariato come modulo di compatibilità legacy, con suite originale | API e replay conservati; lo schema lineare resta utilizzabile per i vecchi pacchetti |
| Pure transition / clamp / replay | Adattamento al contratto esteso | Range dichiarati, mutazioni effettive, ruoli e coda deterministica; stesso principio di stato nuovo senza mutare l'input |
| epica-app.js | Sostituzione della shell | Condizioni sui personaggi, fonti e scene non trasferibili; navigazione e viste diventano dati |
| epica-map.js | Sostituzione del renderer | innerHTML reinserisce l'intera scena; lo stage nuovo conserva i nodi e interpola attributi numerici |
| prologo.js | Adattamento del principio SVG a livelli | Primitive geometriche e trasformazioni riutilizzabili, senza importare scene/loop ornamentali o globali di lingua |
| mappa.js | Nessun import | Renderer Canvas specifico; non è una base SVG |
| index.html / CSS | Sostituzione con shell e tema di pacchetto | Nessun personaggio, font remoto o scelta definitiva dell'identità russa |
| Test browser vecchi | Nuovi test sul contratto pubblico | Il test «Destini generali» è già rotto nella sorgente: numero fisso di avanzamenti non aggiornato |

Baseline sorgente: 11/11 test engine passano; 4/5 test fake-browser passano. La repo sorgente non viene modificata. Le revisioni esatte sono nel report test.

## Dipendenze

- `core/schema` valida esclusivamente dati JSON, condizioni, mutazioni e riferimenti.
- `core/engine` applica azioni di simulazione pure; non importa contenuti, browser o storage.
- `assessment` valuta risposte e controlla esposizione; non legge metriche.
- `runner` orchestra atti, episodi, registro e replay usando core e assessment.
- `storage` serializza il registro e ripristina tramite runner, mai fidandosi di snapshot importati.
- `interactions` produce azioni; non sceglie gli effetti.
- `visual` monta descrittori SVG e anima attributi persistenti; nessuna mutazione di gioco.
- `shell` coordina tutti i moduli e carica il manifest selezionato in configurazione.
- `games/*` contiene testi, regole, scenografia e tema. Nessuna dipendenza inversa.

## Correzioni rispetto alla proposta

1. Un'unica PR verticale revisionabile invece di quattro PR dipendenti: rende provabili insieme azione, persistenza e movimento. I confini dei moduli restano quelli richiesti.
2. Bivi solo in avanti, con destinazione di riserva obbligatoria. Niente cicli di workflow: ogni atto può sempre terminare; eventuali tentativi futuri richiederanno un contratto esplicito.
3. Due demo indipendenti, biblioteca e quartiere, senza fixture pseudo-storiche che possano sembrare contenuti approvati.
4. Ledger di comandi come formato di salvataggio: stato derivato interamente dal replay. Incompatibilità esplicita, nessuna migrazione silenziosa.
5. Stage SVG con interpolazione numerica requestAnimationFrame: permette geometria, traslazioni, densità per elementi e opacità con un solo controllore cancellabile, senza librerie runtime.
6. Schema di interazione v1 con quattro archetipi e verifica formativa; future meccaniche richiedono plugin registrati e validazione dedicata, non condizioni sul nome del gioco.
