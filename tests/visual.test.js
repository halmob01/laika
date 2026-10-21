import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createStage,validateStage} from '../src/visual/stage.js';
class Node {constructor(){this.attrs={};this.dataset={};this.children=[];}setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]??null;}append(n){this.children.push(n);}replaceChildren(){this.children=[];}}
const descriptor=JSON.parse(fs.readFileSync(new URL('../games/biblioteca/game.json',import.meta.url))).stages[0];
function setup(reducedMotion=false){globalThis.document={createElementNS:()=>new Node()};const host=new Node();let now=0,id=0;const frames=new Map();
 const stage=createStage(host,{reducedMotion,raf:cb=>{frames.set(++id,cb);return id;},caf:id=>frames.delete(id),now:()=>now});
 const tick=t=>{now=t;const current=[...frames.values()];frames.clear();for(const cb of current)cb(t);};
 stage.mount(descriptor,{metrics:{ready:20,access:20}},{intro:false});
 return {host,stage,tick,node:id=>host.children[0].children.find(n=>n.dataset.layer===id)};
}
test('persistent SVG geometry has actual initial/intermediate/final states, replay and skip',()=>{
 const {host,stage,tick,node}=setup();const svg=host.children[0],stock=node('stock');assert.equal(Number(stock.getAttribute('width')),36);
 stage.update({metrics:{ready:60,access:70}});assert.equal(Number(stock.getAttribute('width')),36);
 tick(450);assert.ok(Number(stock.getAttribute('width'))>36&&Number(stock.getAttribute('width'))<108);
 assert.equal(host.children[0],svg);assert.equal(node('stock'),stock);tick(900);assert.equal(Number(stock.getAttribute('width')),108);
 stage.replay();assert.equal(Number(stock.getAttribute('width')),36);stage.skip();assert.equal(Number(stock.getAttribute('width')),108);assert.equal(stage.active,false);
});
test('consecutive/interrupted transitions end at latest state; reduced motion and reload identical',()=>{
 const {stage,tick,node}=setup();stage.update({metrics:{ready:60,access:70}});tick(300);
 stage.update({metrics:{ready:80,access:10}});tick(1200);assert.equal(Number(node('stock').getAttribute('width')),144);assert.equal(Number(node('reader').getAttribute('cx')),315);
 stage.update({metrics:{ready:25,access:30}});stage.setReducedMotion(true);assert.equal(Number(node('stock').getAttribute('width')),45);
 stage.replay();assert.equal(Number(node('stock').getAttribute('width')),45);
 stage.mount(descriptor,{metrics:{ready:25,access:30}},{intro:false});assert.equal(Number(node('stock').getAttribute('width')),45);
});
test('SVG rejects external links, scripts, event attributes and non-numeric bindings',()=>{
 const game=JSON.parse(fs.readFileSync(new URL('../games/biblioteca/game.json',import.meta.url)));
 for(const mutate of [d=>d.layers[0].tag='script',d=>d.layers[0].attrs.onclick='alert(1)',d=>d.layers[0].attrs.fill='url(https://x)',d=>d.bindings[0].id='missing']){
   const d=structuredClone(descriptor);mutate(d);assert.throws(()=>validateStage(d,game.acts[0]));
 }
});
test('multitrack narrative: stagger, pause/resume, final state, replay and interruption',()=>{
 const {stage,tick,host}=setup();const find=id=>{function visit(n){if(n.dataset.layer===id)return n;for(const c of n.children){const r=visit(c);if(r)return r;}}return visit(host);};
 stage.sequence('opening');tick(400);const building=find('building');assert.ok(Number(building.getAttribute('opacity'))>0&&Number(building.getAttribute('opacity'))<1);
 stage.pause();const frozen=building.getAttribute('transform');tick(1400);assert.equal(building.getAttribute('transform'),frozen);assert.equal(stage.paused,true);
 stage.resume();tick(4000);stage.skip();assert.equal(building.getAttribute('opacity'),'1');assert.match(building.getAttribute('transform'),/translate\(0 0\)/);
 stage.sequence('prepare');tick(4500);stage.sequence('welcome');stage.skip();assert.equal(find('parcel').getAttribute('opacity'),'1');assert.match(find('helper').getAttribute('transform'),/translate\(0 0\)/);
 stage.replay();stage.setReducedMotion(true);assert.equal(stage.active,false);assert.match(find('staff').getAttribute('transform'),/translate\(0 0\)/);
});
test('sequences reject overlap, missing groups, bound-state collisions and unknown easing',()=>{
 const game=JSON.parse(fs.readFileSync(new URL('../games/biblioteca/game.json',import.meta.url)));
 for(const mutate of [d=>d.layers[0].parent='missing',d=>d.sequences[0].tracks[0].ease='javascript',d=>d.sequences[0].tracks.push({...d.sequences[0].tracks[0]}),d=>d.sequences[0].tracks[0]={layer:'stock',attribute:'width',from:0,to:1,at:0,duration:10}]){
  const d=structuredClone(descriptor);mutate(d);assert.throws(()=>validateStage(d,game.acts[0]));
 }
});
test('timeline final pose equals reload; non-restorable poses fail authoring validation',()=>{
 const game=JSON.parse(fs.readFileSync(new URL('../games/biblioteca/game.json',import.meta.url)));
 const d=structuredClone(descriptor);d.sequences[0].tracks[0].to=8;
 assert.throws(()=>validateStage(d,game.acts[0]),/stato statico/);
 const {stage,host}=setup();stage.sequence('opening');stage.skip();
 const before=JSON.stringify(host.children);stage.mount(descriptor,{metrics:{ready:20,access:20}});
 // Equivalent transforms: explicit neutral transforms are intentionally absent after mount.
 const normalize=v=>JSON.parse(JSON.stringify(v),(key,value)=>(key==='transform'&&value==='translate(0 0) rotate(0) scale(1)')||(key==='opacity'&&value==='1')?undefined:value);
 assert.deepEqual(normalize(JSON.parse(before)),normalize(host.children));
});
test('groups without explicit attributes can be animated and validated',()=>{
 const game=JSON.parse(fs.readFileSync(new URL('../games/biblioteca/game.json',import.meta.url)));
 const d=structuredClone(descriptor);delete d.layers.find(l=>l.id==='building').attrs;
 assert.doesNotThrow(()=>validateStage(d,game.acts[0]));
});

