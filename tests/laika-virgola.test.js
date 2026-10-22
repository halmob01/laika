// Regola di stile LAIKA: in italiano niente virgola prima di «e», «ed», «o», «od», «né» (AGENTS.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const regola = /,\s+(e|ed|o|od|né)\s/u;
const testi = [];
function raccogli(valore, dove) {
  if (typeof valore === 'string') testi.push([dove, valore]);
  else if (Array.isArray(valore)) valore.forEach((v, i) => raccogli(v, dove + '[' + i + ']'));
  else if (valore && typeof valore === 'object') for (const [k, v] of Object.entries(valore)) if (k !== 'editorial') raccogli(v, dove + '.' + k);
}
const json = d => fs.readdirSync(path.join(root, d)).filter(f => f.endsWith('.json')).map(f => path.join(d, f));
for (const f of ['games/laika/course.json', ...json('games/laika/source/acts'), ...json('games/laika/questions'), ...json('games/laika/source/scene')])
  raccogli(JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')), f);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
testi.push(['index.html', html.replace(/\s+/g, ' ')]);

test('LAIKA: nessuna virgola prima di e, o, né nei testi per lo studente', () => {
  const errori = testi.filter(([, t]) => regola.test(t)).map(([d, t]) => d + ': «…' + t.slice(Math.max(0, t.search(regola) - 40), t.search(regola) + 20) + '…»');
  assert.deepEqual(errori, []);
});
