import {newSession,replay} from '../runner/index.js';
import {assert,jsonData} from '../core/schema.js';
export const SAVE_SCHEMA_VERSION=1;
export const storageKey=game=>'learning-kit:'+game.id+':save-v1';
export function exportSave(game,state) {
  assert(state.gameId===game.id&&state.contentVersion===game.contentVersion,'Sessione incompatibile');
  return JSON.stringify({saveSchemaVersion:SAVE_SCHEMA_VERSION,gameId:game.id,contentVersion:game.contentVersion,seed:state.seed,commands:state.ledger});
}
export function restore(game,raw) {
  try {
    assert(typeof raw==='string'&&raw.length<=2_000_000,'Backup troppo grande o non valido');
    const data=JSON.parse(raw);jsonData(data);
    assert(data.saveSchemaVersion===SAVE_SCHEMA_VERSION,'Versione salvataggio non supportata: conserva il backup originale');
    assert(data.gameId===game.id,'Il backup appartiene a un altro gioco');
    assert(data.contentVersion===game.contentVersion,'Contenuti aggiornati: serve una migrazione esplicita. Conserva il backup');
    return {ok:true,state:replay(game,data.commands,data.seed)};
  } catch(error) {return {ok:false,error:error.message};}
}
export function load(game,storage) {
  try { const raw=storage.getItem(storageKey(game));return raw===null?{ok:true,state:null}:restore(game,raw); }
  catch {return {ok:false,error:'Archivio locale non accessibile. Usa esporta/importa.'};}
}
export function save(game,state,storage) {
  try {storage.setItem(storageKey(game),exportSave(game,state));return {ok:true};}
  catch {return {ok:false,error:'Salvataggio locale non riuscito. Esporta il progresso prima di uscire.'};}
}

// Read-only adapter. Restore/replay is the only authority for save validity.
export function readProgress(game,storage){
 const result=load(game,storage);
 if(!result.ok)return {status:'incompatible',error:result.error};
 if(!result.state)return {status:'new'};
 const s=result.state;
 if(s.complete)return {status:'complete'};
 const act=game.acts[s.actIndex],episode=act.episodes.find(e=>e.id===s.currentAct.episodeId);
 return {status:'resumable',actId:act.id,actTitle:act.title,episodeId:episode.id,episodeTitle:episode.title,phase:s.currentAct.phase};
}
