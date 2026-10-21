// Formazioni di figure. Le sei dello studio personaggi (buildCrowdCompositionSVG) sono
// riprodotte con le stesse posizioni, pose e varianti; le generiche servono a comporre folle
// di qualsiasi dimensione in modo deterministico.
//
// Ogni formazione restituisce {figure:[spec...], elementi:[{id,markup,davanti}]}.
// (x,y) della formazione: x è il centro, y la linea dei piedi della prima fila.
import {PIEDI} from './figura/figura.js';
import {CORPI,VARIANTI} from './figura/pose.js';

const FILA_STUDIO = 36; // distanza bacino → piedi della prima fila nello studio, a scala 1
// Converte una figura dello studio (posizione del bacino dentro la formazione) in spec con i piedi.
function daStudio(base, o) {
  const body = o.body ?? VARIANTI[o.variant ?? 'nessuna'].body;
  const k = CORPI[body] ?? 1, s = (o.scale ?? 1) * base.scala;
  return { variant: o.variant ?? 'nessuna', ...(o.body ? { body: o.body } : {}), role: o.role ?? 'popolo', pose: o.pose ?? 'in_piedi',
    x: base.cx + o.dx * base.scala, y: base.cy + o.dy * base.scala + PIEDI * k * s, scale: s };
}

const STUDIO = {
  statica: () => [
    ...[-95, -62, -28, 8, 42, 76, 105].map((dx, i) => ({ dx, dy: -14, scale: 0.78, pose: 'in_piedi', body: i % 3 === 1 ? 'donna' : 'uomo' })),
    ...[-110, -78, -45, -12, 22, 56, 90].map((dx, i) => ({ dx, dy: 0, scale: 0.88, pose: i === 3 ? 'mani_fianchi' : 'in_piedi', variant: i === 1 ? 'cappello' : (i === 4 ? 'donna' : 'nessuna') }))
  ],
  marcia: () => [-115, -80, -45, -10, 25, 60, 95].map((dx, i) => ({ dx, dy: (i % 2) * -6, scale: 0.86, pose: (i === 1 || i === 4) ? 'porta_bandiera' : (i % 2 === 0 ? 'cammina_1' : 'sbarra'), role: i === 4 ? 'partigiano' : 'popolo' })),
  carica: () => [-95, -55, -15, 25, 68, 108].map((dx, i) => ({ dx, dy: (i % 2) * -5, scale: 0.88, pose: i % 2 === 0 ? 'corre' : 'sbarra', body: i === 5 ? 'donna' : 'uomo' })),
  barricata: () => [-90, -52, -15, 22, 60, 95].map((dx, i) => ({ dx, dy: -16, scale: 0.85, pose: (i === 1 || i === 4) ? 'porta_bandiera' : (i % 2 === 0 ? 'braccia_alzate' : 'sbarra') })),
  discorso: () => [{ dx: 0, dy: -50, scale: 0.88, pose: 'indica' }, ...[-115, -88, -60, 60, 88, 115].map((dx, i) => ({ dx, dy: 0, scale: 0.85, pose: i % 2 === 0 ? 'braccia_alzate' : 'in_piedi' }))],
  scontro: () => [
    ...[-135, -105, -75, -42].map((dx, i) => ({ dx, dy: (i % 2) * -4, scale: 0.85, pose: i === 1 ? 'porta_bandiera' : (i === 3 ? 'lancia' : 'sbarra'), role: 'popolo' })),
    ...[45, 75, 105, 132].map((dx, i) => ({ dx, dy: (i % 2) * -4, scale: 0.85, pose: i % 2 === 0 ? 'sbarra' : 'braccia_alzate', role: i % 2 === 0 ? 'esercito' : 'popolo' }))
  ]
};
// Elementi di scena dello studio, nelle coordinate della formazione (scalati con essa).
const MURO = '<g fill="blue" stroke="paper" stroke-width="1.6" transform="translate(10, 8)"><rect x="-90" y="10" width="34" height="16"/><rect x="-56" y="10" width="34" height="16"/><rect x="-22" y="10" width="34" height="16"/><rect x="12" y="10" width="34" height="16"/><rect x="46" y="10" width="34" height="16"/><rect x="-74" y="-6" width="34" height="16"/><rect x="-40" y="-6" width="34" height="16"/><rect x="-6" y="-6" width="34" height="16"/><rect x="28" y="-6" width="34" height="16"/><rect x="-56" y="-22" width="34" height="16"/><rect x="-22" y="-22" width="34" height="16"/><rect x="12" y="-22" width="34" height="16"/></g>';
const PODIO = '<rect x="-36" y="-12" width="72" height="42" fill="blue" stroke="ink" stroke-width="2"/>';

