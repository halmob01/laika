// La coda con la pazienza (GIOCHI §3.5). Modulo accanto a turns.js: logica pura e deterministica, nessun contenuto di un gioco.
//
// Un gruppo in fila ha una pazienza che scende a ogni turno. A soglie fisse manda un segnale visibile
// (una posa, una frase). A zero lascia la fila e va a una destinazione, che sposta gli indicatori.
// Il gelo e le voci sono «fattori» con una condizione: quando valgono, la pazienza scende più in fretta.
// Il giocatore vede la crisi arrivare (queueView) e può intervenire con scelte e azioni che alzano la pazienza
// (campo `queue` di una risposta, di un esito o di un'offerta).
//
// Contratto dati, nell'episodio `turn_game`:
//   queue: {
//     label?, patienceLabel?,
//     groups:  [{id, label, size, patience, exit, figure?}],      // size: persone; patience: turni di attesa; exit: id di una destinazione
//     signals: [{at, label, pose?}],                              // at: soglia di pazienza (1 o più); vale per ogni gruppo
//     drain:   {base?, factors?: [{id, label, when, extra}]},     // base: di quanto scende ogni turno (predefinito 1)
//     exits:   [{id, label, text, effects}]                       // effects: mutazioni degli indicatori quando un gruppo se ne va
//   }
// In un turno: `queue: {drain?, note?}` (gelo o ressa solo di quel turno).
// In una risposta, un esito o un'offerta: `queue: [{group, patience}]` con `group` un id oppure «*» e `patience` il cambiamento
// (positivo o negativo); chi è ancora in fila non può essere mandato via da una risposta: la pazienza non scende sotto 1.
import {assert, text, id, unique, condition, mutations} from './schema.js';

const int = (n, a, b) => Number.isInteger(n) && n >= a && n <= b;

export function validateQueue(q, act, where = 'Coda') {
  assert(q && typeof q === 'object' && !Array.isArray(q), where + ': non valida');
  for (const k of ['label', 'patienceLabel']) if (q[k] !== undefined) assert(text(q[k]) && q[k].length <= 40, where + ': etichetta non valida: ' + k);
  const exits = new Set(unique(q.exits, where + ': destinazioni', 1));
  for (const x of q.exits) { assert(text(x.label) && text(x.text), where + ': destinazione senza testo: ' + x.id); mutations(x.effects || [], act); }
  unique(q.groups, where + ': gruppi', 1);
  assert(q.groups.length <= 6, where + ': troppi gruppi');
  for (const g of q.groups) {
    assert(text(g.label) && int(g.size, 1, 99) && int(g.patience, 2, 30), where + ': gruppo non valido: ' + g.id);
    assert(exits.has(g.exit), where + ': destinazione sconosciuta per ' + g.id);
    if (g.figure !== undefined) assert(id(g.figure), where + ': figura del gruppo non valida: ' + g.id);
  }
  assert(Array.isArray(q.signals) && q.signals.length >= 1 && q.signals.length <= 5, where + ': segnali non validi');
  const seen = new Set();
  for (const s of q.signals) {
    assert(s && int(s.at, 1, 29) && text(s.label) && !seen.has(s.at), where + ': segnale non valido o soglia ripetuta');
    seen.add(s.at);
    if (s.pose !== undefined) assert(id(s.pose), where + ': posa del segnale non valida');
    assert(q.groups.every(g => s.at < g.patience), where + ': la soglia di un segnale deve stare sotto la pazienza di partenza');
  }
  const d = q.drain ?? {};
  if (d.base !== undefined) assert(int(d.base, 0, 5), where + ': discesa di base non valida');
  unique(d.factors || [], where + ': fattori', 0);
  for (const f of d.factors || []) { assert(text(f.label) && int(f.extra, 1, 5), where + ': fattore non valido: ' + f.id); condition(f.when, act); }
}

// Una risposta, un esito o un'offerta può alzare o abbassare la pazienza.
export function validateQueueEdits(list, q, where) {
  if (list === undefined) return;
  assert(q, where + ': la coda non è dichiarata nell\'episodio');
  assert(Array.isArray(list) && list.length >= 1, where + ': modifiche della coda non valide');
  for (const m of list) assert(m && (m.group === '*' || q.groups.some(g => g.id === m.group)) && int(m.patience, -10, 10) && m.patience !== 0, where + ': modifica della coda non valida');
}
export function validateTurnQueue(t, q, where) {
  if (t.queue === undefined) return;
  assert(q, where + ': la coda non è dichiarata nell\'episodio');
  assert(t.queue && typeof t.queue === 'object' && !Array.isArray(t.queue), where + ': coda del turno non valida');
  if (t.queue.drain !== undefined) assert(int(t.queue.drain, 0, 5), where + ': discesa del turno non valida');
  if (t.queue.note !== undefined) assert(text(t.queue.note), where + ': nota della coda vuota');
}

