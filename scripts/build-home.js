// Compone le schede scena del hero di una home di progetto in un pacchetto statico.
// Generico: ogni progetto ha site/<progetto>/hero.config.json ({scene, tema, uscita}) e le
// schede in site/<progetto>/scene/. Usa solo la bottega e il motore; nessun contenuto qui.
//   node scripts/build-home.js [site/<progetto>]          rigenera (predefinito: site/laika)
//   node scripts/build-home.js [site/<progetto>] --check  verifica che il file sia aggiornato
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {componiScene} from '../bottega/strumenti/libreria.js';
import {composePack} from '../src/visual/compose.js';
import {validateStage} from '../src/visual/stage.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const PREDEFINITO = 'site/laika';
export const leggiConfig = (dir = PREDEFINITO) => JSON.parse(fs.readFileSync(path.join(ROOT, dir, 'hero.config.json'), 'utf8'));
export const SCENE = leggiConfig().scene;

export function buildHome(dir = PREDEFINITO) {
  const cfg = leggiConfig(dir);
  if (!Array.isArray(cfg.scene) || !cfg.scene.length) throw new Error(dir + '/hero.config.json: "scene" deve elencare almeno una scheda');
  const scene = cfg.scene.map(id => JSON.parse(fs.readFileSync(path.join(ROOT, dir, 'scene', id + '.json'), 'utf8')));
  const pack = componiScene(scene, { tema: cfg.tema ?? 'neutro' });
  for (const stage of composePack(pack).stages) validateStage(stage, {});
  return JSON.stringify(pack) + '\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const dir = process.argv.slice(2).find(a => !a.startsWith('--')) ?? PREDEFINITO;
    const out = buildHome(dir), rel = path.join(dir, leggiConfig(dir).uscita ?? 'hero.json'), file = path.join(ROOT, rel);
    if (process.argv.includes('--check')) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== out) { console.error(rel + ' non aggiornato: npm run build:home -- ' + dir); process.exitCode = 1; }
      else console.log(rel + ' aggiornato');
    } else { fs.writeFileSync(file, out); console.log('Scritto ' + rel + ': ' + Math.round(out.length / 1024) + ' KB'); }
  } catch (e) { console.error('ERRORE: ' + e.message); process.exitCode = 1; }
}
