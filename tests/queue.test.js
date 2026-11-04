// La coda con la pazienza (src/core/queue.js), provata su un gioco neutro: nessun contenuto storico.
import test from 'node:test';
import assert from 'node:assert/strict';
import {newSession, transition, replay} from '../src/runner/index.js';
import {validateGame} from '../src/core/schema.js';
import {exportSave, restore} from '../src/storage/index.js';
import {queueView, queueDrain} from '../src/core/queue.js';
import {matches} from '../src/core/engine.js';

const offerte = () => [
  { id: 'servi', label: 'Dare il pane', cost: 1, repeat: true, text: 'Si distribuisce il pane.', effects: [{ kind: 'resource', id: 'pane', delta: -2 }], queue: [{ group: '*', patience: 2 }] },
  { id: 'parli', label: 'Parlare alla coda', cost: 1, text: 'Si dice che il pane arriva.', queue: [{ group: 'madri', patience: 3 }] },
  { id: 'aspetti', label: 'Aspettare', cost: 1, text: 'Non si fa niente.' }
];
const turno = (label, extra = {}) => ({ label, market: { who: 'La piazza', text: 'La coda aspetta.', points: 2, offers: offerte() }, ...extra });
const partita = () => ({
  id: 'p', type: 'turn_game', roleId: 'r', title: 'La coda', text: 'Una coda.', stageId: 'tavola', motionId: 'ingresso',
  shows: ['malcontento', 'pane'], feedback: 'Fine.',
  queue: {
    label: 'La coda del pane', patienceLabel: 'Pazienza',
    groups: [{ id: 'tessili', label: 'Le tessili', size: 6, patience: 6, exit: 'fabbrica' }, { id: 'madri', label: 'Le madri', size: 4, patience: 4, exit: 'corteo' }],
    signals: [{ at: 3, label: 'guardano l\'orologio', pose: 'guarda_orologio' }, { at: 1, label: 'battono i piedi', pose: 'batte_piedi' }],
    drain: { base: 1, factors: [{ id: 'gelo', label: 'Il gelo', when: { op: 'gte', kind: 'metric', id: 'gelo', value: 5 }, extra: 1 }] },
    exits: [
      { id: 'fabbrica', label: 'In fabbrica', text: 'vanno in fabbrica.', effects: [{ kind: 'metric', id: 'malcontento', delta: 10 }] },
      { id: 'corteo', label: 'Nel corteo', text: 'si uniscono al corteo.', effects: [{ kind: 'metric', id: 'malcontento', delta: 20 }] }
    ]
  },
  turns: [turno('Lunedì'), turno('Martedì'), turno('Mercoledì', { effects: [{ kind: 'metric', id: 'gelo', delta: 5 }] }), turno('Giovedì', { queue: { drain: 1 } }), turno('Venerdì')]
});
const gioco = () => ({
  schemaVersion: 1, id: 'prova-coda', contentVersion: '1', title: 'Prova', exposureFlags: [],
  stages: [{ id: 'tavola', label: 'Tavola', duration: 700, layers: [] }],
  acts: [{ id: 'a', title: 'Atto', reconciliation: 'Confronto.', actors: [{ id: 'x' }], roles: [{ id: 'r', label: 'Ruolo', actorId: 'x', mandate: 'Fare.' }],
    metrics: [{ id: 'malcontento', label: 'Malcontento', min: 0, max: 100, start: 0 }, { id: 'gelo', label: 'Gelo', min: 0, max: 10, start: 0, hidden: true }],
    resources: [{ id: 'pane', label: 'Pane', min: 0, max: 100, start: 50 }], relations: [], flags: [],
    episodes: [partita(), { id: 'fine', type: 'narrative', roleId: 'r', title: 'Fine', text: 'Fine.' }] }]
});
const t = (g, s, step, extra = {}) => transition(g, s, { type: 'turn', step, ...extra }).nextState;
const ep = g => g.acts[0].episodes[0];
const coda = s => s.currentAct.game.queue;
const finisciTurno = (g, s) => t(g, s, 'leave');

