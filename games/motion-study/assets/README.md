# Provenienza delle forme

Studio separato, non illustrazioni definitive.

- `human-a/b/c.svg`: seconda prova, ridisegnata su richiesta dell’autore dopo la review della PR #4. Sagome più esili e asimmetriche, teste irregolari collegate al collo, busti inclinati, gomiti e piedi accennati. Riferimento: figure delle tavole `03-eventi-tragici.webp` e `04-rivoluzione-tappe.webp`. Sei parti animabili con pivot locali e sovrapposizioni alle articolazioni; un sottile contorno dello stesso colore mantiene la continuità visiva. Non sono illustrazioni definitive.
- `city.svg`: primi cinque tracciati architettonici della scena 1917 del medesimo prototipo; posizione/scala adattate alla composizione della demo.
- `flag.svg`: asta e triangolo rosso della scena 1917, con pivot all'attacco del tessuto.
- Disposizione, coreografia, regia e tempi: nuovo studio, ispirato soprattutto alle tavole `references/laika/01-cronologia-urss.webp` e `04-rivoluzione-tappe.webp`; osservate anche le altre due tavole.

`python3 games/motion-study/build.py` legge gli SVG degli omini senza sovrascriverli e rigenera architettura, bandiere e manifest. Il generatore appartiene esclusivamente a questa demo; non è una dipendenza runtime o un generatore di contenuti storici.

Nessuna figura, palette, edificio o nome LAIKA nel visual core. Il font Propaganda e i suoi contorni non sono inclusi nell'anteprima di movimento. La tavola SVG Madrepatria è stata esaminata come materiale di lavoro, non alterata né copiata nella demo.
