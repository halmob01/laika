// Piano degli incarichi fino al 1917: docs/laika/piano-1917.json.
//   npm run piano            rigenera docs/laika/PIANO-1917.md
//   npm run piano -- --check fallisce se PIANO-1917.md non è aggiornato (lo usa il test)
//   npm run prossimo         stampa il prossimo incarico con il messaggio da dare all'agente
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const leggiPiano=()=>JSON.parse(fs.readFileSync(path.join(root,'docs/laika/piano-1917.json'),'utf8'));
// Il prossimo incarico: il primo «da fare» le cui dipendenze sono tutte «fatto».
export function prossimo(piano){
 const stato=Object.fromEntries(piano.incarichi.map(i=>[i.id,i.stato]));
 return piano.incarichi.find(i=>i.stato==='in corso')||piano.incarichi.find(i=>i.stato==='da fare'&&i.dipende.every(d=>stato[d]==='fatto'))||null;
}
export function messaggio(i){
 if(i.tipo==='controllo')return 'Leggi AGENTS.md. Prepara il controllo del docente «'+i.titolo+'» ('+i.id+') di docs/laika/piano-1917.json: '+i.fare.join(' ')+' Segna l\'incarico «aspetta il docente» con npm run piano e passa al prossimo (npm run prossimo).';
 return ['Leggi AGENTS.md e docs/laika/METODO.md §7. Esegui l\'incarico '+i.id+' «'+i.titolo+'» di docs/laika/piano-1917.json, e solo quello.',
  'Da leggere: '+i.leggere.join(', ')+'.',
  'Da fare: '+i.fare.join(' '),
  'È fatto quando: '+i.fatto_quando.join('; ')+'.',
  'Segna l\'incarico «in corso» all\'inizio e «fatto» alla fine con PR ed evidenze (npm run piano). Se incontri una delle condizioni di arresto di METODO §7, fermati e scrivi al docente che cosa serve.'].join('\n');
}
export function pianoMarkdown(p){
 const r=['# LAIKA — Piano fino al 1917','','**File generato da `docs/laika/piano-1917.json` con `npm run piano`: non si modifica a mano.** '+p._leggimi,'','Come si lavora in autonomia, controlli e condizioni di arresto: [METODO](METODO.md) §7. Il prossimo incarico e il messaggio da dare all\'agente: `npm run prossimo`.',''];
 const n=p.incarichi.filter(i=>i.stato==='fatto').length;
 r.push('Incarichi fatti: '+n+' su '+p.incarichi.length+'. Prossimo: '+(prossimo(p)?.id||'nessuno')+'.','','| # | Incarico | Tipo | Modello | Dopo | Stato |','|---:|---|---|---|---|---|');
 p.incarichi.forEach((i,k)=>r.push('| '+(k+1)+' | **'+i.id+'** '+i.titolo+' | '+i.tipo+' | '+i.modello+' | '+(i.dipende.join(', ')||'—')+' | '+i.stato+(i.pr?' (PR #'+i.pr+')':'')+' |'));
 for(const i of p.incarichi){
  r.push('','## '+i.id+' — '+i.titolo,'');
  if(i.unita.length)r.push('Unità del canone: '+i.unita.map(u=>'`'+u+'`').join(', ')+'.','');
  for(const f of i.fare)r.push('- '+f);
  r.push('','È fatto quando: '+i.fatto_quando.join('; ')+'.');
  if(i.evidenze)r.push('','Evidenze: '+i.evidenze.join(', ')+'.');
 }
 return r.join('\n')+'\n';
}
const isMain=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(isMain){
 const p=leggiPiano(),out=path.join(root,'docs/laika/PIANO-1917.md'),md=pianoMarkdown(p);
 if(process.argv.includes('--prossimo')){const i=prossimo(p);console.log(i?messaggio(i):'Nessun incarico disponibile: o è tutto fatto o si aspetta il docente.');}
 else if(process.argv.includes('--check')){if(!fs.existsSync(out)||fs.readFileSync(out,'utf8')!==md){console.error('docs/laika/PIANO-1917.md non aggiornato: npm run piano');process.exit(1);}console.log('PIANO-1917.md aggiornato');}
 else{fs.writeFileSync(out,md);console.log('docs/laika/PIANO-1917.md rigenerato');}
}