test('coda: validazione del contratto', () => {
  validateGame(gioco());
  const casi = [
    g => { delete ep(g).queue.exits; },
    g => { ep(g).queue.groups[0].exit = 'altrove'; },
    g => { ep(g).queue.groups[0].patience = 1; },
    g => { ep(g).queue.signals[0].at = 4; },
    g => { ep(g).queue.signals[1].at = 3; },
    g => { ep(g).queue.signals = []; },
    g => { ep(g).queue.drain.factors[0].extra = 0; },
    g => { ep(g).queue.drain.factors[0].when = { op: 'gte', kind: 'metric', id: 'ignota', value: 1 }; },
    g => { ep(g).queue.exits[0].effects = [{ kind: 'metric', id: 'ignota', delta: 1 }]; },
    g => { ep(g).turns[0].market.offers[0].queue = [{ group: 'sconosciuto', patience: 1 }]; },
    g => { ep(g).turns[0].market.offers[0].queue = [{ group: '*', patience: 0 }]; },
    g => { ep(g).turns[0].queue = { drain: 9 }; },
    g => { delete ep(g).queue; }
  ];
  for (const muta of casi) { const g = gioco(); muta(g); assert.throws(() => validateGame(g)); }
});

test('coda: la pazienza scende, i segnali partono alle soglie, chi arriva a zero se ne va', () => {
  const g = gioco();
  let s = newSession(g, 's1');
  assert.deepEqual(coda(s).groups.tessili, { patience: 6, max: 6, gone: false, goneTurn: null });
  // Lunedì, nessuna azione: scende di 1. Le madri (4 → 3) toccano la soglia 3.
  s = finisciTurno(g, s);
  assert.equal(coda(s).groups.tessili.patience, 5);
  assert.equal(coda(s).groups.madri.patience, 3);
  assert.deepEqual(coda(s).last.events.map(e => [e.group, e.kind, e.at]), [['madri', 'signal', 3]]);
  assert.equal(coda(s).last.events[0].pose, 'guarda_orologio');
  // Martedì: tessili 4, madri 2 (nessun segnale nuovo: la soglia 1 non è superata).
  s = finisciTurno(g, s);
  assert.equal(coda(s).groups.tessili.patience, 4);
  assert.deepEqual(coda(s).last.events, []);
  // Mercoledì: il gelo (gelo ≥ 5 all'inizio del turno) fa scendere di 2. Tessili 2 (soglia 3), madri 0: se ne vanno nel corteo.
  assert.equal(s.currentAct.metrics.gelo, 5);
  assert.equal(coda(s).last.drain.total, 1);
  s = finisciTurno(g, s);
  assert.equal(coda(s).last.drain.total, 2);
  assert.deepEqual(coda(s).last.drain.factors.map(f => f.id), ['gelo']);
  assert.equal(coda(s).groups.tessili.patience, 2);
  assert.equal(coda(s).groups.madri.gone, true);
  assert.equal(coda(s).groups.madri.goneTurn, 2);
  assert.deepEqual(coda(s).last.events.map(e => [e.group, e.kind]), [['tessili', 'signal'], ['madri', 'left']]);
  assert.equal(s.currentAct.metrics.malcontento, 20, 'l\'uscita sposta l\'indicatore');
  assert.deepEqual(coda(s).last.changes.map(c => [c.id, c.before, c.after]), [['malcontento', 0, 20]]);
  // Giovedì: gelo (1) + discesa del turno (1) + base (1) = 3. Le tessili (2) se ne vanno in fabbrica.
  s = finisciTurno(g, s);
  assert.equal(coda(s).last.drain.total, 3);
  assert.equal(coda(s).groups.tessili.gone, true);
  assert.equal(s.currentAct.metrics.malcontento, 30);
  // Chi se n'è andato non torna e non scende più.
  s = finisciTurno(g, s);
  assert.equal(coda(s).groups.madri.patience, 0);
  assert.equal(s.currentAct.phase, 'outcome');
  assert.equal(coda(s).log.length, 5);
});

