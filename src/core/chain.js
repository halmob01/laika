// Le merci che camminano e il quanto serve e quanto c'è (GIOCHI §3.6 e §3.7). Modulo accanto a turns.js:
// logica pura e deterministica, nessun contenuto di un gioco.
//
// Una catena di quattro o cinque anelli (per esempio campi, granai, treni, città). A ogni turno una quantità entra nel
// primo anello e ogni anello passa al successivo al massimo quanto la sua capacità. Un anello che si riempie troppo
// si inceppa: dal turno dopo passa solo una frazione. Alla fine della catena la merce «arriva»: è il numero reale.
// Accanto c'è il numero sulla carta (l'obiettivo dichiarato, il rapporto). I due numeri sono distinti: lo scarto fra
// carta e realtà è una metrica dell'atto, e le decisioni lo possono allargare o chiudere.
//
// Contratto dati, nell'episodio `turn_game`:
//   chain: {
//     label?, goodsLabel?,                                          // «Il grano verso la città», «grano»
//     links:  [{id, label, capacity?, stock?, jamText?, figure?}],  // da 4 a 5; l'ultimo è la destinazione (senza capacità)
//     supply?: n,                                                   // entra nel primo anello a ogni turno (predefinito 0)
//     paper:  {start: n},                                           // il numero sulla carta
//     deliver?: {metric, per},                                      // ogni unità arrivata muove `metric` di `per`
//     gap?:   {metric},                                             // la metrica che segue «carta meno realtà» (0 se la realtà supera la carta)
//     jam?:   {at, factor}                                          // un anello intermedio (non il primo né l'ultimo) con almeno `at` unità si inceppa; passa `factor` della capacità (0..1)
//   }
// In un turno: `chain: {supply?, paper?}`: `supply` vale solo per quel turno (un raccolto scarso); `paper` cambia il numero sulla carta da lì in poi (un rapporto gonfiato).
// In una risposta, un esito o un'offerta: `chain: [{link, capacity?: n, stock?: n} | {paper: n}]` (cambiamenti, positivi o negativi).
import {assert, text, id, unique} from './schema.js';

const int = (n, a, b) => Number.isInteger(n) && n >= a && n <= b;

export function validateChain(c, act, where = 'Catena') {
  assert(c && typeof c === 'object' && !Array.isArray(c), where + ': non valida');
  for (const k of ['label', 'goodsLabel']) if (c[k] !== undefined) assert(text(c[k]) && c[k].length <= 40, where + ': etichetta non valida: ' + k);
  const ids = unique(c.links, where + ': anelli', 4);
  assert(c.links.length <= 5, where + ': al massimo cinque anelli');
  c.links.forEach((l, i) => {
    assert(text(l.label) && l.label.length <= 40, where + ': anello senza nome: ' + l.id);
    if (i < c.links.length - 1) assert(int(l.capacity, 1, 60), where + ': capacità non valida per ' + l.id);
    else assert(l.capacity === undefined, where + ': l\'ultimo anello è la destinazione e non ha capacità');
    if (l.stock !== undefined) assert(int(l.stock, 0, 200), where + ': scorta non valida per ' + l.id);
    if (l.jamText !== undefined) assert(text(l.jamText), where + ': testo dell\'inceppo vuoto per ' + l.id);
    if (l.figure !== undefined) assert(id(l.figure), where + ': figura dell\'anello non valida: ' + l.id);
  });
  if (c.supply !== undefined) assert(int(c.supply, 0, 100), where + ': offerta per turno non valida');
  assert(c.paper && int(c.paper.start, 0, 999), where + ': numero sulla carta mancante');
  const metric = m => [...(act.metrics || []), ...(act.resources || [])].some(d => d.id === m);
  if (c.deliver !== undefined) assert(metric(c.deliver.metric) && int(c.deliver.per, 1, 10), where + ': consegna non valida');
  if (c.gap !== undefined) assert(metric(c.gap.metric), where + ': metrica dello scarto sconosciuta');
  if (c.jam !== undefined) assert(int(c.jam.at, 2, 100) && Number.isFinite(c.jam.factor) && c.jam.factor >= 0 && c.jam.factor <= 1, where + ': inceppo non valido');
  return ids;
}

export function validateChainEdits(list, c, where) {
  if (list === undefined) return;
  assert(c, where + ': la catena non è dichiarata nell\'episodio');
  assert(Array.isArray(list) && list.length >= 1, where + ': modifiche della catena non valide');
  const ids = new Set(c.links.map(l => l.id));
  for (const m of list) {
    assert(m && typeof m === 'object', where + ': modifica della catena non valida');
    if (m.paper !== undefined) { assert(int(m.paper, -500, 500) && m.paper !== 0 && m.link === undefined, where + ': modifica della carta non valida'); continue; }
    assert(ids.has(m.link) && (m.capacity !== undefined) !== (m.stock !== undefined), where + ': modifica dell\'anello non valida');
    const v = m.capacity ?? m.stock;
    assert(int(v, -60, 60) && v !== 0, where + ': valore della modifica non valido');
    if (m.capacity !== undefined) assert(m.link !== c.links[c.links.length - 1].id, where + ': la destinazione non ha capacità');
  }
}
export function validateTurnChain(t, c, where) {
  if (t.chain === undefined) return;
  assert(c, where + ': la catena non è dichiarata nell\'episodio');
  assert(t.chain && typeof t.chain === 'object' && !Array.isArray(t.chain), where + ': catena del turno non valida');
  if (t.chain.supply !== undefined) assert(int(t.chain.supply, -100, 100), where + ': offerta del turno non valida');
  if (t.chain.paper !== undefined) assert(int(t.chain.paper, -500, 500), where + ': carta del turno non valida');
}

