// II.3 «Le tre stagioni delle concessioni»: bilanciamento con il motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/concessioni.md): nessuna strategia è la migliore su tutti gli indicatori insieme
// (carta, poteri veri, piazza, reazione dello zar); la scelta fatta nel soviet (il flag tratta_prefetto) apre azioni diverse e porta a
// esiti diversi; ogni azione serve; le etichette sulla scena non si sovrappongono.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const act = game.acts[1], ep = act.episodes.find(e => e.id === 'a2-concessioni-gioco');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;
const PIANI = {
  carta: ['chiedere', 'duma'],
  piazza: ['piazza', 'piazza', 'piazza', 'piazza'],
  trattare: ['ministro', 'duma', 'chiedere', 'piazza'],
  minaccia: ['sciopero', 'piazza', 'duma', 'chiedere'],
  tutto: ['chiedere', 'piazza', 'duma', 'ministro', 'sciopero']
};
const NOMI = Object.keys(PIANI);
const aperta = (s, off) => {
  const w = off.when; if (!w) return true;
  return w.op === 'flag' ? s.currentAct.flags[w.id] === w.value : false;
};
function stagione(s, piano) {
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  for (const o of piano) {
    const g = s.currentAct.game, off = ep.turns[g.turn].market.offers.find(x => x.id === o);
    if (!aperta(s, off) || (off.cost ?? 1) > g.market.left || (!off.repeat && g.market.bought.includes(o))) continue;
    s = t(s, 'buy', { offerId: o });
  }
  return t(s, 'leave');
}
function una(st, trattato, seme) {
  let s = newSession(game, seme, ep.id);
  s.currentAct.flags.tratta_prefetto = trattato;
  for (const p of st) s = stagione(s, PIANI[p]);
  const q = s.currentAct.metrics;
  return { ok: s.currentAct.phase === 'outcome', carta: q.carta, poteri: q.poteri, piazza: q.piazza, reazione: q.reazione, crisi: s.currentAct.game.fired.length, fired: s.currentAct.game.fired.join() };
}
// La Duma ha una probabilità scritta: ogni strategia si gioca su tre semi e si fa la media.
function partita(st, trattato) {
  const out = ['a', 'b', 'c'].map(seme => una(st, trattato, 'conc-' + seme)), media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { ok: out.every(x => x.ok), carta: media('carta'), poteri: media('poteri'), piazza: media('piazza'), reazione: media('reazione'), crisi: media('crisi'), fired: out.map(x => x.fired).join('|') };
}
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) STRATEGIE.push([a, b, c]);
const risultati = [true, false].map(trattato => ({ trattato, r: STRATEGIE.map(st => ({ st, ...partita(st, trattato) })) }));
const di = (trattato, ...st) => risultati.find(x => x.trattato === trattato).r.find(x => x.st.join() === st.join());

