import {available} from '../core/engine.js';
import {optionOrder} from '../assessment/index.js';
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
