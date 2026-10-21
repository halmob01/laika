'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../../src/core/legacy.cjs');
const stories = require('./storie.cjs');

function seekDecision(story, state) {
  while (state.phase === 'scene' && engine.currentScene(story,state).type === 'narrative') state=engine.advance(story,state);
  return state;
}
function completeStory(story, selection=0) {
  let s=engine.newSession(story), guard=0;
  while(s.phase!=='end' && ++guard<100) {
    const scene=engine.currentScene(story,s);
    if(s.phase==='outcome'||scene.type==='narrative') s=engine.advance(story,s);
    else s=engine.select(story,s,scene.choices[Math.min(selection,scene.choices.length-1)].id);
  }
  assert.ok(guard<100,'nessun loop infinito');
  return s;
}

test('le due storie utilizzano il medesimo schema, senza regole medievali',()=>{
  assert.equal(engine.validateStory(stories.ettore),stories.ettore);
  assert.equal(engine.validateStory(stories.achille),stories.achille);
  assert.deepEqual(Object.keys(engine.newSession(stories.ettore).values),['difesa','provviste','fiducia']);
  assert.deepEqual(Object.keys(engine.newSession(stories.achille).values),['esercito','onore','rischio']);
});
test('le card narrative non consentono scelte',()=>{
  const state=engine.newSession(stories.ettore);
  assert.throws(()=>engine.select(stories.ettore,state,'famiglie'));
  assert.equal(engine.advance(stories.ettore,state).index,1);
});
test('non si possono saltare decisioni non risolte',()=>{
  const s=seekDecision(stories.ettore,engine.newSession(stories.ettore));
  assert.equal(engine.currentScene(stories.ettore,s).id,'pane');
  assert.throws(()=>engine.advance(stories.ettore,s));
});
test('il turno applica effetti della scelta + costo dell’assedio, senza mutare lo stato originale',()=>{
  const s=seekDecision(stories.ettore,engine.newSession(stories.ettore));
  const next=engine.select(stories.ettore,s,'famiglie');
  assert.deepEqual({...s.values},{difesa:65,provviste:60,fiducia:60});
  assert.deepEqual({...next.values},{difesa:62,provviste:41,fiducia:72});
  assert.deepEqual(next.last.changes.map(c=>[c.id,c.delta]),[['difesa',-3],['provviste',-19],['fiducia',12]]);
  assert.equal(next.phase,'outcome');
});
test('l’esito può essere mostrato una sola volta e non consente una seconda scelta',()=>{
  const s=seekDecision(stories.ettore,engine.newSession(stories.ettore));
  const n=engine.select(stories.ettore,s,'famiglie');
  assert.throws(()=>engine.select(stories.ettore,n,'soldati'));
  assert.equal(engine.advance(stories.ettore,n).index,6);
});
test('il riepilogo non tratta le barre come punteggi',()=>{
  const n=completeStory(stories.ettore);
  assert.equal(n.phase,'end');
  assert.equal(n.decisions.length,4);
  const recap=engine.recap(stories.ettore,n);
  assert.equal(recap.values.length,3);
  assert.ok(recap.insight.includes('Ettore'));
  assert.equal(recap.score,undefined);
});
test('la storia di Achille si conclude senza dipendere da Troia o dal feudo',()=>{
  const n=completeStory(stories.achille);
  assert.equal(n.phase,'end');
  assert.equal(n.decisions.length,2);
  assert.equal(engine.currentScene(stories.achille,n),null);
});
test('un salvataggio in fase di decisione o di conseguenza si ripristina',()=>{
  let s=seekDecision(stories.ettore,engine.newSession(stories.ettore));
  assert.equal(engine.restore(stories.ettore,JSON.stringify(s)).phase,'scene');
  s=engine.select(stories.ettore,s,'soldati');
  const back=engine.restore(stories.ettore,JSON.stringify(s));
  assert.ok(back);
  assert.equal(back.phase,'outcome');
  assert.deepEqual({...back.values},{...s.values});
});
test('salvataggi vecchi, alterati o di un altro episodio vengono scartati',()=>{
  let s=seekDecision(stories.ettore,engine.newSession(stories.ettore));
  assert.equal(engine.restore(stories.achille,s),null);
  assert.equal(engine.restore(stories.ettore,'not json'),null);
  assert.equal(engine.restore(stories.ettore,{...s,version:999}),null);
  const n=engine.select(stories.ettore,s,'famiglie');
  assert.equal(engine.restore(stories.ettore,{...n,values:{...n.values,fiducia:99}}),null);
  assert.equal(engine.restore(stories.ettore,{...n,decisions:[]}),null);
});
test('gli indicatori sono limitati fra zero e cento con delta reali',()=>{
  const example={id:'prova',title:'Prova',stats:[{id:'a',label:'A',start:99},{id:'b',label:'B',start:1}],
    scenes:[{id:'s',title:'Scena',text:'Test',type:'decision',choices:[
      {id:'c',label:'Prima',feedback:'Esito',why:'Motivo',effects:{a:30,b:-30}},
      {id:'d',label:'Seconda',feedback:'Altro',why:'Motivo',effects:{a:-10,b:10}}
    ]}]};
  const result=engine.select(example,engine.newSession(example),'c');
  assert.equal(result.values.a,100);assert.equal(result.values.b,0);
  assert.deepEqual(result.last.changes.map(x=>x.delta),[1,-1]);
});
test('i contenuti errati sono rifiutati prima di giocare',()=>{
  const s=structuredClone(stories.ettore);
  s.scenes[5].choices[0].effects={granaio:10};
  assert.throws(()=>engine.validateStory(s));
  const bad=structuredClone(stories.ettore);
  bad.stats[0].id='__proto__';
  assert.throws(()=>engine.validateStory(bad));
});
