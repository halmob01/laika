// Percorso sul telefono (390x844) di un'unità a punti azione sulla scena: gioca le giornate comprando le azioni indicate, misura le etichette
// (nessuna sovrapposta o fuori scena) e salva le schermate. Serve npm run serve su 4173.
// Uso: UNIT=concessioni PLAN=chiedere,piazza,ministro,duma node scripts/percorso-punti-telefono.cjs   (ATTO=atto-2, OUT=cartella, FLAG non gestito: il soviet decide con il suo gioco)
const {chromium}=require('playwright');const fs=require('node:fs'),path=require('node:path');
const UNIT=process.env.UNIT||'soviet',PLAN=(process.env.PLAN||'').split(',').filter(Boolean),ATTO=process.env.ATTO||'atto-2';
const OUT=process.env.OUT||path.join(__dirname,'..','.artifacts',UNIT+'-telefono');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://127.0.0.1:4173/play.html?game=laika&atto='+ATTO);await p.locator('#hub-title').waitFor();
 await p.locator('[data-unit="'+UNIT+'"] [data-unit-start]').click();await p.locator('[data-hub=go]').click();await p.locator('#scene-title').waitFor();
 let n=0,giorni=0,problemi=0;const shot=async tag=>{n++;await p.screenshot({path:OUT+'/'+String(n).padStart(2,'0')+'-'+tag+'.png',fullPage:true});};
 const overlap=async tag=>{const r=await p.evaluate(()=>{const bs=[...document.querySelectorAll('.turn-overlay [data-hotspot]')].map(b=>({id:b.dataset.hotspot,...b.getBoundingClientRect().toJSON()}));const st=document.querySelector('#stage').getBoundingClientRect();const bad=[];for(const a of bs)for(const c of bs)if(a.id<c.id&&a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)bad.push(a.id+'/'+c.id);const out=bs.filter(a=>a.left<st.left-1||a.right>st.right+1||a.bottom>st.bottom+1).map(a=>a.id);return {n:bs.length,bad,out};});console.log(tag,JSON.stringify(r));problemi+=r.bad.length+r.out.length;};
 for(let g=0;g<300;g++){
  if(await p.locator('[data-turn=card]').count()){await shot('card');await p.locator('[data-turn=card]').click();continue;}
  if(await p.locator('[data-turn=leave]').count()){giorni++;await overlap('giorno'+giorni+'-inizio');await shot('giorno'+giorni+'-inizio');
   for(const o of PLAN){const btn=p.locator('[data-hotspot="'+o+'"]:not([disabled])');if(await btn.count()){await btn.click();await p.waitForTimeout(100);await overlap('giorno'+giorni+'-dopo-'+o);}else console.log('giorno'+giorni,o,'non disponibile (chiuso o punti finiti)');}
   await shot('giorno'+giorni+'-fine');await p.locator('[data-turn=leave]').click();continue;}
  if(await p.locator('[data-action=advance]').count()){await shot('avanti');await p.locator('[data-action=advance]').click();continue;}
  if(await p.locator('[data-answer]').count()){await shot('verifica');await p.locator('[data-answer]').first().click();await p.locator('[data-action=advance]').waitFor();await shot('verifica-esito');break;}
  await p.waitForTimeout(200);
 }
 console.log('giornate',giorni,'sovrapposizioni o etichette fuori scena',problemi,'errori',JSON.stringify(errs));await b.close();})();
