# Evidenze S1: le scene delle unità già fatte

Schermate delle schede scena composte nella galleria della bottega con il tema `laika` e il movimento ridotto (quadro finale). Si rigenerano con `npm run serve` e `node scripts/scene-schermate.cjs <cartella> games/laika/source/scene/*.json`.

- `prima/`: le 20 schede com'erano in `main` (con i nomi già rinominati).
- `dopo/`: le 33 schede dopo S1.
- `allievo/`: trascrizione della partita intera dell'allievo finto (`npm run allievo`, 390x844, seme 7: tutti i controlli automatici passati) e schermata finale.

Prova eseguita il 4 novembre 2026 in Chromium; WebKit e telefono reale non provati in locale (WebKit gira in CI).

| Unità | Prima | Dopo |
|---|---|---|
| `servitu` | `servitu-anno` | `servitu-anno` (mucca, cavallo, sacchi, banco della fiera) |
| `mir` | `mir-assemblea` | `mir-assemblea` (strisce prima e dopo, registro, covone) |
| `citta` | `citta-corte`, `citta-stanza`, `citta-volantini` | più `citta-fabbrica`, `citta-dormitorio`; salone, carbone, volantini |
| `petizione` | `petizione-domenica` | più `petizione-putilov`; Palazzo d'Inverno e ritratto dello zar |
| `soviet` | `soviet-sala` | più `soviet-ferrovia`; tavolo e telegrafo |
| `concessioni` | (usava la scena di `soviet`) | `concessioni-sala` |
| `stolypin` | (usava le scene di `mir` e `soviet`) | `stolypin-strisce`, `stolypin-ricorda` |
| `pane-guerra` | `pane-guerra-pane`, `pane-guerra-ginocchio` | più `pane-guerra-treni`, `pane-guerra-trincea`, `pane-guerra-famiglia` |
| `otto-giorni` | `otto-giorni-donna`, `otto-giorni-soldato` (e la scena di `pane-guerra`) | più `otto-giorni-coda`, `otto-giorni-treno`, `otto-giorni-confronto` |
