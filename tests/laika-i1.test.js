// LAIKA, unità I.1 nella forma a partita (REPERTORIO-GIOCHI §5): struttura, strategie contrastanti,
// bilanciamento senza vicoli ciechi, card con le fonti, salvataggio rigiocato.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validatePack} from '../src/validation/game-pack.js';
import {newSession, currentScene, transition} from '../src/runner/index.js';
import {restore, exportSave} from '../src/storage/index.js';
const game = validatePack(JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8')));
const source = JSON.parse(fs.readFileSync(new URL('../games/laika/source/acts/atto-1.json', import.meta.url), 'utf8'));
const NAMES = /anime e semidei/i;
const partita = game.acts[0].episodes.find(e => e.type === 'turn_game');

// Strategie: quanti giorni dare al signore e ai vicini; il resto al campo. Le risposte a chi bussa ruotano.
const STRATEGIE = {
  obbediente: g => ({corvee: g.rules.min.corvee || 0}),
  furbo: g => ({corvee: Math.max(0, (g.rules.min.corvee || 0) - 2)}),
  solidale: g => ({corvee: g.rules.min.corvee || 0, vicini: 1})
};
function play(name, seed, {check = false, answer = 'liberta'} = {}) {
  let s = newSession(game, seed), k = seed.length;
  const T = (step, x = {}) => { s = transition(game, s, {type: 'turn', step, ...x}).nextState; };
  let fine = null;
  for (let guard = 0; guard < 600 && !s.complete; guard++) {
    const e = currentScene(game, s), a = s.currentAct;
    if (e.type === 'turn_game' && a.phase === 'scene') {
      const g = a.game;
      if (g.phase === 'cards') T('card');
      else if (g.phase === 'place') {
        const plan = STRATEGIE[name](g); let left = g.rules.tokens;
        for (const id of ['corvee', 'vicini']) { const n = Math.min(plan[id] || 0, left); for (let i = 0; i < n; i++) T('place', {placeId: id, delta: 1}); left -= n; }
        for (let i = 0; i < left; i++) T('place', {placeId: 'campo', delta: 1});
        T('confirm');
      } else if (g.phase === 'event') { const ch = e.turns[g.turn].event.choices; k = (k * 7 + 3) % 97; T('choose', {choiceId: ch[k % ch.length].id}); }
      else T('continue');
    } else {
      if (e.type === 'turn_game') fine = {...a.resources, ...a.metrics, fired: a.game.fired};
      s = transition(game, s, e.type === 'assessment' && a.phase === 'scene' ? {type: 'answer', answerId: answer} : {type: 'advance'}).nextState;
    }
    if (check) { const back = restore(game, exportSave(game, s)); assert.equal(back.ok, true); assert.deepEqual(back.state, s); }
  }
  assert.equal(s.complete, true, name + ' / ' + seed + ': partita non conclusa');
  return {s, fine};
}

test('I.1: prologo a card, partita, cosa ricordare, verifica; nessun titolo di lavoro', () => {
  const act = game.acts[0];
  assert.deepEqual(act.episodes.map(e => e.type), ['narrative', 'turn_game', 'narrative', 'assessment']);
  assert.equal(act.episodes[0].display, 'cards'); assert.equal(act.episodes[2].display, 'cards');
  assert.equal(partita.turns.length, 8);
  assert.deepEqual(partita.turns.map(t => t.label), ['1740', '1761', '1777', '1787', '1820', '1840', '1842', '1861']);
  for (const e of act.episodes) {
    assert.ok(game.stages.some(st => st.id === e.stageId), e.id + ' senza scena');
    assert.ok(e.context, e.id + ' senza cartiglio');
  }
  const testi = JSON.stringify(act);
  assert.doesNotMatch(testi, NAMES);
  assert.ok([...act.metrics, ...act.resources].filter(d => !d.hidden).length <= 3, 'al massimo tre indicatori visibili');
});

test('I.1: ogni anno ha una card dall\'alto illustrata dal kit e chi bussa; le card documentate citano le fonti', () => {
  const sorgente = source.episodes.find(e => e.type === 'turn_game');
  for (const [i, t] of sorgente.turns.entries()) {
    assert.ok(t.cards.some(c => c.stageId), t.label + ': almeno una card ha una scena della bottega');
    assert.ok(t.event, t.label + ': manca chi bussa');
    for (const c of t.cards) if (c.kind === 'documented' || c.kind === 'source') assert.ok(c.editorial?.fonti?.length, t.label + ' card ' + i + ': fonte non registrata');
  }
  const matrice = fs.readFileSync(new URL('../docs/FONTI-MATRICE-LAIKA.md', import.meta.url), 'utf8');
  for (const id of new Set(sorgente.turns.flatMap(t => t.cards.flatMap(c => c.editorial?.fonti || []))))
    assert.ok(matrice.includes(id), 'fonte ' + id + ' assente dalla matrice');
  assert.equal(JSON.stringify(partita).includes('editorial'), false, 'le note editoriali restano fuori dal runtime');
});

test('I.1: tre strategie arrivano tutte al 1861 e pagano prezzi diversi (nessuna vince su tutto)', () => {
  const media = (name, key) => { let n = 0; for (let i = 0; i < 60; i++) n += play(name, 'bil' + i).fine[key]; return n / 60; };
  const o = {grano: media('obbediente', 'grano'), occhio: media('obbediente', 'occhio'), legami: media('obbediente', 'legami')};
  const f = {grano: media('furbo', 'grano'), occhio: media('furbo', 'occhio'), legami: media('furbo', 'legami')};
  const s = {grano: media('solidale', 'grano'), occhio: media('solidale', 'occhio'), legami: media('solidale', 'legami')};
  assert.ok(f.grano > o.grano && f.occhio > o.occhio + 20, 'saltare la corvée dà grano ma attira l\'occhio del padrone');
  assert.ok(s.legami > o.legami + 20 && s.grano < o.grano, 'aiutare i vicini costruisce legami e costa grano');
  const fired = name => Array.from({length: 60}, (_, i) => play(name, 'bil' + i).fine.fired);
  assert.ok(fired('furbo').filter(x => x.includes('insolenza')).length > 10, 'chi salta spesso rischia il figlio in Siberia');
  assert.equal(fired('obbediente').filter(x => x.includes('insolenza')).length, 0);
});

test('I.1: salvataggio rigiocato identico a ogni mossa; verifica formativa raggiungibile', () => {
  const r = play('solidale', 'salvataggio', {check: true});
  assert.equal(r.s.assessmentResults.length, 1);
  const q = game.acts[0].episodes.find(e => e.type === 'assessment').question;
  assert.deepEqual(q.requiredExposureFlags, ['a1-manifesto']);
  assert.ok(play('furbo', 'sbagliata', {answer: 'terra'}).s.complete);
});

test('I.1: il manifesto resta leggero da trasferire (gzip)', async () => {
  const {gzipSync} = await import('node:zlib');
  const size = gzipSync(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url))).length;
  assert.ok(size < 150 * 1024, 'game.json compresso: ' + Math.round(size / 1024) + ' KB');
});
