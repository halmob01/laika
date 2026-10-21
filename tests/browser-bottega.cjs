// Bottega nel browser: equivalenza al pixel con gli studi originali e galleria funzionante.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
module.exports=async function(browser,root,artifacts){
 const {caricaKit}=await import(require('node:url').pathToFileURL(path.join(root,'bottega/strumenti/kit.js')).href);
 const studi=JSON.parse(fs.readFileSync(path.join(root,'bottega/generati/studi.json')));
 // Ogni simbolo importato porta con sé la chiamata originale che lo ha prodotto.
 const kits=new Map(),kit=file=>{if(!kits.has(file))kits.set(file,caricaKit({file},{token:false}));return kits.get(file);};
 const simboli=studi.symbols.filter(s=>s.meta.origine).map(s=>{const o=s.meta.origine,k=kit(o.file);
  let m=k.chiama(o.funzione,o.argomenti).trim();if(o.rimuoviPrimo)m=m.replace(/^<[^>]+\/>/,'');
  const defs=o.definizioni?k.chiama(o.definizioni.funzione,o.definizioni.argomenti).replace(/<filter[\s\S]*?<\/filter>/,''):'';
  const t=s.layers[0].pose;return {id:s.id,size:s.meta.size,markup:defs+'<g transform="translate('+t.translateX+' '+t.translateY+')">'+m+'</g>'};});
 const P=kit('prototypes/laika-studi-originali/studio personaggi.html');
 const figure=[];
 for(const pose of ['in_piedi','corre','seduto','a_terra','porta_bandiera','tiene_cartello','spara','costruisce'])for(const role of ['popolo','protagonista','esercito','partigiano'])figure.push({pose,role,variant:'nessuna'});
 for(const variant of ['donna','bambino','cappello_largo','zaino','borsa','bastone','mantello','clero'])figure.push({pose:'cammina_1',role:'popolo',variant});
 for(const f of figure)f.markup=P.chiama('buildOminoSVG',[{x:0,y:0,scale:1,...f}]);
 const folle=['statica','marcia','carica','barricata','discorso','scontro'].map(tipo=>({tipo,markup:P.chiama('buildCrowdCompositionSVG',[tipo,0,0,1])}));
 const page=await browser.newPage({viewport:{width:1000,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/bottega/galleria.html');await page.waitForFunction(()=>window.__galleria);
 assert.deepEqual(await page.evaluate(()=>window.__galleria),{pronto:true});
 const result=await page.evaluate(async({simboli,figure,folle})=>{
  const {composePack}=await import('/src/visual/compose.js'),{createStage}=await import('/src/visual/stage.js');
  const {figura,variante,PIEDI}=await import('/bottega/figura/figura.js'),{CORPI}=await import('/bottega/figura/pose.js'),{compilaScena}=await import('/bottega/scena.js');
  const studi=await (await fetch('/bottega/generati/studi.json')).json(),palette=(await (await fetch('/bottega/temi.json')).json()).temi.studi;
  const raster=async(t,w,h)=>{const i=new Image();i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t);await i.decode();const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(i,0,0,w,h);return x.getImageData(0,0,w,h).data;};
  async function compare(markup,stage,vb){
   const host=document.createElement('div');document.body.append(host);createStage(host,{reducedMotion:true}).mount(stage,{});
   const svg=host.querySelector('svg');svg.setAttribute('xmlns','http://www.w3.org/2000/svg');const mine=new XMLSerializer().serializeToString(svg);host.remove();
   const W=Math.round(vb[2]*2),H=Math.round(vb[3]*2),[a,b]=await Promise.all([raster('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb.join(' ')+'">'+markup+'</svg>',W,H),raster(mine,W,H)]);
   let d=0,ink=0;for(let i=0;i<a.length;i+=4){if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])+Math.abs(a[i+3]-b[i+3])>40)d++;if(a[i+3])ink++;}return {d,ink};
  }
  const out=[];
  for(const o of simboli){const [w,h]=o.size,vb=[-w/2-10,-h-10,w+20,h+20],s=studi.symbols.find(x=>x.id===o.id);
   const st=composePack({palette,patterns:studi.patterns,symbols:[s],stages:[{id:'t',label:'t',duration:0,viewBox:vb,layers:[],components:[{id:'a',symbol:s.id}]}]}).stages[0];out.push({id:o.id,...await compare(o.markup,st,vb)});}
  for(const c of figure){const k=CORPI[variante(c).body],f=figura({id:'f',x:0,y:PIEDI*k,...c}),vb=[-90,-110,180,170];
   const st=composePack({palette,symbols:f.symbols,stages:[{id:'t',label:'t',duration:0,viewBox:vb,layers:[],components:f.components}]}).stages[0];out.push({id:c.variant+'/'+c.role+'/'+c.pose,...await compare(c.markup,st,vb)});}
  for(const c of folle){const vb=[-170,-130,340,190];const sc=compilaScena({id:'f-'+c.tipo,etichetta:'folla',viewBox:vb,sfondo:'none',figure:[{gruppo:'g',formazione:{tipo:c.tipo,x:0,y:36,scala:1}}]},{libreria:studi});
   const st=composePack({palette,patterns:studi.patterns,symbols:sc.symbols,stages:[sc.stage]}).stages[0];out.push({id:'folla/'+c.tipo,...await compare(c.markup,st,vb)});}
  return out;
 },{simboli,figure,folle});
 fs.writeFileSync(path.join(artifacts,'bottega-equivalenza.json'),JSON.stringify(result,null,1));
 for(const r of result){assert.ok(r.ink>0,r.id+': originale vuoto');assert.equal(r.d,0,r.id+': '+r.d+' pixel diversi dall\'originale');}
 // Galleria: ogni scena si riproduce, si mette in pausa, salta al finale e resta senza errori.
 const sceneIds=await page.$$eval('#scena option',o=>o.map(x=>x.value));
 const pose=()=>page.locator('#stage [data-layer]').evaluateAll(ns=>JSON.stringify(ns.map(n=>n.getAttribute('transform'))));
 for(const id of sceneIds){await page.selectOption('#scena',id);await page.waitForTimeout(400);
  assert.equal(await page.locator('#stage').getAttribute('data-motion'),'playing',id);
  await page.locator('#pause').click();const frozen=await pose();await page.waitForTimeout(150);assert.equal(await pose(),frozen,id+': pausa');
  await page.locator('#skip').click();const fine=await pose();await page.locator('#play').click();await page.waitForTimeout(100);await page.locator('#skip').click();assert.equal(await pose(),fine,id+': finale stabile');
  await page.locator('#stage').screenshot({path:path.join(artifacts,'bottega-'+id+'.png')});}
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForFunction(()=>window.__galleria);assert.equal(await page.locator('#stage').getAttribute('data-motion'),'finished');
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'galleria senza scorrimento orizzontale');
 await page.locator('[data-tab=figure]').click();await page.waitForTimeout(300);{const {POSE}=await import(require('node:url').pathToFileURL(path.join(root,'bottega/figura/pose.js')).href);assert.equal(await page.locator('#pose .card').count(),Object.keys(POSE).length);}
 await page.locator('[data-tab=catalogo]').click();await page.waitForTimeout(300);assert.equal(await page.locator('#catalogo .card').count(),studi.symbols.length);
 assert.deepEqual(errors,[]);await page.close();
 console.log('Bottega PASS: '+result.length+' confronti al pixel con gli studi, '+sceneIds.length+' scene di esempio.');
};