test('composed poses survive animation, skip, reload and reduced motion',async()=>{
 const {validatePack}=await import('../src/validation/game-pack.js');
 const raw=JSON.parse(fs.readFileSync(new URL('../games/messaggio/game.json',import.meta.url)));
 const d=validatePack(raw).stages[0],{stage,tick,host}=setup();
 stage.mount(d,{});const baseline=JSON.stringify(host.children);
 stage.sequence('enter');const group=host.children[0].children[0];assert.match(group.getAttribute('transform'),/translate\(70 180\)/);
 tick(500);assert.notEqual(JSON.stringify(host.children),baseline);stage.skip();assert.equal(JSON.stringify(host.children),baseline);
 stage.mount(d,{});assert.equal(JSON.stringify(host.children),baseline);
 stage.setReducedMotion(true);stage.sequence('enter');assert.equal(JSON.stringify(host.children),baseline);
});

test('excursion and emphasis presets restore their declared pose',async()=>{
 const {validatePack}=await import('../src/validation/game-pack.js');
 const raw=JSON.parse(fs.readFileSync(new URL('../games/messaggio/game.json',import.meta.url)));
 raw.stages[0].sequences[0].presets=[{type:'excursion',layer:'message',attribute:'translateY',amount:-50,hold:100,duration:600},{type:'emphasis',layer:'message',attribute:'scale',amount:.1,duration:600}];
 const d=validatePack(raw).stages[0],{stage,tick,host}=setup();stage.mount(d,{});const baseline=JSON.stringify(host.children);
 stage.sequence('enter');tick(300);assert.match(host.children[0].children[0].getAttribute('transform'),/translate\(320 130\).*scale\(1.1\)/);
 stage.skip();assert.equal(JSON.stringify(host.children),baseline);
});

test('crowd, camera and clipping seek backwards, pause, resume, replay and restore static state',async()=>{
 const {validatePack}=await import('../src/validation/game-pack.js');
 const g=validatePack(JSON.parse(fs.readFileSync(new URL('../games/motion-study/game.json',import.meta.url))));
 const d=g.stages[0],{stage,tick,host}=setup();stage.mount(d,{});
 const find=id=>{function visit(n){if(n.dataset.layer===id)return n;for(const c of n.children){const r=visit(c);if(r)return r;}}return visit(host);};
 const group=find('front-0'),leg=find('front-0-leg-left'),camera=find('world'),window=find('reveal-window');
 stage.sequence('gather');assert.equal(window.getAttribute('width'),'0');stage.seek(8000);
 const pose=group.getAttribute('transform'),cameraPose=camera.getAttribute('transform');assert.notEqual(cameraPose,'translate(0 0) rotate(0) scale(1)');
 stage.seek(2000);stage.seek(8000);assert.equal(group.getAttribute('transform'),pose);assert.equal(camera.getAttribute('transform'),cameraPose);
 assert.match(leg.getAttribute('transform'),/translate\(-4 -1\)/);stage.resume();tick(500);stage.pause();const frozen=leg.getAttribute('transform');tick(1200);assert.equal(leg.getAttribute('transform'),frozen);
 stage.replay();stage.skip();assert.equal(window.getAttribute('width'),'960');assert.equal(camera.getAttribute('transform'),'translate(0 0) rotate(0) scale(1)');
 const final=group.getAttribute('transform');stage.mount(d,{});assert.equal(find('front-0').getAttribute('transform'),final);
 stage.sequence('gather');stage.setReducedMotion(true);stage.seek(2000);assert.equal(find('front-0').getAttribute('transform'),final);
});

test('clip IDs are isolated per mount and transforms write once per node per frame',async()=>{
 const {validatePack}=await import('../src/validation/game-pack.js');
 const d=validatePack(JSON.parse(fs.readFileSync(new URL('../games/motion-study/game.json',import.meta.url)))).stages[0];
 const {stage,host}=setup();stage.mount(d,{});const first=host.children[0].children[0].children[0].getAttribute('id');
 stage.mount(d,{});const second=host.children[0].children[0].children[0].getAttribute('id');assert.notEqual(first,second);
 const world=host.children[0].children.find(n=>n.dataset.layer==='world');let writes=0;const original=world.setAttribute.bind(world);world.setAttribute=(k,v)=>{if(k==='transform')writes++;original(k,v);};
 stage.sequence('gather');writes=0;stage.seek(6000);assert.equal(writes,1);stage.seek(6000);assert.equal(writes,1);
});
