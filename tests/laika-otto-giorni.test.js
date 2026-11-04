// III.2 «Otto giorni»: bilanciamento delle due parti con il motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/otto-giorni.md): nessuna strategia è la migliore su tutti gli indicatori
// insieme (una strategia può essere battuta da un'altra, purché ne esista sempre un'altra che vince altrove); la coda si scioglie
// sempre; strategie diverse portano a destinazioni diverse; ogni azione serve in qualche strategia; c'è un rischio con probabilità scritta.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition, advance} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const act = game.acts[2];
const coda = act.episodes.find(e => e.id === 'a3-otto-giorni-coda'), soldato = act.episodes.find(e => e.id === 'a3-otto-giorni-soldato');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;

// I piani di una giornata (con quattro punti): il forno costa due.
const PIANI = {
  calma: ['tessili', 'tessili', 'madri', 'dividere'],
  vyborg: ['vyborg', 'vyborg', 'vyborg', 'vyborg'],
  forno: ['forno', 'forno'],
  misto: ['forno', 'vyborg', 'vyborg'],
  niente: ['ascolta']
};
const NOMI = Object.keys(PIANI);

function giornata(s, piano) {
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  for (const o of piano) {
    const g = s.currentAct.game, off = coda.turns[g.turn].market.offers.find(x => x.id === o);
    if (!off || (off.cost ?? 1) > g.market.left || (!off.repeat && g.market.bought.includes(o))) continue;
    s = t(s, 'buy', { offerId: o });
  }
  return t(s, 'leave');
}
function parte1(strategia, pane, lunga, seed) {
  let s = newSession(game, seed, 'a3-otto-giorni-coda');
  s.currentAct.metrics.pane_citta = pane; s.currentAct.flags.coda_lunga = lunga;
  const dest = {};
  for (const p of strategia) {
    s = giornata(s, PIANI[p]);
    for (const e of s.currentAct.game.queue.last.events) if (e.kind === 'left') dest[e.group] = e.exit + '@' + (s.currentAct.game.turn);
  }
  return { s, dest };
}
function parte2(s) {
  // Il primo gesto della parte 2 fa controllare le crisi (voci e fame): lo stesso gesto per tutti.
  s = advance(game, s);
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  s = t(s, 'buy', { offerId: 'caserma' });
  return s;
}
const m = s => s.currentAct.metrics;

// Le partite si calcolano una volta sola.
const SCENARI = [{ pane: 25, lunga: false }, { pane: 50, lunga: false }, { pane: 50, lunga: true }, { pane: 65, lunga: false }];
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) for (const d of NOMI) STRATEGIE.push([a, b, c, d]);
const usaForno = st => st.includes('forno') || st.includes('misto');
const risultati = SCENARI.map(sc => STRATEGIE.map(st => {
  const semi = usaForno(st) ? ['a', 'b'] : ['a'];
  const out = semi.map(seed => {
    const { s, dest } = parte1(st, sc.pane, sc.lunga, 'otto-' + seed);
    const fine1 = s.currentAct.game.queue, ok = s.currentAct.phase === 'outcome', gone = Object.values(fine1.groups).every(g => g.gone);
    const mm = { ...m(s) }, p2 = parte2(s), q = m(p2);
    return { ok, gone, dest, pane: mm.pane_citta, voci: mm.voci, operai: mm.operai, ordine: mm.ordine, soldati: q.soldati, ordine2: q.ordine, operai2: q.operai };
  });
  const media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { strategia: st, tutteOk: out.every(x => x.ok && x.gone), dest: out.map(x => JSON.stringify(x.dest)), pane: media('pane'), voci: media('voci'), operai: media('operai2'), ordine: media('ordine2'), soldati: media('soldati') };
}));

if (process.env.LAIKA_RAPPORTO) {
  // LAIKA_RAPPORTO=1 node tests/laika-otto-giorni.test.js: per ogni scenario, gli esiti medi di alcune strategie (pane, voci, operai, ordine, soldati dopo il primo gesto della parte 2).
  for (const [i, r] of risultati.entries()) {
    console.log('Scenario', JSON.stringify(SCENARI[i]));
    for (const nome of ['calma,calma,calma,calma', 'vyborg,vyborg,vyborg,vyborg', 'forno,forno,forno,forno', 'niente,niente,niente,niente', 'calma,calma,calma,vyborg', 'misto,misto,misto,misto', 'vyborg,vyborg,forno,forno']) {
      const x = r.find(y => y.strategia.join() === nome);
      console.log('  ' + nome.padEnd(28), [x.pane, x.voci, x.operai, x.ordine, x.soldati].map(v => String(Math.round(v)).padStart(4)).join(''), ' ', x.dest[0]);
    }
  }
}

test('Otto giorni, la coda: tutte le strategie arrivano in fondo e la coda si scioglie sempre', () => {
  for (const r of risultati) for (const x of r) assert.ok(x.tutteOk, 'strategia ' + x.strategia.join('/') + ': la partita non finisce o la coda non si scioglie');
});

test('Otto giorni, la coda: nessuna strategia è la migliore su tutti gli indicatori insieme', () => {
  // Obiettivi in tensione: più pane contro più operai e soldati e un vecchio ordine più debole; voci basse contro voci alte.
  const verso = { pane: 1, voci: -1, operai: 1, ordine: -1, soldati: 1 };
  for (const [i, r] of risultati.entries()) {
    const best = {};
    for (const k of Object.keys(verso)) best[k] = Math.max(...r.map(x => x[k] * verso[k]));
    const tutti = r.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
    assert.equal(tutti.length, 0, 'scenario ' + JSON.stringify(SCENARI[i]) + ': strategia ottima su tutti gli indicatori: ' + (tutti[0]?.strategia || []).join('/'));
  }
});

