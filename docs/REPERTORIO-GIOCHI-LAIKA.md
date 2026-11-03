# LAIKA — Repertorio dei giochi

Versione 1 · 22 ottobre 2026 · documento di lavoro, da correggere con il docente.

Parte del [piano operativo](PIANO-LAIKA.md). Sostituisce, per le meccaniche, la decisione aperta n. 1 di [PIANO-ATTI](PIANO-ATTI-LAIKA.md) §10 e il §6 di [archivio/PROGETTO](archivio/PROGETTO.md). Le schede degli episodi restano in PIANO-ATTI: questo documento dice **con quale gioco** si vive ciascuna unità.

## 1. Perché un repertorio

La prima versione di I.1 (PR #7) è stata giudicata dal docente «tanto testo e poco gioco»: tre episodi da leggere, due confronti di fonti che funzionano come domande a scelta multipla, una sola allocazione con tre caselle numeriche. La meccanica non era integrata con la scena né con il resto dell'unità.

Il repertorio fissa poche forme di gioco vere, riusabili in tutti e sette gli atti. Un gioco è vero quando:

- si agisce sulla scena, non su un modulo;
- ogni mossa toglie qualcosa a un'altra;
- c'è un rischio che il giocatore non controlla;
- l'effetto si vede subito sulla scena e torna più avanti;
- si può andare male, senza che la partita si chiuda.

I contenuti non diminuiscono: si spostano dentro il gioco. Le anime, le feste, le utopie e il Manifesto di I.1 diventano notizie dall'alto, persone che chiedono qualcosa e regole che cambiano.

Il confronto tra idee e prospettive sta **dentro le regole**: le metriche sono gruppi sociali o idee in tensione, e la stessa scelta accontenta uno e scontenta un altro. Le letture degli storici restano sullo sfondo e guidano chi scrive le regole.

## 2. Regole comuni a tutti i giochi

- **Niente trascinamento**, né su telefono né su desktop. Si fa «tocca la pedina, poi tocca il posto». Funziona con il dito, con il mouse e da tastiera.
- **Una grammatica sola**: stessa barra degli indicatori, stessi avvisi del turno successivo, stesso modo di piazzare, stesso diario. Un gioco nuovo si impara in un minuto.
- **Partite piccole**: al massimo quattro o cinque metriche visibili, sei pedine, otto o dieci turni, venti minuti per unità.
- **Nessuna scelta consiste nello sparare, reprimere o denunciare** (PIANO-ATTI §1). Le persone possono sparire per decisioni del sistema, mai dello studente.
- **Le metriche sono indici della simulazione**, non statistiche storiche, e nessuna posizione politica vale punti.
- **Il rischio si vede**: quando una scelta dipende dalla sorte, la probabilità è scritta prima di scegliere.

## 3. Le meccaniche

Per ogni meccanica: la tensione che porta, la logica, i modelli da cui viene. I modelli open source si leggono per capire le regole e i loro numeri, poi la regola si **riscrive da zero** nel kit: il codice non si traduce riga per riga, soprattutto se la licenza è GPL o AGPL, e nessun asset o testo dei giochi originali entra in LAIKA (§6).

### 3.1 La gestione

- **Tensione:** bisogno contro obbligo, oggi contro domani.
- **Logica:** risorse scarse da dividere sulla mappa in più giri; dopo la mossa arriva un imprevisto (il tempo, un prezzo, un ordine dall'alto); il risultato si vede sulla scena; un avviso annuncia il giro successivo. Le regole cambiano per decisioni prese altrove.
- **Modelli:** il gioco del feudo del docente (16 turni, due ordini per turno, evento con scelte, avviso del turno dopo); Stronghold (razioni e tasse che muovono la popolarità; [Stone Kingdoms](https://gitlab.com/stone-kingdoms/stone-kingdoms), [Sourcehold](https://github.com/sourcehold/Sourcehold)).
- **Punti di vista:** lo stesso anno si può rigiocare dall'altro posto (il servo, poi l'amministratore che deve consegnare la quota).

### 3.2 Le decisioni sui gruppi

- **Tensione:** chi accontenti e chi scontenti.
- **Logica:** una persona si presenta con una richiesta; due o tre risposte; ogni risposta sposta tre o quattro metriche, ciascuna un gruppo sociale con i suoi bisogni e il suo malcontento. Una metrica troppo alta o troppo bassa apre una crisi.
- **Modelli:** Victoria II, che simula la società per gruppi con bisogni, coscienza e malcontento e include l'abolizione della servitù ([OpenVic](https://github.com/OpenVicProject/OpenVic), MIT); Reigns (una carta, due scelte, quattro metriche: la forma più adatta al telefono).
- **Il posto cambia, il gioco no:** lo starosta del villaggio (da riscontrare sulle fonti), il delegato del soviet, il direttore di fabbrica, il funzionario.

### 3.3 Il sentimento che cresce

Non è un gioco a sé ma un indicatore che si aggiunge agli altri.

- **Logica:** piccoli gesti fanno salire una percentuale; oltre una soglia diventa possibile qualcosa che prima non lo era.
- **Modello:** Colonization, le «campane della libertà» ([cc94](https://github.com/institution/cc94), [FreeCol](https://sourceforge.net/projects/freecol/)).
- **In LAIKA:** la Speranza (*volja*) di I.1, alimentata dalle lettere d'oro e dai racconti su Belovod'e; poi il 1905 e il febbraio 1917.

### 3.4 La credenza come risorsa

Anche questo è un indicatore.

- **Logica:** il potere dipende da quanto la gente ci crede.
- **Modello:** Black & White ([openblack](https://github.com/openblack/openblack)).
- **In LAIKA:** il credito del trono (I.4–I.6), il culto di Lenin e di Stalin, il prestigio del simbolo nell'Atto VI.

### 3.5 Le code

- **Tensione:** chi aspetta, chi rinuncia, dove va il malcontento.
- **Logica:** ogni gruppo in coda ha una pazienza che scende; prima di andarsene manda segnali visibili a soglie fisse; il gelo e le voci accelerano la discesa; chi lascia la coda porta il malcontento altrove (in fabbrica, nel corteo). Il giocatore vede la crisi arrivare e ha il tempo di intervenire.
- **Modelli:** Theme Hospital ([CorsixTH](https://github.com/CorsixTH/CorsixTH), file letti con licenza MIT: `CorsixTH/Lua/queue.lua`, `CorsixTH/Lua/entities/humanoids/patient.lua`); SimTower ([tower-together](https://github.com/phulin/tower-together), TypeScript, MIT).
- **Scheda di lettura (CorsixTH):** conto alla rovescia dell'attesa che scende di uno al giorno; segnali a 30, 20 e 10 giorni dalla fine (guarda l'orologio, sbadiglia, batte il piede); a zero se ne va; in più la contentezza cala ogni giorno per l'ambiente e, quando la salute peggiora, c'è una piccola probabilità di andarsene prima. Contratto dati proposto per il kit: `{ "attesa": 30, "segnali": [{ "a": 20, "posa": "…" }, { "a": 0, "effetto": "lascia_la_coda" }] }`.
- **In LAIKA:** il pane del 1917 (I.6), le razioni del 1919, il pane di Leningrado, i negozi vuoti del 1989. La coda davanti al carcere del 1937 resta un'immagine, non un gioco.

### 3.6 Le merci che camminano

Non è un gioco a sé: è il modo di rendere visibili la gestione e l'economia sulla mappa.

- **Logica:** la catena (grano, mulino, forno, mercato; grano, treni, città, fronte) è fatta di figure che portano le merci, e si vede dove si inceppa.
- **Modelli:** Caesar III ([Julius](https://github.com/bvschaik/julius), [Augustus](https://github.com/Keriew/augustus)), The Settlers ([Return To The Roots](https://github.com/Return-To-The-Roots/s25client)), [OpenTTD](https://github.com/OpenTTD/OpenTTD).

### 3.7 Quanto serve e quanto c'è

- **Tensione:** il sogno contro i numeri, il piano contro la realtà.
- **Logica:** l'obiettivo sulla carta e la produzione reale sono due numeri distinti; ogni decisione risolve un problema e ne apre un altro; si possono aggiustare i numeri del rapporto, e la distanza tra carta e realtà cresce. Catena di quattro o cinque anelli al massimo.
- **Modelli:** [OpenRA](https://github.com/OpenRA/OpenRA) e [Nanolathe](https://github.com/nanolathe-gg/nanolathe) (economia tra risorse richieste e disponibili; del gioco di guerra si prende solo l'economia).

### 3.8 La giornata a punti azione

- **Tensione:** decidere senza sapere tutto.
- **Logica:** cinque azioni al giorno; alcune informazioni si scoprono solo spendendo un'azione per indagare; le notizie arrivano a pezzi e spesso si sceglie prima di sapere tutto. Le informazioni arrivano da persone che le leggono in modi opposti (un menscevico e un bolscevico sulla stessa notizia).
- **Modello:** X-COM ([OpenXcom](https://github.com/OpenXcom/OpenXcom)); del gioco si prendono solo i punti azione e le informazioni incomplete, mai il combattimento.

### 3.9 La città che resiste

- **Tensione:** il singolo contro il bene comune.
- **Logica:** di giorno ognuno ha pochi punti azione e il magazzino è comune; si vede chi prende per sé e chi porta per tutti; la notte (il freddo, la fame) mette alla prova la città.
- **Modelli:** Hordes / Die2Nite ([Azimutant](https://github.com/Nadawoo/invazion)); Frostpunk (leggi che non si revocano, speranza e malcontento); This War of Mine (civili in una città assediata, giorno e notte, senza eroismo).

### 3.10 La fiducia

- **Tensione:** verità contro paura.
- **Logica:** cinque o sei persone collegate da fili di fiducia; ogni turno circola qualcosa (una voce, una barzelletta, una lettera); si decide che cosa dire, a chi e che cosa tacere. Più si parla, più legami e più esposizione; più si tace, più sicurezza e più solitudine. Le persone spariscono per decisioni del sistema: il filo si spezza e resta il posto vuoto a tavola.
- **Nota:** il gioco più delicato; si scrive con Opus e con revisione del docente.

### 3.11 La corsa

- **Tensione:** il simbolo contro la vita.
- **Logica:** budget per stagione; componenti da collaudare per renderli affidabili; si sceglie se lanciare ora per il prestigio o aspettare; il prestigio si accumula e il costo umano si registra a parte.
- **Modello:** Buzz Aldrin's Race into Space ([Race into Space](https://github.com/raceintospace/raceintospace)), che è proprio la corsa allo spazio tra URSS e Stati Uniti.

### 3.12 Proposte ancora da valutare

- **La redazione** (da *The Republia Times*): scegliere quali notizie mettere in prima pagina e quanto spazio dare a ciascuna; metriche: lettori, fiducia del potere, verità.
- **Lo sportello** (da *Papers, Please*, senza denunce): un ufficio delle tessere o degli alloggi, regole che cambiano ogni giorno, persone con storie che non entrano nei moduli.
- **L'eredità** (dai giochi «legacy» e da Crusader Kings): lo stesso villaggio e la stessa famiglia attraversano i sette atti; ciò che accade in un atto lascia segni permanenti negli atti successivi.
- **Il treno** (da Transarctica, [Transarctica-2](https://github.com/SembeiNorimaki/Transarctica-2)): vagoni, carbone e scelte di rotta; candidato per i treni di agitazione della guerra civile, da riscontrare sulle fonti.

**Scartate dal docente il 22 ottobre 2026:** le voci interiori e l'armadio dei pensieri (da Disco Elysium); l'assemblea a carte argomento, la piazza, il piano su griglia e la linea del tempo come giochi a sé; le card come gioco (restano come modo di raccontare).

## 4. Le card del racconto

Le card non sono un gioco: sono il modo di raccontare tra un gioco e l'altro, come nei prologhi del gioco del feudo. Un'illustrazione grande, una data, una o due frasi, «Avanti». Si usano nel prologo dell'unità, nelle notizie dall'alto tra un turno e l'altro e nelle letture di documenti (il Manifesto). Mai dentro la gestione o le decisioni.

## 5. Uso nei sette atti

| Atto | Giochi principali | Indicatori aggiunti |
|---|---|---|
| I (1700–marzo 1917) | I.1 gestione (la settimana del servo) con decisioni sui gruppi; I.2 decisioni sui gruppi (il mir); I.3 gestione (il salario, più settimane); I.4 punti azione (le giornate del soviet); I.5 quanto serve e quanto c'è (grano, treni, città), prime code; I.6 code che diventano corteo, poi punti azione (il soldato che non spara) | Speranza (3.3); credito del trono (3.4) |
| II (marzo–luglio 1917) | decisioni sui gruppi (governo provvisorio e soviet davanti a operai, soldati, contadini, ceti medi); punti azione (le giornate di luglio) | — |
| III (luglio 1917–marzo 1918) | punti azione con informazioni incomplete (Kornilov, la notte del palazzo); gestione (le occupazioni delle terre) | — |
| IV (1918–1927) | quanto serve e quanto c'è (comunismo di guerra e NEP); città che resiste (Pietrogrado); fiducia (il bambino di strada nella banda); il treno, se confermato | credenza (il culto di Lenin) |
| V (1928–1945) | quanto serve e quanto c'è (il piano quinquennale); decisioni sui gruppi (il kolchoz); fiducia (le purghe); città che resiste (Leningrado) | credenza (il culto di Stalin) |
| VI (1945–1964) | la corsa (Sputnik, Laika, Gagarin); fiducia (il dopoguerra) | credenza (il prestigio) |
| VII (1964–1991) | quanto serve e quanto c'è (l'economia parallela, il *blat*); code (1989); fiducia (il samizdat); punti azione (Černobyl', agosto 1991); decisioni sui gruppi (le repubbliche) | — |

### 5.1 Il gioco di ogni unità

Questa tabella è il riferimento unico per il gioco di un'unità: **prevale sul tipo di episodio scritto nelle schede di PIANO-ATTI** (che dicono i contenuti). Colonna «Stato»: *approvato* = scritto per l'unità nella tabella §5 o deciso dal docente; *da confermare* = la tabella §5 lo indica per l'atto e qui è attribuito all'unità che tratta quell'argomento (attribuzione del 23 ottobre 2026, da approvare); *da assegnare* = il repertorio non dice nulla per quell'unità.

| Unità | Periodo | Gioco | Stato |
|---|---|---|---|
| I.1 Anime e semidei | 1700–1861 | gestione (la settimana del servo) con decisioni sui gruppi | approvato; in `main` (#13), da provare dal telefono |
| I.2 La terra dopo il Manifesto | 1861–1904 | decisioni sui gruppi (l'assemblea del mir) | approvato il 29 ottobre 2026 (I.2 spezzata in due: la terra e il villaggio). In `main` c'è una **bozza non conforme**: il mir è una scelta semplice. Da rifare |
| I.3 In città | fine Ottocento–1904 | gestione (il salario, più settimane) | approvato il 29 ottobre 2026. Raccoglie «In città», il salario, il razzo del condannato, la corte e i tre volantini. In `main` c'è una **bozza non conforme**: salario come distribuzione unica. Da rifare |
| I.4 Il 1905 | 1905–1907 | punti azione (le giornate del soviet) | approvato (prima si chiamava I.3) |
| I.5 Pane e guerra | 1914–1916 | quanto serve e quanto c'è (grano, treni, città), prime code | approvato (prima I.4) |
| I.6 Otto giorni | marzo 1917 | code che diventano corteo, poi punti azione (il soldato che non spara) | approvato (prima I.5) |
| II.1 Il paese più libero del mondo | marzo–aprile 1917 | — | da assegnare |
| II.2 Due poteri in un palazzo | marzo–maggio 1917 | decisioni sui gruppi (governo provvisorio e soviet davanti a operai, soldati, contadini, ceti medi) | da confermare |
| II.3 Ogni angolo di strada una tribuna | marzo–giugno 1917 | — | da assegnare |
| II.4 Pane, pace, terra | aprile–giugno 1917 | — | da assegnare |
| II.5 Le giornate di luglio | luglio 1917 | punti azione | da confermare |
| III.1 La terra e i palazzi | luglio–settembre 1917 | gestione (le occupazioni delle terre) | da confermare |
| III.2 Kornilov e la svolta | agosto–ottobre 1917 | punti azione con informazioni incomplete | da confermare |
| III.3 La notte del palazzo | 6–8 novembre 1917 | punti azione con informazioni incomplete | da confermare |
| III.4 Le promesse decretate | novembre–dicembre 1917 | — | da assegnare |
| III.5 Il primo prezzo | dicembre 1917–marzo 1918 | — | da assegnare |
| IV.1 Il prezzo della sopravvivenza | 1918–1920 | quanto serve e quanto c'è (comunismo di guerra); città che resiste (Pietrogrado) | da confermare |
| IV.2 Kronštadt e la svolta | 1921 | quanto serve e quanto c'è (NEP) | da confermare |
| IV.3 L'assalto al cielo | 1918–1927 | — | da assegnare |
| IV.4 La vita nuova e i bambini di strada | 1921–1927 | fiducia (il bambino di strada nella banda) | da confermare |
| IV.5 Dopo Lenin | 1922–1927 | — (indicatore: credenza, il culto di Lenin) | da assegnare |
| V.1 La grande svolta | 1928–1933 | decisioni sui gruppi (il kolchoz) | da confermare |
| V.2 Costruire il socialismo | 1928–1937 | quanto serve e quanto c'è (il piano quinquennale) | da confermare |
| V.3 La paura | 1934–1938 | fiducia (le purghe) | da confermare |
| V.4 La guerra | 1939–1945 | città che resiste (Leningrado) | da confermare |
| V.5 Il prezzo e il mito | 1945 | solo confronto di fine atto | — |
| VI.1 Dopo la vittoria | 1945–1953 | fiducia (il dopoguerra) | da confermare |
| VI.2 Il disgelo | 1953–1957 | — | da assegnare |
| VI.3 Il bip | 1957 | la corsa (Sputnik, Laika) | da confermare |
| VI.4 «Pojechali!» | 1961–1963 | la corsa (Gagarin) | da confermare |
| VI.5 La guerra dei simboli | 1959–1964 | — (indicatore: credenza, il prestigio) | da assegnare |
| VII.1 Tutto era per sempre | 1964–1982 | quanto serve e quanto c'è (economia parallela, *blat*); fiducia (il samizdat) | da confermare |
| VII.2 Afghanistan e Černobyl' | 1979–1986 | punti azione (Černobyl') | da confermare |
| VII.3 Perestrojka e glasnost | 1985–1990 | code (1989); decisioni sui gruppi (le repubbliche) | da confermare |
| VII.4 La fine | 1991 | punti azione (agosto 1991) | da confermare |

### I.1 nella nuova forma

Una partita di otto-dieci anni dal 1740 al 1861. Ogni anno:

1. **Dall'alto:** una o due card della corte (il dono di Caterina a Zorič; le feste) che cambiano una regola quaggiù (nuovo padrone, più giorni di corvée).
2. **La settimana:** sei giorni da piazzare sulla mappa del villaggio (campo della famiglia, campi del signore, bosco, isba); poi la card del tempo; poi il controllo dell'amministratore.
3. **Chi bussa:** una persona con una scelta (il pellegrino di Belovod'e, l'amministratore, il prete, il vicino con la lettera d'oro, il figlio che vuole partire).
4. **La stagione:** raccolto e inverno; sulla scena i sacchi accanto alla stufa o la stufa vuota; l'avviso dell'anno dopo.

**Gestione (decisione del docente del 23 ottobre 2026, «facciamola diventare una gestione vera»).** Le pedine non sono più giorni ma persone: il padre (●●●), la madre (●●), il nonno (●) e il figlio, che cresce (● nel 1740, ●●● dal 1787) e può partire. Si tocca una persona e poi il posto; la figura sulla scena si sposta lì. Oltre al campo, alla corvée e ai vicini ci sono quattro lavori lunghi che restano: l'orto (rendita fissa che il gelo non tocca), la stalla rifatta, un campo nel bosco e la sokha con le punte di ferro (che si comprano alla fiera). Prima di ogni anno si decide quanto grano tenere per la semina: si mangia prima del raccolto, quindi troppo seme porta alla fame e poco seme a un campo che rende poco. Tre anni (1761, 1787, 1820) hanno la fiera d'autunno, dove si paga in grano. L'esito spiega voce per voce da dove viene ogni variazione. Bilanciamento provato in `tests/laika-i1.test.js` su cinque strategie: obbedire tiene in vita ma non arricchisce; saltare poco rende poco e alza l'occhio; saltare molto porta qualcuno in Siberia; aiutare i vicini costa grano e crea legami; costruire costa fame subito e alla fine rende di più. Tutti i numeri sono simulazione.

**Generazioni (decisione del docente del 25 ottobre 2026, scelta A).** Dal 1740 al 1861 passano cinque generazioni: i quattro posti della casa (padre, madre, nonno, figlio) restano, le persone cambiano. Nel 1761, 1787, 1820, 1840 e 1861 una card racconta il passaggio con i nomi (Foma, Ivan, Pëtr, Stepan, Grigorij, Mikita, Vasilij, Fëdor; famiglia inventata [S]) e la forza del figlio riparte da quella di un ragazzo. Se il figlio o il padre sono stati mandati via, la card ha una variante. Lo studente vede che servi si nasce.

Metriche: Grano, Occhio del padrone, Speranza, Legami nel villaggio. Nel 1861 il Manifesto si legge in card; l'ultimo anno si gioca con la rata al posto della corvée. Chiusura: «Cosa ti devi ricordare» e la verifica V1. Fonti: le stesse della matrice (I1-01…I1-21).

## 6. Come si usano i modelli open source

Per ogni meccanica si scrive una **scheda di lettura** in `docs/meccaniche/` prima di costruirla:

```text
Meccanica:
Gioco e progetto letto, URL, licenza, file e funzioni lette, data:
La regola in parole semplici:
I parametri che si possono cambiare:
Che cosa rende il gioco interessante (il trucco di design):
Uso in LAIKA e atti:
Contratto dati proposto per il kit:
Che cosa non si prende (combattimento, asset, testi, nomi):
```

Regole: si legge per capire, si riscrive da zero; nessun asset, nome o testo dei giochi originali entra nel gioco per lo studente; i numeri dei giochi originali non sono storia e restano indici della simulazione. Schede da scrivere: CorsixTH (fatta, §3.5), OpenVic, OpenXcom, Colonization, Caesar III.

## 7. Costi e sequenza

La scelta che abbassa il costo è **un solo motore a turni** in cui ogni gioco è una fase che si innesta: gestione, punti azione, città che resiste, code e sportello condividono turno, metriche, avvisi, diario e salvataggio. Il primo gioco costa molto, i successivi molto meno.

| Passo | Peso | Contenuto |
|---|---|---|
| 1. Redesign del player | medio | Impaginazione LAIKA coerente con la home (BRAND-DESIGN §5ter), card del racconto, menu dei giochi dimostrativi nascosto; da fare per primo perché i giochi nuovi hanno bisogno della nuova impaginazione |
| 2. Prototipo della settimana | piccolo | tre anni della settimana del servo in una pagina da buttare, per capire se diverte, prima di toccare il motore |
| 3. Motore a turni con gestione e decisioni | grande | fasi del turno, piazzamento «tocca e tocca», metriche-gruppi, avvisi, salvataggio a metà turno compatibile con i salvataggi esistenti, nuove pose e pedine nella bottega, test |
| 4. I.1 ricostruita | medio | testi, regole e bilanciamento (nessuna strategia vince sempre, nessun vicolo cieco), verifica V1 |
| 5. Punti azione e code | medio ciascuno | per I.4 e I.6, riusano il turno |
| 6. Altre forme | medio-piccolo ciascuna | fiducia, città che resiste, corsa, redazione e sportello quando l'atto le chiede |

Ogni passo è una PR con evidenze; il docente prova dal telefono prima del passo successivo.
