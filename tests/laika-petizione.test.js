// II.1 «La petizione»: bilanciamento con il motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/petizione.md): nessuna strategia è la migliore su tutti gli indicatori insieme
// (firme, righe di richieste, Gapon e polizia si contendono le sei ore); strategie diverse portano a petizioni diverse; ogni posto serve;
// le crisi si possono provocare; i rischi sono scritti prima.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const act = game.acts[1], ep = act.episodes.find(e => e.id === 'a2-petizione-righe');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;
const PIANI = {
  firme: [['firme', 3], ['gapon', 2], ['salario', 1]],
  economica: [['firme', 1], ['salario', 3], ['polizia', 2]],
  politica: [['firme', 1], ['libera', 3], ['pace', 2]],
  gapon: [['firme', 1], ['gapon', 3], ['polizia', 2]],
  senzafirme: [['gapon', 3], ['polizia', 2], ['pace', 1]],
  tutto: [['firme', 1], ['salario', 1], ['libera', 1], ['pace', 1], ['gapon', 1], ['polizia', 1]]
};
const NOMI = Object.keys(PIANI);
function gioca(st, politica, seme) {
  let s = newSession(game, seme, ep.id), n = 0;
  while (s.currentAct.game.phase !== 'done' && s.currentAct.phase === 'scene' && n++ < 200) {
    const g = s.currentAct.game, turno = g.turn;
    if (g.phase === 'cards') s = t(s, 'card');
    else if (g.phase === 'place') {
      let resto = g.rules.tokens; const dati = {};
      for (const [p, k] of PIANI[st[turno]]) { const x = Math.min(k, resto, ep.places.find(q => q.id === p).max); dati[p] = (dati[p] || 0) + x; resto -= x; }
      if (st[turno] !== 'senzafirme') dati.firme = Math.min(3, (dati.firme || 0) + resto);
      let tot = Object.values(dati).reduce((a, b) => a + b, 0);
      for (const p of ['polizia', 'gapon', 'salario', 'pace']) { while (tot < g.rules.tokens && (dati[p] || 0) < ep.places.find(q => q.id === p).max) { dati[p] = (dati[p] || 0) + 1; tot++; } }
      for (const [p, k] of Object.entries(dati)) for (let i = 0; i < k; i++) s = t(s, 'place', { placeId: p, delta: 1 });
      s = t(s, 'confirm');
    } else if (g.phase === 'result') s = t(s, 'continue');
    else if (g.phase === 'event') { const ch = ep.turns[turno].event.choices; s = t(s, 'choose', { choiceId: ch[Math.min(politica, ch.length - 1)].id }); }
    else if (g.phase === 'eventResult') s = t(s, 'continue');
    else break;
  }
  const q = s.currentAct.metrics, gm = s.currentAct.game;
  return { ok: s.currentAct.phase === 'outcome', consenso: q.consenso, fiducia: q.fiducia_zar, polizia: q.polizia, eco: q.pet_eco, pol: q.pet_pol, pace: q.pet_pace, crisi: gm.fired.length, fired: gm.fired.join(), verdetto: gm.result?.verdict?.stamp };
}
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) STRATEGIE.push([a, b, c]);
const risultati = [0, 1].map(politica => ({ politica, r: STRATEGIE.map(st => {
  const out = ['a', 'b', 'c'].map(seme => gioca(st, politica, 'pet-' + seme));
  const media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { st, ok: out.every(x => x.ok), consenso: media('consenso'), fiducia: media('fiducia'), polizia: media('polizia'), eco: media('eco'), pol: media('pol'), pace: media('pace'), crisi: media('crisi'), fired: out.map(x => x.fired).join('|'), verdetti: out.map(x => x.verdetto) };
}) }));

