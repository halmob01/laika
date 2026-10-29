// Pagine di passaggio di un corso a unità: pagina dell'atto, pagina dell'unità, chiusura. Nessun dato di un gioco specifico.
import {el,button} from '../interactions/index.js';
import {unitStates,unitStarted,unitLabel,actName,actNumber} from '../core/units.js';
const STATUS={done:'Finita',current:'In corso',later:'Più avanti'};
const section=(title,...nodes)=>{const box=el('section',undefined,{class:'hub-block'});box.append(el('h2',title),...nodes);return box;};
const box=(kind,text)=>{const d=el('div',undefined,{class:'hub-box'});d.append(el('p',kind,{class:'hub-box-k'}),el('p',text));return d;};
function head(act,crumb,label,title,period){
  const nodes=[el('p',crumb,{class:'hub-crumb'})];
  const h1=el('h1',undefined,{id:'hub-title',tabindex:'-1'});h1.append(el('span',label,{class:'hub-num'}),document.createTextNode(' '+title));
  nodes.push(h1,el('p',period,{class:'hub-period'}));return nodes;
}
// Pagina dell'atto: le unità in fila con il loro stato.
export function actPage(host,{act,session,actions}){
  const states=unitStates(act,session.currentAct.episodeId,session.complete),playable=states.filter(s=>s.unit.episodes.length),done=states.filter(s=>s.status==='done'&&s.unit.episodes.length).length;
  const current=states.find(s=>s.status==='current'),started=unitStarted(act,session);
  const crumbs=el('p',undefined,{class:'hub-crumb'});crumbs.append(el('a','Il percorso',{href:'./'}),document.createTextNode(' › '+actNumber(act)));
  const h1=el('h1',undefined,{id:'hub-title',tabindex:'-1'});h1.append(el('span',actNumber(act),{class:'hub-num'}),document.createTextNode(' · '+actName(act)));
  host.replaceChildren(crumbs,h1);
  if(act.period)host.append(el('p',act.period,{class:'hub-period'}));
  if(act.question)host.append(el('p',act.question,{class:'hub-question'}));
  const bar=el('div',undefined,{class:'hub-progress',role:'img','aria-label':done+' unità finite su '+playable.length});
  for(const s of states)bar.append(el('i',undefined,{class:s.status}));
  host.append(bar,el('p',done+(done===1?' unità finita su ':' unità finite su ')+states.length,{class:'hub-count'}));
  if(current)host.append(button((started?'Riprendi':'Inizia')+' · '+unitLabel(act,current.index)+' '+current.unit.title,actions.go,{class:'primary hub-cta','data-hub':'go'}));
  else host.append(button('Vedi il riepilogo',actions.go,{class:'primary hub-cta','data-hub':'go'}));
  const list=el('ol',undefined,{class:'hub-units'});
  for(const s of states){
    const li=el('li',undefined,{class:'hub-unit '+s.status,'data-unit':s.unit.id}),body=el('div');
    body.append(el('h3',s.unit.title),el('p',s.unit.period,{class:'hub-period'}),el('p',s.unit.summary),el('span',STATUS[s.status],{class:'hub-stamp'}));
    li.append(el('span',unitLabel(act,s.index),{class:'hub-n','aria-hidden':'true'}),body);list.append(li);
  }
  host.append(list);
}
// Pagina dell'unità: domanda, gioco, concetti e che cosa si porta dall'unità precedente.
export function unitPage(host,{act,session,index,actions}){
  const u=act.units[index],started=unitStarted(act,session)&&act.units[index].episodes.includes(session.currentAct.episodeId);
  host.replaceChildren(...head(act,actNumber(act)+' › '+unitLabel(act,index),unitLabel(act,index),u.title,u.period));
  host.append(el('p',u.question,{class:'hub-question'}),section('Dove siamo',el('p',u.summary)),section('Che cosa farai',box('Il gioco',u.game)));
  if(u.concepts.length){const chips=el('p',undefined,{class:'hub-chips'});for(const c of u.concepts)chips.append(el('span',c,{class:'hub-chip'}));host.append(section('Che cosa incontrerai',chips));}
  if(u.carries)host.append(section('Da prima porti con te',el('p',u.carries,{class:'hub-note'})));
  host.append(button((started?'Riprendi':'Inizia')+' · '+unitLabel(act,index),actions.go,{class:'primary hub-cta','data-hub':'go'}),button('Torna all\'atto',actions.back,{class:'hub-back','data-hub':'back'}));
}
// Chiusura dell'unità: che cosa è successo davvero e che cosa viene dopo.
export function closingPage(host,{act,index,nextIndex,complete,actions}){
  const u=act.units[index],next=nextIndex!==null&&nextIndex!==undefined?act.units[nextIndex]:null;
  host.replaceChildren(el('p',actNumber(act)+' › '+unitLabel(act,index),{class:'hub-crumb'}),el('span','Unità conclusa',{class:'hub-seal'}),...head(act,'',unitLabel(act,index),u.title,u.period).slice(1));
  const pair=el('div',undefined,{class:'hub-pair'});pair.append(box('Fatto documentato',u.closing.fact),box('Simulazione',u.closing.simulation));
  host.append(section('Che cosa hai fatto',el('p',u.closing.did)),section('Che cosa accadde davvero',pair));
  if(next&&next.episodes.length)host.append(section('Che cosa viene dopo',box(unitLabel(act,nextIndex)+' · '+next.title,next.summary)));
  host.append(button(next&&next.episodes.length&&!complete?'Passa a '+unitLabel(act,nextIndex)+' · '+next.title:'Continua',actions.go,{class:'primary hub-cta','data-hub':'go'}),button('Torna all\'atto',actions.back,{class:'hub-back','data-hub':'back'}));
}
