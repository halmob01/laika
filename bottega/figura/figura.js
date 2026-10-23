// Figura articolata della bottega. Porting fedele di buildOminoSVG (studio personaggi.html):
// stessi tracciati, stesse giunture, stesso ordine di disegno; in più ID semantici, pivot
// dichiarati, pose come dati e oggetti agganciati a "prese" invece che disegnati nel braccio.
//
// Convenzione: i piedi della figura in piedi toccano y=0 dell'istanza; x=0 è l'asse del corpo.
import {markupToLayers} from '../strumenti/svg-in-layer.js';
import {POSE,VARIANTI,RUOLI,CORPI} from './pose.js';

export const PIEDI = 42; // distanza bacino-suolo nella posa in piedi (unità della figura)
export const GIUNTURE = ['root','head','arm-far','forearm-far','hand-far','leg-far','shin-far','leg-near','shin-near','arm-near','forearm-near','wrist-near','hand-near','grip-near'];
const MARGINE = 45; // escursione ammessa oltre le pose dichiarate, per camminate e gesti

const r3 = n => Math.round(n * 1000) / 1000;
function limbPath(w1, w2, len) {
  const a = r3(w1 / 2), b = r3(w2 / 2);
  return `M ${-a} 0 A ${a} ${a} 0 1 1 ${a} 0 L ${b} ${len} A ${b} ${b} 0 1 1 ${-b} ${len} Z`;
}
const path = (id, parent, d, fill = 'ink', extra = {}) => ({ id, tag: 'path', parent, attrs: { d, fill, ...extra } });
const group = (id, parent, pose, origin = [0, 0]) => ({ id, tag: 'g', ...(parent ? { parent } : {}), pose, origin });

// Valori delle giunture per una posa dello studio (prese contro-ruotate: restano verticali).
export function jointsFor(p) {
  return {
    root: { rotate: p.lean || 0, translateY: p.yOff || 0 }, head: 0,
    'arm-far': p.shL, 'forearm-far': p.elL, 'hand-far': -(p.shL + p.elL),
    'leg-far': p.hipL, 'shin-far': p.knL, 'leg-near': p.hipR, 'shin-near': p.knR,
    'arm-near': p.shR, 'forearm-near': p.elR,
    'wrist-near': -(p.shR + p.elR), 'hand-near': -(p.shR + p.elR), 'grip-near': -(p.shR + p.elR)
  };
}
function ranges() {
  const out = {};
  for (const j of GIUNTURE) {
    const values = Object.values(POSE).map(p => { const v = jointsFor(p)[j]; return typeof v === 'number' ? v : v.rotate; });
    out[j] = [Math.max(-360, Math.min(...values) - MARGINE), Math.min(360, Math.max(...values) + MARGINE)];
  }
  return out;
}
const RANGES = ranges();

// Descrittore canonico di una variante: corpo, copricapo, abito, zaino, fascia.
export function variante({ variant = 'nessuna', body, hat, coat, acc, role = 'popolo' } = {}) {
  const v = VARIANTI[variant];
  if (!v) throw new Error('Variante sconosciuta: ' + variant);
  if (!RUOLI[role]) throw new Error('Ruolo sconosciuto: ' + role);
  const b = body ?? v.body;
  if (!CORPI[b]) throw new Error('Corpo sconosciuto: ' + b);
  return { body: b, hat: hat !== undefined ? hat : v.hat, coat: coat !== undefined ? coat : v.coat, acc: acc !== undefined ? acc : v.acc, fascia: Boolean(RUOLI[role].fascia), recolor: RUOLI[role].recolor };
}
export function figuraId(d) {
  return ['fig', d.body, d.hat || 'nudo', d.coat || 'base', d.acc === 'zaino' ? 'zaino' : null, d.fascia ? 'fascia' : null].filter(Boolean).join('-').replace(/_/g, '-');
}