// Pseudo-casuale deterministico (mulberry32): stessa scena, stessi numeri.
export function casuale(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ciclo = (lista, i, def) => Array.isArray(lista) && lista.length ? lista[i % lista.length] : (lista ?? def);

export const FORMAZIONI = Object.keys(STUDIO).concat(['fila', 'righe', 'gruppo', 'coda']);

export function formazione(f, opzioni = {}) {
  const tipo = f.tipo, scala = f.scala ?? 1, x = f.x ?? 0, y = f.y ?? 0;
  if (STUDIO[tipo]) {
    const base = { cx: x, cy: y - FILA_STUDIO * scala, scala };
    const figure = STUDIO[tipo]().map(o => daStudio(base, o));
    const elementi = [];
    // Nello studio il muro della barricata è disegnato DOPO le figure, il podio PRIMA.
    if (tipo === 'barricata') elementi.push({ markup: MURO, davanti: true, x: base.cx, y: base.cy, scala });
    if (tipo === 'discorso') elementi.push({ markup: PODIO, davanti: false, x: base.cx, y: base.cy, scala });
    return { figure, elementi };
  }
  const n = f.n ?? 6, passo = f.passo ?? 34, figure = [];
  const pick = i => ({ variant: ciclo(f.varianti, i, 'nessuna'), role: ciclo(f.ruoli, i, 'popolo'), pose: ciclo(f.pose, i, 'in_piedi'), ...(f.flip ? { flip: true } : {}) });
  if (tipo === 'fila' || tipo === 'coda') {
    // coda: la prima figura è la testa (a destra se direzione = 1).
    const dir = tipo === 'coda' ? (f.direzione === 'sinistra' ? -1 : 1) : 1;
    for (let i = 0; i < n; i++) {
      const offset = tipo === 'coda' ? -dir * i * passo : (i - (n - 1) / 2) * passo;
      figure.push({ ...pick(i), x: x + offset, y, scale: scala * (1 + ((i * 7) % 5 - 2) * 0.02) });
    }
  } else if (tipo === 'righe') {
    // Righe dalla più lontana (piccola, in alto) alla più vicina.
    const righe = f.righe ?? 3, perRiga = f.perRiga ?? Math.ceil(n / righe), prof = f.profondita ?? 22;
    let i = 0;
    for (let r = righe - 1; r >= 0; r--) {
      const s = scala * (1 - r * 0.1), count = Math.min(perRiga, n - (righe - 1 - r) * perRiga);
      for (let c = 0; c < count; c++, i++) {
        const off = (c - (count - 1) / 2) * passo * (1 - r * 0.08) + (r % 2 ? passo / 2 : 0);
        figure.push({ ...pick(i), x: x + off, y: y - r * prof, scale: s });
      }
    }
  } else if (tipo === 'gruppo') {
    // Raggruppamento compatto: posizioni sparse ma riproducibili (seed).
    const rnd = casuale(f.seme ?? 7), raggio = f.raggio ?? passo * Math.sqrt(n) * 0.6;
    const punti = [];
    // Disposizione a girasole (distribuzione uniforme) con piccola variazione riproducibile.
    for (let i = 0; i < n; i++) { const a = i * 2.39996 + rnd() * 0.6, d = raggio * Math.sqrt((i + 0.5) / n) * (0.85 + rnd() * 0.3); punti.push({ dx: Math.cos(a) * d, dy: Math.sin(a) * d * 0.35 }); }
    punti.sort((a, b) => a.dy - b.dy); // dietro prima
    punti.forEach((p, i) => figure.push({ ...pick(i), x: x + p.dx, y: y + p.dy, scale: scala * (1 + p.dy / 300) }));
  } else throw new Error('Formazione sconosciuta: ' + tipo + ' (ammesse: ' + FORMAZIONI.join(', ') + ')');
  return { figure, elementi: [] };
}
