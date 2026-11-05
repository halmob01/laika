// Esegue solo tests/browser-i1.cjs (Atto I, desktop e telefono) con un proprio server su 4173 (spegnere prima un altro server su quella porta).
// Uso: node scripts/browser-i1-solo.cjs (circa 6 minuti).
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),artifacts=path.join(root,'.artifacts');fs.mkdirSync(artifacts,{recursive:true});
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname;const f=path.resolve(root,'.'+decodeURIComponent(p.endsWith('/')?p+'index.html':p));
 if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404).end();return;}
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};res.setHeader('Content-Type',(mime[path.extname(f)]||'text/plain')+'; charset=utf-8');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(4173,'127.0.0.1',r));const b=await chromium.launch({headless:true});
 try{await require(path.join(root,'tests','browser-i1.cjs'))(b,root,artifacts);console.log('I1 OK');}catch(e){console.log('ERR',e.message.split('\n').slice(0,6).join(' | '));process.exitCode=1;}finally{await b.close();server.close();}})();
