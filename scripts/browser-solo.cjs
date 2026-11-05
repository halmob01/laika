// Esegue un solo modulo dei test di browser (per esempio browser-home, browser-i1, browser-p1) con un proprio server su 4173 (spegnere prima un altro server su quella porta).
// Uso: node scripts/browser-solo.cjs home   (esegue tests/browser-home.cjs; KIT_BROWSER=webkit per WebKit se installato)
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright');
const nome=process.argv[2];if(!nome){console.error('uso: node scripts/browser-solo.cjs <home|i1|p1|...>');process.exit(1);}
const root=path.resolve(__dirname,'..'),artifacts=path.join(root,'.artifacts');fs.mkdirSync(artifacts,{recursive:true});
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname;const f=path.resolve(root,'.'+decodeURIComponent(p.endsWith('/')?p+'index.html':p));
 if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404).end();return;}
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};res.setHeader('Content-Type',(mime[path.extname(f)]||'text/plain')+'; charset=utf-8');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(4173,'127.0.0.1',r));const b=await (process.env.KIT_BROWSER==='webkit'?webkit:chromium).launch({headless:true});
 try{await require(path.join(root,'tests','browser-'+nome+'.cjs'))(b,root,artifacts);console.log('OK',nome);}catch(e){console.log('ERR',e.message.split('\n').slice(0,8).join(' | '));process.exitCode=1;}finally{await b.close();server.close();}})();
