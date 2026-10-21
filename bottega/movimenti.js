// Ricette di movimento: il vocabolario delle scene. Ogni ricetta traduce un passo della
// scheda scena in clip/inquadrature del motore. Regola unica: la composizione dichiarata
// nella scena è la posa FINALE; ogni ricetta racconta come ci si arriva e termina lì.
import {POSE} from './figura/pose.js';
import {jointsFor,abbassamento} from './figura/figura.js';

const r2 = n => Math.round(n * 100) / 100;
const PASSO_FIGURA = 64;      // avanzamento per ciclo di passo, a scala 1 (due passi)
const CAMPIONI = 12;          // fotogrammi per ciclo
const MANO = ['wrist-near', 'hand-near', 'grip-near'];

// Ciclo del passo, dallo studio (animType 'walk'), riformulato perché ogni canale parta e
// finisca a zero: così si somma a qualsiasi posa e si chiude esattamente su di essa.
const ANDATURE = {
  walk:  { braccia: 28, anche: 26, ginocchia: 22, rimbalzo: 2.5, ciclo: 900 },
  march: { braccia: 34, anche: 30, ginocchia: 28, rimbalzo: 3, ciclo: 700 }
};
function onda(fn) { return Array.from({ length: CAMPIONI + 1 }, (_, i) => { const t = i / CAMPIONI, s = Math.sin(t * Math.PI * 2); return { offset: i === CAMPIONI ? 1 : Math.round(t * 10000) / 10000, value: r2(fn(s)) }; }); }
function clipOnda(target, part, property, fn, at, durata, cicli) {
  const frames = onda(fn).map(f => ({ offset: f.offset, values: { [property]: f.value } }));
  return { targets: [target], ...(part ? { part } : {}), relative: true, ease: 'linear', at: Math.round(at), duration: Math.round(durata / cicli), iterations: cicli, frames };
}
function andatura(fig, tipo, at, durata, cicli) {
  const a = ANDATURE[tipo], clips = [], liberaMano = !fig.impugna;
  clips.push(clipOnda(fig.id, 'arm-far', 'rotate', s => s * a.braccia, at, durata, cicli));
  if (liberaMano) clips.push(clipOnda(fig.id, 'arm-near', 'rotate', s => -s * a.braccia, at, durata, cicli));
  clips.push(clipOnda(fig.id, 'leg-far', 'rotate', s => -s * a.anche, at, durata, cicli));
  clips.push(clipOnda(fig.id, 'leg-near', 'rotate', s => s * a.anche, at, durata, cicli));
  clips.push(clipOnda(fig.id, 'shin-far', 'rotate', s => Math.max(0, -s) * a.ginocchia, at, durata, cicli));
  clips.push(clipOnda(fig.id, 'shin-near', 'rotate', s => Math.max(0, s) * a.ginocchia, at, durata, cicli));
  clips.push(clipOnda(fig.id, 'root', 'translateY', s => abbassamento(Math.abs(s) * a.rimbalzo, fig.scala), at, durata, cicli));
  return clips;
}
function spostamento(id, dx, dy, at, durata, ease = 'linear') {
  return { targets: [id], relative: true, ease, at: Math.round(at), duration: Math.round(durata), frames: [{ offset: 0, values: { translateX: r2(dx), translateY: r2(dy) } }, { offset: 1, values: { translateX: 0, translateY: 0 } }] };
}
// Cammina da un punto di partenza (relativo) fino alla posa dichiarata.
function camminaDa(fig, dx, dy, at, durata, tipo) {
  const a = ANDATURE[tipo], dist = Math.hypot(dx, dy), passo = PASSO_FIGURA * fig.scala;
  const cicli = Math.max(1, Math.min(24, Math.round(dist / passo) || 1));
  const d = durata ?? cicli * a.ciclo;
  return [spostamento(fig.id, dx, dy, at, d), ...andatura(fig, tipo, at, d, cicli)];
}
const centro = figs => [figs.reduce((s, f) => s + f.x, 0) / figs.length, figs.reduce((s, f) => s + f.y, 0) / figs.length];

