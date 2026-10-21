import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validatePack} from '../src/validation/game-pack.js';
import {createGame} from '../scripts/create-game.js';
import {readPacks} from '../scripts/packs.js';
import {newSession,currentScene,transition} from '../src/runner/index.js';
const raw=JSON.parse(fs.readFileSync(new URL('../games/messaggio/game.json',import.meta.url)));
test('composition scopes symbols, preserves input and resolves rest poses',()=>{
 const before=structuredClone(raw),g=validatePack(raw);assert.deepEqual(raw,before);
 assert.deepEqual(validatePack(g),g);assert.equal(g.symbols,undefined);
 const scene=g.stages[1];assert.ok(scene.layers.some(l=>l.id==='left-paper'&&l.parent==='left'));
 assert.ok(scene.layers.some(l=>l.id==='right-paper'&&l.parent==='right'));
 assert.equal(scene.sequences[0].tracks.find(t=>t.layer==='right').to,180);
});
test('presets cannot bypass SVG restrictions, collisions or timing limits',()=>{
 for(const mutate of [g=>g.stages[0].components[0].symbol='missing',g=>g.symbols[0].layers[0].attrs.onclick='run()',g=>g.stages[0].components[0].pose.translateX='bad',g=>g.stages[0].sequences[0].presets[0].duration=31000,g=>g.stages[0].components.push({...g.stages[0].components[0]}),g=>g.stages[0].sequences[0].presets[0].layer='missing']){
  const bad=structuredClone(raw);mutate(bad);assert.throws(()=>validatePack(bad));
 }
 const bad=structuredClone(raw);bad.acts[0].episodes[1].choices[0].effects[0].id='unknown';
 assert.throws(()=>validatePack(bad),/Atto decisione \/ episodio decision/);
});
test('new pack command registers a playable pack and refuses overwrite/path traversal',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'kit-authoring-'));
 try {
  fs.writeFileSync(path.join(dir,'config.json'),JSON.stringify({defaultGame:'trial',games:[]}));
  createGame(dir,'trial','Una prova');assert.equal(readPacks(dir)[0].game.title,'Una prova');
  const before=fs.readFileSync(path.join(dir,'games/trial/game.json'),'utf8');
  assert.throws(()=>createGame(dir,'trial'));assert.throws(()=>createGame(dir,'../escape'));
  assert.equal(fs.readFileSync(path.join(dir,'games/trial/game.json'),'utf8'),before);
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
test('different branches converge before cross-act assessments, without numeric metrics',()=>{
 const g=validatePack(raw),paths=[];
 for(const choiceId of ['verify','forward']) {
  let s=newSession(g),visited=[];
  for(let n=0;!s.complete&&n<50;n++) {
   const e=currentScene(g,s);visited.push(e.id);
   let action;
   if(e.type==='narrative'||s.currentAct.phase==='outcome')action={type:'advance'};
   else if(e.type==='choice')action={type:'select',choiceId};
   else if(e.type==='source_comparison'){
    const source=e.sources.find(x=>!s.currentAct.viewedSources.includes(e.id+':'+x.id));
    action=source?{type:'inspect_source',sourceId:source.id}:{type:'select',choiceId:'compare'};
   } else action={type:'answer',answerId:e.question.correctId};
   s=transition(g,s,action).nextState;
  }
  assert.equal(s.complete,true);assert.equal(s.historySnapshots.length,3);assert.equal(s.assessmentResults.length,2);
  assert.deepEqual(s.currentAct.metrics,{});paths.push(visited);
 }
 assert.ok(paths[0].includes('verified')&&!paths[0].includes('circulated'));
 assert.ok(paths[1].includes('circulated')&&!paths[1].includes('verified'));
});
