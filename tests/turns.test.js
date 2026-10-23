// Partita a turni del motore, provata su un gioco neutro (nessun contenuto storico).
import test from 'node:test';
import assert from 'node:assert/strict';
import {newSession, transition, replay} from '../src/runner/index.js';
import {validateGame} from '../src/core/schema.js';
import {exportSave, restore} from '../src/storage/index.js';
import {draw, chanceOf, luckOdds, activeStage, netChanges, yieldOf, workersOf, targetsOf, offerOpen} from '../src/core/turns.js';

const partita = () => ({
  id: 'p', type: 'turn_game', roleId: 'r', title: 'Partita di prova', text: 'Dividi il tempo.', stageId: 'tavola', motionId: 'ingresso',
  tokens: 4, tokenLabel: 'ore',
  places: [
    { id: 'orto', label: 'Orto', x: 0.2, y: 0.8, perToken: [{ kind: 'resource', id: 'cibo', delta: 5 }] },
    { id: 'bottega', label: 'Bottega', x: 0.8, y: 0.8, perToken: [{ kind: 'metric', id: 'pazienza', delta: 5 }] }
  ],
  rules: { min: { bottega: 2 } },
  upkeep: [{ kind: 'resource', id: 'cibo', delta: -10 }, { kind: 'metric', id: 'pazienza', delta: -5 }],
  luck: [{ id: 'buona', label: 'Buona', weight: 1, yield: { orto: 2 } }, { id: 'brutta', label: 'Brutta', weight: 3, yield: { orto: 0 } }],
  control: { text: 'Il capo se ne accorge.', chance: { base: 1 }, effects: [{ kind: 'metric', id: 'pazienza', delta: -20 }] },
  crises: [{ id: 'fame', when: { op: 'lte', kind: 'resource', id: 'cibo', value: 0 }, text: 'Si vende qualcosa.', effects: [{ kind: 'resource', id: 'cibo', delta: 30 }], rules: { tokensDelta: -1 } }],
  feedback: 'Fine della partita.',
  turns: [
    { label: 'Primo', cards: [{ text: 'Una notizia.', stageId: 'altrove', motionId: 'm' }, { text: 'Un\'altra.' }], preview: 'Domani arriva qualcuno.',
      event: { who: 'Un vicino', text: 'Chiede aiuto.', choices: [
        { id: 'si', label: 'Aiutarlo', text: 'Lo aiuti.', effects: [{ kind: 'metric', id: 'pazienza', delta: 10 }] },
        { id: 'prova', label: 'Provare a convincerlo', chance: { base: 0.1, metric: 'pazienza', factor: 0.01 },
          success: { text: 'Ci riesci.', rules: { min: { bottega: 1 } } }, failure: { text: 'Non ci riesci.', effects: [{ kind: 'metric', id: 'pazienza', delta: -10 }] } }
      ] } },
    { label: 'Secondo', rules: { tokens: 3 } }
  ]
});
const gioco = () => ({
  schemaVersion: 1, id: 'prova-turni', contentVersion: '1', title: 'Prova', exposureFlags: [],
  stages: [{ id: 'tavola', label: 'Tavola', duration: 700, layers: [] }, { id: 'altrove', label: 'Altrove', duration: 700, layers: [] }],
  acts: [{ id: 'a', title: 'Atto', reconciliation: 'Confronto.', actors: [{ id: 'x' }], roles: [{ id: 'r', label: 'Ruolo', actorId: 'x', mandate: 'Fare.' }],
    metrics: [{ id: 'pazienza', label: 'Pazienza', min: 0, max: 100, start: 50 }], resources: [{ id: 'cibo', label: 'Cibo', min: 0, max: 100, start: 20 }], relations: [], flags: [],
    episodes: [partita(), { id: 'fine', type: 'narrative', roleId: 'r', title: 'Fine', text: 'Fine.' }] }]
});
const t = (g, s, step, extra = {}) => transition(g, s, { type: 'turn', step, ...extra }).nextState;

test('turni: validazione del contratto', () => {
  validateGame(gioco());
  const casi = [
    g => { g.acts[0].episodes[0].places[0].x = 2; },
    g => { g.acts[0].episodes[0].places = [g.acts[0].episodes[0].places[0]]; },
    g => { g.acts[0].episodes[0].luck = []; },
    g => { g.acts[0].episodes[0].turns[0].cards[0].stageId = 'inesistente'; },
    g => { g.acts[0].episodes[0].turns[0].event.choices[1].success.text = ''; },
    g => { g.acts[0].episodes[0].rules = { min: { cantina: 1 } }; },
    g => { g.acts[0].episodes[0].control.chance = { base: 2 }; },
    g => { delete g.acts[0].episodes[0].stageId; },
    g => { g.acts[0].episodes[0].places[1].perToken = [{ kind: 'metric', id: 'ignota', delta: 1 }]; }
  ];
  for (const muta of casi) { const g = gioco(); muta(g); assert.throws(() => validateGame(g)); }
});

