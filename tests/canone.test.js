// Il canone (games/laika/canone.json) è la sola fonte della struttura di LAIKA: questo test controlla che
// i documenti lo seguano (CANONE.md generato, schede degli atti, collegamenti, niente riquadri sopra testo vecchio).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {canoneMarkdown} from '../scripts/canone.js';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const canone=JSON.parse(read('games/laika/canone.json'));
const attivi=()=>{const out=[];const walk=d=>{for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const p=path.join(d,e.name);
 if(e.isDirectory()){if(!['node_modules','.git','archivio','references','.agents','dist','.artifacts'].includes(e.name))walk(p);}else if(e.name.endsWith('.md'))out.push(p);}};walk('.');return out;};

test('canone: struttura ben formata e nomi stabili unici',()=>{
 const ids=new Set(),numeri=new Set();
 for(const a of canone.atti){assert.ok(a.titolo&&a.periodo&&a.domanda&&a.schede,'atto incompleto: '+a.numero);
  a.unita.forEach((u,i)=>{assert.match(u.id,/^[a-z0-9-]+$/,'nome stabile non valido: '+u.id);assert.ok(!ids.has(u.id),'nome stabile ripetuto: '+u.id);ids.add(u.id);
   assert.equal(u.numero,a.numero+'.'+(i+1),'numero fuori ordine: '+u.numero);assert.ok(!numeri.has(u.numero));numeri.add(u.numero);
   assert.ok(Object.hasOwn(canone.stati,u.stato),'stato sconosciuto: '+u.stato);if(u.stato==='approvata')assert.match(u.approvata||'',/^\d{4}-\d\d-\d\d$/,'unità approvata senza data: '+u.id);
   if(u.scheda_gioco)assert.ok(fs.existsSync(path.join(root,u.scheda_gioco)),'scheda di gioco mancante: '+u.scheda_gioco);});}
});

test('canone: docs/laika/CANONE.md è aggiornato (npm run canone)',()=>{
 assert.equal(read('docs/laika/CANONE.md'),canoneMarkdown(canone));
});

test('canone: le schede degli atti hanno le stesse unità, con numero, titolo e nome stabile',()=>{
 for(const a of canone.atti){const t=read(a.schede);
  const heads=[...t.matchAll(/^## ([IVX]+\.\d+) — (.+) · `([a-z0-9-]+)`$/gm)].map(m=>({numero:m[1],titolo:m[2],id:m[3]}));
  assert.deepEqual(heads.map(h=>h.numero+' '+h.id),a.unita.map(u=>u.numero+' '+u.id),'unità di '+a.schede);
  heads.forEach((h,i)=>assert.ok(h.titolo.startsWith(a.unita[i].titolo),'titolo di '+h.numero+' diverso dal canone'));
  assert.match(t.split('\n')[0],new RegExp('^# Atto '+a.numero+' — '),'intestazione di '+a.schede);}
});

test('documenti: nessun riquadro «Aggiornamento» sopra testo vecchio',()=>{
 for(const f of attivi())assert.doesNotMatch(read(f),/^> \*\*Aggiornamento/m,f);
});

test('documenti: i collegamenti relativi portano a file che esistono',()=>{
 const rotti=[];
 for(const f of attivi())for(const m of read(f).matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)){const u=m[1];if(/^[a-z]+:/.test(u))continue;
  if(!fs.existsSync(path.join(root,path.dirname(f),decodeURIComponent(u))))rotti.push(f+' -> '+u);}
 assert.deepEqual(rotti,[]);
});

test('decisioni: le decisioni citate dal canone esistono',()=>{
 const d=read('docs/laika/DECISIONI.md');
 for(const a of canone.atti)if(a.decisione)assert.match(d,new RegExp('\\*\\*'+a.decisione+' ·'),a.decisione);
});

test('home: un fascicolo per atto del canone, con numero, titolo e periodo; gli atti costruiti si aprono',()=>{
 const h=read('index.html'),voci=[...h.matchAll(/<li class="voce-registro[^"]*" data-atto="([^"]+)">([\s\S]*?)<\/li>/g)];
 assert.deepEqual(voci.map(v=>v[1]),canone.atti.map(a=>a.id));
 voci.forEach((v,i)=>{const a=canone.atti[i],t=v[2].replace(/&amp;/g,'&');
  assert.ok(t.includes('Atto '+a.numero+' · '+a.periodo),'periodo del fascicolo '+a.id);assert.ok(t.includes('>'+a.titolo+'<'),'titolo del fascicolo '+a.id);
  const aperto=a.unita.some(u=>u.stato!=='da fare');assert.equal(t.includes('play.html?game=laika&atto='+a.id),aperto,'collegamento del fascicolo '+a.id);});
 assert.match(h,new RegExp('diviso in '+['uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci'][canone.atti.length-1]+' atti'));
});
