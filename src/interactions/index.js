import {available} from '../core/engine.js';
import {CONTEXT_LABELS} from '../core/schema.js';
import {optionOrder} from '../assessment/index.js';
import {chanceOf,luckOdds,shortfalls,placed,placeLabel,perToken,workersOf,targetsOf,yieldOf,committed,offerOpen,activeStage,cardAt,cardCount} from '../core/turns.js';
import {matches} from '../core/engine.js';
import {queueView} from '../core/queue.js';
import {chainView} from '../core/chain.js';
export function el(tag,text,attrs={}) {const node=document.createElement(tag);if(text!==undefined)node.textContent=text;for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);return node;}
export function button(label,handler,attrs={}) {const b=el('button',label,{type:'button',...attrs});b.addEventListener('click',handler);return b;}
const registry=new Map();
export function registerInteraction(type,render) {if(registry.has(type)||typeof render!=='function')throw new Error('Plugin non valido/già registrato');registry.set(type,render);}
export function renderInteraction(type,context) {const render=registry.get(type);if(!render)throw new Error('Interazione sconosciuta: '+type);render(context);}
function choices({host,episode,state,dispatch}) {
  for(const c of episode.choices) {
    const b=button(c.label,()=>dispatch({type:'select',choiceId:c.id}),{'data-choice':c.id});
    b.disabled=!available(c,state);if(b.disabled)b.title='Non disponibile per il ruolo o la situazione attuale';host.append(b);
  }
}
registerInteraction('narrative',()=>{});
registerInteraction('choice',choices);
registerInteraction('role_crisis',ctx=>{
  const {host,episode,act,state,dispatch}=ctx;
  const roles=el('div',undefined,{class:'roles','aria-label':'Punti di vista'});
  for(const id of episode.roles){const role=act.roles.find(r=>r.id===id);roles.append(button(role.label,()=>dispatch({type:'view_role',roleId:id}),{'aria-pressed':String(id===state.roleId),'data-role':id}));}
  host.append(roles,el('p',act.roles.find(r=>r.id===state.roleId).mandate,{class:'mandate'}));choices(ctx);
});
registerInteraction('resource_allocation',({host,episode,dispatch})=>{
  const form=el('form'),inputs={};
  const total=el('p','Disponibili: '+episode.budget,{role:'status'});
  for(const b of episode.buckets){const label=el('label',b.label);const input=el('input',undefined,{type:'number',min:'0',max:String(b.max),step:'1',value:'0',name:b.id,required:'',inputmode:'numeric'});
    inputs[b.id]=input;label.append(input);form.append(label);input.addEventListener('input',()=>{total.textContent='Distribuiti: '+Object.values(inputs).reduce((n,x)=>n+Number(x.value),0)+' / '+episode.budget;});}
  const submit=el('button','Conferma distribuzione',{type:'submit'});form.append(total,submit);
  form.addEventListener('submit',e=>{e.preventDefault();dispatch({type:'allocate',allocations:Object.fromEntries(Object.entries(inputs).map(([k,v])=>[k,Number(v.value)]))});});host.append(form);
});
registerInteraction('source_comparison',ctx=>{
  const {host,episode,state,dispatch}=ctx;
  for(const s of episode.sources){const viewed=state.viewedSources.includes(episode.id+':'+s.id);
    host.append(button(s.title+(viewed?' · letta':''),()=>dispatch({type:'inspect_source',sourceId:s.id}),{'data-source':s.id,'aria-expanded':String(viewed)}));
    if(viewed){const article=el('article',undefined,{class:'source'});article.append(el('p',s.text),el('small',s.provenance));host.append(article);}}
  if(episode.sources.every(s=>state.viewedSources.includes(episode.id+':'+s.id)))choices(ctx);
  else host.append(el('p','Apri tutte le fonti per confrontarle.'));
});
registerInteraction('assessment',({host,episode,seed,dispatch})=>{
  host.append(el('h2',episode.question.prompt));
  for(const o of optionOrder(episode.question,seed))host.append(button(o.label,()=>dispatch({type:'answer',answerId:o.id}),{'data-answer':o.id}));
});

