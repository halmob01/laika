import {assert,id} from '../core/schema.js';

// Authoring only. Named poses and asset-local motions compile to existing clips.
// No second clock, hidden character state or artwork in the renderer.
// A pose value is either an angle (rotate) or {rotate?,translateX?,translateY?}.
export const RIG_PROPERTIES=['rotate','translateX','translateY'];
function normalize(value,name){
  const v=typeof value==='number'?{rotate:value}:value;
  assert(v&&typeof v==='object'&&Object.keys(v).length&&Object.entries(v).every(([k,n])=>RIG_PROPERTIES.includes(k)&&Number.isFinite(n)),'Rig: valore di posa non valido: '+name);
  return v;
}
export function compileRig(symbol) {
  const rig=symbol.rig;
  if(!rig)return null;
  const joints=Object.keys(rig.joints||{}),layers=new Map(symbol.layers.map(l=>[l.id,l]));
  assert(joints.length>0&&joints.length<=32,'Rig: dichiarare 1–32 giunture');
  for(const name of joints){
    const layer=layers.get(name),range=rig.joints[name];
    assert(layer?.tag==='g'&&layer.origin?.length===2,'Rig: gruppo con pivot richiesto: '+name);
    assert(Array.isArray(range)&&range.length===2&&range.every(Number.isFinite)&&range[0]<=range[1]&&range[0]>=-360&&range[1]<=360,'Rig: intervallo non valido');
    const rest=layer.pose?.rotate??0;
    assert(rest>=range[0]&&rest<=range[1],'Rig: riposo fuori intervallo: '+name);
  }
  const poses={},motions=rig.motions||{};
  assert(Object.keys(rig.poses||{}).length<=128&&Object.keys(motions).length<=32,'Rig: troppi elementi');
  for(const [name,pose] of Object.entries(rig.poses||{})){
    assert(id(name)&&pose&&Object.keys(pose).length===joints.length&&joints.every(j=>pose[j]!==undefined),'Rig: posa completa richiesta: '+name);
    poses[name]={};
    for(const j of joints){
      const v=normalize(pose[j],name+'/'+j);poses[name][j]=v;
      if(v.rotate!==undefined)assert(v.rotate>=rig.joints[j][0]&&v.rotate<=rig.joints[j][1],'Rig: posa fuori intervallo: '+name+'/'+j);
    }
  }
  for(const [name,motion] of Object.entries(motions)){
    assert(id(name)&&Number.isFinite(motion.duration)&&motion.duration>0&&motion.duration<=30000,'Rig: movimento non valido');
    assert(Array.isArray(motion.frames)&&motion.frames.length>=2&&motion.frames.length<=32,'Rig: fotogrammi mancanti');
    motion.frames.forEach((f,i)=>assert(poses[f.pose]&&Number.isFinite(f.offset)&&f.offset>=0&&f.offset<=1&&(!i||f.offset>motion.frames[i-1].offset),'Rig: riferimento posa/tempo non valido'));
    assert(motion.frames[0].offset===0&&motion.frames.at(-1).offset===1,'Rig: estremi 0/1 richiesti');
  }
  // Properties animated per joint: union over poses; missing values fall back to the layer rest pose.
  const properties=Object.fromEntries(joints.map(j=>[j,RIG_PROPERTIES.filter(p=>Object.values(poses).some(pose=>pose[j][p]!==undefined))]));
  const value=(pose,joint,property)=>pose[joint][property]??layers.get(joint).pose?.[property]??0;
  return {joints,poses,motions,properties,value};
}
// Values a named pose assigns to each joint, for static instances.
export function poseOverrides(symbol,name){
  const rig=compileRig(symbol);
  assert(rig?.poses[name],'Rig: posa sconosciuta: '+name+' ('+symbol.id+')');
  return Object.fromEntries(rig.joints.map(j=>[j,Object.fromEntries(rig.properties[j].map(p=>[p,rig.value(rig.poses[name],j,p)]))]));
}
export function rigClips(stage,symbols,sequence) {
  const clips=[];
  for(const action of sequence.rigs||[]){
    const instance=stage.components?.find(c=>c.id===action.target),symbol=symbols.find(s=>s.id===instance?.symbol),rig=symbol&&compileRig(symbol);
    const motion=rig?.motions[action.motion];
    assert(motion,'Rig: istanza o movimento sconosciuto');
    for(const joint of rig.joints)for(const property of rig.properties[joint])clips.push({targets:[action.target],part:joint,at:action.at??0,duration:action.duration??motion.duration,iterations:action.iterations??1,ease:motion.ease??'smooth',frames:motion.frames.map(f=>({offset:f.offset,values:{[property]:rig.value(rig.poses[f.pose],joint,property)}}))});
  }
  return clips;
}
