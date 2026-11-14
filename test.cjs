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
