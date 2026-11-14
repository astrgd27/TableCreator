// Node 20+ adapter. Keep API_TOKEN in the environment, never in a published file.
import http from 'node:http';
import {Readable} from 'node:stream';
import worker from './backend/worker.mjs';
if(!process.env.API_TOKEN){console.error('Set API_TOKEN before starting the API.');process.exit(1);}
const port=Number(process.env.PORT||8787);
http.createServer(async(req,res)=>{try{const request=new Request('http://localhost'+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});const response=await worker.fetch(request,{API_TOKEN:process.env.API_TOKEN});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch{res.writeHead(500);res.end('Internal error');}}).listen(port,process.env.HOST||'127.0.0.1',()=>console.log('Table Forge API listening on port '+port));
