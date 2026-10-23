import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {caricaKit} from '../bottega/strumenti/kit.js';
import {parseMarkup,markupToLayers} from '../bottega/strumenti/svg-in-layer.js';
import {figura,oggettoSymbol,PRESE_OGGETTI} from '../bottega/figura/figura.js';
import {composePack} from '../src/visual/compose.js';
import {validateStage} from '../src/visual/stage.js';
import {compilaScena} from '../bottega/scena.js';

const read = file => JSON.parse(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'));
const file = 'prototypes/kit-primavera-1917/kit-primavera-1917.html';
const catalogo = read('bottega/catalogo.json'), studi = read('bottega/generati/studi.json');
const palette = read('bottega/temi.json').temi.studi;
const token = { bg: 'paper', p2: 'paper2', ink: 'ink', red: 'red', sand: 'sand', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', sky: 'sky', tree: 'tree' };
const api = caricaKit({ file, palette: 'C', token });
const nuovi = studi.symbols.filter(s => s.meta.origine?.file === file);
const attesi = [
  'oggetto-aquila-imperiale', 'oggetto-ritratto-zar', 'oggetto-statua-zar', 'oggetto-bara',
  'oggetto-bara-rossa', 'oggetto-elefante-circo', 'oggetto-fiori', 'oggetto-manifesto-prestito',
  'oggetto-mitragliatrice', 'oggetto-carriola', 'ambiente-caffe', 'ambiente-teatro-palco',
  'ambiente-salone-lampadari', 'luogo-palazzo-tauride'
];

test('nuovi disegni: catalogo completo in bozza con epoca, provenienza e limiti', () => {
  assert.deepEqual(nuovi.map(s => s.id).sort(), [...attesi].sort());
  for (const id of attesi) {
    const v = catalogo.voci.find(v => v.id === id);
    assert.equal(v.stato, 'bozza', id);
    assert.match(v.epoca, /1917/, id);
    assert.ok(v.fonte.startsWith(file + '#'), id);
    assert.ok(v.note.length > 80, id);
    assert(!catalogo.da_fare.some(d => d.voci.includes(id)), id);
  }
  assert.match(catalogo.voci.find(v => v.id === 'oggetto-carriola').note, /Solo per un fatto riportato: mai come opzione di gioco/);
  assert.match(catalogo.voci.find(v => v.id === 'luogo-palazzo-tauride').note, /sei colonne/);
  assert.match(catalogo.voci.find(v => v.id === 'ambiente-teatro-palco').note, /non verificati/);
});

test('kit nuovo: esecuzione senza browser, chiamate deterministiche e grammatica SVG importabile', () => {
  const html = fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const pre = html.split('<script>')[1].split('// AVVIO')[0];
  assert(!/document|innerHTML|requestAnimationFrame|Math\.random/.test(pre));
  vm.runInNewContext(pre, { Math });
  assert(!/#[0-9a-f]{3,8}\b/i.test(html.replace(/const C = \{[\s\S]*?\};/, '')));
  assert(!/\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(html));
  for (const s of nuovi) {
    const o = s.meta.origine, a = api.chiama(o.funzione, o.argomenti);
    assert.equal(a, api.chiama(o.funzione, o.argomenti), s.id);
    const ids = new Set();
    function walk(n) {
      if (n.tag !== '#root') {
        assert(['g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline'].includes(n.tag), s.id + ': ' + n.tag);
        assert(!n.attrs.style && !n.attrs.class && !n.attrs.filter);
        if (n.attrs.d) assert(!/[a-z]/.test(n.attrs.d), s.id);
        if (n.attrs.id) {
          assert(!ids.has(n.attrs.id)); ids.add(n.attrs.id);
          assert.match(n.attrs['data-pivot'], /^-?[\d.]+ -?[\d.]+$/);
        }
      }
      n.children.forEach(walk);
    }
    walk(parseMarkup(a));
    assert(markupToLayers(a, { patterns: { grana: 'grana-ambienti' } }).length > 1);
  }
});

test('kit nuovo: riusa la grana esistente senza duplicare i motivi nei pacchetti', () => {
  const original = caricaKit({ file: 'prototypes/kit-ambienti-primo-novecento/kit-ambienti-primo-novecento.html', palette: 'C', token });
  assert.equal(api.chiama('getDefs', []), original.chiama('getDefs', []));
  assert.equal(new Set(studi.patterns.map(p => p.id)).size, studi.patterns.length);
  const prima = JSON.parse(fs.readFileSync(new URL('../site/laika/hero.json', import.meta.url), 'utf8')).patterns;
  assert.deepEqual(studi.patterns, prima);
  assert(nuovi.some(s => s.layers.some(l => l.attrs?.fill === 'pattern:grana-ambienti')));
});

test('bare: varianti nera e rossa scambiabili con identici ingombro, ancoraggio e geometria', () => {
  const a = nuovi.find(s => s.id === 'oggetto-bara'), b = nuovi.find(s => s.id === 'oggetto-bara-rossa');
  assert.deepEqual(a.meta.size, b.meta.size);
  const senzaColore = s => s.layers.map(l => ({ ...l, attrs: l.attrs ? { ...l.attrs, fill: l.attrs.fill === 'red' ? 'ink' : l.attrs.fill } : l.attrs }));
  assert.deepEqual(senzaColore(a), senzaColore(b));
  assert.equal(a.layers[0].pose.translateY, -200);
});

test('fiori: prop con presa reale e stessa geometria del kit, valido in più pose e temi', () => {
  assert.equal(PRESE_OGGETTI.fiori, 'hand-near');
  const prop = oggettoSymbol('fiori');
  assert.equal(prop.meta.source, 'kit-primavera-1917.html#fiori');
  assert.deepEqual(prop.layers, markupToLayers(api.chiama('drawMazzo', []), { prefix: 'f' }));
  for (const pose of ['in_piedi', 'cammina_1', 'parla', 'legge', 'a_terra']) for (const theme of Object.values(read('bottega/temi.json').temi)) {
    const f = figura({ id: 'persona', x: 300, y: 400, pose, role: 'protagonista', props: ['fiori'] });
    assert.equal(f.components.find(c => c.id === 'persona-fiori').parent, 'persona-hand-near');
    const st = composePack({ palette: theme, symbols: f.symbols, stages: [{ id: 'presa', label: 'Mazzo in mano', duration: 0, layers: [], components: f.components }] }).stages[0];
    validateStage(st, {});
  }
});

test('scena nuova: cinque simboli nuovi e fiori agganciati, senza SVG scritto nella scena', () => {
  const scena = read('bottega/esempi/primavera.json');
  assert(scena.elementi.filter(e => attesi.includes(e.simbolo)).length >= 5);
  assert(scena.elementi.every(e => !e.markup));
  const f = compilaScena(scena, { libreria: studi });
  const pack = composePack({ palette, patterns: studi.patterns, symbols: f.symbols, stages: [f.stage] });
  validateStage(pack.stages[0], {});
  assert(f.stage.components.some(c => c.id === 'visitatore-fiori' && c.parent === 'visitatore-hand-near'));
  assert(!scena.elementi.some(e => e.simbolo === 'oggetto-carriola'));
});
