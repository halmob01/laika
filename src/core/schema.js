import {validateTurnGame} from './turns.js';
export const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export const assert = (ok, message) => { if (!ok) throw new Error(message); };
export const text = v => typeof v === 'string' && v.trim().length > 0;
export const id = v => text(v) && /^[a-z][a-z0-9_-]*$/.test(v) && !['constructor','prototype','__proto__'].includes(v);
export const TYPES = ['narrative','choice','resource_allocation','role_crisis','source_comparison','assessment','turn_game'];
export const GROUPS = {metric:'metrics',resource:'resources',relation:'relations'};
export function jsonData(value, depth = 0) {
  assert(depth < 40, 'Dati troppo annidati');
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return;
  if (typeof value === 'number') { assert(Number.isFinite(value), 'Numero non finito'); return; }
  assert(value && typeof value === 'object', 'Sono ammessi soltanto dati JSON');
  assert(Array.isArray(value) || [Object.prototype,null].includes(Object.getPrototypeOf(value)), 'Oggetto non JSON');
  for (const [key, child] of Object.entries(value)) {
    assert(!['__proto__','constructor','prototype'].includes(key), 'Chiave non sicura');
    jsonData(child, depth + 1);
  }
}
export function unique(items, label, min = 0) {
  assert(Array.isArray(items) && items.length >= min, label + ': elenco mancante');
  const ids = new Set();
  for (const item of items) { assert(item && id(item.id) && !ids.has(item.id), label + ': ID non valido/duplicato'); ids.add(item.id); }
  return ids;
}
export const defs = (act, kind) => act[GROUPS[kind]] || [];
export function target(act, kind, key) {
  assert(own(GROUPS,kind) && defs(act,kind).some(x=>x.id===key), 'Destinazione non dichiarata: '+key);
}
export function condition(c, act, depth=0) {
  if (c === undefined) return;
  assert(c && typeof c==='object' && depth<15, 'Condizione non valida');
  if (c.op==='all' || c.op==='any') {
    assert(Array.isArray(c.items) && c.items.length>0, 'Condizione composta vuota');
    c.items.forEach(x=>condition(x,act,depth+1));
  } else if (c.op==='not') { assert(c.item !== undefined,'Condizione not vuota'); condition(c.item,act,depth+1); }
  else if (c.op==='flag') assert(act.flags.includes(c.id) && typeof c.value==='boolean','Flag non dichiarato');
  else if (c.op==='event') assert(act.episodes.some(e=>e.id===c.id),'Evento non dichiarato');
  else {
    assert(['eq','gte','lte','gt','lt'].includes(c.op),'Operatore sconosciuto');
    target(act,c.kind,c.id); assert(Number.isFinite(c.value),'Soglia non valida');
  }
}
export function mutations(items, act) {
  assert(Array.isArray(items),'Effetti non validi');
  for (const e of items) {
    if (e.kind==='flag') assert(act.flags.includes(e.id) && typeof e.value==='boolean','Mutazione flag non valida');
    else { target(act,e.kind,e.id); assert(Number.isFinite(e.delta),'Delta non valido'); }
  }
}
function outcome(o,act,delayedIds) {
  assert(text(o.feedback),'Feedback mancante'); mutations(o.effects||[],act);
  for (const d of o.delayed||[]) {
    assert(id(d.id)&&!delayedIds.has(d.id),'Effetto differito duplicato'); delayedIds.add(d.id);
    assert(text(d.explanation)&&d.onExit==='discard','Descrivere effetto e politica di uscita');
    assert((Number.isInteger(d.afterTurns)&&d.afterTurns>=1) !== (typeof d.episodeId==='string'),'Indicare un solo trigger differito');
    if (d.episodeId) assert(act.episodes.some(e=>e.id===d.episodeId),'Episodio differito inesistente');
    assert(Number.isInteger(d.expiresAfterTurns)&&d.expiresAfterTurns>=0,'Scadenza differita non valida');
    condition(d.when,act); mutations(d.effects,act);
  }
}
export function validateGame(game) {
  jsonData(game);
  assert(game.schemaVersion===1 && id(game.id)&&text(game.contentVersion)&&text(game.title),'Manifest non valido');
  unique(game.acts,'Atti',1);
  assert(Array.isArray(game.exposureFlags)&&new Set(game.exposureFlags).size===game.exposureFlags.length&&game.exposureFlags.every(id),'Exposure flags non validi');
  const guaranteed = new Set(),questionIds=new Set();
  const stages=unique(game.stages||[],'Scenografie');
  for (const act of game.acts) {
    assert(text(act.title)&&text(act.reconciliation),'Atto senza titolo/confronto');
    unique(act.actors,'Attori',1); const roles=unique(act.roles,'Ruoli',1);
    for (const role of act.roles) assert(text(role.label)&&text(role.mandate)&&act.actors.some(a=>a.id===role.actorId),'Ruolo non valido');
    for (const kind of Object.keys(GROUPS)) {
      unique(defs(act,kind),kind);
      for (const d of defs(act,kind)) {
        assert(text(d.label)&&[d.min,d.max,d.start].every(Number.isFinite)&&d.min<d.max&&d.start>=d.min&&d.start<=d.max,'Range non valido');
        if(kind==='relation') assert(act.actors.some(a=>a.id===d.from)&&act.actors.some(a=>a.id===d.to),'Attori della relazione non validi');
      }
    }
    assert(Array.isArray(act.flags)&&act.flags.every(id)&&new Set(act.flags).size===act.flags.length,'Flag non validi');
    unique(act.episodes,'Episodi',1); const delayedIds=new Set();
    const incoming=act.episodes.map(()=>[]); incoming[0].push(new Set(guaranteed));
    const exits=[];
    act.episodes.forEach((e,index)=>{
      try {
      assert(TYPES.includes(e.type)&&text(e.title)&&text(e.text)&&roles.has(e.roleId),'Episodio non valido');
      if(e.context!==undefined)validateContext(e.context);
      // Racconto a card: un paragrafo per card, solo per episodi narrativi con almeno due paragrafi.
      if(e.display!==undefined)assert(e.display==='cards'&&e.type==='narrative'&&e.text.split(/\n\s*\n/).filter(x=>x.trim()).length>=2,'Presentazione a card non valida: '+e.id);
      if(e.stageId) assert(stages.has(e.stageId),'Scenografia sconosciuta');
      for(const f of e.exposes||[]) assert(game.exposureFlags.includes(f),'Esposizione non dichiarata');
      assert(incoming[index].length,'Episodio irraggiungibile: '+e.id);
      const seen=new Set([...incoming[index][0]].filter(f=>incoming[index].every(s=>s.has(f))));
      if(['choice','role_crisis','source_comparison'].includes(e.type)) {
        unique(e.choices,'Scelte',2);
        for(const c of e.choices) {
          assert(text(c.label),'Scelta senza testo'); condition(c.when,act); outcome(c,act,delayedIds);
          if(c.roles) assert(Array.isArray(c.roles)&&c.roles.length&&c.roles.every(r=>roles.has(r)),'Ruoli della scelta non validi');
        }
        const allowed=e.type==='role_crisis' ? e.roles : [e.roleId];
        assert(Array.isArray(allowed)&&allowed.length&&allowed.every(r=>roles.has(r))&&allowed.includes(e.roleId),'Ruoli della crisi non validi');
        for(const r of allowed) assert(e.choices.some(c=>!c.when&&(!c.roles||c.roles.includes(r))),'Serve una scelta incondizionata per ogni ruolo');
      }
      if(e.type==='resource_allocation') {
        assert(Number.isInteger(e.budget)&&e.budget>=1,'Budget non valido'); unique(e.buckets,'Allocazioni',2);
        for(const b of e.buckets) { assert(text(b.label)&&Number.isInteger(b.max)&&b.max>=0,'Destinazione allocazione non valida'); mutations(b.perUnit,act); assert(b.perUnit.every(m=>m.kind!=='flag'),'Allocazione solo numerica'); }
        assert(e.buckets.reduce((n,b)=>n+b.max,0)>=e.budget,'Budget impossibile da distribuire'); outcome(e,act,delayedIds);
      }
      if(e.type==='turn_game') { assert(e.stageId,'La partita a turni richiede una scenografia per il tabellone'); validateTurnGame(e,act,stages); }
      if(e.type==='source_comparison') {
        unique(e.sources,'Fonti',2);
        e.sources.forEach(s=>assert(text(s.title)&&text(s.text)&&text(s.provenance),'Fonte senza provenienza'));
      }
      if(e.type==='assessment') {
        const q=e.question; assert(q&&id(q.id)&&text(q.prompt)&&text(q.rationale)&&text(q.source),'Quesito incompleto');
        assert(!questionIds.has(q.id),'ID quesito duplicato nel pacchetto');questionIds.add(q.id);
        assert(Array.isArray(q.objectives)&&q.objectives.length&&q.objectives.every(text),'Obiettivi mancanti');
        unique(q.options,'Risposte',2); q.options.forEach(o=>assert(text(o.label),'Risposta vuota'));
        assert(q.options.some(o=>o.id===q.correctId),'Chiave non valida');
        assert(Array.isArray(q.requiredExposureFlags)&&q.requiredExposureFlags.length,'Prerequisiti mancanti');
        q.requiredExposureFlags.forEach(f=>assert(seen.has(f),'Quesito su contenuti non garantiti: '+f));
      }
      const outgoing=new Set([...seen,...(e.exposes||[])]);
      const destinations=[];
      for(const b of e.branches||[]) {condition(b.when,act);assert(b.when,'Ramo senza condizione');destinations.push(b.to);}
      const fallback=e.next ?? (act.episodes[index+1]?.id || 'end'); destinations.push(fallback);
      for(const dest of destinations) {
        if(dest==='end') exits.push(outgoing);
        else {const i=act.episodes.findIndex(x=>x.id===dest);assert(i>index,'I rami devono avanzare verso episodi esistenti');incoming[i].push(outgoing);}
      }
      } catch(error) {throw new Error('Atto '+act.id+' / episodio '+e.id+': '+error.message);}
    });
    assert(exits.length,'Atto senza uscita');
    for(const f of [...exits[0]].filter(f=>exits.every(s=>s.has(f)))) guaranteed.add(f);
  }
  return game;
}

export const CONTEXT_LABELS={documented:'Contesto documentato',simulation:'Simulazione',source:'Fonte',assessment:'Verifica formativa'};
export function validateContext(c){
 assert(c&&typeof c==='object'&&!Array.isArray(c)&&typeof c.kind==='string'&&own(CONTEXT_LABELS,c.kind),'Contesto non valido');
 assert(Object.keys(c).every(k=>['kind','dateLabel','placeLabel'].includes(k)),'Campo contesto sconosciuto');
 for(const key of ['dateLabel','placeLabel'])if(c[key]!==undefined)assert(text(c[key]),'Etichetta contesto non valida');
 return c;
}
export const contextLabel=c=>[CONTEXT_LABELS[c.kind],c.dateLabel,c.placeLabel].filter(Boolean).join(' · ');
