// II.2 «Le giornate del soviet»: bilanciamento con il motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/soviet.md): seguire la lettura dei moderati o quella dei radicali porta a esiti diversi
// (la linea del soviet sblocca azioni diverse nei giorni dopo); nessuna strategia è la migliore su tutti gli indicatori insieme;
// ogni azione serve in qualche piano; i rischi sono scritti prima; le etichette sulla scena non si sovrappongono.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const act = game.acts[1], ep = act.episodes.find(e => e.id === 'a2-soviet-giornate');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;
// I piani di una giornata (cinque punti): ogni azione costa uno, tranne «tavolo» e «treni» che costano due.
const PIANI = {
  moderata: ['indtess', 'peso-moderato', 'tavolo', 'distribuire'],
  radicale: ['indtess', 'peso-radicale', 'treni', 'delegato'],
  mista: ['indtess', 'peso-moderato', 'peso-radicale', 'delegato', 'distribuire'],
  indaga: ['indtel', 'indferr', 'peso-moderato', 'peso-radicale', 'delegato'],
  corsa: ['delegato', 'delegato', 'delegato', 'delegato', 'delegato'],
  cassa: ['distribuire', 'distribuire', 'distribuire', 'distribuire', 'distribuire']
};
const NOMI = Object.keys(PIANI);
function giornata(s, piano) {
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  for (const o of piano) {
    const g = s.currentAct.game, off = ep.turns[g.turn].market.offers.find(x => x.id === o);
    const aperta = (!off.when || matchesWhen(s, off.when)) && (off.cost ?? 1) <= g.market.left && (off.repeat || !g.market.bought.includes(o));
    if (!aperta) continue;
    s = t(s, 'buy', { offerId: o });
  }
  return t(s, 'leave');
}
function matchesWhen(s, w) {
  if (w.op === 'flag') return s.currentAct.flags[w.id] === w.value;
  const v = s.currentAct.metrics[w.id];
  return { lte: v <= w.value, gte: v >= w.value }[w.op];
}
const m = s => s.currentAct.metrics;
function partita(st, seme) {
  let s = newSession(game, seme, ep.id);
  for (const p of st) s = giornata(s, PIANI[p]);
  const q = m(s);
  return { ok: s.currentAct.phase === 'outcome', sciopero: q.sciopero, fondi: q.fondi, fiducia: q.fiducia, repressione: q.repressione, linea: q.linea, trattato: s.currentAct.flags.tratta_prefetto, crisi: s.currentAct.game.fired.length };
}
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) STRATEGIE.push([a, b, c]);
const risultati = STRATEGIE.map(st => {
  const out = ['a', 'b', 'c', 'd'].map(seme => partita(st, 'sov-' + seme));
  const media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { st, ok: out.every(x => x.ok), sciopero: media('sciopero'), fondi: media('fondi'), fiducia: media('fiducia'), repressione: media('repressione'), linea: media('linea'), trattato: out.some(x => x.trattato), crisi: media('crisi') };
});
const di = (...st) => risultati.find(x => x.st.join() === st.join());

if (process.env.LAIKA_RAPPORTO) for (const nome of ['moderata', 'radicale', 'mista', 'indaga', 'corsa', 'cassa']) {
  const x = di(nome, nome, nome);
  console.log(nome.padEnd(10), [x.sciopero, x.fondi, x.fiducia, x.repressione, x.linea, x.crisi].map(v => String(Math.round(v)).padStart(5)).join(''), x.trattato ? 'tratta' : '');
}

