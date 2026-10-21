import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {validatePack} from '../src/validation/game-pack.js';
import {sampleTrack} from '../src/visual/choreography.js';
const raw=()=>JSON.parse(fs.readFileSync(new URL('../games/motion-study/game.json',import.meta.url)));
test('articulated crowd compiles deterministically, keeps art in pack, obeys channel budget',()=>{
 const input=raw(),before=structuredClone(input),a=validatePack(input),b=validatePack(input);
 assert.deepEqual(input,before);assert.deepEqual(a,b);assert.deepEqual(validatePack(a),a);
 const s=a.stages[0];assert.equal(s.layers.length,410);assert.equal(s.sequences[0].tracks.length,346);
 const hips=s.layers.find(l=>l.id==='front-0-leg-left');assert.deepEqual(hips.origin,raw().symbols.find(s=>s.id==='human-c').layers.find(l=>l.id==='leg-left').origin);
 const tracks=s.sequences[0].tracks.filter(t=>t.attribute==='rotate'&&t.layer.includes('leg-left'));
 assert.equal(tracks.length,48);assert.ok(new Set(tracks.map(t=>t.at)).size>5);
});
test('keyframes and finite cycles sample absolute time, including waits and final boundaries',()=>{
 const t={at:100,duration:400,iterations:3,from:0,to:0,ease:'linear',keyframes:[{offset:0,value:0},{offset:.5,value:20},{offset:1,value:0}]};
 assert.equal(sampleTrack(t,0),0);assert.equal(sampleTrack(t,200),10);assert.equal(sampleTrack(t,300),20);
 assert.equal(sampleTrack(t,700),20);assert.equal(sampleTrack(t,1300),0);assert.equal(sampleTrack(t,1400),0);
});
test('choreography refuses malformed keys, unbounded loops, clip recursion and invalid targets',()=>{
 for(const mutate of [
 g=>g.stages[0].sequences[0].clips[0].frames[1].offset=0,
 g=>g.stages[0].sequences[0].clips[0].frames[1].values.translateX='bad',
 g=>g.stages[0].sequences[0].clips[0].iterations=1000,
 g=>g.stages[0].sequences[0].clips[0].frames.at(-1).values.translateX=10,
 g=>g.stages[0].sequences[0].clips[0].group='missing',
 g=>g.stages[0].sequences[0].shots[0].frames[0].rect[2]=0,
 g=>g.stages[0].layers.find(l=>l.id==='reveal-window').clip='reveal',
 g=>g.stages[0].layers.find(l=>l.id==='city-wrap').clip='https://example.org',
 g=>g.stages[0].sequences[0].beats[0].at=50000]){
  const input=raw();mutate(input);assert.throws(()=>validatePack(input));
 }
});
test('SVG import preserves original geometry and rejects executable or unhandled markup',()=>{
 const root=new URL('../',import.meta.url),file=new URL('../games/motion-study/assets/human-a.svg',import.meta.url);
 const imported=JSON.parse(execFileSync('python3',[new URL('../scripts/svg-to-symbol.py',import.meta.url).pathname,file.pathname,'human-a'],{encoding:'utf8'}));
 assert.deepEqual(imported,raw().symbols[0]);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'svg-import-'));
 try{for(const source of ['<svg fill="red"><g id="figure"/></svg>','<svg><svg><g id="figure"/></svg></svg>','<svg><text id="label"><tspan>x</tspan></text></svg>']){
  const fixture=path.join(temp,'invalid.svg');fs.writeFileSync(fixture,source);
  assert.throws(()=>execFileSync('python3',[new URL('../scripts/svg-to-symbol.py',import.meta.url).pathname,fixture,'bad'],{stdio:'pipe'}));
 }}finally{fs.rmSync(temp,{recursive:true,force:true});}
 const html=fs.readFileSync(new URL('../prototypes/laika-home/index.html',import.meta.url),'utf8');
 const city=raw().symbols.find(s=>s.id==='city');
 for(const layer of city.layers.filter(l=>l.tag==='path'))assert.ok(html.includes('d="'+layer.attrs.d+'"'));
 assert.throws(()=>execFileSync('python3',[new URL('../scripts/svg-to-symbol.py',import.meta.url).pathname,new URL('../prototypes/laika-home/index.html',import.meta.url).pathname,'bad'],{stdio:'pipe'}));
});