test('coda: le risposte alzano la pazienza (mai sotto 1, mai sopra la partenza, mai su chi è già andato)', () => {
  const g = gioco();
  let s = newSession(g, 's2');
  // Due azioni nel primo turno: «Dare il pane» alza di 2 tutti (tessili già al massimo), «Parlare» alza le madri di 3.
  s = t(g, s, 'buy', { offerId: 'servi' });
  assert.equal(coda(s).groups.tessili.patience, 6, 'non supera la partenza');
  s = t(g, s, 'buy', { offerId: 'parli' });
  assert.equal(coda(s).groups.madri.patience, 4);
  s = finisciTurno(g, s);
  assert.equal(coda(s).groups.madri.patience, 3);
  assert.equal(coda(s).groups.tessili.patience, 5);
  // Un'offerta che abbassa non manda via nessuno da sola: la pazienza si ferma a 1.
  const h = gioco(); ep(h).turns[0].market.offers[2].queue = [{ group: 'madri', patience: -10 }];
  let u = newSession(h, 's3'); u = t(h, u, 'buy', { offerId: 'aspetti' });
  assert.equal(coda(u).groups.madri.patience, 1);
  assert.equal(coda(u).groups.madri.gone, false);
});

test('coda: il giocatore vede la crisi arrivare', () => {
  const g = gioco(), e = ep(g);
  let s = newSession(g, 's4');
  const view = () => queueView(e.queue, s.currentAct.game, e.turns[s.currentAct.game.turn], s.currentAct, matches);
  let v = view();
  assert.equal(v.drain.total, 1);
  assert.deepEqual(v.groups.map(x => [x.id, x.patience, x.turnsToLeave, x.next?.at, x.turnsToSignal, x.pose]), [['tessili', 6, 6, 3, 3, null], ['madri', 4, 4, 3, 1, null]]);
  s = finisciTurno(g, s);
  v = view();
  assert.equal(v.groups[1].pose, 'guarda_orologio', 'la posa è quella del segnale già superato');
  s = finisciTurno(g, s); s = finisciTurno(g, s);
  // Mercoledì è finito: le madri se ne sono andate e il giovedì avrà 3 di discesa (gelo + turno).
  v = view();
  assert.equal(v.groups[1].gone, true);
  assert.equal(v.groups[1].turnsToLeave, null);
  assert.equal(v.drain.total, 3);
  assert.equal(queueDrain(e.queue, e.turns[2], s.currentAct, matches).total, 2);
});

test('coda: il testo dell\'ultima mossa racconta i segnali e le uscite', () => {
  const g = gioco();
  let s = newSession(g, 's5');
  const r = transition(g, s, { type: 'turn', step: 'leave' });
  assert.match(r.feedback, /Le madri: guardano l'orologio/);
});

test('coda: salvataggio e ripresa a metà e rigioco delle mosse', () => {
  const g = gioco();
  let s = newSession(g, 's6');
  s = t(g, s, 'buy', { offerId: 'parli' }); s = finisciTurno(g, s); s = finisciTurno(g, s);
  const back = restore(g, exportSave(g, s));
  assert.equal(back.ok, true);
  assert.deepEqual(back.state.currentAct, s.currentAct);
  // Si continua dal salvataggio e si arriva alla stessa fine di chi ha giocato di fila.
  let a = back.state; a = finisciTurno(g, a); a = finisciTurno(g, a); a = finisciTurno(g, a);
  let b = s; b = finisciTurno(g, b); b = finisciTurno(g, b); b = finisciTurno(g, b);
  assert.deepEqual(a.currentAct, b.currentAct);
  assert.deepEqual(replay(g, a.ledger, 's6').currentAct, a.currentAct);
  assert.equal(replay(g, a.ledger, 's6').currentAct.metrics.malcontento, a.currentAct.metrics.malcontento);
});
