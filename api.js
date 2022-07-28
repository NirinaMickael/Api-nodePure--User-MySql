const http = require('http');
const {config}= require('./config');
const Url = require('url');
const {route} = require('./route');
const server = http.createServer((req,res)=>{
    const {url,method,header} = req;
    const {query,pathname} = Url.parse(url,true);
    const path = pathname.split('/');
    route(req,res,path[1],method);
}).listen(config.PORT_SERVER,()=>{
    console.log('The server is running')
})
