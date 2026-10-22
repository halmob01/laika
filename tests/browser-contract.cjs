const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
module.exports=async function(browser,root,artifacts){
 const {readPacks}=await import('../scripts/packs.js');
 const {restore}=await import('../src/storage/index.js');
 const {available}=await import('../src/core/engine.js');
 for(const {item,game} of readPacks(root))for(let variant=0;variant<2;variant++){
  const context=await browser.newContext({viewport:{width:variant?1280:390,height:850},reducedMotion:variant?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?game='+encodeURIComponent(item.id));await page.locator('#scene-title').waitFor();
  const read=()=>page.evaluate(id=>localStorage.getItem('learning-kit:'+id+':save-v1'),game.id);
  async function activate(locator){await locator.focus();await page.keyboard.press('Enter');}
  let guard=0,previousStage=null;
  while(await page.locator('#summary').isHidden()&&guard++<100){
   const restored=restore(game,await read());assert.equal(restored.ok,true,restored.error);
   const state=restored.state,e=game.acts[state.actIndex].episodes.find(e=>e.id===state.currentAct.episodeId);
   if(e.stageId){
    assert.equal(await page.getByRole('img',{name:game.stages.find(s=>s.id===e.stageId).label,exact:true}).count(),1);
    if(previousStage!==e.stageId&&e.motionId&&state.currentAct.phase==='scene')assert.equal(await page.locator('#stage').getAttribute('data-motion'),variant?'finished':'playing','entry cue on new stage');
   }else assert.equal(await page.locator('#stage').isHidden(),true);
   if(game.id==='messaggio'&&e.stageId&&previousStage!==e.stageId)await page.screenshot({path:path.join(artifacts,game.id+'-'+e.stageId+'-'+variant+'.png'),fullPage:true});
   previousStage=e.stageId;
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'no overflow');
   if(state.currentAct.phase==='outcome'||e.type==='narrative'){
    // Heading focus -> Tab reaches Continue on narrative/outcome; activate by keyboard.
    await page.locator('#scene-title').focus();await page.keyboard.press('Tab');
    // Racconto a card: Tab porta ad Avanti; Invio sfoglia e il fuoco resta sul comando successivo fino a Continua.
    for(let n=0;n<20&&await page.evaluate(()=>document.activeElement.dataset.card==='next');n++)await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'advance');
    await page.keyboard.press('Enter');
   }else if(e.type==='resource_allocation'){
    let remaining=e.budget;for(const b of e.buckets){const units=Math.min(b.max,remaining);await page.locator('[name="'+b.id+'"]').fill(String(units));remaining-=units;}
    await activate(page.getByRole('button',{name:'Conferma distribuzione'}));
   }else if(e.type==='assessment')await activate(page.locator('[data-answer="'+e.question.correctId+'"]'));
   else {
    if(e.type==='source_comparison')for(const source of e.sources){await activate(page.locator('[data-source="'+source.id+'"]'));assert.equal(await page.evaluate(()=>document.activeElement.dataset.source),source.id);}
    const choices=e.choices.filter(c=>available(c,state.currentAct));await activate(page.locator('[data-choice="'+choices[variant%choices.length].id+'"]'));
   }
   assert.match(await page.evaluate(()=>document.activeElement.id),/^(scene-title|summary-title)$/,'focus retained after interaction');
  }
  assert.ok(guard<100);assert.equal(await page.evaluate(()=>document.activeElement.id),'summary-title');
  const final=await read();await page.reload();await page.locator('#summary h1').waitFor();assert.equal(await read(),final);
  assert.deepEqual(errors,[]);
  if(game.id==='messaggio')await page.screenshot({path:path.join(artifacts,game.id+'-contract-'+variant+'.png'),fullPage:true});
  await context.close();
 }
 console.log('Public browser contract PASS: all configured packs, keyboard, focus, stage switches, reduced motion, restore.');
};
