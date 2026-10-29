import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateRegistry} from '../src/shell/registry.js';
import {validatePack} from '../src/validation/game-pack.js';
import {readProgress,save,storageKey} from '../src/storage/index.js';
import {newSession,transition} from '../src/runner/index.js';
import {buildLaika} from '../scripts/build-laika.js';
const config=JSON.parse(fs.readFileSync(new URL('../config.json',import.meta.url)));
const game=validatePack(JSON.parse(fs.readFileSync(new URL('../games/messaggio/game.json',import.meta.url))));
test('registry presentation is optional and only accepts canonical local paths',()=>{
 assert.equal(validateRegistry(config),config);
 for(const value of ['https://example.org/x.css','//host/x.css','/x.css','./../x.css','./%2e%2e/x.css','./x.css?x','./x.css#x','./x\\y.css','javascript:alert(1)']){
  const bad=structuredClone(config);bad.games[0].presentation={stylesheet:value,homeHref:'./'};assert.throws(()=>validateRegistry(bad));
 }
 for(const presentation of [null,[],{stylesheet:'./x.css',homeHref:'//host'},{stylesheet:'./x.css',homeHref:'./',script:'./x.js'}]){
  const bad=structuredClone(config);bad.games[0].presentation=presentation;assert.throws(()=>validateRegistry(bad));
 }
});
test('context accepts documented metadata and rejects malformed context without changing legacy packs',()=>{
 for(const kind of ['documented','simulation','source','assessment']){
  const g=structuredClone(game);g.acts[0].episodes[0].context={kind,dateLabel:'1861',placeLabel:'<b>Russia</b>'};assert.equal(validatePack(g).acts[0].episodes[0].context.kind,kind);
 }
 for(const context of [null,{},[],{kind:['source']},{kind:'fiction'},{kind:'source',dateLabel:3},{kind:'source',html:'<script>'}]){
  const g=structuredClone(game);g.acts[0].episodes[0].context=context;assert.throws(()=>validatePack(g));
 }
 assert.doesNotThrow(()=>validatePack(game));
});
test('progress reuses replay, preserves saves byte for byte and distinguishes new/outcome/complete/invalid',()=>{
 const data=new Map();let writes=0;
 const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>{writes++;data.set(key,value);}};
 assert.equal(readProgress(game,storage).status,'new');assert.equal(writes,0);
 let state=newSession(game,'test');save(game,state,storage);
 assert.equal(readProgress(game,storage).status,'resumable');
 for(let n=0;!state.complete&&n<50;n++){
  const e=game.acts[state.actIndex].episodes.find(e=>e.id===state.currentAct.episodeId);
  const action=state.currentAct.phase==='outcome'||e.type==='narrative'?{type:'advance'}:e.type==='choice'?{type:'select',choiceId:'verify'}:e.type==='source_comparison'?{type:'inspect_source',sourceId:e.sources.find(s=>!state.currentAct.viewedSources.includes(e.id+':'+s.id))?.id}: {type:'answer',answerId:e.question.correctId};
  if(action.type==='inspect_source'&&!action.sourceId){delete action.sourceId;Object.assign(action,{type:'select',choiceId:'compare'});}
  state=transition(game,state,action).nextState;save(game,state,storage);
  const before=data.get(storageKey(game)),count=writes,progress=readProgress(game,storage);
  assert.equal(writes,count);assert.equal(data.get(storageKey(game)),before);
  if(!state.complete)assert.equal(progress.phase,state.currentAct.phase);
 }
 assert.equal(state.complete,true);assert.equal(readProgress(game,storage).status,'complete');
 for(const raw of ['not json',JSON.stringify({saveSchemaVersion:999}),JSON.stringify({saveSchemaVersion:1,gameId:game.id,contentVersion:'old',commands:[]}),JSON.stringify({saveSchemaVersion:1,gameId:game.id,contentVersion:game.contentVersion,seed:'x',commands:[{}]})]){
  data.set(storageKey(game),raw);const count=writes;assert.equal(readProgress(game,storage).status,'incompatible');assert.equal(data.get(storageKey(game)),raw);assert.equal(writes,count);
 }
 assert.equal(readProgress(game,null).status,'incompatible');
});
test('LAIKA assembly is deterministic, validated and projects editorial metadata out',()=>{
 const first=buildLaika(undefined,{write:false});assert.equal(buildLaika(undefined,{write:false}),first);
 assert.equal(first,fs.readFileSync(new URL('../games/laika/game.json',import.meta.url),'utf8'));
 assert.ok(!first.includes('editorial'));assert.equal(validatePack(JSON.parse(first)).acts.length,1);
});
test('LAIKA build rejects missing references, duplicate IDs, unresolved questions and invalid schema before writing',()=>{
 const mutations=[
  dir=>{const p=path.join(dir,'source/acts/atto-1.json');fs.unlinkSync(p);},
  dir=>{const p=path.join(dir,'source/acts/atto-1.json');const a=JSON.parse(fs.readFileSync(p));a.episodes.push(a.episodes[0]);fs.writeFileSync(p,JSON.stringify(a));},
  dir=>{const p=path.join(dir,'source/acts/atto-1.json');const a=JSON.parse(fs.readFileSync(p));a.episodes[0].type='assessment';a.episodes[0].questionRef='missing';fs.writeFileSync(p,JSON.stringify(a));},
  dir=>{const p=path.join(dir,'source/acts/atto-1.json');const a=JSON.parse(fs.readFileSync(p));a.episodes[0].roleId='missing';fs.writeFileSync(p,JSON.stringify(a));},
  dir=>{const p=path.join(dir,'questions/atto-1.json');fs.writeFileSync(p,JSON.stringify([{id:'duplicate'},{id:'duplicate'}]));}
 ];
 for(const mutate of mutations){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'laika-build-'));
  try{fs.cpSync(new URL('../games/laika/',import.meta.url),dir,{recursive:true});const before=fs.readFileSync(path.join(dir,'game.json'),'utf8');mutate(dir);assert.throws(()=>buildLaika(dir));assert.equal(fs.readFileSync(path.join(dir,'game.json'),'utf8'),before);}
  finally{fs.rmSync(dir,{recursive:true,force:true});}
 }
});
test('LAIKA resolves external stage/symbol/question data and keeps nested editorial notes out of runtime',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'laika-resolve-'));
 const read=p=>JSON.parse(fs.readFileSync(path.join(dir,p),'utf8'));
 const write=(p,v)=>fs.writeFileSync(path.join(dir,p),JSON.stringify(v));
 try{
  fs.cpSync(new URL('../games/laika/',import.meta.url),dir,{recursive:true});
  const course=read('course.json');course.exposureFlags=[...course.exposureFlags,'seen'];course.stages=['source/stages/test.json'];write('course.json',course);
  const act=read('source/acts/atto-1.json');act.roles[0].editorial={note:'PRIVATE_ROLE'};
  act.episodes[0].exposes=[...act.episodes[0].exposes,'seen'];act.episodes[0].stageId='test';delete act.episodes[0].motionId;
  act.episodes.push({id:'test-question',type:'assessment',title:'Test',text:'Test',roleId:act.roles[0].id,questionRef:'question'});act.units.find(u=>u.id==='i3').episodes.push('test-question');write('source/acts/atto-1.json',act);
  write('questions/atto-1.json',[...read('questions/atto-1.json'),{id:'question',prompt:'Test?',rationale:'Explanation',source:'Runtime provenance',objectives:['Test'],requiredExposureFlags:['seen'],correctId:'a',options:[{id:'a',label:'A',editorial:{note:'PRIVATE_OPTION'}},{id:'b',label:'B'}],editorial:{note:'PRIVATE_QUESTION'}}]);
  write('assets/symbols.json',[{id:'symbol',editorial:{note:'PRIVATE_SYMBOL'},layers:[{id:'shape',tag:'rect',attrs:{width:20,height:20},editorial:{note:'PRIVATE_LAYER'}}]}]);
  write('source/stages/test.json',{id:'test',label:'Test',duration:0,components:[{id:'instance',symbol:'symbol'}],editorial:{note:'PRIVATE_STAGE'}});
  const output=buildLaika(dir,{write:false}),game=validatePack(JSON.parse(output));
  assert.equal(output.includes('PRIVATE_'),false);assert.equal(game.acts[0].episodes.find(e=>e.id==='test-question').question.source,'Runtime provenance');assert.equal(game.stages[0].layers.length,2);
  const stage=read('source/stages/test.json');stage.components[0].symbol='missing';write('source/stages/test.json',stage);assert.throws(()=>buildLaika(dir),/Simbolo sconosciuto/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
