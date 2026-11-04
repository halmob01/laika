// Rigenera docs/laika/CANONE.md da games/laika/canone.json (la struttura del percorso che fa fede).
// Uso: npm run canone. Con --check non scrive e fallisce se il file non è aggiornato (lo usa il test).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function canoneMarkdown(c){
 const r=[];
 r.push('# LAIKA — Canone del percorso','');
 r.push('**File generato da `games/laika/canone.json` con `npm run canone`: non si modifica a mano.** Il canone fa fede su ogni altro documento: numeri, titoli e periodi degli atti e delle unità, gioco di ogni unità, stato. Si cambia solo con una decisione del docente registrata in [DECISIONI](DECISIONI.md).','');
 r.push('Stati di un\'unità: '+Object.entries(c.stati).map(([k,v])=>'**'+k+'** ('+v+')').join('; ')+'.','');
 r.push('| Atto | Titolo | Periodo | Unità | Schede |','|---|---|---|---:|---|');
 for(const a of c.atti)r.push('| '+a.numero+' | '+a.titolo+' | '+a.periodo+' | '+a.unita.length+' | ['+path.basename(a.schede)+'](atti/'+path.basename(a.schede)+') |');
 for(const a of c.atti){
  r.push('','## Atto '+a.numero+' — '+a.titolo+' ('+a.periodo+')','',a.domanda+(a.decisione?' Struttura decisa in '+a.decisione+'.':''),'');
  r.push('| Unità | Nome stabile | Titolo | Periodo | Gioco | Gioco deciso | Stato |','|---|---|---|---|---|---|---|');
  for(const u of a.unita){
   const gioco=u.scheda_gioco?'['+u.gioco+']('+path.relative('docs/laika',u.scheda_gioco)+')':u.gioco;
   r.push('| '+u.numero+' | `'+u.id+'` | '+u.titolo+' | '+u.periodo+' | '+gioco+' | '+u.stato_gioco+' | '+u.stato+(u.approvata?' ('+u.approvata+')':'')+' |');
  }
  const note=a.unita.filter(u=>u.nota);if(note.length){r.push('');for(const u of note)r.push('- '+u.numero+': '+u.nota);}
 }
 return r.join('\n')+'\n';
}
const isMain=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(isMain){
 const c=JSON.parse(fs.readFileSync(path.join(root,'games/laika/canone.json'),'utf8'));
 const out=path.join(root,'docs/laika/CANONE.md'),md=canoneMarkdown(c);
 if(process.argv.includes('--check')){if(!fs.existsSync(out)||fs.readFileSync(out,'utf8')!==md){console.error('docs/laika/CANONE.md non aggiornato: npm run canone');process.exit(1);}console.log('CANONE.md aggiornato');}
 else{fs.writeFileSync(out,md);console.log('docs/laika/CANONE.md rigenerato');}
}
