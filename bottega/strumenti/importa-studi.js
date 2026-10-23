// Rigenera bottega/generati/studi.json eseguendo le funzioni di disegno ORIGINALI dei kit
// (HTML conservati in prototypes/), senza modificarli. La palette del kit viene sostituita
// da nomi di token: l'aspetto resta identico con il tema "studi".
//
//   node bottega/strumenti/importa-studi.js          rigenera
//   node bottega/strumenti/importa-studi.js --check  verifica che il file sia aggiornato
//
// Per aggiungere un kit: aggiungere una voce a KIT (vedi bottega/README.md, "Aggiungere un kit").
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {markupToLayers,bounds} from './svg-in-layer.js';
import {caricaKit} from './kit.js';

const OUT = new URL('../generati/studi.json', import.meta.url);

// Ogni kit: file HTML originale, nome della costante palette e traduzione chiave → token,
// funzione delle definizioni (motivi, filtro ruvido) e famiglie di simboli da estrarre.
// Per ogni famiglia: funzione di disegno, elenco di voci, argomenti, ancoraggio.
export const KIT = [
  {
    file: 'prototypes/laika-studi-originali/estetiche brutaliste 1.html', palette: 'C',
    token: { bg: 'paper', ink: 'ink', red: 'red', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', sky: 'sky' },
    definizioni: { funzione: 'getDefs', argomenti: [true], texture: 'architettura-brutalista', motivi: { 'concrete-speckle': 'cemento-a' } },
    famiglie: [{ famiglia: 'architettura-brutalista', prefisso: 'brut-', funzione: 'drawBrutalistAsset', voci: 'Object.values(ASSETS).flat()', argomenti: ['$id', 0, 0, false], terra: 150 }]
  },
  {
    file: 'prototypes/laika-studi-originali/Estetiche brutaliste 2.html', palette: 'C',
    token: { bg: 'paper', ink: 'ink', red: 'red', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', treeBlue: 'tree' },
    definizioni: { funzione: 'getDefs', argomenti: [true], texture: 'palazzi-brutalisti', motivi: { 'concrete-tex': 'cemento-b' } },
    famiglie: [{ famiglia: 'palazzi-brutalisti', prefisso: 'palazzo-', funzione: 'drawBuilding', voci: 'Object.values(BUILDINGS).flat()', argomenti: ['$id', 0, 0, false], terra: 176 }]
  },
  {
    file: 'prototypes/laika-studi-originali/studio personaggi.html', palette: 'PALETTE',
    token: { bg: 'paper', ink: 'ink', red: 'red', blue: 'blue', sand: 'sand' },
    definizioni: { funzione: 'getDefsSVG', argomenti: [], texture: 'personaggi', motivi: {} },
    famiglie: [
      { famiglia: 'ambienti', prefisso: 'ambiente-', funzione: 'drawEnvironmentSVG', voci: [['piazza', 'Piazza'], ['fabbrica', 'Fabbrica'], ['stazione', 'Stazione'], ['rurale', 'Casa rurale']], argomenti: ['$id', 'none', false], rimuoviPrimo: true, terra: 242 },
      { famiglia: 'mezzi', prefisso: 'mezzo-', funzione: 'drawEnvironmentSVG', voci: [['treno', 'Treno'], ['tram', 'Tram'], ['camion', 'Camion'], ['tank', 'Carro armato']], argomenti: ['none', '$id', false], rimuoviPrimo: true },
      { famiglia: 'infrastrutture', prefisso: 'infra-', funzione: 'drawEnvironmentSVG', voci: [['tralicci', 'Tralicci e fili']], argomenti: ['none', 'none', true], rimuoviPrimo: true, terra: 242 },
      { famiglia: 'oggetti', prefisso: 'oggetto-', funzione: 'drawStandaloneProp', voci: 'PROPS_LIST', argomenti: ['$id', 0, 0, 1, 0] }
    ]
  },
  {
    file: 'prototypes/kit-infrastrutture-atmosfera/kit-infrastrutture-atmosfera.html', palette: 'C',
    token: { bg: 'paper', ink: 'ink', red: 'red', blue: 'blue', sand: 'sand', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark' },
    famiglie: [
      { famiglia: 'infrastrutture', prefisso: 'infra-', funzione: 'drawInfra', voci: 'INFRA', argomenti: ['$id', 0, 0], terra: 150 },
      { famiglia: 'atmosfera', prefisso: 'atmo-', funzione: 'drawAtmo', voci: 'ATMO', argomenti: ['$id', 0, 0, 7], terra: 150 }
    ]
  },
  {
    file: 'prototypes/kit-luoghi-monumentali/kit-luoghi-monumentali.html', palette: 'C',
    token: { bg: 'paper', p2: 'paper2', ink: 'ink', red: 'red', sand: 'sand', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', sky: 'sky', tree: 'tree' },
    definizioni: { funzione: 'getDefs', argomenti: [], texture: 'luoghi', motivi: { grana: 'grana-luoghi' } },
    famiglie: [
      { famiglia: 'luoghi', prefisso: 'luogo-', funzione: 'drawLuogo', voci: 'LUOGHI', argomenti: ['$id', 0, 0], terra: 400 },
      { famiglia: 'atmosfera', prefisso: 'atmo-', funzione: 'drawAria', voci: 'ARIA', argomenti: ['$id', 0, 0], terra: 400 }
    ]
  },
  {
    file: 'prototypes/kit-ambienti-primo-novecento/kit-ambienti-primo-novecento.html', palette: 'C',
    token: { bg: 'paper', p2: 'paper2', ink: 'ink', red: 'red', sand: 'sand', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', sky: 'sky', tree: 'tree' },
    definizioni: { funzione: 'getDefs', argomenti: [], texture: 'ambienti', motivi: { grana: 'grana-ambienti' } },
    famiglie: [
      { famiglia: 'ambienti', prefisso: 'ambiente-', funzione: 'drawAmbiente', voci: 'AMBIENTI', argomenti: ['$id', 0, 0], terra: 400 }
    ]
  },
  {
    file: 'prototypes/kit-campagna-villaggio/kit-campagna-villaggio.html', palette: 'C',
    token: { bg: 'paper', p2: 'paper2', ink: 'ink', red: 'red', sand: 'sand', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', sky: 'sky', tree: 'tree' },
    definizioni: { funzione: 'getDefs', argomenti: [], texture: 'campagna', motivi: { grana: 'grana-campagna' } },
    famiglie: [
      { famiglia: 'campagna', prefisso: '', funzione: 'drawCampagna', voci: 'ITEMS', argomenti: ['$id', 0, 0], terra: 200 }
    ]
  },
  {
    file: 'prototypes/kit-feste-di-corte/kit-feste-di-corte.html', palette: 'C',
    token: { bg: 'paper', p2: 'paper2', ink: 'ink', red: 'red', sand: 'sand', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', sky: 'sky', tree: 'tree' },
    definizioni: { funzione: 'getDefs', argomenti: [], texture: 'corte', motivi: { grana: 'grana-corte' } },
    famiglie: [
      { famiglia: 'corte', prefisso: 'corte-', funzione: 'drawCorte', voci: 'CORTE', argomenti: ['$id', 0, 0], terra: 400 }
    ]
  },
  {
    file: 'prototypes/kit-primavera-1917/kit-primavera-1917.html', palette: 'C',
    token: { bg: 'paper', p2: 'paper2', ink: 'ink', red: 'red', sand: 'sand', cLight: 'concrete-light', cMid: 'concrete-mid', cDark: 'concrete-dark', sky: 'sky', tree: 'tree' },
    definizioni: { funzione: 'getDefs', argomenti: [], texture: 'primavera', motivi: { grana: 'grana-primavera' } },
    famiglie: [
      { famiglia: 'oggetti', prefisso: 'oggetto-', funzione: 'drawOggetto', voci: "ITEMS.filter(v => v.famiglia === 'oggetti')", argomenti: ['$id', 0, 0], terra: 200 },
      { famiglia: 'ambienti', prefisso: 'ambiente-', funzione: 'drawAmbiente1917', voci: "ITEMS.filter(v => v.famiglia === 'ambienti')", argomenti: ['$id', 0, 0], terra: 400 },
      { famiglia: 'luoghi', prefisso: 'luogo-', funzione: 'drawLuogo1917', voci: "ITEMS.filter(v => v.famiglia === 'luoghi')", argomenti: ['$id', 0, 0], terra: 400 }
    ]
  }
];
// Colori scritti direttamente nel codice dei kit (fuori dalla palette).
const LETTERALI = { '#E02A1B': 'red', '#161614': 'ink', '#F6F1E3': 'paper' };

export function importa() {
  const symbols = [], patterns = [], textures = {};
  for (const kit of KIT) {
    const api = caricaKit(kit);
    const tokenValues = new Set(Object.values(kit.token));
    const colors = v => { if (tokenValues.has(v) || v === 'none') return v; const t = LETTERALI[v.toUpperCase()]; if (t) return t; throw new Error(kit.file + ': colore fuori palette ' + v); };
    const d = kit.definizioni, defs = d ? api.chiama(d.funzione, d.argomenti) : '';
    const filter = defs.match(/<filter[\s\S]*?<\/filter>/)?.[0];
    if (filter) { const num = n => Number(filter.match(new RegExp(n + '="([^"]+)"'))[1]); textures[d.texture] = { type: 'rough', scale: num('scale'), frequency: num('baseFrequency'), octaves: num('numOctaves'), seed: num('seed') }; }
    const motivi = {};
    for (const m of defs.matchAll(/<pattern id="([\w-]+)" width="(\d+)" height="(\d+)"[^>]*>([\s\S]*?)<\/pattern>/g)) {
      const nome = d?.motivi?.[m[1]]; if (!nome) throw new Error(kit.file + ': motivo senza nome nella configurazione: ' + m[1]);
      patterns.push({ id: nome, width: Number(m[2]), height: Number(m[3]), layers: markupToLayers(m[4], { prefix: 'p', colors }) }); motivi[m[1]] = nome;
    }
    for (const fam of kit.famiglie) {
      const voci = Array.isArray(fam.voci) ? fam.voci : api.valuta(fam.voci).map(v => [v.id, v.label]);
      for (const [voce, label] of voci) {
        const argomenti = fam.argomenti.map(a => a === '$id' ? voce : a);
        let markup = api.chiama(fam.funzione, argomenti).trim();
        if (fam.rimuoviPrimo) markup = markup.replace(/^<[^>]+\/>/, '');
        const id = fam.prefisso + voce.replace(/_/g, '-');
        const layers = markupToLayers(markup, { prefix: 'f', colors, patterns: motivi });
        const box = bounds(layers), ax = Math.round((box[0] + box[2]) / 2 * 10) / 10, ay = fam.terra ?? box[3];
        symbols.push({ id, meta: { label, family: fam.famiglia, source: kit.file.split('/').pop() + '#' + voce, size: [Math.round(box[2] - box[0]), Math.round(box[3] - box[1])], anchor: 'base',
          origine: { file: kit.file, funzione: fam.funzione, argomenti, rimuoviPrimo: Boolean(fam.rimuoviPrimo), definizioni: Object.keys(motivi).length ? d : null } },
          layers: [{ id: 'opera', tag: 'g', pose: { translateX: -Math.round(ax * 100) / 100, translateY: -Math.round(ay * 100) / 100 } }, ...layers.map(l => ({ ...l, parent: l.parent ?? 'opera' }))] });
      }
    }
  }
  // Linea di terra neutra, utile a tutte le scene.
  symbols.push({ id: 'suolo', meta: { label: 'Linea di terra', family: 'ambienti', source: 'studio personaggi.html#suolo', size: [522, 2], anchor: 'base', origine: null },
    layers: markupToLayers('<line x1="-260" y1="0" x2="260" y2="0" stroke="blue" stroke-width="1.5" opacity="0.6"/>', { prefix: 'f' }) });
  return { note: 'GENERATO da bottega/strumenti/importa-studi.js: non modificare a mano.', textures, patterns, symbols };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    // Un simbolo per riga: file compatto ma con differenze leggibili nelle revisioni.
    const out = importa(), riga = v => JSON.stringify(v);
    const text = '{\n"note": ' + riga(out.note) + ',\n"textures": ' + riga(out.textures) + ',\n"patterns": [\n' + out.patterns.map(riga).join(',\n') + '\n],\n"symbols": [\n' + out.symbols.map(riga).join(',\n') + '\n]\n}\n';
    if (process.argv.includes('--check')) {
      if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== text) { console.error('studi.json non aggiornato: eseguire npm run bottega:importa'); process.exitCode = 1; }
      else console.log('studi.json aggiornato (' + out.symbols.length + ' simboli)');
    } else { fs.writeFileSync(OUT, text); console.log('Scritto bottega/generati/studi.json: ' + out.symbols.length + ' simboli'); }
  } catch (e) { console.error('ERRORE: ' + e.message); process.exitCode = 1; }
}
