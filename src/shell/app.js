import {validateRegistry,applyPresentation} from './registry.js';
import {contextLabel} from '../core/schema.js';
import {validatePack} from '../validation/game-pack.js';
import {newSession,currentScene,transition,recap} from '../runner/index.js';
import {save,load,restore,exportSave,storageKey} from '../storage/index.js';
import {createStage} from '../visual/stage.js';
import {el,button,renderInteraction} from '../interactions/index.js';
import {activeStage,netChanges} from '../core/turns.js';
const $=id=>document.getElementById(id);
let game,state,stageId=null,blocked=false,storage=null,cardEpisode=null,cardIndex=0;
try{storage=window.localStorage;}catch{}
const media=matchMedia('(prefers-reduced-motion: reduce)');
const stage=createStage($('stage'),{reducedMotion:media.matches,onCaption:message=>{$('caption').textContent=message;},onStatus:value=>{$('pause').textContent=value==='paused'?'Riprendi':'Pausa';$('pause').setAttribute('aria-pressed',String(value==='paused'));$('pause').disabled=value==='finished';}});
media.addEventListener('change',e=>stage.setReducedMotion(e.matches));
function notice(message){$('notice').textContent=message;}
function persist(){if(blocked){notice('Il backup incompatibile è conservato. Questa sessione non viene salvata: esportala oppure scegli Ricomincia.');return;}const r=save(game,state,storage);if(!r.ok)notice(r.error);}
function download(value,name){const url=URL.createObjectURL(new Blob([value],{type:'application/json'}));const a=el('a',undefined,{href:url,download:name});a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function journal(){
  $('journal').replaceChildren();if(!state.journal.length)return;
  const details=el('details'),summary=el('summary','Perché la situazione è cambiata · diario della simulazione');details.append(summary);
  // Una voce per decisione, le più recenti in alto; per ogni indicatore solo la variazione netta, senza codici interni.
  for(const entry of [...state.journal].reverse()){const p=el('div',undefined,{class:'journal-entry'});p.append(el('strong',game.acts.find(a=>a.id===entry.actId).episodes.find(e=>e.id===entry.episodeId).title));
    if(entry.feedback)p.append(el('p',entry.feedback));
    // Gli indicatori nascosti restano nascosti anche nel diario.
    const act=game.acts.find(a=>a.id===entry.actId),hidden=new Set([...(act.metrics||[]),...(act.resources||[]),...(act.relations||[])].filter(d=>d.hidden).map(d=>d.id));
    const net=netChanges(entry.changes).filter(c=>!hidden.has(c.id));if(net.length){const ul=el('ul',undefined,{class:'journal-changes'});for(const c of net)ul.append(el('li',c.label+': '+c.before+' → '+c.after));p.append(ul);}
    for(const e of entry.events)p.append(el('p',(e.type==='delayed'?'Conseguenza differita: ':e.type==='discarded'?'Effetto chiuso senza applicazione: ':e.type==='expired'?'Effetto scaduto: ':'Nuovo quadro: ')+e.text));details.append(p);}
  $('journal').append(details);
}
function render({motion=false,intro=false,sceneMotion=false,cue=null}={}) {
  $('workspace').hidden=state.complete;$('summary').hidden=!state.complete;journal();
  if(state.complete){stage.skip();const summary=recap(game,state);$('summary').replaceChildren(el('p','Percorso completato',{class:'eyebrow'}),el('h1','Le scelte e ciò che hai imparato',{id:'summary-title',tabindex:'-1'}));
    for(const a of summary.acts){const article=el('article');article.append(el('h2',game.acts.find(x=>x.id===a.actId).title),el('p',a.reconciliation));$('summary').append(article);}
    if(summary.assessment.count)$('summary').append(el('h2','Prova formativa: '+summary.assessment.score+' / 100'),el('p','Il risultato riguarda le risposte di comprensione, non le tue scelte nella simulazione.'));
    return;
  }
  const act=game.acts[state.actIndex],s=state.currentAct,e=currentScene(game,state);
  // Nella partita a turni la scena attiva è quella della card in lettura, altrimenti il tabellone.
  const active=e.type==='turn_game'&&s.game?activeStage(e,s.game):{stageId:e.stageId,motionId:e.motionId},descriptor=game.stages.find(x=>x.id===active.stageId);
  $('caption').textContent=e.visualExplanation||'Scena della simulazione.';
  if(descriptor){if(stageId!==descriptor.id){stage.mount(descriptor,s,{intro:intro&&!active.motionId});stageId=descriptor.id;if((intro||sceneMotion||e.type==='turn_game')&&active.motionId)stage.sequence(active.motionId);}else stage.update(s,{animate:motion,sequence:cue||(sceneMotion?e.motionId:undefined)});}
  else {stage.destroy();stageId=null;}
  // Inquadratura per schermi stretti dichiarata dalla scenografia: il tema la usa per centrare l'azione.
  for(const [name,value] of [['--stage-center',descriptor?.mobile?.center],['--stage-zoom',descriptor?.mobile?.zoom]])value===undefined?$('stage').style.removeProperty(name):$('stage').style.setProperty(name,String(value));
  $('replay').disabled=!descriptor;$('skip').disabled=!descriptor;if(!descriptor)$('pause').disabled=true;
  const hasMetrics=[...(act.metrics||[]),...(act.resources||[])].some(d=>!d.hidden);
  $('stage').parentElement.hidden=!descriptor&&!hasMetrics;
  $('workspace').classList.toggle('text-only',!descriptor&&!hasMetrics);
  for(const node of [$('stage'),$('caption'),$('replay').parentElement])node.hidden=!descriptor;
  
  $('metrics').hidden=![...(act.metrics||[]),...(act.resources||[])].some(d=>!d.hidden);
  $('metrics').replaceChildren(el('p','Indicatori di simulazione · non sono voti',{class:'eyebrow'}));
  for(const [group,definitions] of [['metrics',act.metrics],['resources',act.resources]])for(const d of definitions||[]){if(d.hidden)continue;
    const row=el('div',undefined,{class:'metric'}),title=el('span'),meter=el('div',undefined,{class:'meter'}),fill=el('i');
    title.append(el('span',d.label),el('b',String(s[group][d.id])));fill.style.width=(100*(s[group][d.id]-d.min)/(d.max-d.min))+'%';meter.append(fill);row.append(title,meter);$('metrics').append(row);}
  const panel=$('panel');panel.dataset.type=e.type;panel.replaceChildren(el('p',act.title+' · '+(act.episodes.indexOf(e)+1)+' / '+act.episodes.length,{class:'eyebrow'}),el('h1',e.title,{id:'scene-title',tabindex:'-1'}));
  // Racconto a card: un paragrafo alla volta; il testo intero resta nell'episodio e nel salvataggio non cambia nulla.
  if(cardEpisode!==e.id){cardEpisode=e.id;cardIndex=0;}
  const cards=e.display==='cards'?e.text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean):null,lastCard=!cards||cardIndex>=cards.length-1;
  if(cards){
    const box=el('div',undefined,{class:'cards',role:'group','aria-label':'Racconto a card'}),bar=el('div',undefined,{class:'card-bar','aria-hidden':'true'}),nav=el('div',undefined,{class:'card-nav'});
    cards.forEach((_,i)=>bar.append(el('i',undefined,{class:i<cardIndex?'done':i===cardIndex?'now':''})));
    const go=step=>{cardIndex=Math.max(0,Math.min(cards.length-1,cardIndex+step));render();($('panel').querySelector(cardIndex>=cards.length-1?'[data-action=advance]':'[data-card=next]')||$('panel').querySelector('.card-text'))?.focus({preventScroll:true});};
    const prev=button('Indietro',()=>go(-1),{'data-card':'prev'});prev.disabled=cardIndex===0;nav.append(prev);
    if(!lastCard)nav.append(button('Avanti',()=>go(1),{'data-card':'next',class:'primary'}));
    box.append(el('p','Card '+(cardIndex+1)+' di '+cards.length,{class:'card-count','aria-live':'polite'}),el('p',cards[cardIndex],{class:'lead card-text',tabindex:'-1'}),bar,nav);panel.append(box);
  } else if(e.type!=='turn_game')panel.append(el('p',e.text,{class:'lead'}));
  if(e.context)panel.insertBefore(el('p',contextLabel(e.context),{class:'episode-context'}),panel.querySelector('h1'));
  if(s.phase==='outcome'){
    const outcome=el('div',undefined,{class:'outcome',role:'status'});outcome.append(el('p',s.last.feedback));
    for(const c of netChanges(s.last.changes))outcome.append(el('p',c.label+': '+c.before+' → '+c.after));panel.append(outcome);
  }else {const host=el('div',undefined,{id:'interaction'});panel.append(host);renderInteraction(e.type,{host,episode:e,act,state:s,seed:state.seed,dispatch,stageHost:$('stage'),stage});}
  if(s.phase==='outcome'||(e.type==='narrative'&&lastCard))(cards?panel.querySelector('.card-nav'):panel).append(button('Continua',()=>dispatch({type:'advance'}),{class:'primary','data-action':'advance'}));
}
function dispatch(action){
  try{const before=currentScene(game,state);const cue=action.type==='select'?before.choices?.find(c=>c.id===action.choiceId)?.motionId:action.type==='allocate'||(action.type==='turn'&&action.step==='confirm')?before.resultMotionId:null;const result=transition(game,state,action);state=result.nextState;notice('');persist();render({motion:true,sceneMotion:action.type==='advance',cue});
    if(result.events.length)$('caption').textContent=result.events.map(e=>e.text).join(' ');
    if(action.type==='view_role')$('panel').querySelector('[data-role="'+action.roleId+'"]')?.focus();
    else if(action.type==='inspect_source')$('panel').querySelector('[data-source="'+action.sourceId+'"]')?.focus();
    // Partita a turni: il fuoco resta sul comando appena usato, così da tastiera si piazza senza ripartire dal titolo.
    else if(action.type==='turn'&&action.step==='place')($('panel').querySelector('[data-place="'+action.placeId+'"][data-delta="'+action.delta+'"]:not(:disabled)')||$('panel').querySelector('[data-turn=confirm]:not(:disabled)')||$('scene-title'))?.focus({preventScroll:true});
    else if(action.type==='turn'&&action.step==='assign')($('panel').querySelector('[data-worker][aria-pressed=true]')||$('panel').querySelector('[data-turn=confirm]:not(:disabled)')||$('scene-title'))?.focus({preventScroll:true});
    else if(action.type==='turn'&&action.step==='reserve')($('panel').querySelector('[data-reserve="'+action.delta+'"]:not(:disabled)')||$('panel').querySelector('[data-reserve]:not(:disabled)'))?.focus({preventScroll:true});
    else if(action.type==='turn'&&action.step==='buy')($('panel').querySelector('[data-offer]:not(:disabled)')||$('panel').querySelector('[data-turn=leave]'))?.focus({preventScroll:true});
    else if(action.type==='turn'&&['card','back'].includes(action.step))($('panel').querySelector('[data-turn=card]')||$('scene-title'))?.focus({preventScroll:true});
    else ($(state.complete?'summary-title':'scene-title'))?.focus({preventScroll:true});
  }catch(error){notice(error.message);}
}
$('replay').onclick=()=>{stage.replay();};$('skip').onclick=()=>{stage.skip();};
$('pause').onclick=()=>{if(stage.paused){stage.resume();}else{stage.pause();}};
document.addEventListener('visibilitychange',()=>{if(document.hidden){stage.pause();}});
$('export').onclick=()=>download(exportSave(game,state),game.id+'-progresso.json');
$('raw').onclick=()=>{try{download(storage.getItem(storageKey(game)),game.id+'-backup-originale.json');}catch{notice('Backup locale non accessibile.');}};
$('restart').onclick=()=>{if(!confirm('Ricominciare? Esporta prima il progresso se vuoi conservarlo.'))return;blocked=false;$('raw').hidden=true;state=newSession(game,crypto.randomUUID());stageId=null;notice('');persist();render({intro:true});$('scene-title')?.focus({preventScroll:true});};
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;
  if(file.size>2_000_000){notice('Backup troppo grande.');return;}
  const result=restore(game,await file.text());if(!result.ok){notice(result.error);return;}
  if(!confirm('Sostituire il progresso corrente con questo backup verificato?'))return;
  state=result.state;blocked=false;$('raw').hidden=true;stageId=null;notice('Backup ripristinato.');persist();render();($(state.complete?'summary-title':'scene-title'))?.focus({preventScroll:true});e.target.value='';};
