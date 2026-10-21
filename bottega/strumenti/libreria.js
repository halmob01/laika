// Caricamento della bottega da disco (Node). Nel browser la galleria usa fetch sugli stessi file.
import fs from 'node:fs';
import {compilaScene} from '../scena.js';

const BOTTEGA = new URL('../', import.meta.url);
const leggi = rel => JSON.parse(fs.readFileSync(new URL(rel, BOTTEGA), 'utf8'));

export function caricaLibreria() { return leggi('generati/studi.json'); }
export function palette(tema = 'neutro') {
  const temi = leggi('temi.json').temi;
  if (!temi[tema]) throw new Error('Tema sconosciuto: ' + tema + ' (disponibili: ' + Object.keys(temi).join(', ') + ')');
  return temi[tema];
}
// Scene → frammento di pacchetto {palette, patterns, symbols, stages} pronto per validatePack.
export function componiScene(scene, { tema = 'neutro' } = {}) {
  return compilaScene(scene, { libreria: caricaLibreria(), palette: palette(tema) });
}