test('turni: una partita completa, card, piazzamento, imprevisto, controllo, crisi, chi bussa', () => {
  const g = gioco();
  let s = newSession(g, 'seme-1');
  assert.equal(s.currentAct.game.phase, 'cards');
  assert.deepEqual(activeStage(g.acts[0].episodes[0], s.currentAct.game), { stageId: 'altrove', motionId: 'm' });
  assert.throws(() => t(g, s, 'confirm'));
  s = t(g, s, 'card'); assert.equal(s.currentAct.game.card, 1);
  s = t(g, s, 'back'); assert.equal(s.currentAct.game.card, 0);
  s = t(g, s, 'card'); s = t(g, s, 'card');
  assert.equal(s.currentAct.game.phase, 'place');
  assert.equal(activeStage(g.acts[0].episodes[0], s.currentAct.game).stageId, 'tavola');
  for (let i = 0; i < 4; i++) s = t(g, s, 'place', { placeId: 'orto', delta: 1 });
  assert.throws(() => t(g, s, 'place', { placeId: 'orto', delta: 1 }), /finite/);
  s = t(g, s, 'place', { placeId: 'orto', delta: -1 });
  assert.throws(() => t(g, s, 'confirm'), /tutte/);
  s = t(g, s, 'place', { placeId: 'bottega', delta: 1 });
  // 3 ore all'orto, 1 in bottega (sotto l'obbligo di 2): il controllo ha probabilità 1.
  s = t(g, s, 'confirm');
  const r = s.currentAct.game.result;
  assert.equal(r.control.caught, true); assert.equal(r.control.p, 100);
  assert.ok(['buona', 'brutta'].includes(r.luck.id));
  assert.equal(r.preview, 'Domani arriva qualcuno.');
  assert.equal(new Set(r.changes.map(c => c.id)).size, r.changes.length, 'una riga per metrica');
  s = t(g, s, 'continue'); assert.equal(s.currentAct.game.phase, 'event');
  s = t(g, s, 'choose', { choiceId: 'si' });
  assert.equal(s.currentAct.game.eventResult.text, 'Lo aiuti.');
  s = t(g, s, 'continue');
  const g2 = s.currentAct.game;
  assert.equal(g2.turn, 1); assert.equal(g2.rules.tokens, 3 - (g2.fired.includes('fame') ? 0 : 0));
  for (let i = 0; i < g2.rules.tokens; i++) s = t(g, s, 'place', { placeId: 'bottega', delta: 1 });
  s = t(g, s, 'confirm'); s = t(g, s, 'continue');
  assert.equal(s.currentAct.phase, 'outcome'); assert.equal(s.currentAct.last.feedback, 'Fine della partita.');
  s = transition(g, s, { type: 'advance' }).nextState;
  assert.equal(s.currentAct.episodeId, 'fine'); assert.equal(s.currentAct.game, undefined);
});

test('turni: il caso è deterministico e il salvataggio rigiocato dà la stessa partita', () => {
  assert.equal(draw('a', 1, 'x'), draw('a', 1, 'x'));
  assert.notEqual(draw('a', 1, 'x'), draw('b', 1, 'x'));
  const g = gioco();
  let s = newSession(g, 'seme-2');
  s = t(g, s, 'card'); s = t(g, s, 'card');
  for (let i = 0; i < 4; i++) s = t(g, s, 'place', { placeId: 'orto', delta: 1 });
  s = t(g, s, 'confirm');
  const back = restore(g, exportSave(g, s));
  assert.equal(back.ok, true);
  assert.deepEqual(back.state.currentAct, s.currentAct);
  assert.deepEqual(replay(g, s.ledger, 'seme-2').currentAct.game.result, s.currentAct.game.result);
});

