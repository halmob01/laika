// LAIKA, unità I.1 nella forma a partita (REPERTORIO-GIOCHI §5): struttura, strategie contrastanti,
// bilanciamento senza vicoli ciechi, card con le fonti, salvataggio rigiocato.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validatePack} from '../src/validation/game-pack.js';
import {newSession, currentScene, transition} from '../src/runner/index.js';
import {restore, exportSave} from '../src/storage/index.js';
import {workersOf, targetsOf} from '../src/core/turns.js';
import {matches} from '../src/core/engine.js';
const game = validatePack(JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8')));
const source = JSON.parse(fs.readFileSync(new URL('../games/laika/source/acts/atto-1.json', import.meta.url), 'utf8'));
const NAMES = /anime e semidei/i;
const partita = game.acts[0].episodes.find(e => e.type === 'turn_game');

// Strategie: chi della famiglia va dal signore, chi dai vicini, chi costruisce; il resto al campo.
// La corvée si copre con la combinazione di persone che si avvicina di più all'obbligo (meno «sconto» del furbo).
const STRATEGIE = {
  obbediente: {},
  furbo: {sconto: 1},
  sfrontato: {sconto: 2},
  solidale: {vicini: ['nonno']},
  costruttore: {costruisce: ['nonno']}
};
function corvee(people, need) {
  let best = null;
  for (let m = 0; m < 1 << people.length; m++) {
    const sel = people.filter((_, i) => m >> i & 1), n = sel.reduce((a, w) => a + w.strength, 0);
    if (n >= need && (!best || n * 10 + sel.length < best.score)) best = {sel, score: n * 10 + sel.length};
  }
  return best ? best.sel : people;
}
// Prossima mossa di un episodio che non è la partita: la più semplice che lo completa.
function azione(e, a, answer) {
  if (a.phase !== 'scene') return {type: 'advance'};
  if (e.type === 'assessment') return {type: 'answer', answerId: e.question.id === 'a1-v1' ? answer : e.question.correctId};
  if (e.type === 'choice' || e.type === 'role_crisis') return {type: 'select', choiceId: e.choices[0].id};
  if (e.type === 'resource_allocation') { let left = e.budget; return {type: 'allocate', allocations: Object.fromEntries(e.buckets.map(b => { const n = Math.min(b.max, left); left -= n; return [b.id, n]; }))}; }
  if (e.type === 'source_comparison') { const sv = e.sources.find(x => !a.viewedSources?.includes(e.id + ':' + x.id)) || null; return sv ? {type: 'inspect_source', sourceId: sv.id} : {type: 'select', choiceId: e.choices[0].id}; }
  return {type: 'advance'};
}
function play(name, seed, {check = false, answer = 'liberta'} = {}) {
  let s = newSession(game, seed), k = seed.length, fame = 0;
  const T = (step, x = {}) => { s = transition(game, s, {type: 'turn', step, ...x}).nextState; };
  const st = STRATEGIE[name];
  let fine = null;
  for (let guard = 0; guard < 1200 && !s.complete; guard++) {
    const e = currentScene(game, s), a = s.currentAct;
    if (e.type === 'turn_game' && a.phase === 'scene') {
      const g = a.game;
      if (g.phase === 'cards') T('card');
      else if (g.phase === 'place') {
        const people = workersOf(e, g), aperti = targetsOf(e, g, a).map(x => x.id), need = Math.max(0, (g.rules.min.corvee || 0) - (st.sconto || 0));
        const altrove = w => (st.vicini || []).includes(w.id) || (st.costruisce || []).includes(w.id);
        let liberi = people.filter(w => !altrove(w));
        if (liberi.reduce((n, w) => n + w.strength, 0) < need + 2) liberi = people.filter(w => !(st.vicini || []).includes(w.id));
        const dal = new Set(need ? corvee(liberi, need).map(w => w.id) : []);
        for (const w of people) {
          const lavoro = ['sokha', 'orto', 'stalla', 'bosco'].find(x => aperti.includes(x));
          const dove = dal.has(w.id) ? 'corvee' : (st.vicini || []).includes(w.id) ? 'vicini' : (st.costruisce || []).includes(w.id) && lavoro ? lavoro : 'campo';
          try { T('assign', {workerId: w.id, placeId: dove}); } catch { T('assign', {workerId: w.id, placeId: 'campo'}); }
        }
        if (s.currentAct.resources.grano - s.currentAct.game.reserve - 20 < 0) fame++;
        T('confirm');
      } else if (g.phase === 'event') { const ch = e.turns[g.turn].event.choices.filter(c => !c.when || matches(c.when, a)); k = (k * 7 + 3) % 97; T('choose', {choiceId: ch[k % ch.length].id}); }
      else if (g.phase === 'market') T('leave');
      else T('continue');
    } else {
      if (e.type === 'turn_game') fine = {...a.resources, ...a.metrics, fired: a.game.fired, built: a.game.built, fame};
      s = transition(game, s, azione(e, a, answer)).nextState;
    }
    if (check) { const back = restore(game, exportSave(game, s)); assert.equal(back.ok, true); assert.deepEqual(back.state, s); }
  }
  assert.equal(s.complete, true, name + ' / ' + seed + ': partita non conclusa');
  return {s, fine};
}

test('I.1: cinque strategie arrivano tutte al 1861 e pagano prezzi diversi (nessuna vince su tutto)', () => {
  const runs = Object.fromEntries(Object.keys(STRATEGIE).map(n => [n, Array.from({length: 60}, (_, i) => play(n, 'bil' + i).fine)]));
  const media = (n, key) => runs[n].reduce((a, r) => a + r[key], 0) / 60, quante = (n, f) => runs[n].filter(f).length;
  const [o, f, s, c] = ['obbediente', 'furbo', 'solidale', 'costruttore'].map(n => ({grano: media(n, 'grano'), occhio: media(n, 'occhio'), legami: media(n, 'legami'), fame: media(n, 'fame')}));
  if (process.env.LAIKA_BILANCIA) console.log(JSON.stringify({o, f, s, c, insolenza: quante('sfrontato', r => r.fired.some(x => x.startsWith('insolenza'))), mucca: Object.keys(STRATEGIE).map(n => quante(n, r => r.fired.includes('mucca'))), built: quante('costruttore', r => r.built.length >= 2)}));
  assert.ok(f.grano > o.grano && f.occhio > o.occhio + 20, 'saltare la corvée dà grano ma attira l\'occhio del padrone');
  assert.ok(s.legami > o.legami + 20 && s.grano < o.grano, 'aiutare i vicini costruisce legami e costa grano');
  // Saltare un po' rende poco; saltare molto porta qualcuno in Siberia e alla fine costa grano.
  assert.ok(quante('sfrontato', r => r.fired.some(x => x.startsWith('insolenza'))) > 10, 'chi salta spesso rischia la Siberia');
  assert.ok(media('sfrontato', 'grano') < o.grano, 'saltare molto non conviene');
  assert.equal(quante('obbediente', r => r.fired.some(x => x.startsWith('insolenza'))), 0);
  // Costruire costa fame subito e rende dopo: più anni magri, ma alla fine più grano.
  assert.ok(quante('costruttore', r => r.built.length >= 2) > 50, 'le migliorie si finiscono davvero');
  assert.ok(c.grano > o.grano + 5 && c.fame > o.fame, 'le migliorie rendono, ma prima costano');
  // Nessuna strategia porta sempre alla fame: la mucca venduta resta un rischio, non un destino.
  for (const n of Object.keys(STRATEGIE)) assert.ok(quante(n, r => r.fired.includes('mucca')) < 60, n + ': la mucca si vende sempre');
});

test('I.1: salvataggio rigiocato identico a ogni mossa; verifica formativa raggiungibile', () => {
  const r = play('solidale', 'salvataggio', {check: true});
  assert.equal(r.s.assessmentResults.length, 2, 'una verifica per unità: V1 e V2');
  const q = game.acts[0].episodes.find(e => e.type === 'assessment' && e.question.id === 'a1-v1').question;
  assert.deepEqual(q.requiredExposureFlags, ['a1-manifesto']);
  assert.ok(play('furbo', 'sbagliata', {answer: 'terra'}).s.complete);
});

test('I.1: il manifesto resta leggero da trasferire (gzip)', async () => {
  const {gzipSync} = await import('node:zlib');
  const size = gzipSync(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url))).length;
  assert.ok(size < 150 * 1024, 'game.json compresso: ' + Math.round(size / 1024) + ' KB');
});

