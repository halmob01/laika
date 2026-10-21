import {assert,id} from '../core/schema.js';
export const MOTION_LIMITS=Object.freeze({layers:1200,tracks:700,duration:30000,iterations:24});
export const TRANSFORMS=['translateX','translateY','scale','scaleX','rotate','skewX','skewY'];
export const UNIT=['opacity','scale','scaleX'];
export const baseline=(layer,attribute)=>layer.pose?.[attribute]??layer.attrs?.[attribute]??(UNIT.includes(attribute)?1:0);
export const trackEnd=t=>t.at+t.duration*(t.iterations??1);

// Compile choreography into independent numeric channels; no per-frame selectors,
// randomness, DOM queries or game-specific knowledge.
export function choreography(stage,sequence){
 const layers=new Map(stage.layers.map(l=>[l.id,l])),tracks=[];
 for(const clip of sequence.clips||[]){
  const targets=clip.targets??stage.groups?.[clip.group];
  assert(Array.isArray(targets)&&targets.length&&new Set(targets).size===targets.length,'Clip: elenco target mancante/duplicato');
  assert(Array.isArray(clip.frames)&&clip.frames.length>=2,'Clip: servono almeno due fotogrammi');
  assert(Number.isFinite(clip.stagger??0)&&(clip.stagger??0)>=0,'Clip: stagger non valido');
  const properties=Object.keys(clip.frames[0].values||{});assert(properties.length,'Clip: proprietà mancanti');
  for(const f of clip.frames)assert(f.values&&Object.keys(f.values).length===properties.length&&properties.every(p=>Number.isFinite(f.values[p])),'Clip: proprietà incoerenti');
  targets.forEach((target,i)=>{
   const name=clip.part?target+'-'+clip.part:target,layer=layers.get(name);assert(layer,'Clip: layer sconosciuto '+name);
   for(const attribute of properties){
    const base=clip.relative?baseline(layer,attribute):0;
    const keyframes=clip.frames.map(f=>({offset:f.offset,value:base+f.values[attribute]}));
    tracks.push({layer:name,attribute,from:keyframes[0].value,to:keyframes.at(-1).value,keyframes,at:(clip.at??0)+i*(clip.stagger??0),duration:clip.duration,iterations:clip.iterations??1,ease:clip.ease??'smooth'});
   }
  });
 }
 for(const shot of sequence.shots||[]){
  assert(layers.get(shot.layer)?.tag==='g','Inquadratura: serve un gruppo');
  const [vx,vy,vw,vh]=stage.viewBox||[0,0,640,360];
  assert(Array.isArray(shot.frames)&&shot.frames.length>=2,'Inquadratura: fotogrammi mancanti');
  const frames=shot.frames.map(f=>{
   assert(Array.isArray(f.rect)&&f.rect.length===4&&f.rect.every(Number.isFinite)&&f.rect[2]>0&&f.rect[3]>0,'Rettangolo inquadratura non valido');
   const [x,y,w,h]=f.rect,scale=Math.min(vw/w,vh/h);
   return {offset:f.offset,scale,translateX:vx+(vw-w*scale)/2-x*scale,translateY:vy+(vh-h*scale)/2-y*scale};
  });
  for(const attribute of ['translateX','translateY','scale']){
   const keyframes=frames.map(f=>({offset:f.offset,value:f[attribute]}));
   tracks.push({layer:shot.layer,attribute,keyframes,from:keyframes[0].value,to:keyframes.at(-1).value,at:shot.at??0,duration:shot.duration,ease:shot.ease??'smooth'});
  }
 }
 return tracks;
}

export function sampleTrack(t,time){
 const total=t.duration*(t.iterations??1),elapsed=Math.max(0,time-t.at);
 if(elapsed>=total)return t.to;
 const p=t.duration===0?1:(elapsed%t.duration)/t.duration;
 const keys=t.keyframes||[{offset:0,value:t.from},{offset:1,value:t.to}];
 const right=keys.findIndex((k,i)=>i>0&&p<=k.offset),b=keys[right<0?keys.length-1:right],a=keys[Math.max(0,(right<0?keys.length-1:right)-1)];
 const q=(p-a.offset)/(b.offset-a.offset),type=t.ease||'smooth';
 const eased=type==='linear'?q:type==='out'?1-(1-q)**3:type==='hold'?(q===1?1:0):q*q*(3-2*q);
 return a.value+(b.value-a.value)*eased;
}