export const initQueue = q => ({
  groups: Object.fromEntries(q.groups.map(g => [g.id, { patience: g.patience, max: g.patience, gone: false, goneTurn: null }])),
  last: null, log: []
});

// Di quanto scenderà la pazienza alla fine del turno, con i fattori che valgono adesso.
export function queueDrain(q, t, state, matches) {
  const factors = (q.drain?.factors || []).filter(f => matches(f.when, state)).map(f => ({ id: f.id, label: f.label, extra: f.extra }));
  const base = q.drain?.base ?? 1, turn = t?.queue?.drain ?? 0;
  return { base, turn, factors, total: base + turn + factors.reduce((n, f) => n + f.extra, 0) };
}

// Fine del turno: la pazienza scende, i segnali partono alle soglie, chi arriva a zero se ne va.
// `deps`: {matches, applyEffects, netChanges, act} dal motore (il modulo non li importa: niente giri fra moduli).
export function queueTick(q, g, t, state, deps, cause) {
  const d = queueDrain(q, t, state, deps.matches), events = [], changes = [];
  const sorted = [...q.signals].sort((a, b) => a.at - b.at);
  for (const grp of q.groups) {
    const s = g.queue.groups[grp.id];
    if (s.gone) continue;
    const before = s.patience, after = Math.max(0, before - d.total);
    s.patience = after;
    if (after === 0) {
      const x = q.exits.find(y => y.id === grp.exit);
      s.gone = true; s.goneTurn = g.turn;
      changes.push(...deps.applyEffects(deps.act, state, x.effects || [], cause + ':' + grp.id));
      events.push({ group: grp.id, groupLabel: grp.label, kind: 'left', exit: x.id, text: grp.label + ': ' + x.text });
      continue;
    }
    // Il segnale più urgente fra quelli appena superati (uno solo per gruppo e turno).
    const hit = sorted.find(sig => before > sig.at && after <= sig.at);
    if (hit) events.push({ group: grp.id, groupLabel: grp.label, kind: 'signal', at: hit.at, pose: hit.pose || null, text: grp.label + ': ' + hit.label });
  }
  g.queue.last = { turn: g.turn, drain: d, events, changes: deps.netChanges(changes) };
  g.queue.log.push({ turn: g.turn, drain: d.total, events: events.map(e => ({ group: e.group, kind: e.kind, at: e.at ?? null })) });
  return changes;
}

// Una risposta o un'offerta cambia la pazienza di chi è ancora in fila (mai sotto 1, mai sopra la partenza).
export function applyQueueEdits(q, g, list) {
  const out = [];
  for (const m of list || []) {
    for (const grp of q.groups) {
      if (m.group !== '*' && m.group !== grp.id) continue;
      const s = g.queue.groups[grp.id];
      if (s.gone) continue;
      const before = s.patience;
      s.patience = Math.min(s.max, Math.max(1, before + m.patience));
      if (s.patience !== before) out.push({ group: grp.id, before, after: s.patience });
    }
  }
  return out;
}

// Lettura per l'interfaccia: chi è in fila, quanto resta, che segnale arriverà, tra quanti turni se ne va.
export function queueView(q, g, t, state, matches) {
  const d = queueDrain(q, t, state, matches), sorted = [...q.signals].sort((a, b) => b.at - a.at);
  return {
    drain: d,
    groups: q.groups.map(grp => {
      const s = g.queue.groups[grp.id], next = s.gone ? null : sorted.find(sig => sig.at < s.patience) || null;
      const turnsToSignal = next && d.total > 0 ? Math.ceil((s.patience - next.at) / d.total) : null;
      return {
        id: grp.id, label: grp.label, size: grp.size, patience: s.patience, max: s.max, gone: s.gone, goneTurn: s.goneTurn,
        exit: q.exits.find(x => x.id === grp.exit).label, next, turnsToSignal,
        turnsToLeave: s.gone || d.total === 0 ? null : Math.ceil(s.patience / d.total),
        // La posa da mostrare adesso: quella del segnale più urgente già superato.
        pose: s.gone ? null : [...q.signals].sort((a, b) => a.at - b.at).find(sig => s.patience <= sig.at)?.pose || null
      };
    })
  };
}