test('I.1: i flag non compaiono nelle variazioni mostrate e Legami è un indicatore visibile', async () => {
  const {netChanges} = await import('../src/core/turns.js');
  const net = netChanges([{kind: 'flag', id: 'figlio_via', label: 'figlio_via', before: false, after: true}, {kind: 'metric', id: 'legami', label: 'Legami nel villaggio', before: 40, after: 44}]);
  assert.deepEqual(net.map(c => c.id), ['legami']);
  const act = JSON.parse(fs.readFileSync(new URL('../games/laika/source/acts/atto-1.json', import.meta.url), 'utf8'));
  assert.ok(!act.metrics.find(m => m.id === 'legami').hidden, 'Legami nel villaggio deve essere mostrato');
  const e = act.episodes.find(x => x.type === 'turn_game'), scena = JSON.parse(fs.readFileSync(new URL('../games/laika/source/scene/a1-u1-anno.json', import.meta.url), 'utf8'));
  const ids = new Set(scena.elementi.map(x => x.id));
  for (const p of e.projects) for (const id of Object.values(p.scene || {})) assert.ok(ids.has(id), 'disegno del lavoro mancante nella scena: ' + id);
});

test('I.2: la partita completa passa da mir, città, salario, razzo, corte e volantini fino alla V2', () => {
  const r = play('solidale', 'i2', {check: true});
  const ids = game.acts[0].episodes.filter(e => e.id.startsWith('a1-u2-')).map(e => e.id);
  assert.deepEqual(ids, ['a1-u2-mir', 'a1-u2-citta', 'a1-u2-salario', 'a1-u2-razzo', 'a1-u2-corte', 'a1-u2-volantini', 'a1-u2-ricorda', 'a1-u2-e7']);
  const v2 = game.acts[0].episodes.find(e => e.id === 'a1-u2-e7').question;
  assert.deepEqual(v2.requiredExposureFlags, ['a1-volantini']);
  assert.ok(r.s.complete);
  const forze = game.acts[0].resources.find(x => x.id === 'forze');
  assert.ok(forze && !forze.hidden, 'Forze del figlio è un indicatore visibile');
});