test('turni: crisi, probabilità scritte e variazioni nette', () => {
  const g = gioco();
  let s = newSession(g, 'seme-3');
  s = t(g, s, 'card'); s = t(g, s, 'card');
  s = t(g, s, 'place', { placeId: 'bottega', delta: 1 }); s = t(g, s, 'place', { placeId: 'bottega', delta: 1 });
  s = t(g, s, 'place', { placeId: 'bottega', delta: 1 }); s = t(g, s, 'place', { placeId: 'bottega', delta: 1 });
  // Nessuna ora all'orto: cibo 20 - 10 = 10, nessuna crisi; nessun controllo perché l'obbligo è rispettato.
  s = t(g, s, 'confirm');
  assert.equal(s.currentAct.game.result.control, null);
  assert.equal(s.currentAct.resources.cibo, 10);
  const e = g.acts[0].episodes[0];
  assert.deepEqual(luckOdds(e).map(x => x.p), [25, 75]);
  assert.equal(chanceOf(e.turns[0].event.choices[1].chance, g.acts[0], { metrics: { pazienza: 40 }, resources: {} }), 0.5);
  assert.deepEqual(netChanges([{ kind: 'resource', id: 'cibo', label: 'Cibo', before: 10, after: 20 }, { kind: 'resource', id: 'cibo', label: 'Cibo', before: 20, after: 15 }]),
    [{ kind: 'resource', id: 'cibo', label: 'Cibo', before: 10, after: 15 }]);
  // Senza grano la crisi scatta una sola volta e toglie un'ora.
  s = t(g, s, 'continue'); s = t(g, s, 'choose', { choiceId: 'si' }); s = t(g, s, 'continue');
  for (let i = 0; i < 3; i++) s = t(g, s, 'place', { placeId: 'bottega', delta: 1 });
  s = t(g, s, 'confirm');
  assert.deepEqual(s.currentAct.game.result.crises.map(c => c.id), ['fame']);
  assert.equal(s.currentAct.game.rules.tokens, 2);
});

// ---------- gestione: persone, lavori lunghi, riserva, mercato ----------
const gestione = () => {
  const g = gioco(), e = g.acts[0].episodes[0];
  delete e.tokens; e.tokenLabel = 'persone'; e.strengthLabel = 'braccia';
  e.workers = [{ id: 'forte', label: 'La forte', strength: 3, figure: 'fig-a' }, { id: 'piccolo', label: 'Il piccolo', strength: 1 }];
  e.places.push({ id: 'serra', label: 'Serra', x: 0.5, y: 0.5, perToken: [{ kind: 'resource', id: 'cibo', delta: 4 }], when: { op: 'flag', id: 'serra_fatta', value: true } });
  e.projects = [
    { id: 'muro', label: 'Il muro', text: 'Un muro intorno all\'orto.', x: 0.4, y: 0.4, work: 4, cost: [{ kind: 'resource', id: 'cibo', delta: -5 }],
      done: { text: 'Il muro è finito.', effects: [{ kind: 'flag', id: 'serra_fatta', value: true }], rules: { boost: { orto: 0.5 }, yearly: [{ kind: 'resource', id: 'cibo', delta: 2 }] } } }
  ];
  e.reserve = { from: 'cibo', label: 'Messo da parte', step: 5, start: 5, full: 10, floor: 0.5, places: ['orto'] };
  e.rules = { min: { bottega: 1 } };
  e.turns = [
    { label: 'Uno', event: e.turns[0].event, market: { who: 'Un mercante', text: 'Vende e compra.', offers: [
      { id: 'attrezzo', label: 'Un attrezzo', text: 'Comprato.', once: true, effects: [{ kind: 'resource', id: 'cibo', delta: -5 }], rules: { boost: { orto: 0.25 } } },
      { id: 'caro', label: 'Una cosa cara', text: 'Troppo cara.', when: { op: 'gte', kind: 'resource', id: 'cibo', value: 99 }, effects: [] }] } },
    { label: 'Due', rules: { workers: { piccolo: { strength: 2 } } } },
    { label: 'Tre', rules: { workers: { piccolo: { away: true } } } }
  ];
  g.acts[0].flags = ['serra_fatta'];
  g.acts[0].resources[0].start = 40;
  return g;
};

test('gestione: validazione di persone, lavori, riserva e mercato', () => {
  validateGame(gestione());
  const casi = [
    g => { g.acts[0].episodes[0].tokens = 3; },
    g => { g.acts[0].episodes[0].workers[0].strength = 9; },
    g => { g.acts[0].episodes[0].projects[0].id = 'orto'; },
    g => { g.acts[0].episodes[0].projects[0].cost = [{ kind: 'resource', id: 'cibo', delta: 5 }]; },
    g => { g.acts[0].episodes[0].reserve.places = ['cantina']; },
    g => { g.acts[0].episodes[0].turns[1].rules = { workers: { ignoto: { away: true } } }; },
    g => { g.acts[0].episodes[0].turns[0].market.offers[0].text = ''; },
    g => { delete g.acts[0].episodes[0].strengthLabel; }
  ];
  for (const muta of casi) { const g = gestione(); muta(g); assert.throws(() => validateGame(g)); }
});

