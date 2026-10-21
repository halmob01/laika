// Converte markup SVG generato da un kit (stringa) nei layer del motore.
// Nessun DOM: un piccolo parser per markup ben formato, deterministico.
// Rifiuta ciò che non sa rappresentare invece di alterarlo in silenzio.

const DRAW=['g','rect','circle','ellipse','line','path','polygon','polyline','text'];
const NUM=['x','y','width','height','cx','cy','r','rx','ry','x1','x2','y1','y2','opacity','stroke-width','font-size','letter-spacing'];
const KEEP=[...NUM,'fill','stroke','d','text-anchor','font-family','font-weight','stroke-linecap','stroke-linejoin'];
const IGNORE=['xmlns','class'];
const SEMANTIC=/^[a-z][a-z0-9-]*$/;
const round=n=>Math.round(n*1000)/1000;
const tidyNumbers=s=>s.replace(/-?\d*\.?\d+(?:e-?\d+)?/gi,m=>String(round(Number(m))));

export function parseMarkup(markup){
  const root={tag:'#root',attrs:{},children:[]},stack=[root];
  const re=/<!--[\s\S]*?-->|<\/(\w+)\s*>|<(\w+)((?:\s+[\w:-]+\s*=\s*"[^"]*")*)\s*(\/?)>|([^<]+)/g;
  let m;
  while((m=re.exec(markup))){
    if(m[0].startsWith('<!--'))continue;
    if(m[1]){const open=stack.pop();if(!open||open.tag!==m[1])throw new Error('Markup non bilanciato: </'+m[1]+'>');continue;}
    if(m[2]){
      const attrs={};for(const a of m[3].matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g))attrs[a[1]]=a[2];
      const node={tag:m[2],attrs,children:[]};stack.at(-1).children.push(node);
      if(!m[4])stack.push(node);continue;
    }
    if(m[5]&&m[5].trim()){const t=stack.at(-1);t.children.push({tag:'#text',text:m[5].trim()});}
    else if(m[0].startsWith('<'))throw new Error('Markup non riconosciuto: '+m[0].slice(0,40));
  }
  if(stack.length!==1)throw new Error('Markup non chiuso: <'+stack.at(-1).tag+'>');
  return root;
}

// translate(a b) scale(s) rotate(a cx cy) → catena di pose elementari, dalla più esterna.
export function parseTransform(value){
  const ops=[];
  const rest=value.replace(/(translate|scale|rotate)\(([^)]*)\)/g,(all,op,args)=>{
    const n=args.trim().split(/[\s,]+/).map(Number);
    if(n.some(x=>!Number.isFinite(x)))throw new Error('Trasformazione non numerica: '+all);
    if(op==='translate')ops.push({pose:{translateX:round(n[0]),translateY:round(n[1]??0)}});
    else if(op==='scale'){if(n.length===2&&n[0]!==n[1])throw new Error('Scala non uniforme non supportata');ops.push({pose:{scale:round(n[0])}});}
    else if(n.length===3)ops.push({pose:{rotate:round(n[0])},origin:[round(n[1]),round(n[2])]});
    else ops.push({pose:{rotate:round(n[0])}});
    return '';
  });
  if(rest.trim())throw new Error('Trasformazione non supportata: '+value);
  return ops;
}

function pointsToPath(points,close){
  const n=points.trim().split(/[\s,]+/).map(Number);
  if(n.length<4||n.length%2||n.some(x=>!Number.isFinite(x)))throw new Error('Punti non validi');
  const pairs=[];for(let i=0;i<n.length;i+=2)pairs.push(round(n[i])+' '+round(n[i+1]));
  return 'M'+pairs.join(' L')+(close?' Z':'');
}

