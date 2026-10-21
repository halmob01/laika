import {validatePack} from '../../src/validation/game-pack.js';
import {createStage} from '../../src/visual/stage.js';
const $=id=>document.getElementById(id),embedded=$('motion-pack');
const raw=embedded?JSON.parse(embedded.textContent):await (await fetch('../../games/motion-study/game.json')).json();
const game=validatePack(raw),scene=game.stages[0],sequence=scene.sequences[0];
const preference=matchMedia('(prefers-reduced-motion: reduce)');$('reduce').checked=preference.matches;
const stage=createStage($('stage'),{
 reducedMotion:preference.matches,
 onCaption:text=>{$('caption').textContent=text;},
 onStatus:value=>{$('pause').disabled=value==='finished';$('pause').textContent=value==='paused'?'Riprendi':'Pausa';$('pause').setAttribute('aria-pressed',String(value==='paused'));},
 onProgress:(elapsed,total)=>{$('scrub').value=elapsed;$('time').textContent=(elapsed/1000).toFixed(1)+' / '+(total/1000).toFixed(0)+' s';}
});
let storage=null;try{storage=localStorage;}catch{}
const key=game.id+':'+game.contentVersion;let restored=false;
try{restored=storage?.getItem(key)==='viewed';}catch{}
stage.mount(scene,{});
// Restore the canonical composition, never an untrusted DOM/frame snapshot.
stage.sequence(sequence.id);if(restored)stage.skip();
if(restored)$('restore-note').textContent='Composizione ripristinata. Premi Riproduci per rivedere il movimento.';
try{storage?.setItem(key,'viewed');}catch{$('restore-note').textContent='Ripresa locale non disponibile in questo browser.';}
$('play').onclick=()=>{stage.sequence(sequence.id);$('restore-note').textContent='';};
$('pause').onclick=()=>stage.paused?stage.resume():stage.pause();
$('skip').onclick=()=>stage.skip();
$('scrub').oninput=e=>stage.seek(Number(e.target.value));
for(const button of document.querySelectorAll('[data-time]'))button.onclick=()=>stage.seek(Number(button.dataset.time));
function reduced(value){$('reduce').checked=value;stage.setReducedMotion(value);$('scrub').disabled=value;for(const b of document.querySelectorAll('[data-time]'))b.disabled=value;}
$('reduce').onchange=e=>reduced(e.target.checked);preference.addEventListener('change',e=>reduced(e.matches));reduced(preference.matches);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stage.pause();});
