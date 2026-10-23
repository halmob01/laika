// Compilatore della scheda scena: dalla descrizione di una scena (JSON leggibile) ai dati
// del motore (simboli, componenti, sequenze). Gira identico in Node (build) e nel browser
// (galleria). Non disegna nulla: compone i pezzi della bottega e applica le ricette.
import {figura,PRESE_OGGETTI} from './figura/figura.js';
import {POSE} from './figura/pose.js';
import {formazione} from './formazioni.js';
import {AZIONI,SINONIMI,MANO} from './movimenti.js';
import {markupToLayers} from './strumenti/svg-in-layer.js';

const ID = /^[a-z][a-z0-9_-]*$/;
const VIEWBOX = [0, 0, 960, 540];
function errore(scena, msg) { return new Error('Scena "' + (scena?.id ?? '?') + '": ' + msg); }
function controllaId(scena, id, cosa) { if (typeof id !== 'string' || !ID.test(id)) throw errore(scena, cosa + ': ID non valido "' + id + '" (minuscole, cifre, trattini; inizia con una lettera)'); }

export function inquadra(viewBox, rect) {
  const [vx, vy, vw, vh] = viewBox, [x, y, w, h] = rect, scale = Math.min(vw / w, vh / h);
  return { scale, translateX: vx + (vw - w * scale) / 2 - x * scale, translateY: vy + (vh - h * scale) / 2 - y * scale };
}