test('Otto giorni, la coda: strategie diverse portano a destinazioni diverse', () => {
  for (const [i, r] of risultati.entries()) {
    const profili = new Set(r.flatMap(x => x.dest));
    assert.ok(profili.size >= 3, 'scenario ' + JSON.stringify(SCENARI[i]) + ': solo ' + profili.size + ' profili di uscita');
  }
  // La tesi: dove va dipende dalla partita. Chi si limita a calmare manda tutti a casa; chi organizza porta le tessili in fabbrica.
  const calma = risultati[1].find(x => x.strategia.every(p => p === 'calma')), org = risultati[1].find(x => x.strategia.every(p => p === 'vyborg'));
  assert.ok(calma.dest.every(d => !/fabbrica|corteo/.test(d)), 'calmare: tutti a casa');
  assert.ok(org.dest.every(d => /fabbrica/.test(d)), 'organizzare: le tessili tornano in fabbrica');
  // L'ultima giornata è «troppo tardi»: calmare per tre giorni e organizzare l'ultimo non cambia la destinazione.
  const tardi = risultati[1].find(x => x.strategia.join() === 'calma,calma,calma,vyborg');
  assert.ok(tardi.dest.every(d => !/fabbrica|corteo/.test(d)), 'organizzare l\'ultimo giorno è troppo tardi');
});

test('Otto giorni, la coda: ogni azione serve, il rischio è scritto prima e i punti sono quattro', () => {
  const ids = coda.turns[0].market.offers.map(o => o.id);
  const nelPiano = new Set(Object.values(PIANI).flat());
  for (const id of ids) assert.ok(nelPiano.has(id), id + ': nessun piano la usa');
  for (const turn of coda.turns) { assert.equal(turn.market.points, 4); assert.deepEqual(turn.market.offers.map(o => o.id), ids); }
  const forno = coda.turns[0].market.offers.find(o => o.id === 'forno');
  assert.equal(forno.chance.base, 0.5, 'il forno è 5 su 10');
  assert.ok(coda.shows.length >= 2 && coda.shows.length <= 5);
  // Ogni offerta ha un effetto su qualcosa: nessun gesto è solo scena.
  for (const o of coda.turns[0].market.offers) assert.ok((o.effects || o.success?.effects || []).length || o.queue || o.success?.queue, o.id + ': nessun effetto');
});

// --- Parte 2: il soldato che non spara ---
const AZIONI = ['caserma', 'convincere', 'arsenale', 'piazza', 'tauride'];
function giornataSoldato(s, piano) {
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  for (const o of piano) {
    const g = s.currentAct.game, off = soldato.turns[g.turn].market.offers.find(x => x.id === o);
    if (!off || (off.cost ?? 1) > g.market.left || (!off.repeat && g.market.bought.includes(o))) continue;
    s = t(s, 'buy', { offerId: o });
  }
  return t(s, 'leave');
}
const PIANI2 = { organizza: ['piazza', 'piazza', 'piazza', 'piazza'], caserme: ['convincere', 'convincere', 'convincere', 'convincere'], arsenale: ['arsenale', 'piazza', 'piazza'], tauride: ['tauride', 'piazza', 'convincere'], caserma: ['caserma', 'caserma'], niente: [] };
test('Otto giorni, il soldato: esiti diversi, nessuna strategia migliore su tutto, ogni azione serve, il rischio è scritto', () => {
  const nomi = Object.keys(PIANI2), tutte = [];
  for (const a of nomi) for (const b of nomi) for (const c of nomi) tutte.push([a, b, c]);
  const out = tutte.map(st => {
    const vals = ['x', 'y', 'z'].map(seed => {
      let s = newSession(game, 'sol-' + seed, 'a3-otto-giorni-soldato');
      for (const p of st) s = giornataSoldato(s, PIANI2[p]);
      assert.equal(s.currentAct.phase, 'outcome', st.join('/'));
      return { ...m(s), tauride: s.currentAct.flags.verso_tauride ? 1 : 0 };
    });
    const media = k => vals.reduce((n, x) => n + x[k], 0) / vals.length;
    return { st, soldati: media('soldati'), operai: media('operai'), ordine: media('ordine'), tauride: media('tauride') };
  });
  const verso = { soldati: 1, operai: 1, ordine: -1, tauride: 1 };
  const best = {};
  for (const k of Object.keys(verso)) best[k] = Math.max(...out.map(x => x[k] * verso[k]));
  const dominanti = out.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
  assert.equal(dominanti.length, 0, 'strategia ottima su tutto: ' + dominanti.map(x => x.st.join('/')));
  assert.ok(new Set(out.map(x => Math.round(x.soldati / 5) + ':' + Math.round(x.operai / 5) + ':' + Math.round(x.ordine / 5))).size >= 6, 'esiti troppo simili');
  const nelPiano = new Set(Object.values(PIANI2).flat());
  for (const o of soldato.turns[0].market.offers) assert.ok(nelPiano.has(o.id), o.id + ': nessun piano la usa');
  const conv = soldato.turns[0].market.offers.find(o => o.id === 'convincere');
  assert.ok(conv.chance.base > 0 && conv.chance.base < 1 && conv.chance.factor > 0, 'convincere ha una probabilità scritta che cresce con i soldati');
  assert.ok(soldato.shows.length >= 2 && soldato.shows.length <= 5);
  // Nessuna scelta riguarda lo sparare, il reprimere o il denunciare (D-006).
  for (const o of soldato.turns[0].market.offers) assert.doesNotMatch(o.label + ' ' + (o.text || ''), /sparar|reprimer|denunci/i);
});
