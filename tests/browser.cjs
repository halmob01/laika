const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const root=path.resolve(__dirname,'..'),artifacts=path.join(root,'.artifacts');fs.mkdirSync(artifacts,{recursive:true});
const server=http.createServer((req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;const file=path.resolve(root,'.'+decodeURIComponent(pathname.endsWith('/')?pathname+'index.html':pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};res.setHeader('Content-Type',(mime[path.extname(file)]||'text/plain')+'; charset=utf-8');res.end(fs.readFileSync(file));});
(async()=>{await new Promise(r=>server.listen(4173,'127.0.0.1',r));let browser;
 try{browser=await (process.env.KIT_BROWSER==='webkit'?webkit:chromium).launch({headless:true,...(process.env.KIT_BROWSER!=='webkit'&&process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{})});
 for(const name of ['biblioteca','quartiere']){
  const game=JSON.parse(fs.readFileSync(path.join(root,'games',name,'game.json'))),context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?game='+name);await page.locator('#scene-title').waitFor();
  await page.locator('#replay').tap();await page.waitForTimeout(200);await page.locator('#pause').tap();assert.equal(await page.locator('#stage').getAttribute('data-motion'),'paused');
  const pose=await page.locator('[data-layer]').evaluateAll(ns=>JSON.stringify(ns.map(n=>[n.getAttribute('transform'),n.getAttribute('opacity')])));
  await page.waitForTimeout(200);assert.equal(await page.locator('[data-layer]').evaluateAll(ns=>JSON.stringify(ns.map(n=>[n.getAttribute('transform'),n.getAttribute('opacity')]))),pose);
  await page.locator('#pause').tap();
  await page.waitForFunction(previous=>JSON.stringify([...document.querySelectorAll('[data-layer]')].map(n=>[n.getAttribute('transform'),n.getAttribute('opacity')]))!==previous,pose,{timeout:4000});
  await page.locator('#skip').tap();assert.equal(await page.locator('[data-layer=building]').getAttribute('opacity'),'1');
  const read=()=>page.evaluate(id=>JSON.parse(localStorage.getItem('learning-kit:'+id+':save-v1')),name);
  const clickNext=()=>page.locator('[data-action=advance]').click();
  await page.screenshot({path:path.join(artifacts,name+'-intro.png'),fullPage:true});
  await clickNext();await page.evaluate(()=>window.testNode=document.querySelector('[data-layer=stock]'));
  const initial=Number(await page.locator('[data-layer=stock]').getAttribute('width'));
  await page.locator('[data-choice=prepare]').click();await page.waitForTimeout(250);
  assert.equal(await page.locator('#stage').getAttribute('data-motion'),'playing');
  const middle=Number(await page.locator('[data-layer=stock]').getAttribute('width'));
  assert.ok(middle>initial,'geometria intermedia deve cambiare');await page.waitForTimeout(850);
  const final=Number(await page.locator('[data-layer=stock]').getAttribute('width'));assert.ok(middle<final,'geometria intermedia distinta dal finale');
  assert.equal(await page.evaluate(()=>window.testNode===document.querySelector('[data-layer=stock]')),true);
  await page.waitForTimeout(1700);await page.screenshot({path:path.join(artifacts,name+'-outcome.png'),fullPage:true});
  const saved=await read();await page.reload();await page.locator('#scene-title').waitFor();assert.deepEqual(await read(),saved);assert.equal(Number(await page.locator('[data-layer=stock]').getAttribute('width')),final);
  let guard=0;
  while(await page.locator('#summary').isHidden()&&guard++<50){
   const raw=await read();const {restore}=await import('../src/storage/index.js');const result=restore(game,JSON.stringify(raw));assert.equal(result.ok,true,result.error);const s=result.state;
   const e=game.acts[s.actIndex].episodes.find(e=>e.id===s.currentAct.episodeId);
   if(s.currentAct.phase==='outcome'||e.type==='narrative')await clickNext();
   else if(e.type==='resource_allocation'){await page.locator('[name=preparation]').fill('2');await page.locator('[name=welcome]').fill('2');await page.getByRole('button',{name:'Conferma distribuzione'}).click();}
   else if(e.type==='role_crisis'){const before=(await read()).commands.length;await page.locator('[data-role=visitor]').tap();assert.equal((await read()).commands.length,before+1);await page.locator('[data-choice=coordinate]').click();}
   else if(e.type==='source_comparison'){for(const source of e.sources)await page.locator('[data-source='+source.id+']').click();await page.locator('[data-choice=combine]').click();}
   else if(e.type==='assessment'){const order=await page.locator('[data-answer]').evaluateAll(ns=>ns.map(n=>n.dataset.answer));await page.reload();await page.locator('[data-answer]').first().waitFor();assert.deepEqual(await page.locator('[data-answer]').evaluateAll(ns=>ns.map(n=>n.dataset.answer)),order);const positions=new Set();for(let seed=0;seed<9;seed++){await page.evaluate(({name,seed})=>{const key='learning-kit:'+name+':save-v1';const raw=JSON.parse(localStorage.getItem(key));raw.seed='test-'+seed;localStorage.setItem(key,JSON.stringify(raw));},{name,seed});await page.reload();await page.locator('[data-answer]').first().waitFor();positions.add((await page.locator('[data-answer]').evaluateAll(ns=>ns.map(n=>n.dataset.answer))).indexOf(e.question.correctId));}assert.ok(positions.size>=2,'answer positions vary in the DOM');await page.locator('[data-answer='+e.question.correctId+']').click();}
   else throw Error('Interazione non coperta: '+e.type);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'no overflow');
  }
  assert.ok(guard<50);assert.match(await page.locator('#summary').innerText(),/100 \/ 100/);assert.deepEqual(errors,[]);
  const backup=await read();await page.goto('http://127.0.0.1:4173/?game='+(name==='biblioteca'?'quartiere':'biblioteca'));await page.locator('#scene-title').waitFor();assert.deepEqual(await page.evaluate(id=>JSON.parse(localStorage.getItem('learning-kit:'+id+':save-v1')),name),backup);
  await page.setViewportSize({width:320,height:700});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#replay').click();
  await page.setViewportSize({width:1280,height:800});await page.screenshot({path:path.join(artifacts,name+'-desktop.png'),fullPage:true});
  await context.close();
 }
 await require('./browser-p1.cjs')(browser,root,artifacts);
 await require('./browser-home.cjs')(browser,root,artifacts);
 await require('./browser-contract.cjs')(browser,root,artifacts);
 await require('./browser-motion.cjs')(browser,root,artifacts);
 await require('./browser-laika.cjs')(browser,root,artifacts);
 await require('./browser-i1.cjs')(browser,root,artifacts);
 await require('./browser-rig.cjs')(browser,root,artifacts);
 await require('./browser-bottega.cjs')(browser,root,artifacts);
 const page=await browser.newPage();await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173/play.html');await page.locator('#scene-title').waitFor();
 assert.equal(Number(await page.locator('[data-layer=stock]').getAttribute('width')),36);await page.locator('[data-action=advance]').click();await page.locator('[data-choice=prepare]').click();assert.equal(Number(await page.locator('[data-layer=stock]').getAttribute('width')),72);
 await page.locator('#replay').click();assert.equal(Number(await page.locator('[data-layer=stock]').getAttribute('width')),72);
 console.log('Browser PASS: 2 pacchetti completi, geometria iniziale/intermedia/finale, identità DOM, reload, touch, 320/390/1280px, reduced motion.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
