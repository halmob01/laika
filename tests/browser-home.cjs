// Home LAIKA: tavola di situazione, rettifica delle date, controlli del movimento, misure.
const assert=require('node:assert/strict'),path=require('node:path');
module.exports=async(browser,root,artifacts)=>{
 const origin='http://127.0.0.1:4173';
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 // Il manifesto del corso si legge dopo il primo quadro, solo per lo stato dei progressi: si misura a parte.
 let bytes=0,corso=0;page.on('response',async r=>{try{const b=await r.body();if(r.url().endsWith('/games/laika/game.json'))corso+=b.length;else bytes+=b.length;}catch{}});
 await page.goto(origin+'/');await page.locator('#scena svg').waitFor();
 assert.equal(await page.locator('#scena').getAttribute('data-motion'),'playing');
 const pressed=()=>page.$$eval('.data',b=>b.map(x=>x.getAttribute('aria-pressed')).join());
 assert.equal(await pressed(),'true,false,false');
 await page.locator('.data').nth(1).click();
 assert.equal(await pressed(),'false,true,false');
 assert.match(await page.locator('#scena').getAttribute('aria-label'),/1905/);
 assert.match(await page.locator('#didascalia').innerText(),/1905/);
 assert.equal((await page.locator('#anno').innerText()).trim(),'1905');
 // Tastiera: frecce tra le date.
 await page.locator('.data').nth(1).focus();await page.keyboard.press('ArrowRight');
 assert.equal(await pressed(),'false,false,true');
 // Pausa dell'utente: la scena salta al quadro finale e resta ferma.
 await page.locator('#pausa').click();assert.equal(await page.locator('#pausa').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('#scena').getAttribute('data-motion'),'finished');
 await page.locator('#rivedi').click();assert.equal(await page.locator('#scena').getAttribute('data-motion'),'finished');
 await page.locator('#pausa').click();await page.locator('#rivedi').click();assert.equal(await page.locator('#scena').getAttribute('data-motion'),'playing');
 // Fuori schermo il movimento si ferma.
 await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await page.waitForTimeout(400);
 assert.equal(await page.locator('#scena').getAttribute('data-motion'),'paused');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);
 assert.notEqual(await page.locator('#scena').getAttribute('data-motion'),'paused');
 await page.screenshot({path:path.join(artifacts,'home-desktop.png'),fullPage:true});
 assert.ok(bytes<700*1024,'primo quadro sotto 700 KB non compressi: '+bytes);
 for(const width of [360,390,768]){await page.setViewportSize({width,height:844});await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'home senza scorrimento orizzontale a '+width);}
 await page.screenshot({path:path.join(artifacts,'home-mobile.png'),fullPage:true});
 assert.deepEqual(errors,[]);await context.close();
 const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}}),rp=await reduced.newPage();
 await rp.goto(origin+'/');await rp.locator('#scena svg').waitFor();
 assert.equal(await rp.locator('#scena').getAttribute('data-motion'),'finished');
 await rp.locator('.data').nth(2).click();assert.equal(await rp.locator('#scena').getAttribute('data-motion'),'finished');
 await reduced.close();
 console.log('Home PASS: tavola, rettifica, tastiera, pausa, fuori schermo, reduced motion, 360/390/768/1440, '+Math.round(bytes/1024)+' KB per il primo quadro; manifesto del corso letto dopo: '+Math.round(corso/1024)+' KB non compressi.');
};
