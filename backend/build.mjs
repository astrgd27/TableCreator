import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync(new URL('./dist/server/',import.meta.url),{recursive:true});
const engine=readFileSync(new URL('./engine.mjs',import.meta.url),'utf8').replace('export function createEngine','function createEngine');
const worker=readFileSync(new URL('./worker.mjs',import.meta.url),'utf8').replace("import {createEngine} from './engine.mjs';",'');
writeFileSync(new URL('./dist/server/index.js',import.meta.url),engine+'\n'+worker);