// colors: funzione che traduce un valore fill/stroke in token o lo rifiuta.
export function markupToLayers(markup,{prefix='forma',colors=v=>v,patterns={}}={}){
  const root=parseMarkup(markup),layers=[],used=new Set();let counter=0;
  const next=tag=>prefix+'-'+(++counter);
  function walk(node,parent){
    if(node.tag==='#text')throw new Error('Testo fuori da <text>');
    if(!DRAW.includes(node.tag))throw new Error('Elemento non supportato: '+node.tag);
    let host=parent;
    const {transform,...attrs}=node.attrs;
    for(const op of transform?parseTransform(transform):[]){
      const id=next('g');layers.push({id,tag:'g',pose:op.pose,...(op.origin?{origin:op.origin}:{}),...(host?{parent:host}:{})});host=id;
    }
    const tag=node.tag==='polygon'||node.tag==='polyline'?'path':node.tag;
    // Un id semantico del kit (es. "telo", "ruota-1") diventa una parte animabile; altrimenti numerazione.
    let id=next(tag);
    if(attrs.id!==undefined){if(!SEMANTIC.test(attrs.id)||used.has(attrs.id))throw new Error('ID di parte non valido o duplicato: '+attrs.id);id=attrs.id;}
    used.add(id);
    const layer={id,tag,attrs:{}};if(host)layer.parent=host;
    if(attrs['data-pivot']!==undefined){const o=attrs['data-pivot'].trim().split(/[\s,]+/).map(Number);if(o.length!==2||o.some(n=>!Number.isFinite(n)))throw new Error('data-pivot richiede "x y"');layer.origin=o.map(round);}
    for(const [k,v] of Object.entries(attrs)){
      if(IGNORE.includes(k)||k==='filter'||k==='id'||k==='data-pivot')continue;
      if(k==='points'){layer.attrs.d=pointsToPath(v,node.tag==='polygon');continue;}
      if(!KEEP.includes(k))throw new Error('Attributo non supportato: '+k+' su '+node.tag);
      if(NUM.includes(k)){const n=Number(v);if(!Number.isFinite(n))throw new Error('Numero non valido: '+k+'='+v);layer.attrs[k]=round(n);}
      else if(k==='d')layer.attrs.d=tidyNumbers(v.replace(/,/g,' ').replace(/\s+/g,' ').trim());
      else if(k==='fill'||k==='stroke'){
        const ref=v.match(/^url\(#([\w-]+)\)$/);
        if(ref){if(!patterns[ref[1]])throw new Error('Riferimento non supportato: '+v);layer.attrs[k]='pattern:'+patterns[ref[1]];}
        else layer.attrs[k]=colors(v);
      }
      else if(k==='font-family')layer.attrs[k]=/mono/.test(v)?'monospace':/serif/.test(v)&&!/sans/.test(v)?'serif':'sans-serif';
      else layer.attrs[k]=v;
    }
    if(tag==='text'){
      if(node.children.some(c=>c.tag!=='#text'))throw new Error('tspan non supportato: appiattire il testo');
      layer.text=node.children.map(c=>c.text).join(' ').replace(/&amp;/g,'&');
    }
    layers.push(layer);
    if(tag==='g')for(const c of node.children)walk(c,layer.id);
    else if(tag!=='text'&&node.children.length)throw new Error('Figli non ammessi dentro '+tag);
  }
  for(const c of root.children)walk(c,null);
  return layers;
}

// Ingombro approssimato (estremi dei punti di controllo), con trasformazioni applicate.
export function bounds(layers){
  const byId=new Map(layers.map(l=>[l.id,l]));
  const matrix=layer=>{
    let m=[1,0,0,1,0,0];
    const chain=[];for(let l=layer;l;l=byId.get(l.parent))chain.unshift(l);
    for(const l of chain){
      const p=l.pose||{},o=l.origin||[0,0],r=(p.rotate||0)*Math.PI/180,s=p.scale??1;
      const steps=[[1,0,0,1,p.translateX||0,p.translateY||0],[1,0,0,1,o[0],o[1]],[Math.cos(r),Math.sin(r),-Math.sin(r),Math.cos(r),0,0],[s,0,0,s,0,0],[1,0,0,1,-o[0],-o[1]]];
      for(const t of steps)m=[m[0]*t[0]+m[2]*t[1],m[1]*t[0]+m[3]*t[1],m[0]*t[2]+m[2]*t[3],m[1]*t[2]+m[3]*t[3],m[0]*t[4]+m[2]*t[5]+m[4],m[1]*t[4]+m[3]*t[5]+m[5]];
    }
    return m;
  };
  let box=[Infinity,Infinity,-Infinity,-Infinity];
  const add=(m,x,y,pad=0)=>{const X=m[0]*x+m[2]*y+m[4],Y=m[1]*x+m[3]*y+m[5];box=[Math.min(box[0],X-pad),Math.min(box[1],Y-pad),Math.max(box[2],X+pad),Math.max(box[3],Y+pad)];};
  for(const l of layers){
    if(l.tag==='g'||l.tag==='text'||l.tag==='pattern')continue;
    if(isInsidePattern(l,byId))continue;
    const m=matrix(l.parent?byId.get(l.parent):null),a=l.attrs||{},w=(a['stroke-width']||0)/2;
    if(l.tag==='rect'){add(m,a.x||0,a.y||0,w);add(m,(a.x||0)+a.width,(a.y||0)+a.height,w);add(m,(a.x||0)+a.width,a.y||0,w);add(m,a.x||0,(a.y||0)+a.height,w);}
    else if(l.tag==='circle'){add(m,a.cx-a.r,a.cy-a.r,w);add(m,a.cx+a.r,a.cy+a.r,w);}
    else if(l.tag==='ellipse'){add(m,a.cx-a.rx,a.cy-a.ry,w);add(m,a.cx+a.rx,a.cy+a.ry,w);}
    else if(l.tag==='line'){add(m,a.x1,a.y1,w);add(m,a.x2,a.y2,w);}
    else if(l.tag==='path'){
      const tokens=a.d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g);let cmd='',nums=[],x=0,y=0;
      const flush=()=>{
        if(cmd==='H'){for(const v of nums){x=v;add(m,x,y,w);}}
        else if(cmd==='V'){for(const v of nums){y=v;add(m,x,y,w);}}
        else if(cmd==='A'){for(let i=0;i+6<nums.length;i+=7){const r=Math.max(nums[i],nums[i+1]);add(m,x,y,w+r);x=nums[i+5];y=nums[i+6];add(m,x,y,w+r);}}
        else if(cmd&&cmd===cmd.toUpperCase()){for(let i=0;i+1<nums.length;i+=2){x=nums[i];y=nums[i+1];add(m,x,y,w);}}
        else if(cmd&&cmd!=='z')throw new Error('Comandi relativi non supportati nel calcolo ingombro');
      };
      for(const t of tokens){if(/[A-Za-z]/.test(t)){flush();cmd=t;nums=[];}else nums.push(Number(t));}flush();
    }
  }
  return box.map(round);
}
function isInsidePattern(layer,byId){for(let l=layer;l;l=byId.get(l.parent))if(l.tag==='pattern')return true;return false;}
