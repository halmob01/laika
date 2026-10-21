import fs from 'node:fs';
import path from 'node:path';
import {validateRegistry} from '../src/shell/registry.js';
import {validatePack} from '../src/validation/game-pack.js';
export function readPacks(root) {
  const config=validateRegistry(JSON.parse(fs.readFileSync(path.join(root,'config.json')))),ids=new Set();
  if(!config.games?.some(g=>g.id===config.defaultGame))throw new Error('Gioco iniziale non configurato');
  return config.games.map(item=>{
    if(ids.has(item.id))throw new Error('Gioco duplicato: '+item.id);ids.add(item.id);
    const file=path.resolve(root,item.manifest);
    if(!file.startsWith(path.resolve(root)+path.sep))throw new Error('Manifest esterno al progetto: '+item.manifest);
    try {
      const game=validatePack(JSON.parse(fs.readFileSync(file)));
      if(game.id!==item.id)throw new Error('ID manifest e configurazione differenti');
      return {item,game};
    }catch(error){throw new Error(item.manifest+': '+error.message);}
  });
}
