// I.2 «Il mir»: bilanciamento del gioco con il motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/mir.md): nessuna strategia è la migliore su tutti i gruppi insieme (le strisce
// sono sei e ogni striscia assegnata a un gruppo non va a un altro); si può tenere insieme il villaggio senza crisi; ogni crisi si può
// provocare; ogni risposta e ogni posto servono; il raccolto e l'esattore sono rischi con probabilità scritta.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const ep = game.acts[0].episodes.find(e => e.id === 'a1-mir-assemblea');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;
const PIANI = {
  bisogno: { numerose: 3, soli: 2, riscatto: 1 },
  merito: { curato: 3, numerose: 1, soli: 1, riscatto: 1 },
  cassa: { riscatto: 4, curato: 1, soli: 1 },
  trascura: { numerose: 2, curato: 2, riscatto: 2 }
};
const NOMI = Object.keys(PIANI);
function gioca(blocchi, politica, seed) {
  let s = newSession(game, seed, ep.id), n = 0;
  while (s.currentAct.game.phase !== 'done' && s.currentAct.phase === 'scene' && n++ < 400) {
    const g = s.currentAct.game, turno = g.turn;
    if (g.phase === 'cards') s = t(s, 'card');
    else if (g.phase === 'place') {
      for (const [p, k] of Object.entries(PIANI[blocchi[Math.floor(turno / 2)]])) for (let i = 0; i < k; i++) s = t(s, 'place', { placeId: p, delta: 1 });
      s = t(s, 'confirm');
    } else if (g.phase === 'result') s = t(s, 'continue');
    else if (g.phase === 'event') { const ch = ep.turns[turno].event.choices; s = t(s, 'choose', { choiceId: ch[Math.min(politica, ch.length - 1)].id }); }
    else if (g.phase === 'eventResult') s = t(s, 'continue');
    else break;
  }
  const m = s.currentAct.metrics, f = s.currentAct.flags, gm = s.currentAct.game;
  return { ok: s.currentAct.phase === 'outcome', numerose: m.numerose, curato: m.curato, soli: m.soli, cassa: m.cassa, figlio: f.figlio_in_citta, crisi: gm.fired.length, fired: gm.fired.join() };
}
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) for (const d of NOMI) STRATEGIE.push([a, b, c, d]);
const risultati = [0, 1, 2].map(politica => ({ politica, r: STRATEGIE.map(st => {
  const out = ['a', 'b'].map(seed => gioca(st, politica, 'mir-' + seed));
  const media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { st, ok: out.every(x => x.ok), numerose: media('numerose'), curato: media('curato'), soli: media('soli'), cassa: media('cassa'), crisi: media('crisi'), fired: out.map(x => x.fired).join('|'), figlio: out.some(x => x.figlio) };
}) }));

if (process.env.LAIKA_RAPPORTO) for (const { politica, r } of risultati) {
  console.log('Politica', politica);
  for (const nome of NOMI) { const x = r.find(y => y.st.every(p => p === nome)); console.log('  ' + nome.padEnd(8), [x.numerose, x.curato, x.soli, x.cassa, x.crisi].map(v => String(Math.round(v)).padStart(5)).join(''), x.fired); }
}

test('Il mir: tutte le strategie arrivano in fondo', () => {
  for (const { r } of risultati) for (const x of r) assert.ok(x.ok, x.st.join('/'));
});
test('Il mir: nessuna strategia è la migliore su tutti i gruppi insieme', () => {
  for (const { politica, r } of risultati) {
    const best = {};
    for (const k of ['numerose', 'curato', 'soli', 'cassa']) best[k] = Math.max(...r.map(x => x[k]));
    const tutti = r.filter(x => ['numerose', 'curato', 'soli', 'cassa'].every(k => x[k] >= best[k] - 1e-9));
    assert.equal(tutti.length, 0, 'politica ' + politica + ': strategia ottima su tutto: ' + (tutti[0]?.st || []).join('/'));
  }
});
test('Il mir: si può tenere insieme il villaggio, ma ogni scelta ha un prezzo; ogni crisi si può provocare', () => {
  const tutte = risultati.flatMap(x => x.r);
  assert.ok(tutte.some(x => x.crisi === 0), 'esiste una strategia senza crisi');
  assert.ok(tutte.some(x => x.crisi > 0), 'esiste una strategia che provoca crisi');
  for (const id of ['figlio-parte', 'lotto-trascurato', 'soli-mantenuti', 'esattore']) assert.ok(tutte.some(x => x.fired.includes(id)), id + ': nessuna strategia la provoca');
  assert.ok(tutte.some(x => x.figlio) && tutte.some(x => !x.figlio), 'il figlio parte solo in alcune partite');
  // Strategie diverse, esiti diversi.
  for (const { r } of risultati) assert.ok(new Set(r.map(x => [x.numerose, x.curato, x.soli, x.cassa].map(v => Math.round(v / 10)).join(':'))).size >= 8, 'esiti troppo simili');
});
test('Il mir: ogni posto e ogni risposta servono, i rischi sono scritti prima, D-006', () => {
  const nelPiano = new Set(Object.values(PIANI).flatMap(p => Object.keys(p)));
  for (const p of ep.places) assert.ok(nelPiano.has(p.id), p.id + ': nessun piano la usa');
  assert.equal(ep.tokens, 6);
  assert.equal(ep.rules.min.riscatto, 1, 'la cassa del riscatto è un obbligo comune');
  assert.ok(ep.control.chance.base > 0 && ep.control.chance.base < 1, 'l\'esattore ha una probabilità scritta');
  assert.ok(ep.luck.length >= 3 && ep.luck.every(l => l.weight > 0), 'il raccolto ha probabilità scritte');
  for (const turn of ep.turns) for (const c of turn.event.choices) assert.doesNotMatch(c.label + ' ' + (c.text || ''), /sparar|reprimer|denunci/i);
  assert.ok(ep.shows.length >= 2 && ep.shows.length <= 5);
  assert.ok(ep.turns.length >= 3);
});
