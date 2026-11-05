// Percorso sul telefono (390x844) delle giornate del soviet: tre giornate (PLAN=radicale per l'altra linea), misura le etichette e salva le schermate. Serve npm run serve su 4173.
// Uso: node scripts/percorso-soviet-telefono.cjs
const {chromium}=require('playwright');const fs=require('node:fs');
const OUT=process.env.OUT||require('node:path').join(__dirname,'..','.artifacts','soviet-telefono');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://127.0.0.1:4173/play.html?game=laika&atto=atto-2');await p.locator('#hub-title').waitFor();
 await p.locator('[data-unit="soviet"] [data-unit-start]').click();await p.locator('[data-hub=go]').click();await p.locator('#scene-title').waitFor();
 let n=0;const shot=async tag=>{n++;await p.screenshot({path:OUT+'/'+String(n).padStart(2,'0')+'-'+tag+'.png',fullPage:true});};
 const overlap=async tag=>{const r=await p.evaluate(()=>{const bs=[...document.querySelectorAll('.turn-overlay [data-hotspot]')].map(b=>({id:b.dataset.hotspot,...b.getBoundingClientRect().toJSON()}));const st=document.querySelector('#stage').getBoundingClientRect();const bad=[];for(const a of bs)for(const c of bs)if(a.id<c.id&&a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)bad.push(a.id+'/'+c.id);const out=bs.filter(a=>a.left<st.left-1||a.right>st.right+1).map(a=>a.id);return {n:bs.length,bad,out};});console.log(tag,JSON.stringify(r));return r;};
 const plan=process.env.PLAN==='radicale'?['indtess','peso-radicale','treni','delegato']:['indtess','peso-moderato','tavolo','distribuire'];
 let giorno=0,problemi=0;
 for(let g=0;g<200;g++){
  if(await p.locator('#summary-title').isVisible().catch(()=>false)||await p.locator('[data-action=advance]').count()&&!(await p.locator('.turn-label').count())&&giorno>=3)break;
  if(await p.locator('[data-turn=card]').count()){await shot('card');await p.locator('[data-turn=card]').click();continue;}
  if(await p.locator('[data-turn=leave]').count()){giorno++;
   const r0=await overlap('giorno'+giorno+'-inizio');problemi+=r0.bad.length+r0.out.length;await shot('giorno'+giorno+'-inizio');
   for(const o of plan){const btn=p.locator('[data-hotspot="'+o+'"]:not([disabled])');if(await btn.count()){await btn.click();await p.waitForTimeout(100);const r=await overlap('giorno'+giorno+'-dopo-'+o);problemi+=r.bad.length+r.out.length;}else console.log('giorno'+giorno,o,'non disponibile (chiuso o punti finiti)');}
   await shot('giorno'+giorno+'-fine');await p.locator('[data-turn=leave]').click();continue;}
  if(await p.locator('[data-action=advance]').count()){await shot('avanti');await p.locator('[data-action=advance]').click();continue;}
  if(await p.locator('[data-answer]').count()){await shot('verifica');await p.locator('[data-answer]').first().click();await p.locator('[data-action=advance]').waitFor();await shot('verifica-esito');break;}
  await p.waitForTimeout(200);
 }
 console.log('giorni giocati',giorno,'sovrapposizioni o etichette fuori scena',problemi,'errori',JSON.stringify(errs));await b.close();})();
