# Figure per l'Atto II

Bozze grafiche del 23 ottobre 2026 per le schede di `PIANO-ATTI-LAIKA.md`, righe 279–421. Nessuna nuova scena storica del corso è collegata da questa modifica. La bottega contiene archetipi riutilizzabili; il contesto degli episodi resta qui.

| Variante | Impiego previsto | Forma |
|---|---|---|
| `marinaio` | II.5, marinai di Kronstadt nel luglio 1917 | Casacca con colletto, berretto senza visiera con nastri |
| `soldato_guarnigione` | II.1 e II.2, soldato o delegato nel marzo-luglio 1917 | Tunica con cintura, pantaloni, berretto con visiera |
| `soldatessa` | II.4-e3, battaglione femminile nell'estate 1917 | Corpo donna con la stessa tunica sopra i pantaloni; nessuna gonna o chignon esposto |
| `uomo_cappello` | II.5-e3, figura civile per la fuga | Corpo uomo e berretto dello studio; testa senza barba, baffi o tratti individuali |

Per le nuove scene del 1917 usare `soldato_guarnigione` al posto di `char-soldato-zarista`, che rimane negli studi di archivio e non costituisce un riferimento verificato. Il rimando nell'[asset manifest](ASSET-MANIFEST.md) è aggiornato; non ci sono ancora schede dell'Atto II da migrare. Il nome della variante civile non identifica Lenin e il disegno non ne riprende la fisionomia.

Tutte e quattro le voci sono in `bottega/catalogo.json`, sotto `figure.varianti`, con stato `bozza`. La figura originale resta `pronto`; questo stato non si estende alle aggiunte. I token del tema e dei ruoli hanno funzione grafica: il blu di `esercito` non è una prova del colore di una divisa.

## Fonti e limiti

Consultazione online: 23 ottobre 2026. Si adottano solo fogge semplificate senza scritte, coccarde, spalline, gradi o simboli di reparto. Non si certifica una ricostruzione uniforme per tutti i mesi dell'atto.

- **Marinaio:** [Library of Congress, LC-DIG-det-4a14901](https://www.loc.gov/pictures/item/2016804335/), *Sailors, Russian navy*, marinai della Rynda al Columbian Naval Review del 1893. Consultati il testo indicizzato della scheda e la [fotografia digitale](https://cdn.loc.gov/service/pnp/det/4a10000/4a14000/4a14900/4a14901v.jpg). Si riconoscono casacca, colletto e berretto senza visiera. La continuità di queste fogge con Kronstadt nel 1917 resta da verificare; numero delle righe, taglio e nastri non sono verificati.
- **Soldato:** [Library of Congress, LC-USZ62-2186](https://www.loc.gov/pictures/item/2009631821/), *The 1st of May celebration Dvortsovyĭ Square, Petrograd*, 1917. La scheda descrive una folla prevalentemente militare. Non identifica il reparto di guarnigione né una dotazione comune a marzo e luglio. È stato consultato il testo indicizzato della scheda: l'accesso diretto ha restituito HTTP 403. Il dettaglio iconografico non è stato controllato sull'immagine in questa sessione. Berretto, colletto, chiusura della tunica e fibbia restano proposte grafiche da riscontrare; la fotografia del battaglione femminile fornisce il riferimento diretto per la tunica con cintura dell'archetipo condiviso.
- **Soldatessa:** [London Museum, NN30312](https://www.londonmuseum.org.uk/collections/v/object-968959/emmeline-pankhurst-and-the-russia-women-soldiers/), *Emmeline Pankhurst and the Russia Women soldiers*, 1917. Scheda e fotografia consultate: tunica con cintura, pantaloni e berretto con visiera sono leggibili. Il museo indica Pietrogrado come luogo probabile; la scheda non attribuisce con certezza reparto e giorno. Non prova che si tratti del battaglione di Bočkarëva entro luglio. La figura non è un ritratto della comandante. Il riferimento è usato per le fogge; nessuna fotografia è copiata nella repo.
- **Civile:** `prototypes/laika-studi-originali/studio personaggi.html#buildOminoSVG`, corpo uomo con `hat: berretto` già presente. La testa circolare non ha dettagli del viso. Nessuna pretesa di riprodurre un travestimento documentato o un cappello preciso dell'episodio. Fogge locali e datazione puntuale restano da verificare.

## Abiti mancanti, solo proposte

La ricognizione di `VARIANTI` e dei rami del generatore trova gonna, vestito, scialle, cappotto e mantello generici. Non trova grembiule, fazzoletto da lavoro o soprabito con cintura per un vetturino. Nessun abito esistente certifica uno di questi mestieri. Le proposte sono anche in `catalogo.da_fare`:

- domestica: corpo donna con abito da lavoro e grembiule;
- lavandaia: corpo donna con gonna da lavoro, grembiule e fazzoletto;
- vetturino: soprabito da lavoro con cintura e copricapo da verificare.

Non sono stati disegnati. Prima di implementarli occorre un riferimento iconografico locale datato e va verificato quali elementi distinguano il mestiere senza ricorrere a stereotipi.

## Conservazione e prova

Baseline: `2c5082975176b45034b143057b647f29795846a1`. `tests/fixtures/figure-stabili.json` contiene gli hash dell'output del generatore acquisiti prima della modifica: 13 varianti × 25 pose × 4 ruoli, con scala 1.7 e specchio. Il test blocca qualunque variazione di geometria, ordine dei layer, rig o componenti. Non rigenerare il fixture per accettare differenze.

Il confronto browser con gli studi mantiene gli assert esistenti e copre anche le quattro vecchie varianti prima non presenti nel campione. Le aggiunte non hanno un originale da confrontare al pixel: vengono controllate nella galleria in tutte le pose e nei quattro ruoli. I test verificano inoltre che la tunica della soldatessa non usi il ramo della gonna e che copricapi e cintura seguano le articolazioni corrette.

Scena neutra di prova: `bottega/esempi/varianti.json`, con le quattro varianti, ingressi da entrambe le direzioni, fucili e specchio. Il test della galleria controlla pausa, replay, finale stabile e movimento ridotto anche su questo esempio. Non contiene testo storico.

Comandi, risultati e screenshot: [evidenze](evidence/figure-atto-ii/README.md).

## Aperto

- Revisione visiva delle quattro bozze prima del passaggio a `pronto`.
- Fonte iconografica locale datata per Kronstadt nel 1917 e controllo diretto della fotografia del soldato.
- Identificazione del reparto femminile e della foggia effettiva entro luglio 1917.
- Verifica del cappello civile dell'episodio senza introdurre tratti di persone reali.
- Fonti per i tre abiti proposti e loro eventuale disegno in un incarico successivo.
