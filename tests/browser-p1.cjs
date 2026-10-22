const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async(browser,root,artifacts)=>{
 const {validatePack}=await import('../src/validation/game-pack.js');
 const {newSession,transition}=await import('../src/runner/index.js');
 const {exportSave}=await import('../src/storage/index.js');
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const origin='http://127.0.0.1:4173',key='learning-kit:laika:save-v1';
 const read=()=>page.evaluate(()=>JSON.stringify(Object.entries(localStorage).sort()));
 await page.goto(origin+'/');await page.locator('#progress').filter({hasText:'Nessuna pratica'}).waitFor();
 assert.equal(await read(),'[]');assert.equal(await page.locator('#resume').isHidden(),true);
 await page.screenshot({path:path.join(artifacts,'p1-home-mobile.png'),fullPage:true});
 for(const name of ['biblioteca','quartiere','messaggio']){
  await page.goto(origin+'/?game='+name+'&extra=preserved#tools');await page.locator('#scene-title').waitFor();
  assert.ok(page.url().includes('/play.html?game='+name+'&extra=preserved#tools'));
  assert.equal(await page.locator('#pack-theme').count(),0);
  await page.goto(origin+'/play.html?game='+name);await page.locator('#scene-title').waitFor();
 }
 // Revisit the home mid-choice and after its outcome, without altering any save.
 await page.goto(origin+'/play.html?game=biblioteca');await page.locator('#scene-title').waitFor();
 await page.locator('[data-action=advance]').click();
 for(const outcome of [false,true]){
  if(outcome)await page.locator('[data-choice=prepare]').click();
  const before=await read();await page.goto(origin+'/');await page.locator('#progress').filter({hasText:'Nessuna pratica'}).waitFor();assert.equal(await read(),before);
  await page.goto(origin+'/play.html?game=biblioteca');await page.locator('#scene-title').waitFor();assert.equal(await read(),before);
 }
 const game=validatePack(JSON.parse(fs.readFileSync(path.join(root,'games/laika/game.json'),'utf8')));
 const setSave=async raw=>{await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});};
 await setSave(exportSave(game,newSession(game,'browser-p1')));
 const valid=await read();await page.goto(origin+'/');await page.locator('#resume').waitFor();assert.equal(await read(),valid);
 await page.locator('#resume').click();await page.locator('#scene-title').waitFor();
 assert.equal(await page.locator('#pack-theme').getAttribute('href'),'./site/laika/theme.css');
 assert.match(await page.locator('.episode-context').innerText(),/1700/);
 await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
 await page.screenshot({path:path.join(artifacts,'p1-player-mobile.png'),fullPage:true});
 while(await page.locator('[data-card=next]').count())await page.locator('[data-card=next]').click();
 await page.locator('[data-action=advance]').click();assert.match(await page.locator('#panel').innerText(),/Atto I/i);
 const saved=await read();await page.reload();await page.locator('#scene-title').waitFor();assert.equal(await read(),saved);
 // Salvataggio completo costruito con il runner pubblico (l'unità I.1 è percorsa per intero in browser-i1).
 {let s=newSession(game,'browser-p1');const {currentScene}=await import('../src/runner/index.js');
  for(let i=0;i<400&&!s.complete;i++){const e=currentScene(game,s);let a;
   if(s.currentAct.phase==='outcome'||e.type==='narrative')a={type:'advance'};
   else if(e.type==='turn_game'){const g=s.currentAct.game,n=Object.values(g.placement).reduce((x,y)=>x+y,0);
    a=g.phase==='cards'?{type:'turn',step:'card'}:g.phase==='place'?(n<g.rules.tokens?{type:'turn',step:'place',placeId:'campo',delta:1}:{type:'turn',step:'confirm'}):g.phase==='event'?{type:'turn',step:'choose',choiceId:e.turns[g.turn].event.choices[0].id}:{type:'turn',step:'continue'};}
   else if(e.type==='resource_allocation')a={type:'allocate',allocations:Object.fromEntries(e.buckets.map((b,j)=>[b.id,j===0?e.budget:0]))};
   else if(e.type==='source_comparison'){const x=e.sources.find(x=>!s.currentAct.viewedSources.includes(e.id+':'+x.id));a=x?{type:'inspect_source',sourceId:x.id}:{type:'select',choiceId:e.choices[0].id};}
   else if(e.type==='assessment')a={type:'answer',answerId:e.question.correctId};
   s=transition(game,s,a).nextState;}
  assert.equal(s.complete,true);await setSave(exportSave(game,s));await page.reload();await page.locator('#summary-title').waitFor();}
 const complete=await read();await page.goto(origin+'/');await page.locator('#progress').filter({hasText:'completata'}).waitFor();assert.equal(await page.locator('#resume').isHidden(),true);assert.equal(await read(),complete);
 for(const raw of ['invalid JSON',JSON.stringify({saveSchemaVersion:1,gameId:'laika',contentVersion:'old',commands:[]})]){
  await setSave(raw);const before=await read();await page.reload();await page.locator('#progress').filter({hasText:'non utilizzabile'}).waitFor();assert.equal(await page.locator('#resume').isHidden(),true);assert.equal(await read(),before);
  await page.goto(origin+'/play.html?game=laika');await page.locator('#scene-title').waitFor();assert.equal(await page.locator('#raw').isVisible(),true);assert.equal(await read(),before);
  await page.goto(origin+'/');await page.locator('#progress').filter({hasText:'non utilizzabile'}).waitFor();
 }
 await page.goto(origin+'/play.html?game=biblioteca');await page.locator('#scene-title').waitFor();
 assert.equal(await page.locator('#pack-theme').count(),0);assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()),'#355e59');
 // Context labels from content are rendered as text, never HTML.
 await page.route('**/games/laika/game.json',async route=>{
  const raw=JSON.parse(fs.readFileSync(path.join(root,'games/laika/game.json'),'utf8'));
  raw.acts[0].episodes[0].context={kind:'documented',dateLabel:'<img src=x onerror=alert(1)>',placeLabel:'Russia'};
  await route.fulfill({json:raw});
 });
 await page.evaluate(key=>localStorage.removeItem(key),key);
 await page.goto(origin+'/play.html?game=laika');await page.locator('.episode-context').waitFor();
 assert.match(await page.locator('.episode-context').innerText(),/<img/);assert.equal(await page.locator('.episode-context img').count(),0);
 await page.setViewportSize({width:1440,height:900});await page.goto(origin+'/');await page.locator('#resume').waitFor();await page.screenshot({path:path.join(artifacts,'p1-home-desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);await context.close();
 const noJs=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJs.newPage();await staticPage.goto(origin+'/');assert.ok(await staticPage.getByRole('link',{name:'Esplora i laboratori dimostrativi'}).isVisible());await noJs.close();
 console.log('P1 PASS: routing, themes, text context, home read-only, resume/complete/incompatible, no-JS home.');
};
