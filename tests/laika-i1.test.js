// LAIKA, unità I.1: due itinerari contrastanti, ramo dell'inverno, effetto differito, ripristino.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validatePack} from '../src/validation/game-pack.js';
import {newSession,currentScene,transition} from '../src/runner/index.js';
import {restore,exportSave} from '../src/storage/index.js';
const game = validatePack(JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8')));
const NAMES = /anime e semidei/i;

function play(allocations, choice = 'liberi-senza-terra', answer = 'liberta') {
  let s = newSession(game, 'i1'); const visited = [];
  for (let guard = 0; !s.complete && guard < 80; guard++) {
    const e = currentScene(game, s); if (visited.at(-1) !== e.id) visited.push(e.id);
    let a;
    if (s.currentAct.phase === 'outcome' || e.type === 'narrative') a = {type: 'advance'};
    else if (e.type === 'resource_allocation') a = {type: 'allocate', allocations};
    else if (e.type === 'source_comparison') {
      const next = e.sources.find(x => !s.currentAct.viewedSources.includes(e.id + ':' + x.id));
      a = next ? {type: 'inspect_source', sourceId: next.id} : {type: 'select', choiceId: e.id === 'a1-u1-e6' ? choice : e.choices[0].id};
    } else if (e.type === 'assessment') a = {type: 'answer', answerId: answer};
    s = transition(game, s, a).nextState;
    const back = restore(game, exportSave(game, s)); assert.equal(back.ok, true); assert.deepEqual(back.state, s);
  }
  assert.equal(s.complete, true); return {s, visited};
}

test('I.1: struttura, testi senza titolo di lavoro, scene collegate', () => {
  const act = game.acts[0];
  assert.equal(game.acts.length, 1);
  assert.deepEqual(act.episodes.map(e => e.id), ['a1-u1-e1', 'a1-u1-e2', 'a1-u1-e3', 'a1-u1-e4', 'a1-u1-e4-pieno', 'a1-u1-e4-magro', 'a1-u1-e5', 'a1-u1-e6', 'a1-u1-e7']);
  for (const e of act.episodes) {
    assert.ok(game.stages.some(st => st.id === e.stageId), e.id + ' senza scena');
    assert.ok(e.context, e.id + ' senza cartiglio');
    assert.doesNotMatch(e.title + e.text + (e.visualExplanation || ''), NAMES, e.id);
  }
  assert.doesNotMatch(act.title + act.reconciliation, NAMES);
});

test('I.1: priorità al campo → inverno pieno; obbedienza → inverno magro', () => {
  const pieno = play({campo: 5, corvee: 1, attrezzi: 0});
  assert.ok(pieno.visited.includes('a1-u1-e4-pieno') && !pieno.visited.includes('a1-u1-e4-magro'));
  const magro = play({campo: 3, corvee: 3, attrezzi: 0});
  assert.ok(magro.visited.includes('a1-u1-e4-magro') && !magro.visited.includes('a1-u1-e4-pieno'));
  const snap = r => r.s.historySnapshots[0].state;
  assert.ok(snap(pieno).metrics.tensione > snap(magro).metrics.tensione, 'tenere il tempo per sé alza la tensione');
});

test('I.1: gli attrezzi maturano una volta nel Manifesto e lo spiega il diario', () => {
  const con = play({campo: 3, corvee: 2, attrezzi: 1}), senza = play({campo: 4, corvee: 2, attrezzi: 0});
  const events = r => r.s.journal.flatMap(j => j.events).filter(e => e.type === 'delayed');
  assert.equal(events(con).length, 1); assert.match(events(con)[0].text, /attrezzi/i);
  assert.equal(events(senza).length, 0);
  assert.equal(con.s.historySnapshots[0].state.resources.sussistenza, 50 + 15 - 15 + 10 - 10);
});

test('I.1: la verifica V1 è raggiungibile solo dopo il Manifesto ed è formativa', () => {
  const ok = play({campo: 3, corvee: 3, attrezzi: 0}), no = play({campo: 3, corvee: 3, attrezzi: 0}, 'tutto', 'terra');
  const q = game.acts[0].episodes.find(e => e.id === 'a1-u1-e7').question;
  assert.deepEqual(q.requiredExposureFlags, ['a1-manifesto']);
  assert.notEqual(ok.s.ledger.at(-1), undefined); assert.ok(no.s.complete);
});

test('I.1: il manifesto resta leggero da trasferire (gzip)', async () => {
  const {gzipSync} = await import('node:zlib');
  const size = gzipSync(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url))).length;
  assert.ok(size < 150 * 1024, 'game.json compresso: ' + Math.round(size / 1024) + ' KB');
});
