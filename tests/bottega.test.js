import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {composePack} from '../src/visual/compose.js';
import {validateStage,createStage} from '../src/visual/stage.js';
import {validatePack} from '../src/validation/game-pack.js';
import {compilaScena,compilaScene} from '../bottega/scena.js';
import {figura,figuraSymbol,variante,GIUNTURE,PIEDI} from '../bottega/figura/figura.js';
import {POSE,VARIANTI,RUOLI} from '../bottega/figura/pose.js';
import {FORMAZIONI,formazione} from '../bottega/formazioni.js';
import {AZIONI,SINONIMI} from '../bottega/movimenti.js';
import {buildLaika} from '../scripts/build-laika.js';

const read = p => JSON.parse(fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8'));
const studi = read('bottega/generati/studi.json'), temi = read('bottega/temi.json'), catalogo = read('bottega/catalogo.json');
const esempi = catalogo.esempi.map(read);
const palette = temi.temi.laika;
const stageWith = (symbols, components, extra = {}) => composePack({ palette, patterns: studi.patterns, symbols, stages: [{ id: 't', label: 'prova', duration: 0, layers: [], components, ...extra }] }).stages[0];

test('bottega: studi.json è aggiornato e deterministico rispetto agli originali', () => {
  const r = spawnSync(process.execPath, ['bottega/strumenti/importa-studi.js', '--check'], { cwd: new URL('..', import.meta.url), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr + r.stdout);
});

test('bottega: catalogo e simboli generati coincidono; esempi elencati esistono', () => {
  const ids = studi.symbols.map(s => s.id).sort(), voci = catalogo.voci.map(v => v.id).sort();
  assert.deepEqual(voci, ids);
  for (const v of catalogo.voci) assert.ok(['pronto', 'bozza', 'da-fare', 'archivio'].includes(v.stato), v.id);
  const files = fs.readdirSync(new URL('../bottega/esempi/', import.meta.url)).filter(f => f.endsWith('.json')).map(f => 'bottega/esempi/' + f).sort();
  assert.deepEqual([...catalogo.esempi].sort(), files);
  assert.deepEqual(catalogo.figure.giunture, GIUNTURE);
  assert.deepEqual([...catalogo.formazioni.tipi].sort(), [...FORMAZIONI].sort());
  assert.deepEqual([...catalogo.azioni.tipi].sort(), Object.keys(AZIONI).sort());
});

test('bottega: i disegni sono neutri (solo token) e ogni tema definisce ogni token usato', () => {
  const hex = /#[0-9a-f]{3,8}\b/i;
  for (const f of ['bottega/generati/studi.json', 'bottega/figura/figura.js', 'bottega/formazioni.js', 'bottega/movimenti.js', 'bottega/scena.js'])
    assert.equal(hex.test(fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8')), false, 'Esadecimale nei disegni: ' + f);
  const used = new Set();
  const collect = l => { for (const k of ['fill', 'stroke']) { const v = l.attrs?.[k]; if (v && v !== 'none' && !v.startsWith('pattern:')) used.add(v); } };
  studi.symbols.forEach(s => s.layers.forEach(collect)); studi.patterns.forEach(p => p.layers.forEach(collect));
  for (const variant of Object.keys(VARIANTI)) figuraSymbol(variante({ variant })).layers.forEach(collect);
  for (const [nome, tema] of Object.entries(temi.temi)) for (const t of used) assert.ok(tema[t], nome + ': token mancante ' + t);
  for (const t of used) assert.ok(temi.token[t], 'token non documentato: ' + t);
});

test('bottega: ogni simbolo importato si compone e si valida in ogni tema', () => {
  for (const tema of Object.values(temi.temi)) for (const s of studi.symbols) {
    const st = composePack({ palette: tema, patterns: studi.patterns, symbols: [s], stages: [{ id: 't', label: 'p', duration: 0, layers: [], components: [{ id: 'a', symbol: s.id }] }] }).stages[0];
    validateStage(st, {});
  }
});

test('bottega: le tabelle delle pose coincidono con lo studio originale', () => {
  const html = fs.readFileSync(new URL('../prototypes/laika-studi-originali/studio personaggi.html', import.meta.url), 'utf8');
  let code = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>')).replace(/\ninitUI\(\);[\s\S]*$/, '\n') + '\nglobalThis.__t={POSES,ACTIONS,VARIANTS};';
  const ctx = vm.createContext({ Math }); vm.runInContext(code, ctx);
  const campi = ['shL', 'elL', 'shR', 'elR', 'hipL', 'knL', 'hipR', 'knR', 'lean', 'yOff'];
  const originali = { ...ctx.__t.POSES, ...ctx.__t.ACTIONS };
  for (const [nome, p] of Object.entries(originali)) for (const c of campi) assert.equal(POSE[nome][c], p[c] ?? 0, nome + '.' + c);
  for (const [nome, v] of Object.entries(ctx.__t.VARIANTS)) for (const c of ['body', 'hat', 'coat', 'acc']) assert.equal(VARIANTI[nome][c], v[c], nome + '.' + c);
});

test('figura: ogni combinazione posa × variante × ruolo si compone entro gli intervalli del rig', () => {
  for (const variant of Object.keys(VARIANTI)) for (const role of Object.keys(RUOLI)) for (const pose of Object.keys(POSE)) {
    const f = figura({ id: 'f', x: 0, y: 0, variant, role, pose });
    validateStage(stageWith(f.symbols, f.components), {});
  }
  const s = figuraSymbol(variante({ variant: 'cappotto' }));
  assert.deepEqual(figuraSymbol(variante({ variant: 'cappotto' })), s, 'generazione deterministica');
  assert.deepEqual(Object.keys(s.rig.joints), GIUNTURE);
  assert.throws(() => figura({ id: 'f', pose: 'vola' }), /Posa sconosciuta/);
  assert.throws(() => figura({ id: 'f', variant: 'astronauta' }), /Variante sconosciuta/);
});

test('figura: le 13 varianti esistenti conservano esattamente output, pose e ruoli della baseline', () => {
  // Acquisita prima di modificare il generatore. Non rigenerare per accettare differenze.
  const baseline = read('tests/fixtures/figure-stabili.json');
  for (const [variant, hash] of Object.entries(baseline.varianti)) {
    const output = baseline.pose.flatMap(pose => baseline.ruoli.map(role => figura({ id: 'f', variant, pose, role, x: 100, y: 200, scale: 1.7, flip: true })));
    assert.equal(createHash('sha256').update(JSON.stringify(output)).digest('hex'), hash, variant + ': aspetto o rig modificato');
  }
});

test('figura: le nuove varianti sono registrate come bozze e gli abiti mancanti restano proposte', () => {
  const nuove = ['marinaio', 'soldato_guarnigione', 'soldatessa', 'uomo_cappello'];
  const baseline = read('tests/fixtures/figure-stabili.json');
  assert.deepEqual(Object.keys(VARIANTI), [...Object.keys(baseline.varianti), ...nuove]);
  assert.deepEqual(catalogo.figure.varianti.map(v => v.id), nuove);
  for (const v of catalogo.figure.varianti) {
    assert.equal(v.stato, 'bozza');
    for (const campo of ['epoca', 'fonte', 'riscontro', 'limiti', 'verifica']) assert.ok(v[campo], v.id + ': manca ' + campo);
    assert.ok(fs.existsSync(new URL('../' + v.verifica, import.meta.url)));
  }
  const proposte = catalogo.da_fare.find(d => d.famiglia === 'abiti della figura');
  assert.equal(proposte.stato, 'da-fare');
  for (const nome of ['domestica', 'lavandaia', 'vetturino']) {
    assert.ok(proposte.voci.some(v => v.startsWith(nome + ':')));
    assert.equal(VARIANTI[nome], undefined, nome + ': proposta non disegnata');
  }
});

test('figura: tunica sul corpo donna senza gonna o chignon; cappelli e dettagli seguono testa e busto', () => {
  const soldatessa = figuraSymbol(variante({ variant: 'soldatessa' }));
  const soldato = figuraSymbol(variante({ variant: 'soldato_guarnigione' }));
  assert.equal(variante({ variant: 'soldatessa' }).body, 'donna');
  assert.equal(soldatessa.layers.some(l => l.id === 'chignon'), false);
  assert.deepEqual(soldatessa.layers.filter(l => l.id.startsWith('torso')), soldato.layers.filter(l => l.id.startsWith('torso')));
  assert.ok(soldatessa.layers.some(l => l.id === 'torso-cintura' && l.parent === 'root'));
  for (const variant of ['marinaio', 'soldato_guarnigione', 'soldatessa']) {
    const layers = figuraSymbol(variante({ variant })).layers;
    assert.ok(layers.some(l => l.id === 'hat-crown'));
    assert.ok(layers.filter(l => l.id.startsWith('hat-')).every(l => l.parent === 'head'));
    assert.equal(layers.filter(l => l.id.startsWith('head-')).length, 1, 'nessun tratto del viso');
  }
  // Il civile riusa corpo e copricapo dello studio, senza una fisionomia aggiunta.
  assert.deepEqual(figura({ id: 'f', variant: 'uomo_cappello' }), figura({ id: 'f', body: 'uomo', hat: 'berretto' }));
});

test('figura: piedi a terra nella posa in piedi, prese contro-ruotate, specchio', () => {
  const f = figura({ id: 'f', x: 100, y: 200, pose: 'porta_bandiera', flip: true });
  const st = stageWith(f.symbols, f.components);
  const L = id => st.layers.find(l => l.id === id);
  assert.equal(L('f').pose.scaleX, -1);
  assert.equal(L('f-corpo').pose.translateY, -PIEDI);
  assert.equal(L('f-hand-near').pose.rotate, -(POSE.porta_bandiera.shR + POSE.porta_bandiera.elR));
  assert.equal(L('f-bandiera').parent, 'f-hand-near');
  assert.ok(L('f-bandiera-telo').origin, 'il telo è una parte animabile');
});

test('formazioni: deterministiche, con ID e figure valide', () => {
  for (const tipo of FORMAZIONI) {
    const a = formazione({ tipo, x: 400, y: 450, n: 7 }), b = formazione({ tipo, x: 400, y: 450, n: 7 });
    assert.deepEqual(a, b); assert.ok(a.figure.length > 0, tipo);
  }
  assert.throws(() => formazione({ tipo: 'spirale' }), /Formazione sconosciuta/);
});

test('scene di esempio: compilano, si validano e terminano nella composizione dichiarata', () => {
  for (const s of esempi) {
    const frammento = compilaScene([s], { libreria: studi, palette });
    const game = validatePack({ schemaVersion: 1, id: 'prova', contentVersion: '1', title: 'Prova', exposureFlags: [], ...frammento,
      acts: [{ id: 'a', title: 'A', actors: [{ id: 'x' }], roles: [{ id: 'r', actorId: 'x', label: 'R', mandate: 'M' }], metrics: [], resources: [], relations: [], flags: [], reconciliation: 'R', episodes: [{ id: 'e', type: 'narrative', title: 'T', text: 'T', roleId: 'r', stageId: s.id, ...(s.ingresso ? { motionId: s.ingresso } : {}) }] }] });
    const st = game.stages[0];
    assert.ok(st.sequences.length >= 1 && st.sequences.every(q => q.tracks.length > 0), s.id);
    assert.ok(st.layers.length < 1200 && st.sequences.every(q => q.tracks.length < 700), s.id + ': entro i limiti del motore');
  }
  assert.deepEqual(compilaScena(esempi[0], { libreria: studi }), compilaScena(esempi[0], { libreria: studi }), 'compilazione deterministica');
  for (const nome of Object.keys(SINONIMI)) assert.ok(AZIONI[SINONIMI[nome]], nome);
});

test('scene: errori leggibili che indicano dove correggere', () => {
  const base = () => structuredClone(esempi.find(s => s.id === 'esempio-scontro'));
  const casi = [
    [s => { s.elementi[0].simbolo = 'palazzo-inesistente'; }, /simbolo sconosciuto "palazzo-inesistente"/],
    [s => { s.sequenze[0].passi[0].azione = 'balla'; }, /passo 1: azione sconosciuta "balla"/],
    [s => { s.sequenze[0].passi.push({ azione: 'walk', chi: 'popolo', a: 100 }); }, /passo 2 \(walk\) e passo 1 \(confront\) muovono insieme/],
    [s => { s.sequenze[0].passi.push({ azione: 'camera', a: 0, inquadrature: [[0, 0, 960, 540], [100, 100, 400, 225]] }); }, /ultima inquadratura deve essere quella finale/],
    [s => { s.figure[0].gruppo = 'Popolo'; }, /ID non valido "Popolo"/],
    [s => { s.sequenze[0].passi[0].chi = ['popolo', 'nessuno']; }, /"nessuno" non è una figura/],
    [s => { s.sequenze[1].passi[1].esce = 'fondo'; s.sequenze[1].passi.push({ azione: 'walk', chi: 'fondo', a: 0 }); }, /"fondo" non è una figura/],
    [s => { delete s.etichetta; }, /serve "etichetta"/]
  ];
  for (const [mutate, atteso] of casi) { const s = base(); mutate(s); assert.throws(() => compilaScena(s, { libreria: studi }), atteso); }
});

test('motore: palette a token, ricolorazione, pose del rig sulle istanze, motivi, specchio, opacità', () => {
  const sym = { id: 'm', layers: [{ id: 'arm', tag: 'g', origin: [0, 0] }, { id: 'skin', tag: 'rect', parent: 'arm', attrs: { width: 4, height: 10, fill: 'ink', stroke: '#000000' } }, { id: 'tex', tag: 'rect', attrs: { width: 20, height: 20, fill: 'pattern:cemento-a' } }],
    rig: { joints: { arm: [-90, 90] }, poses: { su: { arm: { rotate: -80, translateY: -3 } }, giu: { arm: 10 } } } };
  sym.layers[0].pose = { rotate: 0 };
  const st = stageWith([sym], [{ id: 'a', symbol: 'm', rigPose: 'su', recolor: { ink: 'red' }, pose: { scaleX: -1 }, opacity: 0.5 }, { id: 'b', symbol: 'm', joints: { arm: 45 } }]);
  const L = id => st.layers.find(l => l.id === id);
  assert.equal(L('a-skin').attrs.fill, palette.red); assert.equal(L('a-skin').attrs.stroke, '#000000');
  assert.equal(L('b-skin').attrs.fill, palette.ink);
  assert.deepEqual(L('a-arm').pose, { rotate: -80, translateY: -3 }); assert.equal(L('b-arm').pose.rotate, 45);
  assert.equal(L('a').attrs.opacity, 0.5);
  assert.equal(st.layers.filter(l => l.tag === 'pattern').length, 1, 'motivo iniettato una sola volta');
  validateStage(st, {});
  // Rendering: motivo con ID isolato, specchio nella trasformazione.
  class N { constructor(t) { this.tag = t; this.attrs = {}; this.dataset = {}; this.children = []; } setAttribute(k, v) { this.attrs[k] = v; } getAttribute(k) { return this.attrs[k] ?? null; } removeAttribute(k) { delete this.attrs[k]; } append(...n) { this.children.push(...n); } replaceChildren() { this.children = []; } }
  globalThis.document = { createElementNS: (_, t) => new N(t) };
  const host = new N('div'); createStage(host, { reducedMotion: true, raf: () => 0, caf: () => {}, now: () => 0 }).mount(st, {});
  const all = []; (function walk(n) { all.push(n); n.children.forEach(walk); })(host);
  const pattern = all.find(n => n.tag === 'pattern'), filled = all.find(n => n.dataset.layer === 'a-tex');
  assert.equal(filled.attrs.fill, 'url(#' + pattern.attrs.id + ')');
  assert.match(all.find(n => n.dataset.layer === 'a').attrs.transform, /scale\(-1 1\)/);
  // Rifiuti espliciti.
  assert.throws(() => stageWith([{ id: 'x', layers: [{ id: 'r', tag: 'rect', attrs: { fill: 'viola' } }] }], [{ id: 'a', symbol: 'x' }]), /token sconosciuto: viola/);
  assert.throws(() => stageWith([sym], [{ id: 'a', symbol: 'm', joints: { arm: 120 } }]), /fuori intervallo/);
  assert.throws(() => stageWith([sym], [{ id: 'a', symbol: 'm', rigPose: 'vola' }]), /posa sconosciuta/);
  assert.throws(() => validateStage({ id: 's', label: 'l', duration: 0, layers: [{ id: 't', tag: 'text', attrs: { 'font-family': 'Comic Sans' } }] }, {}), /tipografica/);
});

test('LAIKA: il build compone le schede scena con il tema del corso', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'laika-scene-'));
  try {
    fs.cpSync(new URL('../games/laika/', import.meta.url), dir, { recursive: true });
    fs.mkdirSync(path.join(dir, 'source/scene'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'source/scene/prova.json'), JSON.stringify(esempi.find(s => s.id === 'esempio-coda')));
    const course = JSON.parse(fs.readFileSync(path.join(dir, 'course.json'))); course.scene = [...course.scene, 'source/scene/prova.json'];
    fs.writeFileSync(path.join(dir, 'course.json'), JSON.stringify(course));
    const game = JSON.parse(buildLaika(dir, { write: false }));
    assert.equal(game.palette.paper, temi.temi[course.tema].paper);
    assert.ok(game.stages.some(s => s.id === 'esempio-coda'));
    validatePack(game);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('kit futuri: id semantici e data-pivot diventano parti animabili, anche negli elementi', async () => {
  const {markupToLayers} = await import('../bottega/strumenti/svg-in-layer.js');
  const layers = markupToLayers('<g><rect x="0" y="-10" width="20" height="10" fill="blue"/><path id="telo" data-pivot="0 -30" d="M 0,-30 L 20,-25 L 0,-20 Z" fill="red"/><polygon points="0,0 4,0 2,-3" fill="ink"/></g>', { prefix: 'f' });
  const telo = layers.find(l => l.id === 'telo');
  assert.deepEqual(telo.origin, [0, -30]); assert.equal(layers.find(l => l.tag === 'path' && l.id !== 'telo').attrs.d, 'M0 0 L4 0 L2 -3 Z');
  assert.throws(() => markupToLayers('<rect id="Telo" width="1" height="1"/>'), /ID di parte non valido/);
  assert.throws(() => markupToLayers('<image href="x.png"/>'), /Elemento non supportato: image/);
  const libreria = { ...studi, symbols: [...studi.symbols, { id: 'stendardo', layers }] };
  const scena = { id: 'prova-parti', etichetta: 'Uno stendardo che sventola.', elementi: [{ id: 's', simbolo: 'stendardo', x: 100, y: 100 }],
    sequenze: [{ id: 'vento', didascalia: 'Il telo si muove.', passi: [{ azione: 'repeat', chi: 's', parti: { telo: { skewY: 6 } }, cicli: 3 }] }] };
  const out = compilaScena(scena, { libreria });
  const st = composePack({ palette, symbols: out.symbols, stages: [out.stage] }).stages[0];
  validateStage(st, {});
  assert.ok(st.sequences[0].tracks.some(t => t.layer === 's-telo' && t.attribute === 'skewY'));
});
