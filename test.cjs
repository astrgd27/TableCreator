const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
const sandbox={crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null},document:{getElementById:()=>({})},console};
vm.createContext(sandbox);
vm.runInContext(script.split("$('tableList').onclick")[0]+`
globalThis.api={starter,validate,importData,csvParse,dice,rollTable,setState:s=>state=s,getState:()=>state};`,sandbox);
const a=sandbox.api;
assert.equal(a.validate(a.starter()).tables.length,3);
assert.throws(()=>a.validate({version:1,tables:[{id:'x',name:'X',entries:[{text:'Bad',weight:0}]}]}));
assert.deepEqual(JSON.parse(JSON.stringify(a.csvParse('text,weight,subtable\r\n"Hello, \'world\'\nagain",2,""'))),[['text','weight','subtable'],["Hello, 'world'\nagain",'2','']]);
for(let i=0;i<100;i++){const n=+a.dice('[[2d6+3]]');assert(n>=5&&n<=15);}
a.setState({version:1,tables:[{id:'a',name:'A',entries:[{text:'parent',weight:1,subtable:'b'}]},{id:'b',name:'B',entries:[{text:'child',weight:1,subtable:'a'}]}],linked:[],selected:'a'});
assert.match(a.rollTable('a'),/parent → child → \[circular link stopped: A\]/);
const backup=JSON.stringify(a.getState());a.importData(backup,'json');const s=a.getState();assert.equal(s.tables.length,4);assert.notEqual(s.tables[2].id,'a');assert.equal(s.tables[2].entries[0].subtable,s.tables[3].id);a.validate(s);
assert.throws(()=>a.importData('text,weight\nInvalid,-2','csv'));assert.equal(s.tables.length,4);
a.importData('text,weight\n"Quoted, result",3','csv','CSV test');assert.equal(a.getState().tables[4].entries[0].text,'Quoted, result');assert.equal(a.getState().tables[4].entries[0].weight,3);
a.importData('Alpha\n\nBeta','text','Text test');assert.equal(a.getState().tables[5].entries.length,2);
assert.equal(a.rollTable('missing'),'[missing table]');
console.log('PASS: syntax, backup validation/remapping, nested/circular rolls, dice bounds, CSV parsing and import, text import, invalid import atomicity.');

// Saved generators, references, and selective rerolls.
{
 const box={crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null},document:{getElementById:()=>({})}};
 vm.createContext(box);
 vm.runInContext(script.split("$('editView').onclick")[0]+`globalThis.api={validate,importData,rollTable,bindRefs,rerollPart,setState:s=>state=s};`,box);
 const f=box.api;
 const data={version:1,tables:[{id:'a',name:'Scene',entries:[{text:'A [Creature] guards [Treasure].',weight:1}]},{id:'b',name:'Creature',entries:[{text:'wyrm',weight:1}]},{id:'c',name:'Treasure',entries:[{text:'gold',weight:1}]}],generators:[{id:'g',name:'Scene maker',mode:'linked',batch:2,tables:[{id:'a',count:1},{id:'c',count:3}]}]};
 f.setState(data);f.bindRefs(data.tables[0].entries[0]);
 assert.equal(f.rollTable('a'),'A wyrm guards gold.');data.tables[1].name='Renamed';assert.equal(f.rollTable('a'),'A wyrm guards gold.');
 const part={tableId:'c',text:'keep',locked:true};f.rerollPart(part);assert.equal(part.text,'keep');part.locked=false;f.rerollPart(part);assert.equal(part.text,'gold');
 f.importData(JSON.stringify(data),'json');assert.equal(data.generators.length,2);assert.equal(data.generators[1].tables[0].id,data.tables[3].id);assert.equal(data.tables[3].entries[0].refs.Creature,data.tables[4].id);assert.equal(f.rollTable(data.tables[3].id),'A wyrm guards gold.');f.validate(data);
 data.tables[1].entries=[{text:'[Scene]',weight:1,refs:{Scene:'a'}}];assert.match(f.rollTable('a'),/circular link stopped/);
 assert.throws(()=>f.validate({...data,generators:[{id:'bad',name:'Bad',mode:'linked',batch:1,tables:[{id:'missing',count:1}]}]}));
 console.log('PASS: saved generator and reference backup remapping, rename stability, inline cycles, locked/unlocked rerolls, invalid presets.');
}
