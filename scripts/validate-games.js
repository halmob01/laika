import {fileURLToPath} from 'node:url';
import {readPacks} from './packs.js';
for(const {game} of readPacks(fileURLToPath(new URL('../',import.meta.url))))console.log('OK',game.id,game.acts.length+' atti',game.stages.length+' scenografie');
