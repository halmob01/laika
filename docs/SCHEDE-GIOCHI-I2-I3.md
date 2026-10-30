# Schede dei giochi di I.2 e I.3

Versione 1 · 30 ottobre 2026 · **da approvare dal docente prima di scrivere il codice**.

Regola di processo (29 ottobre 2026): una scheda di una pagina per ogni gioco, approvata prima della costruzione. Le due schede applicano [REPERTORIO](REPERTORIO-GIOCHI-LAIKA.md) §2 (regole comuni), §3.1 (gestione), §3.2 (decisioni sui gruppi) e §5.1 (tabella delle unità). Le schede degli episodi restano in [PIANO-ATTI](PIANO-ATTI-LAIKA.md).

Tutti i numeri sono indici della simulazione, non statistiche storiche. I fatti non ancora riscontrati sono segnati **[da riscontrare]** e non entrano nel testo per lo studente come dati.

---

## I.2 — La terra dopo il Manifesto (1861–1904): il mir

**Forma:** decisioni sui gruppi (stile Reigns). **Durata:** circa dieci minuti, otto assemblee.

**Che cosa vede lo studente.** In alto la scena del villaggio con l'assemblea riunita; sotto i quattro gruppi con la loro barra; al centro una carta: una persona si alza e chiede qualcosa. Sotto la carta due o tre risposte, scritte come cose che si fanno («Rifare la divisione delle strisce», «Lasciare le strisce come sono»). Un tocco sceglie. Niente trascinamento.

**Chi è il giocatore.** Lo starosta, eletto dall'assemblea, che propone e fa eseguire **[da riscontrare]** il ruolo e i suoi poteri su Fitzpatrick o Lewin. Se non si riscontra, il giocatore è il capofamiglia più ascoltato del villaggio.

**I quattro gruppi** (barre da 0 a 100, partono a 50; «contentezza», non denaro):

1. **Le famiglie numerose.** Tante bocche, strisce piccole: vogliono rifare la divisione.
2. **Chi ha curato il proprio lotto.** Hanno concimato e drenato: temono di perdere quello che hanno migliorato.
3. **Le vedove e gli anziani soli.** Poche braccia: vogliono che il villaggio li aiuti.
4. **La cassa del riscatto.** Non è un gruppo ma l'obbligo comune: il villaggio risponde insieme dei pagamenti dovuti dopo il 1861 (già in I.1, riscontri I1-09 e I1-10).

**Regola della crisi.** Un gruppo che scende a 10 o meno apre una crisi, una sola volta per gruppo:

- famiglie numerose: **un figlio parte per la città** (flag `figlio_in_citta`, che I.3 legge);
- chi ha curato il lotto: smette di migliorarlo (il raccolto delle carte successive rende meno);
- vedove e anziani soli: il villaggio le mantiene e la cassa si svuota in parte;
- cassa del riscatto: l'esattore sequestra il bestiame di tutti e ogni gruppo perde 10.

**Il rischio si vede.** Alcune risposte hanno un esito incerto e la probabilità è scritta prima di scegliere («raccolto scarso: 3 volte su 10»).

**Un turno di esempio (1868).** Carta: una madre con sei figli si alza e dice che il suo lotto non basta più; chiede di rifare la divisione. Risposte:
- *Rifare la divisione ora.* Famiglie numerose +20; chi ha curato il lotto −20; cassa 0.
- *Rimandare di tre anni.* Famiglie numerose −10; chi ha curato +5; vedove 0.
- *Un campo in più da lavorare a metà, in comune.* Famiglie numerose +8; vedove +5; cassa −10; esito incerto: il campo rende bene 6 volte su 10.

**Le otto assemblee** (un tema l'una; ogni carta dice se il fatto è documentato o simulato): la divisione delle strisce; un raccolto scarso e i pagamenti arretrati; una vedova senza braccia; un figlio che vuole partire; le migliorie di un lotto (concime, drenaggio); una carestia; la richiesta di un vicino di uscire dal villaggio **[da riscontrare]**; l'ultima assemblea, con i figli già in città che mandano e chiedono soldi.

**Che cosa deve capire lo studente.**
- Dopo il 1861 la terra è riscattata e il villaggio ne risponde insieme: la libertà ha un prezzo che il villaggio paga insieme.
- Ogni decisione che sembra giusta a un gruppo sembra ingiusta a un altro: il mir non è una democrazia moderna né un soviet.
- La pressione sulla terra spinge i figli verso la città: è il passaggio a I.3.

**Esito.** Nessuna vittoria o sconfitta. Un giudizio di una riga sullo stato del villaggio e il riepilogo dei gruppi. Si porta avanti: `figlio_in_citta` (a I.3), la divisione fatta o rimandata (a Stolypin, I.4-e5).

**Dati da riscontrare prima di scrivere i testi:** ridistribuzioni periodiche delle strisce nel mir; poteri dello starosta; responsabilità collettiva dei pagamenti; la scissione del 1903 non c'entra (sta in I.3).

**Il codice.** Il motore `turn_game` richiede oggi almeno due posti con pedine. Per il mir serve una modalità **senza posti**, in cui il turno è la sola carta con le sue risposte (`event`). Parte generica in `src/` con test: `turn_game` senza `places`, con `groups` come metriche. Contenuto in `games/laika/source/`. Il disegno dell'assemblea usa figure già nel catalogo; non servono disegni nuovi.

---

## I.3 — In città (fine Ottocento–1904): il salario

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

## Domande aperte per il docente

1. **Il mir:** il giocatore è lo starosta (da riscontrare) o il capofamiglia più ascoltato?
2. **Il razzo e la corte:** restano episodi narrativi dopo il salario (come oggi) o diventano «notizie» del gioco? La seconda scelta li lega a una sola data e li accorcia: la proposta è lasciarli come sono.
3. **Il disegno dell'angolo di stanza:** lo chiedo alla bottega (in attesa) o uso per ora la scena della città esistente?
4. **Il corso serale:** una scelta in più nei volantini è un premio accettabile o dà troppo peso a una sola mossa?

## Documenti da aggiornare dopo l'approvazione

REPERTORIO §5.1 (stato di I.2 e I.3), PIANO-LAIKA §4, INCARICHI-LAIKA (P4), CREARE-UN-GIOCO (`turn_game` senza posti; monete come pedine), FONTI-MATRICE (voci riscontrate), questo file (scelte del docente).
