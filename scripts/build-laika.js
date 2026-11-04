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
const episodeFields=['id','type','title','text','roleId','stageId','motionId','resultMotionId','visualExplanation','context','exposes','choices','roles','budget','buckets','feedback','effects','delayed','sources','branches','next','display','places','tokens','tokenLabel','strengthLabel','upkeepLabel','yearlyLabel','crisisLabel','workers','projects','reserve','rules','upkeep','luck','control','crises','turns','goal','shows','phaseLabels','verdicts','strengthOne','previewLabel','turnWord','confirmLabel','nextLabel','luckLabel','luckResultLabel','upkeepHint','leaveLabel','pointsLabel','queue'];
export function buildLaika(root=fileURLToPath(new URL('../games/laika/',import.meta.url)),{write=true}={}){
 const read=ref=>{
  assert(typeof ref==='string'&&/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.json$/.test(ref),'Riferimento authoring non valido');
  return JSON.parse(fs.readFileSync(path.join(root,ref),'utf8'));
 };
 const course=read('course.json');unique(course.acts,'Atti authoring',1);
 const canone=fs.existsSync(path.join(root,'canone.json'))?read('canone.json'):null;
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
  // Il canone (canone.json) è la sola fonte di numero, titolo, periodo e domanda dell'atto e di titolo e periodo delle unità.
  const ca=canone?.atti.find(x=>x.id===act.id);
  if(canone){
   assert(ca,'Atto assente dal canone: '+act.id);
   assert(JSON.stringify((act.units||[]).map(u=>u.id))===JSON.stringify(ca.unita.map(u=>u.id)),'Unità di '+act.id+' diverse dal canone: '+(act.units||[]).map(u=>u.id).join(', ')+' invece di '+ca.unita.map(u=>u.id).join(', '));
   for(const k of ['title','period','question'])assert(act[k]===undefined,'«'+k+'» di '+act.id+' si scrive solo nel canone');
   for(const u of act.units)assert(u.title===undefined&&u.period===undefined,'Titolo e periodo dell\'unità '+u.id+' si scrivono solo nel canone');
  }
  const fromCanone=ca?{title:'Atto '+ca.numero+' — '+ca.titolo,period:ca.periodo,question:ca.domanda,units:act.units.map((u,i)=>({...u,title:ca.unita[i].titolo,period:ca.unita[i].periodo}))}:{};
  return {...pick({...act,...fromCanone},['id','title','actors','roles','metrics','resources','relations','flags','reconciliation','period','question','units']),episodes};
 });
 // Nel corso stanno, in ordine, tutti gli atti del canone che hanno almeno un'unità costruita.
 if(canone){const attese=canone.atti.filter(a=>a.unita.some(u=>u.stato!=='da fare')).map(a=>a.id);assert(JSON.stringify(acts.map(a=>a.id))===JSON.stringify(attese),'Atti del corso diversi dal canone: '+acts.map(a=>a.id).join(', ')+' invece di '+attese.join(', '));}
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