// Partita a turni: card, piazzamento «tocca e tocca» (anche sulla scena), esito, chi bussa.
let fitObserver=null;
const sign=n=>(n>0?'+':'−')+Math.abs(n);
const metricLabel=(act,m)=>[...(act.metrics||[]),...(act.resources||[])].find(d=>d.id===m.id)?.label||m.id;
function changeList(act,changes){const ul=el('ul',undefined,{class:'turn-changes'}),hidden=new Set([...(act.metrics||[]),...(act.resources||[])].filter(d=>d.hidden).map(d=>d.id));for(const c of changes.filter(x=>!hidden.has(x.id)))ul.append(el('li',c.label+': '+c.before+' → '+c.after));return ul;}
function overlay(stageHost){stageHost?.querySelector('.turn-overlay')?.remove();fitObserver?.disconnect();fitObserver=null;
  const svg=stageHost?.querySelector('svg');if(!svg)return null;const layer=el('div',undefined,{class:'turn-overlay','aria-hidden':'true'});stageHost.append(layer);
  const fit=()=>{const a=stageHost.getBoundingClientRect(),r=svg.getBoundingClientRect();Object.assign(layer.style,{left:(r.left-a.left)+'px',top:(r.top-a.top)+'px',width:r.width+'px',height:r.height+'px'});};
  fit();if(typeof ResizeObserver==='function'){fitObserver=new ResizeObserver(fit);fitObserver.observe(stageHost);}return {layer,svg};}
const at=(node,x,y)=>{node.style.left=(x*100)+'%';node.style.top=(y*100)+'%';return node;};
function clearOverlay(stageHost){stageHost?.querySelector('.turn-overlay')?.remove();fitObserver?.disconnect();fitObserver=null;}
function hotspots(stageHost,episode,game,dispatch,state){
  // Giornata a punti: le azioni con un punto sulla scena (at) si toccano sulla scena.
  if(game.phase==='market'&&state?.phase==='scene'){const t=episode.turns[game.turn],o=overlay(stageHost);if(!o)return;
    for(const f of t.market.offers.filter(x=>x.at)){const n=game.market.bought.filter(x=>x===f.id).length,b=button((f.short||f.label)+(f.cost>1?' · '+f.cost:'')+(n&&f.repeat?' ×'+n:''),()=>dispatch({type:'turn',step:'buy',offerId:f.id}),{tabindex:'-1','data-hotspot':f.id,title:f.label});
      at(b,f.at.x,f.at.y);b.disabled=!offerOpen(episode,game,f,state);o.layer.append(b);}return;}
  const o=game.phase==='place'?overlay(stageHost):(clearOverlay(stageHost),null);if(!o)return;
  for(const p of episode.places||[]){const b=button(String(game.placement[p.id]),()=>dispatch({type:'turn',step:'place',placeId:p.id,delta:1}),{tabindex:'-1','data-hotspot':p.id,title:placeLabel(episode,game,p)});
    at(b,p.x,p.y);b.disabled=placed(game)>=game.rules.tokens;o.layer.append(b);}
}
// Gestione: la persona scelta (stato dell'interfaccia, non della partita) e le figure sulla scena.
let pick={key:'',worker:null},seenGeneration=-1;
function pickFor(episode,g){const key=episode.id+':'+g.turn;if(pick.key!==key)pick={key,worker:workersOf(episode,g).find(w=>!g.assign[w.id])?.id||null};
  if(pick.worker&&!workersOf(episode,g).some(w=>w.id===pick.worker))pick.worker=null;return pick.worker;}
