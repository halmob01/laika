import fs from 'node:fs';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {id} from '../src/core/schema.js';
import {validatePack} from '../src/validation/game-pack.js';
export function createGame(root,name,title=name) {
  if(!id(name))throw new Error('Usa un ID minuscolo: lettere, numeri, trattini.');
  const configPath=path.join(root,'config.json'),config=JSON.parse(fs.readFileSync(configPath));
  const folder=path.join(root,'games',name);
  if(config.games.some(g=>g.id===name)||fs.existsSync(folder))throw new Error('Gioco già esistente: '+name);
  const game=JSON.parse(fs.readFileSync(new URL('../templates/minimal/game.json',import.meta.url)));
  game.id=name;game.title=title;validatePack(game);
  const next={...config,games:[...config.games,{id:name,label:title,manifest:'./games/'+name+'/game.json'}]};
  const temporary=configPath+'.'+randomUUID()+'.tmp';
  fs.mkdirSync(folder,{recursive:true});
  try {
    fs.writeFileSync(path.join(folder,'game.json'),JSON.stringify(game,null,2)+'\n',{flag:'wx'});
    fs.writeFileSync(temporary,JSON.stringify(next,null,2)+'\n',{flag:'wx'});
    fs.renameSync(temporary,configPath);
  } catch(error) {fs.rmSync(temporary,{force:true});fs.rmSync(folder,{recursive:true,force:true});throw error;}
  return folder;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {console.log('Creato:',createGame(fileURLToPath(new URL('../',import.meta.url)),process.argv[2],process.argv[3]));}
  catch(error){console.error(error.message+'\nUso: npm run create:game -- nome-gioco "Titolo"');process.exitCode=1;}
}
