# LAIKA e il kit di giochi didattici

Questa repository contiene due cose:

- un **kit di giochi didattici** riutilizzabile (motore a episodi e a turni, scene SVG animate, bottega di disegni e figure), senza backend e senza dipendenze runtime;
- **LAIKA**, il percorso sulla Rivoluzione russa e l'URSS costruito con il kit, per una classe quinta. Online su `halmob01.github.io/laika`.

```sh
npm test
npm run serve          # poi http://localhost:4173/
npm run test:browser   # dopo npm install e npx playwright install chromium
npm run allievo        # con il server acceso: un allievo finto gioca tutto il percorso e scrive che cosa vede
npm run canone         # rigenera docs/laika/CANONE.md da games/laika/canone.json
```

## Dove sono le cose

- Istruzioni per chi ci lavora (persone e agenti): [AGENTS.md](AGENTS.md).
- Mappa dei documenti e ordine di autorità: [docs/README.md](docs/README.md).
- LAIKA: [canone](docs/laika/CANONE.md) (struttura del percorso), [decisioni del docente](docs/laika/DECISIONI.md), [stato](docs/laika/STATO.md).
- Il kit: [come creare un gioco](docs/CREARE-UN-GIOCO.md), [animazioni](docs/MOTION.md), [bottega](bottega/README.md).

I giochi dimostrativi del kit restano su `play.html?game=biblioteca`, `quartiere` e `messaggio`. I test del vecchio motore narrativo restano in `tests/legacy`. La versione precedente di questo file, con la storia delle prime fasi, è in [docs/archivio/README-RADICE.md](docs/archivio/README-RADICE.md).
