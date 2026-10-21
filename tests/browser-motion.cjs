const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
module.exports=async function(browser,root,artifacts){
 const context=await browser.newContext({viewport:{width:1100,height:950},recordVideo:{dir:path.join(artifacts,'video'),size:{width:1100,height:950}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/prototypes/motion-lab/');await page.locator('#stage svg').waitFor();
 await page.getByRole('button',{name:'Riproduci',exact:true}).click();
 const samples=await page.evaluate(()=>new Promise(resolve=>{const values=[];let start,last;function tick(t){start??=t;if(last)values.push(t-last);last=t;if(t-start<16500)requestAnimationFrame(tick);else resolve(values);}requestAnimationFrame(tick);}));
 assert.equal(await page.locator('#stage').getAttribute('data-motion'),'finished');
 const transforms=()=>page.locator('[data-layer]').evaluateAll(nodes=>Object.fromEntries(nodes.map(n=>[n.dataset.layer,{transform:n.getAttribute('transform'),opacity:n.getAttribute('opacity'),width:n.getAttribute('width')}] )));
 const final=await transforms();
 for(const time of [0,4000,8000,12000,16000]){
  await page.locator('[data-time="'+time+'"]').click();
  await page.screenshot({path:path.join(artifacts,'motion-'+time+'.png'),fullPage:true});
  if(time===8000){assert.notEqual((await transforms()).world.transform,final.world.transform);const pose=await transforms();await page.waitForTimeout(200);assert.deepEqual(await transforms(),pose);await page.getByRole('button',{name:'Riprendi',exact:true}).click();await page.waitForTimeout(150);assert.notDeepEqual(await transforms(),pose);await page.getByRole('button',{name:'Pausa',exact:true}).click();}
 }
 assert.deepEqual(await transforms(),final);
 await page.reload();await page.locator('#stage svg').waitFor();
 // Neutral transforms can be absent on reload: compare geometry using SVG matrices.
 const matrix=()=>page.locator('[data-layer="world"]').evaluate(n=>{const m=n.getCTM();return [m.a,m.b,m.c,m.d,m.e,m.f];});
 const restored=await matrix();await page.getByRole('button',{name:'Riproduci',exact:true}).click();await page.getByRole('button',{name:'Vai alla composizione finale'}).click();assert.deepEqual(await matrix(),restored);
 await page.getByRole('checkbox',{name:'Movimento ridotto'}).check();await page.getByRole('button',{name:'Riproduci',exact:true}).click();assert.equal(await page.locator('#stage').getAttribute('data-motion'),'finished');
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(artifacts,'motion-mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 await page.setViewportSize({width:320,height:700});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 assert.deepEqual(errors,[]);
 samples.sort((a,b)=>a-b);const stats={browser:process.env.KIT_BROWSER||'chromium',frames:samples.length,medianMs:samples[Math.floor(samples.length*.5)],p95Ms:samples[Math.floor(samples.length*.95)],over50ms:samples.filter(x=>x>50).length};
 fs.writeFileSync(path.join(artifacts,'motion-performance.json'),JSON.stringify(stats,null,2));console.log('Motion frame pacing (CI, not phone):',stats);
 await context.close();
 // Verify the actual downloadable, self-contained artifact without network assets.
 const p=await browser.newPage();await p.goto('http://127.0.0.1:4173/dist/motion-study.html');await p.locator('#stage svg').waitFor();await p.getByRole('button',{name:'Vai alla composizione finale'}).click();assert.equal(await p.locator('[data-layer]').count(),410);await p.close();
};
