import {assert} from '../core/schema.js';
export function assess(question,answerId,exposures) {
  assert(question.requiredExposureFlags.every(f=>exposures.includes(f)),'Prima completa le attività richieste');
  assert(question.options.some(o=>o.id===answerId),'Risposta inesistente');
  return {questionId:question.id,answerId,correct:answerId===question.correctId,feedback:question.rationale};
}
export function report(results) {
  return {count:results.length,score:results.length?Math.round(100*results.filter(r=>r.correct).length/results.length):null};
}
// Stable per session/question, independent from render order and from the answer key.
export function optionOrder(question,seed) {
  let n=2166136261;
  for(const c of seed+':'+question.id)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;
  const options=question.options.slice();
  for(let i=options.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[options[i],options[j]]=[options[j],options[i]];}
  return options;
}
