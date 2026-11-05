// Allievo finto: gioca l'Atto I di LAIKA dall'inizio alla fine come uno studente e scrive tutto quello che vede.
// Serve per le revisioni didattiche (docs/laika/revisioni/), non è un test: non fa asserzioni.
// Uso: npm run serve (in un altro terminale), poi
//   npm run allievo                       telefono 390x844, scelte casuali con seme 7
//   SEED=11 W=1440 H=900 PICK=first npm run allievo
// Variabili: OUT (cartella, predefinita .artifacts/allievo), W e H (finestra), SEED, PICK (mix, first, last),
// CHROME_BIN (Chromium da usare se Playwright non ha il suo). Scrive trascrizione.md e una schermata per passo.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');

const OUT=process.env.OUT||path.join(__dirname,'..','.artifacts','allievo');fs.mkdirSync(OUT,{recursive:true});
const W=+(process.env.W||390),H=+(process.env.H||844),PICK=process.env.PICK||'mix';
const log=fs.createWriteStream(path.join(OUT,'trascrizione.md'));
let n=0,finito=false,bloccato=false;const testi=[];const rnd=(()=>{let s=+(process.env.SEED||7);return()=>{s=(s*16807)%2147483647;return s/2147483647;};})();
(async()=>{
 const b=await chromium.launch(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{});
 const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:W<500});const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const fine=()=>p.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})))).catch(()=>{});
 const ORIGIN=process.env.ORIGIN||'http://127.0.0.1:4173';const t0=Date.now();let clicks=0;
 const dump=async(tag)=>{n++;await fine();const f=String(n).padStart(3,'0')+'-'+tag+'.png';
  if(n%1===0)await p.screenshot({path:path.join(OUT,f),fullPage:true});
  const txt=await p.evaluate(()=>{const g=s=>document.querySelector(s)?.innerText?.trim()||'';return [g('#hub')&&getComputedStyle(document.querySelector('#hub')).display!=='none'?g('#hub'):'',g('#scene-title'),g('.turn-label'),g('#caption'),g('#panel')].filter(Boolean).join('\n---\n')}).catch(()=>'');
  testi.push(txt);log.write('\n\n## '+n+' · '+tag+' ('+f+')\n\n'+txt.slice(0,4000)+'\n');};
 const click=async l=>{clicks++;await l.click();};
 const pick=async sel=>{const all=p.locator(sel);const c=await all.count();let i=PICK==='first'?0:PICK==='last'?c-1:Math.floor(rnd()*c);
   const lab=(await all.nth(i).innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,120);log.write('\n> SCELGO: '+lab+'\n');await click(all.nth(i));};
 await p.goto(ORIGIN+'/');await dump('home');
 await click(p.locator('#inizia'));await p.locator('#hub-title').waitFor();await dump('atto');
 for(let g=0;g<900;g++){
  if(await p.locator('#summary-title').isVisible().catch(()=>false)){await dump('fine');finito=true;break;}
  if(await p.locator('[data-hub=go]:visible').count()){await dump('hub');await click(p.locator('[data-hub=go]:visible').first());continue;}
  if(await p.locator('[data-answer]').count()){await dump('verifica');await pick('[data-answer]');await dump('verifica-esito');await click(p.locator('[data-action=advance]'));continue;}
  if(await p.locator('form input[type=number]').count()){await dump('form');const ins=p.locator('form input[type=number]');const c=await ins.count();
    const N=await p.evaluate(()=>{const m=document.querySelector('#panel').innerText.match(/Disponibili: (\d+)/);return m?+m[1]:5});
    const mx=[];for(let i=0;i<c;i++)mx.push(+(await ins.nth(i).getAttribute('max')||99));const v=Array(c).fill(0);for(let k=0;k<N;k++){let j;do{j=Math.floor(rnd()*c)}while(v[j]>=mx[j]);v[j]++;}for(let i=0;i<c;i++)await ins.nth(i).fill(String(v[i]));log.write('\n> DISTRIBUISCO: '+v.join(',')+'\n');
    await click(p.locator('form button[type=submit]'));
    await p.locator('[data-action=advance]').waitFor({timeout:4000});await dump('form-esito');await click(p.locator('[data-action=advance]'));continue;}
  if(await p.locator('[data-role]').count()&&await p.locator('[data-choice]').count()){const r=await p.locator('[data-role]').count();for(let i=0;i<r;i++){await click(p.locator('[data-role]').nth(i));}await dump('ruoli');await pick('[data-choice]');await p.locator('[data-action=advance]').waitFor();await dump('ruoli-esito');await click(p.locator('[data-action=advance]'));continue;}
  if(await p.locator('[data-source]').count()){const s=await p.locator('[data-source]').count();for(let i=0;i<s;i++){const x=p.locator('[data-source]').nth(i);if(await x.getAttribute('aria-expanded')!=='true')await click(x);}await dump('fonti');await p.locator('[data-choice]').first().waitFor({timeout:3000});await pick('[data-choice]');await p.locator('[data-action=advance]').waitFor();await dump('fonti-esito');await click(p.locator('[data-action=advance]'));continue;}
  if(await p.locator('[data-choice]').count()&&!(await p.locator('.turn-label').count())){await dump('scelta');await pick('[data-choice]');await p.locator('[data-action=advance]').waitFor();await dump('scelta-esito');await click(p.locator('[data-action=advance]'));continue;}
  if(await p.locator('[data-card=next]').count()){await dump('card');await click(p.locator('[data-card=next]'));continue;}
  if(await p.locator('[data-turn=card]').count()){await dump('turn-card');await click(p.locator('[data-turn=card]'));continue;}
  if(!(await p.locator('.turn-label').count())&&await p.locator('[data-action=advance]').count()){await dump('racconto');await click(p.locator('[data-action=advance]'));continue;}
  // salario a monete
  if(await p.locator('[data-turn=confirm]').count()&&await p.locator('[data-place][data-delta="1"]').count()){
    for(const [id,k] of Object.entries({pane:3,stanza:2,carbone:1,villaggio:1,corso:1}))for(let i=0;i<k;i++){const x=p.locator('[data-place="'+id+'"][data-delta="1"]');if(await x.count()&&await x.isEnabled())await click(x);}
    // Gestioni con altre pedine (strisce del mir, monete del salario): si completano le pedine che restano su posti a rotazione.
    for(let k=0;k<30&&await p.locator('[data-turn=confirm]:disabled').count();k++){const plus=p.locator('[data-place][data-delta="1"]:enabled'),n=await plus.count();if(!n)break;await click(plus.nth(k%n));}
    await dump('salario');if(await p.locator('[data-turn=confirm]:disabled').count()){log.write('\n> BLOCCATO salario\n');break;}
    await click(p.locator('[data-turn=confirm]'));await dump('salario-esito');continue;}
  // settimana con persone
  if(await p.locator('[data-turn=confirm]').count()&&await p.locator('[data-worker]').count()){
    const ws=await p.locator('[data-worker]').evaluateAll(l=>l.map(x=>x.dataset.worker));
    for(const w of ws){await click(p.locator('[data-worker="'+w+'"]'));const t=p.locator('[data-target]:not([disabled])');const c=await t.count();if(c){const ids=await t.evaluateAll(l=>l.map(x=>x.dataset.target));const pref=['corvee','campo'];let id=ids[Math.floor(rnd()*ids.length)];if(rnd()<0.6)id=pref.find(x=>ids.includes(x))||id;await click(p.locator('[data-target="'+id+'"]:not([disabled])'));}}
    await dump('tabellone');if(await p.locator('[data-turn=confirm]:disabled').count()){log.write('\n> BLOCCATO tabellone\n');await dump('bloccato');
      for(const w of ws){await click(p.locator('[data-worker="'+w+'"]'));const t=p.locator('[data-target=campo]:not([disabled])');if(await t.count())await click(t);}}
    await click(p.locator('[data-turn=confirm]'));await dump('tabellone-esito');continue;}
  if(await p.locator('[data-turn=confirm]').count()&&!(await p.locator('[data-turn=confirm]:disabled').count())&&!(await p.locator('[data-hotspot]:not([disabled])').count())){await dump('conferma');await click(p.locator('[data-turn=confirm]'));continue;}
  if(await p.locator('[data-turn=leave]').count()){await dump('fiera');const isPool=await p.locator('.turn-pool').count();
    if(isPool){for(let k=0;k<6;k++){const o=p.locator('[data-offer]:not([disabled])');if(!(await o.count()))break;await pick('[data-offer]:not([disabled])');await p.waitForTimeout(150);await dump('azione');}}
    else{const o=p.locator('[data-offer]:not([disabled])');if(await o.count()&&rnd()<0.5){await pick('[data-offer]:not([disabled])');}}
    await click(p.locator('[data-turn=leave]'));continue;}
  if(await p.locator('[data-turn-choice]:not([disabled])').count()){await dump('decisione');await pick('[data-turn-choice]:not([disabled])');continue;}
  // punti azione: hotspot o pulsanti azione
  if(await p.locator('[data-hotspot]:not([disabled])').count()||await p.locator('[data-act]:not([disabled])').count()){await dump('azioni');const sel=await p.locator('[data-act]:not([disabled])').count()?'[data-act]:not([disabled])':'[data-hotspot]:not([disabled])';await pick(sel);
    continue;}
  if(await p.locator('[data-turn=continue]').count()){await dump('continua');await click(p.locator('[data-turn=continue]'));continue;}
  if(await p.locator('[data-turn=confirm]').count()){await dump('conferma2');await click(p.locator('[data-turn=confirm]'));continue;}
  if(await p.locator('[data-action=advance]').count()){await dump('avanti');await click(p.locator('[data-action=advance]'));continue;}
  bloccato=true;await dump('BLOCCO');log.write('\n> NESSUN COMANDO. HTML pulsanti: '+(await p.locator('#panel button').evaluateAll(l=>l.map(b=>b.outerHTML.slice(0,160)).join('\n')))+'\n');break;
 }
 log.write('\n\n# Fine. Click: '+clicks+'. Tempo: '+Math.round((Date.now()-t0)/1000)+'s. Errori: '+JSON.stringify(errs)+'\n');
 // Controlli automatici (METODO §7, G2): una partita intera senza errori e senza i difetti già visti nelle revisioni.
 const tutto=testi.join('\n'),controlli=[
  ['partita arrivata al riepilogo finale',finito],['nessuna pagina senza comandi',!bloccato],['nessun errore nella console',errs.length===0],
  ['nessuna didascalia generica «Scena della simulazione»',!/Scena della simulazione/.test(tutto)],
  ['nessun numero negativo nelle previsioni',!/ne restano -\d/.test(tutto)],
  ['nessuna nota di lavoro nei testi (D-010)',!/\b(da riscontrare|in preparazione|prova tecnica|bozza|TODO)\b/i.test(tutto)],
  ['nessun «anime e semidei» (D-037)',!/anime e semidei/i.test(tutto)],
  ['nessun pulsante «Torna a casa» nelle giornate a punti azione',!/Punti azione:[\s\S]{0,1500}TORNA A CASA/.test(tutto)]];
 const falliti=controlli.filter(c=>!c[1]);
 fs.writeFileSync(path.join(OUT,'controlli.json'),JSON.stringify({passi:n,tocchi:clicks,controlli:Object.fromEntries(controlli)},null,1));
 log.write('\n# Controlli\n'+controlli.map(c=>(c[1]?'- ok ':'- NO ')+c[0]).join('\n')+'\n');
 console.log(controlli.map(c=>(c[1]?'ok  ':'NO  ')+c[0]).join('\n'));
 log.end();await b.close();
 if(falliti.length)process.exitCode=1;
})().catch(e=>{log.write('\n\nECCEZIONE '+e.stack);log.end();process.exit(1)});
