# LAIKA — I giochi

Le forme di gioco del percorso e le regole comuni (repertorio del 22 ottobre 2026, approvato dal docente: D-011). Il gioco di ogni unità è nel [canone](CANONE.md); le schede di gioco sono in [giochi/](giochi/). La versione completa del 22 ottobre, con la tabella per atto e la sequenza dei costi, è in [archivio](../archivio/REPERTORIO-GIOCHI-LAIKA.md).

## 1. Perché un repertorio

La prima versione di I.1 (PR #7) è stata giudicata dal docente «tanto testo e poco gioco»: tre episodi da leggere, due confronti di fonti che funzionano come domande a scelta multipla, una sola allocazione con tre caselle numeriche. La meccanica non era integrata con la scena né con il resto dell'unità.

Il repertorio fissa poche forme di gioco vere, riusabili in tutti gli atti. Un gioco è vero quando:

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
- **Nessuna scelta consiste nello sparare, reprimere o denunciare** ([PERCORSO](PERCORSO.md) §1). Le persone possono sparire per decisioni del sistema, mai dello studente.
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
- **In LAIKA:** il credito del trono (Atti IV e V), il culto di Lenin e di Stalin, il prestigio del simbolo nell'Atto VIII.

### 3.5 Le code

- **Tensione:** chi aspetta, chi rinuncia, dove va il malcontento.
- **Logica:** ogni gruppo in coda ha una pazienza che scende; prima di andarsene manda segnali visibili a soglie fisse; il gelo e le voci accelerano la discesa; chi lascia la coda porta il malcontento altrove (in fabbrica, nel corteo). Il giocatore vede la crisi arrivare e ha il tempo di intervenire.
- **Modelli:** Theme Hospital ([CorsixTH](https://github.com/CorsixTH/CorsixTH), file letti con licenza MIT: `CorsixTH/Lua/queue.lua`, `CorsixTH/Lua/entities/humanoids/patient.lua`); SimTower ([tower-together](https://github.com/phulin/tower-together), TypeScript, MIT).
- **Scheda di lettura (CorsixTH):** conto alla rovescia dell'attesa che scende di uno al giorno; segnali a 30, 20 e 10 giorni dalla fine (guarda l'orologio, sbadiglia, batte il piede); a zero se ne va; in più la contentezza cala ogni giorno per l'ambiente e, quando la salute peggiora, c'è una piccola probabilità di andarsene prima. Contratto dati proposto per il kit: `{ "attesa": 30, "segnali": [{ "a": 20, "posa": "…" }, { "a": 0, "effetto": "lascia_la_coda" }] }`.
- **In LAIKA:** il pane del 1917 (V.2), le razioni del 1919, il pane di Leningrado, i negozi vuoti del 1989. La coda davanti al carcere del 1937 resta un'immagine, non un gioco.

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
- **L'eredità** (dai giochi «legacy» e da Crusader Kings): lo stesso villaggio e la stessa famiglia attraversano tutti gli atti; ciò che accade in un atto lascia segni permanenti negli atti successivi.
- **Il treno** (da Transarctica, [Transarctica-2](https://github.com/SembeiNorimaki/Transarctica-2)): vagoni, carbone e scelte di rotta; candidato per i treni di agitazione della guerra civile, da riscontrare sulle fonti.

**Scartate dal docente il 22 ottobre 2026:** le voci interiori e l'armadio dei pensieri (da Disco Elysium); l'assemblea a carte argomento, la piazza, il piano su griglia e la linea del tempo come giochi a sé; le card come gioco (restano come modo di raccontare).

## 4. Le card del racconto

Le card non sono un gioco: sono il modo di raccontare tra un gioco e l'altro, come nei prologhi del gioco del feudo. Un'illustrazione grande, una data, una o due frasi, «Avanti». Si usano nel prologo dell'unità, nelle notizie dall'alto tra un turno e l'altro e nelle letture di documenti (il Manifesto). Mai dentro la gestione o le decisioni.

## 5. Il gioco di ogni unità

Il gioco di ogni unità e il suo stato stanno nel [canone](CANONE.md), non qui. Le schede di una pagina dei giochi già decisi sono in [giochi/](giochi/): [servitu](giochi/servitu.md) (I.1), [mir](giochi/mir.md) (I.2), [salario](giochi/salario.md) (I.3), [soviet](giochi/soviet.md) (IV.2). Regola del 29 ottobre 2026: una scheda di una pagina per ogni gioco, approvata dal docente prima della costruzione (D-017). Dal 4 novembre 2026 la scheda ha una sezione «Elementi del kit» che riprende la riga dell'unità in [PIANO-KIT](PIANO-KIT.md): che cosa c'è, che cosa si compone e che cosa manca nel motore e nella bottega.

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
