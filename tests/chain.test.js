// Le merci che camminano (src/core/chain.js), provate su un gioco neutro: nessun contenuto storico.
import test from 'node:test';
import assert from 'node:assert/strict';
import {newSession, transition, replay} from '../src/runner/index.js';
import {validateGame} from '../src/core/schema.js';
import {exportSave, restore} from '../src/storage/index.js';
import {chainView, effectiveCapacity} from '../src/core/chain.js';

const offerte = () => [
  { id: 'binari', label: 'Posare binari', cost: 1, repeat: true, text: 'Il treno passa più carri.', chain: [{ link: 'treni', capacity: 2 }] },
  { id: 'rapporto', label: 'Gonfiare il rapporto', cost: 1, text: 'Sulla carta si arriva a di più.', chain: [{ paper: 10 }] },
  { id: 'sgombero', label: 'Svuotare il granaio', cost: 1, text: 'Si porta via un po\' di scorta.', chain: [{ link: 'granai', stock: -4 }] },
  { id: 'aspetti', label: 'Aspettare', cost: 1, text: 'Non si fa niente.' }
];
const turno = (label, extra = {}) => ({ label, market: { who: 'La stazione', text: 'Il grano cammina.', points: 2, offers: offerte() }, ...extra });
const partita = () => ({
  id: 'p', type: 'turn_game', roleId: 'r', title: 'La catena', text: 'Una catena.', stageId: 'tavola', motionId: 'ingresso',
  shows: ['pane', 'scarto'], feedback: 'Fine.',
  chain: {
    label: 'Il grano verso la città', goodsLabel: 'grano', supply: 6,
    links: [
      { id: 'campi', label: 'I campi', capacity: 6, stock: 12 },
      { id: 'granai', label: 'I granai', capacity: 5, jamText: 'è pieno e rallenta' },
      { id: 'treni', label: 'I treni', capacity: 3 },
      { id: 'citta', label: 'La città' }
    ],
    paper: { start: 30 }, deliver: { metric: 'pane', per: 2 }, gap: { metric: 'scarto' }, jam: { at: 8, factor: 0.5 }
  },
  crises: [{ id: 'rapporto-falso', when: { op: 'gte', kind: 'metric', id: 'scarto', value: 30 }, text: 'Il rapporto non regge.', effects: [{ kind: 'metric', id: 'pane', delta: -5 }] }],
  turns: [turno('Primo'), turno('Secondo'), turno('Terzo', { chain: { supply: -2 } }), turno('Quarto')]
});
const gioco = () => ({
  schemaVersion: 1, id: 'prova-catena', contentVersion: '1', title: 'Prova', exposureFlags: [],
  stages: [{ id: 'tavola', label: 'Tavola', duration: 700, layers: [] }],
  acts: [{ id: 'a', title: 'Atto', reconciliation: 'Confronto.', actors: [{ id: 'x' }], roles: [{ id: 'r', label: 'Ruolo', actorId: 'x', mandate: 'Fare.' }],
    metrics: [{ id: 'pane', label: 'Pane', min: 0, max: 100, start: 20 }, { id: 'scarto', label: 'Scarto fra carta e realtà', min: 0, max: 100, start: 0 }],
    resources: [], relations: [], flags: [],
    episodes: [partita(), { id: 'fine', type: 'narrative', roleId: 'r', title: 'Fine', text: 'Fine.' }] }]
});
const t = (g, s, step, extra = {}) => transition(g, s, { type: 'turn', step, ...extra }).nextState;
const ep = g => g.acts[0].episodes[0];
const catena = s => s.currentAct.game.chain;
const fine = (g, s) => t(g, s, 'leave');

test('catena: validazione del contratto', () => {
  validateGame(gioco());
  const casi = [
    g => { ep(g).chain.links = ep(g).chain.links.slice(0, 3); },
    g => { ep(g).chain.links.push({ id: 'extra', label: 'Extra', capacity: 3 }, { id: 'extra2', label: 'Extra 2' }); },
    g => { delete ep(g).chain.links[0].capacity; },
    g => { ep(g).chain.links[3].capacity = 4; },
    g => { delete ep(g).chain.paper; },
    g => { ep(g).chain.deliver.metric = 'ignota'; },
    g => { ep(g).chain.gap.metric = 'ignota'; },
    g => { ep(g).chain.jam.factor = 2; },
    g => { ep(g).turns[0].market.offers[0].chain = [{ link: 'sconosciuto', capacity: 1 }]; },
    g => { ep(g).turns[0].market.offers[0].chain = [{ link: 'citta', capacity: 1 }]; },
    g => { ep(g).turns[0].market.offers[0].chain = [{ link: 'treni', capacity: 1, stock: 1 }]; },
    g => { ep(g).turns[0].market.offers[0].chain = [{ paper: 0 }]; },
    g => { delete ep(g).chain; }
  ];
  for (const muta of casi) { const g = gioco(); muta(g); assert.throws(() => validateGame(g)); }
});

