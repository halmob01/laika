// LAIKA, unità I.1 (gestione a turni) nel player: dalla home alla fine, due strategie, persone mandate nei posti
// (anche toccando la scena) con la figura che si sposta, migliorie, granaio, fiera, reload a metà anno, mobile e desktop.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
module.exports=async(browser,root,artifacts)=>{
 const origin='http://127.0.0.1:4173',out=path.join(artifacts,'i1');fs.mkdirSync(out,{recursive:true});
 // Chi va dove: il costruttore manda il nonno a costruire; l'obbediente tiene tutti tra signore e campo.
 const runs=[{nome:'costruttore',viewport:{width:1440,height:900},costruisce:['nonno']},
  {nome:'obbediente',viewport:{width:390,height:844},costruisce:[],touch:true}];
 for(const run of runs){
  const context=await browser.newContext({viewport:run.viewport,hasTouch:Boolean(run.touch)}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const fine=()=>page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
  const shot=async n=>{await fine();await page.screenshot({path:path.join(out,run.nome+'-'+n+'.png'),fullPage:true});};
  const save=()=>page.evaluate(()=>localStorage.getItem('learning-kit:laika:save-v1'));
  const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
  await page.goto(origin+'/');await page.locator('#inizia').click();await page.locator('#scene-title').waitFor();
  // Redesign: gioco autonomo, marchio del progetto, scena ingrandita su schermi stretti.
  assert.equal(await page.locator('#packs').isVisible(),false,'menu dei laboratori nascosto');
  assert.equal((await page.locator('#home-link').innerText()).trim(),'LAIKA');
  assert.equal(await page.locator('.lead').evaluate(n=>getComputedStyle(n).whiteSpace),'pre-line');
  if(run.viewport.width<=980){const [svgW,stageW]=await page.evaluate(()=>[document.querySelector('#stage svg').getBoundingClientRect().width,document.querySelector('#stage').getBoundingClientRect().width]);assert.ok(svgW>stageW*1.1,'scena ingrandita sul telefono: '+svgW+' su '+stageW);}
  await shot('01-prologo');
  while(await page.locator('[data-card=next]').count())await page.locator('[data-card=next]').click();
  await page.locator('[data-action=advance]').click();await page.locator('.turn-label').waitFor();
  let anno=0,reloaded=false,tappedOnStage=false,fiera=false,costruito=false;const anni=[];
  for(let guard=0;guard<400;guard++){
   if(await page.locator('#summary-title').isVisible())break;
   assert.equal(await overflow(),true,'overflow orizzontale');
   if(await page.locator('[data-answer]').count()){await page.locator('[data-answer=liberta]').click();await shot('90-verifica');await page.locator('[data-action=advance]').click();continue;}
   if(await page.locator('[data-card=next]').count()){await page.locator('[data-card=next]').click();continue;}
   if(!(await page.locator('.turn-label').count())){await page.locator('[data-action=advance]').click();continue;}
   const year=await page.locator('.turn-year').textContent();if(anni.at(-1)!==year){anni.push(year);anno++;}
   if(await page.locator('[data-turn=card]').count()){if([1,2,3,4,8].includes(anno)){const k=await page.locator('.card-bar i').evaluateAll(l=>l.findIndex(x=>x.classList.contains('now')));await page.locator('#skip').click().catch(()=>{});await shot(String(anno).padStart(2,'0')+'-card-'+year+'-'+(k+1));}await page.locator('[data-turn=card]').click();continue;}
   if(await page.locator('[data-turn=confirm]').count()){
    assert.match(await page.locator('#caption').textContent(),/tabellone/,'didascalia del tabellone, non della card precedente');
    const people=await page.locator('[data-worker]').evaluateAll(l=>l.map(b=>b.dataset.worker));
    const dovute=await page.evaluate(()=>{const r=document.querySelector('[data-target=corvee]');const m=r?.textContent.match(/dovute al signore: (●+)/);return m?m[1].length:0;});
    const forza={padre:3,madre:2,nonno:1,figlio:anno>=4?3:anno>=2?2:1};
    // Al signore: la combinazione più piccola che copre l'obbligo, tra chi non costruisce.
    const liberi=people.filter(w=>!run.costruisce.includes(w));let best=null;
    for(let m=0;m<1<<liberi.length;m++){const sel=liberi.filter((_,i)=>m>>i&1),n=sel.reduce((a,w)=>a+forza[w],0);if(n>=dovute&&(!best||n*10+sel.length<best.n))best={sel,n:n*10+sel.length};}
    const piano={};for(const w of people)piano[w]=best?.sel.includes(w)?'corvee':run.costruisce.includes(w)?null:'campo';
    for(const w of people.filter(x=>run.costruisce.includes(x))){const lavoro=await page.locator('[data-target].project').evaluateAll(l=>l.map(b=>b.dataset.target));piano[w]=['sokha','orto','stalla','bosco'].find(x=>lavoro.includes(x))||'campo';}
    // Il primo anno la madre si manda toccando il campo sulla scena: la figura deve spostarsi.
    if(!tappedOnStage){await page.locator('[data-worker=madre]').click();const hot=page.locator('[data-hotspot=campo]');assert.equal(await hot.count(),1);
      const box=await hot.boundingBox(),stb=await page.locator('#stage').boundingBox();assert.ok(box.y>=stb.y&&box.y+box.height<=stb.y+stb.height+1,'posto dentro la scena');
      const prima=await page.locator('#stage [data-layer=madre]').getAttribute('transform');await hot.click();await page.waitForFunction(()=>document.querySelector('#stage').dataset.motion!=='playing',null,{timeout:5000});
      const dopo=await page.locator('#stage [data-layer=madre]').getAttribute('transform');assert.notEqual(dopo,prima,'la figura della madre va al campo');tappedOnStage=true;}
    for(const [w,dove] of Object.entries(piano)){const ora=await page.locator('[data-worker="'+w+'"]').getAttribute('data-at');if(ora===dove)continue;
      await page.locator('[data-worker="'+w+'"]').click();const t=page.locator('[data-target="'+dove+'"]:not([disabled])');if(await t.count())await t.click();}
    if(anno===1)await shot('01-settimana');
    // Il granaio: un clic in meno e uno in più tornano allo stesso seme.
    if(anno===2){const v=()=>page.locator('.turn-reserve-ctl b').textContent();const a0=await v();await page.locator('[data-reserve="-1"]').click();assert.notEqual(await v(),a0);await page.locator('[data-reserve="1"]').click();assert.equal(await v(),a0);}
    // Reload a metà anno: chi è stato mandato resta dove era.
    if(!reloaded){const prima=await save();await page.reload();await page.locator('.turn-label').waitFor();
      assert.equal(await save(),prima);reloaded=true;}
    if(await page.locator('[data-turn=confirm]:disabled').count())throw new Error('qualcuno senza posto nel '+year);
    await page.locator('[data-turn=confirm]').click();if(anno===1||anno===3)await shot(String(anno).padStart(2,'0')+'-esito');
    if(anno===1)assert.ok(await page.locator('.turn-steps li').count()>=3,'l\'esito spiega da dove vengono le variazioni');
    // Il diario parla in italiano: nessun codice interno, una riga per indicatore.
    if(anno===3){const d=page.locator('#journal details');await d.evaluate(n=>n.open=true);const testo=await d.innerText();
      assert.doesNotMatch(testo,/causa:|a1-u1|settimana:\d/,'codici interni nel diario');assert.doesNotMatch(testo,/figlio_via|mucca_venduta|: (true|false)\b|(true|false) → /,'flag interni nel diario');assert.match(testo,/1777: /);await shot('03-diario');await d.evaluate(n=>n.open=false);}
    continue;}
   if(await page.locator('[data-turn=leave]').count()){if(!fiera){await shot('02-fiera');fiera=true;}const o=page.locator('[data-offer=punte]:not([disabled])');if(run.costruisce.length&&await o.count()){await o.click();await page.locator('.turn-market + .outcome').waitFor();}await page.locator('[data-turn=leave]').click();continue;}
   if(await page.locator('[data-built]').count()&&!costruito){costruito=true;await shot('migliorie');}
   if(await page.locator('[data-turn-choice]').count()){if(anno===1)await shot('01-bussa');await page.locator('[data-turn-choice]:not([disabled])').first().click();continue;}
   if(await page.locator('[data-turn=continue]').count()){await page.locator('[data-turn=continue]').click();continue;}
   if(await page.locator('[data-action=advance]').count()){await shot('80-fine-partita');await page.locator('[data-action=advance]').click();continue;}
   throw new Error('Pagina senza comandi: '+(await page.locator('#panel').innerText()).slice(0,200));
  }
  assert.ok(await page.locator('#summary-title').isVisible(),'unità non conclusa');
  assert.deepEqual(anni,['1740','1761','1777','1787','1820','1840','1842','1861']);
  await shot('fine');
  const salvato=await save();
  await page.goto(origin+'/');await page.locator('#progress').filter({hasText:'completata'}).waitFor();
  assert.equal(await save(),salvato);
  assert.deepEqual(errors,[]);await context.close();
  if(run.costruisce.length)assert.ok(costruito,'il costruttore vede le migliorie sulla scena');assert.ok(fiera,'la fiera compare');
  console.log('I.1 PASS ('+run.nome+', '+run.viewport.width+'px): partita di '+anni.length+' anni, figura spostata toccando la scena, granaio, fiera, reload a metà anno, home in sola lettura.');
 }
 const rc=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}}),rp=await rc.newPage();
 await rp.goto(origin+'/play.html?game=laika');await rp.locator('#scene-title').waitFor();
 assert.notEqual(await rp.locator('#stage').getAttribute('data-motion'),'playing');await rp.screenshot({path:path.join(out,'ridotto.png'),fullPage:true});await rc.close();
 console.log('I.1 PASS: movimento ridotto.');
};
