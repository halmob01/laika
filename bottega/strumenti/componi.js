// Controlla e compone schede scena da riga di comando.
//   node bottega/strumenti/componi.js scena.json [altra.json ...] [--tema neutro|laika|...] [--out frammento.json]
// Senza --out stampa solo il riepilogo; gli errori indicano scena, sequenza e passo.
import fs from 'node:fs';
import {componiScene} from './libreria.js';
import {composePack} from '../../src/visual/compose.js';
import {validateStage} from '../../src/visual/stage.js';

const args = process.argv.slice(2), opt = name => { const i = args.indexOf(name); return i < 0 ? undefined : args.splice(i, 2)[1]; };
const tema = opt('--tema') ?? 'neutro', out = opt('--out');
if (!args.length) { console.error('Uso: node bottega/strumenti/componi.js scena.json [...] [--tema neutro|laika|...] [--out frammento.json]'); process.exit(2); }
try {
  const scene = args.map(f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { throw new Error(f + ': JSON non valido (' + e.message + ')'); } });
  const frammento = componiScene(scene, { tema });
  const composto = composePack(frammento);
  for (const st of composto.stages) {
    validateStage(st, {});
    console.log(st.id + ': ' + st.layers.length + ' layer; sequenze ' + (st.sequences || []).map(q => q.id + ' (' + q.tracks.length + ' tracce, ' + Math.max(0, ...q.tracks.map(t => t.at + t.duration * (t.iterations ?? 1))) + ' ms)').join(', '));
  }
  if (out) { fs.writeFileSync(out, JSON.stringify(frammento) + '\n'); console.log('Scritto ' + out); }
} catch (e) { console.error('ERRORE: ' + e.message); process.exitCode = 1; }
