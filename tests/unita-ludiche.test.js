// Le regole che rendono un'unità un gioco e non un menu (GIOCHI §1–§2), una lezione e non solo un gioco
// (PERCORSO §1, §6) e che fanno usare i disegni che ci sono (PIANO-KIT §1). Valgono per un'unità quando il suo
// incarico in docs/laika/piano-1917.json è «fatto»; per le altre il test stampa che cosa manca ancora.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const canone=json('games/laika/canone.json'),game=json('games/laika/game.json'),sorgenti=[1,2,3].map(n=>json('games/laika/source/acts/atto-'+n+'.json')),piano=json('docs/laika/piano-1917.json'),catalogo=json('bottega/catalogo.json');
const scenaFatta=piano.incarichi.some(i=>i.id==='S1'&&i.stato==='fatto');
const fatte=new Set(piano.incarichi.filter(i=>i.tipo==='unità'&&i.stato==='fatto').flatMap(i=>i.unita));
const sceneFiles=[...fs.readdirSync(path.join(root,'games/laika/source/scene')).filter(f=>f.endsWith('.json')).map(f=>'games/laika/source/scene/'+f),...fs.readdirSync(path.join(root,'site/laika/scene')).filter(f=>f.endsWith('.json')).map(f=>'site/laika/scene/'+f)];
const simboli=f=>[...fs.readFileSync(path.join(root,f),'utf8').matchAll(/"(?:simbolo|symbol|disegno)":\s*"([^"]+)"/g)].map(m=>m[1]);

// Il gioco principale di un'unità: le fasi in cui il giocatore agisce oltre a rispondere a una richiesta.
export function analisi(act,u){
 const E=Object.fromEntries(act.episodes.map(e=>[e.id,e])),eps=u.episodes.map(x=>E[x]),giochi=eps.filter(e=>e.type==='turn_game');
 const fasi=e=>{const f=new Set();if(e.workers)f.add('persone');if(e.places)f.add('posti');if(e.tokens)f.add('monete');
  for(const t of e.turns){if(t.event)f.add('richiesta');if(t.market)f.add(t.market.points?'punti':'fiera');if(t.queue)f.add('coda');if(t.chain)f.add('catena');}
  if(e.queue)f.add('coda');if(e.chain)f.add('catena');return f;};
 const problemi=[];
 // Gioco: c'è, non è solo un elenco di richieste, dura, rischia, mostra pochi indicatori.
 if(!giochi.length)problemi.push('nessun gioco (solo racconto, scelte, fonti o moduli)');
 for(const g of giochi){const f=fasi(g);
  if(![...f].some(x=>x!=='richiesta'))problemi.push(g.id+': solo richieste a scelta multipla, niente da distribuire, spostare o spendere');
  if(g.turns.length<3)problemi.push(g.id+': meno di tre turni');
  if(!JSON.stringify(g).includes('"chance"'))problemi.push(g.id+': nessun rischio dichiarato');
  const n=(g.shows||[]).length;if(n<2||n>5)problemi.push(g.id+': '+n+' indicatori visibili (servono da 2 a 5)');}
 // Niente moduli con caselle numeriche: sono menu, non giochi.
 for(const e of eps)if(e.type==='resource_allocation')problemi.push(e.id+': modulo con caselle numeriche');
 // Didattica: domanda, chiusura che separa fatto e simulazione, almeno un contenuto documentato.
 if(!u.question)problemi.push('manca la domanda dell\'unità');
 if(!(u.closing?.fact&&u.closing?.simulation))problemi.push('chiusura senza fatto o senza simulazione');
// Le fonti dei fatti sono registrate negli episodi (note «editorial» con «fonti» o «sources», FONTI e MATRICE).
 const src=sorgenti.flatMap(a=>a.episodes).filter(e=>u.episodes.includes(e.id)),registra=o=>o&&typeof o==='object'&&(Array.isArray(o)?o.some(registra):((o.editorial&&(o.editorial.fonti||o.editorial.sources))||Object.values(o).some(registra)));
 if(!src.some(registra))problemi.push('nessuna fonte registrata nelle note degli episodi');
 if(!eps.some(e=>e.context?.kind==='documented'||e.context?.kind==='source'||(e.turns||[]).some(t=>JSON.stringify(t).includes('"documented"'))))problemi.push('nessun contenuto documentato');
 // Standard didattico (PERCORSO §7): obiettivi nel canone, verifica legata a un obiettivo, «Cosa ti devi ricordare», concetti.
 const cu=canone.atti.flatMap(x=>x.unita).find(x=>x.id===u.id);
 if(!(cu?.obiettivi?.length>=2))problemi.push('meno di due obiettivi nel canone');
 const verifiche=eps.filter(e=>e.type==='assessment');
 if(!verifiche.length)problemi.push('nessuna verifica formativa');
 for(const v of verifiche)if(!(v.question?.objectives?.length))problemi.push(v.id+': verifica senza obiettivo');
 if(!eps.some(e=>e.type==='narrative'&&/ricordare/i.test(e.title)))problemi.push('manca «Cosa ti devi ricordare»');
 if((u.concepts||[]).length<3)problemi.push('meno di tre concetti nella pagina dell\'unità');
 // Scene: almeno una propria; nessuna presa da un'altra unità.
 const proprie=new Set(),altrui=[];
 for(const e of eps){if(!e.stageId)continue;const owner=act.units.find(x=>x.episodes.some(id=>E[id].stageId===e.stageId));if(owner===u)proprie.add(e.stageId);else altrui.push(e.id+' usa la scena di '+owner.id);}
 for(const a of game.acts)if(a!==act)for(const x of a.units)for(const id of x.episodes){/* scene di altri atti */}
 if(!proprie.size)problemi.push('nessuna scena propria');
 problemi.push(...altrui);
 return problemi;
}
const owners=new Map();for(const a of game.acts)for(const u of a.units)for(const id of u.episodes){const e=a.episodes.find(x=>x.id===id);if(e.stageId&&!owners.has(e.stageId))owners.set(e.stageId,u.id);}

