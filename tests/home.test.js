import {gzipSync} from 'node:zlib';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildHome, SCENE} from '../scripts/build-home.js';

const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('home: hero.json rigenerato dalle schede scena, deterministico e aggiornato', () => {
  const out = buildHome();
  assert.equal(buildHome(), out);
  assert.equal(read('site/laika/hero.json'), out, 'eseguire npm run build:home');
  const pack = JSON.parse(out);
  assert.deepEqual(pack.stages.map(s => s.id), SCENE);
  // Luoghi monumentali disegnati a mano e folle: il file e' grande ma molto ripetitivo.
  // Conta soprattutto il peso trasmesso (GitHub Pages serve JSON compresso).
  assert.ok(Buffer.byteLength(out) < 450 * 1024, 'hero.json sotto 450 KB non compressi');
  assert.ok(gzipSync(out).length < 100 * 1024, 'hero.json sotto 100 KB compressi');
});

test('home: schede del hero senza colori esadecimali e con epoca compatibile', () => {
  const catalogo = JSON.parse(read('bottega/catalogo.json'));
  const tardi = new Set(catalogo.voci.filter(v => /non usare prima del 19[2-9]\d/.test(v.epoca)).map(v => v.id));
  for (const id of SCENE) {
    const raw = read('site/laika/scene/' + id + '.json');
    assert.doesNotMatch(raw, /#[0-9a-f]{3,6}\b/i, id + ': colori solo a token');
    for (const e of JSON.parse(raw).elementi || []) assert.ok(!tardi.has(e.simbolo), id + ': ' + e.simbolo + ' è successivo alla scena');
  }
});

test('home: denominazione approvata riprodotta esattamente, nessun riferimento esterno', () => {
  const html = read('index.html');
  assert.ok(html.includes("Direzione Centrale per la Pianificazione, l'Attuazione e la Rettifica dei Processi Rivoluzionari"));
  assert.doesNotMatch(html, /(?:href|src)="https?:/, "nessuna risorsa esterna");
  assert.match(html, /id="progress"/); assert.match(html, /id="resume"/);
});

test('home: il build del hero è generico (configurazione nel progetto, nessun contenuto nel codice)', () => {
  const codice = read('scripts/build-home.js');
  assert.doesNotMatch(codice, /hero-1[89]\d\d|laika-grigio/, 'scene e tema stanno in site/<progetto>/hero.config.json');
  const cfg = JSON.parse(read('site/laika/hero.config.json'));
  assert.deepEqual(cfg.scene, SCENE);
  assert.equal(typeof cfg.tema, 'string');
});
