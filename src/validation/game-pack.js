import {validateGame,assert} from '../core/schema.js';
import {composePack} from '../visual/compose.js';
import {validateStage} from '../visual/stage.js';
// Shared preflight for authoring CLI and runtime: no browser or game-specific data.
export function validatePack(raw){
  const game=composePack(raw);
  validateGame(game);
  for(const act of game.acts)for(const episode of act.episodes){
    const cues=[episode.motionId,episode.resultMotionId,...(episode.choices||[]).map(c=>c.motionId)].filter(Boolean);
    assert(!cues.length||episode.stageId,'Una sequenza richiede una scenografia');
    if(!episode.stageId)continue;
    const stage=game.stages.find(s=>s.id===episode.stageId);
    try {validateStage(stage,act);} catch(error) {throw new Error('Atto '+act.id+' / episodio '+episode.id+' / scenografia '+stage.id+': '+error.message);}
    for(const cue of cues)assert(stage.sequences?.some(s=>s.id===cue),'Sequenza episodio sconosciuta: '+cue);
  }
  for(const stage of game.stages||[])if(!game.acts.some(a=>a.episodes.some(e=>e.stageId===stage.id))) {
    assert(!(stage.bindings||[]).length,'Scenografia con binding non usata: '+stage.id);validateStage(stage,{});
  }
  return game;
}
