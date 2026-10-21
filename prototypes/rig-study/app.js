import {composePack} from '../../src/visual/compose.js';
import {createStage,validateStage} from '../../src/visual/stage.js';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const embedded=$('rig-asset');
const symbol=embedded?JSON.parse(embedded.textContent):await fetch('./assets/dog.json').then(r=>{if(!r.ok)throw Error('Asset non disponibile');return r.json();});
const media=matchMedia('(prefers-reduced-motion: reduce)');$('reduce').checked=media.matches;
let descriptor,controls,debugQueued=false;
function drawDebug(){
 debugQueued=false;const overlay=$('debug-overlay');overlay.replaceChildren();if(!$('debug').checked)return;
 const svg=$('stage').querySelector('svg');if(!svg)return;
 overlay.setAttribute('viewBox',svg.getAttribute('viewBox'));overlay.setAttribute('preserveAspectRatio','xMidYMid meet');
 const inv=svg.getScreenCTM()?.inverse();if(!inv)return;
 const add=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));overlay.append(n);};
 for(const layer of descriptor.layers){if(!layer.origin)continue;const n=svg.querySelector('[data-layer="'+layer.id+'"]');if(!n)continue;
  const matrix=inv.multiply(n.getScreenCTM()),p=new DOMPoint(...layer.origin).matrixTransform(matrix),b=n.getBBox();
  add('circle',{cx:p.x,cy:p.y,r:2.5,fill:'#cc2a25',stroke:'#fff','stroke-width':.7});
  const points=[[b.x,b.y],[b.x+b.width,b.y],[b.x+b.width,b.y+b.height],[b.x,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(matrix));
  add('polygon',{points:points.map(p=>p.x+','+p.y).join(' '),fill:'none',stroke:'#248293','stroke-width':.6});
 }
}
function queueDebug(){if(!$('debug').checked){$('debug-overlay').replaceChildren();return;}if(!debugQueued){debugQueued=true;requestAnimationFrame(drawDebug);}}
controls=createStage($('stage'),{reducedMotion:media.matches,onCaption:t=>$('caption').textContent=t,onStatus:s=>{$('status').textContent=s==='playing'?'Sequenza in corso':s==='paused'?'In pausa':'Posa statica';queueDebug();},onProgress:(t,total)=>{$('time').max=Math.max(1,total);$('time').value=t;queueDebug();}});
function mount(pose){
 const n=Number($('count').value),columns=n===1?1:n===12?4:6,rows=Math.ceil(n/columns),art=structuredClone(symbol);
 if(pose)for(const l of art.layers)if(Object.hasOwn(pose,l.id))l.pose={...l.pose,rotate:pose[l.id]};
 const components=Array.from({length:n},(_,i)=>({id:'dog-'+i,symbol:art.id,pose:{translateX:(i%columns)*250,translateY:Math.floor(i/columns)*265}}));
 const rigs=motion=>components.map((c,i)=>({target:c.id,motion,at:(i%8)*90}));
 const raw={symbols:[art],stages:[{id:'rig-study',label:'Cane con collare rosso: studio del gesto',viewBox:[0,0,250*columns,265*rows],duration:700,layers:[],components,sequences:pose?[]:[{id:'walk',caption:'Un passo illustrato, poi il ritorno alla posa di riposo.',rigs:rigs('walk')},{id:'attention',caption:'La testa si orienta, l’orecchio accompagna il gesto.',rigs:rigs('attention')}]}]};
 descriptor=composePack(raw).stages[0];validateStage(descriptor,{metrics:[],resources:[],relations:[]});controls.mount(descriptor,{});controls.setTexturesEnabled($('texture').checked);queueDebug();
}
const start=id=>{mount();controls.sequence(id);};
$('walk').onclick=()=>start('walk');$('gesture').onclick=()=>start('attention');$('pause').onclick=()=>controls.paused?controls.resume():controls.pause();$('skip').onclick=()=>controls.skip();$('replay').onclick=()=>controls.replay();$('reset').onclick=()=>{mount();$('angle').value=0;$('angle-value').value='0°';};
$('time').oninput=()=>controls.seek(Number($('time').value));$('texture').onchange=()=>controls.setTexturesEnabled($('texture').checked);$('debug').onchange=queueDebug;$('count').onchange=()=>mount();
$('reduce').onchange=()=>controls.setReducedMotion($('reduce').checked);media.addEventListener('change',e=>{$('reduce').checked=e.matches;controls.setReducedMotion(e.matches);});document.addEventListener('visibilitychange',()=>{if(document.hidden)controls.pause();});
for(const name of Object.keys(symbol.rig.joints)){const o=document.createElement('option');o.value=name;o.textContent=name;$('joint').append(o);}
$('joint').onchange=()=>{const [min,max]=symbol.rig.joints[$('joint').value];$('angle').min=min;$('angle').max=max;$('angle').value=0;$('angle-value').value='0°';mount();};
$('angle').oninput=()=>{const angle=Number($('angle').value);$('angle-value').value=angle+'°';mount({...symbol.rig.poses.rest,[$('joint').value]:angle});};
$('export').onclick=()=>{controls.pause();const svg=$('stage').querySelector('svg').cloneNode(true);svg.setAttribute('xmlns',NS);const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='laika-dog-pose.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
addEventListener('resize',queueDebug);mount();$('status').textContent='Pronto — disegno originale, rig del kit';
