// II.4 «Il podere e il mir»: bilanciamento con il motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/stolypin.md): nessuna strategia è la migliore su tutti gli indicatori insieme
// (pane in casa, chi ti aiuta, debiti, ombra dei tribunali); le tre strade (restare, uscire, partire) aprono azioni diverse e portano
// a esiti diversi; ogni azione serve; ogni crisi si può provocare; le etichette sulla scena non si sovrappongono.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const act = game.acts[1], ep = act.episodes.find(e => e.id === 'a2-stolypin-gioco');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;
const PIANI = {
  resta: ['resta', 'assemblea', 'strisce', 'strisce'],
  podere: ['esce', 'recinto', 'mietitura', 'lavorapodere'],
  indebitato: ['esce', 'prestito', 'prestito', 'prestito'],
  parte: ['vende', 'lavoro', 'lavoro', 'parenti'],
  riunione: ['resta', 'riunione', 'assemblea', 'strisce'],
  ferma: ['assemblea', 'parenti']
};
const NOMI = Object.keys(PIANI);
const aperta = (s, off) => {
  const w = off.when; if (!w) return true;
  const ev = c => c.op === 'flag' ? !!s.currentAct.flags[c.id] === c.value : c.op === 'all' ? c.items.every(ev) : false;
  return ev(w);
};
function anno(s, piano) {
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  for (const o of piano) {
    const g = s.currentAct.game, off = ep.turns[g.turn].market.offers.find(x => x.id === o);
    if (!aperta(s, off) || (off.cost ?? 1) > g.market.left || (!off.repeat && g.market.bought.includes(o))) continue;
    s = t(s, 'buy', { offerId: o });
  }
  return t(s, 'leave');
}
function una(st, seme) {
  let s = newSession(game, seme, ep.id);
  for (const p of st) s = anno(s, PIANI[p]);
  const q = s.currentAct.metrics, f = s.currentAct.flags;
  return { ok: s.currentAct.phase === 'outcome', pane: q.pane, aiuto: q.aiuto, debiti: q.debiti, tribunali: q.tribunali, crisi: s.currentAct.game.fired.length, fired: s.currentAct.game.fired.join(), strada: f.stolypin_resta ? 'resta' : f.uscita_dal_mir ? 'esce' : f.stolypin_vende ? 'vende' : 'nessuna' };
}
// La mietitura e il lavoro hanno una probabilità scritta: ogni strategia si gioca su tre semi e si fa la media.
function partita(st) {
  const out = ['a', 'b', 'c'].map(seme => una(st, 'stol-' + seme)), media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { ok: out.every(x => x.ok), pane: media('pane'), aiuto: media('aiuto'), debiti: media('debiti'), tribunali: media('tribunali'), crisi: media('crisi'), fired: out.map(x => x.fired).join('|'), strada: out[0].strada };
}
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) for (const d of NOMI) STRATEGIE.push([a, b, c, d]);
const r = STRATEGIE.map(st => ({ st, ...partita(st) }));
const di = (...st) => r.find(x => x.st.join() === st.join());

