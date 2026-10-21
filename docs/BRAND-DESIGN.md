# LAIKA — Brand design e prototipo homepage

**Stato:** direzione creativa condivisa; **prototipo visivo non definitivo**, 19 ottobre 2026.  
**Repository tecnica:** `halmob01/riv-russa` (il nome del repository non cambia).  
**Prototipo:** [`prototypes/laika-home/index.html`](../prototypes/laika-home/index.html).  
**Riferimenti illustrativi:** [`references/laika/README.md`](../references/laika/README.md).

## 1. Identità

**Nome pubblico: LAIKA** (non più RIV-RUSSA nei nuovi materiali visivi).

**Denominazione estesa approvata** (riprodurre esattamente quando compare):
> Direzione Centrale per la Pianificazione, l'Attuazione e la Rettifica dei Processi Rivoluzionari.

Tono: istituzione sovietica fittizia, burocratica, ufficiale, grigia e involontariamente ironica. La serietà del linguaggio amministrativo contrasta con l'impossibilità di pianificare e rettificare gli eventi storici. Evitare umorismo infantile, slogan pubblicitari ed enfasi generica. Le denominazioni fittizie devono rimanere riconoscibili come dispositivo narrativo, non fonti storiche.

### Registro editoriale
- Homepage: **manifesto costruttivista trasformato in sistema di navigazione web**.
- Esperienza dei livelli: **cronache illustrate essenziali**, scene narrate e interattive con fonti e scelte.
- Interfaccia operativa: fascicoli, protocolli, numeri, timbri e moduli; sempre leggibile e accessibile.
- La grafica propagandistica costituisce un linguaggio formale, non un'adesione politica e non sostituisce la contestualizzazione storica.

## 2. Font e marchio

- **Propaganda di Otto Lerma**: display/wordmark, titoli monumentali e numeri principali. **Aggiornamento 20 ottobre 2026:** l'utente ne ha autorizzato l'uso e ha fornito il file; la home usa un sottoinsieme latino in `site/laika/fonts/propaganda.woff2`, con la licenza dell'autore accanto (`LICENZA-propaganda.txt`). Il carattere non disegna gli accenti (È, À, Ò hanno lo stesso glifo della lettera semplice): nei titoli il segno si aggiunge con la classe `grave`, il testo resta corretto per lettori di schermo e copia.
- Nel prototipo il wordmark `LAIKA` è riprodotto con contorni vettoriali SVG derivati dal carattere fornito per la valutazione del concept. **Verificare i diritti di incorporamento/pubblicazione e ridistribuzione dei contorni prima di usare questa soluzione in un sito pubblico definitivo**. Licenza presente nell'archivio dell'autore: *Free for Personal Use*; uso commerciale su autorizzazione. L'uso scolastico non implica automaticamente il diritto a redistribuire il font.
- Testi, navigazione, didattica: il piano recente sceglie `Roboto Condensed` locale; nei prototipi è soltanto dichiarato con fallback, non caricato. IBM Plex Sans Condensed era una candidata precedente, non una famiglia aggiuntiva autorizzata. File e licenza restano da acquisire; vedere [ASSET-MANIFEST](ASSET-MANIFEST.md).
- Dati, date, etichette archivistiche: monospace.
- **Separazione tassativa:** font, contorni del marchio, palette e illustrazioni di LAIKA appartengono al **tema del progetto**, mai a `src/core`, `src/shell` o alle demo generiche del kit. Un nuovo gioco non deve ereditare l'identità LAIKA.

## 3. Palette del prototipo (token CSS effettivi)

| Token | HEX | Uso |
|---|---|---|
| `--paper` | `#f3ebdb` | carta avorio / fondo |
| `--paper2` | `#e9e0cf` | blocchi chiari |
| `--red` | `#cc2a25` | rosso manifesto, selezioni, masse |
| `--ink` | `#1c1c1b` | figure piene, testo, struttura |
| `--blue` | `#93abb7` | edifici, paesaggio urbano |
| `--mute` | `#59564f` | testi secondari |
| `--line` | `#bdb6a7` | separazioni |

