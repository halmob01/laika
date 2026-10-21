import {validateGame, assert, jsonData} from '../core/schema.js';
import {initialState, clone, actOn, enterEpisode, matches} from '../core/engine.js';
import {assess,report} from '../assessment/index.js';
export function newSession(game,seed='session') {
  validateGame(game);assert(typeof seed==='string'&&seed.length<=100,'Seed non valido');
  return {gameId:game.id,contentVersion:game.contentVersion,seed,actIndex:0,currentAct:initialState(game.acts[0]),ledger:[],historySnapshots:[],exposureFlags:[],assessmentResults:[],journal:[],complete:false};
}
export const currentScene=(game,s)=>s.complete?null:game.acts[s.actIndex].episodes.find(e=>e.id===s.currentAct.episodeId);
export function transition(game,previous,action) {
  jsonData(action);assert(!previous.complete,'Percorso concluso');
  assert(previous.gameId===game.id&&previous.contentVersion===game.contentVersion,'Pacchetto incompatibile');
  const session=clone(previous),act=game.acts[session.actIndex],episode=currentScene(game,session);
  let state=session.currentAct,changes=[],events=[],feedback='';
  switch(action.type) {
    case 'view_role': {
      assert(episode.type==='role_crisis'&&state.phase==='scene'&&episode.roles.includes(action.roleId),'Ruolo non disponibile');
      state.roleId=action.roleId;break;
    }
    case 'inspect_source': {
      assert(episode.type==='source_comparison'&&state.phase==='scene'&&episode.sources.some(x=>x.id===action.sourceId),'Fonte non disponibile');
      const key=episode.id+':'+action.sourceId;
      if(!state.viewedSources.includes(key))state.viewedSources.push(key);break;
    }
    case 'answer': {
      assert(episode.type==='assessment'&&state.phase==='scene','Non è il momento della verifica');
      const result=assess(episode.question,action.answerId,session.exposureFlags);
      session.assessmentResults.push(result);state.phase='outcome';feedback=result.feedback;
      state.last={feedback,changes:[],events:[]};break;
    }
    case 'advance': {
      assert(state.phase==='outcome'||episode.type==='narrative','Completa l’attività prima di proseguire');
      for(const f of episode.exposes||[])if(!session.exposureFlags.includes(f))session.exposureFlags.push(f);
      const index=act.episodes.indexOf(episode);
      const next=episode.branches?.find(b=>matches(b.when,state))?.to || episode.next || act.episodes[index+1]?.id || 'end';
      if(next==='end') {
        events=state.pendingEffects.map(d=>({type:'discarded',effectId:d.id,sourceDecisionId:d.sourceDecisionId,text:d.explanation}));
        state.pendingEffects=[];
        session.historySnapshots.push({actId:act.id,state:clone(state),reconciliation:act.reconciliation});
        if(session.actIndex===game.acts.length-1){session.complete=true;state.phase='end';}
        else {session.actIndex++;state=initialState(game.acts[session.actIndex]);events.push({type:'reconciliation',text:act.reconciliation});}
      } else {
        const t=enterEpisode(act,state,act.episodes.find(e=>e.id===next));state=t.state;changes=t.appliedChanges;events=t.events;
      }break;
    }
    default: {
      const t=actOn(act,episode,state,action);state=t.state;changes=t.appliedChanges;events=t.events;feedback=t.feedback;
    }
  }
  session.currentAct=state;
  const entry={sequence:session.ledger.length,actId:act.id,episodeId:episode.id,action:clone(action)};
  session.ledger.push(entry);
  if(changes.length||events.length||feedback)session.journal.push({...entry,changes:clone(changes),events:clone(events),feedback});
  return {nextState:session,appliedChanges:changes,events,feedback};
}
export const select=(game,s,choiceId)=>transition(game,s,{type:'select',choiceId}).nextState;
export const advance=(game,s)=>transition(game,s,{type:'advance'}).nextState;
export const recap=(game,s)=>({title:game.title,acts:clone(s.historySnapshots),journal:clone(s.journal),assessment:report(s.assessmentResults)});
export function replay(game,commands,seed) {
  assert(Array.isArray(commands)&&commands.length<=10000,'Registro non valido o troppo lungo');
  let state=newSession(game,seed);
  for(const entry of commands) {
    assert(entry.sequence===state.ledger.length&&entry.actId===state.currentAct.actId&&entry.episodeId===state.currentAct.episodeId,'Ordine del registro incoerente');
    state=transition(game,state,entry.action).nextState;
  }
  return state;
}
