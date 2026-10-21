import {assert} from '../core/schema.js';
const NS='http://www.w3.org/2000/svg';
export function validateTexture(t){
  assert(t&&t.type==='rough'&&Object.keys(t).every(k=>['type','scale','frequency','octaves','seed','bounds'].includes(k)),'Texture non consentita');
  assert(Number.isFinite(t.scale)&&t.scale>=0&&t.scale<=4,'Texture: scala 0–4');
  assert(Number.isFinite(t.frequency)&&t.frequency>=0.001&&t.frequency<=0.5,'Texture: frequenza non valida');
  assert(Number.isInteger(t.octaves)&&t.octaves>=1&&t.octaves<=3,'Texture: ottave 1–3');
  assert(Number.isInteger(t.seed)&&t.seed>=0&&t.seed<=65535,'Texture: seed non valido');
  assert(Array.isArray(t.bounds)&&t.bounds.length===4&&t.bounds.every(Number.isFinite)&&t.bounds[2]>0&&t.bounds[3]>0,'Texture: regione esplicita richiesta');
}
export function makeTexture(t,id){
  validateTexture(t);
  const el=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
  const [x,y,width,height]=t.bounds;
  const filter=el('filter',{id,filterUnits:'userSpaceOnUse',primitiveUnits:'userSpaceOnUse',x,y,width,height});
  filter.append(el('feTurbulence',{type:'fractalNoise',baseFrequency:t.frequency,numOctaves:t.octaves,seed:t.seed,result:'noise'}));
  filter.append(el('feDisplacementMap',{in:'SourceGraphic',in2:'noise',scale:t.scale,xChannelSelector:'R',yChannelSelector:'G'}));
  return filter;
}