**Aggiornamento 20 ottobre 2026 (home cemento).** Su richiesta dell'utente la home passa a una variante grigia, editoriale e di mood brutalista: carta `#e6e5e1`, cielo `#d4d6d4`, lastre `#26292a`, cemento `#8f9594`, inchiostro `#1b1c1c`, rosso `#c22a22` solo come segnale (data attiva, filetto, timbri, una figura per scena). Il brutalismo è un riferimento della pagina, non delle scene storiche: nelle scene 1861-1917 si usano solo luoghi d'epoca. Le illustrazioni seguono la regola «figure minuscole in scene grandiose».

Questi sono i colori della **versione di prova**, non una palette immutabile. Gli accenti bordeaux e cosmisti possono essere studiati in seguito, mantenendo una gerarchia controllata.

## 4. Illustrazioni: vincoli condivisi

**Per il sito e il gioco: soltanto illustrazioni programmatiche SVG / CSS / Canvas se necessario; niente fotografie, immagini stock o raster inseriti nelle scene.**

- **Gli omini sono SEMPRE sagome piene**, non scheletri, tratti filiformi, outline vuoti o stickman lineari. Ridurre ogni figura a testa piena, tronco pieno e arti pieni, senza dettagli anatomici.
- Estetica volutamente **grezza, popolare, quasi stampata**. Massimo effetto narrativo con pochissimi elementi.
- Architetture azzurrine a masse piatte, cielo carta chiara, elementi significativi rossi, figure nere o rosse.
- Pochi dettagli, niente texture fotografiche o rendering 3D. Evitare di trasformare ogni scena in un manifesto pieno di decorazioni.
- Le **folle** sono insiemi di silhouette piene, animate per gruppi e articolate mediante pose riutilizzabili.
- Gli elementi SVG hanno ID semantici e livelli separati (folla, edifici, bandiere, mezzi, ecc.), così le animazioni possono mostrare cause e conseguenze.
- Le cinque immagini caricate il 19 ottobre contengono **quattro illustrazioni distinte** (una era duplicata identica), disponibili in `references/laika/` come **copie WebP ottimizzate per consultazione** (gli originali JPEG rimangono tra gli allegati della conversazione), esclusivamente **riferimenti visivi**, non da caricare nel sito finale. Sono riferimenti di stile e composizione, non assets SVG definitivi né fonti storiche validate.

## 5. Homepage di produzione (21 ottobre 2026)

Approvata dall'utente in tre revisioni (PR #19). Regole da conservare nelle modifiche future.

**Due registri insieme.** Illustrazioni grigie, brutaliste nel mood, disegnate a mano: figure minuscole in luoghi grandiosi d'epoca. Impaginazione costruttivista-editoriale, da prodotto d'avanguardia di oggi: riferimenti Rodčenko, copertine di «Наши достижения», scatole di fiammiferi, l'«Izvestija» del 1917. Le illustrazioni non si cambiano per adattarle all'impaginazione.

**Hero.**
1. Occhiello d'edizione in monospazio: «Edizione didattica · N. 1 · 1861–1917».
2. Titolo «Come cambia un mondo?» in Propaganda su tre fasce sfalsate verso destra: nera piena, solo contorno, rossa piena.
3. Piano rosso in diagonale (dal 50% in alto al 67% in basso) con sommario, CTA nera e stato della pratica in carta su rosso.
4. Denominazione esatta in verticale, dal basso verso l'alto, lungo il bordo destro, come la colonna di testata di una rivista.
5. Su telefono il piano rosso diventa un blocco tagliato in diagonale sotto il titolo e la denominazione torna orizzontale.

**Scena.**
- Cielo coperto, più scuro in alto. Il disco rosso sta dietro i disegni e cambia posto a ogni data; il fumo può passargli davanti.
- La data gigante è in grigio chiaro dietro il disco.
- Poche linee di costruzione rosse sottili.

