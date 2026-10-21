import {assert, own, GROUPS, defs} from './schema.js';
export const clone = value => structuredClone(value);
export const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
export function initialState(act) {
  const state={actId:act.id,episodeId:act.episodes[0].id,roleId:act.episodes[0].roleId,phase:'scene',turn:0,flags:{},pendingEffects:[],appliedEffectIds:[],events:[],viewedSources:[],processedSources:[],last:null};
  for(const [kind,group] of Object.entries(GROUPS)) state[group]=Object.fromEntries(defs(act,kind).map(d=>[d.id,d.start]));
  act.flags.forEach(f=>state.flags[f]=false);
  return state;
}
export function matches(c,state) {
  if(!c)return true;
  switch(c.op) {
    case 'all':return c.items.every(x=>matches(x,state));
    case 'any':return c.items.some(x=>matches(x,state));
    case 'not':return !matches(c.item,state);
    case 'flag':return state.flags[c.id]===c.value;
    case 'event':return state.events.includes(c.id);
    default:{const value=state[GROUPS[c.kind]][c.id];return {eq:()=>value===c.value,gte:()=>value>=c.value,lte:()=>value<=c.value,gt:()=>value>c.value,lt:()=>value<c.value}[c.op]();}
  }
}
// Adaptation of the original pure changeValues: ranges are declared by the pack.
export function applyEffects(act,state,effects,cause) {
  const applied=[];
  for(const effect of effects) {
    const group=effect.kind==='flag'?'flags':GROUPS[effect.kind];
    const before=state[group][effect.id];
    const def=effect.kind==='flag'?null:defs(act,effect.kind).find(d=>d.id===effect.id);
    const after=def?clamp(before+effect.delta,def.min,def.max):effect.value;
    state[group][effect.id]=after;
    if(before!==after)applied.push({kind:effect.kind,id:effect.id,label:def?.label||effect.id,before,after,delta:def?after-before:null,cause});
  }
  return applied;
}
function settle(act,state,trigger) {
  const changes=[],events=[],pending=[];
  for(const d of state.pendingEffects) {
    if(state.appliedEffectIds.includes(d.id))continue;
    const due=d.episodeId ? (d.activated || (trigger==='entry'&&state.episodeId===d.episodeId)) : state.turn>=d.dueTurn;
    if(!due){pending.push(d);continue;}
    const activatedAt=d.activatedAt??state.turn;
    if(state.turn>activatedAt+d.expiresAfterTurns){events.push({type:'expired',effectId:d.id,sourceDecisionId:d.sourceDecisionId,text:d.explanation});continue;}
    if(matches(d.when,state)) {
      changes.push(...applyEffects(act,state,d.effects,d.sourceDecisionId));state.appliedEffectIds.push(d.id);
      events.push({type:'delayed',effectId:d.id,sourceDecisionId:d.sourceDecisionId,text:d.explanation});
    } else pending.push({...d,activated:true,activatedAt});
  }
  state.pendingEffects=pending; return {changes,events};
}
export function available(choice,state) {return matches(choice.when,state)&&(!choice.roles||choice.roles.includes(state.roleId));}
export function actOn(act,episode,previous,action) {
  assert(previous.phase==='scene','Azione già risolta');
  const state=clone(previous), changes=[],events=[];
  let outcome;
  if(action.type==='select'&&['choice','role_crisis','source_comparison'].includes(episode.type)) {
    outcome=episode.choices.find(c=>c.id===action.choiceId);
    assert(outcome&&available(outcome,state),'Scelta non disponibile per il ruolo e lo stato');
    if(episode.type==='source_comparison') {
      assert(episode.sources.every(s=>state.viewedSources.includes(episode.id+':'+s.id)),'Leggere tutte le fonti prima del confronto');
      state.processedSources.push(...episode.sources.map(s=>episode.id+':'+s.id));
    }
  } else if(action.type==='allocate'&&episode.type==='resource_allocation') {
    const values=action.allocations;
    assert(values&&typeof values==='object'&&!Array.isArray(values)&&Object.keys(values).length===episode.buckets.length,'Allocazione incompleta');
    let total=0; const effects=[];
    for(const b of episode.buckets) {
      assert(own(values,b.id)&&Number.isInteger(values[b.id])&&values[b.id]>=0&&values[b.id]<=b.max,'Quantità non valida'); total+=values[b.id];
      effects.push(...b.perUnit.map(e=>({...e,delta:e.delta*values[b.id]})));
    }
    assert(total===episode.budget,'Distribuire esattamente il budget');
    outcome={...episode,effects:[...effects,...(episode.effects||[])]};
  } else throw new Error('Azione incompatibile con l’interazione');
  state.turn++;
  const sourceDecisionId=episode.id+':'+(outcome.id||'allocation');
  changes.push(...applyEffects(act,state,outcome.effects||[],sourceDecisionId));
  for(const d of outcome.delayed||[])state.pendingEffects.push({...clone(d),dueTurn:d.afterTurns?state.turn+d.afterTurns:null,sourceDecisionId});
  state.events.push(episode.id);
  const settled=settle(act,state,'turn');changes.push(...settled.changes);events.push(...settled.events);
  state.phase='outcome';state.last={feedback:outcome.feedback,changes,events,sourceDecisionId};
  return {state,appliedChanges:changes,events,feedback:outcome.feedback};
}
export function enterEpisode(act,previous,episode) {
  const state=clone(previous);state.episodeId=episode.id;state.roleId=episode.roleId;state.phase='scene';state.last=null;
  const result=settle(act,state,'entry');return {state,appliedChanges:result.changes,events:result.events,feedback:''};
}
