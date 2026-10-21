Schede scena di LAIKA, composte con la bottega (`bottega/README.md`).

Ogni file va elencato in `scene` dentro `games/laika/course.json`; il build le compone con il tema indicato in `tema` (predefinito `laika`). L'`id` della scena è lo `stageId` degli episodi; l'`id` di una sequenza è il loro `motionId`. Per ora nessuna scena di produzione: le prime nasceranno con l'Atto 0.

```sh
npm run scena -- games/laika/source/scene/<id>.json
npm run build:laika && npm test
```
