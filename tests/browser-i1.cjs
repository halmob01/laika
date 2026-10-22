// LAIKA, unità I.1 (partita a turni) nel player: dalla home alla fine, due strategie, posti toccati sulla scena,
// reload a metà anno con lo stesso stato, mobile e desktop, movimento ridotto.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
module.exports=async(browser,root,artifacts)=>{
 const origin='http://127.0.0.1:4173',out=path.join(artifacts,'i1');fs.mkdirSync(out,{recursive:true});
 const runs=[{nome:'campo',viewport:{width:1440,height:900},corvee:g=>Math.max(0,g-2)},
  {nome:'corvee',viewport:{width:390,height:844},corvee:g=>g,touch:true}];
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
  let anno=0,reloaded=false,tappedOnStage=false;const anni=[];
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
    const min=await page.evaluate(()=>{const s=[...document.querySelectorAll('.turn-place')].find(r=>r.textContent.includes('corvée'));const m=s?.textContent.match(/dovuti: (\d+)/);return m?Number(m[1]):0;});
    // Il primo giorno si mette toccando il posto sulla scena: la sovrapposizione deve stare sopra l'illustrazione.
    if(!tappedOnStage){const hot=page.locator('[data-hotspot=campo]');assert.equal(await hot.count(),1);const box=await hot.boundingBox(),st=await page.locator('#stage').boundingBox();
      assert.ok(box.y>=st.y&&box.y+box.height<=st.y+st.height+1,'posto dentro la scena');await hot.click();tappedOnStage=true;}
    const want=run.corvee(min);for(let i=0;i<want;i++)if(await page.locator('[data-place=corvee][data-delta="1"]:not([disabled])').count())await page.locator('[data-place=corvee][data-delta="1"]').click();
    while(await page.locator('[data-place=campo][data-delta="1"]:not([disabled])').count())await page.locator('[data-place=campo][data-delta="1"]').click();
    while(await page.locator('[data-place=vicini][data-delta="1"]:not([disabled])').count())await page.locator('[data-place=vicini][data-delta="1"]').click();
    if(anno===1)await shot('01-settimana');
    // Reload a metà anno: le pedine piazzate restano dove erano.
    if(!reloaded){const prima=await save();const prima_n=await page.locator('.turn-tokens i.used').count();await page.reload();await page.locator('.turn-label').waitFor();
      assert.equal(await save(),prima);assert.equal(await page.locator('.turn-tokens i.used').count(),prima_n);reloaded=true;}
    await page.locator('[data-turn=confirm]').click();if(anno===1||anno===3)await shot(String(anno).padStart(2,'0')+'-esito');continue;}
   if(await page.locator('[data-turn-choice]').count()){if(anno===1)await shot('01-bussa');await page.locator('[data-turn-choice]').first().click();continue;}
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
  console.log('I.1 PASS ('+run.nome+', '+run.viewport.width+'px): partita di '+anni.length+' anni, posto toccato sulla scena, reload a metà anno, home in sola lettura.');
 }
 const rc=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}}),rp=await rc.newPage();
 await rp.goto(origin+'/play.html?game=laika');await rp.locator('#scene-title').waitFor();
 assert.notEqual(await rp.locator('#stage').getAttribute('data-motion'),'playing');await rp.screenshot({path:path.join(out,'ridotto.png'),fullPage:true});await rc.close();
 console.log('I.1 PASS: movimento ridotto.');
};