test('gestione: le persone portano la loro forza, i lavori finiscono e restano, la riserva rende', () => {
  const g = gestione(), e = g.acts[0].episodes[0];
  let s = newSession(g, 'seme-g');
  assert.throws(() => t(g, s, 'place', { placeId: 'orto', delta: 1 }));
  assert.throws(() => t(g, s, 'assign', { workerId: 'forte', placeId: 'serra' }), /disponibile/, 'la serra non c\'è ancora');
  s = t(g, s, 'assign', { workerId: 'forte', placeId: 'muro' });
  s = t(g, s, 'assign', { workerId: 'piccolo', placeId: 'bottega' });
  assert.deepEqual([s.currentAct.game.placement.muro, s.currentAct.game.placement.bottega], [3, 1]);
  // Riserva: 5 + 5 = 10, il muro costa 5, il cibo è 40: si può. 40 no.
  s = t(g, s, 'reserve', { delta: 1 }); assert.equal(s.currentAct.game.reserve, 10);
  assert.equal(yieldOf(e, s.currentAct.game, 'orto'), 1);
  for (let i = 0; i < 5; i++) s = t(g, s, 'reserve', { delta: 1 });
  assert.equal(s.currentAct.game.reserve, 35);
  assert.throws(() => t(g, s, 'reserve', { delta: 1 }), /abbastanza/);
  for (let i = 0; i < 6; i++) s = t(g, s, 'reserve', { delta: -1 });
  assert.equal(s.currentAct.game.reserve, 5); assert.equal(yieldOf(e, s.currentAct.game, 'orto'), 0.75);
  s = t(g, s, 'confirm');
  const r1 = s.currentAct.game.result;
  // 40 - 5 (muro) - 5 (riserva) - 10 (mantenimento) = 20; nessuno all'orto.
  assert.equal(s.currentAct.resources.cibo, 20); assert.deepEqual(r1.built, []);
  assert.equal(s.currentAct.game.progress.muro, 3);
  s = t(g, s, 'continue'); s = t(g, s, 'choose', { choiceId: 'si' }); s = t(g, s, 'continue');
  // Mercato: l'offerta cara non si può prendere, l'attrezzo una volta sola.
  assert.equal(s.currentAct.game.phase, 'market');
  assert.equal(offerOpen(e, s.currentAct.game, e.turns[0].market.offers[1], s.currentAct), false);
  assert.throws(() => t(g, s, 'buy', { offerId: 'caro' }));
  s = t(g, s, 'buy', { offerId: 'attrezzo' }); assert.equal(s.currentAct.resources.cibo, 15);
  assert.throws(() => t(g, s, 'buy', { offerId: 'attrezzo' }));
  s = t(g, s, 'leave');
  const g2 = s.currentAct.game;
  // L'anno dopo ognuno resta dove era; il piccolo ora vale 2.
  assert.equal(g2.turn, 1); assert.deepEqual(g2.assign, { forte: 'muro', piccolo: 'bottega' }); assert.equal(g2.placement.bottega, 2);
  assert.equal(g2.rules.boost.orto, 0.25);
  s = t(g, s, 'confirm');
  const r2 = s.currentAct.game.result;
  assert.deepEqual(r2.built.map(x => x.id), ['muro']);
  assert.equal(s.currentAct.flags.serra_fatta, true);
  assert.equal(s.currentAct.game.rules.boost.orto, 0.75);
  assert.equal(s.currentAct.game.assign.forte, undefined, 'chi ha finito il lavoro torna libero');
  assert.throws(() => t(g, s, 'assign', { workerId: 'forte', placeId: 'muro' }));
  s = t(g, s, 'continue');
  // Terzo anno: il piccolo se ne è andato; la serra c'è.
  const g3 = s.currentAct.game;
  assert.deepEqual(workersOf(e, g3).map(w => w.id), ['forte']); assert.deepEqual(g3.assign, {});
  assert.throws(() => t(g, s, 'confirm'), /tutti/);
  assert.ok(targetsOf(e, g3, s.currentAct).some(x => x.id === 'serra'));
  s = t(g, s, 'assign', { workerId: 'forte', placeId: 'bottega' });
  const before = s.currentAct.resources.cibo;
  s = t(g, s, 'confirm');
  // Riserva 5 (resta dall'anno prima), mantenimento 10, rendita del muro +2; nessuno all'orto.
  assert.equal(s.currentAct.resources.cibo, Math.max(0, before - 5 - 10) + 2 + (s.currentAct.game.result.crises.length ? 30 : 0));
  s = t(g, s, 'continue');
  assert.equal(s.currentAct.phase, 'outcome');
  assert.deepEqual(replay(g, s.ledger, 'seme-g').currentAct, s.currentAct);
});
