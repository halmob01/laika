# Gioco di I.2 — Il mir (`mir`)

Scheda di gioco dell'unità `mir` (canone: I.2). Versione 1 · 30 ottobre 2026 · approvata dal docente il 3 novembre 2026 (D-019) · costruita lo stesso giorno come partita di sole decisioni. Scostamenti: il giocatore è il capofamiglia; i dati [da riscontrare] non compaiono come fatti. Regole comuni: [GIOCHI](../GIOCHI.md) §2 e §3.2.

Tutti i numeri sono indici della simulazione, non statistiche storiche. I fatti non ancora riscontrati sono segnati **[da riscontrare]** e non entrano nel testo per lo studente come dati.

## La scheda

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

**Esito.** Nessuna vittoria o sconfitta. Un giudizio di una riga sullo stato del villaggio e il riepilogo dei gruppi. Si porta avanti: `figlio_in_citta` (a I.3), la divisione fatta o rimandata (a Stolypin, II.4-e1).

**Dati da riscontrare prima di scrivere i testi:** ridistribuzioni periodiche delle strisce nel mir; poteri dello starosta; responsabilità collettiva dei pagamenti; la scissione del 1903 non c'entra (sta in I.3).

**Il codice.** Il motore `turn_game` richiede oggi almeno due posti con pedine. Per il mir serve una modalità **senza posti**, in cui il turno è la sola carta con le sue risposte (`event`). Parte generica in `src/` con test: `turn_game` senza `places`, con `groups` come metriche. Contenuto in `games/laika/source/`. Il disegno dell'assemblea usa figure già nel catalogo; non servono disegni nuovi.

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