function board(stageHost,stage,episode,act,state,dispatch){
  const g=state.game,onBoard=activeStage(episode,g).stageId===episode.stageId;pickFor(episode,g);
  const o=onBoard?overlay(stageHost):(clearOverlay(stageHost),null);if(!o)return;
  const targets=targetsOf(episode,g,state),placing=g.phase==='place'&&state.phase==='scene';
  for(const p of targets){const n=g.placement[p.id]||0,label=p.kind==='project'?p.label+' · '+(g.progress[p.id]||0)+'/'+p.work:placeLabel(episode,g,p);
    if(placing){const b=button((p.short||'')+(p.kind==='project'?' '+(g.progress[p.id]||0)+'/'+p.work:n?' '+n:''),()=>{if(pick.worker)dispatch({type:'turn',step:'assign',workerId:pick.worker,placeId:p.id});},{tabindex:'-1','data-hotspot':p.id,title:label,class:p.kind==='project'?'project':''});
      b.disabled=!pick.worker;o.layer.append(at(b,p.x,p.y));}
    else if(p.kind==='project'&&g.progress[p.id])o.layer.append(at(el('span',(p.short?p.short+' ':'')+(g.progress[p.id]||0)+'/'+p.work,{class:'turn-stamp work',title:label}),p.x,p.y));}
  for(const p of (episode.projects||[]).filter(x=>g.built.includes(x.id)))o.layer.append(at(el('span',p.short||p.label,{class:'turn-stamp built','data-built':p.id}),p.x,p.y));
  // Le figure delle persone vanno dove sono state mandate; chi non ha un posto resta al punto di partenza.
  if(!stage)return;const vb=(o.svg.getAttribute('viewBox')||'0 0 1 1').split(/\s+/).map(Number),groups=new Map();
  for(const w of workersOf(episode,g))if(w.figure&&g.assign[w.id]){const k=g.assign[w.id];groups.set(k,[...(groups.get(k)||[]),w]);}
  const moves=(episode.workers||[]).filter(w=>w.figure).map(w=>({layer:w.figure,translateX:null,translateY:null}));
  for(const [k,list] of groups){const p=[...episode.places,...(episode.projects||[])].find(x=>x.id===k),pt=p.stand||{x:p.x,y:p.y};
    list.forEach((w,i)=>{const m=moves.find(x=>x.layer===w.figure);m.translateX=vb[0]+vb[2]*(pt.x+(i-(list.length-1)/2)*0.055);m.translateY=vb[1]+vb[3]*pt.y;});}
  for(const w of episode.workers||[])if(w.figure&&!workersOf(episode,g).some(x=>x.id===w.id)){const m=moves.find(x=>x.layer===w.figure);m.translateX=-9999;m.translateY=null;}
  // Disegni dei lavori lunghi: il cantiere compare appena si comincia e lascia il posto all'opera finita.
  for(const p of episode.projects||[]){if(!p.scene)continue;const done=g.built.includes(p.id),begun=!done&&(g.started.includes(p.id)||g.progress[p.id]>0);
    if(p.scene.cantiere)moves.push({layer:p.scene.cantiere,opacity:begun?1:0});if(p.scene.finito)moves.push({layer:p.scene.finito,opacity:done?1:0});}
  const fresh=stage.generation!==seenGeneration;seenGeneration=stage.generation;stage.position(moves,{animate:!fresh});
}
const dots=n=>'●'.repeat(n);
// Le modifiche della coda di un'offerta, in chiaro: «Le tessili +2 pazienza».
function queueText(episode,list){const q=episode.queue;if(!q||!list?.length)return '';const word=(q.patienceLabel||'Pazienza').toLowerCase();return list.map(m=>(m.group==='*'?'Tutti':q.groups.find(x=>x.id===m.group)?.label||m.group)+' '+sign(m.patience)+' '+word).join(', ');}
function effectsText(act,list){return list.map(m=>sign(m.delta)+' '+metricLabel(act,m)).join(', ');}
// Forza in parole: «3 braccia», «1 braccio». I pallini restano solo come disegno.
const amount=(e,n)=>n+' '+(n===1&&e.strengthOne?e.strengthOne:e.strengthLabel);
// Accordo del verbo («ne manca 1 braccio», «ne mancano 2 braccia») e preposizione articolata davanti a un nome con articolo («Al salario», «Alla settimana»).
const manca=n=>n===1?'manca':'mancano';
const verso=label=>{const m=/^(il|lo|la|i|gli|le|l')\s*(.*)$/i.exec(label);const prep={il:'Al ',lo:'Allo ',la:'Alla ',i:'Ai ',gli:'Agli ',le:'Alle ',"l'":'All\''};return m?prep[m[1].toLowerCase()]+m[2]:'Alla '+label;};
// «I numeri dell'anno», «della settimana», «della giornata».
const diTurno=w=>/^[aeiou]/i.test(w)?'dell’'+w:/(a|ione)$/i.test(w)?'della '+w:'del '+w;
const one=e=>e.strengthOne||e.strengthLabel;
function managePlace(host,episode,act,state,go){
  const g=state.game,people=workersOf(episode,g),chosen=pickFor(episode,g),targets=targetsOf(episode,g,state);
  const nameOf=id=>{const t=targets.find(x=>x.id===id)||[...episode.places,...(episode.projects||[])].find(x=>x.id===id);return t?(t.kind==='project'||episode.projects?.some(p=>p.id===id)?t.label:placeLabel(episode,g,t)):'';};
  const free=people.filter(w=>!g.assign[w.id]);
  const who=chosen&&people.find(w=>w.id===chosen);
  host.append(el('p',who?'Dove mandi '+who.label.toLowerCase()+'? Tocca un posto sulla mappa o qui sotto.':free.length?'Tocca una persona, poi il posto dove la mandi.':'Tutti hanno un posto. Puoi ancora spostare chi vuoi.',{class:'turn-pool',role:'status'}));
  // 1. Le persone
  const crew=el('div',undefined,{class:'turn-workers',role:'group','aria-label':'Le persone della casa'});
  for(const w of people){const b=button('',()=>{pick.worker=w.id;go(null);},{'data-worker':w.id,'data-at':g.assign[w.id]||'','aria-pressed':String(w.id===chosen)});
    const force=el('span',undefined,{class:'turn-force'});force.append(el('i',dots(w.strength),{class:'turn-dots','aria-hidden':'true',style:'--n:'+w.strength}),document.createTextNode(' '+amount(episode,w.strength)));
    b.append(el('strong',w.label),force,el('small',g.assign[w.id]?'→ '+nameOf(g.assign[w.id]):'senza posto'));crew.append(b);}
  host.append(crew);
  // 2. I posti: una riga ciascuno, l'effetto in parole.
  const list=el('div',undefined,{class:'turn-places'});
  for(const p of targets){
    const there=people.filter(w=>g.assign[w.id]===p.id),row=button('',()=>{if(chosen)go('assign',{workerId:chosen,placeId:p.id});},{class:'turn-target'+(p.kind==='project'?' project':''),'data-target':p.id});
    row.disabled=!chosen||g.assign[chosen]===p.id;
    const req=g.rules.min[p.id],n=g.placement[p.id]||0;
    row.append(el('strong',p.kind==='project'?p.label:placeLabel(episode,g,p)));
    if(p.kind==='project'){
      const done=g.progress[p.id]||0,cost=p.cost&&!g.started.includes(p.id)?' Per cominciare: '+effectsText(act,p.cost)+'.':'';
      row.append(el('span',p.text+' Fatto: '+done+' su '+p.work+'.'+cost));
      const bar=el('span',undefined,{class:'turn-progress','aria-hidden':'true'});const fill=el('i');fill.style.width=Math.min(100,100*(done+n)/p.work)+'%';const d=el('i',undefined,{class:'done'});d.style.width=Math.min(100,100*done/p.work)+'%';bar.append(fill,d);row.append(bar);}
    else{const y=yieldOf(episode,g,p.id);row.append(el('span',effectsText(act,perToken(episode,g,p))+' per ogni '+one(episode)+(y!==1?' (oggi rende il '+Math.round(y*100)+'%)':'')+'.'));
      if(req)row.append(el('span','Il signore ne vuole '+amount(episode,req)+'.',{class:'turn-due'}));}
    row.append(el('small',there.length?there.map(w=>w.label).join(', ')+' · '+amount(episode,n):'nessuno',{class:'turn-there'}));
    if(req&&n<req)row.append(el('small','Ne '+manca(req-n)+' '+amount(episode,req-n)+'.',{class:'turn-warning'}));
    list.append(row);
  }
  host.append(list);
  // 3. La semina: la domanda, il controllo e che cosa resta.
  if(episode.reserve){const r=episode.reserve,res=(act.resources||[]).find(d=>d.id===r.from),have=state.resources[r.from],need=-[...(episode.upkeep||[]),...g.rules.upkeep].filter(m=>m.id===r.from).reduce((n,m)=>n+m.delta,0);
    const spent=committed(episode,g)[r.from]||0,left=have-spent-need,box=el('div',undefined,{class:'turn-reserve'});
    box.append(el('strong',r.label));if(r.text)box.append(el('p',r.text));
    const ctl=el('div',undefined,{class:'turn-reserve-ctl'}),minus=button('−',()=>go('reserve',{delta:-1}),{'data-reserve':'-1','aria-label':'Meno '+r.label.toLowerCase()}),plus=button('+',()=>go('reserve',{delta:1}),{'data-reserve':'1','aria-label':'Più '+r.label.toLowerCase()});
    minus.disabled=g.reserve<=0;plus.disabled=spent+r.step>have;ctl.append(minus,el('b',String(g.reserve),{'aria-label':g.reserve+' '+r.label.toLowerCase()}),plus);box.append(ctl);
    const pct=Math.round(100*yieldOf(episode,{...g,rules:{...g.rules,boost:{}}},r.places[0]));
    box.append(el('p','Hai '+have+' di '+res.label.toLowerCase()+'. Per mangiare fino al raccolto ne servono '+need+'. Dopo la semina'+(spent>g.reserve?' e i lavori':'')+(left<0?' ne mancano '+(-left)+' per arrivare al raccolto':' ne restano '+left)+'. Il campo renderà il '+pct+'% del possibile.',{role:'status'}));
    if(left<0)box.append(el('p','Non basta: il grano finirà prima del raccolto.',{class:'turn-warning'}));host.append(box);}
  // 4. Il rischio, scritto prima di scegliere.
  const risk=el('div',undefined,{class:'turn-risk'});
  risk.append(el('p',(episode.luckLabel||'Il tempo che farà')+': '+luckOdds(episode).map(l=>l.label+' '+l.p+'%').join(' · ')+'.'));
  for(const s of shortfalls(episode,g))if(episode.control)risk.append(el('p','Al signore '+manca(s.required-s.given)+' '+amount(episode,s.required-s.given)+': qualcuno se ne accorge nel '+Math.round(chanceOf(episode.control.chance,act,state)*100)+'% dei casi.',{class:'turn-warning'}));
  host.append(risk);
  // Un solo pulsante principale; se è spento, dice perché.
  const ok=button(free.length?'Manca un posto per: '+free.map(w=>w.label.toLowerCase()).join(', '):'Comincia l’anno',()=>go('confirm'),{'data-turn':'confirm',class:'primary'});ok.disabled=!!free.length;host.append(ok);
}
// Barra dei passi del turno: notizie, mossa, esito, chi bussa, mercato (solo quelli presenti quest'anno).
const PHASE_NAMES={cards:'Notizie',place:'La mossa',result:'L’esito',event:'Incontro',market:'Mercato'};
// La coda con la pazienza: chi aspetta, quanta pazienza resta, che segnale sta per arrivare e dove andrà chi se ne va.
function queuePanel(episode,g,t,state){
  const q=episode.queue;if(!q||!g.queue)return null;
  const unit=episode.turnWord||'turno',units=/a$/.test(unit)?unit.slice(0,-1)+'e':/[oe]$/.test(unit)?unit.slice(0,-1)+'i':unit,tra=n=>n+' '+(n===1?unit:units);
  const v=queueView(q,g,t,state,matches),word=(q.patienceLabel||'Pazienza'),box=el('section',undefined,{class:'turn-queue','aria-label':q.label||'La coda'}),ul=el('ul');
  box.append(el('h3',q.label||'La coda'));
  for(const x of v.groups){
    const li=el('li',undefined,{class:x.gone?'gone':''});li.append(el('b',x.label+' ('+x.size+')'));
    if(x.gone)li.append(el('small','Se ne sono andati: '+x.exit.toLowerCase()+'.'));
    else{
      const bar=el('span',undefined,{class:'turn-patience',role:'img','aria-label':word+': '+x.patience+' su '+x.max});for(let i=0;i<x.max;i++)bar.append(el('i',undefined,{class:i<x.patience?'on':''}));
      li.append(bar,el('small',word+' '+x.patience+' su '+x.max+(x.turnsToLeave!=null?'. Di questo passo se ne vanno tra '+tra(x.turnsToLeave)+' ('+x.exit.toLowerCase()+').':'.')));
      if(x.next)li.append(el('small','Prossimo segnale: '+x.next.label+(x.turnsToSignal!=null?', tra '+tra(x.turnsToSignal):'')+'.'));
    }
    ul.append(li);
  }
  box.append(ul,el('p','Ogni '+unit+' la '+word.toLowerCase()+' scende di '+v.drain.total+(v.drain.factors.length?' ('+v.drain.factors.map(f=>f.label.toLowerCase()).join(', ')+')':'')+'.',{class:'turn-queue-drain'}));
  const last=g.queue.last;
  if(last&&last.turn===g.turn-1&&(last.events.length||(last.crises||[]).length)){const note=el('div',undefined,{class:'outcome',role:'status'});for(const e of last.events)note.append(el('p',e.text));for(const c of last.crises||[])note.append(el('p',c.text));box.append(note);}
  return box;
}
// Le merci che camminano: anelli con scorta e capacità di adesso, inceppi, e i due numeri (carta e realtà).
function chainPanel(episode,g){
  const c=episode.chain;if(!c||!g.chain)return null;
  const v=chainView(c,g),goods=(c.goodsLabel||'merce'),box=el('section',undefined,{class:'turn-chain','aria-label':c.label||'La catena'}),ul=el('ul');
  box.append(el('h3',c.label||'La catena'));
  for(const l of v.links){
    const li=el('li',undefined,{class:l.jammed?'jam':''});li.append(el('b',l.label));
    li.append(el('small',l.last?'Arrivato: '+l.stock+'.':'In magazzino: '+l.stock+'. Passano '+l.capacity+' per turno'+(l.jammed?': inceppato, '+l.jamText:'')+'.'));
    ul.append(li);
  }
  box.append(ul,el('p','Sulla carta: '+v.paper+'. In realtà (arrivato): '+v.real+'. Scarto: '+v.gap+'.',{class:'turn-chain-numbers'}));
  const last=v.last;
  if(last&&last.turn===g.turn-1){const note=el('div',undefined,{class:'outcome',role:'status'});note.append(el('p','Arrivati questo turno: '+last.delivered+' ('+goods+').'));for(const id of last.newlyJammed||[]){const l=c.links.find(x=>x.id===id);note.append(el('p',l.label+': '+(l.jamText||'si è inceppato').replace(/\.$/,'')+'.'));}box.append(note);}
  return box;
}
// Le modifiche della catena di un'offerta, in chiaro: «I treni +2 passano per turno», «Carta +10».
function chainText(episode,list){const c=episode.chain;if(!c||!list?.length)return '';return list.map(m=>m.paper!==undefined?'Carta '+sign(m.paper):(c.links.find(x=>x.id===m.link)?.label||m.link)+' '+sign(m.capacity??m.stock)+(m.capacity!==undefined?' per turno':' in magazzino')).join(', ');}
function stepper(episode,g){
  const t=episode.turns[g.turn],now=g.phase==='eventResult'?'event':g.phase;
  const list=['cards','place','result','event','market'].filter(k=>k==='cards'?cardCount(episode,g)>0:k==='event'?!!t.event:k==='market'?!!t.market:!!episode.places);
  const nav=el('ol',undefined,{class:'turn-steps-bar','aria-label':'Passi dell’anno'}),at=list.indexOf(now);
  list.forEach((k,i)=>{const li=el('li',(episode.phaseLabels||{})[k]||PHASE_NAMES[k],{class:i<at?'done':i===at?'now':''});if(i===at)li.setAttribute('aria-current','step');nav.append(li);});
  return nav;
}
function turnGame(ctx){
  const {host,episode,act,state,dispatch,stageHost,stage}=ctx,g=state.game,t=episode.turns[g.turn];
  // go(null): cambia solo la persona scelta, che non è una mossa della partita: si ridisegna il pannello sul posto.
  const go=(step,extra={})=>{if(step==='assign'){const next=workersOf(episode,g).find(w=>w.id!==extra.workerId&&!g.assign[w.id]);pick.worker=next?.id||null;}
    if(step!==null)return dispatch({type:'turn',step,...extra});host.replaceChildren();turnGame(ctx);(host.querySelector('[data-worker][aria-pressed=true]')||host.querySelector('[data-worker]'))?.focus({preventScroll:true});};
  if(episode.workers)board(stageHost,stage,episode,act,state,dispatch);else hotspots(stageHost,episode,g,dispatch,state);
  if(state.phase!=='scene')return;
  const head=el('p',undefined,{class:'turn-label'});head.append(el('span',t.label,{class:'turn-year'}),el('span',(episode.turnWord||'anno')+' '+(g.turn+1)+' di '+episode.turns.length,{class:'turn-count'}));host.append(head,stepper(episode,g));{const qp=queuePanel(episode,g,t,state);if(qp)host.append(qp);}{const cp=chainPanel(episode,g);if(cp)host.append(cp);}
  if(g.phase==='cards'){
    const c=cardAt(episode,g),n=cardCount(episode,g),box=el('div',undefined,{class:'cards turn-cards'}),bar=el('div',undefined,{class:'card-bar','aria-hidden':'true'}),nav=el('div',undefined,{class:'card-nav'});
    for(let i=0;i<n;i++)bar.append(el('i',undefined,{class:i<g.card?'done':i===g.card?'now':''}));
    const prev=button('Indietro',()=>go('back'),{'data-turn':'back'});prev.disabled=g.card===0;
    nav.append(prev,button(g.card>=n-1?(episode.places?verso(((episode.phaseLabels||{}).place||'la mossa').toLowerCase()):(episode.turns[g.turn].event?'Alla richiesta':'Alle azioni')):'Avanti',()=>go('card'),{'data-turn':'card',class:'primary'}));
    if(c.kind)box.append(el('p',CONTEXT_LABELS[c.kind],{class:'card-kind','data-kind':c.kind}));
    if(c.title)box.append(el('h2',c.title,{class:'card-title'}));
    box.append(el('p',c.text,{class:'lead card-text',tabindex:'-1'}),bar,nav);host.append(box);return;
  }
  if(g.phase==='place'&&episode.workers){managePlace(host,episode,act,state,go);return;}
  if(g.phase==='place'){
    const left=g.rules.tokens-placed(g);
    host.append(el('p','Hai '+g.rules.tokens+' '+episode.tokenLabel+'. '+(left?'Da mettere: '+left+'.':'Niente da mettere.'),{class:'turn-pool',role:'status'}));
    const pool=el('div',undefined,{class:'turn-tokens','aria-hidden':'true'});for(let i=0;i<g.rules.tokens;i++)pool.append(el('i',undefined,{class:i<placed(g)?'used':''}));host.append(pool);
    const list=el('div',undefined,{class:'turn-places'});
    for(const p of episode.places){
      const row=el('div',undefined,{class:'turn-place'}),info=el('div');
      const req=g.rules.min[p.id];
      info.append(el('strong',placeLabel(episode,g,p)),el('span',(perToken(episode,g,p).map(m=>sign(m.delta)+' '+metricLabel(act,m)).join(', ')||'nessun effetto')+' per ciascuno'+(req?' · dovuti: '+req:'')));
      const minus=button('−',()=>go('place',{placeId:p.id,delta:-1}),{'data-place':p.id,'data-delta':'-1','aria-label':'Togli uno da '+placeLabel(episode,g,p)});minus.disabled=!g.placement[p.id];
      const plus=button('+',()=>go('place',{placeId:p.id,delta:1}),{'data-place':p.id,'data-delta':'1','aria-label':'Aggiungi uno a '+placeLabel(episode,g,p)});plus.disabled=!left||(p.max!==undefined&&g.placement[p.id]>=p.max);
      row.append(info,minus,el('b',String(g.placement[p.id]),{'aria-label':g.placement[p.id]+' su '+placeLabel(episode,g,p)}),plus);list.append(row);
    }
    host.append(list);
    const risk=el('div',undefined,{class:'turn-risk'});
    risk.append(el('p',(episode.luckLabel||'Il tempo che farà')+': '+luckOdds(episode).map(l=>l.label+' '+l.p+'%').join(' · ')+'.'));
    const upkeep=[...(episode.upkeep||[]),...g.rules.upkeep].filter(m=>m.delta);if(upkeep.length)risk.append(el('p',(episode.upkeepHint||'Ogni anno, comunque')+': '+upkeep.map(m=>sign(m.delta)+' '+metricLabel(act,m)).join(', ')+'.'));
    for(const s of shortfalls(episode,g))if(episode.control)risk.append(el('p','Meno di '+s.required+' a «'+placeLabel(episode,g,episode.places.find(p=>p.id===s.placeId))+'»: qualcuno se ne accorge nel '+Math.round(chanceOf(episode.control.chance,act,state)*100)+'% dei casi.',{class:'turn-warning'}));
    host.append(risk);
    const ok=button(episode.confirmLabel||'Comincia l’anno',()=>go('confirm'),{'data-turn':'confirm',class:'primary'});ok.disabled=!!left;host.append(ok);return;
  }
  if(g.phase==='result'){
    const r=g.result,box=el('div',undefined,{class:'outcome turn-result',role:'status'});
    // Prima il giudizio in una frase, poi il perché; i numeri si aprono a parte.
    if(r.verdict){if(r.verdict.stamp)box.append(el('p',r.verdict.stamp,{class:'turn-stamp-verdict','data-tone':r.verdict.tone,'aria-hidden':'true'}));box.append(el('p',r.verdict.text,{class:'turn-verdict','data-tone':r.verdict.tone}));}
    const why=el('ul',undefined,{class:'turn-why'});
    why.append(el('li',(episode.luckResultLabel||'Il tempo')+': '+r.luck.label+'.'));
    if(r.control)why.append(el('li',r.control.caught?r.control.text:(episode.control.escaped||'Al signore mancava qualcosa, ma questa volta nessuno se ne accorge.')));
    for(const b of r.built||[])why.append(el('li',b.label+': '+b.text,{class:'turn-built'}));
    for(const c of r.crises)why.append(el('li',c.text,{class:'turn-crisis'}));
    box.append(why);
    const det=el('details',undefined,{class:'turn-numbers'});det.append(el('summary','I numeri '+diTurno(episode.turnWord||'anno')));
    if(r.steps?.length){const hidden=new Set([...(act.metrics||[]),...(act.resources||[])].filter(d=>d.hidden).map(d=>d.id)),tbl=el('ul',undefined,{class:'turn-steps','aria-label':'Da dove viene ogni variazione'});
      for(const st of r.steps){const vis=st.changes.filter(c=>!hidden.has(c.id));if(!vis.length)continue;const li=el('li');li.append(el('span',st.label),el('b',vis.map(c=>sign(c.delta)+' '+c.label).join(' · ')));tbl.append(li);}
      det.append(tbl);}
    det.append(changeList(act,r.changes));box.append(det);host.append(box);
    if(r.preview){const note=el('aside',undefined,{class:'turn-preview','aria-label':episode.previewLabel||'Si dice in giro'});note.append(el('p',episode.previewLabel||'Si dice in giro',{class:'turn-preview-k'}),el('p',r.preview,{class:'turn-preview-t'}));host.append(note);}
    host.append(button(t.event?((episode.phaseLabels||{}).event||'Qualcuno bussa'):t.market?((episode.phaseLabels||{}).market||'Al mercato'):'Avanti',()=>go('continue'),{'data-turn':'continue',class:'primary'}));return;
  }
  if(g.phase==='event'){
    host.append(el('p',t.event.who,{class:'turn-who'}),el('p',t.event.text,{class:'lead'}));
    for(const c of t.event.choices){const p=c.chance?Math.round(chanceOf(c.chance,act,state)*100):null;
      const b=button(c.label+(p===null?'':' · riesce nel '+p+'% dei casi'),()=>go('choose',{choiceId:c.id}),{'data-turn-choice':c.id});b.disabled=!!c.when&&!matches(c.when,state);if(b.disabled)b.title='Non si può, in questa situazione';host.append(b);}
    return;
  }
  if(g.phase==='eventResult'){
    const r=g.eventResult,box=el('div',undefined,{class:'outcome turn-result',role:'status'});
    if(r.p!==null)box.append(el('p',(r.success?'Riuscito':'Non riuscito')+' ('+r.p+'%).'));
    box.append(el('p',r.text));for(const c of r.crises)box.append(el('p',c.text,{class:'turn-crisis'}));
    if(r.changes.length)box.append(changeList(act,r.changes));host.append(box);
    host.append(button(t.market?'Alla fiera':g.turn>=episode.turns.length-1?'Fine della partita':(episode.nextLabel||'L’anno dopo'),()=>go('continue'),{'data-turn':'continue',class:'primary'}));return;
  }
  if(g.phase==='market'){
    const m=t.market;host.append(el('p',m.who,{class:'turn-who'}),el('p',m.text,{class:'lead'}));
    const shop=el('div',undefined,{class:'turn-market'});
    if(g.market.left!=null){const pts=el('div',undefined,{class:'turn-tokens','aria-label':(episode.pointsLabel||'Punti azione')+': '+g.market.left+' su '+m.points});for(let i=0;i<m.points;i++)pts.append(el('i',undefined,{class:i<m.points-g.market.left?'used':''}));host.append(el('p',(episode.pointsLabel||'Punti azione')+': '+g.market.left+' su '+m.points,{class:'turn-pool',role:'status'}),pts);}
    for(const o of m.offers){const b=button('',()=>go('buy',{offerId:o.id}),{'data-offer':o.id});b.append(el('strong',o.label));
      if(o.cost>1)b.append(el('span','Costa '+o.cost+' punti'));
      if(o.chance){const pc=Math.round(chanceOf(o.chance,act,state)*100);b.append(el('span','riesce nel '+pc+'% dei casi'));}
      else if(o.effects?.length)b.append(el('span',effectsText(act,o.effects.filter(x=>x.kind!=='flag'))));
      {const ct=o.chance?[chainText(episode,o.success?.chain)&&'se riesce: '+chainText(episode,o.success.chain),chainText(episode,o.failure?.chain)&&'se no: '+chainText(episode,o.failure.chain)].filter(Boolean).join('; '):chainText(episode,o.chain);if(ct)b.append(el('span',ct));}
      {const qt=o.chance?[queueText(episode,o.success?.queue)&&'se riesce: '+queueText(episode,o.success.queue),queueText(episode,o.failure?.queue)&&'se no: '+queueText(episode,o.failure.queue)].filter(Boolean).join('; '):queueText(episode,o.queue);if(qt)b.append(el('span',qt));}
      b.disabled=!offerOpen(episode,g,o,state);const n=g.market.bought.filter(x=>x===o.id).length;if(n)b.append(el('small',o.repeat?'fatto '+n+(n===1?' volta':' volte'):'preso'));shop.append(b);}
    host.append(shop);
    if(g.market.log.length){const box=el('div',undefined,{class:'outcome turn-result',role:'status'});for(const line of g.market.log)box.append(el('p',line));box.append(changeList(act,g.market.changes));host.append(box);}
    // Con punti ancora da spendere il pulsante lo dice: chiudere la giornata non deve essere un tocco distratto.
    const avanzo=g.market.left>0?(g.market.left===1?' (resta 1 punto)':' (restano '+g.market.left+' punti)'):'';
    host.append(button((g.turn>=episode.turns.length-1?'Fine della partita':(episode.leaveLabel||'Torna a casa'))+avanzo,()=>go('leave'),{'data-turn':'leave',class:'primary'}));
  }
}
registerInteraction('turn_game',turnGame);
