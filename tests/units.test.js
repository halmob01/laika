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
test('LAIKA atto I: sei unità, la terra e la città separate',()=>{
  assert.equal(act.units.length,6);
  assert.deepEqual(act.units.map(u=>unitLabel(act,act.units.indexOf(u))),['I.1','I.2','I.3','I.4','I.5','I.6']);
  assert.deepEqual(act.units[1].episodes,['a1-u2-mir']);
  assert.equal(act.units[2].episodes[0],'a1-u2-citta');
  assert.equal(actNumber(act),'Atto I');assert.equal(actName(act),'La terra e lo zar');
  assert.ok(act.units.slice(3).every(u=>!u.episodes.length),'le unità future non hanno ancora episodi');
});
test('stato delle unità dall\'episodio corrente',()=>{
  const first=unitStates(act,'a1-u1-settimana');
  assert.deepEqual(first.map(s=>s.status),['current','later','later','later','later','later']);
  const second=unitStates(act,'a1-u2-salario');
  assert.deepEqual(second.map(s=>s.status),['done','done','current','later','later','later']);
  assert.deepEqual(unitStates(act,'a1-u2-e7',true).map(s=>s.status),['done','done','done','later','later','later']);
  assert.equal(unitIndexOf(act,'a1-u2-mir'),1);assert.deepEqual(positionInUnit(act,'a1-u2-salario'),{index:2,total:7});
});
test('unità iniziata o da iniziare',()=>{
  const s=newSession(game,'seed');assert.equal(unitStarted(act,s),false);
  const next=transition(game,s,{type:'advance'}).nextState;assert.equal(unitStarted(act,next),true);
});