export function initChain(c) {
  return {
    stock: Object.fromEntries(c.links.map(l => [l.id, l.stock ?? 0])),
    capacity: Object.fromEntries(c.links.filter(l => l.capacity !== undefined).map(l => [l.id, l.capacity])),
    jammed: [], paper: c.paper.start, real: 0, last: null
  };
}

// Quanto passa adesso da un anello: la capacità, ridotta se l'anello è inceppato.
export const effectiveCapacity = (c, s, linkId) => s.jammed.includes(linkId) ? Math.floor(s.capacity[linkId] * (c.jam?.factor ?? 1)) : s.capacity[linkId];
export const gapOf = s => Math.max(0, s.paper - s.real);

// Fine del turno: entra l'offerta, ogni anello passa al successivo, gli anelli troppo pieni si inceppano per il turno dopo,
// la merce arrivata muove la metrica di consegna e lo scarto fra carta e realtà segue.
// `deps`: {applyEffects, act, state} dal motore.
export function chainTick(c, g, t, deps, cause) {
  const s = g.chain, first = c.links[0].id, last = c.links[c.links.length - 1].id, moved = {}, before = { ...s.stock };
  const supply = (c.supply ?? 0) + (t?.chain?.supply ?? 0);
  s.stock[first] = Math.max(0, s.stock[first] + supply);
  // Le merci fanno un anello a turno: si muove quello che c'era all'inizio del turno (dopo l'offerta), non quello appena arrivato.
  const inizio = { ...s.stock };
  for (let i = 0; i < c.links.length - 1; i++) {
    const from = c.links[i].id, to = c.links[i + 1].id, m = Math.min(inizio[from], effectiveCapacity(c, s, from));
    s.stock[from] -= m; s.stock[to] += m; moved[from] = m;
  }
  const delivered = moved[c.links[c.links.length - 2].id];
  s.real += delivered; s.paper = Math.max(0, s.paper + (t?.chain?.paper ?? 0));
  const wasJammed = s.jammed;
  s.jammed = c.jam ? c.links.slice(1, -1).filter(l => s.stock[l.id] >= c.jam.at).map(l => l.id) : [];
  const effects = [];
  if (c.deliver && delivered) effects.push({ kind: 'metric', id: c.deliver.metric, delta: delivered * c.deliver.per });
  const changes = effects.length ? deps.applyEffects(deps.act, deps.state, effects, cause) : [];
  if (c.gap) {
    const now = deps.state.metrics[c.gap.metric] ?? deps.state.resources[c.gap.metric], want = gapOf(s);
    const kind = c.gap.metric in deps.state.metrics ? 'metric' : 'resource';
    if (want !== now) changes.push(...deps.applyEffects(deps.act, deps.state, [{ kind, id: c.gap.metric, delta: want - now }], cause + ':scarto'));
  }
  const newly = s.jammed.filter(x => !wasJammed.includes(x));
  s.last = { turn: g.turn, supply, moved, delivered, jammed: [...s.jammed], newlyJammed: newly, freed: wasJammed.filter(x => !s.jammed.includes(x)), stock: { ...s.stock }, before, paper: s.paper, real: s.real, gap: gapOf(s), changes: [], crises: [] };
  return changes;
}

// Una risposta o un'offerta cambia le capacità, le scorte o il numero sulla carta.
export function applyChainEdits(c, g, list) {
  const s = g.chain, out = [];
  for (const m of list || []) {
    if (m.paper !== undefined) { const b = s.paper; s.paper = Math.max(0, s.paper + m.paper); out.push({ paper: true, before: b, after: s.paper }); continue; }
    if (m.capacity !== undefined) {
      const start = c.links.find(l => l.id === m.link).capacity, b = s.capacity[m.link];
      s.capacity[m.link] = Math.min(start * 2, Math.max(0, b + m.capacity)); out.push({ link: m.link, capacity: true, before: b, after: s.capacity[m.link] });
    } else { const b = s.stock[m.link]; s.stock[m.link] = Math.max(0, b + m.stock); out.push({ link: m.link, stock: true, before: b, after: s.stock[m.link] }); }
  }
  return out;
}

// Lettura per l'interfaccia: gli anelli con scorta, capacità di adesso e inceppo, i due numeri e il loro scarto.
export function chainView(c, g) {
  const s = g.chain;
  return {
    paper: s.paper, real: s.real, gap: gapOf(s),
    links: c.links.map((l, i) => ({
      id: l.id, label: l.label, stock: s.stock[l.id], last: i === c.links.length - 1,
      capacity: i === c.links.length - 1 ? null : effectiveCapacity(c, s, l.id), jammed: s.jammed.includes(l.id), jamText: l.jamText || 'si è inceppato'
    })),
    last: s.last
  };
}
