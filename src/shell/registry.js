import {assert,id,text,unique} from '../core/schema.js';
// Canonical local paths only: no URL schemes, encoded traversal, queries or fragments.
export function localPath(value) {
  return typeof value==='string' && /^\.\/(?:[a-zA-Z0-9_-]+\/)*(?:[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*)?$/.test(value);
}
export function validateRegistry(config) {
  const ids=unique(config.games,'Giochi',1);
  assert(ids.has(config.defaultGame),'Gioco iniziale non configurato');
  for(const item of config.games){
    assert(id(item.id)&&text(item.label)&&localPath(item.manifest),'Voce registro non valida');
    if(item.presentation!==undefined){
      const p=item.presentation;
      assert(p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).every(k=>['stylesheet','homeHref'].includes(k)),'Presentazione non valida');
      assert(localPath(p.stylesheet)&&p.stylesheet.endsWith('.css')&&localPath(p.homeHref),'Percorsi presentazione non validi');
    }
  }
  return config;
}
export function applyPresentation(item,document) {
  document.getElementById('pack-theme')?.remove();
  const home=document.getElementById('home-link');
  if(home)home.setAttribute('href',item.presentation?.homeHref||'./');
  if(item.presentation){
    const link=document.createElement('link');link.id='pack-theme';link.rel='stylesheet';link.href=item.presentation.stylesheet;document.head.append(link);
  }
}