if (process.env.LAIKA_RAPPORTO) for (const { politica, r } of risultati) {
  console.log('Politica', politica);
  for (const nome of NOMI) { const x = r.find(y => y.st.every(p => p === nome)); console.log('  ' + nome.padEnd(10), [x.consenso, x.fiducia, x.polizia, x.eco, x.pol, x.pace, x.crisi].map(v => String(Math.round(v)).padStart(5)).join(''), x.fired, x.verdetti.join()); }
}
test('La petizione: tutte le strategie arrivano a domenica', () => {
  for (const { r } of risultati) for (const x of r) assert.ok(x.ok, x.st.join('/'));
});
test('La petizione: nessuna strategia è la migliore su tutti gli indicatori insieme', () => {
  const verso = { consenso: 1, polizia: -1, eco: 1, pol: 1, pace: 1 };
  for (const { politica, r } of risultati) {
    const best = {};
    for (const k of Object.keys(verso)) best[k] = Math.max(...r.map(x => x[k] * verso[k]));
    const tutti = r.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
    assert.equal(tutti.length, 0, 'politica ' + politica + ': strategia ottima su tutto: ' + (tutti[0]?.st || []).join('/'));
  }
});
test('La petizione: strategie diverse portano a petizioni diverse e ogni crisi si può provocare', () => {
  for (const { r } of risultati) {
    assert.ok(new Set(r.map(x => [x.eco, x.pol, x.pace, x.consenso, x.polizia].map(v => Math.round(v / 15)).join(':'))).size >= 10, 'esiti troppo simili');
    const stamps = new Set(r.flatMap(x => x.verdetti));
    assert.ok(stamps.size >= 3, 'giudizi diversi: ' + [...stamps].join());
  }
  const tutte = risultati.flatMap(x => x.r);
  for (const id of ['arresti', 'sciopero-stanco']) assert.ok(tutte.some(x => x.fired.includes(id)), id + ': nessuna strategia la provoca');
  assert.ok(tutte.some(x => x.crisi === 0), 'si arriva a domenica senza crisi');
  // Chi punta tutto sulla politica attira la polizia più di chi punta sul salario.
  const pol = risultati[0].r.find(x => x.st.every(p => p === 'politica')), eco = risultati[0].r.find(x => x.st.every(p => p === 'economica'));
  assert.ok(pol.polizia > eco.polizia && pol.pol > eco.pol && eco.eco > pol.eco, 'la politica costa attenzione della polizia; ogni scelta ha il suo prezzo');
});
test('La petizione: ogni posto serve, i rischi sono scritti prima, i punti sono sei', () => {
  const nelPiano = new Set(Object.values(PIANI).flatMap(p => p.map(x => x[0])));
  for (const p of ep.places) assert.ok(nelPiano.has(p.id), p.id + ': nessun piano la usa');
  assert.equal(ep.tokens, 6);
  assert.equal(ep.hotspotNames, true, 'i punti sulla scena dicono il nome del posto');
  for (const p of ep.places) assert.ok(p.short && p.short.length <= 9, p.id + ': nome breve del punto sulla scena');
  assert.equal(ep.rules.min.firme, 1, 'almeno un\'ora di firme');
  assert.ok(ep.control.chance.base > 0 && ep.control.chance.base < 1);
  assert.ok(ep.luck.length >= 3 && ep.luck.every(l => l.weight > 0));
  assert.ok(ep.turns.some(x => x.event.choices.some(c => c.chance)), 'una scelta con probabilità scritta');
  assert.ok(ep.turns.length >= 3 && ep.shows.length >= 2 && ep.shows.length <= 5);
  for (const turn of ep.turns) for (const c of turn.event.choices) assert.doesNotMatch(c.label + ' ' + (c.text || ''), /sparar|reprimer|denunci|armi/i);
  const at = ep.places.map(p => ({ id: p.id, x: p.x, y: p.y }));
  for (const a of at) for (const b of at) if (a.id < b.id) assert.ok(Math.abs(a.x - b.x) >= 0.2 || Math.abs(a.y - b.y) >= 0.12, 'etichette sovrapposte: ' + a.id + ' e ' + b.id);
});
