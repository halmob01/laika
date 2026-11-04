// Il piano fino al 1917 (docs/laika/piano-1917.json) si rispetta: ordine fisso, dipendenze, unità del canone,
// un incarico alla volta, niente «fatto» senza PR ed evidenze.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {leggiPiano,pianoMarkdown,prossimo} from '../scripts/piano.js';
const root=path.resolve(import.meta.dirname,'..');
const piano=leggiPiano(),canone=JSON.parse(fs.readFileSync(path.join(root,'games/laika/canone.json'),'utf8'));
const unita=new Set(canone.atti.flatMap(a=>a.unita.map(u=>u.id)));

test('piano: PIANO-1917.md è aggiornato (npm run piano)',()=>{
 assert.equal(fs.readFileSync(path.join(root,'docs/laika/PIANO-1917.md'),'utf8'),pianoMarkdown(piano));
});
test('piano: identificatori unici, dipendenze solo verso incarichi precedenti, documenti e unità che esistono',()=>{
 const visti=new Set();
 for(const i of piano.incarichi){
  assert.ok(!visti.has(i.id),'incarico ripetuto: '+i.id);
  for(const d of i.dipende)assert.ok(visti.has(d),i.id+' dipende da '+d+', che non viene prima');
  for(const u of i.unita)assert.ok(unita.has(u),i.id+': unità sconosciuta '+u);
  for(const f of i.leggere)assert.ok(fs.existsSync(path.join(root,f)),i.id+': documento mancante '+f);
  assert.ok(Object.hasOwn(piano.stati,i.stato),i.id+': stato sconosciuto '+i.stato);
  assert.ok(i.fare.length&&i.fatto_quando.length,i.id+' senza lavoro o senza criterio');
  visti.add(i.id);
 }
});
test('piano: un incarico alla volta, «fatto» solo con PR, evidenze e dipendenze fatte',()=>{
 const stato=Object.fromEntries(piano.incarichi.map(i=>[i.id,i.stato]));
 assert.ok(piano.incarichi.filter(i=>i.stato==='in corso').length<=1,'più di un incarico in corso');
 for(const i of piano.incarichi){
  if(i.stato==='aspetta il docente')assert.equal(i.tipo,'controllo',i.id+': solo i controlli aspettano il docente');
  if(i.stato==='in corso'||i.stato==='fatto')for(const d of i.dipende)assert.ok(stato[d]==='fatto'||(piano.incarichi.find(x=>x.id===d).tipo==='controllo'&&stato[d]==='aspetta il docente'&&i.tipo!=='verifica'),i.id+' cominciato prima di '+d);
  if(i.stato==='fatto'&&i.tipo!=='controllo'){assert.ok(Number.isInteger(i.pr),i.id+' fatto senza PR');assert.ok(i.evidenze?.length,i.id+' fatto senza evidenze');for(const e of i.evidenze)assert.ok(fs.existsSync(path.join(root,e)),i.id+': evidenza mancante '+e);}
 }
});
test('piano: ogni unità degli Atti I–III ha il suo incarico',()=>{
 const coperte=new Set(piano.incarichi.flatMap(i=>i.tipo==='unità'?i.unita:[]));
 for(const a of canone.atti.slice(0,3))for(const u of a.unita)assert.ok(coperte.has(u.id),'unità senza incarico: '+u.id);
 assert.ok(prossimo(piano)||piano.incarichi.every(i=>i.stato!=='da fare'),'nessun incarico disponibile ma il piano non è finito');
});
