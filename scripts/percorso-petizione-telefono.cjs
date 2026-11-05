// Percorso sul telefono (390x844) della petizione: tre sere, misura le etichette sulla scena e salva le schermate. Serve npm run serve su 4173.
// Uso: node scripts/percorso-petizione-telefono.cjs  (OUT=cartella per le schermate)
const {chromium}=require('playwright');const fs=require('node:fs');
const OUT=process.env.OUT||require('node:path').join(__dirname,'..','.artifacts','petizione-telefono');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://127.0.0.1:4173/play.html?game=laika&atto=atto-2');await p.locator('#hub-title').waitFor();
 await p.locator('[data-unit="petizione"] [data-unit-start]').click();await p.locator('[data-hub=go]').click();await p.locator('#scene-title').waitFor();
 let n=0;const shot=async tag=>{n++;await p.screenshot({path:OUT+'/'+String(n).padStart(2,'0')+'-'+tag+'.png',fullPage:true});};
 const overlap=async tag=>{const r=await p.evaluate(()=>{const bs=[...document.querySelectorAll('.turn-overlay [data-hotspot]')].map(b=>({id:b.dataset.hotspot,...b.getBoundingClientRect().toJSON()}));const st=document.querySelector('#stage').getBoundingClientRect();const bad=[];for(const a of bs)for(const c of bs)if(a.id<c.id&&a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)bad.push(a.id+'/'+c.id);const out=bs.filter(a=>a.left<st.left-1||a.right>st.right+1||a.bottom>st.bottom+1).map(a=>a.id);return {n:bs.length,bad,out};});console.log(tag,JSON.stringify(r));return r;};
 let sere=0,problemi=0;
 for(let g=0;g<300;g++){
  if(await p.locator('[data-turn=card]').count()){await shot('card');await p.locator('[data-turn=card]').click();continue;}
  if(await p.locator('[data-turn=confirm]').count()){
   const r=await overlap('sera'+(sere+1));problemi+=r.bad.length+r.out.length;await shot('sera'+(sere+1)+'-inizio');
   const piano=['firme','firme','salario','gapon','libera','polizia'];
   for(const id of piano){const b=p.locator('[data-hotspot="'+id+'"]:not([disabled])');if(await b.count())await b.click();}
   await shot('sera'+(sere+1)+'-posti');
   await p.locator('[data-turn=confirm]').click();sere++;await shot('esito'+sere);continue;}
  if(await p.locator('[data-turn=continue]').count()){await p.locator('[data-turn=continue]').click();continue;}
  if(await p.locator('[data-turn-choice]').count()){await shot('evento');await p.locator('[data-turn-choice]').first().click();continue;}
  if(await p.locator('[data-action=advance]').count()){await shot('avanti');await p.locator('[data-action=advance]').click();continue;}
  if(await p.locator('[data-answer]').count()){await shot('verifica');await p.locator('[data-answer]').first().click();await p.locator('[data-action=advance]').waitFor();await shot('verifica-esito');break;}
  await p.waitForTimeout(200);
 }
 console.log('sere',sere,'problemi',problemi,'errori',JSON.stringify(errs));await b.close();})();