// Simbolo della figura (una per combinazione di corpo/abito), con rig completo.
export function figuraSymbol(d) {
  const k = CORPI[d.body], rest = jointsFor(POSE.in_piedi), L = [];
  const joint = (id, parent, x, y, origin) => { const r = rest[id]; const v = typeof r === 'number' ? { rotate: r } : r; L.push(group(id, parent, { translateX: x, translateY: y, ...v }, origin)); };
  L.push(group('corpo', null, { translateY: r3(-PIEDI * k), scale: k }));
  L.push(group('root', 'corpo', { rotate: 0, translateY: 0 }));
  L.push({ id: 'slot-back', tag: 'g', parent: 'root' });
  // Braccio dietro
  joint('arm-far', 'root', -5, -24); L.push(path('arm-far-skin', 'arm-far', limbPath(7.5, 6.2, 16)));
  joint('forearm-far', 'arm-far', 0, 16); L.push(path('forearm-far-skin', 'forearm-far', limbPath(6.2, 5.0, 15)));
  joint('hand-far', 'forearm-far', 0, 14);
  // Gambe
  joint('leg-far', 'root', -4.5, 2); L.push(path('leg-far-skin', 'leg-far', limbPath(9.2, 7.2, 19)));
  joint('shin-far', 'leg-far', 0, 19); L.push(path('shin-far-skin', 'shin-far', limbPath(7.2, 5.6, 19)));
  joint('leg-near', 'root', 4.5, 2); L.push(path('leg-near-skin', 'leg-near', limbPath(9.2, 7.2, 19)));
  joint('shin-near', 'leg-near', 0, 19); L.push(path('shin-near-skin', 'shin-near', limbPath(7.2, 5.6, 19)));
  if (d.acc === 'zaino') L.push(path('zaino', 'root', 'M -13 -24 C -19 -24 -20 -4 -13 -3 Z'));
  // Busto e abiti
  const coat = d.coat;
  if (coat === 'mantello') {
    L.push(path('torso', 'root', 'M -7 -27 C -18 -10 -24 16 -20 24 L 20 24 C 24 16 18 -10 7 -27 Z'));
    L.push(path('torso-pieghe', 'root', 'M -5 -18 L -9 18 M 4 -18 L 8 18', 'none', { stroke: 'paper', 'stroke-width': 1.5, 'stroke-linecap': 'round' }));
  } else if (coat === 'clero') {
    L.push(path('torso', 'root', 'M -7 -27 L -14 32 L 14 32 L 7 -27 Z'));
    L.push(path('torso-croce', 'root', 'M 0 -18 L 0 -9 M -3.5 -15 L 3.5 -15', 'none', { stroke: 'paper', 'stroke-width': 1.6, 'stroke-linecap': 'round' }));
  } else if (coat === 'cappotto') {
    L.push(path('torso', 'root', 'M -7.5 -27 L -14 20 L 14 20 L 7.5 -27 Z'));
  } else if (coat === 'scialle') {
    L.push(path('torso', 'root', 'M -7 -27 L -14 18 L 14 18 L 7 -27 Z'));
    L.push(path('torso-scialle', 'root', 'M -8 -24 L 0 -8 L 8 -24 M -10 -15 L 0 -4 L 10 -15', 'none', { stroke: 'paper', 'stroke-width': 1.5, 'stroke-linecap': 'round' }));
  } else if (d.body === 'donna' || coat === 'gonna' || coat === 'vestito') {
    L.push(path('torso', 'root', 'M -6.5 -27 L -14 15 L 14 15 L 6.5 -27 Z'));
  } else {
    L.push(path('torso', 'root', 'M -7 -27 C -9 -14 -9 4 -8 6 L 8 6 C 9 4 9 -14 7 -27 Z'));
  }
  if (d.acc === 'zaino') L.push(path('zaino-cinghia', 'root', 'M -5 -25 L -5 -6', 'none', { stroke: 'paper', 'stroke-width': 1.5, 'stroke-linecap': 'round' }));
  // Testa e copricapo (pivot sul collo)
  L.push(group('head', 'root', { translateX: 0, translateY: -40, rotate: 0 }, [0, 7]));
  L.push({ id: 'head-skin', tag: 'circle', parent: 'head', attrs: { cx: 0, cy: 0, r: 8.5, fill: 'ink' } });
  if (d.body === 'donna' || d.hat === 'chignon') L.push({ id: 'chignon', tag: 'circle', parent: 'head', attrs: { cx: -8.5, cy: -2, r: 3.8, fill: 'ink' } });
  if (d.hat === 'fedora') { L.push({ id: 'hat-brim', tag: 'ellipse', parent: 'head', attrs: { cx: 0, cy: -6.5, rx: 13, ry: 2.6, fill: 'ink' } }); L.push(path('hat-crown', 'head', 'M -7 -6.5 L -5 -14 L 5 -14 L 7 -6.5 Z')); }
  else if (d.hat === 'largo') { L.push({ id: 'hat-brim', tag: 'ellipse', parent: 'head', attrs: { cx: 0, cy: -6, rx: 16.5, ry: 3, fill: 'ink' } }); L.push(path('hat-crown', 'head', 'M -8 -6 C -8 -14 8 -14 8 -6 Z')); }
  else if (d.hat === 'saturno') { L.push({ id: 'hat-brim', tag: 'ellipse', parent: 'head', attrs: { cx: 0, cy: -6.5, rx: 14, ry: 2.4, fill: 'ink' } }); L.push(path('hat-crown', 'head', 'M -6.5 -6.5 C -6.5 -13 6.5 -13 6.5 -6.5 Z')); }
  else if (d.hat === 'berretto') L.push(path('hat-crown', 'head', 'M -8 -5 C -8 -12 6 -12 11 -5 Z'));
  // Braccio davanti, con prese per gli oggetti
  joint('arm-near', 'root', 5, -24); L.push(path('arm-near-skin', 'arm-near', limbPath(7.5, 6.2, 16)));
  if (d.fascia) L.push({ id: 'fascia', tag: 'rect', parent: 'arm-near', attrs: { x: -4.1, y: 5, width: 8.2, height: 4.5, fill: 'red' } });
  joint('forearm-near', 'arm-near', 0, 16); L.push(path('forearm-near-skin', 'forearm-near', limbPath(6.2, 5.0, 15)));
  joint('wrist-near', 'forearm-near', 0, 0);
  joint('hand-near', 'forearm-near', 0, 14);
  joint('grip-near', 'forearm-near', 0, 12);
  L.push({ id: 'slot-front', tag: 'g', parent: 'root' });
  const poses = Object.fromEntries(Object.entries(POSE).map(([name, p]) => [name, jointsFor(p)]));
  return { id: figuraId(d), meta: { label: 'Figura ' + figuraId(d).slice(4).replace(/-/g, ' '), family: 'figure', source: 'studio personaggi.html#buildOminoSVG' }, layers: L, rig: { joints: RANGES, poses } };
}

