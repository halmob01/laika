// Meccanismi generici del player usati dal redesign LAIKA: etichetta del marchio, gioco autonomo,
// inquadratura per telefono, racconto a card. Nessuno contiene nomi o colori di un gioco.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateRegistry} from '../src/shell/registry.js';
import {validateStage} from '../src/visual/stage.js';
import {validatePack} from '../src/validation/game-pack.js';
import {compilaScena} from '../bottega/scena.js';

const read = p => JSON.parse(fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8'));
const config = read('config.json');

test('presentazione: homeLabel e standalone opzionali e controllati', () => {
  const ok = structuredClone(config);
  ok.games[0].presentation = { stylesheet: './x.css', homeHref: './', homeLabel: 'MARCHIO', standalone: true };
  assert.equal(validateRegistry(ok), ok);
  for (const extra of [{ homeLabel: '' }, { homeLabel: 'x'.repeat(41) }, { homeLabel: 3 }, { standalone: 'sì' }]) {
    const bad = structuredClone(config);
    bad.games[0].presentation = { stylesheet: './x.css', homeHref: './', ...extra };
    assert.throws(() => validateRegistry(bad));
  }
});

test('scenografia: inquadratura per telefono valida o rifiutata', () => {
  const base = { id: 'prova', label: 'Prova', duration: 700, layers: [] };
  validateStage({ ...base, mobile: { center: 0.3 } }, {});
  validateStage({ ...base, mobile: { center: 1, zoom: 2.2 } }, {});
  for (const mobile of [null, [], {}, { center: -0.1 }, { center: 1.2 }, { center: 0.5, zoom: 0.8 }, { center: 0.5, zoom: 4 }, { center: 0.5, extra: 1 }])
    assert.throws(() => validateStage({ ...base, mobile }, {}), /telefono/);
});

test('bottega: "telefono" della scheda scena diventa mobile della scenografia', () => {
  const studi = read('bottega/generati/studi.json'), catalogo = read('bottega/catalogo.json');
  const scena = structuredClone(read(catalogo.esempi[0]));
  scena.telefono = { centro: 0.35, zoom: 1.8 };
  assert.deepEqual(compilaScena(scena, { libreria: studi }).stage.mobile, { center: 0.35, zoom: 1.8 });
  delete scena.telefono.zoom;
  assert.deepEqual(compilaScena(scena, { libreria: studi }).stage.mobile, { center: 0.35 });
  scena.telefono = { centro: 2 };
  assert.throws(() => compilaScena(scena, { libreria: studi }), /telefono/);
  delete scena.telefono;
  assert.equal(compilaScena(scena, { libreria: studi }).stage.mobile, undefined);
});

test('episodi: display "cards" solo per racconti con almeno due paragrafi', () => {
  const pack = read('games/laika/game.json');
  const episodes = pack.acts[0].episodes;
  const narrativo = episodes.find(e => e.type === 'narrative' && e.text.includes('\n\n'));
  narrativo.display = 'cards';
  assert.ok(validatePack(structuredClone(pack)));
  const conScelte = structuredClone(pack);
  conScelte.acts[0].episodes.find(e => e.type !== 'narrative').display = 'cards';
  assert.throws(() => validatePack(conScelte), /card/);
  const unParagrafo = structuredClone(pack);
  const e = unParagrafo.acts[0].episodes.find(x => x.id === narrativo.id);
  e.text = 'Un solo paragrafo.';
  assert.throws(() => validatePack(unParagrafo), /card/);
  const altro = structuredClone(pack);
  altro.acts[0].episodes.find(x => x.id === narrativo.id).display = 'slide';
  assert.throws(() => validatePack(altro), /card/);
});
