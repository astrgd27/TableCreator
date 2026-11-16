const fs=require('node:fs');
const source=fs.readFileSync(__dirname+'/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function section(a,b){return source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));}
function line(name){const start=source.indexOf('function '+name+'(');if(start<0)throw Error(name);return source.slice(start,source.indexOf('\n',start));}
const core=[section('// TEMPLATE_CORE_START','// TEMPLATE_CORE_END'),section('function validate(raw)','let state,storageError'),...['validateSetup','chooseWeighted','randomInt','dice','eligible','recordChoice','rollTable','runSetup'].map(line),source.split('\n').find(x=>x.startsWith('const refPattern='))].join('\n');
const out=`// Generated from index.html by build-engine.cjs. Do not edit by hand.
export function createEngine(directory){
let state=structuredClone(directory),decks=new Map();
const uid=()=>crypto.randomUUID();
${core}
validate(state);
return {
 catalog(){return {tables:state.tables.map(t=>({id:t.id,name:t.name,folder:t.folder||'',entries:t.entries.length})),generators:(state.generators||[]).map(g=>({id:g.id,name:g.name,mode:g.mode})),templates:(state.templates||[]).map(t=>({id:t.id,name:t.name,folder:t.folder||''}))};},
 generate(request){if(!request||typeof request.id!=='string')throw Error('Provide a request type and id.');if(request.type==='template'){const t=state.templates?.find(t=>t.id===request.id);if(!t)throw Error('Template not found.');return runTemplate(t);}if(request.type==='generator'){const g=state.generators?.find(g=>g.id===request.id);if(!g)throw Error('Generator not found.');return {results:runSetup({...g,batch:request.batch??g.batch,inputs:request.inputs??g.inputs})};}if(request.type==='table'){if(!state.tables.some(t=>t.id===request.id))throw Error('Table not found.');return {results:runSetup({mode:'single',tables:[{id:request.id,count:1}],batch:request.batch??1,drawPolicy:'repeat',inputs:request.inputs})};}throw Error('Type must be table, generator, or template.');}
};
}
`;
if(process.argv.includes('--check')){if(fs.readFileSync(__dirname+'/engine.mjs','utf8')!==out)throw Error('Run node build-engine.cjs to refresh engine.mjs');}else fs.writeFileSync(__dirname+'/engine.mjs',out);
