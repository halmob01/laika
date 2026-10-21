import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const graphics=JSON.parse(fs.readFileSync(new URL('../prototypes/laika-studi-originali/manifest.json',import.meta.url)));
const sources=JSON.parse(fs.readFileSync(new URL('../references/fonti/manifest.json',import.meta.url)));
const atlas=sources.files.find(f=>f.original_name==='LAIKA_ATLANTE_ANEDDOTI_E_FRASI_COMPLETO.md');
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url));

test('LAIKA: originali identici ai blob forniti dall’utente nella PR12',()=>{
  assert.ok(atlas);assert.equal(graphics.files.length,3);
  for(const file of [...graphics.files,atlas]){
    const bytes=read(file.path);
    assert.equal(bytes.length,file.bytes,file.path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,file.path);
    const blob=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
    assert.equal(blob,file.git_blob_sha,file.path);
    assert.equal(file.origin.commit,'2ce2cb13db8f859986490b2139ec430bec71237e');
    assert.equal(file.origin.pull_request,12);
    assert.equal(fs.existsSync(new URL('../'+file.origin.path,import.meta.url)),false,'Il vecchio percorso non deve conservare copie divergenti');
  }
});

test('LAIKA: tutte le 157 voci dell’atlante sono localizzabili nell’originale',()=>{
  const index=JSON.parse(read('references/fonti/atlanti/index.json'));
  assert.equal(index.source,atlas.path);
  assert.equal(index.source_git_blob_sha,atlas.git_blob_sha);
  assert.equal(index.source_sha256,atlas.sha256);
  const lines=read(atlas.path).toString('utf8').split('\n');
  const actual=[];
  lines.forEach((line,i)=>{
    const m=line.match(/^### ([CR]\d{2}) — (.*)$/)||line.match(/^\*\*(F\d{2}) — (.*)\*\*\s*$/);
    if(m)actual.push({id:m[1],title:m[2],line:i+1});
  });
  assert.deepEqual(index.entries.map(({id,title,line})=>({id,title,line})),actual);
  assert.equal(new Set(actual.map(x=>x.id)).size,157);
  for(const [prefix,count] of [['C',44],['R',96],['F',17]]){
    const expected=Array.from({length:count},(_,i)=>prefix+String(i+1).padStart(2,'0'));
    assert.deepEqual(actual.filter(x=>x.id.startsWith(prefix)).map(x=>x.id).sort(),expected);
  }
});