export function compilaScena(scena, { libreria }) {
  if (!scena || typeof scena !== 'object') throw new Error('Scena mancante');
  controllaId(scena, scena.id, 'scena');
  if (typeof scena.etichetta !== 'string' || !scena.etichetta.trim()) throw errore(scena, 'serve "etichetta": descrizione testuale accessibile della scena');
  const viewBox = scena.viewBox ?? VIEWBOX, camera = scena.camera ?? viewBox;
  const symbols = new Map(), components = [], info = new Map(), gruppi = new Map();
  const addSymbol = s => { if (!symbols.has(s.id)) symbols.set(s.id, s); };
  const usaSimbolo = nome => { const s = libreria.symbols.find(x => x.id === nome); if (!s) throw errore(scena, 'simbolo sconosciuto "' + nome + '": vedere bottega/catalogo.json'); addSymbol(s); return s; };
  const nuovo = (id, cosa) => { controllaId(scena, id, cosa); if (info.has(id) || gruppi.has(id)) throw errore(scena, 'ID duplicato "' + id + '"'); };

  const layers = [{ id: 'sfondo', tag: 'rect', attrs: { x: viewBox[0], y: viewBox[1], width: viewBox[2], height: viewBox[3], fill: scena.sfondo ?? 'paper' } }];
  const world = { id: 'world', tag: 'g', pose: inquadra(viewBox, camera) };
  if (scena.ruvido) {
    const t = libreria.textures[scena.ruvido === true ? 'personaggi' : scena.ruvido];
    if (!t) throw errore(scena, 'ruvido: valore non riconosciuto "' + scena.ruvido + '" (true | ' + Object.keys(libreria.textures).join(' | ') + ')');
    world.texture = { ...t, bounds: [viewBox[0] - 60, viewBox[1] - 60, viewBox[2] + 120, viewBox[3] + 120] };
  }
  layers.push(world);

  const nascosti = new Set();
  function elemento(e, gruppo) {
    nuovo(e.id, 'elemento');
    if (e.nascosto) nascosti.add(e.id);
    let s;
    if (e.simbolo) s = usaSimbolo(e.simbolo);
    else if (e.markup) { s = { id: 'scena-' + scena.id + '-' + e.id, layers: markupToLayers(e.markup, { prefix: 'f' }) }; addSymbol(s); }
    else throw errore(scena, 'elemento "' + e.id + '": serve "simbolo"');
    const scala = e.scala ?? 1;
    components.push({ id: e.id, symbol: s.id, parent: 'world', pose: { translateX: e.x ?? 0, translateY: e.y ?? 0, ...(scala !== 1 ? { scale: scala } : {}), ...(e.flip ? { scaleX: -1 } : {}) } });
    info.set(e.id, { id: e.id, tipo: 'elemento', x: e.x ?? 0, y: e.y ?? 0, scala });
    if (gruppo) gruppi.get(gruppo).push(e.id);
  }
  function persona(spec, gruppo) {
    nuovo(spec.id, 'figura');
    const posa = spec.posa ?? spec.pose ?? 'in_piedi';
    if (!POSE[posa]) throw errore(scena, 'figura "' + spec.id + '": posa sconosciuta "' + posa + '" (vedere bottega/figura/pose.js)');
    let out;
    try { out = figura({ id: spec.id, x: spec.x, y: spec.y, scale: spec.scala ?? spec.scale, variant: spec.variante ?? spec.variant, body: spec.corpo ?? spec.body, hat: spec.cappello, coat: spec.abito, acc: spec.accessorio, role: spec.ruolo ?? spec.role, pose: posa, flip: spec.flip, props: spec.oggetti, parent: 'world' }); }
    catch (err) { throw errore(scena, 'figura "' + spec.id + '": ' + err.message); }
    out.symbols.forEach(addSymbol);
    components.push(...out.components);
    const attaccati = out.components.slice(1).map(c => c.id.slice(spec.id.length + 1));
    const k = out.symbols[0].layers[0].pose.scale;
    info.set(spec.id, { id: spec.id, tipo: 'figura', x: spec.x ?? 0, y: spec.y ?? 0, scala: (spec.scala ?? spec.scale ?? 1) * k, posa, oggetti: attaccati, impugna: attaccati.some(o => MANO.includes(PRESE_OGGETTI[o])) });
    if (gruppo) gruppi.get(gruppo).push(spec.id);
  }

  const davanti = [];
  for (const e of scena.elementi ?? []) (e.davanti ? davanti.push(e) : elemento(e));
  for (const f of scena.figure ?? []) {
    if (f.gruppo) {
      nuovo(f.gruppo, 'gruppo'); gruppi.set(f.gruppo, []);
      if (!f.formazione) throw errore(scena, 'gruppo "' + f.gruppo + '": serve "formazione"');
      let res;
      try { res = formazione({ ...f.formazione, x: f.formazione.x ?? f.x, y: f.formazione.y ?? f.y, scala: f.formazione.scala ?? f.scala }); }
      catch (err) { throw errore(scena, 'gruppo "' + f.gruppo + '": ' + err.message); }
      res.elementi.filter(e => !e.davanti).forEach((e, i) => elemento({ id: f.gruppo + '-arredo-' + (i + 1), ...e }));
      res.figure.forEach((spec, i) => persona({ ...spec, ...(f.ruolo ? { role: f.ruolo } : {}), ...(f.flip !== undefined ? { flip: f.flip } : {}), id: f.gruppo + '-' + (i + 1) }, f.gruppo));
      res.elementi.filter(e => e.davanti).forEach((e, i) => elemento({ id: f.gruppo + '-davanti-' + (i + 1), ...e }));
    } else persona(f);
  }
  davanti.forEach(e => elemento(e));
  for (const [nome, ids] of Object.entries(scena.gruppi ?? {})) {
    nuovo(nome, 'gruppo');
    for (const id of ids) if (!info.has(id)) throw errore(scena, 'gruppo "' + nome + '": membro sconosciuto "' + id + '"');
    gruppi.set(nome, [...ids]);
  }

  const risolvi = sel => {
    const lista = Array.isArray(sel) ? sel : [sel];
    if (sel === undefined || !lista.length) throw errore(scena, 'passo senza "chi"');
    return [...new Set(lista.flatMap(n => { if (gruppi.has(n)) return gruppi.get(n); if (info.has(n)) return [n]; throw errore(scena, '"' + n + '" non è una figura, un elemento o un gruppo della scena'); }))];
  };
  const ctx = {
    viewBox, camera,
    figure: sel => risolvi(sel).map(id => { const f = info.get(id); if (f.tipo !== 'figura') throw errore(scena, '"' + id + '" non è una figura: questa azione muove persone'); return f; }),
    istanze: sel => risolvi(sel),
    posizione: id => [info.get(id).x, info.get(id).y],
    scala: id => info.get(id).scala,
    nascondi: id => nascosti.add(id)
  };

  const sequences = [];
  for (const seq of scena.sequenze ?? []) {
    controllaId(scena, seq.id, 'sequenza');
    if (typeof seq.didascalia !== 'string' || !seq.didascalia.trim()) throw errore(scena, 'sequenza "' + seq.id + '": serve "didascalia"');
    const clips = [], shots = [], canali = new Map();
    (seq.passi ?? []).forEach((passo, n) => {
      const nome = SINONIMI[passo.azione] ?? passo.azione, ricetta = AZIONI[nome];
      if (!ricetta) throw errore(scena, 'sequenza "' + seq.id + '", passo ' + (n + 1) + ': azione sconosciuta "' + passo.azione + '" (ammesse: ' + Object.keys(AZIONI).join(', ') + ')');
      let res;
      try { res = ricetta(passo, ctx); } catch (err) { throw errore(scena, 'sequenza "' + seq.id + '", passo ' + (n + 1) + ' (' + nome + '): ' + err.message.replace(/^Scena "[^"]*": /, '')); }
      const etichetta = 'passo ' + (n + 1) + ' (' + nome + ')';
      for (const c of res.clips ?? []) {
        for (const t of c.targets) for (const prop of Object.keys(c.frames[0].values)) occupa(canali, (c.part ? t + '-' + c.part : t) + ':' + prop, c.at, c.at + c.duration * (c.iterations ?? 1), etichetta, scena, seq);
        clips.push(c);
      }
      for (const s of res.shots ?? []) { for (const prop of ['translateX', 'translateY', 'scale']) occupa(canali, 'world:' + prop, s.at, s.at + s.duration, etichetta, scena, seq); shots.push(s); }
    });
    clips.sort((a, b) => a.at - b.at);
    // Clip identici che differiscono solo per il bersaglio (folle che camminano insieme)
    // diventano un solo clip con più bersagli: stesso movimento, pacchetto molto più leggero.
    // È sicuro perché i canali non si sovrappongono mai (vedi occupa).
    const uniti = [], posto = new Map();
    for (const c of clips) {
      const { targets, ...resto } = c, chiave = JSON.stringify(resto);
      if (posto.has(chiave)) uniti[posto.get(chiave)].targets.push(...targets);
      else { posto.set(chiave, uniti.length); uniti.push({ ...c, targets: [...targets] }); }
    }
    clips.splice(0, clips.length, ...uniti);
    const fine = Math.max(0, ...clips.map(c => c.at + c.duration * (c.iterations ?? 1)), ...shots.map(s => s.at + s.duration));
    const beats = (seq.battute ?? []).map(b => ({ at: Math.min(b.a ?? 0, fine), text: b.testo }));
    sequences.push({ id: seq.id, caption: seq.didascalia, tracks: [], clips, shots, ...(beats.length ? { beats } : {}) });
  }
  for (const c of components) if (nascosti.has(c.id)) c.opacity = 0;
  if (scena.ingresso && !sequences.some(s => s.id === scena.ingresso)) throw errore(scena, 'ingresso: sequenza sconosciuta "' + scena.ingresso + '"');
  let mobile;
  if (scena.telefono !== undefined) {
    const t = scena.telefono, ok = t && typeof t === 'object' && Object.keys(t).every(k => ['centro', 'zoom'].includes(k)) && Number.isFinite(t.centro) && t.centro >= 0 && t.centro <= 1 && (t.zoom === undefined || (Number.isFinite(t.zoom) && t.zoom >= 1 && t.zoom <= 3));
    if (!ok) throw errore(scena, 'telefono: serve { "centro": 0–1, "zoom": 1–3 } (centro = dove sta l\'azione, da sinistra a destra)');
    mobile = { center: t.centro, ...(t.zoom !== undefined ? { zoom: t.zoom } : {}) };
  }
  const stage = { id: scena.id, label: scena.etichetta, viewBox, duration: 700, layers, components, sequences, ...(scena.ingresso ? { introSequence: scena.ingresso } : {}), ...(mobile ? { mobile } : {}) };
  return { symbols: [...symbols.values()], stage };
}
function occupa(canali, chiave, da, a, etichetta, scena, seq) {
  const lista = canali.get(chiave) ?? [];
  for (const [x, y, chi] of lista) if (da < y && x < a) throw errore(scena, 'sequenza "' + seq.id + '": ' + etichetta + ' e ' + chi + ' muovono insieme ' + chiave.replace(':', ' / ') + ' tra ' + Math.max(da, x) + ' e ' + Math.min(a, y) + ' ms. Sfalsare i tempi ("a") o dividere i gruppi.');
  lista.push([da, a, etichetta]); canali.set(chiave, lista);
}

// Più scene → frammento di pacchetto per il motore (simboli condivisi, motivi, palette).
export function compilaScene(scene, { libreria, palette }) {
  const symbols = new Map(), stages = [];
  for (const s of scene) { const out = compilaScena(s, { libreria }); out.symbols.forEach(x => symbols.set(x.id, x)); stages.push(out.stage); }
  return { palette, patterns: libreria.patterns, symbols: [...symbols.values()], stages };
}
