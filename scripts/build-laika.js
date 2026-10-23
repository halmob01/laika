import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validatePack} from '../src/validation/game-pack.js';
import {assert,unique} from '../src/core/schema.js';
import {componiScene} from '../bottega/strumenti/libreria.js';
// Explicit projections keep editorial/source metadata out of runtime manifests.
const pick=(object,keys)=>Object.fromEntries(keys.filter(k=>object[k]!==undefined).map(k=>[k,object[k]]));
// `editorial` is reserved for authoring notes at every depth. Runtime `source`/`sources` stay intact.
const runtimeData=value=>Array.isArray(value)?value.map(runtimeData):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>key!=='editorial').map(([key,child])=>[key,runtimeData(child)])):value;
const episodeFields=['id','type','title','text','roleId','stageId','motionId','resultMotionId','visualExplanation','context','exposes','choices','roles','budget','buckets','feedback','effects','delayed','sources','branches','next','display','places','tokens','tokenLabel','strengthLabel','upkeepLabel','yearlyLabel','crisisLabel','workers','projects','reserve','rules','upkeep','luck','control','crises','turns'];
export function buildLaika(root=fileURLToPath(new URL('../games/laika/',import.meta.url)),{write=true}={}){
 const read=ref=>{
  assert(typeof ref==='string'&&/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.json$/.test(ref),'Riferimento authoring non valido');
  return JSON.parse(fs.readFileSync(path.join(root,ref),'utf8'));
 };
 const course=read('course.json');unique(course.acts,'Atti authoring',1);
 const questions=course.questions.flatMap(ref=>read(ref));unique(questions,'Domande');
 const allEpisodes=[];
 const acts=course.acts.map(entry=>{
  const act=read(entry.file);assert(act.id===entry.id,'ID atto e indice differenti');
  const episodes=act.episodes.map(source=>{
   allEpisodes.push(source);
   const episode=pick(source,episodeFields);
   if(source.questionRef!==undefined){
    assert(source.type==='assessment','Domanda su episodio non assessment');
    const q=questions.find(q=>q.id===source.questionRef);assert(q,'Domanda non risolta: '+source.questionRef);
    episode.question=pick(q,['id','prompt','rationale','source','objectives','options','correctId','requiredExposureFlags']);
   }
   return episode;
  });
  return {...pick(act,['id','title','actors','roles','metrics','resources','relations','flags','reconciliation']),episodes};
 });
 unique(allEpisodes,'Episodi authoring');
 // Schede scena della bottega (facoltative): composte con il tema del corso.
 const scene=(course.scene||[]).map(read);
 const bottega=scene.length?componiScene(scene,{tema:course.tema||'laika'}):null;
 const symbols=[...read(course.symbols),...(bottega?bottega.symbols:[])];
 const game=runtimeData({...pick(course,['schemaVersion','id','contentVersion','title','exposureFlags']),...(bottega?{palette:bottega.palette,patterns:bottega.patterns}:{}),symbols,stages:[...course.stages.map(read),...(bottega?bottega.stages:[])],acts});
 validatePack(game); // Reuse pack composition and SVG validation, not another validator.
 const output=JSON.stringify(game,null,2)+'\n';
 if(write)fs.writeFileSync(path.join(root,'game.json'),output);
 return output;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{buildLaika();console.log('LAIKA: manifest interno rigenerato e validato');}
 catch(error){console.error(error.message);process.exitCode=1;}
}