// Oggetti agganciati. Markup copiato dallo studio, colori come token; 'presa' indica dove si aggancia.
// tinta: l'oggetto prende il colore della figura (ricolorazione del ruolo).
const P = {
  // Mazzo nuovo, presa nel punto di legatura. Il disegno coincide con oggetto-fiori.
  fiori: { presa: 'hand-near', fonte: 'kit-primavera-1917.html#fiori', markup: "<g transform=\"scale(0.55)\"><path d=\"M -4 9 L 5 -27 M 0 9 L -12 -24 M 3 9 L 17 -23 M -1 7 L -3 -34 M 1 3 Q -14 -2 -13 -11 Q -4 -11 1 -1 M 3 -5 Q 17 -13 19 -8 Q 16 -1 2 1\" fill=\"none\" stroke=\"ink\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><path d=\"M -7 1 L 6 -1 L 5 4 L -5 5 Z\" fill=\"sand\" stroke=\"ink\" stroke-width=\"0.8\"/><path d=\"M -18 -26 Q -22 -35 -15 -35 Q -17 -43 -9 -40 Q -3 -43 -3 -35 Q 4 -30 -4 -25 Q -10 -21 -18 -26 Z M 9 -25 Q 2 -32 9 -36 Q 9 -44 16 -39 Q 24 -43 24 -35 Q 31 -30 23 -26 Q 18 -21 9 -25 Z\" fill=\"red\" stroke=\"ink\" stroke-width=\"0.8\"/><path d=\"M -7 -36 Q -15 -41 -9 -47 Q -6 -53 -1 -48 Q 8 -50 8 -43 Q 12 -36 4 -34 Z\" fill=\"sand\" stroke=\"ink\" stroke-width=\"0.8\"/><circle cx=\"-10\" cy=\"-32\" r=\"2\" fill=\"ink\"/><circle cx=\"16\" cy=\"-32\" r=\"2\" fill=\"ink\"/><circle cx=\"0\" cy=\"-42\" r=\"1.8\" fill=\"ink\"/></g>" },
  'bastone-mano':   { presa: 'wrist-near', markup: '<line x1="0" y1="13" x2="8" y2="42" stroke="ink" stroke-width="2.8" stroke-linecap="round"/>' },
  'borsa':          { presa: 'hand-near', tinta: true, markup: '<path d="M -6,4 L 6,4 L 8,18 L -8,18 Z" fill="ink"/><path d="M -4,4 C -4,-3 4,-3 4,4" fill="none" stroke="ink" stroke-width="2"/>' },
  'bandiera':       { presa: 'hand-near', markup: '<line x1="-14" y1="22" x2="10" y2="-36" stroke="ink" stroke-width="2.8" stroke-linecap="round"/><path d="M 10,-36 C 24,-38 36,-44 48,-46 L 46,-14 C 32,-18 18,-18 2,-18 Z" fill="red"/>', parti: { 'f-2': { id: 'telo', origin: [6, -27] } } },
  'bastone-lungo':  { presa: 'hand-near', markup: '<line x1="-22" y1="22" x2="32" y2="-28" stroke="ink" stroke-width="3" stroke-linecap="round"/>' },
  'fucile-in-mano': { presa: 'grip-near', markup: '<g transform="rotate(-14)"><path d="M -22,4 L -6,4 L -2,0 L 38,0 L 38,3 L -2,4 L -8,9 L -22,10 Z" fill="ink"/></g>' },
  'fucile-sparo':   { presa: 'grip-near', markup: '<g transform="rotate(-14)"><path d="M -22,4 L -6,4 L -2,0 L 38,0 L 38,3 L -2,4 L -8,9 L -22,10 Z" fill="ink"/><path d="M 42,1 L 56,-4 M 43,2 L 59,2 M 42,3 L 55,8" stroke="red" stroke-width="2.4" stroke-linecap="round"/></g>' },
  'megafono-in-mano': { presa: 'hand-near', markup: '<path d="M -2,-4 L 28,-18 L 28,8 L -2,0 Z" fill="red"/><path d="M 33,-14 L 40,-18 M 34,-4 L 42,-4 M 33,5 L 40,9" stroke="ink" stroke-width="2" stroke-linecap="round"/>' },
  'martello-in-mano': { presa: 'hand-near', markup: '<line x1="-4" y1="6" x2="10" y2="-16" stroke="ink" stroke-width="3" stroke-linecap="round"/><path d="M 3,-21 L 19,-11 L 15,-6 L -1,-16 Z" fill="ink"/>' },
  'giornale-in-mano': { presa: 'grip-near', markup: '<path d="M 0,-18 L 16,-24 L 16,6 L 0,12 L -14,8 L -14,-20 Z" fill="paper" stroke="ink" stroke-width="2.2"/><line x1="0" y1="-18" x2="0" y2="12" stroke="ink" stroke-width="2"/><line x1="4" y1="-15" x2="12" y2="-18" stroke="ink" stroke-width="1.6"/><line x1="4" y1="-9" x2="12" y2="-12" stroke="ink" stroke-width="1.6"/><line x1="4" y1="-3" x2="12" y2="-6" stroke="ink" stroke-width="1.6"/>' },
  'mattone-in-mano': { presa: 'forearm-far', markup: '<rect x="-12" y="8" width="22" height="6" fill="sand" stroke="ink" stroke-width="1.8" transform="rotate(28)"/>' },
  'cartello-alzato': { presa: 'slot-front', markup: '<g transform="translate(0, -68) rotate(-4)"><line x1="-11" y1="12" x2="-11" y2="24" stroke="ink" stroke-width="2.6"/><line x1="11" y1="12" x2="11" y2="24" stroke="ink" stroke-width="2.6"/><rect x="-26" y="-18" width="52" height="30" rx="1.5" fill="paper" stroke="ink" stroke-width="2.5"/><text x="0" y="2" text-anchor="middle" font-family="monospace" font-weight="900" font-size="12" fill="ink">ХЛЕБ</text></g>' },
  'sasso-lanciato': { presa: 'slot-front', markup: '<line x1="22" y1="-38" x2="36" y2="-46" stroke="ink" stroke-width="2.5" stroke-linecap="round"/><rect x="44" y="-55" width="9" height="4.5" rx="1.5" fill="red" transform="rotate(-25 44 -55)"/>' },
  'zappa-in-mano':  { presa: 'hand-near', markup: '<line x1="-10" y1="-16" x2="16" y2="34" stroke="ink" stroke-width="2.8" stroke-linecap="round"/><path d="M 12,32 L 28,29 L 26,36 L 13,37 Z" fill="ink"/>' },
  'sgabello':       { presa: 'slot-back', markup: '<path d="M -14,18 L 6,18 M -10,18 L -10,42 M 2,18 L 2,42" stroke="ink" stroke-width="3.2" stroke-linecap="round"/>' },
  'mattoni-cantiere': { presa: 'slot-back', markup: '<g fill="blue" stroke="paper" stroke-width="1.2"><rect x="-54" y="24" width="20" height="11"/><rect x="-34" y="24" width="20" height="11"/><rect x="-46" y="13" width="22" height="11"/><rect x="16" y="24" width="22" height="11"/><rect x="38" y="24" width="20" height="11"/><rect x="20" y="12" width="32" height="11" transform="rotate(-12 20 12)"/></g>' },
  'mattoni-officina': { presa: 'slot-back', markup: '<g fill="blue" stroke="paper" stroke-width="1.2"><rect x="14" y="24" width="20" height="11"/><rect x="34" y="24" width="18" height="11"/><rect x="18" y="13" width="22" height="11"/><rect x="22" y="2" width="16" height="11"/></g>' }
};
export const PRESE_OGGETTI = Object.fromEntries(Object.entries(P).map(([k, v]) => [k, v.presa]));

