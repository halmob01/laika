import {assert,id,jsonData} from '../core/schema.js';
import {compileRig,rigClips,poseOverrides,RIG_PROPERTIES} from './rig.js';
import {choreography,MOTION_LIMITS,UNIT} from './choreography.js';

// Authoring sugar only: produce the same validated layers/tracks as handwritten packs.
// Artwork belongs to the pack. Instance IDs scope every child and parent reference.
//
// Optional pack-level helpers (all resolved here, the renderer never sees them):
// - palette: {token:"#hex"}; layer fill/stroke may use a token name instead of a hex.
// - component.recolor: {token:token} swaps tokens for one instance (e.g. ink → red).
// - component.rigPose / component.joints: static pose of an articulated instance.
// - patterns: [{id,width,height,layers}] referenced as fill "pattern:<id>".
const HEX=/^#[0-9a-f]{3,8}$/i;
const COLOR_KEYS=['fill','stroke'];
function colorResolver(palette){
  return (value,recolor={})=>{
    if(typeof value!=='string'||HEX.test(value)||['none','currentColor'].includes(value)||value.startsWith('pattern:'))return value;
    const token=recolor[value]??value;
    assert(palette&&Object.hasOwn(palette,token),'Colore/token sconosciuto: '+value);
    return palette[token];
  };
}
function paint(layer,resolve,recolor){
  if(!layer.attrs)return layer;
  const attrs={...layer.attrs};
  for(const key of COLOR_KEYS)if(attrs[key]!==undefined)attrs[key]=resolve(attrs[key],recolor);
  return {...layer,attrs};
}
function validatePalette(palette){
  if(palette===undefined)return;
  assert(palette&&typeof palette==='object'&&!Array.isArray(palette),'Palette non valida');
  for(const [token,hex] of Object.entries(palette))assert(id(token)&&HEX.test(hex),'Palette: token o colore non valido: '+token);
}
export function composePack(raw) {
  jsonData(raw);
  const game=structuredClone(raw),symbols=game.symbols||[];
  validatePalette(game.palette);
  const resolve=colorResolver(game.palette),patterns=game.patterns||[];
  const symbolIds=new Set();
  for(const symbol of symbols){assert(symbol&&id(symbol.id)&&!symbolIds.has(symbol.id),'Simboli: ID non valido/duplicato');symbolIds.add(symbol.id);
    const ids=new Set();for(const l of symbol.layers||[])assert(l&&id(l.id)&&!ids.has(l.id)&&ids.add(l.id),'Layer simbolo: ID non valido/duplicato');
    assert(ids.size>=1,'Layer simbolo: elenco mancante');compileRig(symbol);}
  const patternIds=new Set();
  for(const p of patterns){assert(p&&id(p.id)&&!patternIds.has(p.id)&&Number.isFinite(p.width)&&p.width>0&&Number.isFinite(p.height)&&p.height>0&&Array.isArray(p.layers)&&p.layers.length,'Motivo non valido');patternIds.add(p.id);}
  for(const stage of game.stages||[]) {
    stage.layers=(stage.layers||[]).map(l=>paint(l,resolve));
    const rigLimits=new Map();
    for(const instance of stage.components||[]) {
      assert(id(instance.id),'ID componente non valido');
      const symbol=symbols.find(s=>s.id===instance.symbol);
      assert(symbol,'Simbolo sconosciuto: '+instance.symbol);
      const recolor=instance.recolor||{};
      assert(typeof recolor==='object'&&!Array.isArray(recolor)&&Object.entries(recolor).every(([a,b])=>id(a)&&id(b)),'Ricolorazione non valida: '+instance.id);
      const rig=compileRig(symbol);
      let joints={};
      if(instance.rigPose!==undefined)joints=poseOverrides(symbol,instance.rigPose);
      for(const [joint,value] of Object.entries(instance.joints||{})){
        assert(rig?.joints.includes(joint),'Giuntura sconosciuta: '+instance.id+'/'+joint);
        const v=typeof value==='number'?{rotate:value}:value;
        assert(v&&Object.entries(v).every(([k,n])=>RIG_PROPERTIES.includes(k)&&Number.isFinite(n)),'Giuntura non valida: '+joint);
        joints[joint]={...(joints[joint]||{}),...v};
      }
      for(const [joint,range] of Object.entries(symbol.rig?.joints||{})){
        rigLimits.set(instance.id+'-'+joint,range);
        const r=joints[joint]?.rotate;assert(r===undefined||(r>=range[0]&&r<=range[1]),'Posa istanza fuori intervallo: '+instance.id+'/'+joint);
      }
      if(instance.opacity!==undefined)assert(Number.isFinite(instance.opacity)&&instance.opacity>=0&&instance.opacity<=1,'Opacità istanza non valida: '+instance.id);
      stage.layers.push({id:instance.id,tag:'g',pose:instance.pose||{},...(instance.opacity!==undefined?{attrs:{opacity:instance.opacity}}:{}),...(instance.origin?{origin:instance.origin}:{}),...(instance.parent?{parent:instance.parent}:{})});
      for(const layer of symbol.layers){
        const pose=joints[layer.id]?{...(layer.pose||{}),...joints[layer.id]}:layer.pose;
        stage.layers.push({...paint(layer,resolve,recolor),...(pose?{pose}:{}),id:instance.id+'-'+layer.id,parent:layer.parent?instance.id+'-'+layer.parent:instance.id,...(layer.clip?{clip:instance.id+'-'+layer.clip}:{})});
      }
      assert(stage.layers.length<=MOTION_LIMITS.layers,'Troppi layer dopo la composizione');
    }
    // Patterns are injected once per stage, only when referenced.
    const used=new Set(stage.layers.map(l=>l.attrs?.fill).filter(v=>typeof v==='string'&&v.startsWith('pattern:')).map(v=>v.slice(8)));
    const defs=[];
    for(const name of [...used].sort()){
      const p=patterns.find(x=>x.id===name);assert(p,'Motivo sconosciuto: '+name);
      if(stage.layers.some(l=>l.id==='pattern-'+name))continue;
      defs.push({id:'pattern-'+name,tag:'pattern',attrs:{width:p.width,height:p.height}},...p.layers.map(l=>({...paint(l,resolve),id:'pattern-'+name+'-'+l.id,parent:'pattern-'+name+(l.parent?'-'+l.parent:'')})));
    }
    stage.layers=[...defs,...stage.layers];
    assert(stage.layers.length<=MOTION_LIMITS.layers,'Troppi layer dopo la composizione');
    for(const sequence of stage.sequences||[]) {
      const generated=[];
      sequence.clips=[...(sequence.clips||[]),...rigClips(stage,symbols,sequence)];
      for(const preset of sequence.presets||[]) {
        const layer=stage.layers.find(l=>l.id===preset.layer);
        assert(layer,'Layer preset sconosciuto: '+preset.layer);
        const at=preset.at??0,duration=preset.duration??700,ease=preset.ease??'smooth';
        const attribute=preset.attribute??(preset.type==='reveal'?'opacity':'translateX');
        const baseline=layer.pose?.[attribute]??layer.attrs?.[attribute]??(UNIT.includes(attribute)?1:0);
        const track=(from,to,start,length)=>({layer:layer.id,attribute,from,to,at:start,duration:length,ease});
        if(preset.type==='arrive') {
          assert(['translateX','translateY'].includes(attribute)&&Number.isFinite(preset.distance),'Ingresso: asse e distanza richiesti');
          generated.push(track(baseline+preset.distance,baseline,at,duration));
        } else if(preset.type==='reveal') {
          assert(attribute==='opacity','Comparsa: usare opacity');generated.push(track(0,baseline,at,duration));
        } else if(preset.type==='excursion'||preset.type==='emphasis') {
          assert(Number.isFinite(preset.amount),'Movimento: ampiezza richiesta');
          assert(preset.type!=='emphasis'||['scale','opacity'].includes(attribute),'Evidenza: usare scale o opacity');
          const hold=preset.hold??0;assert(Number.isFinite(hold)&&hold>=0,'Pausa preset non valida');
          generated.push(track(baseline,baseline+preset.amount,at,duration/2),track(baseline+preset.amount,baseline,at+duration/2+hold,duration/2));
        } else throw new Error('Preset sconosciuto: '+preset.type);
      }
      sequence.tracks=[...(sequence.tracks||[]),...generated,...choreography(stage,sequence)];
      for(const t of sequence.tracks){const range=t.attribute==='rotate'&&rigLimits.get(t.layer);if(range)assert([t.from,t.to,...(t.keyframes||[]).map(k=>k.value)].every(v=>Number.isFinite(v)&&v>=range[0]&&v<=range[1]),'Rig: traccia fuori intervallo: '+t.layer);}
      assert(sequence.tracks.length<=MOTION_LIMITS.tracks,'Troppe tracce dopo la composizione');
      delete sequence.rigs;delete sequence.clips;delete sequence.shots;
      delete sequence.presets;
    }
    delete stage.components;delete stage.groups;
  }
  delete game.symbols;delete game.palette;delete game.patterns;
  return game;
}
