// LAIKA, unità I.1 nel player: dalla home alla fine, due itinerari, reload dopo la scelta, mobile e desktop.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
module.exports=async(browser,root,artifacts)=>{
 const origin='http://127.0.0.1:4173',out=path.join(artifacts,'i1');fs.mkdirSync(out,{recursive:true});
 const runs=[{nome:'campo',viewport:{width:1440,height:900},alloc:{campo:5,corvee:1,attrezzi:0},esito:'Un inverno con il grano'},
  {nome:'corvee',viewport:{width:390,height:844},alloc:{campo:3,corvee:2,attrezzi:1},esito:'Un inverno magro',touch:true}];
 for(const run of runs){
  const context=await browser.newContext({viewport:run.viewport,hasTouch:Boolean(run.touch)}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const shot=n=>page.screenshot({path:path.join(out,run.nome+'-'+n+'.png'),fullPage:true});
  const fine=()=>page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
  await page.goto(origin+'/');await page.locator('#inizia').click();await page.locator('#scene-title').waitFor();
  const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
  const titolo=()=>page.locator('#scene-title').innerText();
  // I paragrafi separati da una riga vuota restano paragrafi (white-space: pre-line del player).
  assert.equal(await page.locator('.lead').evaluate(n=>getComputedStyle(n).whiteSpace),'pre-line');
  let n=0,visti=[];
  for(let guard=0;guard<60;guard++){
   if(await page.locator('#summary-title').isVisible())break;
   const t=await titolo();if(visti.at(-1)!==t){visti.push(t);await page.locator('#skip').click().catch(()=>{});await fine();await shot(String(++n).padStart(2,'0'));}
   assert.equal(await overflow(),true,'overflow orizzontale in «'+t+'»');
   if(await page.locator('[name=campo]').count()){
    for(const [k,v] of Object.entries(run.alloc))await page.locator('[name='+k+']').fill(String(v));
    await page.getByRole('button',{name:'Conferma distribuzione'}).click();await fine();await shot(String(++n).padStart(2,'0')+'-esito');
    // Reload dopo l'esito: stesso stato e stessa conseguenza.
    const prima=await page.evaluate(()=>localStorage.getItem('learning-kit:laika:save-v1'));await page.reload();await page.locator('#scene-title').waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('learning-kit:laika:save-v1')),prima);continue;
   }
   const fonti=page.locator('[data-source]');
   if(await fonti.count()){
    for(let i=0;i<await fonti.count();i++)if(await fonti.nth(i).getAttribute('aria-expanded')==='false')await fonti.nth(i).click();
    if(await fonti.count()===3&&n<40){await fine();await shot(String(++n).padStart(2,'0')+'-fonti');}
    await page.locator('[data-choice]').first().click();await fine();continue;
   }
   if(await page.locator('[data-answer]').count()){await page.locator('[data-answer=liberta]').click();await fine();await shot(String(++n).padStart(2,'0')+'-verifica');continue;}
   await page.locator('[data-action=advance]').click();
  }
  assert.ok(await page.locator('#summary-title').isVisible(),'unità non conclusa: '+visti.join(' | '));
  assert.ok(visti.includes(run.esito),'esito atteso '+run.esito+' in '+visti.join(' | '));
  await shot('fine');
  // La home vede il completamento senza scrivere.
  const salvato=await page.evaluate(()=>localStorage.getItem('learning-kit:laika:save-v1'));
  await page.goto(origin+'/');await page.locator('#progress').filter({hasText:'completata'}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('learning-kit:laika:save-v1')),salvato);
  await shot('home');
  assert.deepEqual(errors,[]);await context.close();
  console.log('I.1 PASS ('+run.nome+', '+run.viewport.width+'px): '+visti.length+' episodi, esito «'+run.esito+'», reload dopo l\'esito, home in sola lettura.');
 }
 // Movimento ridotto: la scena si apre già sul quadro finale.
 const rc=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}}),rp=await rc.newPage();
 await rp.goto(origin+'/play.html?game=laika');await rp.locator('#scene-title').waitFor();
 assert.notEqual(await rp.locator('#stage').getAttribute('data-motion'),'playing');await rp.screenshot({path:path.join(out,'ridotto.png'),fullPage:true});await rc.close();
 console.log('I.1 PASS: movimento ridotto.');
};
