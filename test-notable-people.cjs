const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');let fail=false,stored='';const box={crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null,setItem:(k,v)=>{if(fail)throw Error('quota');stored=v;}},document:{getElementById:()=>({})}};vm.createContext(box);for(const f of ['religion-pack.js','religion-folders.js','religion-template.js','deity-pack.js','deity-template.js','deity-large-template.js','religion-domain-additions.js','religion-refresh-v1.js','worldbuilding-pack-v1.js','worldbuilding-facets-v1.js','worldbuilding-templates.js','settlement-update-v1.js','relationship-update-v1.js','notable-people-v34.js','default-content.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),box);const script=fs.readFileSync(__dirname+'/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInContext(script.split('// FEATURE_EVENTS_START')[0]+`notify=m=>globalThis.lastError=m;globalThis.api={installReligionPack,installReligionFolders,installReligionTemplate,installDeityTemplate,installDeityLargeTemplate,installReligionInputs,installDomainFlavor,installUpdatedDefaults,installWorldbuildingTemplates,installSettlementLocationUpdate,installRelationshipUpdate,installNotablePeople,runTemplate,parseTemplate,templateTables,parseDirectory,get:()=>state,set:s=>state=s};`,box);const a=box.api,clone=x=>JSON.parse(JSON.stringify(x));for(const n of ['installReligionPack','installReligionFolders','installReligionTemplate','installDeityTemplate','installDeityLargeTemplate','installReligionInputs','installDomainFlavor','installUpdatedDefaults'])a[n]();const fresh=clone(a.get()),sources=box.TABLE_FORGE_WORLDBUILDING_TEMPLATES;
a.installWorldbuildingTemplates();assert(a.installSettlementLocationUpdate(),box.lastError);assert(a.installRelationshipUpdate(),box.lastError);
const original=a.get(), root=original.tables.find(t=>t.name==='Community notable person');
const split=original.tables.filter(t=>/^Notable hook - .+ [12]$/.test(t.name));
assert.equal(split.length,40);
original.selected=split[0].id;
assert(a.installNotablePeople(),box.lastError);
const state=a.get(), pack=box.TABLE_FORGE_NOTABLE_PEOPLE;
assert.equal(state.tables.length,original.tables.length-20);
assert(!state.tables.some(t=>split.some(old=>old.id===t.id)));
assert.equal(state.tables.find(t=>t.id===state.selected).name,split[0].name.slice(0,-2));
const names=new Map(state.tables.map(t=>[t.id,t.name]));
for(const [name,rows] of Object.entries(pack)){
  const table=state.tables.find(t=>t.name===name);
  assert.deepEqual(clone(table.entries.map(e=>[e.text,e.weight,names.get(e.subtable)||'',e.input])),clone(rows));
}
for(let i=0;i<100;i++){
  const result=a.runTemplate({id:'probe',name:'Probe',source:'{{table: Community notable person}}',refs:{'Community notable person':root.id}});
  assert.equal(result.rollCount,3);
}
assert(!a.installNotablePeople());
console.log('Stage 34 role and hook contents, split table removal, selection redirect and 100 complete NPC chains verified.');