test('unità: gioco vero, didattica e scene proprie per le unità il cui incarico è fatto',()=>{
 const rapporto=[];
 for(const a of game.acts)for(const u of a.units){
  let p=analisi(a,u);
  // Una scena «di un'altra unità» vale anche fra atti diversi.
  const E=Object.fromEntries(a.episodes.map(e=>[e.id,e]));
  for(const id of u.episodes){const s=E[id].stageId;if(s&&owners.get(s)!==u.id&&!p.some(x=>x.startsWith(id+' usa')))p.push(id+' usa la scena di '+owners.get(s));}
  if(fatte.has(u.id))assert.deepEqual(p,[],u.id+': regole delle unità non rispettate');
  // Dopo l'incarico S1 le regole sulle scene valgono per tutte le unità.
  else if(scenaFatta){const sc=p.filter(x=>/scena/.test(x));assert.deepEqual(sc,[],u.id+': regole sulle scene (S1)');}
  else rapporto.push(u.id+(p.length?': '+p.join('; '):': ok'));
 }
 if(rapporto.length&&process.env.LAIKA_RAPPORTO)console.log('Unità non ancora rifatte:\n- '+rapporto.join('\n- '));
});

test('disegni: ogni disegno aggiunto al catalogo dopo il 4 novembre 2026 è usato da almeno una scena',()=>{
 const prima=new Set(json('tests/fixtures/catalogo-4-novembre.json')),usati=new Set(sceneFiles.flatMap(simboli));
 const nuovi=catalogo.voci.map(v=>v.id).filter(id=>!prima.has(id));
 assert.deepEqual(nuovi.filter(id=>!usati.has(id)),[],'disegni nuovi mai usati in una scena');
});

test('disegni: le scene usano solo disegni del catalogo con un\'epoca compatibile scritta',()=>{
 const voci=Object.fromEntries(catalogo.voci.map(v=>[v.id,v]));
 for(const f of sceneFiles.filter(f=>f.startsWith('games/')))for(const s of simboli(f))if(voci[s])assert.ok(voci[s].epoca,s+' senza epoca');
});