**Linea del tempo.** Lastra scura che fa da suolo; la data attiva è un blocco rosso pieno fino al bordo.

**Sezioni.**
- La circolare usa fasce alternate (chiara, poi rossa) su una parete di pannelli prefabbricati con i giunti visibili.
- I numeri dei fascicoli stanno su blocchi tagliati in diagonale: rossi se aperti, cemento se chiusi.
- Gli articoli del regolamento hanno un quadrato rosso.

**Rosso.** È un piano e un segnale, mai una sfumatura. In una scena c'è una sola figura rossa (protagonista). Nel 1905 niente bandiere rosse: il corteo di Gapon portava icone e ritratti dello zar.

**Tono.** Ironia burocratica solo in etichette, titoli e claim («Il piano è stato approvato. La storia non è stata informata.»). I testi di lettura sono divulgativi e piani.

**Dove sta.** `index.html`, `site/laika/home.css` (variabili in `:root` e per epoca in `.hero[data-epoca]`), `site/laika/home.js`, `site/laika/scene/`, tema `laika-grigio` in `bottega/temi.json`.

## 5bis. Homepage: prototipo iniziale (storico)

1. **Testata** con marchio LAIKA e navigazione.
2. **Hero a due colonne**: titolo-manifesto, sottotitolo burocratico esatto, CTA, scena SVG animata.
3. **Selettore scenari 1861 / 1905 / 1917**: cambia lo stato visivo dell'illustrazione; non implica che i fatti si siano svolti nella stessa forma.
4. **Fascia manifesto** con sintesi degli snodi.
5. **Fascicoli**: anteprime interattive degli atti, illustrati con SVG originali.
6. **Procedura**: spiegazione dell'esperienza didattica con tono da comunicato amministrativo.
7. **Pausa movimento**, `prefers-reduced-motion`, attenzione a desktop e telefono.

Le interazioni del prototipo sono dimostrazioni di branding: **non** sostituiscono il gioco né costituiscono il pacchetto storico definitivo. Il riferimento per i capitoli resta [`docs/PROGETTO.md`](archivio/PROGETTO.md).

## 6. Motion design

- Le animazioni devono **mostrare fenomeni**: folle che crescono o cambiano orientamento, una costruzione che avanza, la diffusione di una decisione, il passaggio di potere, un treno, una bandiera che segnala un attore.
- Animazioni di contesto e microinterazioni possibili ma misurate, senza bounce o effetti decorativi ripetitivi.
- Preferire sequenze causali collegate a eventi dichiarativi del kit; mantenere possibilità di pausa, replay, skip e riduzione del movimento.
- Non includere animazioni specificamente russe nel motore generico. Riferirsi a [`docs/MOTION.md`](MOTION.md) per il contratto tecnico.
- L'obiettivo non è riprodurre in codice i JPG dei riferimenti: servono **nuove scene semplificate**, coerenti con la storia di ciascun atto.

## 7. Stato e prossime decisioni

**Deciso:** LAIKA; sottotitolo; tono burocratico-sovietico; font Propaganda come riferimento display; grafica da manifesto per homepage; SVG programmatici e figure sempre piene, illustrazioni dei livelli più semplici e meno dettagliate dei riferimenti.

**Aperto:** rifinitura del wordmark / licenza di incorporamento; scala tipografica definitiva; palette finale; composizione dei livelli e scene da animare; accessibilità reale su telefono; eventuale pubblicazione della preview.

**Perimetro storico del prototipo, non divieto permanente:** P0 resta documentale; il piano successivo autorizza le modifiche di integrazione solo nella relativa fase. Durante il mandato iniziale non si doveva rimpiazzare `index.html` della demo del kit, modificare `src/`, importare queste immagini nei manifest di gioco o dichiarare pronto il percorso storico. La home è isolata intenzionalmente in `prototypes/laika-home/`.

## 8. Proposte di rifinitura editoriale — da valutare

