import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {composePack} from '../src/visual/compose.js';
import {validateStage,createStage} from '../src/visual/stage.js';
const dog=JSON.parse(fs.readFileSync(new URL('../prototypes/rig-study/assets/dog.json',import.meta.url)));
const act={metrics:[],resources:[],relations:[]};
function raw(n=1,symbol=dog){return {symbols:[structuredClone(symbol)],stages:[{id:'test',label:'Rig test',duration:1000,layers:[],components:Array.from({length:n},(_,i)=>({id:'actor-'+i,symbol:symbol.id})),sequences:[{id:'walk',caption:'Walk',rigs:Array.from({length:n},(_,i)=>({target:'actor-'+i,motion:'walk',at:i*10}))}]}]};}
test('24 detailed figures compile within existing budget, share clips and preserve parentage',()=>{
 const stage=composePack(raw(24)).stages[0];validateStage(stage,act);assert.equal(stage.sequences[0].tracks.length,168);assert.equal(stage.layers.find(l=>l.id==='actor-0-joint-ear').parent,'actor-0-joint-neck');assert.equal(stage.layers.find(l=>l.id==='actor-23-joint-ear').parent,'actor-23-joint-neck');assert.deepEqual(composePack(raw()),composePack(raw()));
});
test('poses outside declared limits, bad origins and unresolved actions are rejected',()=>{
 for(const change of [s=>s.rig.poses.attention['joint-neck']=200,s=>s.layers.find(l=>l.id==='joint-ear').origin=null,s=>s.rig.motions.walk.frames[1].pose='missing',s=>s.rig.poses.rest['joint-ear']=NaN]){const s=structuredClone(dog);change(s);assert.throws(()=>composePack(raw(1,s)));}
 const r=raw();r.stages[0].sequences[0].rigs[0].target='missing';assert.throws(()=>composePack(r));
});
test('rig clips still obey binding ownership, static final poses and overlap rules',()=>{
 for(const mutate of [r=>r.stages[0].sequences[0].rigs.push({target:'actor-0',motion:'attention'}),r=>r.symbols[0].rig.motions.walk.frames.at(-1).pose='attention',r=>r.stages[0].bindings=[{layer:'actor-0-joint-neck',attribute:'rotate',kind:'metric',id:'tension'}]]){const r=raw();mutate(r);assert.throws(()=>validateStage(composePack(r).stages[0],{...act,metrics:[{id:'tension'}]}));}
});
test('same authoring works for a mechanical hinge, without animal-specific code',()=>{
 const machine={id:'machine',layers:[{id:'hinge',tag:'g',origin:[0,0]},{id:'bar',parent:'hinge',tag:'rect',attrs:{width:30,height:4,fill:'#000'}}],rig:{joints:{hinge:[0,90]},poses:{rest:{hinge:0},up:{hinge:90}},motions:{walk:{duration:1000,frames:[{offset:0,pose:'rest'},{offset:.5,pose:'up'},{offset:1,pose:'rest'}]}}}};validateStage(composePack(raw(2,machine)).stages[0],act);
});
class Node{constructor(){this.attrs={};this.dataset={};this.children=[];}setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}append(n){this.children.push(n);}replaceChildren(){this.children=[];}}
function descendants(n){return [n,...n.children.flatMap(descendants)];}
test('texture IDs are mount-scoped, definitions shared, toggle does not change pose or clock',()=>{
 globalThis.document={createElementNS:()=>new Node()};const a=new Node(),b=new Node(),frames=new Map();let i=0;
 const opts={raf:cb=>{frames.set(++i,cb);return i;},caf:id=>frames.delete(id),now:()=>0};
 const s=createStage(a,opts),other=createStage(b,opts),d=composePack(raw(2)).stages[0];validateStage(d,act);s.mount(d,{});other.mount(d,{});
 const nodes=descendants(a),filters=nodes.filter(n=>n.attrs.id?.includes('texture'));assert.equal(filters.length,1);assert.notEqual(filters[0].attrs.id,descendants(b).find(n=>n.attrs.id?.includes('texture')).attrs.id);
 s.sequence('walk');s.seek(600);const transforms=nodes.map(n=>n.attrs.transform);s.setTexturesEnabled(false);assert(nodes.every(n=>!n.attrs.filter));assert.deepEqual(nodes.map(n=>n.attrs.transform),transforms);assert.equal(s.paused,true);s.setTexturesEnabled(true);assert.equal(nodes.filter(n=>n.attrs.filter).length,2);s.destroy();assert.equal(frames.size,0);
});
test('texture contract rejects external graphs, excessive octaves and missing bounds',()=>{
 for(const change of [t=>t.type='url(https://x)',t=>t.octaves=9,t=>delete t.bounds,t=>t.scale=Infinity,t=>t.href='https://x']){const d=composePack(raw()).stages[0];change(d.layers.find(l=>l.texture).texture);assert.throws(()=>validateStage(d,act));}
});
test('SVG preparation preserves geometry and is deterministic; unsafe input fails',()=>{
 const output=execFileSync('python3',['-c',String.raw`
import importlib.util,json,pathlib
s=importlib.util.spec_from_file_location('prepare','scripts/prepare-svg.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
p=pathlib.Path('prototypes/rig-study/assets');source=(p/'dog-source.svg').read_text();recipe=json.loads((p/'dog-recipe.json').read_text())
a,svg,report=m.prepare(source,recipe);assert a==m.prepare(source,recipe)[0]
expected=json.loads((p/'dog.json').read_text());assert a==expected
root=m.ET.fromstring(source)
original=[n.get('d') for n in root.iter() if m.tag(n)=='path']
assert original==[l['attrs']['d'] for l in a['layers'] if l['tag']=='path']
for bad in ['<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>','<svg xmlns="http://www.w3.org/2000/svg"><path id="x" onclick="bad()" d="M0 0"/></svg>']:
 try:m.prepare(bad,{'id':'test'})
 except ValueError:pass
 else:raise AssertionError('Unsafe input accepted')
print('preserved')
`],{encoding:'utf8'});assert.match(output,/preserved/);
});
