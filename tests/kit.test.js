import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateGame,jsonData} from '../src/core/schema.js';
import {newSession,currentScene,transition,recap} from '../src/runner/index.js';
import {available} from '../src/core/engine.js';
import {restore,exportSave,storageKey,load,save} from '../src/storage/index.js';
import {optionOrder} from '../src/assessment/index.js';
import {validateStage} from '../src/visual/stage.js';
import {readPacks} from '../scripts/packs.js';
import {fileURLToPath} from 'node:url';
const packs=readPacks(fileURLToPath(new URL('../',import.meta.url))).map(p=>p.game);
function step(game,s,a){return transition(game,s,a).nextState;}
function answer(game,s,variant=0){
  const e=currentScene(game,s);
  if(s.currentAct.phase==='outcome'||e.type==='narrative')return {type:'advance'};
  if(e.type==='resource_allocation')return {type:'allocate',allocations:Object.fromEntries(e.buckets.map((b,i)=>[b.id,i===variant%e.buckets.length?e.budget:0]))};
  if(e.type==='source_comparison') {const source=e.sources.find(x=>!s.currentAct.viewedSources.includes(e.id+':'+x.id));if(source)return {type:'inspect_source',sourceId:source.id};}
  if(e.type==='assessment')return {type:'answer',answerId:e.question.options[variant%e.question.options.length].id};
  const choices=e.choices.filter(c=>available(c,s.currentAct));return {type:'select',choiceId:choices[variant%choices.length].id};
}
function until(game,predicate,variant=0){let s=newSession(game,'fixed');for(let i=0;i<100&&!predicate(s);i++)s=step(game,s,answer(game,s,variant));assert.ok(predicate(s));return s;}
for(const game of packs) {
  test(game.id+': same public contract completes and restores at every boundary',()=>{
    validateGame(game);for(const a of game.acts)for(const e of a.episodes)if(e.stageId)validateStage(game.stages.find(s=>s.id===e.stageId),a);
    for(let variant=0;variant<3;variant++){
      let s=newSession(game,'fixed'),count=0;
      while(!s.complete&&count++<100){const before=structuredClone(s);const t=transition(game,s,answer(game,s,variant));assert.deepEqual(s,before);s=t.nextState;
        const back=restore(game,exportSave(game,s));assert.equal(back.ok,true,back.error);assert.deepEqual(back.state,s);}
      assert.equal(s.complete,true);assert.equal(s.historySnapshots.length,game.acts.length);assert.equal(recap(game,s).assessment.count,s.ledger.filter(e=>e.action.type==='answer').length);
      assert.throws(()=>step(game,s,{type:'advance'}));
    }
  });
}
const g=packs[0];
test('delayed entry exactly once; perspective is not a simulation turn; act resets',()=>{
  let s=until(g,s=>s.currentAct.episodeId==='plan');s=step(g,s,{type:'select',choiceId:'prepare'});
  assert.equal(s.currentAct.metrics.access,15);assert.equal(s.currentAct.pendingEffects.length,1);
  s=step(g,s,{type:'advance'});assert.equal(s.currentAct.metrics.access,35);assert.deepEqual(s.currentAct.appliedEffectIds,['preparation-benefit']);
  s=step(g,s,{type:'allocate',allocations:{preparation:2,welcome:2}});s=step(g,s,{type:'advance'});
  const before=structuredClone(s.currentAct);s=step(g,s,{type:'view_role',roleId:'visitor'});
  assert.equal(s.currentAct.turn,before.turn);assert.deepEqual(s.currentAct.metrics,before.metrics);assert.deepEqual(s.currentAct.pendingEffects,before.pendingEffects);
  while(s.actIndex===0)s=step(g,s,answer(g,s));
  assert.equal(s.currentAct.metrics.access,20);assert.equal(s.currentAct.flags.prepared,false);assert.equal(s.currentAct.pendingEffects.length,0);
  assert.ok(s.historySnapshots[0].state.metrics.access>20);assert.equal(s.journal.flatMap(x=>x.events).filter(x=>x.type==='delayed').length,1);
});
test('false delayed conditions expire or are discarded; turn triggers do not run on views',()=>{
  const game=structuredClone(g);const d=game.acts[0].episodes[1].choices[0].delayed[0];
  delete d.episodeId;d.afterTurns=1;d.expiresAfterTurns=0;d.when={op:'flag',id:'prepared',value:false};
  let s=until(game,s=>s.currentAct.episodeId==='crisis');assert.equal(s.currentAct.pendingEffects.length,1);
  s=step(game,s,{type:'view_role',roleId:'visitor'});assert.equal(s.currentAct.pendingEffects.length,1);
  s=step(game,s,{type:'select',choiceId:'coordinate'});assert.equal(s.currentAct.pendingEffects.length,0);
  assert.equal(s.currentAct.appliedEffectIds.length,0);assert.equal(s.journal.flatMap(x=>x.events).filter(e=>e.type==='expired').length,1);
  d.afterTurns=99;
  s=until(game,s=>s.complete);assert.equal(s.journal.flatMap(x=>x.events).filter(e=>e.type==='discarded').length,1);
});
test('turn-delayed effects replay once and retry a false condition within the window',()=>{
  const game=structuredClone(g),d=game.acts[0].episodes[1].choices[0].delayed[0];
  delete d.episodeId;d.afterTurns=1;d.expiresAfterTurns=3;d.when={op:'gte',kind:'relation',id:'cooperation',value:10};
  let s=until(game,s=>s.currentAct.episodeId==='crisis');assert.equal(s.currentAct.appliedEffectIds.length,0);
  s=step(game,s,{type:'select',choiceId:'coordinate'});assert.equal(s.currentAct.appliedEffectIds.length,1);
  assert.deepEqual(restore(game,exportSave(game,s)).state,s);
});
test('invalid actions cannot bypass roles, sources, allocation or assessment',()=>{
  let s=until(g,s=>s.currentAct.episodeId==='allocation');
  for(const allocations of [{preparation:5,welcome:-1},{preparation:1.5,welcome:2.5},{preparation:4},{preparation:4,welcome:1}])assert.throws(()=>step(g,s,{type:'allocate',allocations}));
  assert.throws(()=>step(g,s,{type:'select',choiceId:'prepare'}));
  s=until(g,s=>s.currentAct.episodeId==='crisis');assert.throws(()=>step(g,s,{type:'select',choiceId:'access-first'}));
  s=until(g,s=>s.currentAct.episodeId==='sources');assert.throws(()=>step(g,s,{type:'select',choiceId:'combine'}));
  s=step(g,s,{type:'inspect_source',sourceId:'log'});assert.equal(s.currentAct.processedSources.length,0);assert.equal(s.exposureFlags.includes('compared'),false);
  assert.throws(()=>step(g,s,{type:'answer',answerId:'both'}));
  s=step(g,s,{type:'inspect_source',sourceId:'voice'});s=step(g,s,{type:'select',choiceId:'combine'});
  assert.equal(s.currentAct.processedSources.length,2);assert.throws(()=>step(g,s,{type:'select',choiceId:'combine'}));
  s=step(g,s,{type:'advance'});const tampered=structuredClone(s);tampered.exposureFlags=[];assert.throws(()=>step(g,tampered,{type:'answer',answerId:'both'}));
});
test('clamped deltas are actual changes and no zero-resource game over',()=>{
  const game=structuredClone(g);game.acts[0].episodes[1].choices[0].effects=[{kind:'metric',id:'access',delta:-1000},{kind:'metric',id:'ready',delta:1000}];
  let s=until(game,s=>s.currentAct.episodeId==='plan');const t=transition(game,s,{type:'select',choiceId:'prepare'});
  assert.deepEqual(t.appliedChanges.map(x=>x.delta),[-20,80]);assert.equal(t.nextState.complete,false);
});
test('malformed data and unreachable assessment prerequisites fail before play',()=>{
  const bads=[x=>x.acts[0].episodes[0].next='intro',x=>x.acts[0].episodes[1].choices[0].when={op:'execute'},x=>x.acts[0].episodes[1].choices[0].effects[0].id='unknown',x=>x.acts[0].episodes[0].type='mystery',x=>x.acts[0].metrics[0].id='constructor',x=>x.acts[0].episodes[0].branches=[{when:{op:'flag',id:'prepared',value:false},to:'check'}],x=>x.acts[0].episodes[1].choices.forEach(c=>c.when={op:'flag',id:'prepared',value:true})];
  for(const mutate of bads){const game=structuredClone(g);mutate(game);assert.throws(()=>validateGame(game));}
  assert.throws(()=>jsonData(JSON.parse('{"__proto__":{"polluted":true}}')));assert.equal({}.polluted,undefined);
  assert.throws(()=>jsonData({run:()=>{}}));
});
test('save namespaces, version incompatibility, corrupted commands and storage failures are explicit',()=>{
  const store=new Map(),storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
  const a=newSession(g),b=newSession(packs[1]);save(g,a,storage);save(packs[1],b,storage);assert.equal(store.size,2);assert.notEqual(storageKey(g),storageKey(packs[1]));
  assert.equal(load(g,storage).ok,true);assert.equal(restore(g,exportSave(packs[1],b)).ok,false);
  const raw=JSON.parse(exportSave(g,a));raw.contentVersion='999';assert.equal(restore(g,JSON.stringify(raw)).ok,false);
  raw.contentVersion=g.contentVersion;raw.commands=[{sequence:0,actId:'opening',episodeId:'intro',action:{type:'allocate',allocations:{}}}];assert.equal(restore(g,JSON.stringify(raw)).ok,false);
  assert.equal(restore(g,'{').ok,false);assert.equal(save(g,a,{setItem(){throw Error('quota')}}).ok,false);
});
test('assessment score independent from simulation; stable option positions vary by seed',()=>{
  const s=until(g,s=>s.complete);assert.equal(recap(g,s).assessment.score,100);
  const q=g.acts[0].episodes.find(e=>e.type==='assessment').question,positions=new Set();
  for(let i=0;i<20;i++){const a=optionOrder(q,String(i));assert.deepEqual(a,optionOrder(q,String(i)));positions.add(a.findIndex(o=>o.id===q.correctId));}
  assert.ok(positions.size>=2);
});
test('shared modules have no content imports or domain branching; legacy isolated',()=>{
  const files=fs.readdirSync(new URL('../src/',import.meta.url),{recursive:true}).filter(p=>/\.js$/.test(p));
  for(const file of files){const code=fs.readFileSync(new URL('../src/'+file,import.meta.url),'utf8');assert.doesNotMatch(code,/\b(ettore|troia|soviet|zar|feudo|biblioteca|quartiere)\b/i,file);assert.doesNotMatch(code,/eval\(|new Function\(/,file);}
});