if (process.env.LAIKA_RAPPORTO) for (const { trattato, r } of risultati) {
  console.log('Soviet ha trattato:', trattato);
  for (const nome of NOMI) { const x = r.find(y => y.st.every(p => p === nome)); console.log('  ' + nome.padEnd(10), [x.carta, x.poteri, x.piazza, x.reazione, x.crisi].map(v => String(Math.round(v)).padStart(5)).join(''), x.fired); }
}
test('Le concessioni: tutte le strategie arrivano in fondo', () => {
  for (const { r } of risultati) for (const x of r) assert.ok(x.ok, x.st.join('/'));
});
test('Le concessioni: nessuna strategia è la migliore su tutti gli indicatori insieme', () => {
  const verso = { carta: 1, poteri: 1, piazza: 1, reazione: -1 };
  for (const { trattato, r } of risultati) {
    const best = {};
    for (const k of Object.keys(verso)) best[k] = Math.max(...r.map(x => x[k] * verso[k]));
    const tutti = r.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
    assert.equal(tutti.length, 0, 'soviet ha trattato ' + trattato + ': strategia ottima su tutto: ' + (tutti[0]?.st || []).join('/'));
  }
});
test('Le concessioni: la scelta del soviet apre azioni diverse e porta a esiti diversi', () => {
  const s0 = vero => { let s = newSession(game, 'x', ep.id); s.currentAct.flags.tratta_prefetto = vero; while (s.currentAct.game.phase === 'cards') s = t(s, 'card'); return s; };
  const ministro = ep.turns[0].market.offers.find(o => o.id === 'ministro'), sciopero = ep.turns[0].market.offers.find(o => o.id === 'sciopero');
  assert.ok(aperta(s0(true), ministro) && !aperta(s0(true), sciopero), 'se il soviet ha trattato si apre il ministro e si chiude lo sciopero');
  assert.ok(!aperta(s0(false), ministro) && aperta(s0(false), sciopero), 'se non ha trattato si apre lo sciopero e si chiude il ministro');
  assert.throws(() => t(s0(true), 'buy', { offerId: 'sciopero' }));
  assert.throws(() => t(s0(false), 'buy', { offerId: 'ministro' }));
  // Chi tratta (con il soviet che aveva trattato) tiene bassa la reazione dello zar; chi minaccia (senza trattativa) la alza e allarga la piazza.
  const a = di(true, 'trattare', 'trattare', 'trattare'), b = di(false, 'minaccia', 'minaccia', 'minaccia');
  assert.ok(b.reazione - a.reazione >= 10, 'la minaccia sveglia la reazione: ' + b.reazione + ' contro ' + a.reazione);
  assert.ok(b.piazza > a.piazza, 'la minaccia dà più piazza: ' + b.piazza + ' contro ' + a.piazza);
  assert.ok(new Set(risultati.flatMap(x => x.r).map(x => [x.carta, x.poteri, x.piazza, x.reazione].map(v => Math.round(v / 10)).join(':'))).size >= 10, 'esiti troppo simili');
  // La carta si riempie in fretta (il Manifesto) ma i poteri veri no: sulla carta c'è sempre più che nelle mani.
  for (const { r } of risultati) assert.ok(r.every(x => x.carta >= x.poteri - 5), 'sulla carta c\'è almeno quanto nelle mani');
});
test('Le concessioni: ogni azione serve, le crisi si possono provocare, le etichette non si sovrappongono', () => {
  const nelPiano = new Set(Object.values(PIANI).flat());
  for (const o of ep.turns[0].market.offers) assert.ok(nelPiano.has(o.id), o.id + ': nessun piano la usa');
  for (const turn of ep.turns) assert.equal(turn.market.points, 4);
  const tutte = risultati.flatMap(x => x.r);
  assert.ok(tutte.some(x => x.fired.includes('duma-sciolta')), 'duma-sciolta: nessuna strategia la provoca');
  assert.ok(tutte.some(x => x.fired.includes('carta-vuota')), 'carta-vuota: nessuna strategia la provoca');
  assert.ok(tutte.some(x => x.crisi === 0), 'si arriva in fondo anche senza crisi');
  const duma = ep.turns[0].market.offers.find(o => o.id === 'duma');
  assert.ok(duma.chance.base > 0 && duma.chance.base < 1 && duma.chance.factor > 0, 'la Duma ha una probabilità scritta che cresce con la piazza');
  assert.ok(ep.shows.length >= 2 && ep.shows.length <= 5);
  for (const turn of ep.turns) {
    const at = turn.market.offers.map(o => ({ id: o.id, ...o.at }));
    for (const a of at) for (const b of at) if (a.id < b.id) assert.ok(Math.abs(a.x - b.x) >= 0.2 || Math.abs(a.y - b.y) >= 0.12, 'etichette sovrapposte: ' + a.id + ' e ' + b.id);
    for (const o of turn.market.offers) assert.doesNotMatch(o.label + ' ' + o.text, /sparar|reprimer|denunci|armi/i);
  }
});
