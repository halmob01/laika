import {available} from '../core/engine.js';
import {CONTEXT_LABELS} from '../core/schema.js';
import {optionOrder} from '../assessment/index.js';
import {chanceOf,luckOdds,shortfalls,placed,placeLabel,perToken} from '../core/turns.js';
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
function hotspots(stageHost,episode,game,dispatch){
  stageHost?.querySelector('.turn-overlay')?.remove();fitObserver?.disconnect();fitObserver=null;
  const svg=stageHost?.querySelector('svg');if(!svg||game.phase!=='place')return;
  const layer=el('div',undefined,{class:'turn-overlay','aria-hidden':'true'});
  for(const p of episode.places){const b=button(String(game.placement[p.id]),()=>dispatch({type:'turn',step:'place',placeId:p.id,delta:1}),{tabindex:'-1','data-hotspot':p.id,title:placeLabel(episode,game,p)});
    b.style.left=(p.x*100)+'%';b.style.top=(p.y*100)+'%';b.disabled=placed(game)>=game.rules.tokens;layer.append(b);}
  stageHost.append(layer);
  const fit=()=>{const a=stageHost.getBoundingClientRect(),r=svg.getBoundingClientRect();Object.assign(layer.style,{left:(r.left-a.left)+'px',top:(r.top-a.top)+'px',width:r.width+'px',height:r.height+'px'});};
  fit();if(typeof ResizeObserver==='function'){fitObserver=new ResizeObserver(fit);fitObserver.observe(stageHost);}
}
registerInteraction('turn_game',({host,episode,act,state,dispatch,stageHost})=>{
  const g=state.game,t=episode.turns[g.turn];
  hotspots(stageHost,episode,g,dispatch);
  if(state.phase!=='scene')return;
  const head=el('p',undefined,{class:'turn-label'});head.append(el('span',t.label,{class:'turn-year'}),el('span','anno '+(g.turn+1)+' di '+episode.turns.length,{class:'turn-count'}));host.append(head);
  const go=(step,extra={})=>dispatch({type:'turn',step,...extra});
  if(g.phase==='cards'){
    const c=t.cards[g.card],box=el('div',undefined,{class:'cards turn-cards'}),bar=el('div',undefined,{class:'card-bar','aria-hidden':'true'}),nav=el('div',undefined,{class:'card-nav'});
    t.cards.forEach((_,i)=>bar.append(el('i',undefined,{class:i<g.card?'done':i===g.card?'now':''})));
    const prev=button('Indietro',()=>go('back'),{'data-turn':'back'});prev.disabled=g.card===0;
    nav.append(prev,button(g.card>=t.cards.length-1?'Alla settimana':'Avanti',()=>go('card'),{'data-turn':'card',class:'primary'}));
    if(c.kind)box.append(el('p',CONTEXT_LABELS[c.kind],{class:'card-kind','data-kind':c.kind}));
    if(c.title)box.append(el('h2',c.title,{class:'card-title'}));
    box.append(el('p',c.text,{class:'lead card-text',tabindex:'-1'}),bar,nav);host.append(box);return;
  }
  if(g.phase==='place'){
    const left=g.rules.tokens-placed(g);
    host.append(el('p','Hai '+g.rules.tokens+' '+episode.tokenLabel+'. '+(left?'Da mettere: '+left+'.':'Tutti assegnati.'),{class:'turn-pool',role:'status'}));
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
    risk.append(el('p','Il tempo che farà: '+luckOdds(episode).map(l=>l.label+' '+l.p+'%').join(' · ')+'.'));
    const upkeep=[...(episode.upkeep||[]),...g.rules.upkeep].filter(m=>m.delta);if(upkeep.length)risk.append(el('p','Ogni anno, comunque: '+upkeep.map(m=>sign(m.delta)+' '+metricLabel(act,m)).join(', ')+'.'));
    for(const s of shortfalls(episode,g))if(episode.control)risk.append(el('p','Meno di '+s.required+' a «'+placeLabel(episode,g,episode.places.find(p=>p.id===s.placeId))+'»: qualcuno se ne accorge nel '+Math.round(chanceOf(episode.control.chance,act,state)*100)+'% dei casi.',{class:'turn-warning'}));
    host.append(risk);
    const ok=button('Comincia l’anno',()=>go('confirm'),{'data-turn':'confirm',class:'primary'});ok.disabled=!!left;host.append(ok);return;
  }
  if(g.phase==='result'){
    const r=g.result,box=el('div',undefined,{class:'outcome turn-result',role:'status'});
    box.append(el('p','L’anno: '+r.luck.label+'.'));
    if(r.control)box.append(el('p',r.control.caught?r.control.text:'Questa volta nessuno se ne accorge ('+r.control.p+'%).'));
    for(const c of r.crises)box.append(el('p',c.text,{class:'turn-crisis'}));
    box.append(changeList(act,r.changes));host.append(box);
    if(r.preview)host.append(el('p','Si dice in giro: '+r.preview,{class:'turn-preview'}));
    host.append(button(t.event?'Qualcuno bussa':'Avanti',()=>go('continue'),{'data-turn':'continue',class:'primary'}));return;
  }
  if(g.phase==='event'){
    host.append(el('p',t.event.who,{class:'turn-who'}),el('p',t.event.text,{class:'lead'}));
    for(const c of t.event.choices){const p=c.chance?Math.round(chanceOf(c.chance,act,state)*100):null;
      host.append(button(c.label+(p===null?'':' · riesce nel '+p+'% dei casi'),()=>go('choose',{choiceId:c.id}),{'data-turn-choice':c.id}));}
    return;
  }
  if(g.phase==='eventResult'){
    const r=g.eventResult,box=el('div',undefined,{class:'outcome turn-result',role:'status'});
    if(r.p!==null)box.append(el('p',(r.success?'Riuscito':'Non riuscito')+' ('+r.p+'%).'));
    box.append(el('p',r.text));for(const c of r.crises)box.append(el('p',c.text,{class:'turn-crisis'}));
    if(r.changes.length)box.append(changeList(act,r.changes));host.append(box);
    host.append(button(g.turn>=episode.turns.length-1?'Fine della partita':'L’anno dopo',()=>go('continue'),{'data-turn':'continue',class:'primary'}));
  }
});
