// I.1 «La settimana del servo»: il giudizio dell'anno non contraddice quello che è successo (revisione del 4 novembre 2026).
// Se in un anno il grano è finito prima del raccolto (la mucca venduta, i vicini, il figlio via) il giudizio è uno solo e lo dice;
// se non è successo, il giudizio non parla di grano finito.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition, currentScene} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const e = game.acts[0].episodes.find(x => x.id === 'a1-servitu-settimana');
const GRANO = new Set(['mucca', 'vicini', 'lontano']);
function anni(seme, scorta, salta) {
  let s = newSession(game, seme);
  const T = (step, x = {}) => { s = transition(game, s, {type: 'turn', step, ...x}).nextState; };
  while (currentScene(game, s).type !== 'turn_game') s = transition(game, s, {type: 'advance'}).nextState;
  const g = () => s.currentAct.game, out = [];
  while (g().phase !== 'done') {
    while (g().phase === 'cards') T('card');
    if (g().phase === 'place') {
      while (g().reserve > scorta) T('reserve', {delta: -1});
      const vivi = e.workers.filter(w => !(g().rules.workers[w.id]?.away));
      const piani = salta ? {padre: 'campo', madre: 'campo', nonno: 'campo', figlio: 'campo'} : {padre: 'corvee', madre: 'corvee', nonno: 'campo', figlio: 'campo'};
      for (const w of vivi) { try { T('assign', {workerId: w.id, placeId: piani[w.id]}); } catch { /* posto non disponibile */ } }
      T('confirm');
      const r = g().result;
      out.push({anno: e.turns[g().turn].label, crisi: r.crises.map(c => c.id), verdetto: r.verdict});
    } else if (g().phase === 'result') T('continue');
    else if (g().phase === 'event') T('choose', {choiceId: e.turns[g().turn].event.choices.find(c => !c.when)?.id || e.turns[g().turn].event.choices[0].id});
    else if (g().phase === 'eventResult') T('continue');
    else if (g().phase === 'market') T('leave');
    else break;
  }
  return out;
}
test('Il servo: il giudizio dell\'anno dice la fame quando il grano è finito prima del raccolto, e solo allora', () => {
  let con = 0, senza = 0;
  for (const seme of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) for (const scorta of [0, 15]) for (const salta of [false, true]) for (const x of anni(seme, scorta, salta)) {
    const fame = x.crisi.some(c => GRANO.has(c));
    if (fame) { con++; assert.equal(x.verdetto.stamp, 'Fame', x.anno + ': grano finito, ma il giudizio è «' + x.verdetto.text + '»'); assert.match(x.verdetto.text, /Il grano è finito/); }
    else { senza++; assert.doesNotMatch(x.verdetto.text, /Il grano è finito:/, x.anno + ': nessuna crisi del grano, ma il giudizio parla di grano finito'); }
  }
  assert.ok(con > 0 && senza > 0, 'servono anni con e senza la fame: con ' + con + ', senza ' + senza);
});
test('Il servo: i lavori lunghi stanno in un pannello e le etichette restano dentro la scena', () => {
  const src = fs.readFileSync(new URL('../src/interactions/index.js', import.meta.url), 'utf8');
  assert.match(src, /class:'turn-projects'/, 'i lavori lunghi in un pannello');
  assert.match(src, /function keepInside/, 'le etichette restano dentro la scena');
});