// Contesto: ctx.figure(id|gruppo|[...]) → figure; ctx.istanze(...) → id; ctx.viewBox.
export const AZIONI = {
  walk(p, ctx) { return cammina(p, ctx, 'walk'); },
  march(p, ctx) { return cammina(p, ctx, 'march'); },
  gather(p, ctx) { return raduna(p, ctx, p.fattore ?? 1.8); },
  disperse(p, ctx) { return raduna(p, ctx, p.fattore ?? 0.3); },
  speak(p, ctx) {
    const cicli = p.cicli ?? 3, durata = p.durata ?? cicli * 1100;
    return { clips: ctx.figure(p.chi).flatMap((f, i) => [
      { targets: [f.id], part: 'arm-near', relative: true, at: tempo(p, i), duration: Math.round(durata / cicli), iterations: cicli, frames: [{ offset: 0, values: { rotate: 0 } }, { offset: 0.35, values: { rotate: -28 } }, { offset: 0.7, values: { rotate: -12 } }, { offset: 1, values: { rotate: 0 } }] },
      { targets: [f.id], part: 'head', relative: true, at: tempo(p, i), duration: Math.round(durata / cicli), iterations: cicli, frames: [{ offset: 0, values: { rotate: 0 } }, { offset: 0.5, values: { rotate: -5 } }, { offset: 1, values: { rotate: 0 } }] }
    ]) };
  },
  listen(p, ctx) {
    const cicli = p.cicli ?? 2, durata = p.durata ?? cicli * 1600;
    return { clips: ctx.figure(p.chi).flatMap((f, i) => [
      { targets: [f.id], part: 'head', relative: true, at: tempo(p, i), duration: Math.round(durata / cicli), iterations: cicli, frames: [{ offset: 0, values: { rotate: 0 } }, { offset: 0.4, values: { rotate: 7 } }, { offset: 1, values: { rotate: 0 } }] },
      { targets: [f.id], part: 'root', relative: true, at: tempo(p, i), duration: Math.round(durata), frames: [{ offset: 0, values: { rotate: 0 } }, { offset: 0.5, values: { rotate: -3 } }, { offset: 1, values: { rotate: 0 } }] }
    ]) };
  },
  raise(p, ctx) { return cambiaPosa(p, ctx, p.da ?? 'in_piedi'); },
  lower(p, ctx) { return cambiaPosa(p, ctx, p.da ?? 'braccia_alzate'); },
  pose(p, ctx) { if (!p.da) throw new Error('pose: indicare la posa di partenza "da"'); return cambiaPosa(p, ctx, p.da); },
  work(p, ctx) {
    const cicli = p.cicli ?? 4, durata = p.durata ?? cicli * 650;
    return { clips: ctx.figure(p.chi).flatMap((f, i) => [
      { targets: [f.id], part: 'arm-near', relative: true, at: tempo(p, i), duration: Math.round(durata / cicli), iterations: cicli, frames: [{ offset: 0, values: { rotate: 0 } }, { offset: 0.45, values: { rotate: -38 } }, { offset: 0.6, values: { rotate: 6 } }, { offset: 1, values: { rotate: 0 } }] },
      { targets: [f.id], part: 'root', relative: true, at: tempo(p, i), duration: Math.round(durata / cicli), iterations: cicli, frames: [{ offset: 0, values: { rotate: 0 } }, { offset: 0.5, values: { rotate: 4 } }, { offset: 1, values: { rotate: 0 } }] }
    ]) };
  },
  repeat(p, ctx) {
    const cicli = p.cicli ?? 3, durata = p.durata ?? cicli * 800, parti = p.parti;
    if (!parti || typeof parti !== 'object') throw new Error('repeat: indicare "parti", es. {"arm-near": -30}');
    // Oscillazione di parti con nome: giunture di una figura o parti con id di un elemento.
    // parti: {"arm-near": -30} (rotazione) oppure {"telo": {"skewY": 5}}.
    const proprieta = p.proprieta ?? 'rotate';
    return { clips: ctx.istanze(p.chi).flatMap((id, i) => Object.entries(parti).map(([part, amp]) => {
      const [prop, valore] = typeof amp === 'number' ? [proprieta, amp] : Object.entries(amp)[0];
      return { targets: [id], part, relative: true, at: tempo(p, i), duration: Math.round(durata / cicli), iterations: cicli, frames: [{ offset: 0, values: { [prop]: 0 } }, { offset: 0.5, values: { [prop]: valore } }, { offset: 1, values: { [prop]: 0 } }] };
    })) };
  },
  queue(p, ctx) {
    // La coda si forma: ognuno arriva da dietro fino al proprio posto, uno dopo l'altro.
    const figs = ctx.figure(p.chi), dir = direzione(p.da ?? 'sinistra'), dist = p.distanza ?? 200;
    return { clips: figs.flatMap((f, i) => camminaDa(f, dir[0] * dist, dir[1] * dist, (p.a ?? 0) + i * (p.sfalsa ?? 500), p.durata, 'walk')) };
  },
  advance(p, ctx) {
    // La coda avanza di un posto: la posa dichiarata è quella dopo l'avanzamento.
    const figs = ctx.figure(p.chi), dir = direzione(p.da ?? 'sinistra'), passo = p.passo ?? 34;
    return { clips: figs.flatMap((f, i) => camminaDa(f, dir[0] * passo, dir[1] * passo, (p.a ?? 0) + i * (p.sfalsa ?? 150), p.durata ?? 900, 'walk')) };
  },
  confront(p, ctx) { return fronte(p, ctx, 1); },
  retreat(p, ctx) { return fronte(p, ctx, -1); },
  wave(p, ctx) {
    const cicli = p.cicli ?? 6, durata = p.durata ?? cicli * 900;
    return { clips: ctx.figure(p.chi).filter(f => f.oggetti.includes('bandiera')).map((f, i) => ({ targets: [f.id + '-bandiera'], part: 'telo', relative: true, at: tempo(p, i), duration: Math.round(durata / cicli), iterations: cicli, frames: [{ offset: 0, values: { skewY: 0 } }, { offset: 0.3, values: { skewY: 5 } }, { offset: 0.7, values: { skewY: -4 } }, { offset: 1, values: { skewY: 0 } }] })) };
  },
  transfer(p, ctx) {
    // Un oggetto/elemento raggiunge la sua posizione dichiarata partendo da "da" [x,y].
    if (!Array.isArray(p.da)) throw new Error('transfer: "da" deve essere [x, y]');
    const durata = p.durata ?? 1400, arco = p.arco ?? 40;
    return { clips: ctx.istanze(p.chi).map((id, i) => { const pos = ctx.posizione(id), dx = p.da[0] - pos[0], dy = p.da[1] - pos[1];
      return { targets: [id], relative: true, at: tempo(p, i), duration: durata, frames: [{ offset: 0, values: { translateX: r2(dx), translateY: r2(dy) } }, { offset: 0.5, values: { translateX: r2(dx / 2), translateY: r2(dy / 2 - arco) } }, { offset: 1, values: { translateX: 0, translateY: 0 } }] }; }) };
  },
  replace(p, ctx) {
    const durata = p.durata ?? 1200, at = p.a ?? 0;
    for (const id of ctx.istanze(p.esce)) ctx.nascondi(id);
    return { clips: [
      ...ctx.istanze(p.esce).map(id => ({ targets: [id], at, duration: durata, frames: [{ offset: 0, values: { opacity: 1 } }, { offset: 1, values: { opacity: 0 } }] })),
      ...ctx.istanze(p.entra).map(id => ({ targets: [id], at: at + Math.round(durata * 0.35), duration: durata, frames: [{ offset: 0, values: { opacity: 0 } }, { offset: 1, values: { opacity: 1 } }] }))
    ] };
  },
  reveal(p, ctx) {
    const modo = p.modo ?? 'dissolvenza', durata = p.durata ?? 900;
    return { clips: ctx.istanze(p.chi).flatMap((id, i) => {
      const at = tempo(p, i), out = [{ targets: [id], at, duration: durata, frames: [{ offset: 0, values: { opacity: 0 } }, { offset: 1, values: { opacity: 1 } }] }];
      if (modo === 'sale') out.push({ targets: [id], relative: true, ease: 'out', at, duration: durata, frames: [{ offset: 0, values: { translateY: 40 } }, { offset: 1, values: { translateY: 0 } }] });
      else if (modo === 'cresce') out.push({ targets: [id], relative: true, ease: 'out', at, duration: durata, frames: [{ offset: 0, values: { scale: r2(-0.7 * ctx.scala(id)) } }, { offset: 1, values: { scale: 0 } }] });
      else if (modo !== 'dissolvenza') throw new Error('reveal: modo ammesso dissolvenza | sale | cresce');
      return out;
    }) };
  },
  transform(p, ctx) {
    // Il vecchio stato ("da") si dissolve, il nuovo ("verso") cresce al suo posto.
    if (!p.da || !p.verso) throw new Error('transform: indicare "da" e "verso"');
    const durata = p.durata ?? 1400, at = p.a ?? 0, dopo = at + Math.round(durata * 0.4);
    for (const id of ctx.istanze(p.da)) ctx.nascondi(id);
    return { clips: [
      ...ctx.istanze(p.da).map(id => ({ targets: [id], at, duration: durata, frames: [{ offset: 0, values: { opacity: 1 } }, { offset: 1, values: { opacity: 0 } }] })),
      ...ctx.istanze(p.verso).flatMap(id => [{ targets: [id], at: dopo, duration: durata, frames: [{ offset: 0, values: { opacity: 0 } }, { offset: 1, values: { opacity: 1 } }] }, { targets: [id], relative: true, ease: 'out', at: dopo, duration: durata, frames: [{ offset: 0, values: { scale: r2(-0.4 * ctx.scala(id)) } }, { offset: 1, values: { scale: 0 } }] }])
    ] };
  },
  camera(p, ctx) {
    const rects = p.inquadrature;
    if (!Array.isArray(rects) || rects.length < 2) throw new Error('camera: servono almeno due "inquadrature" [x,y,w,h]');
    const tempi = p.tempi ?? rects.map((_, i) => i / (rects.length - 1));
    const fine = rects.at(-1), attesa = ctx.camera;
    if (fine.some((v, i) => Math.abs(v - attesa[i]) > 0.01)) throw new Error('camera: l\'ultima inquadratura deve essere quella finale della scena ' + JSON.stringify(attesa));
    return { shots: [{ layer: 'world', at: p.a ?? 0, duration: p.durata ?? 6000, frames: rects.map((rect, i) => ({ offset: tempi[i], rect })) }] };
  }
};
// Nomi italiani accettati come sinonimi.
export const SINONIMI = { cammina: 'walk', marcia: 'march', raduna: 'gather', disperdi: 'disperse', parla: 'speak', ascolta: 'listen', alza: 'raise', abbassa: 'lower', posa: 'pose', lavora: 'work', ripeti: 'repeat', coda: 'queue', avanza: 'advance', fronteggia: 'confront', arretra: 'retreat', sventola: 'wave', passa: 'transfer', sostituisci: 'replace', rivela: 'reveal', trasforma: 'transform' };