**Stato: proposte NON approvate, 19 ottobre 2026.** Derivano da una lettura selettiva di [Awwwards Web Design](https://github.com/owenisas/awwwards-web-design), confrontata con il prototipo LAIKA. Non sostituiscono le scelte delle sezioni 1–7 e non autorizzano modifiche automatiche alla homepage.

**Perimetro:** queste proposte riguardano soltanto **impaginazione, tipografia, ritmo editoriale, interazioni di interfaccia e qualità tecnica**. **Il disegno delle illustrazioni, degli omini, delle folle, la composizione delle singole tavole e gli asset SVG sono un lavoro separato, qui intenzionalmente escluso.** Non aggiornare la sezione 4 né cambiare gli asset sulla base di questo audit.

### 8.1 Direzione da preservare

- **Direzione primaria: Kinetic Poster**, intesa come tipografia monumentale, asimmetria costruttivista, tagli compositivi e pochi segni molto forti, senza aggiungere effetti di tendenza.
- **Direzione di supporto: Editorial Catalogue / Archive Index**, limitata a indici, fascicoli, numerazioni, metadati, protocolli e navigazione.
- Il principio resta: **non un sito contemporaneo ispirato all'URSS, ma il sito di una fittizia istituzione burocratica sovietica**. Mantenere ironia amministrativa asciutta, palette attuale come riferimento e assenza di apparati decorativi gratuiti.
- Evitare 3D/WebGL, glassmorphism, gradienti vistosi, cursori personalizzati, parallax continuo e animazioni di testo ripetute per ogni sezione. Nessuna nuova libreria solo per ottenere un'estetica "Awwwards".

### 8.2 Hero e gerarchia

**Proposta — priorità alta.** Esplorare, in una variante separata, una composizione dell'hero **meno simmetrica** rispetto alle due colonne quasi equivalenti del prototipo. Conservare il marchio LAIKA, la denominazione estesa approvata e la scena attuale come elementi; intervenire soltanto su scala, allineamenti, proporzioni, pieni/vuoti e ritmo tipografico. Il primo sguardo deve avere una gerarchia inequivocabile, da manifesto, anziché due fuochi visivi concorrenti.

Studiare il comportamento dell'hero anche a 390 px e con zoom al 200%, senza considerare il layout mobile una semplice riduzione di quello desktop. Non aggiungere sezioni per compensare problemi di composizione.

### 8.3 Regia delle interazioni, senza ridisegnare le scene

**Proposta — priorità alta.** Rendere il selettore **1861 / 1905 / 1917** l'interazione caratterizzante della homepage: il passaggio tra stati deve avere un ordine di lettura, tempi e pause riconoscibili, non necessariamente una semplice dissolvenza. Definire una grammatica temporale comune (ingresso, trasformazione, assestamento), con **un solo momento animato dominante alla volta**. Il contenuto finale deve essere comprensibile anche saltando le animazioni.

**Non prescrivere nuove figure, nuovi disegni o nuove tavole.** Le eventuali coreografie sulle scene useranno gli asset approvati nel percorso illustrativo separato. La [PR #4](https://github.com/halmob01/riv-russa/pull/4) ha integrato le capacità di coreografia SVG; P0 ne verifica la presenza, mentre la review visiva delle scene di produzione resta nelle fasi successive: evitare di duplicare il suo lavoro o introdurre GSAP/Lenis per principio.

Valutare una singola **firma di interazione amministrativa** ricorrente (per esempio apertura di fascicolo, protocollazione o «rettifica» di uno stato), purché chiarisca un'azione reale. Non imitare continuamente timbri, carta o macchine da scrivere.

### 8.4 Tipografia e micro-gerarchie

**Proposta — priorità alta, intervento circoscritto.** Mantenere la tripartizione **Propaganda per marchio/display, sans condensata per lettura/interfaccia, monospace per dati e protocolli**. Raffinare scala dei titoli, interlinea, spaziatura e contrasto tra grandi titoli e apparati archivistici; evitare di affidare l'identità a molte micro-etichette.

Verificare il caricamento effettivo della sans condensata: nel prototipo è dichiarato `Roboto Condensed` ma non viene caricato esplicitamente, quindi il risultato varia con i font locali. Valutare la soluzione definitiva e le relative licenze prima della pubblicazione. Aumentare le scritte mobili da 8–9 px dove contengono informazioni o controlli; mantenere accessibili i dati secondari senza ingrandirli indiscriminatamente.

### 8.5 Ritmo editoriale e contenuti della homepage

**Proposta — priorità media.** Dare alle sezioni un ritmo più netto: **manifesto / indice asciutto / fascicolo-procedura**, alternando densità e vuoti. Conservare il tono istituzionale e non allungare la pagina con nuove spiegazioni o blocchi spettacolari.

Valutare se la sezione pubblica che spiega la «identità visiva» debba restare nel solo documento progettuale: nella homepage interrompe la finzione dell'archivio. Se serve una chiusura equivalente, sostituirla con un contenuto **interno al mondo narrativo** di LAIKA, non con una dichiarazione di design.

Rendere più chiaro il rapporto tra CTA primaria e secondaria: **una sola azione principale per schermata**; le azioni informative rimangono disponibili ma subordinate.

### 8.6 Rifinitura funzionale, accessibilità e prestazioni

**Proposta — priorità alta prima della pubblicazione.** Audit desktop/mobile e tastiera: focus visibile, etichette comprensibili, area di tocco adeguata, stato `aria-pressed`, zoom, contrasto e navigazione con e senza JavaScript. Verificare in particolare il menu mobile attualmente nascosto dal CSS senza una via di accesso equivalente quando JS non parte.

Conservare `prefers-reduced-motion`, pausa e possibilità di raggiungere direttamente gli stati finali. I contenuti testuali devono essere visibili di base anche se non parte un'animazione. Valutare performance su dispositivo reale prima di aggiungere dipendenze; la qualità non si misura soltanto con test automatici o screenshot.

### 8.7 Ordine di lavoro proposto e confini

1. **Prima:** prova di sola composizione dell'hero e scala tipografica, con confronto desktop/mobile.
2. **Poi:** ritmo dell'indice, pulizia dei testi meta-progettuali e gerarchia delle azioni.
3. **Dopo la review separata delle animazioni:** definire la regia delle transizioni fra gli stati e il gesto amministrativo distintivo, senza toccare il disegno degli asset.
4. **Infine:** audit accessibilità e prestazioni, font/licenze e collaudo su Safari/iPhone reale.

**Da non fare in questa fase:** alterare il mood, la palette senza una prova motivata, la sezione 4, i file `references/laika/`, gli SVG o il motore generico; modificare `index.html` o `prototypes/laika-home/index.html`; considerare queste proposte già approvate.

**Fonte di ispirazione, non specifica vincolante:** [Awwwards Web Design — directions, typography, layout, motion, interaction, quality gates](https://github.com/owenisas/awwwards-web-design/tree/main/skills/awwwards-web-design/references).

## 9. Consolidamento di asset e figure (19 ottobre 2026, PR di design)

Sono state preservate tre fonti indipendenti: il [primo kit da 20 simboli](../prototypes/laika-kit/kit-forme-laika.html) per architetture, mezzi e segni, la [home v2](../prototypes/laika-home/index-v2.html) per la direzione stilistica dei **cinque omini più organici** e la [nuova galleria dell'Atto 0](../prototypes/laika-kit/index.html) per terra, mir, fabbrica, risorse e crisi. Le figure geometriche del primo kit restano un confronto, non lo standard estetico definitivo.

Vincoli non cambiati: silhouette umane piene, curve meno regolari, geometria essenziale, palette controllata. Prima di finalizzare la grafica occorre correggere gli snodi visibili nell'animazione e testare le composizioni in mobile. La galleria ha un contratto tecnico separato dai contenuti didattici; per provenienza, limiti storici e criteri di merge leggere [LAIKA-ASSET-DIRECTION.md](archivio/LAIKA-ASSET-DIRECTION.md).
