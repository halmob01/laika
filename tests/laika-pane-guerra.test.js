// III.1 «Pane e guerra»: bilanciamento del gioco con il motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/pane-guerra.md): nessuna strategia è la migliore su tutti gli indicatori insieme
// (una strategia composta può battere per poco una semplice); ogni azione serve; strategie diverse portano a esiti diversi;
// il rischio è scritto prima; non fare niente non è la mossa migliore.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const ep = game.acts[2].episodes.find(e => e.id === 'a3-pane-guerra-grano');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;
const PIANI = {
  spremere: ['quota', 'prezzo', 'rapporto', 'rapporto'],
  treni: ['precedenza', 'ispettore', 'ispettore'],
  calma: ['prezzopane', 'dividere', 'rapporto', 'rapporto'],
  niente: []
};
const NOMI = Object.keys(PIANI), EVENTI = ['cede', 'rifiuta'];
function gioca(piani, pane, evento, seed) {
  let s = newSession(game, seed, ep.id);
  s.currentAct.metrics.pane_citta = pane;
  for (const p of piani) {
    while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
    s = t(s, 'choose', { choiceId: evento }); s = t(s, 'continue');
    for (const o of PIANI[p]) {
      const g = s.currentAct.game, off = ep.turns[g.turn].market.offers.find(x => x.id === o);
      if ((off.cost ?? 1) > g.market.left || (!off.repeat && g.market.bought.includes(o))) continue;
      s = t(s, 'buy', { offerId: o });
    }
    s = t(s, 'leave');
  }
  const c = s.currentAct.game.chain, m = s.currentAct.metrics;
  return { ok: s.currentAct.phase === 'outcome', pane: m.pane_citta, scarto: m.scarto, voci: m.voci, arrivato: c.real, jam: c.jammed.join() };
}
const PANI = [30, 70];
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) for (const d of NOMI) for (const e of NOMI) STRATEGIE.push([a, b, c, d, e]);
const risultati = PANI.flatMap(pane => EVENTI.map(ev => ({ pane, ev, r: STRATEGIE.map(st => {
  const out = ['a'].map(seed => gioca(st, pane, ev, 'pg-' + seed));
  const media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { st, ok: out.every(x => x.ok), pane: media('pane'), scarto: media('scarto'), voci: media('voci'), arrivato: media('arrivato') };
}) })));

if (process.env.LAIKA_RAPPORTO) {
  for (const { pane, ev, r } of risultati) if (pane === 70) {
    console.log('Pane', pane, 'evento', ev);
    for (const nome of NOMI) { const x = r.find(y => y.st.every(p => p === nome)); console.log('  ' + nome.padEnd(10), [x.pane, x.scarto, x.voci, x.arrivato].map(v => String(Math.round(v)).padStart(5)).join('')); }
  }
}

test('Pane e guerra: tutte le strategie arrivano in fondo', () => {
  for (const { r } of risultati) for (const x of r) assert.ok(x.ok, x.st.join('/'));
});

test('Pane e guerra: nessuna strategia è la migliore su tutti gli indicatori insieme', () => {
  const verso = { pane: 1, scarto: -1, voci: -1, arrivato: 1 };
  for (const { pane, ev, r } of risultati) {
    const best = {};
    for (const k of Object.keys(verso)) best[k] = Math.max(...r.map(x => x[k] * verso[k]));
    const tutti = r.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
    assert.equal(tutti.length, 0, 'pane ' + pane + ', evento ' + ev + ': strategia ottima su tutto: ' + (tutti[0]?.st || []).join('/'));
  }
});

test('Pane e guerra: strategie diverse, esiti diversi; non fare niente non è la mossa migliore', () => {
  for (const { pane, ev, r } of risultati) {
    assert.ok(new Set(r.map(x => Math.round(x.pane / 10) + ':' + Math.round(x.scarto / 10) + ':' + Math.round(x.voci / 10) + ':' + Math.round(x.arrivato / 4))).size >= 8, 'pane ' + pane + ' ' + ev + ': esiti troppo simili');
    const niente = r.find(x => x.st.every(p => p === 'niente'));
    assert.ok(r.some(x => x.pane > niente.pane && x.arrivato > niente.arrivato), 'pane ' + pane + ' ' + ev + ': esiste una strategia che porta più pane e più grano di chi non fa niente');
    const treni = r.find(x => x.st.every(p => p === 'treni'));
    assert.ok(treni.arrivato > niente.arrivato, 'la precedenza ai treni fa arrivare più grano');
    const spremere = r.find(x => x.st.every(p => p === 'spremere'));
    assert.ok(spremere.scarto > treni.scarto, 'gonfiare il rapporto allarga lo scarto');
  }
});

test('Pane e guerra: ogni azione serve, il rischio è scritto prima e i punti sono quattro', () => {
  const ids = ep.turns[0].market.offers.map(o => o.id), nelPiano = new Set(Object.values(PIANI).flat());
  for (const id of ids) assert.ok(nelPiano.has(id), id + ': nessun piano la usa');
  for (const turn of ep.turns) { assert.equal(turn.market.points, 4); assert.deepEqual(turn.market.offers.map(o => o.id), ids); assert.equal(turn.event.choices.length, 2); }
  assert.equal(ep.turns[0].market.offers.find(o => o.id === 'ispettore').chance.base, 0.5, 'l\'ispettore è 5 su 10');
  assert.ok(ep.shows.length >= 2 && ep.shows.length <= 5);
  assert.equal(ep.chain.links.length, 4);
  assert.equal(ep.chain.links.find(l => l.id === 'treni').capacity, 3, 'i treni sono il collo di bottiglia');
  // D-006: nessuna azione riguarda il sparare, reprimere o denunciare.
  for (const o of ep.turns[0].market.offers) assert.doesNotMatch(o.label + ' ' + (o.text || ''), /sparar|reprimer|denunci/i);
});