test('catena: le merci fanno un anello a turno, il più stretto limita, un anello pieno si inceppa', () => {
  const g = gioco();
  let s = newSession(g, 'c1');
  assert.deepEqual(catena(s).stock, { campi: 12, granai: 0, treni: 0, citta: 0 });
  s = fine(g, s);
  assert.deepEqual(catena(s).stock, { campi: 12, granai: 6, treni: 0, citta: 0 });
  assert.equal(catena(s).real, 0, 'dopo il primo turno non è ancora arrivato niente');
  s = fine(g, s);
  assert.deepEqual(catena(s).stock, { campi: 12, granai: 7, treni: 5, citta: 0 });
  // Terzo turno: l'offerta del turno scende di 2 (un raccolto scarso). Arrivano 3 (la capacità dei treni).
  s = fine(g, s);
  assert.equal(catena(s).last.moved.treni, 3, 'i treni passano al massimo 3');
  assert.equal(catena(s).real, 3);
  assert.equal(catena(s).last.supply, 4);
  assert.deepEqual(catena(s).stock, { campi: 10, granai: 8, treni: 7, citta: 3 });
  assert.deepEqual(catena(s).jammed, ['granai'], 'il granaio ha 8 e si inceppa');
  assert.deepEqual(catena(s).last.newlyJammed, ['granai']);
  // Quarto turno: il granaio inceppato passa solo 2 (la metà di 5, arrotondata per difetto).
  const view = chainView(ep(g).chain, s.currentAct.game);
  assert.equal(view.links.find(l => l.id === 'granai').capacity, 2);
  assert.equal(view.links.find(l => l.id === 'granai').jammed, true);
  assert.equal(effectiveCapacity(ep(g).chain, catena(s), 'granai'), 2);
  s = fine(g, s);
  assert.equal(catena(s).last.moved.granai, 2);
  assert.equal(s.currentAct.phase, 'outcome');
});

test('catena: carta e realtà sono due numeri distinti e lo scarto segue la differenza', () => {
  const g = gioco();
  let s = newSession(g, 'c2');
  s = fine(g, s);
  assert.equal(catena(s).paper, 30);
  assert.equal(catena(s).real, 0);
  assert.equal(s.currentAct.metrics.scarto, 30, 'scarto = carta meno realtà');
  assert.deepEqual(catena(s).last.changes.map(c => [c.id, c.after]), [['scarto', 30], ['pane', 15]], 'lo scarto di 30 fa scattare la crisi (pane −5)');
  assert.deepEqual(catena(s).last.crises.map(c => c.id), ['rapporto-falso']);
  // Gonfiare il rapporto allarga lo scarto: la carta sale, la realtà no.
  let u = newSession(g, 'c3');
  u = t(g, u, 'buy', { offerId: 'rapporto' });
  assert.equal(catena(u).paper, 40);
  u = fine(g, u);
  assert.equal(u.currentAct.metrics.scarto, 40);
  u = fine(g, u); u = fine(g, u);
  // Dopo tre turni arrivano 3 (la realtà) mentre la carta è rimasta a 40: lo scarto è 37.
  assert.equal(catena(u).real, 3);
  assert.equal(u.currentAct.metrics.scarto, 37);
  // La metrica di consegna segue le merci arrivate (2 per unità): 3 unità = +6.
  assert.equal(u.currentAct.metrics.pane, 20 + 6 - 5, 'consegna +6 e la crisi una volta (−5)');
});

test('catena: le risposte cambiano capacità e scorte (mai sotto 0, la capacità al massimo il doppio)', () => {
  const g = gioco();
  let s = newSession(g, 'c4');
  s = t(g, s, 'buy', { offerId: 'binari' }); s = t(g, s, 'buy', { offerId: 'binari' });
  assert.equal(catena(s).capacity.treni, 6, '3 + 2 + 2 = 7, ma al massimo il doppio della partenza');
  const h = gioco(); ep(h).turns[0].market.offers[0].chain = [{ link: 'treni', capacity: 60 }]; ep(h).turns[0].market.offers[2].chain = [{ link: 'granai', stock: -60 }];
  let u = newSession(h, 'c5'); u = t(h, u, 'buy', { offerId: 'binari' }); u = t(h, u, 'buy', { offerId: 'sgombero' });
  assert.equal(catena(u).capacity.treni, 6, 'al massimo il doppio della partenza');
  assert.equal(catena(u).stock.granai, 0, 'mai sotto zero');
  // Più capacità sui treni: arrivano 5 invece di 3 al terzo turno.
  let v = newSession(g, 'c6');
  v = t(g, v, 'buy', { offerId: 'binari' }); v = t(g, v, 'buy', { offerId: 'binari' });
  v = fine(g, v); v = fine(g, v); v = fine(g, v);
  assert.equal(catena(v).last.moved.treni, 5);
});

test('catena: il testo dell\'ultima mossa dice che cosa si è inceppato', () => {
  const g = gioco();
  let s = newSession(g, 'c7');
  s = fine(g, s); s = fine(g, s);
  const r = transition(g, s, { type: 'turn', step: 'leave' });
  assert.match(r.feedback, /I granai: è pieno e rallenta\./);
});

test('catena: salvataggio e ripresa a metà e rigioco delle mosse', () => {
  const g = gioco();
  let s = newSession(g, 'c8');
  s = t(g, s, 'buy', { offerId: 'binari' }); s = fine(g, s); s = fine(g, s);
  const back = restore(g, exportSave(g, s));
  assert.equal(back.ok, true);
  assert.deepEqual(back.state.currentAct, s.currentAct);
  let a = back.state; a = fine(g, a); a = fine(g, a);
  let b = s; b = fine(g, b); b = fine(g, b);
  assert.deepEqual(a.currentAct, b.currentAct);
  assert.deepEqual(replay(g, a.ledger, 'c8').currentAct, a.currentAct);
});