async function start(){
  const config=validateRegistry(await (await fetch('./config.json')).json());const selected=new URLSearchParams(location.search).get('game')||config.defaultGame;
  const item=config.games.find(g=>g.id===selected);if(!item)throw new Error('Gioco non configurato');
  applyPresentation(item,document);
  game=validatePack(await (await fetch(item.manifest)).json());
  document.title=game.title;$('game-title').textContent=game.title;
  for(const [key,value] of Object.entries(game.theme||{}))if(['ink','paper','accent','highlight'].includes(key)&&/^#[0-9a-f]{6}$/i.test(value))document.documentElement.style.setProperty('--'+key,value);
  if(item.presentation?.standalone)$('packs').hidden=true;
  else for(const g of config.games){const a=el('a',g.label,{href:'?game='+encodeURIComponent(g.id)});if(g.id===selected)a.setAttribute('aria-current','page');$('packs').append(a);}
  const result=load(game,storage);blocked=!result.ok;
  state=result.ok&&result.state?result.state:newSession(game,crypto.randomUUID());
  if(blocked){notice(result.error+' Il backup originale resta conservato; questa prova non lo sovrascrive.');$('raw').hidden=false;}
  else if(result.state)notice('Progresso ripreso. Nel diario trovi le decisioni che spiegano la situazione attuale.');
  render({intro:!result.state});if(!blocked)persist();
}
start().catch(error=>{notice('Impossibile aprire il laboratorio: '+error.message);$('tools').hidden=true;});
