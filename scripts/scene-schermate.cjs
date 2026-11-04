// Schermate delle schede scena: compone ogni scheda nella galleria della bottega (tema laika, movimento ridotto = quadro finale).
// Uso: npm run serve (in un altro terminale), poi
//   node scripts/scene-schermate.cjs <cartella-uscita> scheda1.json [scheda2.json ...]
// Scrive <cartella-uscita>/<id-scena>.png. Non è un test: serve alle evidenze delle PR (docs/evidence/).
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const [out,...files]=process.argv.slice(2);
if(!out||!files.length){console.error('uso: node scripts/scene-schermate.cjs <cartella> scheda.json ...');process.exit(1);}
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const b=await chromium.launch(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{});
 const ctx=await b.newContext({viewport:{width:1100,height:800},reducedMotion:'reduce'});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto((process.env.ORIGIN||'http://127.0.0.1:4173')+'/bottega/galleria.html');
 await p.waitForFunction(()=>window.__galleria&&(window.__galleria.pronto||window.__galleria.errore));
 await p.click('[data-tab=prova]');
 for(const f of files){
  const j=JSON.parse(fs.readFileSync(f,'utf8'));
  await p.fill('#json',JSON.stringify(j));await p.click('#componi');
  const err=await p.locator('#errore').isVisible()?await p.locator('#errore').innerText():'';
  if(err){console.log('ERRORE',f,err);continue;}
  await p.waitForTimeout(400);
  await p.locator('#stage-prova').screenshot({path:path.join(out,j.id+'.png')});console.log('ok',j.id);
 }
 if(errs.length)console.log('errori pagina:',errs.join('; '));
 await b.close();
})();
