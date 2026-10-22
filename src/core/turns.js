// Partita a turni: tabellone di posti, pedine da piazzare, imprevisto con probabilità scritte,
// obblighi controllati, crisi, card del racconto e una carta «chi bussa» per turno.
// Logica pura e deterministica: il caso dipende dal seme della sessione, così il salvataggio
// (registro delle mosse rigiocato) ricostruisce la stessa partita. Nessun contenuto di un gioco qui.
import {assert, text, id, unique, condition, mutations, CONTEXT_LABELS} from './schema.js';
import {applyEffects, matches, clamp, clone} from './engine.js';

export const TURN_STEPS = ['card', 'back', 'place', 'confirm', 'choose', 'continue'];
const PHASES = ['cards', 'place', 'result', 'event', 'eventResult', 'done'];

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
function rulesSpec(r, act, places, where) {
  if (r === undefined) return;
  assert(r && typeof r === 'object' && !Array.isArray(r) && Object.keys(r).every(k => ['tokens', 'tokensDelta', 'min', 'places', 'upkeep'].includes(k)), where + ': regole non valide');
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
export function validateTurnGame(e, act, stages) {
  const places = unique(e.places, 'Posti', 2);
  for (const p of e.places) {
    assert(text(p.label) && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1, 'Posto non valido: ' + p.id);
    mutations(p.perToken, act); assert(p.perToken.every(m => m.kind !== 'flag'), 'Effetti per pedina solo numerici');
    if (p.max !== undefined) assert(Number.isInteger(p.max) && p.max >= 0, 'Massimo del posto non valido');
  }
  assert(Number.isInteger(e.tokens) && e.tokens >= 1 && e.tokens <= 12, 'Pedine non valide');
  assert(text(e.tokenLabel), 'Nome delle pedine mancante');
  mutations(e.upkeep || [], act);
  unique(e.luck, 'Imprevisti', 1);
  for (const l of e.luck) {
    assert(text(l.label) && Number.isFinite(l.weight) && l.weight > 0, 'Imprevisto non valido');
    for (const [p, m] of Object.entries(l.yield || {})) assert(places.has(p) && Number.isFinite(m) && m >= 0, 'Resa dell\'imprevisto non valida');
  }
  if (e.control !== undefined) {
    assert(text(e.control.text), 'Controllo senza testo'); chanceSpec(e.control.chance, act, 'Controllo'); mutations(e.control.effects || [], act);
    // Effetti moltiplicati per ogni pedina mancante rispetto agli obblighi: chi salta di più paga di più.
    if (e.control.perMissing !== undefined) { mutations(e.control.perMissing, act); assert(e.control.perMissing.every(m => m.kind !== 'flag'), 'Controllo: effetti per pedina mancante solo numerici'); }
  }
  rulesSpec(e.rules, act, places, 'Regole iniziali');
  for (const c of e.crises || []) {
    assert(id(c.id) && text(c.text) && c.when, 'Crisi non valida'); condition(c.when, act); mutations(c.effects || [], act); rulesSpec(c.rules, act, places, 'Crisi ' + c.id);
  }
  unique(e.crises || [], 'Crisi');
  assert(text(e.feedback), 'Partita senza testo finale');
  assert(Array.isArray(e.turns) && e.turns.length >= 1 && e.turns.length <= 20, 'Turni non validi');
  e.turns.forEach((t, i) => {
    const where = 'Turno ' + (i + 1);
    assert(t && text(t.label), where + ': etichetta mancante');
    cardsSpec(t.cards, stages, where); rulesSpec(t.rules, act, places, where);
    if (t.preview !== undefined) assert(text(t.preview), where + ': avviso vuoto');
    if (t.event !== undefined) {
      const ev = t.event; assert(text(ev.who) && text(ev.text), where + ': chi bussa senza testo');
      unique(ev.choices, where + ': risposte', 2);
      for (const c of ev.choices) {
        assert(text(c.label), where + ': risposta vuota');
        if (c.chance) {
          chanceSpec(c.chance, act, where);
          for (const k of ['success', 'failure']) { const o = c[k]; assert(o && text(o.text), where + ': esito ' + k + ' mancante'); mutations(o.effects || [], act); rulesSpec(o.rules, act, places, where); }
        } else { assert(text(c.text), where + ': esito della risposta mancante'); mutations(c.effects || [], act); rulesSpec(c.rules, act, places, where); }
      }
    }
  });
}

// ---------- stato ----------
function mergeRules(base, r) {
  const out = clone(base);
  if (!r) return out;
  if (r.tokens !== undefined) out.tokens = r.tokens;
  if (r.tokensDelta !== undefined) out.tokens = clamp(out.tokens + r.tokensDelta, 1, 12);
  Object.assign(out.min, r.min || {});
  for (const [p, o] of Object.entries(r.places || {})) out.places[p] = { ...(out.places[p] || {}), ...clone(o) };
  if (r.upkeep !== undefined) out.upkeep = clone(r.upkeep);
  return out;
}
function enterTurn(e, g) {
  const t = e.turns[g.turn];
  g.rules = mergeRules(g.rules, t.rules);
  g.placement = Object.fromEntries(e.places.map(p => [p.id, 0]));
  g.card = 0; g.result = null; g.eventResult = null;
  g.phase = t.cards?.length ? 'cards' : 'place';
}
export function initGame(e) {
  const g = { episodeId: e.id, turn: 0, phase: 'place', card: 0, placement: {}, rules: mergeRules({ tokens: e.tokens, min: {}, places: {}, upkeep: [] }, e.rules), fired: [], result: null, eventResult: null };
  enterTurn(e, g);
  return g;
}

// ---------- letture per l'interfaccia ----------
export const placeLabel = (e, g, p) => g.rules.places[p.id]?.label || p.label;
export const perToken = (e, g, p) => g.rules.places[p.id]?.perToken || p.perToken;
export const placed = g => Object.values(g.placement).reduce((n, v) => n + v, 0);
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
  enterTurn(e, g); return false;
}

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
    case 'place': {
      assert(g.phase === 'place', 'Non è il momento di piazzare');
      const p = e.places.find(x => x.id === action.placeId);
      assert(p && (action.delta === 1 || action.delta === -1), 'Posto o quantità non validi');
      const next = g.placement[p.id] + action.delta;
      assert(next >= 0 && (p.max === undefined || next <= p.max), 'Posto pieno o vuoto');
      assert(action.delta < 0 || placed(g) < g.rules.tokens, 'Pedine finite');
      g.placement[p.id] = next; break;
    }
    case 'confirm': {
      assert(g.phase === 'place' && placed(g) === g.rules.tokens, 'Piazzare tutte le pedine');
      const odds = e.luck, total = odds.reduce((n, l) => n + l.weight, 0), r = draw(seed, e.id, g.turn, 'imprevisto') * total;
      let acc = 0, luck = odds[odds.length - 1];
      for (const l of odds) { acc += l.weight; if (r < acc) { luck = l; break; } }
      for (const p of e.places) changes.push(...applyEffects(act, state, scaled(perToken(e, g, p), g.placement[p.id], luck.yield?.[p.id] ?? 1), cause + ':' + p.id));
      changes.push(...applyEffects(act, state, [...(e.upkeep || []), ...g.rules.upkeep], cause + ':anno'));
      let control = null;
      const short = shortfalls(e, g);
      if (e.control && short.length) {
        const p = chanceOf(e.control.chance, act, previous), caught = draw(seed, e.id, g.turn, 'controllo') < p;
        control = { p: Math.round(p * 100), caught, text: caught ? e.control.text : null };
        if (caught) changes.push(...applyEffects(act, state, [...(e.control.effects || []), ...scaled(e.control.perMissing || [], short.reduce((n, s) => n + s.required - s.given, 0))], cause + ':controllo'));
      }
      const c = fireCrises(act, e, state, g, cause); changes.push(...c.changes);
      g.result = { luck: { id: luck.id, label: luck.label }, control, crises: c.crises, changes: netChanges(changes), preview: t.preview || null };
      g.phase = 'result'; break;
    }
    case 'continue':
      if (g.phase === 'result') { if (t.event) g.phase = 'event'; else nextTurn(e, state, g); }
      else if (g.phase === 'eventResult') nextTurn(e, state, g);
      else throw new Error('Niente da far proseguire');
      break;
    case 'choose': {
      assert(g.phase === 'event', 'Nessuno sta bussando');
      const c = t.event.choices.find(x => x.id === action.choiceId); assert(c, 'Risposta non disponibile');
      let o = c, p = null, success = null;
      if (c.chance) { p = chanceOf(c.chance, act, previous); success = draw(seed, e.id, g.turn, 'evento', c.id) < p; o = success ? c.success : c.failure; }
      g.rules = mergeRules(g.rules, o.rules);
      changes.push(...applyEffects(act, state, o.effects || [], cause + ':' + c.id));
      const cr = fireCrises(act, e, state, g, cause); changes.push(...cr.changes);
      g.eventResult = { choiceId: c.id, text: o.text, p: p === null ? null : Math.round(p * 100), success, crises: cr.crises, changes: netChanges(changes) };
      g.phase = 'eventResult'; break;
    }
  }
  if (g.phase === 'done') {
    state.turn++; state.events.push(e.id); state.phase = 'outcome';
    feedback = e.feedback; state.last = { feedback, changes: [], events: [], sourceDecisionId: e.id };
  }
  assert(PHASES.includes(g.phase), 'Fase non valida');
  return { state, appliedChanges: changes, events: [], feedback };
}
