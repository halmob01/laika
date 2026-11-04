Schede scena di LAIKA, composte con la bottega (`bottega/README.md`).

Ogni file va elencato in `scene` dentro `games/laika/course.json`; il build le compone con il tema indicato in `tema` (predefinito `laika`). L'`id` della scena è lo `stageId` degli episodi; l'`id` di una sequenza è il loro `motionId`. I nomi seguono le unità del canone (`servitu-*`, `mir-*`, `citta-*`, `petizione-*`, `soviet-*`, `concessioni-*`, `stolypin-*`, `pane-guerra-*`, `otto-giorni-*`), mai il loro numero. Ogni unità ha almeno una scena propria e nessun episodio usa la scena di un'altra unità (`tests/unita-ludiche.test.js`).

```sh
npm run scena -- games/laika/source/scene/<id>.json
npm run build:laika && npm test
```
