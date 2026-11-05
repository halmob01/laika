> **Archivio, 5 novembre 2026.** Versione 1 della scheda di gioco del salario (otto settimane con la stessa spesa fissa che reggeva sempre), sostituita dalla versione 2 in `docs/laika/giochi/salario.md`. Non vale come istruzione.

# Gioco di I.3 — Il salario (`salario`)

Scheda di gioco dell'unità `citta` (canone: I.3). Versione 1 · 30 ottobre 2026 · approvata dal docente il 3 novembre 2026 (D-019) · costruita lo stesso giorno. I dati [da riscontrare] (multe, negozio a credito) non compaiono come fatti. Regole comuni: [GIOCHI](../GIOCHI.md) §2 e §3.1.

Tutti i numeri sono indici della simulazione, non statistiche storiche. I fatti non ancora riscontrati sono segnati **[da riscontrare]** e non entrano nel testo per lo studente come dati.

## La scheda

**Forma:** gestione a più settimane. **Durata:** circa quindici minuti, otto settimane.

**Che cosa vede lo studente.** La scena dell'angolo di stanza in città con le figure del figlio e del compagno di stanza. Ogni settimana arriva il salario in «monete» (indice della simulazione, non rubli veri). Le monete si assegnano a quattro posti toccando prima la moneta e poi il posto: **Pane**, **Angolo di stanza**, **Carbone**, **Villaggio** (soldi a casa).

**Chi è il giocatore.** Il figlio partito dal villaggio (se il flag `figlio_in_citta` di I.2 non c'è, parte comunque: l'ordine di unità non cambia).

**Indicatori visibili (quattro):**
- **Salute** (alta è meglio): dipende da pane e carbone;
- **Debito** (basso è meglio): cresce se si compra a credito;
- **Legami con il villaggio** (alti è meglio): crescono con le monete mandate a casa;
- **Quanto sai leggere i fogli** (alto è meglio): cresce con il corso serale (vedi sotto).

**Regole del salario.**
- Obbligo: la stanza vuole almeno 2 monete a settimana (altrimenti sfratto alla seconda volta); il pane almeno 3 (altrimenti la salute scende); il carbone conta di più nelle settimane fredde.
- Imprevisti con probabilità scritta prima di confermare: pane più caro (3 su 10), fabbrica ferma per una giornata (2 su 10), una multa del caposquadra (1 su 10) **[da riscontrare]** la pratica delle multe.
- «Chi bussa» a metà settimana: il compagno di stanza malato che chiede una moneta; la sorella dal villaggio che chiede soldi; un operaio che offre un foglio da leggere.
- **Mercato:** il negozio della fabbrica che vende a credito (una volta a settimana, interessi in debito) **[da riscontrare]**.
- **Lavoro lungo:** il corso serale (tre settimane di una moneta). Finito, sblocca nel confronto dei tre volantini una scelta in più e una frase che lo studente prima non poteva leggere.

**Crisi** (una sola volta ciascuna): salute a 0, il figlio resta a letto e perde una settimana di salario; debito a 8 o più, si perde la stanza; legami a 0, a casa non rispondono più.

**Un turno di esempio (settimana 3).** Salario: 8 monete. Fa freddo: il carbone ne vuole 2. Si assegnano: pane 3, stanza 2, carbone 2, villaggio 1. Prima di confermare si legge: «pane più caro: 3 volte su 10». Esito: sale il pane (−1 moneta di resa), salute stabile, debito invariato, legami +1. Poi bussa il compagno malato: *dargli una moneta* (legami tra i compagni, salute −0) o *no*.

**Che cosa deve capire lo studente.**
- In città si è liberi dal mir e dal padrone di terra, ma dipendenti dal salario e dall'affitto.
- Una settimana buona non basta: contano le catene di settimane e i debiti.
- I volantini di fine unità si capiscono meglio se si è letto qualcosa.

**Esito.** Un giudizio di una riga («Si mangia, si dorme, a casa si manda poco») e il riepilogo delle monete dove sono andate. Nessuna sconfitta.

**Dati da riscontrare:** multe in fabbrica; negozio della fabbrica a credito; stanza in affitto a Pietroburgo; soldati senza tram né ristoranti (Miéville, da verificare la pagina).

**Il codice.** Quasi tutto esiste già: `workers`, `places`, `projects`, `market`, `luck`, `crises`, `verdicts`. Serve una piccola estensione generica: **le pedine come monete** (`tokens` come risorsa del turno con `tokensDelta`, già previsto) e un obbligo `min` per posto che si applica al denaro assegnato, non alla forza. Test in `tests/turns.test.js`. Disegni da chiedere alla bottega: angolo di stanza in affitto con figura del compagno (non c'è nel catalogo).

---


## Scelte del docente (3 novembre 2026)

1. **Il mir:** il giocatore è il capofamiglia più ascoltato del villaggio, non lo starosta (ruolo non ancora riscontrato).
2. **Il razzo e la corte:** restano episodi narrativi dopo il salario.
3. **Il disegno dell'angolo di stanza:** lo disegna l'agente secondo il contratto dei kit, insieme agli altri pezzi di [PROMPT-ASSET-I2-I3](../../archivio/PROMPT-ASSET-I2-I3.md).
4. **Il corso serale:** sì, come premio piccolo: sblocca una riga in più nei volantini, nessun punto.

Il docente ha chiesto anche di lavorare in autonomia: l'agente unisce da solo le PR con test e CI verdi e prosegue con le unità successive secondo il piano approvato.

## Domande aperte per il docente (chiuse il 3 novembre)

1. **Il mir:** il giocatore è lo starosta (da riscontrare) o il capofamiglia più ascoltato?
2. **Il razzo e la corte:** restano episodi narrativi dopo il salario (come oggi) o diventano «notizie» del gioco? La seconda scelta li lega a una sola data e li accorcia: la proposta è lasciarli come sono.
3. **Il disegno dell'angolo di stanza:** lo chiedo alla bottega (in attesa) o uso per ora la scena della città esistente?
4. **Il corso serale:** una scelta in più nei volantini è un premio accettabile o dà troppo peso a una sola mossa?

