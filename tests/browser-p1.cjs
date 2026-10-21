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
 assert.equal(await page.locator('.episode-context').innerText(),'Simulazione');
 await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
 await page.screenshot({path:path.join(artifacts,'p1-player-mobile.png'),fullPage:true});
 await page.locator('[data-action=advance]').click();assert.match(await page.locator('#panel').innerText(),/Atto I/i);
 const saved=await read();await page.reload();await page.locator('#scene-title').waitFor();assert.equal(await read(),saved);
 await page.locator('[data-action=advance]').click();await page.locator('#summary-title').waitFor();
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