export function oggettoSymbol(name) {
  const p = P[name];
  if (!p) throw new Error('Oggetto della figura sconosciuto: ' + name);
  const layers = markupToLayers(p.markup, { prefix: 'f' }).map(l => p.parti?.[l.id] ? { ...l, id: p.parti[l.id].id, origin: p.parti[l.id].origin } : l);
  return { id: 'presa-' + name, meta: { label: name.replace(/-/g, ' '), family: 'oggetti-impugnati', source: p.fonte ?? 'studio personaggi.html#buildOminoSVG', presa: p.presa, tinta: Boolean(p.tinta) }, layers };
}

// Abbassamento del corpo nelle unità della figura, data la sua scala complessiva.
export const abbassamento = (yOff, scalaTotale) => Math.round(yOff / scalaTotale * 1e6) / 1e6;

// Espande una figura di scena in simboli e componenti del motore.
// spec: {id, x, y, scale, variant|body|hat|coat|acc, role, pose, props:[...]}
export function figura(spec) {
  const d = variante(spec), pose = spec.pose || 'in_piedi', p = POSE[pose];
  if (!p) throw new Error('Posa sconosciuta: ' + pose);
  const symbol = figuraSymbol(d), symbols = [symbol];
  const recolor = { ...d.recolor, ...(spec.recolor || {}) };
  // Nello studio l'abbassamento (yOff) è in unità di scena, non scalato: lo si compensa qui.
  const scalaTotale = (spec.scale ?? 1) * CORPI[d.body], radice = abbassamento(p.yOff || 0, scalaTotale);
  const components = [{ id: spec.id, symbol: symbol.id, rigPose: pose, ...(radice !== (p.yOff || 0) ? { joints: { root: { translateY: radice } } } : {}), pose: { translateX: spec.x ?? 0, translateY: spec.y ?? 0, ...(spec.scale !== undefined && spec.scale !== 1 ? { scale: spec.scale } : {}), ...(spec.flip ? { scaleX: -1 } : {}) }, ...(Object.keys(recolor).length ? { recolor } : {}), ...(spec.parent ? { parent: spec.parent } : {}) }];
  // Ordine dello studio: extras di posa, accessori della variante, oggetto dell'azione.
  const attach = [...(p.extras || []), ...(d.acc === 'bastone' ? ['bastone-mano'] : d.acc === 'borsa' ? ['borsa'] : []), ...(p.prop ? [p.prop] : []), ...(spec.props || [])];
  for (const name of attach) {
    const s = oggettoSymbol(name);
    if (!symbols.some(x => x.id === s.id)) symbols.push(s);
    components.push({ id: spec.id + '-' + name, symbol: s.id, parent: spec.id + '-' + s.meta.presa, ...(s.meta.tinta && Object.keys(recolor).length ? { recolor } : {}) });
  }
  return { symbols, components };
}
