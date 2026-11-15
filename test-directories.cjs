const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
let fail=false,saved='';const box={crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null,setItem:(k,v)=>{if(fail)throw Error('quota');saved=v;}},document:{getElementById:()=>({})}};vm.createContext(box);
for(const f of ['religion-pack.js','religion-folders.js','religion-template.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),box);
vm.runInContext(script.split('// FEATURE_EVENTS_START')[0]+`notify=()=>{};globalThis.api={installReligionPack,installReligionFolders,installReligionTemplate,parseDirectory,runTemplate,directoryItems,tablePath,get:()=>state,set:s=>state=s};`,box);
const a=box.api;a.installReligionPack();a.installReligionTemplate();const original=JSON.parse(JSON.stringify(a.get()));
// Simulate the prior flat directory, including modified entries and saved references.
for(const t of a.get().tables.filter(t=>t.bundleKey))t.folder='default/religion';
const edited=a.get().tables.find(t=>t.bundleKey);edited.entries[0].text='My edited row';const stable=edited.id;
a.get().generators=[{id:'g',name:'Saved',mode:'single',batch:1,tables:[{id:stable,count:1}]}];
const refs=JSON.stringify(a.get().templates[0].refs),beforeEntries=JSON.stringify(a.get().tables.map(t=>t.entries));
assert(a.installReligionFolders());assert.equal(a.get().tables.find(t=>t.id===stable).entries[0].text,'My edited row');assert.equal(JSON.stringify(a.get().tables.map(t=>t.entries)),beforeEntries);assert.equal(a.get().generators[0].tables[0].id,stable);assert.equal(JSON.stringify(a.get().templates[0].refs),refs);assert(!a.installReligionFolders());
const folders=Object.values(box.TABLE_FORGE_RELIGION_FOLDERS);assert.equal(folders.length,322);assert.equal(new Set(folders.map(x=>x.folder)).size,31);assert(a.get().tables.filter(t=>t.bundleKey).every(t=>t.folder.startsWith('default/religion/')));assert(a.get().folders.includes('default/religion/Divinities and cosmology/Forms'));
assert(a.directoryItems('').folders.includes('default'));assert(!a.directoryItems('').tables.some(t=>t.bundleKey));assert(a.directoryItems('default').folders.includes('default/religion'));assert.equal(a.directoryItems('default/religion').tables.length,0);
assert(a.directoryItems('default/religion/Death and ancestors').tables.some(t=>t.name==='Afterlife doctrine'));assert(a.directoryItems('default/religion/Death and ancestors').folders.some(x=>x.endsWith('/Nuances and complications')));
assert(a.directoryItems('default/religion','afterlife').tables.length>=3);assert(!a.directoryItems('default/religion/Death and ancestors','divine').tables.length);assert(!a.directoryItems('default/religion','',stable).tables.some(t=>t.id===stable));
a.get().tables.push({id:'other',name:'Afterlife doctrine',folder:'My world',entries:[{text:'other',weight:1}]});const matches=a.directoryItems('','Afterlife doctrine').tables;assert(matches.some(t=>t.id==='other'));assert(new Set(matches.map(a.tablePath)).size>=2);
for(let i=0;i<12;i++){const r=a.runTemplate(a.get().templates[0]);assert(!/\[missing|\[circular|\{\{/.test(r.text));}
a.set(JSON.parse(JSON.stringify(original)));const before=a.get();fail=true;assert(!a.installReligionFolders());assert.equal(a.get(),before);fail=false;
a.set(a.parseDirectory(JSON.stringify(original)));assert(!a.installReligionFolders());
console.log('PASS: 322 tables organized in 31 paths; folder boundaries, nested search, duplicate names, stable links and edited rows, template generation, migration rollback and import authority.');
