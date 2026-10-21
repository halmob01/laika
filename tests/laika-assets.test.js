import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {composePack} from '../src/visual/compose.js';
import {validateStage} from '../src/visual/stage.js';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const source = JSON.parse(read('../prototypes/laika-kit/atto0-study.json'));
const symbols = source.symbols;
const stages = source.stages;
const act = {metrics: [], resources: [], relations: []};

test('LAIKA Atto 0: 14 simboli e quattro studi storici', () => {
  assert.equal(symbols.length, 14);
  assert.equal(stages.length, 4);
  assert.deepEqual(stages.map(s => s.id), [
    'scena-terra', 'scena-mir', 'scena-fabbrica800', 'scena-pane'
  ]);
  const ids = symbols.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of [
    'env-appezzamenti', 'char-proprietario', 'char-funzionario',
    'char-famiglia-contadina', 'env-assemblea-mir', 'env-fabbrica-800',
    'char-operaio-800', 'res-documento', 'res-monete', 'res-grano',
    'res-attrezzi', 'char-soldato-zarista', 'env-coda-pane', 'char-persona-coda'
  ]) assert(ids.includes(id), 'Simbolo mancante: ' + id);
});

test('LAIKA Atto 0: scene composabili e valide nel motore reale', () => {
  const expanded = composePack(source);
  assert.equal(expanded.stages.length, 4);
  for (const stage of expanded.stages) {
    assert.doesNotThrow(() => validateStage(stage, act), stage.id);
    assert(stage.layers.length > 10, 'Scena priva di illustrazioni: ' + stage.id);
    assert(stage.sequences.some(s => s.id === 'ingresso'), 'Intro assente: ' + stage.id);
    const keys = new Set(stage.layers.map(l => l.id));
    assert.equal(keys.size, stage.layers.length);
    for (const layer of stage.layers) {
      if (layer.parent) assert(keys.has(layer.parent), 'Parent assente: ' + layer.id);
    }
  }
});

test('LAIKA Atto 0: ogni simbolo è istanziabile e validabile da solo', () => {
  for (const symbol of symbols) {
    const mini = composePack({symbols: [symbol], stages: [{
      id: 'mini-' + symbol.id,
      label: symbol.meta,
      duration: 0,
      layers: [],
      components: [{id: 'item', symbol: symbol.id, pose: {translateX: 320, translateY: 280}}]
    }]}).stages[0];
    assert.doesNotThrow(() => validateStage(mini, act), symbol.id);
  }
});

test('LAIKA Atto 0: metrica dimostrativa e scene non si spacciano per un gioco', () => {
  assert.equal(source.status, 'visual-reference-not-game');
  assert.equal(source.acts, undefined);
  assert.equal(stages.every(s => !s.bindings?.length), true);
  assert.equal(stages.every(s => !s.metrics?.length), true);
});

test('LAIKA: le cinque figure organiche sono conservate come SVG standalone', () => {
  for (const letter of 'abcde') {
    const svg = read('../prototypes/laika-kit/figure/human-' + letter + '.svg');
    assert(svg.startsWith('<svg'), 'SVG mancante: ' + letter);
    assert(svg.includes('id="head"') && svg.includes('id="body"'), 'Parti semantiche assenti: ' + letter);
    assert(!svg.includes('currentColor'), 'Usare fill esplicito: ' + letter);
  }
});

test('LAIKA: i due prototipi originali sono conservati', () => {
  const kit = read('../prototypes/laika-kit/kit-forme-laika.html');
  const home = read('../prototypes/laika-home/index-v2.html');
  for (const name of ['env-vysotka', 'env-panelki', 'env-diga-cantiere', 'laika-dog']) {
    assert(kit.includes(name), 'Simbolo originale assente: ' + name);
  }
  for (const name of ['human-a', 'human-b', 'human-c', 'human-d', 'human-e']) {
    assert(home.includes('id="'+name+'"'), 'Omìnino organico assente: ' + name);
  }
});
