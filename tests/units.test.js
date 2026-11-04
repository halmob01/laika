import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateUnits} from '../src/core/schema.js';
import {unitStates,unitIndexOf,unitLabel,actName,actNumber,positionInUnit,unitStarted} from '../src/core/units.js';
import {newSession,transition} from '../src/runner/index.js';
const game=JSON.parse(fs.readFileSync(new URL('../games/laika/game.json',import.meta.url),'utf8'));
const act=game.acts[0];
const mini=()=>({id:'a',title:'Atto I — Prova',episodes:[{id:'e1'},{id:'e2'},{id:'e3'}],units:[
  {id:'u1',title:'Uno',period:'1',question:'Q?',summary:'S',game:'G',concepts:['x'],episodes:['e1','e2'],closing:{did:'a',fact:'b',simulation:'c'}},
  {id:'u2',title:'Due',period:'2',question:'Q?',summary:'S',game:'G',concepts:[],episodes:['e3'],closing:{did:'a',fact:'b',simulation:'c'}},
  {id:'u3',title:'Tre',period:'3',question:'Q?',summary:'S',game:'G',concepts:[],episodes:[]}]});
test('unità valide: episodi contigui e unità non giocabili solo in coda',()=>{
  assert.doesNotThrow(()=>validateUnits(mini()));
  const noClosing=mini();delete noClosing.units[0].closing;assert.throws(()=>validateUnits(noClosing),/Chiusura incompleta/);
  const swapped=mini();swapped.units[0].episodes=['e2','e1'];assert.throws(()=>validateUnits(swapped),/ordine dell'atto/);
  const missing=mini();missing.units[1].episodes=[];missing.units[2].episodes=['e3'];missing.units[2].closing={did:'a',fact:'b',simulation:'c'};assert.throws(()=>validateUnits(missing),/in coda/);
  const orphan=mini();orphan.units[1].episodes=[];orphan.units[1].closing=undefined;assert.throws(()=>validateUnits(orphan),/stare in una unità/);
  const dup=mini();dup.units[1].id='u1';assert.throws(()=>validateUnits(dup),/Unità/);
});
test('LAIKA: tre atti fino al 1917 con le unità del canone e i nomi stabili',()=>{
  const canone=JSON.parse(fs.readFileSync(new URL('../games/laika/canone.json',import.meta.url),'utf8'));
  assert.deepEqual(game.acts.map(a=>actNumber(a)+' · '+actName(a)),['Atto I · La terra e lo zar','Atto II · 1905','Atto III · Pane e guerra']);
  game.acts.forEach((a,k)=>{const c=canone.atti[k];assert.deepEqual(a.units.map(u=>u.id),c.unita.map(u=>u.id));
    assert.deepEqual(a.units.map((u,i)=>unitLabel(a,i)),c.unita.map(u=>u.numero));assert.deepEqual(a.units.map(u=>u.title),c.unita.map(u=>u.titolo));
    for(const u of a.units)for(const e of u.episodes)assert.ok(e.startsWith('a'+(k+1)+'-'+u.id+'-'),'identificatore senza il nome stabile: '+e);});
  assert.deepEqual(game.acts[1].units[0].episodes,['a2-petizione-righe','a2-petizione-domenica'],'la petizione prima del corteo');
});
test('stato delle unità dall\'episodio corrente',()=>{
  const first=unitStates(act,'a1-servitu-settimana');
  assert.deepEqual(first.map(s=>s.status),['current','later','later']);
  const third=unitStates(act,'a1-citta-salario');
  assert.deepEqual(third.map(s=>s.status),['done','done','current']);
  assert.deepEqual(unitStates(act,'a1-citta-v2',true).map(s=>s.status),['done','done','done']);
  assert.equal(unitIndexOf(act,'a1-mir-assemblea'),1);assert.deepEqual(positionInUnit(act,'a1-citta-salario'),{index:2,total:7});
});
test('unità iniziata o da iniziare',()=>{
  const s=newSession(game,'seed');assert.equal(unitStarted(act,s),false);
  const next=transition(game,s,{type:'advance'}).nextState;assert.equal(unitStarted(act,next),true);
});

test('ogni unità con episodi si può aprire direttamente e il salvataggio si ripristina', async () => {
  const {exportSave,restore}=await import('../src/storage/index.js');
  for(const [k,a] of game.acts.entries())for(const u of a.units.filter(x=>x.episodes.length)){
    const s=newSession(game,'diretto',u.episodes[0]);assert.equal(s.actIndex,k,'si entra nell\'atto giusto');
    assert.equal(s.currentAct.episodeId,u.episodes[0]);assert.equal(s.startEpisodeId,u.episodes[0]);
    const r=restore(game,exportSave(game,s));assert.equal(r.ok,true);assert.equal(r.state.currentAct.episodeId,u.episodes[0]);
  }
  assert.throws(()=>newSession(game,'x','non-esiste'));
});
