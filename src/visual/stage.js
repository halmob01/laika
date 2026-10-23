import {validateTexture,makeTexture} from './texture.js';
import {assert,id,text,own,GROUPS} from '../core/schema.js';
import {TRANSFORMS,MOTION_LIMITS,baseline,trackEnd,sampleTrack} from './choreography.js';
let instanceNumber=0;
const NS='http://www.w3.org/2000/svg';
const TAGS=['g','rect','circle','ellipse','line','path','text','clipPath','pattern'];
const DEFS=['clipPath','pattern'];
const FONTS=['monospace','sans-serif','serif'],WEIGHTS=['normal','bold','500','600','700','800','900'];
const NUMERIC=['x','y','width','height','cx','cy','r','rx','ry','x1','x2','y1','y2','opacity','stroke-width'];
const PROPERTIES=[...NUMERIC,...TRANSFORMS];
const ATTRS=[...NUMERIC,'fill','stroke','d','text-anchor','font-size','font-family','font-weight','letter-spacing','stroke-linecap','stroke-linejoin'];
export function validateStage(stage,act) {
  assert(id(stage.id)&&text(stage.label)&&Array.isArray(stage.layers)&&stage.layers.length<=MOTION_LIMITS.layers,'Stage non valido');
  if(stage.viewBox)assert(Array.isArray(stage.viewBox)&&stage.viewBox.length===4&&stage.viewBox.every(Number.isFinite)&&stage.viewBox[2]>0&&stage.viewBox[3]>0,'ViewBox non valido');
  // Inquadratura su schermi stretti: dove sta l'azione (0 = bordo sinistro, 1 = destro) e quanto ingrandire. Il tema decide se usarla.
  if(stage.mobile!==undefined){const m=stage.mobile;assert(m&&typeof m==='object'&&!Array.isArray(m)&&Object.keys(m).every(k=>['center','zoom'].includes(k))&&Number.isFinite(m.center)&&m.center>=0&&m.center<=1&&(m.zoom===undefined||(Number.isFinite(m.zoom)&&m.zoom>=1&&m.zoom<=3)),'Inquadratura per telefono non valida');}
  const keys=new Set(),groups=new Set();
  for(const layer of stage.layers) {
    assert(id(layer.id)&&!keys.has(layer.id)&&TAGS.includes(layer.tag),'Layer non valido');
    if(layer.parent)assert(groups.has(layer.parent),'Il parent deve essere un gruppo precedente');
    for(const [key,value] of Object.entries(layer.pose||{}))assert(TRANSFORMS.includes(key)&&Number.isFinite(value),'Posa non valida: '+layer.id);
    keys.add(layer.id);if(['g',...DEFS].includes(layer.tag))groups.add(layer.id);
    if(layer.texture){assert(layer.tag==='g','Texture: applicare a un gruppo');validateTexture(layer.texture);}
    if(layer.origin)assert(Array.isArray(layer.origin)&&layer.origin.length===2&&layer.origin.every(Number.isFinite),'Pivot non valido');
    if(DEFS.includes(layer.tag))assert(!layer.parent,'Ritagli e motivi devono essere definiti al livello radice');
    if(layer.tag==='pattern')assert(Number.isFinite(layer.attrs?.width)&&layer.attrs.width>0&&Number.isFinite(layer.attrs?.height)&&layer.attrs.height>0,'Motivo: dimensioni richieste');
    for(const [key,value] of Object.entries(layer.attrs||{})) {
      assert(ATTRS.includes(key),'Attributo SVG non consentito');
      if(NUMERIC.includes(key)||['font-size','letter-spacing'].includes(key))assert(Number.isFinite(value),'Attributo numerico non valido');
      else if(key==='fill'&&typeof value==='string'&&value.startsWith('pattern:'))assert(stage.layers.some(l=>l.id==='pattern-'+value.slice(8)&&l.tag==='pattern'),'Motivo sconosciuto');
      else if(['fill','stroke'].includes(key))assert(/^(#[0-9a-f]{3,8}|none|currentColor)$/i.test(value),'Colore SVG non valido');
      else if(key==='font-family')assert(FONTS.includes(value),'Famiglia tipografica non consentita');
      else if(key==='font-weight')assert(WEIGHTS.includes(String(value)),'Peso tipografico non consentito');
      else if(key==='d')assert(typeof value==='string'&&/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+eE-]+$/.test(value),'Tracciato SVG non valido');
      else if(key==='stroke-linecap')assert(['butt','round','square'].includes(value),'Estremità non valida');
      else if(key==='stroke-linejoin')assert(['miter','round','bevel'].includes(value),'Giunzione non valida');
      else assert(['start','middle','end'].includes(value),'Allineamento non valido');
    }
    if(layer.text!==undefined)assert(typeof layer.text==='string','Testo SVG non valido');
  }
  for(const layer of stage.layers)if(layer.clip){
    assert(stage.layers.some(l=>l.id===layer.clip&&l.tag==='clipPath'),'Ritaglio sconosciuto');
    let parent=layer;while(parent){assert(!DEFS.includes(parent.tag),'Ritagli ricorsivi non consentiti');parent=stage.layers.find(l=>l.id===parent.parent);}
  }
  const bound=new Set();
  for(const b of stage.bindings||[]) {
    assert(keys.has(b.layer)&&PROPERTIES.includes(b.attribute),'Binding non valido');
    assert(own(GROUPS,b.kind)&&act[GROUPS[b.kind]]?.some(d=>d.id===b.id),'Binding su valore sconosciuto');
    assert([b.scale??1,b.offset??0].every(Number.isFinite),'Scala binding non valida');
    const key=b.layer+':'+b.attribute;assert(!bound.has(key),'Binding duplicato');bound.add(key);
  }
  for(const a of stage.intro||[])assert(keys.has(a.layer)&&PROPERTIES.includes(a.attribute)&&Number.isFinite(a.from),'Introduzione non valida');
  assert(Number.isFinite(stage.duration)&&stage.duration>=0&&stage.duration<=5000,'Durata non valida');
  const sequenceIds=new Set();
  for(const seq of stage.sequences||[]) {
    assert(id(seq.id)&&!sequenceIds.has(seq.id)&&text(seq.caption)&&Array.isArray(seq.tracks)&&seq.tracks.length<=MOTION_LIMITS.tracks,'Sequenza non valida');sequenceIds.add(seq.id);
    for(const [i,b] of (seq.beats||[]).entries())assert(Number.isFinite(b.at)&&b.at>=0&&b.at<=Math.max(0,...seq.tracks.map(trackEnd))&&text(b.text)&&(!i||b.at>seq.beats[i-1].at),'Didascalie non valide');
    const ends=new Map(),finalValues=new Map();
    for(const t of seq.tracks){
      assert(keys.has(t.layer)&&PROPERTIES.includes(t.attribute)&&Number.isFinite(t.from)&&Number.isFinite(t.to),'Traccia non valida');
      assert(Number.isFinite(t.at)&&t.at>=0&&Number.isFinite(t.duration)&&t.duration>0&&trackEnd(t)<=MOTION_LIMITS.duration,'Tempo traccia non valido');
      assert(Number.isInteger(t.iterations??1)&&(t.iterations??1)>=1&&(t.iterations??1)<=MOTION_LIMITS.iterations,'Ripetizioni non valide');
      if(t.keyframes){
        assert(Array.isArray(t.keyframes)&&t.keyframes.length>=2&&t.keyframes.length<=32,'Fotogrammi non validi');
        assert(t.keyframes[0].offset===0&&t.keyframes.at(-1).offset===1&&t.keyframes[0].value===t.from&&t.keyframes.at(-1).value===t.to,'Estremi fotogrammi incoerenti');
        t.keyframes.forEach((k,i)=>assert(Number.isFinite(k.offset)&&Number.isFinite(k.value)&&(!i||k.offset>t.keyframes[i-1].offset),'Fotogrammi non ordinati'));
      }
      if((t.iterations??1)>1)assert(t.from===t.to,'Un ciclo deve chiudersi sulla stessa posa');
      assert(['linear','smooth','out','hold'].includes(t.ease||'smooth'),'Easing sconosciuto');
      const key=t.layer+':'+t.attribute;
      assert(!bound.has(key),'Le sequenze non possono sovrascrivere proprietà legate allo stato');
      assert((ends.get(key)||0)<=t.at,'Tracce sovrapposte o fuori ordine');ends.set(key,trackEnd(t));finalValues.set(key,t);
    }
    for(const t of finalValues.values()){const layer=stage.layers.find(l=>l.id===t.layer);assert(t.to===baseline(layer,t.attribute),'Una sequenza deve terminare nello stato statico: '+t.layer);}
  }
  if(stage.introSequence)assert(sequenceIds.has(stage.introSequence),'Sequenza iniziale sconosciuta');
}
export function createStage(host,{reducedMotion=false,textures=true,raf=requestAnimationFrame,caf=cancelAnimationFrame,now=()=>performance.now(),onCaption=()=>{},onStatus=()=>{},onProgress=()=>{}}={}) {
  let beats=[],caption='',lastBeat=-1;
  let descriptor,nodes=new Map(),transforms=new Map(),frame=null,last=null,tracks=[],finals=[],elapsed=0,started=0,paused=false,endTime=0;
  let textured=[];
  const dirty=new Set(),origins=new Map(),cache=new Map(),homes=new Map();let generation=0;
  function read(layer,attribute){if(TRANSFORMS.includes(attribute))return transforms.get(layer)[attribute];const v=nodes.get(layer).getAttribute(attribute);return v===null?(attribute==='opacity'?1:0):Number(v);}
  function flush(){
    for(const layer of dirty){const t=transforms.get(layer),origin=origins.get(layer);
      const pivot=origin?` translate(${origin[0]} ${origin[1]})`:'';
      const undo=origin?` translate(${-origin[0]} ${-origin[1]})`:'';
      const skew=(t.skewX?` skewX(${t.skewX})`:'')+(t.skewY?` skewY(${t.skewY})`:'');
      nodes.get(layer).setAttribute('transform',`translate(${t.translateX} ${t.translateY})${pivot} rotate(${t.rotate})${skew} scale(${t.scaleX===1?t.scale:t.scale*t.scaleX+' '+t.scale})${undo}`);
    }dirty.clear();
  }
  function writeOne(layer,attribute,value){
    const key=layer+':'+attribute;if(cache.get(key)===value)return;cache.set(key,value);
    if(TRANSFORMS.includes(attribute)){transforms.get(layer)[attribute]=value;dirty.add(layer);}
    else nodes.get(layer).setAttribute(attribute,String(value));
  }
  function write(items){for(const t of items)writeOne(t.layer,t.attribute,t.to);flush();}
  function cancel(){if(frame!==null)caf(frame);frame=null;}
  function status(value){host.dataset.motion=value;onStatus(value);}
  function skip(){cancel();write(finals);paused=false;status('finished');onProgress(endTime,endTime);if(caption)onCaption(caption);}
  function paint(time){
    // Later tracks for the same property take over only when their segment begins.
    const painted=new Set();
    for(const t of tracks){const key=t.layer+':'+t.attribute;if(time<t.at&&painted.has(key))continue;
      writeOne(t.layer,t.attribute,sampleTrack(t,time));painted.add(key);}
    flush();onProgress(Math.min(time,endTime),endTime);
    const beat=beats.findLastIndex(b=>b.at<=time);if(beat!==lastBeat){lastBeat=beat;if(beat>=0)onCaption(beats[beat].text);}
  }
  function tick(time){elapsed=time-started;paint(elapsed);
    if(elapsed<endTime)frame=raf(tick);else skip();}
  function play(items,{remember=true,caption:message='',beats:markers=[]}={}){
    skip();tracks=items.map(t=>({at:0,duration:descriptor.duration,ease:'smooth',...t}));endTime=Math.max(0,...tracks.map(trackEnd));
    const end=new Map();for(const t of tracks)end.set(t.layer+':'+t.attribute,t);finals=[...end.values()];
    caption=message;beats=markers;lastBeat=-1;if(remember)last={items:structuredClone(tracks),caption,beats};if(caption)onCaption(caption);
    elapsed=0;paused=false;
    if(reducedMotion||!tracks.length){skip();return;}
    paint(0);started=now();status('playing');frame=raf(tick);
  }
  function sequence(id){const seq=descriptor.sequences?.find(s=>s.id===id);if(!seq)throw new Error('Sequenza sconosciuta: '+id);play(seq.tracks,{caption:seq.caption,beats:seq.beats||[]});}
  function values(state){return (descriptor.bindings||[]).map(b=>({layer:b.layer,attribute:b.attribute,to:state[GROUPS[b.kind]][b.id]*(b.scale??1)+(b.offset??0)}));}
  function mount(stage,state,{intro=false}={}){
    // La didascalia della scena precedente non deve ricomparire chiudendola: la nuova scena parte senza.
    caption='';beats=[];lastBeat=-1;skip();descriptor=stage;nodes=new Map();transforms=new Map();dirty.clear();origins.clear();cache.clear();host.replaceChildren();last=null;tracks=[];finals=[];endTime=0;
    textured=[];homes.clear();generation++;
    const prefix='motion-'+(++instanceNumber)+'-';
    const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',(stage.viewBox||[0,0,640,360]).join(' '));svg.setAttribute('role','img');svg.setAttribute('aria-label',stage.label);
    const defs=document.createElementNS(NS,'defs');if(stage.layers.some(l=>DEFS.includes(l.tag)||l.texture))svg.append(defs);
    const textureIds=new Map();
    for(const layer of stage.layers){const node=document.createElementNS(NS,layer.tag);node.dataset.layer=layer.id;
      for(const [key,value] of Object.entries(layer.attrs||{}))node.setAttribute(key,key==='fill'&&String(value).startsWith('pattern:')?'url(#'+prefix+'pattern-'+String(value).slice(8)+')':String(value));if(layer.text)node.textContent=layer.text;
      if(layer.tag==='clipPath'){node.setAttribute('id',prefix+layer.id);node.setAttribute('clipPathUnits','userSpaceOnUse');}
      if(layer.tag==='pattern'){node.setAttribute('id',prefix+layer.id);node.setAttribute('patternUnits','userSpaceOnUse');}
      if(layer.texture){const key=JSON.stringify(layer.texture);let filterId=textureIds.get(key);if(!filterId){filterId=prefix+'texture-'+textureIds.size;textureIds.set(key,filterId);defs.append(makeTexture(layer.texture,filterId));}textured.push({node,id:filterId});if(textures)node.setAttribute('filter','url(#'+filterId+')');}
      if(layer.clip)node.setAttribute('clip-path','url(#'+prefix+layer.clip+')');
      (layer.parent?nodes.get(layer.parent):DEFS.includes(layer.tag)?defs:svg).append(node);nodes.set(layer.id,node);transforms.set(layer.id,{translateX:0,translateY:0,scale:1,scaleX:1,rotate:0,skewX:0,skewY:0,...layer.pose});
      if(layer.origin)origins.set(layer.id,layer.origin);homes.set(layer.id,{translateX:layer.pose?.translateX??0,translateY:layer.pose?.translateY??0});
      for(const [key,value] of Object.entries(layer.pose||{}))writeOne(layer.id,key,value);}
    host.append(svg);flush();write(values(state));
    if(intro&&stage.introSequence)sequence(stage.introSequence);
    else if(intro&&stage.intro?.length)play(stage.intro.map(t=>({...t,to:read(t.layer,t.attribute)})));
  }
  function update(state,{animate:motion=true,sequence:cue}={}){
    const wanted=values(state),items=wanted.map(t=>({...t,from:read(t.layer,t.attribute)}));
    if(!motion){skip();write(items);last=null;return;}
    if(cue){const seq=descriptor.sequences?.find(s=>s.id===cue);assert(seq,'Sequenza sconosciuta');play([...items,...seq.tracks],{caption:seq.caption,beats:seq.beats||[]});}
    else if(items.some(t=>t.from!==t.to))play(items);
  }
  // Sposta livelli (per esempio figure) in un punto della scena, in unità del viewBox; null = posizione di partenza.
  // Serve ai giochi che mettono persone nei posti: niente tracce scritte a mano, solo il punto d'arrivo.
  function position(targets,{animate=true,duration=700}={}){
    const items=[];
    for(const t of targets){if(!nodes.has(t.layer))continue;const home=homes.get(t.layer);
      for(const a of ['translateX','translateY']){const to=t[a]??home[a],from=read(t.layer,a);if(Math.abs(from-to)>0.5)items.push({layer:t.layer,attribute:a,from,to});}}
    if(!items.length)return false;
    if(!animate||reducedMotion){skip();write(items);return true;}
    play(items.map(i=>({...i,duration})),{remember:false});return true;
  }
  function pause(){if(frame===null)return;elapsed=Math.max(0,now()-started);paint(elapsed);cancel();paused=true;status('paused');}
  function resume(){if(!paused)return;paused=false;if(reducedMotion){skip();return;}started=now()-elapsed;status('playing');frame=raf(tick);}
  function seek(ms){if(reducedMotion){skip();return;}assert(Number.isFinite(ms),'Tempo non valido');cancel();elapsed=Math.max(0,Math.min(endTime,ms));paint(elapsed);paused=elapsed<endTime;status(paused?'paused':'finished');}
  return {mount,update,sequence,skip,position,get generation(){return generation;},pause,resume,seek,setTexturesEnabled(value){textures=Boolean(value);for(const {node,id} of textured){if(textures)node.setAttribute('filter','url(#'+id+')');else node.removeAttribute('filter');}},replay(){if(last)play(last.items,{remember:false,caption:last.caption,beats:last.beats});},setReducedMotion(value){reducedMotion=value;if(value)skip();},destroy(){skip();host.replaceChildren();textured=[];},get active(){return frame!==null;},get paused(){return paused;}};
}