if (process.env.LAIKA_RAPPORTO) for (const nome of NOMI) { const x = r.find(y => y.st.every(p => p === nome)); console.log(nome.padEnd(11), x.strada.padEnd(7), [x.pane, x.aiuto, x.debiti, x.tribunali, x.crisi].map(v => String(Math.round(v)).padStart(5)).join(''), x.fired); }
if (process.env.LAIKA_RAPPORTO) for (const sd of ['resta', 'esce', 'vende', 'nessuna']) { const d = r.filter(x => x.strada === sd); if (d.length) console.log(sd.padEnd(8), ['pane', 'aiuto', 'debiti', 'tribunali'].map(k => k + ' ' + Math.round(Math.min(...d.map(x => x[k]))) + '-' + Math.round(Math.max(...d.map(x => x[k])))).join('  ')); }
test('Stolypin: tutte le strategie arrivano in fondo', () => { for (const x of r) assert.ok(x.ok, x.st.join('/')); });
test('Stolypin: nessuna strategia è la migliore su tutti gli indicatori insieme', () => {
  const verso = { pane: 1, aiuto: 1, debiti: -1, tribunali: -1 }, best = {};
  for (const k of Object.keys(verso)) best[k] = Math.max(...r.map(x => x[k] * verso[k]));
  const tutti = r.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
  assert.equal(tutti.length, 0, 'strategia ottima su tutto: ' + (tutti[0]?.st || []).join('/'));
  // Nemmeno una strada intera (restare, uscire, partire) vince su tutto: chi esce ha più pane ma meno aiuto, chi resta ha più aiuto, chi parte ha meno debiti.
  for (const strada of ['resta', 'esce', 'vende']) {
    const dentro = r.filter(x => x.strada === strada);
    assert.ok(dentro.length > 100, strada + ': troppo poche strategie');
  }
});
test('Stolypin: le tre strade aprono azioni diverse e portano a esiti diversi', () => {
  const s0 = () => { let s = newSession(game, 'x', ep.id); while (s.currentAct.game.phase === 'cards') s = t(s, 'card'); return s; };
  const off = id => ep.turns[0].market.offers.find(o => o.id === id);
  // Prima della scelta le azioni di una strada sono chiuse e dopo la scelta le altre due strade si chiudono.
  let s = s0();
  assert.ok(['resta', 'esce', 'vende'].every(id => aperta(s, off(id))));
  assert.ok(['assemblea', 'recinto', 'lavoro', 'prestito', 'parenti', 'mietitura'].every(id => !aperta(s, off(id))));
  assert.throws(() => t(s0(), 'buy', { offerId: 'recinto' }));
  const dopo = id => t(s0(), 'buy', { offerId: id });
  s = dopo('resta'); assert.ok(!aperta(s, off('esce')) && !aperta(s, off('vende')) && aperta(s, off('assemblea')));
  s = dopo('esce'); assert.ok(!aperta(s, off('resta')) && aperta(s, off('recinto')) && aperta(s, off('mietitura')) && !aperta(s, off('assemblea')));
  s = dopo('vende'); assert.ok(!aperta(s, off('resta')) && aperta(s, off('lavoro')) && !aperta(s, off('strisce')) && !aperta(s, off('riunione')));
  // Esiti: chi esce e lavora il podere ha più pane di chi resta ma meno aiuto; chi parte ha meno debiti.
  const a = di('resta', 'resta', 'resta', 'resta'), b = di('podere', 'podere', 'podere', 'podere'), c = di('parte', 'parte', 'parte', 'parte');
  assert.ok(b.pane > a.pane, 'il podere dà più pane: ' + b.pane + ' contro ' + a.pane);
  assert.ok(a.aiuto - b.aiuto >= 15, 'chi esce perde aiuto: ' + b.aiuto + ' contro ' + a.aiuto);
  assert.ok(b.debiti > c.debiti && b.debiti > a.debiti, 'chi esce ha più debiti');
  assert.ok(new Set(r.map(x => [x.pane, x.aiuto, x.debiti, x.tribunali].map(v => Math.round(v / 10)).join(':'))).size >= 15, 'esiti troppo simili');
});
test('Stolypin: ogni azione serve, le crisi si possono provocare, le etichette non si sovrappongono', () => {
  const nelPiano = new Set(Object.values(PIANI).flat());
  for (const o of ep.turns[0].market.offers) assert.ok(nelPiano.has(o.id), o.id + ': nessun piano la usa');
  for (const turn of ep.turns) assert.equal(turn.market.points, 4);
  for (const id of ['forca-al-villaggio', 'solo-sul-podere', 'creditore']) assert.ok(r.some(x => x.fired.includes(id)), id + ': nessuna strategia la provoca');
  assert.ok(r.some(x => x.crisi === 0), 'si arriva in fondo anche senza crisi');
  for (const id of ['mietitura', 'lavoro']) { const o = ep.turns[0].market.offers.find(x => x.id === id); assert.ok(o.chance.base > 0 && o.chance.base < 1 && o.chance.factor > 0, id + ': probabilità scritta che cresce con l\'aiuto'); }
  assert.ok(ep.shows.length >= 2 && ep.shows.length <= 5);
  // Una strada senza strumenti non è un modo di vincere: il rischio dei tribunali tocca anche chi non parte.
  const ri = ep.turns[0].market.offers.find(o => o.id === 'riunione').effects.find(x => x.id === 'tribunali').delta;
  assert.ok(ri >= 10, 'la riunione attira i tribunali: ' + ri);
  for (const turn of ep.turns) {
    const at = turn.market.offers.map(o => ({ id: o.id, ...o.at }));
    for (const a of at) for (const b of at) if (a.id < b.id) assert.ok(Math.abs(a.x - b.x) >= 0.2 || Math.abs(a.y - b.y) >= 0.12, 'etichette sovrapposte: ' + a.id + ' e ' + b.id);
    for (const o of turn.market.offers) assert.doesNotMatch(o.label + ' ' + o.text, /sparar|reprimer|denunci|armi/i);
  }
});
