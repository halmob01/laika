// Partita a turni: tabellone di posti, pedine da piazzare, imprevisto con probabilità scritte,
// obblighi controllati, crisi, card del racconto e una carta «chi bussa» per turno.
// Gestione (facoltativa): le pedine possono essere persone con una forza diversa (workers),
// i posti possono essere lavori lunghi che una volta finiti restano (projects), una parte di una
// risorsa si può mettere da parte perché renda dopo (reserve) e alcuni anni c'è un mercato (market).
// Logica pura e deterministica: il caso dipende dal seme della sessione, così il salvataggio
// (registro delle mosse rigiocato) ricostruisce la stessa partita. Nessun contenuto di un gioco qui.
import {assert, text, id, unique, condition, mutations, CONTEXT_LABELS} from './schema.js';
import {applyEffects, matches, clamp, clone} from './engine.js';

export const TURN_STEPS = ['card', 'back', 'place', 'assign', 'reserve', 'confirm', 'choose', 'continue', 'buy', 'leave'];
const PHASES = ['cards', 'place', 'result', 'event', 'eventResult', 'market', 'done'];

// ---------- caso deterministico ----------
function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  return h;
}
export function draw(seed, ...parts) {
  let t = hash(seed + '|' + parts.join('|')) + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ---------- validazione ----------
function chanceSpec(c, act, where) {
  assert(c && typeof c === 'object' && Number.isFinite(c.base) && c.base >= 0 && c.base <= 1, where + ': probabilità non valida');
  if (c.metric !== undefined) {
    assert(typeof c.metric === 'string' && [...(act.metrics || []), ...(act.resources || [])].some(d => d.id === c.metric), where + ': metrica della probabilità non dichiarata');
    assert(Number.isFinite(c.factor), where + ': fattore della probabilità mancante');
  }
}
function numeric(list, act, where) { mutations(list, act); assert(list.every(m => m.kind !== 'flag'), where + ': effetti solo numerici'); }
function rulesSpec(r, act, places, where, workers = new Set()) {
  if (r === undefined) return;
  assert(r && typeof r === 'object' && !Array.isArray(r) && Object.keys(r).every(k => ['tokens', 'tokensDelta', 'min', 'places', 'upkeep', 'workers', 'boost', 'yearly'].includes(k)), where + ': regole non valide');
  // workers: cambia forza, nome o presenza di una persona; boost: si somma alla resa di un posto (0.2 = +20%);
  // yearly: effetti che si aggiungono a quelli di ogni anno e si sommano tra loro.
  for (const [w, o] of Object.entries(r.workers || {})) {
    assert(workers.has(w) && o && typeof o === 'object' && Object.keys(o).every(k => ['strength', 'away', 'label'].includes(k)), where + ': modifica della persona non valida: ' + w);
    if (o.strength !== undefined) assert(Number.isInteger(o.strength) && o.strength >= 1 && o.strength <= 5, where + ': forza non valida');
    if (o.away !== undefined) assert(typeof o.away === 'boolean', where + ': assenza non valida');
    if (o.label !== undefined) assert(text(o.label), where + ': nome vuoto');
  }
  for (const [p, n] of Object.entries(r.boost || {})) assert(places.has(p) && Number.isFinite(n) && n >= -1 && n <= 3, where + ': resa aggiuntiva non valida su ' + p);
  if (r.yearly !== undefined) numeric(r.yearly, act, where);
  if (r.tokens !== undefined) assert(Number.isInteger(r.tokens) && r.tokens >= 1 && r.tokens <= 12, where + ': pedine non valide');
  if (r.tokensDelta !== undefined) assert(Number.isInteger(r.tokensDelta), where + ': variazione delle pedine non valida');
  for (const [p, n] of Object.entries(r.min || {})) assert(places.has(p) && Number.isInteger(n) && n >= 0, where + ': obbligo non valido su ' + p);
  for (const [p, o] of Object.entries(r.places || {})) {
    assert(places.has(p) && o && typeof o === 'object' && Object.keys(o).every(k => ['label', 'perToken'].includes(k)), where + ': modifica del posto non valida');
    if (o.label !== undefined) assert(text(o.label), where + ': etichetta del posto vuota');
    if (o.perToken !== undefined) { mutations(o.perToken, act); assert(o.perToken.every(m => m.kind !== 'flag'), where + ': effetti per pedina solo numerici'); }
  }
  if (r.upkeep !== undefined) mutations(r.upkeep, act);
}
function cardsSpec(cards, stages, where) {
  if (cards === undefined) return;
  assert(Array.isArray(cards) && cards.length <= 12, where + ': card non valide');
  for (const c of cards) {
    assert(c && text(c.text), where + ': card senza testo');
    if (c.title !== undefined) assert(text(c.title), where + ': titolo della card vuoto');
    // Etichetta facoltativa: distingue nella stessa sequenza fatto documentato, simulazione e fonte.
    if (c.kind !== undefined) assert(Object.prototype.hasOwnProperty.call(CONTEXT_LABELS, c.kind), where + ': tipo della card non valido');
    if (c.stageId !== undefined) assert(stages.has(c.stageId), where + ': scenografia della card sconosciuta');
    if (c.motionId !== undefined) assert(typeof c.motionId === 'string' && c.stageId, where + ': movimento della card senza scenografia');
  }
}
const point = (x, y) => Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 1 && y >= 0 && y <= 1;
export function validateTurnGame(e, act, stages) {
  const places = unique(e.places, 'Posti', 2);
  for (const p of e.places) {
    assert(text(p.label) && point(p.x, p.y), 'Posto non valido: ' + p.id);
    mutations(p.perToken, act); assert(p.perToken.every(m => m.kind !== 'flag'), 'Effetti per pedina solo numerici');
    if (p.max !== undefined) assert(Number.isInteger(p.max) && p.max >= 0, 'Massimo del posto non valido');
    if (p.when !== undefined) condition(p.when, act);
    if (p.stand !== undefined) assert(p.stand && point(p.stand.x, p.stand.y), 'Punto delle figure non valido: ' + p.id);
    if (p.short !== undefined) assert(text(p.short) && p.short.length <= 16, 'Nome breve del posto non valido: ' + p.id);
  }
  const workers = new Set();
  if (e.workers !== undefined) {
    for (const w of unique(e.workers, 'Persone', 1)) workers.add(w);
    assert(e.workers.length <= 8, 'Troppe persone');
    for (const w of e.workers) {
      assert(text(w.label) && Number.isInteger(w.strength) && w.strength >= 1 && w.strength <= 5, 'Persona non valida: ' + w.id);
      if (w.text !== undefined) assert(text(w.text), 'Descrizione della persona vuota');
      if (w.figure !== undefined) assert(id(w.figure), 'Figura della persona non valida');
      if (w.away !== undefined) assert(typeof w.away === 'boolean', 'Assenza non valida');
    }
    assert(e.tokens === undefined, 'Con le persone il numero di pedine non si dichiara');
    assert(text(e.strengthLabel), 'Nome della forza mancante');
  } else assert(Number.isInteger(e.tokens) && e.tokens >= 1 && e.tokens <= 12, 'Pedine non valide');
  assert(text(e.tokenLabel), 'Nome delle pedine mancante');
  for (const k of ['upkeepLabel', 'yearlyLabel', 'crisisLabel']) if (e[k] !== undefined) assert(text(e[k]), 'Etichetta vuota: ' + k);
  // Lavori lunghi: si scelgono come un posto, avanzano con la forza messa e alla fine cambiano le regole.
  const targets = new Set(places);
  if (e.projects !== undefined) {
    assert(e.workers !== undefined, 'I lavori lunghi richiedono le persone');
    for (const p of unique(e.projects, 'Lavori', 1)) { assert(!places.has(p), 'Lavoro con lo stesso nome di un posto: ' + p); targets.add(p); }
    for (const p of e.projects) {
      assert(text(p.label) && text(p.text) && point(p.x, p.y) && Number.isInteger(p.work) && p.work >= 1 && p.work <= 40, 'Lavoro non valido: ' + p.id);
      if (p.cost !== undefined) { numeric(p.cost, act, 'Lavoro ' + p.id); assert(p.cost.every(m => m.delta < 0), 'Il costo di un lavoro toglie'); }
      if (p.when !== undefined) condition(p.when, act);
      if (p.stand !== undefined) assert(p.stand && point(p.stand.x, p.stand.y), 'Punto delle figure non valido: ' + p.id);
      if (p.short !== undefined) assert(text(p.short) && p.short.length <= 16, 'Nome breve del lavoro non valido: ' + p.id);
      assert(p.done && text(p.done.text), 'Lavoro senza esito: ' + p.id); mutations(p.done.effects || [], act); rulesSpec(p.done.rules, act, places, 'Lavoro ' + p.id, workers);
    }
  }
  if (e.reserve !== undefined) {
    const r = e.reserve;
    assert((act.resources || []).some(d => d.id === r.from) && text(r.label) && Number.isInteger(r.step) && r.step >= 1 && Number.isInteger(r.start) && r.start >= 0, 'Riserva non valida');
    assert(Number.isFinite(r.full) && r.full > 0 && Number.isFinite(r.floor) && r.floor >= 0 && r.floor <= 1, 'Resa della riserva non valida');
    assert(Array.isArray(r.places) && r.places.length && r.places.every(p => places.has(p)), 'Posti della riserva non validi');
    if (r.text !== undefined) assert(text(r.text), 'Testo della riserva vuoto');
  }
  mutations(e.upkeep || [], act);
  unique(e.luck, 'Imprevisti', 1);
  for (const l of e.luck) {
    assert(text(l.label) && Number.isFinite(l.weight) && l.weight > 0, 'Imprevisto non valido');
    for (const [p, m] of Object.entries(l.yield || {})) assert(places.has(p) && Number.isFinite(m) && m >= 0, 'Resa dell\'imprevisto non valida');
  }
  if (e.control !== undefined) {
    assert(text(e.control.text) && (e.control.label === undefined || text(e.control.label)), 'Controllo senza testo'); chanceSpec(e.control.chance, act, 'Controllo'); mutations(e.control.effects || [], act);
    // Effetti moltiplicati per ogni pedina mancante rispetto agli obblighi: chi salta di più paga di più.
    if (e.control.perMissing !== undefined) { mutations(e.control.perMissing, act); assert(e.control.perMissing.every(m => m.kind !== 'flag'), 'Controllo: effetti per pedina mancante solo numerici'); }
  }
  rulesSpec(e.rules, act, places, 'Regole iniziali', workers);
  for (const c of e.crises || []) {
    assert(id(c.id) && text(c.text) && c.when, 'Crisi non valida'); condition(c.when, act); mutations(c.effects || [], act); rulesSpec(c.rules, act, places, 'Crisi ' + c.id, workers);
  }
  unique(e.crises || [], 'Crisi');
  assert(text(e.feedback), 'Partita senza testo finale');
  assert(Array.isArray(e.turns) && e.turns.length >= 1 && e.turns.length <= 20, 'Turni non validi');
  e.turns.forEach((t, i) => {
    const where = 'Turno ' + (i + 1);
    assert(t && text(t.label), where + ': etichetta mancante');
    cardsSpec(t.cards, stages, where); rulesSpec(t.rules, act, places, where, workers);
    if (t.preview !== undefined) assert(text(t.preview), where + ': avviso vuoto');
    if (t.event !== undefined) {
      const ev = t.event; assert(text(ev.who) && text(ev.text), where + ': chi bussa senza testo');
      unique(ev.choices, where + ': risposte', 2);
      for (const c of ev.choices) {
        assert(text(c.label), where + ': risposta vuota');
        if (c.when !== undefined) condition(c.when, act);
        if (c.chance) {
          chanceSpec(c.chance, act, where);
          for (const k of ['success', 'failure']) { const o = c[k]; assert(o && text(o.text), where + ': esito ' + k + ' mancante'); mutations(o.effects || [], act); rulesSpec(o.rules, act, places, where, workers); }
        } else { assert(text(c.text), where + ': esito della risposta mancante'); mutations(c.effects || [], act); rulesSpec(c.rules, act, places, where, workers); }
      }
    }
    // Mercato: si possono prendere più offerte, ognuna una volta per visita (once: una volta in tutta la partita).
    if (t.market !== undefined) {
      const m = t.market; assert(text(m.who) && text(m.text), where + ': mercato senza testo');
      unique(m.offers, where + ': offerte', 1);
      for (const o of m.offers) {
        assert(text(o.label) && text(o.text), where + ': offerta senza testo');
        if (o.when !== undefined) condition(o.when, act);
        if (o.once !== undefined) assert(typeof o.once === 'boolean', where + ': once non valido');
        mutations(o.effects || [], act); rulesSpec(o.rules, act, places, where, workers);
      }
    }
  });
}

// ---------- stato ----------
function mergeRules(base, r) {
  const out = clone(base);
  out.workers ??= {}; out.boost ??= {}; out.yearly ??= [];
  if (!r) return out;
  if (r.tokens !== undefined) out.tokens = r.tokens;
  if (r.tokensDelta !== undefined) out.tokens = clamp(out.tokens + r.tokensDelta, 1, 12);
  Object.assign(out.min, r.min || {});
  for (const [p, o] of Object.entries(r.places || {})) out.places[p] = { ...(out.places[p] || {}), ...clone(o) };
  if (r.upkeep !== undefined) out.upkeep = clone(r.upkeep);
  for (const [w, o] of Object.entries(r.workers || {})) out.workers[w] = { ...(out.workers[w] || {}), ...clone(o) };
  for (const [p, n] of Object.entries(r.boost || {})) out.boost[p] = Math.round(((out.boost[p] || 0) + n) * 1000) / 1000;
  if (r.yearly) out.yearly.push(...clone(r.yearly));
  return out;
}
// Persone presenti con forza e nome correnti (le regole possono cambiarli anno per anno).
export function workersOf(e, g) {
  return (e.workers || []).map(w => ({ ...w, ...(g.rules.workers[w.id] || {}) })).filter(w => !w.away);
}
const strengthOf = (e, g, workerId) => workersOf(e, g).find(w => w.id === workerId)?.strength || 0;
// Dove si può mandare qualcuno quest'anno: posti disponibili e lavori aperti.
export function targetsOf(e, g, state) {
  const places = e.places.filter(p => !p.when || matches(p.when, state)).map(p => ({ ...p, kind: 'place' }));
  const projects = (e.projects || []).filter(p => !g.built.includes(p.id) && (g.started.includes(p.id) || !p.when || matches(p.when, state))).map(p => ({ ...p, kind: 'project' }));
  return [...places, ...projects];
}
function recount(e, g) {
  if (!e.workers) return;
  const out = Object.fromEntries([...e.places, ...(e.projects || [])].map(p => [p.id, 0]));
  for (const [w, p] of Object.entries(g.assign)) out[p] += strengthOf(e, g, w);
  g.placement = out;
}
function enterTurn(e, g, state) {
  const t = e.turns[g.turn];
  g.rules = mergeRules(g.rules, t.rules);
  if (e.workers) {
    // Chi lavorava in un posto l'anno scorso ci resta, se il posto c'è ancora e la persona pure.
    const ok = new Set(targetsOf(e, g, state).map(x => x.id)), here = new Set(workersOf(e, g).map(w => w.id));
    g.assign = Object.fromEntries(Object.entries(g.assign).filter(([w, p]) => here.has(w) && ok.has(p)));
    recount(e, g);
  } else g.placement = Object.fromEntries(e.places.map(p => [p.id, 0]));
  if (e.reserve && state) g.reserve = Math.min(g.reserve, state.resources[e.reserve.from]);
  g.card = 0; g.result = null; g.eventResult = null; g.market = null;
  g.phase = t.cards?.length ? 'cards' : 'place';
}
export function initGame(e, state) {
  const g = { episodeId: e.id, turn: 0, phase: 'place', card: 0, placement: {}, assign: {}, progress: {}, started: [], built: [], reserve: e.reserve?.start ?? 0, bought: [], market: null,
    rules: mergeRules({ tokens: e.tokens ?? 0, min: {}, places: {}, upkeep: [] }, e.rules), fired: [], result: null, eventResult: null };
  enterTurn(e, g, state);
  return g;
}

// ---------- letture per l'interfaccia ----------
export const placeLabel = (e, g, p) => g.rules.places[p.id]?.label || p.label;
export const perToken = (e, g, p) => g.rules.places[p.id]?.perToken || p.perToken;
export const placed = g => Object.values(g.placement).reduce((n, v) => n + v, 0);
// Quanto della risorsa è già impegnato prima dell'anno: la riserva e il costo dei lavori che cominciano.
export function committed(e, g) {
  const out = {};
  if (e.reserve) out[e.reserve.from] = g.reserve;
  for (const p of e.projects || []) if (!g.started.includes(p.id) && Object.values(g.assign).includes(p.id)) for (const m of p.cost || []) out[m.id] = (out[m.id] || 0) - m.delta;
  return out;
}
const affordable = (e, g, state) => Object.entries(committed(e, g)).every(([k, n]) => n <= (state.resources[k] ?? state.metrics[k] ?? 0));
// Resa di un posto: imprevisto, migliorie e (se il posto la usa) riserva messa da parte.
export function yieldOf(e, g, placeId, luckYield = 1) {
  let m = luckYield * Math.max(0, 1 + (g.rules.boost[placeId] || 0));
  const r = e.reserve;
  if (r && r.places.includes(placeId)) m *= r.floor + (1 - r.floor) * Math.min(1, g.reserve / r.full);
  return Math.round(m * 1000) / 1000;
}
export function ready(e, g) {
  if (!e.workers) return placed(g) === g.rules.tokens;
  return workersOf(e, g).every(w => g.assign[w.id]);
}
export function chanceOf(spec, act, state) {
  if (!spec) return 1;
  const v = spec.metric === undefined ? 0 : (state.metrics[spec.metric] ?? state.resources[spec.metric] ?? 0);
  return clamp(Math.round((spec.base + (spec.factor || 0) * v) * 100) / 100, 0, 1);
}
export function luckOdds(e) {
  const total = e.luck.reduce((n, l) => n + l.weight, 0);
  return e.luck.map(l => ({ id: l.id, label: l.label, p: Math.round(100 * l.weight / total) }));
}
export function shortfalls(e, g) {
  return Object.entries(g.rules.min).filter(([p, n]) => (g.placement[p] || 0) < n).map(([p, n]) => ({ placeId: p, required: n, given: g.placement[p] || 0 }));
}
export function offerOpen(e, g, o, state) { return !g.market?.bought.includes(o.id) && !(o.once && g.bought.includes(o.id)) && (!o.when || matches(o.when, state)); }
// Quale scena mostrare: durante le card quella della card, altrimenti quella del tabellone.
export function activeStage(e, g) {
  if (g?.phase === 'cards') { const c = e.turns[g.turn].cards[g.card]; if (c?.stageId) return { stageId: c.stageId, motionId: c.motionId }; }
  return { stageId: e.stageId, motionId: e.motionId };
}
// Variazione netta per metrica, nell'ordine in cui compare: niente elenchi ripetuti.
export function netChanges(changes) {
  const map = new Map();
  for (const c of changes) {
    const key = c.kind + ':' + c.id, prev = map.get(key);
    if (prev) prev.after = c.after; else map.set(key, { kind: c.kind, id: c.id, label: c.label, before: c.before, after: c.after });
  }
  return [...map.values()].filter(c => c.before !== c.after);
}

// ---------- mosse ----------
function scaled(effects, n, mult = 1) { return effects.map(m => ({ ...m, delta: Math.round(m.delta * n * mult) })); }
function fireCrises(act, e, state, g, cause) {
  const out = [], changes = [];
  for (const c of e.crises || []) {
    if (g.fired.includes(c.id) || !matches(c.when, state)) continue;
    g.fired.push(c.id); g.rules = mergeRules(g.rules, c.rules);
    changes.push(...applyEffects(act, state, c.effects || [], cause + ':crisi:' + c.id));
    out.push({ id: c.id, text: c.text });
  }
  return { crises: out, changes };
}
function nextTurn(e, state, g) {
  g.turn++;
  if (g.turn >= e.turns.length) { g.phase = 'done'; return true; }
  enterTurn(e, g, state); return false;
}
function afterEvent(e, state, g, t) { if (t.market) { g.phase = 'market'; g.market = { bought: [], log: [], changes: [] }; } else nextTurn(e, state, g); }

export function turnAction(act, e, previous, action, seed) {
  assert(previous.phase === 'scene' && previous.game && previous.game.episodeId === e.id, 'Partita non attiva');
  assert(TURN_STEPS.includes(action.step), 'Mossa sconosciuta');
  const state = clone(previous), g = state.game, t = e.turns[g.turn], cause = e.id + ':' + g.turn;
  let changes = [], feedback = '';
  switch (action.step) {
    case 'card':
      assert(g.phase === 'cards', 'Non ci sono card da leggere');
      g.card++; if (g.card >= t.cards.length) { g.phase = 'place'; g.card = t.cards.length - 1; }
      break;
    case 'back':
      assert(g.phase === 'cards' && g.card > 0, 'Nessuna card precedente');
      g.card--; break;
    case 'assign': {
      assert(g.phase === 'place' && e.workers, 'Non è il momento di mandare qualcuno');
      const w = workersOf(e, g).find(x => x.id === action.workerId); assert(w, 'Persona non disponibile');
      if (action.placeId === null || action.placeId === undefined) { delete g.assign[w.id]; recount(e, g); break; }
      const p = targetsOf(e, g, state).find(x => x.id === action.placeId); assert(p, 'Posto non disponibile');
      const count = Object.entries(g.assign).filter(([k, v]) => v === p.id && k !== w.id).length;
      assert(p.max === undefined || count < p.max, 'Posto pieno');
      const before = g.assign[w.id]; g.assign[w.id] = p.id;
      if (p.kind === 'project' && !g.started.includes(p.id) && !affordable(e, g, state)) { if (before) g.assign[w.id] = before; else delete g.assign[w.id]; throw new Error('Non basta per cominciare questo lavoro'); }
      recount(e, g); break;
    }
    case 'reserve': {
      assert(g.phase === 'place' && e.reserve && (action.delta === 1 || action.delta === -1), 'Riserva non disponibile');
      const before = g.reserve; g.reserve = Math.max(0, g.reserve + action.delta * e.reserve.step);
      if (!affordable(e, g, state)) { g.reserve = before; throw new Error('Non ce n\'è abbastanza'); }
      break;
    }
    case 'place': {
      assert(g.phase === 'place' && !e.workers, 'Non è il momento di piazzare');
      const p = e.places.find(x => x.id === action.placeId);
      assert(p && (action.delta === 1 || action.delta === -1), 'Posto o quantità non validi');
      const next = g.placement[p.id] + action.delta;
      assert(next >= 0 && (p.max === undefined || next <= p.max), 'Posto pieno o vuoto');
      assert(action.delta < 0 || placed(g) < g.rules.tokens, 'Pedine finite');
      g.placement[p.id] = next; break;
    }
    case 'confirm': {
      assert(g.phase === 'place' && ready(e, g), e.workers ? 'Mandare tutti da qualche parte' : 'Piazzare tutte le pedine');
      assert(affordable(e, g, state), 'Non ce n\'è abbastanza');
      // Ogni gruppo di effetti è annotato con la sua voce: l'esito dell'anno spiega da dove viene ogni variazione.
      const steps = [], step = (label, list) => { const applied = applyEffects(act, state, list, cause + ':' + steps.length); changes.push(...applied); const net = netChanges(applied); if (net.length) steps.push({ label, changes: net.map(c => ({ kind: c.kind, id: c.id, label: c.label, delta: c.after - c.before })) }); };
      // 1. Si paga ciò che comincia e si mette da parte la riserva.
      for (const p of e.projects || []) if (!g.started.includes(p.id) && g.placement[p.id]) { g.started.push(p.id); step(p.label, p.cost || []); }
      if (e.reserve && g.reserve) step(e.reserve.label, [{ kind: 'resource', id: e.reserve.from, delta: -g.reserve }]);
      // 2. Si vive fino al raccolto: mantenimento dell'anno ed eventuali crisi.
      step(e.upkeepLabel || 'Ogni anno', [...(e.upkeep || []), ...g.rules.upkeep]);
      const early = fireCrises(act, e, state, g, cause); changes.push(...early.changes);
      const crisisStep = list => { const net = netChanges(list); if (net.length) steps.push({ label: e.crisisLabel || 'Crisi', changes: net.map(c => ({ kind: c.kind, id: c.id, label: c.label, delta: c.after - c.before })) }); };
      crisisStep(early.changes);
      // 3. L'imprevisto e la resa dei posti.
      const odds = e.luck, total = odds.reduce((n, l) => n + l.weight, 0), r = draw(seed, e.id, g.turn, 'imprevisto') * total;
      let acc = 0, luck = odds[odds.length - 1];
      for (const l of odds) { acc += l.weight; if (r < acc) { luck = l; break; } }
      for (const p of e.places) if (g.placement[p.id]) step(placeLabel(e, g, p), scaled(perToken(e, g, p), g.placement[p.id], yieldOf(e, g, p.id, luck.yield?.[p.id] ?? 1)));
      if (g.rules.yearly.length) step(e.yearlyLabel || 'Migliorie', g.rules.yearly);
      // 4. I lavori lunghi avanzano; quelli finiti restano e cambiano le regole.
      const built = [];
      for (const p of e.projects || []) {
        if (!g.placement[p.id]) continue;
        g.progress[p.id] = (g.progress[p.id] || 0) + g.placement[p.id];
        if (g.progress[p.id] >= p.work) {
          g.built.push(p.id); g.rules = mergeRules(g.rules, p.done.rules);
          step(p.label, p.done.effects || []);
          for (const [w, x] of Object.entries(g.assign)) if (x === p.id) delete g.assign[w];
          built.push({ id: p.id, label: p.label, text: p.done.text });
        }
      }
      if (e.reserve) g.reserve = Math.min(g.reserve, state.resources[e.reserve.from]);
      recount(e, g);
      // 5. Il controllo sugli obblighi e le crisi di fine anno.
      let control = null;
      const short = shortfalls(e, g);
      if (e.control && short.length) {
        const p = chanceOf(e.control.chance, act, previous), caught = draw(seed, e.id, g.turn, 'controllo') < p;
        control = { p: Math.round(p * 100), caught, text: caught ? e.control.text : null };
        if (caught) step(e.control.label || 'Controllo', [...(e.control.effects || []), ...scaled(e.control.perMissing || [], short.reduce((n, s) => n + s.required - s.given, 0))]);
      }
      const c = fireCrises(act, e, state, g, cause); changes.push(...c.changes); crisisStep(c.changes);
      const crises = [...early.crises, ...c.crises];
      g.result = { luck: { id: luck.id, label: luck.label }, control, crises, built, steps, changes: netChanges(changes), preview: t.preview || null };
      feedback = [t.label + ': ' + luck.label + '.', ...built.map(x => x.text), control?.caught ? e.control.text : null, ...crises.map(x => x.text)].filter(Boolean).join(' ');
      g.phase = 'result'; break;
    }
    case 'continue':
      if (g.phase === 'result') { if (t.event) g.phase = 'event'; else afterEvent(e, state, g, t); }
      else if (g.phase === 'eventResult') afterEvent(e, state, g, t);
      else throw new Error('Niente da far proseguire');
      break;
    case 'choose': {
      assert(g.phase === 'event', 'Nessuno sta bussando');
      const c = t.event.choices.find(x => x.id === action.choiceId); assert(c && (!c.when || matches(c.when, previous)), 'Risposta non disponibile');
      let o = c, p = null, success = null;
      if (c.chance) { p = chanceOf(c.chance, act, previous); success = draw(seed, e.id, g.turn, 'evento', c.id) < p; o = success ? c.success : c.failure; }
      g.rules = mergeRules(g.rules, o.rules);
      changes.push(...applyEffects(act, state, o.effects || [], cause + ':' + c.id));
      const cr = fireCrises(act, e, state, g, cause); changes.push(...cr.changes);
      g.eventResult = { choiceId: c.id, text: o.text, p: p === null ? null : Math.round(p * 100), success, crises: cr.crises, changes: netChanges(changes) };
      feedback = [t.label + ' · ' + t.event.who + ': «' + c.label + '».', o.text, ...cr.crises.map(x => x.text)].join(' ');
      g.phase = 'eventResult'; break;
    }
    case 'buy': {
      assert(g.phase === 'market', 'Nessun mercato');
      const o = t.market.offers.find(x => x.id === action.offerId);
      assert(o && !g.market.bought.includes(o.id) && !(o.once && g.bought.includes(o.id)) && (!o.when || matches(o.when, previous)), 'Offerta non disponibile');
      g.market.bought.push(o.id); if (o.once) g.bought.push(o.id);
      g.rules = mergeRules(g.rules, o.rules);
      changes.push(...applyEffects(act, state, o.effects || [], cause + ':' + o.id));
      const cr = fireCrises(act, e, state, g, cause); changes.push(...cr.changes);
      g.market.log.push(o.text, ...cr.crises.map(x => x.text)); g.market.changes = netChanges([...g.market.changes, ...changes]);
      feedback = [t.label + ' · ' + t.market.who + ': «' + o.label + '».', o.text, ...cr.crises.map(x => x.text)].join(' ');
      break;
    }
    case 'leave':
      assert(g.phase === 'market', 'Nessun mercato');
      nextTurn(e, state, g); break;
  }
  if (g.phase === 'done') {
    state.turn++; state.events.push(e.id); state.phase = 'outcome';
    feedback = e.feedback; state.last = { feedback, changes: [], events: [], sourceDecisionId: e.id };
  }
  assert(PHASES.includes(g.phase), 'Fase non valida');
  return { state, appliedChanges: changes, events: [], feedback };
}
