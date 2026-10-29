// Unità di un atto: stato di ciascuna in base all'episodio corrente. Funzioni pure, nessun dato di un gioco specifico.
export const hasUnits=act=>Array.isArray(act.units)&&act.units.length>0;
export const unitIndexOf=(act,episodeId)=>hasUnits(act)?act.units.findIndex(u=>u.episodes.includes(episodeId)):-1;
// Stato: done (finita), current (in corso), later (più avanti). Un'unità senza episodi è sempre «più avanti».
export function unitStates(act,episodeId,complete=false){
  const current=unitIndexOf(act,episodeId);
  return act.units.map((u,i)=>({unit:u,index:i,status:!u.episodes.length?'later':complete||i<current?'done':i===current?'current':'later'}));
}
// L'unità corrente è «da riprendere» se il giocatore ha già agito in essa.
export function unitStarted(act,session){
  const i=unitIndexOf(act,session.currentAct.episodeId);if(i<0)return false;
  const u=act.units[i];
  return session.currentAct.episodeId!==u.episodes[0]||session.currentAct.phase!=='scene'||session.ledger.some(l=>u.episodes.includes(l.episodeId));
}
// Posizione dell'episodio dentro l'unità: «2 / 7».
export function positionInUnit(act,episodeId){
  const u=act.units?.[unitIndexOf(act,episodeId)];return u?{index:u.episodes.indexOf(episodeId)+1,total:u.episodes.length}:null;
}
// Etichetta breve dell'unità: numero romano dell'atto (dal titolo «Atto I — …») e posizione: «I.2».
export function unitLabel(act,index){
  const roman=/^Atto\s+([IVXLC]+)\b/.exec(act.title)?.[1]||'';
  return (roman?roman+'.':'')+(index+1);
}
// Titolo dell'atto senza la parte «Atto I —».
export const actName=act=>act.title.replace(/^Atto\s+[IVXLC]+\s*[—–-]\s*/,'');
export const actNumber=act=>/^(Atto\s+[IVXLC]+)\b/.exec(act.title)?.[1]||act.title;