function tempo(p, i) { return Math.round((p.a ?? 0) + i * (p.sfalsa ?? 0)); }
function direzione(d) {
  if (Array.isArray(d)) { const n = Math.hypot(d[0], d[1]) || 1; return [d[0] / n, d[1] / n]; }
  const m = { sinistra: [-1, 0], destra: [1, 0], alto: [0, -1], basso: [0, 1] };
  if (!m[d]) throw new Error('Direzione sconosciuta: ' + d + ' (sinistra | destra | alto | basso | [dx, dy])');
  return m[d];
}
function cammina(p, ctx, tipo) {
  const figs = ctx.figure(p.chi), [vx, vy, vw] = ctx.viewBox;
  return { clips: figs.flatMap((f, i) => {
    let dx, dy;
    if (Array.isArray(p.da)) [dx, dy] = p.da;
    else if (p.da === 'sinistra' && p.distanza === undefined) { dx = vx - 40 * f.scala - f.x; dy = 0; }
    else if (p.da === 'destra' && p.distanza === undefined) { dx = vx + vw + 40 * f.scala - f.x; dy = 0; }
    else { const v = direzione(p.da ?? 'sinistra'), d = p.distanza ?? 160; dx = v[0] * d; dy = v[1] * d; }
    return camminaDa(f, dx, dy, tempo(p, i), p.durata, tipo);
  }) };
}
function raduna(p, ctx, fattore) {
  const figs = ctx.figure(p.chi), c = p.centro ?? centro(figs);
  return { clips: figs.flatMap((f, i) => camminaDa(f, (f.x - c[0]) * (fattore - 1), (f.y - c[1]) * (fattore - 1), tempo(p, i), p.durata, 'walk')) };
}
function fronte(p, ctx, verso) {
  if (!Array.isArray(p.chi) || p.chi.length !== 2) throw new Error('confront/retreat: "chi" deve essere [gruppoA, gruppoB]');
  const [A, B] = p.chi.map(g => ctx.figure(g)), cA = centro(A), cB = centro(B), d = p.distanza ?? 120;
  const n = Math.hypot(cB[0] - cA[0], cB[1] - cA[1]) || 1, u = [(cB[0] - cA[0]) / n, (cB[1] - cA[1]) / n];
  // confront: partono più lontani e si avvicinano; retreat: partono più vicini e si allontanano.
  const off = (s) => [-u[0] * d / 2 * s * verso, -u[1] * d / 2 * s * verso];
  return { clips: [...A.map((f, i) => [f, off(1), i]), ...B.map((f, i) => [f, off(-1), i])].flatMap(([f, o, i]) => camminaDa(f, o[0], o[1], tempo(p, i), p.durata, 'walk')) };
}
function cambiaPosa(p, ctx, da) {
  if (!POSE[da]) throw new Error('Posa di partenza sconosciuta: ' + da);
  const durata = p.durata ?? 900;
  return { clips: ctx.figure(p.chi).flatMap((f, i) => {
    const from = jointsFor(POSE[da]), to = jointsFor(POSE[f.posa]), clips = [];
    for (const j of Object.keys(to)) {
      const a = typeof from[j] === 'number' ? { rotate: from[j] } : from[j], b = typeof to[j] === 'number' ? { rotate: to[j] } : to[j];
      if (j === 'root') { a.translateY = abbassamento(a.translateY ?? 0, f.scala); b.translateY = abbassamento(b.translateY ?? 0, f.scala); }
      for (const prop of Object.keys(b)) if ((a[prop] ?? 0) !== b[prop]) clips.push({ targets: [f.id], part: j, at: tempo(p, i), duration: durata, ease: 'smooth', frames: [{ offset: 0, values: { [prop]: r2(a[prop] ?? 0) } }, { offset: 1, values: { [prop]: b[prop] } }] });
    }
    return clips;
  }) };
}
export { MANO };