test('Il soviet: tutte le strategie arrivano in fondo', () => {
  for (const x of risultati) assert.ok(x.ok, x.st.join('/'));
});
test('Il soviet: nessuna strategia è la migliore su tutti gli indicatori insieme', () => {
  const verso = { sciopero: 1, fondi: 1, fiducia: 1, repressione: -1 };
  const best = {};
  for (const k of Object.keys(verso)) best[k] = Math.max(...risultati.map(x => x[k] * verso[k]));
  const tutti = risultati.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
  assert.equal(tutti.length, 0, 'strategia ottima su tutto: ' + (tutti[0]?.st || []).join('/'));
});
test('Il soviet: seguire una lettura o l\'altra porta a esiti diversi', () => {
  const mod = di('moderata', 'moderata', 'moderata'), rad = di('radicale', 'radicale', 'radicale'), mista = di('mista', 'mista', 'mista');
  assert.ok(mod.linea <= 44 && rad.linea >= 56, 'la linea segue la lettura scelta: ' + mod.linea + ' e ' + rad.linea);
  assert.ok(Math.abs(mod.repressione - rad.repressione) >= 10, 'la repressione cambia: ' + mod.repressione + ' contro ' + rad.repressione);
  assert.ok(rad.sciopero - mod.sciopero >= 10, 'i radicali allargano lo sciopero: ' + rad.sciopero + ' contro ' + mod.sciopero);
  assert.ok(mod.trattato && !rad.trattato, 'solo i moderati trattano col prefetto (il flag che II.3 legge)');
  // Chi dà peso a entrambi non sblocca niente: la linea resta nel mezzo.
  assert.ok(mista.linea > 44 && mista.linea < 56, 'dare peso a entrambi lascia la linea al centro: ' + mista.linea);
  // Strategie diverse, esiti diversi.
  assert.ok(new Set(risultati.map(x => [x.sciopero, x.fondi, x.fiducia, x.repressione].map(v => Math.round(v / 10)).join(':'))).size >= 8, 'esiti troppo simili');
});
test('Il soviet: la scelta della lettura cambia le azioni dei giorni dopo', () => {
  const apriti = s => ep.turns[s.currentAct.game.turn].market.offers.filter(o => !o.when || matchesWhen(s, o.when)).map(o => o.id);
  let s = newSession(game, 'dopo', ep.id);
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  // Prima di indagare non si può dare peso a nessuna lettura, e «tavolo» e «treni» sono chiusi.
  assert.ok(!apriti(s).includes('peso-moderato') && !apriti(s).includes('tavolo') && !apriti(s).includes('treni'));
  s = t(s, 'buy', { offerId: 'indtess' });
  assert.ok(apriti(s).includes('peso-moderato') && apriti(s).includes('peso-radicale'), 'dopo aver indagato si sceglie a quale lettura dare peso');
  s = t(s, 'buy', { offerId: 'peso-moderato' }); s = t(s, 'leave');
  while (s.currentAct.game.phase === 'cards') s = t(s, 'card');
  // Il giorno dopo la sala ha seguito i moderati: si può trattare e non si possono fermare i treni; il giorno ricomincia senza indagini.
  assert.ok(apriti(s).includes('tavolo') && !apriti(s).includes('treni'), 'il giorno dopo si tratta e non si fermano i treni');
  assert.ok(!apriti(s).includes('peso-moderato'), 'ogni giorno si indaga di nuovo prima di dare peso');
  assert.throws(() => t(s, 'buy', { offerId: 'treni' }));
  // Le card del giorno dopo raccontano la linea scelta.
  const turno = ep.turns[s.currentAct.game.turn], lette = s.currentAct.game.cardList.map(i => turno.cards[i].title);
  assert.ok(lette.includes('La sala ha seguito i moderati'), 'la card dice che la sala ha seguito i moderati: ' + lette.join(' | '));
  assert.ok(!lette.includes('La sala ha seguito i radicali'), 'la card dei radicali non si legge se ha vinto la linea dei moderati');
});
test('Il soviet: ogni azione serve, i rischi sono scritti prima, le etichette non si sovrappongono', () => {
  const nelPiano = new Set(Object.values(PIANI).flat());
  for (const o of ep.turns[0].market.offers) assert.ok(nelPiano.has(o.id), o.id + ': nessun piano la usa');
  // I treni fermi allargano lo sciopero e alzano la repressione: nessuna linea è gratis.
  const treni = ep.turns[0].market.offers.find(o => o.id === 'treni'), eff = (o, id) => o.effects.find(x => x.id === id)?.delta;
  assert.ok(eff(treni, 'sciopero') > 0 && eff(treni, 'repressione') > 0, 'fermare i treni allarga lo sciopero e alza la repressione');
  const tavolo = ep.turns[0].market.offers.find(o => o.id === 'tavolo');
  assert.ok(eff(tavolo, 'repressione') < 0 && tavolo.effects.some(x => x.id === 'tratta_prefetto'), 'trattare abbassa la repressione e segna il flag');
  for (const turn of ep.turns) assert.equal(turn.market.points, 5);
  const d = ep.turns[0].market.offers.find(o => o.id === 'delegato');
  assert.ok(d.chance.base > 0 && d.chance.base < 1, 'il delegato ha una probabilità scritta');
  assert.ok(ep.shows.length >= 2 && ep.shows.length <= 5);
  for (const turn of ep.turns) {
    const at = turn.market.offers.filter(o => o.at).map(o => ({ id: o.id, ...o.at }));
    for (const a of at) for (const b of at) if (a.id < b.id) assert.ok(Math.abs(a.x - b.x) >= 0.2 || Math.abs(a.y - b.y) >= 0.12, 'etichette sovrapposte: ' + a.id + ' e ' + b.id);
  }
});
