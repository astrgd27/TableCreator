const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const script=fs.readFileSync(__dirname+'/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];let fail=false;
const box={crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null,setItem:()=>{if(fail)throw Error('quota');}},document:{getElementById:()=>({})}};vm.createContext(box);
for(const f of ['religion-pack.js','religion-folders.js','religion-template.js','deity-pack.js','deity-template.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),box);
vm.runInContext(script.split('// FEATURE_EVENTS_START')[0]+`notify=()=>{};globalThis.api={installReligionPack,installReligionFolders,installReligionTemplate,installDeityTemplate,runTemplate,parseTemplate,templateTables,parseDirectory,get:()=>state,set:s=>state=s};`,box);
const a=box.api;a.installReligionPack();a.installReligionFolders();a.installReligionTemplate();const before=JSON.parse(JSON.stringify(a.get()));const religionSource=a.get().templates[0].source;
assert(a.installDeityTemplate());assert(!a.installDeityTemplate());assert.equal(a.get().templates.length,2);assert.equal(a.get().tables.length,before.tables.length+1);assert.equal(a.get().templates[0].source,religionSource);
const t=a.get().templates.find(t=>t.bundleKey==='deity-dossier');assert.equal(t.name,'Fantasy deity - full dossier');
const direct=new Set(a.templateTables(a.parseTemplate(t.source)));const visited=new Set(),queue=[...direct].map(n=>a.get().tables.find(table=>table.id===t.refs[n]));
while(queue.length){const table=queue.pop();assert(table);if(visited.has(table.id))continue;visited.add(table.id);for(const e of table.entries)if(e.subtable)queue.push(a.get().tables.find(t=>t.id===e.subtable));}
for(const table of a.get().tables.filter(t=>t.bundleKey&&t.bundleKey.startsWith('religion-')))assert(visited.has(table.id),'Unreachable: '+table.name);
const portfolio=a.get().tables.find(t=>t.name==='Deity domains');assert.equal(portfolio.entries.length,201);assert(portfolio.entries.every(e=>!e.text.includes(',')&&e.weight>=1&&e.weight<=6));
let total=0,lo=Infinity,hi=0,sections=0;for(let i=0;i<400;i++){const r=a.runTemplate(t);assert(!/\{\{|\[missing|\[circular/.test(r.text));assert(r.text.includes('DEITY PROFILE'));const words=r.text.split(/\s+/).length;total+=words;lo=Math.min(lo,words);hi=Math.max(hi,words);sections+=(r.text.match(/\n[A-Z][A-Z ’]+\n/g)||[]).length-1;const ds=r.variables.domains.split(', ');assert(ds.length<=5);assert.equal(new Set(ds).size,ds.length);assert.equal(r.rolls.filter(x=>x.name==='Deity domains').length,ds.length);}
assert(total/400<700,'Deity narratives should stay short');
vm.runInContext('randomInt=n=>n-1',box);const minimal=a.runTemplate(t);assert(!minimal.text.includes('FOLLOWERS'));assert(minimal.text.split(/\s+/).length<350);
const installed=JSON.parse(JSON.stringify(a.get()));a.set(JSON.parse(JSON.stringify(before)));fail=true;const rollback=a.get();assert(!a.installDeityTemplate());assert.equal(a.get(),rollback);fail=false;
a.set(a.parseDirectory(JSON.stringify(before)));assert(!a.installDeityTemplate());
a.set(JSON.parse(JSON.stringify(before)));a.get().tables=a.get().tables.filter(t=>t.name!=='Divine origin');const missing=a.get();assert(!a.installDeityTemplate());assert.equal(a.get(),missing);
console.log(`PASS: deity template plus 2 new tables; all 322 religion tables reachable; single-domain rows and 1–5 unique draws; 400 outputs, ${Math.round(total/400)} mean words (${lo}–${hi}), ${(sections/400).toFixed(1)} mean cult sections; atomic installation and import authority.`);

// The nested gates produce exactly 1..5 domains; deterministic draws can pair any rows.
a.set(installed);const prefix=t.source.split('{{roll appearance')[0]+'{{domains}}';
for(let count=1;count<=5;count++){box.pass=count-1;vm.runInContext('randomInt=n=>n===1000000?(pass-->0?0:999999):0',box);const r=a.runTemplate({...t,source:prefix});assert.equal(r.variables.domains.split(', ').length,count);}
vm.runInContext('randomInt=()=>0',box);const five=a.runTemplate({...t,source:prefix});assert.equal(five.variables.domains,'Solar, Lunar, Sky, Earth, Sea');
const small={source:'{{draw x = Deity domains}}{{repeat 201}}{{draw x = Deity domains}}{{end}}',refs:t.refs};assert.throws(()=>a.runTemplate(small),/No unused entries/);
// Existing IDs and saved generator links survive replacing the precombined portfolio.
a.get().defaultDeityVersion=1;const oldTable=a.get().tables.find(x=>x.name==='Deity domains'),oldId=oldTable.id,templateId=a.get().templates.find(x=>x.bundleKey==='deity-dossier').id;oldTable.name='Deity portfolio';oldTable.entries=[{text:'Dawn, Memory',weight:9,subtable:''}];assert(a.installDeityTemplate());assert.equal(a.get().tables.find(x=>x.name==='Deity domains').id,oldId);assert.equal(a.get().templates.find(x=>x.bundleKey==='deity-dossier').id,templateId);assert.equal(a.get().defaultDeityVersion,2);
console.log('PASS: all five domain counts, previously unavailable combinations, exhaustion, and v1 migration retaining table/template IDs.');
